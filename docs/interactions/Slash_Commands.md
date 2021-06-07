# Slash Commands

Slash Commands are the new, exciting way to build and interact with apps on Discord.

With Slash Commands, all you have to do is type `/` and you're ready to use your favorite bot. Users can learn everything your bot does and easily find new features as you add them. Validation, error states, and helpful UI walks them through your commands, meaning they can get it right the first time, especially on mobile. You now have one more ally in the fight against your phone's autocorrect.

Slash Commands set your users up for success instead of confusion and frustration. They separate how users think and how your code works, meaning no matter how complex your codebase and commands may get, people who love your bot will find it approachable and easy to use.

Let's get started!

## A Quick Note on Limits

In this documentation you'll find some notes about limits and caps on certain parts of Slash Commands. At a high level, they are as follows:

- An app can have up to 100 top-level global commands with unique names
- An app can have up to an additional 100 guild commands per guild
- An app can have up to 25 subcommand groups on a top-level command
- An app can have up to 25 subcommands within a subcommand group
- commands can have up to 25 `options`
- options can have up to 25 `choices`
- Maximum of 4000 characters for combined name, description, and value properties for each command and its subcommands and groups
- Limitations on [command names](#DOCS_INTERACTIONS_SLASH_COMMANDS/registering-a-command)
- Limitations on [nesting subcommands and groups](#DOCS_INTERACTIONS_SLASH_COMMANDS/nested-subcommands-and-groups)
- Global rate limit of 200 application command creates per day per guild

## What is a Slash Command

A **Slash Command** is a command that you register for your application. They're made up of a name, description, and a block of `options`, which you can think of like arguments to a function. The name and description help users find your command among many others, and the `options` validate user input as they fill out your command.

Your global commands are available in every guild that adds your application. You can also make commands for a specific guild; they're only available in that guild.

An **[Interaction](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-interaction-structure)** is the message that your application receives when a user uses a command. It includes the values that the user submitted, as well as some metadata about this particular instance of the command being used: the `guild_id`, `channel_id`, `member` and other fields. You can find all the values in our [data models](#DOCS_INTERACTIONS_SLASH_COMMANDS/data-models-and-types).

## Slash Commands, Interactions, and Bot Users

We're all used to the way that Discord bots have worked for a long time. You make an application in the Dev Portal, you add a bot user to it, and you copy the token. That token can be used to connect to the gateway and to make requests against our API.

Slash Commands and Interactions bring something entirely new to the table: the ability to interact with an application _without needing a bot user in the guild_. As you read through this documentation, you'll see that bot tokens are only referenced as a helpful alternative to doing a client credentials auth flow. Slash Commands do not depend on a bot user in the guild; responding to interactions does not require a bot token.

In many cases, you may still need a bot user. If you need to receive gateway events, or need to interact with other parts of our API (like fetching a guild, or a channel, or updating permissions on a user), those actions are all still tied to having a bot token. However, if you don't need any of those things, you never have to add a bot user to your application at all.

Welcome to the new world.

## Authorizing Your Application

There is a new special OAuth2 scope for applications called `applications.commands`.

> danger
> **In order to make Slash Commands work within a guild, the guild must authorize your application with the `applications.commands` scope. The `bot` scope is not enough.**

When requesting this scope, we "shortcut" the OAuth2 flow similar to adding a bot. You don't need to complete the flow, exchange for a token, or any of that.

If your application does not require a bot user within the guild for its commands to work, **you no longer need to add for the bot scope or specific permissions**. To clarify this point even more:

> info
> If your application only talks to Discord through creating Slash Commands and responding to Interactions, and does not use any other part of our API, **you no longer need to request the bot scope**.

Who knows, maybe in the future, Interactions tokens will become even smarter.

## Registering a Command

> info
> Slash Commands can only be registered via HTTP endpoint.

There are two kinds of Slash Commands: global commands and guild commands. Global commands are available for every guild that adds your app. An individual app's global commands are also available in DMs if that app has a bot that shares a mutual guild with the user.

Guild commands are specific to the guild you specify when making them. Guild commands are not available in DMs. Command names are unique per application within each scope (global and guild). That means:

- Your app **cannot** have two global commands with the same name
- Your app **cannot** have two guild commands within the same name **on the same guild**
- Your app **can** have a global and guild command with the same name
- Multiple apps **can** have commands with the same names

> info
> Apps can have a maximum of 100 global commands, and an additional 100 guild-specific commands per guild

**Command names must be lower-case** and match the regular expression `^[\w-]{1,32}$`. Commands (including sub-commands) with upper- or mixed- case names will be rejected by the API with a HTTP 400 (Bad Request) response.

To make a **global** Slash Command, make an HTTP POST call like this:

```py
import requests


url = "https://discord.com/api/v8/applications/<my_application_id>/commands"

json = {
    "name": "blep",
    "description": "Send a random adorable animal photo",
    "options": [
        {
            "name": "animal",
            "description": "The type of animal",
            "type": 3,
            "required": True,
            "choices": [
                {
                    "name": "Dog",
                    "value": "animal_dog"
                },
                {
                    "name": "Cat",
                    "value": "animal_cat"
                },
                {
                    "name": "Penguin",
                    "value": "animal_penguin"
                }
            ]
        },
        {
            "name": "only_smol",
            "description": "Whether to show only baby animals",
            "type": 5,
            "required": False
        }
    ]
}

# For authorization, you can use either your bot token
headers = {
    "Authorization": "Bot 123456"
}

# or a client credentials token for your app with the applications.commands.update scope
headers = {
    "Authorization": "Bearer abcdefg"
}

r = requests.post(url, headers=headers, json=json)
```

This command will be available on _all_ your app's guilds.

> warn
> Global commands are cached for **1 hour**. That means that new global commands will fan out slowly across all guilds, and will be guaranteed to be updated in an hour.

To make a **guild** Slash Command, make a similar HTTP POST call, but scope it to a specific `guild_id`:

```py
import requests


url = "https://discord.com/api/v8/applications/<my_application_id>/guilds/<guild_id>/commands"

json = # ...
```

This command will only be available within the guild that you specified.

> warn
> Guild commands update **instantly**. We recommend you use guild commands for quick testing, and global commands when they're ready for public use.

## Updating and Deleting a Command

Slash Commands can be deleted and updated by making `DELETE` and `PATCH` calls to the command endpoint. Those endpoints are

- `applications/<my_application_id>/commands/<command_id>` for global commands, or
- `applications/<my_application_id>/guilds/<guild_id>/commands/<command_id>` for guild commands

Because Slash Commands have unique names within a scope, we treat `POST` requests for new commands as upserts. That means **making a new command with an already-used name for your application will update the existing command**.

Full documentation of endpoints can be found in [Endpoints](#DOCS_INTERACTIONS_SLASH_COMMANDS/endpoints).

## Receiving an Interaction

When a user uses a Slash Command, your app will receive an **[Interaction](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-interaction-structure)**. Your app can receive an interaction in one of two ways:

- Via [Interaction Create](#DOCS_TOPICS_GATEWAY/interaction-create) gateway event
- Via outgoing webhook

These two methods are **mutually exclusive**; you can _only_ receive Interactions one of the two ways. The `INTERACTION_CREATE` [Gateway Event](#DOCS_TOPICS_GATEWAY/interaction-create) may be handled by connected clients, while the webhook method detailed below does not require a connected client.

In your application in the Developer Portal, there is a field on the main page called "Interactions Endpoint URL". If you want to receive Interactions via outgoing webhook, you can set your URL in this field. In order for the URL to be valid, you must be prepared for two things ahead of time:

> info
> These steps are only necessary for webhook-based Interactions. It is not required for receiving them over the gateway.

1. Your endpoint must be prepared to ACK a `PING` message
2. Your endpoint must be set up to properly handle signature headers--more on that in [Security and Authorization](#DOCS_INTERACTIONS_SLASH_COMMANDS/security-and-authorization)

If either of these are not complete, we will not validate your URL and it will fail to save.

When you attempt to save a URL, we will send a `POST` request to that URL with a `PING` payload. The `PING` payload has a `type: 1`. So, to properly ACK the payload, return a `200` response with a payload of `type: 1`:

```py
@app.route('/', methods=['POST'])
def my_command():
    if request.json["type"] == 1:
        return jsonify({
            "type": 1
        })
```

You'll also need to properly set up [Security and Authorization](#DOCS_INTERACTIONS_SLASH_COMMANDS/security-and-authorization) on your endpoint for the URL to be accepted. Once both of those are complete and your URL has been saved, you can start receiving Interactions via webhook! At this point, your app will **no longer receive Interactions over the gateway**. If you want to receive them over the gateway again, simply delete your URL.

An [Interaction](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-interaction-structure) includes the `data` that the user sent in the command, as well as some metadata. It looks like this:

```js
{
    "type": 2,
    "token": "A_UNIQUE_TOKEN",
    "member": {
        "user": {
            "id": 53908232506183680,
            "username": "Mason",
            "avatar": "a_d5efa99b3eeaa7dd43acca82f5692432",
            "discriminator": "1337",
            "public_flags": 131141
        },
        "roles": ["539082325061836999"],
        "premium_since": null,
        "permissions": "2147483647",
        "pending": false,
        "nick": null,
        "mute": false,
        "joined_at": "2017-03-13T19:19:14.040000+00:00",
        "is_pending": false,
        "deaf": false
    },
    "id": "786008729715212338",
    "guild_id": "290926798626357999",
    "data": {
        "options": [{
            "name": "cardname",
            "value": "The Gitrog Monster"
        }],
        "name": "cardsearch",
        "id": "771825006014889984"
    },
    "channel_id": "645027906669510667"
}
```

An explanation of all the fields can be found in our [data models](#DOCS_INTERACTIONS_SLASH_COMMANDS/data-models-and-types).

Now that you've gotten the data from the user, it's time to respond to them.

## Responding to an Interaction

Interactions--both receiving and responding--are webhooks under the hood. So responding to an Interaction is just like sending a webhook request!

> warn
> While interaction responses and followups are webhooks, they respect @everyone's ability to ping @everyone / @here . Nonetheless if your application responds with user data, you should still use [`allowed_mentions`](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object) to filter which mentions in the content actually ping. Other differences include the ability to send named links in the message content (`[text](url)`) and the ability to include up to 10 embeds.

When responding to an interaction received **via webhook**, your server can simply respond to the received `POST` request. You'll want to respond with a `200` status code (if everything went well), as well as specifying a `type` and `data`, which is an [Interaction Response](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-response-object-interaction-response-structure) object:

```py
@app.route('/', methods=['POST'])
def my_command():
    if request.json["type"] == 1:
        return jsonify({
            "type": 1
        })

    else:
        return jsonify({
            "type": 4,
            "data": {
                "tts": False,
                "content": "Congrats on sending your command!",
                "embeds": [],
                "allowed_mentions": { "parse": [] }
            }
        })
```

If you are receiving Interactions over the gateway, you will **also need to respond via HTTP**. Responses to Interactions **are not sent as commands over the gateway**.

To respond to a gateway Interaction, make a `POST` request like this. `interaction_id` is the unique id of that individual Interaction from the received payload. `interaction_token` is the unique token for that interaction from the received payload. **This endpoint is only valid for Interactions received over the gateway. Otherwise, respond to the `POST` request to issue an initial response.**

```py
url = "https://discord.com/api/v8/interactions/<interaction_id>/<interaction_token>/callback"

json = {
    "type": 4,
    "data": {
        "content": "Congrats on sending your command!"
    }
}
r = requests.post(url, json=json)
```

> info
> Interaction `tokens` are valid for **15 minutes** and can be used to send followup messages but you **must send an initial response within 3 seconds of receiving the event**.  If the 3 second deadline is exceeded, the token will be invalidated.

## Followup Messages

Sometimes, your bot will want to send followup messages to a user after responding to an interaction. Or, you may want to edit your original response. Whether you receive Interactions over the gateway or by outgoing webhook, you can use the following endpoints to edit your initial response or send followup messages:

- `PATCH /webhooks/<application_id>/<interaction_token>/messages/@original` to edit your initial response to an Interaction
- `DELETE /webhooks/<application_id>/<interaction_token>/messages/@original` to delete your initial response to an Interaction
- `POST /webhooks/<application_id>/<interaction_token>` to send a new followup message
- `PATCH /webhooks/<application_id>/<interaction_token>/messages/<message_id>` to edit a message sent with that `token`

> info
> Interactions webhooks share the same rate limit properties as normal webhooks

Interaction tokens are valid for **15 minutes**, meaning you can respond and update to a Slash Command within that amount of time.

## Security and Authorization

> info
> Check out our [Community Resources](#DOCS_TOPICS_COMMUNITY_RESOURCES/interactions) for libraries to help you with security in your language of choice

The internet is a scary place, especially for people hosting open, unauthenticated endpoints. If you are receiving Interactions via outgoing webhook, there are some security steps you **must** take before your app is eligible to receive requests.

Every Interaction is sent with the following headers:

- `X-Signature-Ed25519` as a signature
- `X-Signature-Timestamp` as a timestamp

Using your favorite security library, you **must validate the request each time you receive an [interaction](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-interaction-structure)**. If the signature fails validation, respond with a `401` error code. Here's a couple code examples:

```js
const nacl = require('tweetnacl');

// Your public key can be found on your application in the Developer Portal
const PUBLIC_KEY = 'APPLICATION_PUBLIC_KEY';

const signature = req.get('X-Signature-Ed25519');
const timestamp = req.get('X-Signature-Timestamp');
const body = req.rawBody; // rawBody is expected to be a string, not raw bytes

const isVerified = nacl.sign.detached.verify(
  Buffer.from(timestamp + body),
  Buffer.from(signature, 'hex'),
  Buffer.from(PUBLIC_KEY, 'hex')
);

if (!isVerified) {
  return res.status(401).end('invalid request signature');
}
 ```

```py
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError

# Your public key can be found on your application in the Developer Portal
PUBLIC_KEY = 'APPLICATION_PUBLIC_KEY'

verify_key = VerifyKey(bytes.fromhex(PUBLIC_KEY))

signature = request.headers["X-Signature-Ed25519"]
timestamp = request.headers["X-Signature-Timestamp"]
body = request.data

try:
    verify_key.verify(f'{timestamp}{body}'.encode(), bytes.fromhex(signature))
except BadSignatureError:
    abort(401, 'invalid request signature')
```

If you are not properly validating this signature header, we will not allow you to save your interactions URL in the Dev Portal. We will also do automated, routine security checks against your endpoint, including purposefully sending you invalid signatures. If you fail the validation, we will remove your interactions URL in the future and alert you via email and System DM.

We highly recommend checking out our [Community Resources](#DOCS_TOPICS_COMMUNITY_RESOURCES/interactions) and the two libraries found there. They not only provide typing for Interactions data models, but also include decorators for API frameworks like Flask and Express to make validation easy.

## Subcommands and Subcommand Groups

> warn
> Currently, subcommands and subcommand groups all appear at the top level in the command explorer. This may change in the future to include them as nested autocomplete options.

For those developers looking to make more organized and complex groups of commands, look no further than subcommands and groups.

**Subcommands** organize your commands by **specifying actions within a command or group**.

**Subcommand Groups** organize your **subcommands** by **grouping subcommands by similar action or resource within a command**.

These are not enforced rules. You are free to use subcommands and groups however you'd like; it's just how we think about them.

> danger
> Using subcommands or subcommand groups will make your base command unusable. You can't send the base `/permissions` command as a valid command if you also have `/permissions add | remove` as subcommands or subcommand groups

### Nested Subcommands and Groups

A quick note on nested subcommands and groups. We support nesting one level deep within a group, meaning your top level command can contain subcommand groups, and those groups can contain subcommands. **That is the only kind of nesting supported.** Here's some visual examples:

```
VALID

command
|
|__ subcommand
|
|__ subcommand

----

command
|
|__ subcommand-group
    |
    |__ subcommand
|
|__ subcommand-group
    |
    |__ subcommand


-------

INVALID


command
|
|__ subcommand-group
    |
    |__ subcommand-group
|
|__ subcommand-group
    |
    |__ subcommand-group

----

INVALID

command
|
|__ subcommand
    |
    |__ subcommand-group
|
|__ subcommand
    |
    |__ subcommand-group
```

### Example Walkthrough

Let's look at an example. Let's imagine you run a moderation bot. You want to make a `/permissions` command that can do the following:

- Get the guild permissions for a user or a role
- Get the permissions for a user or a role on a specific channel
- Change the guild permissions for a user or a role
- Change the permissions for a user or a role on a specific channel

We'll start by defining the top-level information for `/permissions`:

```js
{
    "name": "permissions",
    "description": "Get or edit permissions for a user or a role",
    "options": []
}
```

![A command with no arguments. It says /permissions](command.png)

Now we have a command named `permissions`. We want this command to be able to affect users and roles. Rather than making two separate commands, we can use subcommand groups. We want to use subcommand groups here because we are grouping commands on a similar resource: `user` or `role`.

```js
{
    "name": "permissions",
    "description": "Get or edit permissions for a user or a role",
    "options": [
        {
            "name": "user",
            "description": "Get or edit permissions for a user",
            "type": 2 // 2 is type SUB_COMMAND_GROUP
        },
        {
            "name": "role",
            "description": "Get or edit permissions for a role",
            "type": 2
        }
    ]
}
```

You'll notice that a command like this **will not show up** in the command explorer. That's because groups are effectively "folders" for commands, and we've made two empty folders. So let's continue.

Now that we've effectively made `user` and `role` "folders", we want to be able to either `get` and `edit` permissions. Within the subcommand groups, we can make subcommands for `get` and `edit`:

```js
{
    "name": "permissions",
    "description": "Get or edit permissions for a user or a role",
    "options": [
        {
            "name": "user",
            "description": "Get or edit permissions for a user",
            "type": 2, // 2 is type SUB_COMMAND_GROUP
            "options": [
                {
                    "name": "get",
                    "description": "Get permissions for a user",
                    "type": 1 // 1 is type SUB_COMMAND
                },
                {
                    "name": "edit",
                    "description": "Edit permissions for a user",
                    "type": 1
                }
            ]
        },
        {
            "name": "role",
            "description": "Get or edit permissions for a role",
            "type": 2,
            "options": [
                {
                    "name": "get",
                    "description": "Get permissions for a role",
                    "type": 1
                },
                {
                    "name": "edit",
                    "description": "Edit permissions for a role",
                    "type": 1
                }
            ]
        }
    ]
}
```

![A command with grouped subcommands. It says /permissions user get](command-with-groups-subcommands.png)

Now, we need some arguments! If we chose `user`, we need to be able to pick a user; if we chose `role`, we need to be able to pick a role. We also want to be able to pick between guild-level permissions and channel-specific permissions. For that, we can use optional arguments:

```js
{
    "name": "permissions",
    "description": "Get or edit permissions for a user or a role",
    "options": [
        {
            "name": "user",
            "description": "Get or edit permissions for a user",
            "type": 2, // 2 is type SUB_COMMAND_GROUP
            "options": [
                {
                    "name": "get",
                    "description": "Get permissions for a user",
                    "type": 1, // 1 is type SUB_COMMAND
                    "options": [
                        {
                            "name": "user",
                            "description": "The user to get",
                            "type": 6, // 6 is type USER
                            "required": true
                        },
                        {
                            "name": "channel",
                            "description": "The channel permissions to get. If omitted, the guild permissions will be returned",
                            "type": 7, // 7 is type CHANNEL
                            "required": false
                        }
                    ]
                },
                {
                    "name": "edit",
                    "description": "Edit permissions for a user",
                    "type": 1,
                    "options": [
                        {
                            "name": "user",
                            "description": "The user to edit",
                            "type": 6,
                            "required": true
                        },
                        {
                            "name": "channel",
                            "description": "The channel permissions to edit. If omitted, the guild permissions will be edited",
                            "type": 7,
                            "required": false
                        }
                    ]
                }
            ]
        },
        {
            "name": "role",
            "description": "Get or edit permissions for a role",
            "type": 2,
            "options": [
                {
                    "name": "get",
                    "description": "Get permissions for a role",
                    "type": 1,
                    "options": [
                        {
                            "name": "role",
                            "description": "The role to get",
                            "type": 8, // 8 is type ROLE
                            "required": true
                        },
                        {
                            "name": "channel",
                            "description": "The channel permissions to get. If omitted, the guild permissions will be returned",
                            "type": 7,
                            "required": false
                        }
                    ]
                },
                {
                    "name": "edit",
                    "description": "Edit permissions for a role",
                    "type": 1,
                    "options": [
                        {
                            "name": "role",
                            "description": "The role to edit",
                            "type": 8,
                            "required": true
                        },
                        {
                            "name": "channel",
                            "description": "The channel permissions to edit. If omitted, the guild permissions will be edited",
                            "type": 7,
                            "required": false
                        }
                    ]
                }
            ]
        }
    ]
}
```

And, done! The JSON looks a bit complicated, but what we've ended up with is a single command that can be scoped to multiple actions, and then further scoped to a particular resource, and then even _further_ scope with optional arguments. Here's what it looks like all put together.

![A command with grouped subcommands and parameters. It says /permissions user get with arguments for a user and a channel.](command-with-groups-subcommands-parameters.png)

## Permissions

Need to keep some of your Slash Commands safe from prying eyes, or only available to the right people? Slash Commands support permission overwrites for all your commands. For both guild _and_ global commands, you can enable or disable a specific user or role in a guild from using a command.

> info
> For now, if you don't have permission to use a command, they'll show up in the command picker as disabled and unusable. They will not be hidden.

You can also set a `default_permission` on your commands if you want them to be disabled by default when your app is added to a new guild. Setting `default_permission` to `false` will disallow _anyone_ in a guild from using the command--even Administrators and guild owners--unless a specific overwrite is configured. It will also disable the command from being usable in DMs.

For example, this command will not be usable by anyone in any guilds by default:

```json
{
    "name": "permissions_test",
    "description": "A test of default permissions",
    "default_permission": false
}
```

To enable it just for a moderator role:

```py
MODERATOR_ROLE_ID = "<moderator_role_id>"
url = "https://discord.com/api/v8/applications/<my_application_id>/guilds/<my_guild_id>/commands/<my_command_id>/permissions"

json = {
    "permissions": [
        {
            "id": MODERATOR_ROLE_ID,
            "type": 1,
            "permission": True
        }
    ]
}

headers = {
    "Authorization": "Bot 123456"
}

r = requests.put(url, headers=headers, json=json)
```

## Endpoints

> info
> For authorization, all endpoints take either a bot token or client credentials token for your application

## Get Global Application Commands % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

Fetch all of the global commands for your application. Returns an array of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) objects.

## Create Global Application Command % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new global command. New global commands will be available in all guilds after 1 hour. Returns `201` and an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) object.

###### JSON Params

| Field       | Type                                                                                            | Description                                      |
|-------------|-------------------------------------------------------------------------------------------------|--------------------------------------------------|
| name        | string                                                                                          | 1-32 lowercase character name matching `^[\w-]{1,32}$` |
| description | string                                                                                          | 1-100 character description                      |
| options?    | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                   |
| default_permission? | boolean (default `true`) | whether the command is enabled by default when the app is added to a guild |

## Get Global Application Command % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand}

Fetch a global command for your application. Returns an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) object.

## Edit Global Application Command % PATCH /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand}

> info
> All parameters for this endpoint are optional.

Edit a global command. Updates will be available in all guilds after 1 hour. Returns `200` and an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) object.

###### JSON Params

| Field              | Type                                                                                             | Description                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| name               | string                                                                                           | 1-32 lowercase character name matching `^[\w-]{1,32}$`                        |
| description        | string                                                                                           | 1-100 character description                                                |
| options            | ?array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                             |
| default_permission | boolean (default `true`)                                                                         | whether the command is enabled by default when the app is added to a guild |

## Delete Global Application Command % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand}

Deletes a global command. Returns `204`.

## Get Guild Application Commands % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

Fetch all of the guild commands for your application for a specific guild. Returns an array of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) objects.

## Bulk Overwrite Global Application Commands % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

Takes a list of application commands, overwriting existing commands that are registered globally for this application. Updates will be available in all guilds after 1 hour. Returns `200` and a list of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) objects. Commands that do not already exist will count toward daily application command create limits.

## Create Guild Application Command % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new guild command. New guild commands will be available in the guild immediately. Returns `201` and an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) object.  If the command did not already exist, it will count toward daily application command create limits.

###### JSON Params

| Field       | Type                                                                                            | Description                                      |
|-------------|-------------------------------------------------------------------------------------------------|--------------------------------------------------|
| name        | string                                                                                          | 1-32 lowercase character name matching `^[\w-]{1,32}$` |
| description | string                                                                                          | 1-100 character description                      |
| options?    | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                   |
| default_permission? | boolean (default `true`) | whether the command is enabled by default when the app is added to a guild |

## Get Guild Application Command % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand}

Fetch a guild command for your application. Returns an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) object.

## Edit Guild Application Command % PATCH /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand}

> info
> All parameters for this endpoint are optional.

Edit a guild command. Updates for guild commands will be available immediately. Returns `200` and an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) object.

###### JSON Params

| Field              | Type                                                                                             | Description                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| name               | string                                                                                           | 1-32 lowercase character name matching `^[\w-]{1,32}$`                          |
| description        | string                                                                                           | 1-100 character description                                                |
| options            | ?array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                             |
| default_permission | boolean (default `true`)                                                                         | whether the command is enabled by default when the app is added to a guild |


## Delete Guild Application Command % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand}

Delete a guild command. Returns `204` on success.

## Bulk Overwrite Guild Application Commands % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

Takes a list of application commands, overwriting existing commands for the guild. Returns `200` and a list of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) objects.

## Create Interaction Response % POST /interactions/{interaction.id#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction}/{interaction.token#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction}/callback

Create a response to an Interaction from the gateway. Takes an [Interaction response](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-response-object-interaction-response-structure).

## Get Original Interaction Response % GET /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction}/messages/@original

Returns the initial Interaction response. Functions the same as [Get Webhook Message](#DOCS_RESOURCES_WEBHOOK/get-webhook-message).

## Edit Original Interaction Response % PATCH /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction}/messages/@original

Edits the initial Interaction response. Functions the same as [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message).

## Delete Original Interaction Response % DELETE /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction}/messages/@original

Deletes the initial Interaction response. Returns `204` on success.

## Create Followup Message % POST /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction}

Create a followup message for an Interaction. Functions the same as [Execute Webhook](#DOCS_RESOURCES_WEBHOOK/execute-webhook), but `wait` is always true, and `flags` can be set to `64` in the body to send an ephemeral message. The `thread_id` query parameter is not required (and is furthermore ignored) when using this endpoint for interaction followups.

## Edit Followup Message % PATCH /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Edits a followup message for an Interaction. Functions the same as [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message).

## Delete Followup Message % DELETE /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Deletes a followup message for an Interaction. Returns `204` on success.

## Get Guild Application Command Permissions % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/permissions

Fetches command permissions for all commands for your application in a guild. Returns an array of [GuildApplicationCommandPermissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) objects.


## Get Application Command Permissions % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand}/permissions

Fetches command permissions for a specific command for your application in a guild. Returns a [GuildApplicationCommandPermissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) object.

## Edit Application Command Permissions % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand}/permissions

> warn
> This endpoint will overwrite existing permissions for the command in that guild

Edits command permissions for a specific command for your application in a guild.
You can only add up to 10 permission overwrites for a command.
Returns a [GuildApplicationCommandPermissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/guildapplicationcommandpermissions) object.

> warn
> Deleting or renaming a command will permanently delete all permissions for that command

###### JSON Params

| Field       | Type                                                                                                      | Description                                  |
| ----------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| permissions | array of [ApplicationCommandPermissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-application-command-permissions-structure) | the permissions for the command in the guild |

## Batch Edit Application Command Permissions % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/permissions

> warn
> This endpoint will overwrite all existing permissions for all commands in a guild

Batch edits permissions for all commands in a guild. Takes an array of partial [GuildApplicationCommandPermissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) objects including `id` and `permissions`.
You can only add up to 10 permission overwrites for a command.
Returns an array of [GuildApplicationCommandPermissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/guildapplicationcommandpermissions) objects.


###### Example

```py
FIRST_COMMAND_ID = "<first_command_id>"
SECOND_COMMAND_ID = "<second_command_id>"
ADMIN_ROLE_ID = "<admin_role_id>"

url = "https://discord.com/api/v8/applications/<my_application_id>/guilds/<my_guild_id>/commands/permissions"

json = [
    {
        "id": FIRST_COMMAND_ID,
        "permissions": [
            {
                "id": ADMIN_ROLE_ID,
                "type": 1,
                "permission": true
            }
        ]
    },
    {
        "id": SECOND_COMMAND_ID,
        "permissions": [
            {
                "id": ADMIN_ROLE_ID,
                "type": 1,
                "permission": false
            }
        ]
    }
]

headers = {
    "Authorization": "Bot 123456"
}

r = requests.put(url, headers=headers, json=json)
```

## Data Models and Types

## Application Command Object

###### Application Command Structure

> info
> A command, or each individual subcommand, can have a maximum of 25 `options`

An application command is the base "command" model that belongs to an application. This is what you are creating when you `POST` a new command.

| Field          | Type                                                                                            | Description                                      |
|----------------|-------------------------------------------------------------------------------------------------|--------------------------------------------------|
| id             | snowflake                                                                                       | unique id of the command                         |
| application_id | snowflake                                                                                       | unique id of the parent application              |
| guild_id?      | snowflake                                                                                       | guild id of the command, if not global              |
| name           | string                                                                                          | 1-32 lowercase character name matching `^[\w-]{1,32}$` |
| description    | string                                                                                          | 1-100 character description                      |
| options?       | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                   |
| default_permission? | boolean (default `true`) | whether the command is enabled by default when the app is added to a guild |

> warn
> Required `options` must be listed before optional options

###### Application Command Option Structure

> info
> You can specify a maximum of 25 `choices` per option

| Field       | Type                                                                                                        | Description                                                                                             |
|-------------|-------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| type        | int                                                                                                         | value of [ApplicationCommandOptionType](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-type) |
| name        | string                                                                                                      | 1-32 lowercase character name matching `^[\w-]{1,32}$`                                                         |
| description | string                                                                                                      | 1-100 character description                                                                             |
| required?   | boolean                                                                                                     | if the parameter is required or optional--default `false`                                               |
| choices?    | array of [ApplicationCommandOptionChoice](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-choice-structure) | choices for `string` and `int` types for the user to pick from                                          |
| options?    | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure)             | if the option is a subcommand or subcommand group type, this nested options will be the parameters      |

###### Application Command Option Type

| Name              | Value |
|-------------------|-------|
| SUB_COMMAND       | 1     |
| SUB_COMMAND_GROUP | 2     |
| STRING            | 3     |
| INTEGER           | 4     |
| BOOLEAN           | 5     |
| USER              | 6     |
| CHANNEL           | 7     |
| ROLE              | 8     |
| MENTIONABLE       | 9     |

###### Application Command Option Choice Structure

If you specify `choices` for an option, they are the **only** valid values for a user to pick

| Field | Type          | Description                                     |
|-------|---------------|-------------------------------------------------|
| name  | string        | 1-100 character choice name                     |
| value | string or int | value of the choice, up to 100 characters if string |


## Application Command Permissions Object

###### Guild Application Command Permissions Structure

Returned when fetching the permissions for a command in a guild.

| Field | Type | Description |
| ----- | ---- | ----------- |
| id | snowflake | the id of the command |
| application_id | snowflake | the id of the application the command belongs to |
| guild_id | snowflake | the id of the guild |
| permissions | array of [ApplicationCommandPermissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-application-command-permissions-structure) | the permissions for the command in the guild |

###### Application Command Permissions Structure

Application command permissions allow you to enable or disable commands for specific users or roles within a guild.

| Field | Type | Description |
| ----- | ---- | ----------- |
| id    | snowflake | the id of the role or user |
| type | [ApplicationCommandPermissionType](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-application-command-permission-type) | role or user |
| permission | boolean | `true` to allow, `false`, to disallow |

###### Application Command Permission Type

| Name | Value |
| -----| ----- |
| ROLE | 1     |
| USER | 2     |

## Interaction Object

An interaction is the base "thing" that is sent when a user invokes a command, and is the same for Slash Commands and other future interaction types (such as [Message Components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS)).

###### Interaction Structure

| Field          | Type                                                             | Description                                                    |
|----------------|------------------------------------------------------------------|----------------------------------------------------------------|
| id             | snowflake                                                        | id of the interaction                                          |
| application_id | snowflake                                                        | id of the application this interaction is for                  |
| type           | [InteractionType](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-interaction-type)                                                  | the type of interaction                                        |
| data?\*        | [ApplicationCommandInteractionData](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-application-command-interaction-data)                                | the command data payload                                       |
| guild_id?      | snowflake                                                        | the guild it was sent from                                     |
| channel_id?    | snowflake                                                        | the channel it was sent from                                   |
| member?\*\*    | [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object | guild member data for the invoking user, including permissions |
| user?          | [user](#DOCS_RESOURCES_USER/user-object) object                  | user object for the invoking user, if invoked in a DM          |
| token          | string                                                           | a continuation token for responding to the interaction         |
| version        | int                                                              | read-only property, always `1`                                 |
| message? | [message](#DOCS_RESOURCES_CHANNEL/message-object) object | for components, the message they were attached to |

\* This is always present on `ApplicationCommand` interaction types. It is optional for future-proofing against new interaction types

\*\* `member` is sent when the command is invoked in a guild, and `user` is sent when invoked in a DM

###### Interaction Request Type

| Name               | Value |
|--------------------|-------|
| Ping               | 1     |
| ApplicationCommand | 2     |
| MessageComponent   | 3     |

###### Application Command Interaction Data Structure

| Field     | Type                                             | Description                        |
|-----------|--------------------------------------------------|------------------------------------|
| id        | snowflake                                        | the ID of the invoked command      |
| name      | string                                           | the name of the invoked command    |
| resolved? | [ApplicationCommandInteractionDataResolved](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-application-command-interaction-data-resolved-structure)        | converted users + roles + channels |
| options?  | array of [ApplicationCommandInteractionDataOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-application-command-interaction-data-option-structure) | the params + values from the user  |
| custom_id | string | for components, the [`custom_id`](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/custom-id) of the component |
| component_type | int | for components, the [type](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-types) of the component |

###### Application Command Interaction Data Resolved Structure

> info
> If data for a Member is included, data for its corresponding User will also be included.

| Field         | Type                                                                                     | Description                         |
|---------------|------------------------------------------------------------------------------------------|-------------------------------------|
| users?        | Map of Snowflakes to [User Objects](#DOCS_RESOURCES_USER/user-object)                    | the IDs and User objects            |
| members?\*    | Map of Snowflakes to [Partial Member Objects](#DOCS_RESOURCES_GUILD/guild-member-object)  | the IDs and partial Member objects  |
| roles?        | Map of Snowflakes to [Role Objects](#DOCS_TOPICS_PERMISSIONS/role-object)                 | the IDs and Role objects            |
| channels?\*\* | Map of Snowflakes to [Partial Channel Objects](#DOCS_RESOURCES_CHANNEL/channel-object)    | the IDs and partial Channel objects |

\* Partial `Member` objects are missing `user`, `deaf` and `mute` fields

\*\* Partial `Channel` objects only have `id`, `name`, `type` and `permissions` fields

###### Application Command Interaction Data Option Structure

All options have names, and an option can either be a parameter and input value--in which case `value` will be set--or it can denote a subcommand or group--in which case it will contain a top-level key and another array of `options`.

`value` and `options` are mutually exclusive.

| Field    | Type                                             | Description                                                                                             |
|----------|--------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| name     | string                                           | the name of the parameter                                                                               |
| type     | int                                              | value of [ApplicationCommandOptionType](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-type) |
| value?   | [OptionType](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-type)                                       | the value of the pair                                                                                   |
| options? | array of [ApplicationCommandInteractionDataOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-application-command-interaction-data-option-structure) | present if this option is a group or subcommand                                                         |

## Interaction Response Object

After receiving an interaction, you must respond to acknowledge it. You can choose to respond with a message immediately using type `4`, or you can choose to send a deferred response with type `5`. If choosing a deferred response, the user will see a loading state for the interaction, and you'll have up to 15 minutes to edit the original deferred response using [Edit Original Interaction Response](#DOCS_INTERACTIONS_SLASH_COMMANDS/edit-original-interaction-response).

![A deferred response tells the user "Bot name is thinking"](deferred-example.png)

Interaction responses can also be public—everyone can see it—or "ephemeral"—only the invoking user can see it. That is determined by setting `flags` to `64` on the [InteractionApplicationCommandCallbackData](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-response-object-interaction-application-command-callback-data-structure).

###### Interaction Response Structure


| Field | Type                                      | Description                  |
|-------|-------------------------------------------|------------------------------|
| type  | [InteractionCallbackType](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-response-object-interaction-callback-type)                   | the type of response         |
| data? | [InteractionApplicationCommandCallbackData](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-response-object-interaction-application-command-callback-data-structure) | an optional response message |

###### Interaction Callback Type

| Name                             | Value | Description                                                                 |
|----------------------------------|-------|-----------------------------------------------------------------------------|
| Pong                             | 1     | ACK a `Ping`                                                                |
| ChannelMessageWithSource         | 4     | respond to an interaction with a message                                    |
| DeferredChannelMessageWithSource | 5     | ACK an interaction and edit a response later, the user sees a loading state |
| DeferredUpdateMessage\* | 6 | for components, ACK an interaction and edit the original message later; the user does not see a loading state |
| UpdateMessage\* | 7 | for components, edit the message the component was attached to |

\* Only valid for [component-based](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/) interactions

###### Interaction Application Command Callback Data Structure

Not all message fields are currently supported.

| Name              | Value                                                    | Description                                                                                 |
|-------------------|----------------------------------------------------------|---------------------------------------------------------------------------------------------|
| tts?              | boolean                                                  | is the response TTS                                                                         |
| content?          | string                                                   | message content                                                                             |
| embeds?           | array of [embeds](#DOCS_RESOURCES_CHANNEL/embed-object)  | supports up to 10 embeds                                                                    |
| allowed_mentions? | [allowed mentions](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)                                         | [allowed mentions](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object) object                  |
| flags?            | int                                                      | set to `64` to make your response ephemeral                                                 |
| components?       | array of [components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS)| message components    |

## Message Interaction Object

This is sent on the [message object](#DOCS_RESOURCES_CHANNEL/message-object) when the message is a response to an Interaction.

###### Message Interaction Structure

| Name | Value | Description |
| --- | --- | --- |
| id           | snowflake                                                        | id of the interaction                                          |
| type         | [InteractionType](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-interaction-type)                                                  | the type of interaction                                        |
| name | string | the name of the [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) |
| user | [user object](#DOCS_RESOURCES_USER/user-object) | the user who invoked the interaction |
