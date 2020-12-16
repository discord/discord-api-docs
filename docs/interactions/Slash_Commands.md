# Slash Commands

Slash Commands are the new, exciting way to build and interact with apps on Discord.

With Slash Commands, all you have to do is type `/` and you're ready to use your favorite bot. Users can learn everything your bot does and easily find new features as you add them. Validation, error states, and helpful UI walks them through your commands, meaning they can get it right the first time, especially on mobile. You now have one more ally in the fight against your phone's autocorrect.

Slash Commands set your users up for success instead of confusion and frustration. They separate how users think and how your code works, meaning no matter how complex your codebase and commands may get, people who love your bot will find it approachable and easy to use.

Let's get started!

## A Quick Note on Limits

In this documentation you'll find some notes about limits and caps on certain parts of Slash Commands. At a high level, they are as follows:

- An app can have up to 50 top-level global commands (50 commands with unique names)
- An app can have up to an additional 50 guild commands per guild
- An app can have up to 10 subcommand groups on a top-level command
- An app can have up to 10 subcommands within a subcommand group
- `choices` can have up to 10 values per option
- commands can have up to 10 `options` per command
- Limitations on [command names](#registering-a-command)
- Limitations on [nesting subcommands and groups](#nested-subcommands-and-groups)

These are the limits and caps for the initial release, but **they can be subject to change with your feedback.** If you would like to leave feedback about Slash Commands--limits, features, or otherwise--please open a ticket on our [Github Issue Tracker](https://github.com/discord/discord-api-docs/issues) using the `Slash Commands` templates.

## What is a Slash Command

A **Slash Command** is a command that you register for your application. They're made up of a name, description, and a block of `options`, which you can think of like arguments to a function. The name and description help users find your command among many others, and the `options` validate user input as they fill out your command.

Your global commands are available in every guild that adds your application. You can also make commands for a specific guild; they're only available in that guild.

An **Interaction** is the message that your application receives when a user uses a command. It includes the values that the user submitted, as well as some metadata about this particular instance of the command being used: the `guild_id`, `channel_id`, `member` and other fields. You can find all the values in our [data models](#data-models-and-types).

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
> Currently, Slash Commands can only be registered via HTTP endpoint.

There are two kinds of Slash Commands: global commands and guild commands. Global commands are available for every guild that adds your app; guild commands are specific to the guild you specify when making them. Command names are unique per application within each scope (global and guild). That means:

- Your app **cannot** have two global commands with the same name
- Your app **cannot** have two guild commands within the same name **on the same guild**
- Your app **can** have a global and guild command with the same name
- Multiple apps **can** have commands with the same names

> info
> Apps can have a maximum of 50 global commands, and an additional 50 guild-specific commands per guild

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
                    "value": "animal_dog"
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

# or a client credentials token for your app with the applications.commmands.update scope
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

Full documentation of endpoints can be found in [Endpoints](#endpoints).

## Receiving an Interaction

When a user uses a Slash Command, your app will receive an **Interaction**. Your app can receive an interaction in one of two ways:

- Via gateway event, `INTERACTION_CREATE` <docs>
- Via outgoing webhook

These two methods are **mutually exclusive**; you can _only_ receive Interactions one of the two ways. The `INTERACTION_CREATE` gateway event will be handled by the library you are using, so we'll just cover outgoing webhooks.

In your application in the Developer Portal, there is a field on the main page called "Interactions Endpoint URL". If you want to receive Interactions via outgoing webhook, you can set your URL in this field. In order for the URL to be valid, you must be prepared for two things ahead of time:

> info
> These steps are only necessary for webhook-based Interactions. It is not required for receiving them over the gateway.

1. Your endpoint must be prepared to ACK a `PING` message
2. Your endpoint must be set up to properly handle signature headers--more on that in [Security and Authorization](#security-and-authorization)

If either of these are not complete, we will not validate your URL and it will fail to save.

When you attempt to save a URL, we will send a `POST` request to that URL with a `PING` payload. The `PING` payload has a `type: 1`. So, to properly ACK the payload, return a `200` reponse with a payload of `type: 1`:

```py
@app.route('/', methods=['POST'])
def my_command():
    if request.json["type"] == 1:        
        return jsonify({
            "type": 1
        })
```

You'll also need to properly set up [Security and Authorization](#security-and-authorization) on your endpoint for the URL to be accepted. Once both of those are complete and your URL has been saved, you can start receiving Interactions via webhook! At this point, your app will **no longer receive Interactions over the gateway**. If you want to receive them over the gateway again, simply delete your URL.

An Interaction includes the `data` that the user sent in the command, as well as some metadata. It looks like this:

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

An explanation of all the fields can be found in our [data models](#data-models-and-types).

Now that you've gotten the data from the user, it's time to respond to them.

## Responding to an Interaction

Interactions--both receiving and responding--are webhooks under the hood. So responding to an Interaction is just like sending a webhook request!

When responding to an interaction received **via webhook**, your server can simply respond to the received `POST` request. You'll want to respond with a `200` status code (if everything went well), as well as specifying a `type` and `data`, which is an [Interaction Response](#interaction-response) object:

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
                "allowed_mentions": []
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
> Interaction `tokens` are valid for **15 minutes** and can be used to send followup messages.

## Followup Messages

Sometimes, your bot will want to send followup messages to a user after responding to an interaction. Or, you may want to edit your original response. Whether you receive Interations over the gateway or by outgoing webhook, you can use the following endpoints to edit your initial response or send followup messages:

- `PATCH /webhooks/<application_id>/<interaction_token>/messages/@original` to edit your initial response to an Interaction
- `DELETE /webhooks/<application_id>/<interaction_token>/messages/@original` to delete your initial response to an Interaction
- `POST /webhooks/<application_id>/<interaction_token>` to send a new followup message
- `PATCH /webhooks/<application_id>/<interaction_token>/messages/<message_id>` to edit a message sent with that `token`

> info
> Interactions webhooks share the same rate limit properties as normal webhooks

Interaction tokens are valid for **15 minutes**, meaning you can respond and update to a Slash Command within that amount of time.

## Security and Authorization

> info
> Check out our [Community Resources](discord-api-docs/blob/master/docs/topics/Community_Resources.md#interactions) for libraries to help you with security in your language of choice

The internet is a scary place, especially for people hosting open, unauthenticated endpoints. If you are receiving Interactions via outgoing webhook, there are some security steps you **must** take before your app is eligible to receive requests.

Every Interaction is sent with the following headers:

- `X-Signature-Ed25519` as a signature
- `X-Signature-Timestamp` as a timestamp

Using your favorite security library, you **must validate the request each time to you receive an interaction**. If the signature fails validate, respond with a `401` error code. Here's a couple code examples:

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

We highly recommend checking out our [Community Resources](discord-api-docs/blob/master/docs/topics/Community_Resources.md#interactions) and the two libraries found there. They not only provide typing for Interactions data models, but also include decorators for API frameworks like Flask and Express to make validation easy.

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

## Endpoints

> info
> For authoriation, all endpoints take either a bot token or client credentials token for your application

## Get Global Application Commands % GET /applications/{application.id#DOCS_TOPICS_OAUTH2/application-object}/commands

Fetch all of the global commands for your application. Returns an array of [ApplicationCommand](#applicationcommand) objects.

## Create Global Application Command % POST /applications/{application.id#DOCS_TOPICS_OAUTH2/application-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new global command. New global commands will be available in all guilds after 1 hour. Returns `200` and an [ApplicationCommand](#applicationcommand) object.

###### JSON Params

| Field       | Type                                                                                              | Description                    |
|-------------|---------------------------------------------------------------------------------------------------|--------------------------------|
| name        | string                                                                                            | 3-32 character command name    |
| description | string                                                                                            | 1-100 character description    |
| options?    | array of [ApplicationCommandOption](#applicationcommandoption) | the parameters for the command |

## Edit Global Application Command % PATCH /applications/{application.id#DOCS_TOPICS_OAUTH2/application-object}/commands/{command.id#applicationcommand}

Edit a global command. Updates will be available in all guilds after 1 hour. Returns `200` and an [ApplicationCommand](#applicationcommand) object.

###### JSON Params

| Field       | Type                                                                                              | Description                    |
|-------------|---------------------------------------------------------------------------------------------------|--------------------------------|
| name        | string                                                                                            | 3-32 character command name    |
| description | string                                                                                            | 1-100 character description    |
| options?    | array of [ApplicationCommandOption](#applicationcommandoption) | the parameters for the command |


## Delete Global Application Command % DELETE /applications/{application.id#DOCS_TOPICS_OAUTH2/application-object}/commands/{command.id#applicationcommand}

Deletes a global command. Returns `204`.

## Get Guild Application Commands % GET /applications/{application.id#DOCS_TOPICS_OAUTH2/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

Fetch all of the guild commands for your application for a specific guild. Returns an array of [ApplicationCommand](#applicationcommand) objects.

## Create Guild Application Command % POST /applications/{application.id#DOCS_TOPICS_OAUTH2/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new guild command. New guild commands will be available in the guild immediately. Returns `200` and an [ApplicationCommand](#applicationcommand) object.

###### JSON Params

| Field       | Type                                                                                              | Description                    |
|-------------|---------------------------------------------------------------------------------------------------|--------------------------------|
| name        | string                                                                                            | 3-32 character command name    |
| description | string                                                                                            | 1-100 character description    |
| options?    | array of [ApplicationCommandOption](#applicationcommandoption) | the parameters for the command |

## Edit Guild Application Command % PATCH /applications/{application.id#DOCS_TOPICS_OAUTH2/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#applicationcommand}

Edit a guild command. Updates for guild commands will be available immediately. Returns `200` and an [ApplicationCommand](#applicationcommand) object.

###### JSON Params

| Field       | Type                                                                                              | Description                    |
|-------------|---------------------------------------------------------------------------------------------------|--------------------------------|
| name        | string                                                                                            | 3-32 character command name    |
| description | string                                                                                            | 1-100 character description    |
| options?    | array of [ApplicationCommandOption](#applicationcommandoption) | the parameters for the command |


## Delete Guild Application Command % DELETE /applications/{application.id#DOCS_TOPICS_OAUTH2/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#applicationcommand}

Delete a guild command. Returns `204` on success.

## Create Interaction Response % POST /interactions/{interaction.id#interaction}/{interaction.token#interaction}/callback

Create a response to an Interaction from the gateway. Takes an [Interaction response](#interaction-response).

## Edit Original Interaction Response % PATCH /webhooks/application.id/{interaction.token#interaction}/messages/@original

Edits the initial Interaction response. Functions the same as [Edit Webhook Message](discord-api-docs/blob/master/docs/resources/Webhook.md#edit-webhook-message--patch-webhookswebhookiddocs_resources_webhookwebhook-objectwebhooktokendocs_resources_webhookwebhook-objectmessagesmessageiddocs_resources_channelmessage-object).

## Delete Original Interaction Response % DELETE /webhooks/application.id/{interaction.token#interaction}/messages/@original

Deletes the initial Interaction response. Returns `204` on success.

## Create Followup Message % POST /webhooks/application.id/{interaction.token#interaction}

Create a followup message for an Interaction. Functions the same as [Execute Webhook](discord-api-docs/blob/master/docs/resources/Webhook.md#execute-github-compatible-webhook--post-webhookswebhookiddocs_resources_webhookwebhook-objectwebhooktokendocs_resources_webhookwebhook-objectgithub)

## Edit Followup Message % PATCH /webhooks/application.id/{interaction.token#interaction}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Edits a followup message for an Interaction. Functions the same as [Edit Webhook Message](discord-api-docs/blob/master/docs/resources/Webhook.md#edit-webhook-message--patch-webhookswebhookiddocs_resources_webhookwebhook-objectwebhooktokendocs_resources_webhookwebhook-objectmessagesmessageiddocs_resources_channelmessage-object).

## Delete Followup Message % DELETE /webhooks/application.id/{interaction.token#interaction}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Deletes a followup message for an Interaction. Returns `204` on success.

## Data Models and Types

## ApplicationCommand

> info
> A command, or each individual subcommand, can have a maximum of 10 `options`

An application command is the base "command" model that belongs to an application. This is what you are creating when you `POST` a new command.

| Field          | Type                                                                                              | Description                         |
|----------------|---------------------------------------------------------------------------------------------------|-------------------------------------|
| id             | snowflake                                                                                         | unique id of the command            |
| application_id | snowflake                                                                                         | unique id of the parent application |
| name           | string                                                                                            | 3-32 character name                 |
| description    | string                                                                                            | 1-100 character description         |
| options?       | array of [ApplicationCommandOption](#applicationcommandoption) | the parameters for the command      |

## ApplicationCommandOption

> info
> You can specify a maximum of 10 `choices` per option

| Field       | Type                                                                                                           | Description                                                                                                |
|-------------|----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| type        | int                                                                                                            | value of [ApplicationCommandOptionType](#applicationcommandoptiontype) |
| name        | string                                                                                                         | 1-32 character name                                                                                        |
| description | string                                                                                                         | 1-100 character description                                                                                |
| default?    | bool                                                                                                           | the first `required` option for the user to complete--only one option can be `default`                     |
| required?   | bool                                                                                                           | if the parameter is required or optional--default `false`                                                  |
| choices?    | array of [ApplicationCommandOptionChoice](#applicationcommandoptionchoice) | choices for `string` and `int` types for the user to pick from                                             |
| options?    | array of [ApplicationCommandOption](#applicationcommandoption)              | if the option is a subcommand or subcommand group type, this nested options will be the parameters         |

## ApplicationCommandOptionType

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

## ApplicationCommandOptionChoice

If you specify `choices` for an option, they are the **only** valid values for a user to pick

| Field | Type          | Description         |
|-------|---------------|---------------------|
| name  | string        | 1-100 character choice name |
| value | string or int | value of the choice |

## Interaction

An interaction is the base "thing" that is sent when a user invokes a command, and is the same for Slash Commands and other future interaction types

| Field      | Type                              | Description                                             |
|------------|-----------------------------------|---------------------------------------------------------|
| id         | snowflake                         | id of the interaction                                   |
| type       | InteractionType                   | the type of interaction                                 |
| data?\*    | ApplicationCommandInteractionData | the command data payload                                |
| guild_id   | snowflake                         | the guild it was sent from                              |
| channel_id | snowflake                         | the channel it was sent from                            |
| member     | GuildMember                       | guild member data for the invoking user                 |
| token      | string                            | a continuation token for responding to the interaction |
| version    | int                               | read-only property, always `1`                          |

\* This is always present on `ApplicationCommand` interaction types. It is optional for future-proofing against new interaction types

###### InteractionType

| Name               | Value |
|--------------------|-------|
| Ping               | 1     |
| ApplicationCommand | 2     |

###### ApplicationCommandInteractionData

| Field    | Type                                             | Description                       |
|----------|--------------------------------------------------|-----------------------------------|
| id       | snowflake                                        | the ID of the invoked command     |
| name     | string                                           | the name of the invoked command   |
| options? | array of ApplicationCommandInteractionDataOption | the params + values from the user |

###### ApplicationCommandInteractionDataOption

All options have names, and an option can either be a parameter and input value--in which case `value` will be set--or it can denote a subcommand or group--in which case it will contain a top-level key and another array of `options`. 

`value` and `options` are mututally exclusive.

| Field    | Type                                             | Description                                     |
|----------|--------------------------------------------------|-------------------------------------------------|
| name     | string                                           | the name of the parameter                       |
| value?   | OptionType                                       | the value of the pair                           |
| options? | array of ApplicationCommandInteractionDataOption | present if this option is a group or subcommand |

###### Interaction Response

After receiving an interaction, you must respond to acknowledge it. This may be a `pong` for a `ping`, a message, or simply an acknowledgement that you have received it and will handle the command async.

Interaction responses may choose to "eat" the user's command input if you do not wish to have their slash command show up as message in chat. This may be helpful for slash commands, or commands whose responses are asynchronous or ephemeral messages.

| Field | Type                                      | Description                  |
|-------|-------------------------------------------|------------------------------|
| type  | InteractionResponseType                   | the type of response         |
| data? | InteractionApplicationCommandCallbackData | an optional response message |

###### InteractionResponseType

| Name                     | Value | Description                                                       |
|--------------------------|-------|-------------------------------------------------------------------|
| Pong                     | 1     | ACK a `Ping`                                                      |
| Acknowledge              | 2     | ACK a command without sending a message, eating the user's input  |
| ChannelMessage           | 3     | respond with a message, eating the user's input                   |
| ChannelMessageWithSource | 4     | respond with a message, showing the user's input                  |
| ACKWithSource            | 5     | ACK a command without sending a message, showing the user's input |

###### InteractionApplicationCommandCallbackData

Not all message fields are currently supported.

| Name              | Value            | Description                                                                                 |
|-------------------|------------------|---------------------------------------------------------------------------------------------|
| tts?              | bool             | is the response TTS                                                                         |
| content           | string           | message content                                                                             |
| embeds?           | array of embeds  | supports up to 10 embeds                                                                    |
| allowed_mentions? | allowed mentions | [allowed mentions](discord-api-docs/blob/master/docs/resources/Channel.md#allowed-mentions-object) object                  |
