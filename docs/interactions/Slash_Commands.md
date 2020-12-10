# Slash Commands

Slash Commands are the new, exciting way to build and interact with apps on Discord. This is not a terribly exciting introduction, so I will add more fun words here later.

## What is a Slash Command

A **Slash Command** is a command that you register for your application. They're made up of a name, description, and a block of `options`, which you can think of like arguments to a function. The name and description help users find your command among many others, and the `options` validate user input as they fill out your command.

Your commands are available in every guild that adds your application. You can also make commands for a specific guild; they're only available in that guild.

An **Interaction** is the message that your application receives when a user uses a command. It includes the values that the user submitted, as well as some metadata about this particular instance of the command being used: the `guild_id`, `channel_id`, `member` and other fields. You can find all the values in our [data models](#DOCS_INTERACTIONS_SLASH_COMMANDS/data-models-and-types-interaction).

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

> danger
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

To make a **global** Slash Command, make an HTTP POST call like this:

```py
url = "https://discord.com/api/v8/applications/<my_application_id>/commands"

body = {
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

# or a client credentials token for your app
headers = {
    "Authorization": "Bearer abcdefg"
}

r = requests.post(url, headers, body)
```

This command will be available on _all_ your app's guilds.

> warn
> Global commands are cached for **1 hour**. That means that new global commands will fan out slowly across all guilds, and will be guaranteed to be updated in an hour.

To make a **guild** Slash Command, make a similar HTTP POST call, but scope it to a specific `guild_id`:

```py
url = "https://discord.com/api/v8/applications/<my_application_id>/guilds/<guild_id>/commands"
body = # ...
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

When a user completes a Slash Commands, your app will receive an **Interaction**. Your app can receive an interaction in one of two ways:

- Via gateway event, `INTERACTION_CREATE` <docs>
- Via outgoing webhook

These two methods are **mutually exclusive**; you can _only_ receive Interactions one of the two ways. The `INTERACTION_CREATE` gateway event will be handled by the library you are using, so we'll just cover outgoing webhooks.

In your application in the Developer Portal, there is a field on the main page called "Interactions Endpoint URL". If you want to receive Interactions via outgoing webhook, you can set your URL in this field. In order for the URL to be valid, you must be prepared for two things ahead of time:

> info
> These steps are only necessary for webhook-based Interactions. It is not required for receiving them over the gateway.

1. Your endpoint must be prepared to ACK a `PING` message
2. Your endpoint must be set up to properly handle signature headers--more on that in [Security and Authorization](#DOCS_INTERACTIONS_SLASH_COMMANDS/security-and-authorization)

If either of these are not complete, we will not validate your URL and it will fail to save.

When you attempt to save a URL, we will send a `POST` request to that URL with a `PING` payload. The `PING` payload has a `type: 1`. So, to properly ACK the payload, return a `200` reponse with a payload of `type: 1`:

```py
@app.route('/', methods=['POST'])
def my_command():
    if request.json.type == 1:        
        return jsonify({
            "type": 1
        })
```

You'll also need to properly set up [Security and Authorization](#DOCS_INTERACTIONS_SLASH_COMMANDS/security-and-authorization) on your endpoint for the URL to be accepted. Once both of those are complete and your URL has been saved, you can start receiving Interactions via webhook! At this point, your app will **no longer receive Interactions over the gateway**. If you want to receive them over the gateway again, simply delete your URL.

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
        "roles": [539082325061836999],
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

An explanation of all the fields can be found in our [data models](#DOCS_INTERACTIONS_SLASH_COMMANDS/data-models-and-types-interaction).

Now that you've gotten the data from the user, it's time to respond to them.

## Responding to an Interaction

Interactions--both receiving and responding--are webhooks under the hood. So responding to an Interaction is just like sending a webhook request!

When responding to an interaction received **via webhook**, your server can simply respond to the received `POST` request. You'll want to respond with a `200` status code (if everything went well), as well as specifying a `type` and `data`, which is an object with parameters the same as [Execute Webhook](#DOCS_RESOURCES_WEBHOOK/execute-webhook):

```py
@app.route('/', methods=['POST'])
def my_command():
    if request.json.type == 1:        
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

To respond to a gateway Interaction, make a `POST` request like this. `interaction_id` is the unique id of that individual Interaction from the receieved payload. `interaction_token` is the unique token for that interaction from the received payload:

```py
url = "https://discord.com/api/v8/interactions/<interaction_id>/<interaction_token>/callback"

data = {
    "content": "Congrats on sending your command!"
}
r = requests.post(url, data)
```

> info
> Interaction `tokens` are valid for **15 minutes** and can be used to send followup messages.

## Followup Messages

Sometimes, your bot will want to send followup messages to a user after responding to an interaction. Or, you may want to edit your original response. You can use the following endpoints to do so:

- `PATCH /webhooks/<interaction_id>/<interaction_token>/messages/@original` to edit your initial response to an Interaction
- `POST /webhooks/<interaction_id>/<interaction_token>/messages` to send a new message
- `PATCH /webhooks/<interaction_id>/<interaction_token>/messages/<message_id>` to edit a message sent with that `token`

Interaction tokens are valid for **15 minutes**, meaning you can respond and update to a Slash Command within that amount of time.

## Security and Authorization

If you are receiving Interactions via outgoing webhook, there are some security steps you **must** take before your app is eligible to receive requests. The internet is a scary place, especially for people hosting open, unauthenticated endpoints.

Every Interaction is sent with a `x-signature-ed25519` header. The header includes an encryption key and a timestamp. Using your favorite security library of choice, you **must validate this signature header each time to you receive an interaction**. If the signature fails validate, respond with a `400` error code.

Your **public key** for your app can be found on the **General Information page for your app in the Dev Portal**.

If you are not properly validating this signature header, we will not allow you to save your interactions URL in the Dev Portal. We will also do automated, routine security checks against your endpoint, meaning that if you remove this validation in the future, we will remove your interactions URL in the future and alert you via email and System DM.


## Subcommands and Groups

Mason TODO to talk more about this

## Endpoints

> info
> For authoriation, all endpoints take either a bot token or client credentials token for your application

## Get Global Application Commands % GET /applications/{application.id}/commands

Fetch all of the global commands for your application. Returns a list of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command) objects.

## Create Global Application Command % POST /applications/{application.id}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new global commands. New global commands will be available in all guilds after 1 hour. Returns `200` and an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command) object.

###### JSON Params

| Field       | Type                                                                                              | Description                    |
|-------------|---------------------------------------------------------------------------------------------------|--------------------------------|
| name        | string                                                                                            | 3-32 character command name    |
| description | string                                                                                            | 1-100 character description    |
| options?    | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-option) | the parameters for the command |

## Edit Global Application Command % PATCH /applications/{application.id}/commands/{id}

Edit a global commands. Updates will be available in all guilds after 1 hour. Returns `200` and an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command) object.

###### JSON Params

| Field       | Type                                                                                              | Description                    |
|-------------|---------------------------------------------------------------------------------------------------|--------------------------------|
| name        | string                                                                                            | 3-32 character command name    |
| description | string                                                                                            | 1-100 character description    |
| options?    | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-option) | the parameters for the command |


## Delete Global Application Command % POST /applications/{application.id}/commands/{id}

Deletes a global commands. Returns `204`.

## Get Guild Application Commands % GET /applications/{application.id}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

Fetch all of the global commands for your application. Returns a list of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command) objects.

## Create Guild Application Command % POST /applications/{application.id}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new global commands. New global commands will be available in all guilds after 1 hour. Returns `200` and an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command) object.

###### JSON Params

| Field       | Type                                                                                              | Description                    |
|-------------|---------------------------------------------------------------------------------------------------|--------------------------------|
| name        | string                                                                                            | 3-32 character command name    |
| description | string                                                                                            | 1-100 character description    |
| options?    | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-option) | the parameters for the command |

## Edit Guild Application Command % PATCH /applications/{application.id}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

Edit a global commands. Updates will be available in all guilds after 1 hour. Returns `200` and an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command) object.

###### JSON Params

| Field       | Type                                                                                              | Description                    |
|-------------|---------------------------------------------------------------------------------------------------|--------------------------------|
| name        | string                                                                                            | 3-32 character command name    |
| description | string                                                                                            | 1-100 character description    |
| options?    | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-option) | the parameters for the command |


## Delete Guild Application Command % POST /applications/{application.id}/commands/{id}

Deletes a guild commands. Returns `204`.

## Data Models and Types

## ApplicationCommand

An application command is the base "command" model that belongs to an application. This is what you are creating when you `POST` a new command.

| Field          | Type                                                                                              | Description                         |
|----------------|---------------------------------------------------------------------------------------------------|-------------------------------------|
| id             | snowflake                                                                                         | unique id of the command            |
| application_id | snowflake                                                                                         | unique id of the parent application |
| name           | string                                                                                            | 3-32 character name                 |
| description    | string                                                                                            | 1-100 character description         |
| options?       | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-option) | the parameters for the command      |

## ApplicationCommandOption

| Field       | Type                                                                                                           | Description                                                                                                |
|-------------|----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| type        | int                                                                                                            | value of [ApplicationCommandOptionType](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-option-type) |
| name        | string                                                                                                         | 1-32 character name                                                                                        |
| description | string                                                                                                         | 1-100 character description                                                                                |
| default?    | bool                                                                                                           | the first `required` option for the user to complete--only one option can be `default`                     |
| required?   | bool                                                                                                           | if the parameter is required or optional--default `false`                                                  |
| choices?    | array of [ApplicationCommandOptionChoice](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-option-choice) | choices for `string` and `int` types for the user to pick from                                             |
| options?    | array of [ApplicationCommandOption](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-option)              | if the option is a subcommand or subcommand group type, this nested options will be the parameters         |

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
| name  | string        | name of the choice  |
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
| token      | string                            | a contintuation token for responding to the interaction |

\* This is always present on `ApplicationCommand` interaction types. It is optional for future-proofing against new interaction types

###### InteractionType

| Name               | Value |
|--------------------|-------|
| Ping               | 1     |
| ApplicationCommand | 2     |

###### ApplicationCommandInteractionData

| Field   | Type                                             | Description                       |
|---------|--------------------------------------------------|-----------------------------------|
| id      | snowflake                                        | the ID of the invoked command     |
| name    | string                                           | the name of the invoked command   |
| options | array of ApplicationCommandInteractionDataOption | the params + values from the user |

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
| allowed_mentions? | allowed mentions | https://discord.com/developers/docs/resources/channel#allowed-mentions-object               |
| flags             | int              | acceptable values are [message flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) |