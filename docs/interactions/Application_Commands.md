# Application Commands

Application commands are commands that an application can register to Discord. They provide users a first-class way of interacting directly with your application that feels deeply integrated into Discord.

## Application Command Object

###### Application Command Naming

`CHAT_INPUT` command names and command option names must match the following regex `^[\w-]{1,32}$` with the unicode flag set. If there is a lowercase variant of any letters used, you must use those. Characters with no lowercase variants and/or uncased letters are still allowed. `USER` and `MESSAGE` commands may be mixed case and can include spaces.

###### Application Command Structure

| Field                      | Type                                                                                                                                           | Description                                                                                                          | Valid Types |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|-------------|
| id                         | snowflake                                                                                                                                      | unique id of the command                                                                                             | all         |
| type?                      | one of [application command type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-types)                | the type of command, defaults `1` if not set                                                                         | all         |
| application_id             | snowflake                                                                                                                                      | unique id of the parent application                                                                                  | all         |
| guild_id?                  | snowflake                                                                                                                                      | guild id of the command, if not global                                                                               | all         |
| name                       | string                                                                                                                                         | [1-32 character name](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming) | all         |
| name_localizations?        | dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                           | Localization dictionary for the `name` field. Values follow the same restrictions as `name`                          | all         |
| description                | string                                                                                                                                         | 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands                | all         |
| description_localizations? | dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                           | Localization dictionary for the `description` field. Values follow the same restrictions as `description`            | all         |
| options?                   | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command, max 25                                                                               | CHAT_INPUT  |
| default_permission?        | boolean                                                                                                                                        | whether the command is enabled by default when the app is added to a guild (default `true`)                          | all         |
| version                    | snowflake                                                                                                                                      | autoincrementing version identifier updated during substantial record changes                                        | all         |


###### Application Command Types

| Name       | Type | Description                                                               |
| ---------- | ---- | ------------------------------------------------------------------------- |
| CHAT_INPUT | 1    | Slash commands; a text-based command that shows up when a user types `/`  |
| USER       | 2    | A UI-based command that shows up when you right click or tap on a user    |
| MESSAGE    | 3    | A UI-based command that shows up when you right click or tap on a message |


###### Application Command Option Structure

> warn
> Required `options` must be listed before optional options

| Field                      | Type                                                                                                                                                         | Description                                                                                                          |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| type                       | one of [application command option type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-type)                 | the type of option                                                                                                   |
| name                       | string                                                                                                                                                       | [1-32 character name](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming) |
| name_localizations?        | dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                                         | Localization dictionary for the `name` field. Values follow the same restrictions as `name`                         |
| description                | string                                                                                                                                                       | 1-100 character description                                                                                          |
| description_localizations? | dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                                         | Localization dictionary for the `description` field. Values follow the same restrictions as `description`           |
| required?                  | boolean                                                                                                                                                      | if the parameter is required or optional--default `false`                                                            |
| choices?                   | array of [application command option choice](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-choice-structure) | choices for `STRING`, `INTEGER`, and `NUMBER` types for the user to pick from, max 25                                |
| options?                   | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure)               | if the option is a subcommand or subcommand group type, these nested options will be the parameters                  |
| channel_types?             | array of [channel types](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types)                                                                               | if the option is a channel type, the channels shown will be restricted to these types                                |
| min_value?                 | integer for `INTEGER` options, double for `NUMBER` options                                                                                                   | if the option is an `INTEGER` or `NUMBER` type, the minimum value permitted                                          |
| max_value?                 | integer for `INTEGER` options, double for `NUMBER` options                                                                                                   | if the option is an `INTEGER` or `NUMBER` type, the maximum value permitted                                          |
| autocomplete? \*           | boolean                                                                                                                                                      | if autocomplete interactions are enabled for this `STRING`, `INTEGER`, or `NUMBER` type option                       |

\* `autocomplete` may not be set to true if `choices` are present.

> note
> Options using `autocomplete` are not confined to only use choices given by the application.

###### Application Command Option Type

| Name              | Value | Note                                                           |
| ----------------- | ----- | -------------------------------------------------------------- |
| SUB_COMMAND       | 1     |                                                                |
| SUB_COMMAND_GROUP | 2     |                                                                |
| STRING            | 3     |                                                                |
| INTEGER           | 4     | Any integer between -2^53 and 2^53                             |
| BOOLEAN           | 5     |                                                                |
| USER              | 6     |                                                                |
| CHANNEL           | 7     | Includes all channel types + categories                        |
| ROLE              | 8     |                                                                |
| MENTIONABLE       | 9     | Includes users and roles                                       |
| NUMBER            | 10    | Any double between -2^53 and 2^53                              |
| ATTACHMENT        | 11    | [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) object |

###### Application Command Option Choice Structure

If you specify `choices` for an option, they are the **only** valid values for a user to pick

| Field               | Type                                                                 | Description                                                                                  |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| name                | string                                                               | 1-100 character choice name                                                                  |
| name_localizations? | dictionary with keys in [available locales](#DOCS_REFERENCE/locales) | Localization dictionary for the `name` field. Values follow the same restrictions as `name` |
| value               | string, integer, or double \*                                        | value of the choice, up to 100 characters if string                                          |

\* Type of `value` depends on the [option type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-type) that the choice belongs to.

###### Application Command Interaction Data Option Structure

All options have names, and an option can either be a parameter and input value--in which case `value` will be set--or it can denote a subcommand or group--in which case it will contain a top-level key and another array of `options`.

`value` and `options` are mutually exclusive.

| Field    | Type                                                                                                                                                                             | Description                                                                                                                                    |
| -------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| ---------------------------------------------------------------------------------------------------------------------------------------------- |
| name     | string                                                                                                                                                                           | the name of the parameter                                                                                                                      |
| type     | integer                                                                                                                                                                          | value of [application command option type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-type) |
| value?   | string, integer, or double                                                                                                                                                       | the value of the option resulting from user input                                                                                              |
| options? | array of [application command interaction data option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-interaction-data-option-structure) | present if this option is a group or subcommand                                                                                                |
| focused? | boolean                                                                                                                                                                          | true if this option is the currently focused option for autocomplete                                                                           |

## Authorizing Your Application

Application commands do not depend on a bot user in the guild; they use the [interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/) model. To create commands in a guild, your app must be authorized with the `applications.commands` scope.

> danger
> **In order to make commands work within a guild, the guild must authorize your application with the `applications.commands` scope. The `bot` scope is not enough.**

When requesting this scope, we "shortcut" the OAuth2 flow similar to adding a bot. You don't need to complete the flow, exchange for a token, or any of that.

If your application does not require a bot user within the guild for its commands to work, **you no longer need to add for the bot scope or specific permissions**.


## Registering a Command

> info
> Commands can only be registered via HTTP endpoint.

Commands can be scoped either globally or to a specific guild. Global commands are available for every guild that adds your app. An individual app's global commands are also available in DMs if that app has a bot that shares a mutual guild with the user.

Guild commands are specific to the guild you specify when making them. Guild commands are not available in DMs. Command names are unique per application, per type, within each scope (global and guild). That means:

- Your app **cannot** have two global `CHAT_INPUT` commands with the same name
- Your app **cannot** have two guild `CHAT_INPUT` commands within the same name **on the same guild**
- Your app **cannot** have two global `USER` commands with the same name
- Your app **can** have a global and guild `CHAT_INPUT` command with the same name
- Your app **can** have a global `CHAT_INPUT` and `USER` command with the same name
- Multiple apps **can** have commands with the same names

This list is non-exhaustive. In general, remember that command names must be unique per application, per type, and within each scope (global and guild).

An app can have the following number of commands:

- 100 global `CHAT_INPUT` commands
- 5 global `USER` commands
- 5 global `MESSAGE` commands

As well as the same amount of guild-specific commands per guild.

> danger
> There is a global rate limit of 200 application command creates per day, per guild

### Making a Global Command

Global commands are available on _all_ your app's guilds. Global commands are cached for **1 hour**. That means that new global commands will fan out slowly across all guilds, and will be guaranteed to be updated in an hour.

Global commands have inherent read-repair functionality. That means that if you make an update to a global command, and a user tries to use that command before it has updated for them, Discord will do an internal version check and reject the command, and trigger a reload for that command.

To make a **global** command, make an HTTP POST call like this:

```py
import requests


url = "https://discord.com/api/v8/applications/<my_application_id>/commands"

# This is an example CHAT_INPUT or Slash Command, with a type of 1
json = {
    "name": "blep",
    "type": 1,
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
    "Authorization": "Bot <my_bot_token>"
}

# or a client credentials token for your app with the applications.commands.update scope
headers = {
    "Authorization": "Bearer <my_credentials_token>"
}

r = requests.post(url, headers=headers, json=json)
```

### Making a Guild Command

Guild commands are available only within the guild specified on creation. Guild commands update **instantly**. We recommend you use guild commands for quick testing, and global commands when they're ready for public use.

To make a **guild** command, make a similar HTTP POST call, but scope it to a specific `guild_id`:

```py
import requests


url = "https://discord.com/api/v8/applications/<my_application_id>/guilds/<guild_id>/commands"

# This is an example USER command, with a type of 2
json = {
    "name": "High Five",
    "type": 2
}

# For authorization, you can use either your bot token
headers = {
    "Authorization": "Bot <my_bot_token>"
}

# or a client credentials token for your app with the applications.commands.update scope
headers = {
    "Authorization": "Bearer <my_credentials_token>"
}

r = requests.post(url, headers=headers, json=json)
```

## Updating and Deleting a Command

Commands can be deleted and updated by making `DELETE` and `PATCH` calls to the command endpoint. Those endpoints are

- `applications/<my_application_id>/commands/<command_id>` for global commands, or
- `applications/<my_application_id>/guilds/<guild_id>/commands/<command_id>` for guild commands

Because commands have unique names within a type and scope, we treat `POST` requests for new commands as upserts. That means **making a new command with an already-used name for your application will update the existing command**.

Full documentation of endpoints can be found [here](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/endpoints).

## Permissions

### Application Command Permissions Object

###### Guild Application Command Permissions Structure

Returned when fetching the permissions for a command in a guild.

| Field          | Type                                                                                                                                                                 | Description                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| id             | snowflake                                                                                                                                                            | the id of the command                            |
| application_id | snowflake                                                                                                                                                            | the id of the application the command belongs to |
| guild_id       | snowflake                                                                                                                                                            | the id of the guild                              |
| permissions    | array of [application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permissions-structure) | the permissions for the command in the guild     |

###### Application Command Permissions Structure

Application command permissions allow you to enable or disable commands for specific users or roles within a guild.

| Field      | Type                                                                                                                                                      | Description                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| id         | snowflake                                                                                                                                                 | the id of the role or user            |
| type       | [application command permission type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permission-type) | role or user                          |
| permission | boolean                                                                                                                                                   | `true` to allow, `false`, to disallow |

###### Application Command Permission Type

| Name | Value |
| ---- | ----- |
| ROLE | 1     |
| USER | 2     |

Need to keep some of your commands safe from prying eyes, or only available to the right people? Commands support permission overwrites! For both guild _and_ global commands of all types, you can enable or disable a specific user or role in a guild from using a command.

> info
> For now, if you don't have permission to use a command, they'll show up in the command picker as disabled and unusable. They will **not** be hidden.

You can also set a `default_permission` on your commands if you want them to be disabled by default when your app is added to a new guild. Setting `default_permission` to `false` will disallow _anyone_ in a guild from using the command, unless a specific overwrite is configured. It will also disable the command from being usable in DMs.

For example, this command will not be usable by anyone in any guilds by default:

```json
{
    "name": "permissions_test",
    "description": "A test of default permissions",
    "type": 1,
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
    "Authorization": "Bot <my_bot_token>"
}

r = requests.put(url, headers=headers, json=json)
```

## Slash Commands

Slash commands—the `CHAT_INPUT` type—are a type of application command. They're made up of a name, description, and a block of `options`, which you can think of like arguments to a function. The name and description help users find your command among many others, and the `options` validate user input as they fill out your command.

Slash commands can also have groups and subcommands to further organize commands. More on those later.

> warn
> Slash commands can have a maximum of 4000 characters for combined name, description, and value properties for each command and its subcommands and groups


###### Example Slash Command

```json
{
    "name": "blep",
    "type": 1,
    "description": "Send a random adorable animal photo",
    "options": [
        {
            "name": "animal",
            "description": "The type of animal",
            "type": 3,
            "required": true,
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
            "required": false
        }
    ]
}
```

When someone uses a slash command, your application will receive an interaction:

###### Example Interaction

```js
{
    "type": 2,
    "token": "A_UNIQUE_TOKEN",
    "member": {
        "user": {
            "id": "53908232506183680",
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
    "guild_locale": "en-US",
    "locale": "en-US",
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

## Subcommands and Subcommand Groups

> warn
> Currently, subcommands and subcommand groups all appear at the top level in the command explorer. This may change in the future to include them as nested autocomplete options.

For those developers looking to make more organized and complex groups of commands, look no further than subcommands and groups.

**Subcommands** organize your commands by **specifying actions within a command or group**.

**Subcommand Groups** organize your **subcommands** by **grouping subcommands by similar action or resource within a command**.

These are not enforced rules. You are free to use subcommands and groups however you'd like; it's just how we think about them.

> danger
> Using subcommands or subcommand groups will make your base command unusable. You can't send the base `/permissions` command as a valid command if you also have `/permissions add | remove` as subcommands or subcommand groups

We support nesting one level deep within a group, meaning your top level command can contain subcommand groups, and those groups can contain subcommands. **That is the only kind of nesting supported.** Here's some visual examples:

```
VALID

command
|
|__ subcommand
|
|__ subcommand

----

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

----

VALID

command
|
|__ subcommand-group
    |
    |__ subcommand
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

## User Commands

User commands are application commands that appear on the context menu (right click or tap) of users. They're a great way to surface quick actions for your app that target users. They don't take any arguments, and will return the user on whom you clicked or tapped in the interaction response.

> warn
> A user must have permission to send text messages in the channel they invoke a user command in. If they don't have this permission, they will receive a 'Permission Denied' error from the interaction.

> danger
> The `description` field is not allowed when creating user commands. However, to avoid breaking changes to data models, `description` will be an **empty string** (instead of `null`) when fetching commands.

###### Example User Command

```json
{
    "name": "High Five",
    "type": 2
}
```

![An example user command. The context menu has an Apps section open to a High Five command](user-command.png)

When someone uses a user command, your application will receive an interaction:

###### Example Interaction

```json
{
    "application_id": "775799577604522054",
    "channel_id": "772908445358620702",
    "data": {
        "id": "866818195033292850",
        "name": "context-menu-user-2",
        "resolved": {
            "members": {
                "809850198683418695": {
                    "avatar": null,
                    "is_pending": false,
                    "joined_at": "2021-02-12T18:25:07.972000+00:00",
                    "nick": null,
                    "pending": false,
                    "permissions": "246997699136",
                    "premium_since": null,
                    "roles": []
                }
            },
            "users": {
                "809850198683418695": {
                    "avatar": "afc428077119df8aabbbd84b0dc90c74",
                    "bot": true,
                    "discriminator": "7302",
                    "id": "809850198683418695",
                    "public_flags": 0,
                    "username": "VoltyDemo"
                }
            }
        },
        "target_id": "809850198683418695",
        "type": 2
    },
    "guild_id": "772904309264089089",
    "guild_locale": "en-US",
    "id": "867794291820986368",
    "locale": "en-US",
    "member": {
        "avatar": null,
        "deaf": false,
        "is_pending": false,
        "joined_at": "2020-11-02T20:46:57.364000+00:00",
        "mute": false,
        "nick": null,
        "pending": false,
        "permissions": "274877906943",
        "premium_since": null,
        "roles": ["785609923542777878"],
        "user": {
            "avatar": "a_f03401914fb4f3caa9037578ab980920",
            "discriminator": "6538",
            "id": "167348773423415296",
            "public_flags": 1,
            "username": "ian"
        }
    },
    "token": "UNIQUE_TOKEN",
    "type": 2,
    "version": 1
}
```


## Message Commands

Message commands are application commands that appear on the context menu (right click or tap) of messages. They're a great way to surface quick actions for your app that target messages. They don't take any arguments, and will return the message on whom you clicked or tapped in the interaction response.

> danger
> The `description` field is not allowed when creating message commands. However, to avoid breaking changes to data models, `description` will be an **empty string** (instead of `null`) when fetching commands.

###### Example Message Command

```json
{
    "name": "Bookmark",
    "type": 3
}
```

![An example message command. The context menu has an Apps section open to a Bookmark command](message-command.png)

When someone uses a message command, your application will receive an interaction:

###### Example Interaction

```json
{
    "application_id": "775799577604522054",
    "channel_id": "772908445358620702",
    "data": {
        "id": "866818195033292851",
        "name": "context-menu-message-2",
        "resolved": {
            "messages": {
                "867793854505943041": {
                    "attachments": [],
                    "author": {
                        "avatar": "a_f03401914fb4f3caa9037578ab980920",
                        "discriminator": "6538",
                        "id": "167348773423415296",
                        "public_flags": 1,
                        "username": "ian"
                    },
                    "channel_id": "772908445358620702",
                    "components": [],
                    "content": "some message",
                    "edited_timestamp": null,
                    "embeds": [],
                    "flags": 0,
                    "id": "867793854505943041",
                    "mention_everyone": false,
                    "mention_roles": [],
                    "mentions": [],
                    "pinned": false,
                    "timestamp": "2021-07-22T15:42:57.744000+00:00",
                    "tts": false,
                    "type": 0
                }
            }
        },
        "target_id": "867793854505943041",
        "type": 3
    },
    "guild_id": "772904309264089089",
    "guild_locale": "en-US",
    "id": "867793873336926249",
    "locale": "en-US",
    "member": {
        "avatar": null,
        "deaf": false,
        "is_pending": false,
        "joined_at": "2020-11-02T20:46:57.364000+00:00",
        "mute": false,
        "nick": null,
        "pending": false,
        "permissions": "274877906943",
        "premium_since": null,
        "roles": ["785609923542777878"],
        "user": {
            "avatar": "a_f03401914fb4f3caa9037578ab980920",
            "discriminator": "6538",
            "id": "167348773423415296",
            "public_flags": 1,
            "username": "ian"
        }
    },
    "token": "UNIQUE_TOKEN",
    "type": 2,
    "version": 1
}
```

## Autocomplete

Autocomplete interactions allow your application to dynamically return option suggestions to a user as they type.

An autocomplete interaction **can return partial data** for option values. Your application will receive partial data for any existing user input, as long as that input passes client-side validation. For example, you may receive partial strings, but not invalid numbers. The option the user is currently typing will be sent with a `focused: true` boolean field and options the user has already filled will also be sent but without the `focused` field. This is a special case where options that are otherwise required might not be present, due to the user not having filled them yet.

> warn
> This validation is **client-side only**.

```json
{
  "type": 4,
  "data": {
    "id": "816437322781949972",
    "name": "airhorn",
    "type": 1,
    "version": "847194950382780532",
    "options": [
      {
        "type": 3,
        "name": "variant",
        "value": "data a user is typ",
        "focused": true
      }
    ]
  }
}
```

## Localization

Slash commands can be localized, which will cause them to use localized names and descriptions depending on the client's selected language. This is entirely optional. Localization is available for names and descriptions of commands, subcommands, and options, as well as the names of choices, by submitting the appropriate `name_localizations` and `description_localizations` fields when creating or updating the application command.

Application commands may be partially localized - not all [available locales](#DOCS_REFERENCE/locales) are required, nor do different fields within a command need to support the same set of locales. If a locale is not present in a localizations dictionary for a field, users in that locale will see the default value for that field. It's not necessary to fill out all locales with the default value. Any localized values that are identical to the default will be ignored.

Localized option names are subject to an additional constraint, which is that they must be distinct from all other default option names of that command, as well as all other option names within that locale on that command.

When taking advantage of slash command localization, the interaction payload received by your client will still use default command, subcommand, and option names. To localize your interaction response, you can determine the client's selected language by using the `locale` key in the interaction payload.

An application command furnished with localizations might look like this:

```json
{
  "name": "birthday",
  "type": 1,
  "description": "Wish a friend a happy birthday",
  "name_localizations": {
    "zh-CN": "生日",
    "el": "γενέθλια"
  },
  "description_localizations": {
    "zh-CN": "祝你朋友生日快乐"
  },
  "options": [
    {
      "name": "age",
      "type": 4,
      "description": "Your friend's age",
      "name_localizations": {
        "zh-CN": "岁数"
      },
      "description_localizations": {
        "zh-CN": "你朋友的岁数"
      }
    }
  ]
}
```

### Retrieving localized commands

While most endpoints that return application command objects will return the `name_localizations` and `description_localizations` fields, some will not by default. This includes `GET` endpoints that return all of an application's guild or global commands. Instead, those endpoints will supply additional `name_localized` or `description_localized` fields, which only contain the localization relevant to the requester's locale. (The full dictionaries can still be obtained by supplying the appropriate query argument).

For example, if a batch `GET` request were made with locale `zh-CN`, including the above command, the returned object would look as follows:

```json
{
  "name": "birthday",
  "type": 1,
  "description": "Wish a friend a happy birthday",
  "name_localized": "生日",
  "description_localized": "祝你朋友生日快乐",
  "options": [
    {
      "name": "age",
      "type": 4,
      "description": "Your friend's age",
      "name_localized": "岁数",
      "description_localized": "你朋友的岁数",
    }
  ]
}
```

If the requester's locale is not found in a localizations dictionary, then the corresponding `name_localization` or `description_localization` for that field will also not be present.

Locale is determined by looking at the `X-Discord-Locale` header, then the `Accept-Language` header if not present, then lastly the user settings locale.

### Endpoints

> info
> For authorization, all endpoints take either a [bot token](#DOCS_REFERENCE/authentication) or [client credentials token](#DOCS_TOPICS_OAUTH2/client-credentials-grant) for your application

## Get Global Application Commands % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

> warn
> The objects returned by this endpoint may be augmented with [additional fields if localization is active](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/retrieving-localized-commands).

Fetch all of the global commands for your application. Returns an array of [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) objects.

###### Query String Params

| Field               | Type    | Description                                                                                                                                                                                                            |
|---------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| with_localizations? | boolean | Whether to include full localization dictionaries (`name_localizations` and `description_localizations`) in the returned objects, instead of the `name_localized` and `description_localized` fields. Default `false`. |

## Create Global Application Command % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new global command. New global commands will be available in all guilds after 1 hour. Returns `201` and an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object.

###### JSON Params

| Field               | Type                                                                                                                                           | Description                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| name                | string                                                                                                                                         | [1-32 character name](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming)                     |
| description         | string                                                                                                                                         | 1-100 character description                                                                                                              |
| options?            | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                                                                                           |
| default_permission? | boolean (default `true`)                                                                                                                       | whether the command is enabled by default when the app is added to a guild                                                               |
| type?               | one of [application command type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-types)                | the type of command, defaults `1` if not set                                                                                             |

## Get Global Application Command % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

Fetch a global command for your application. Returns an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object.

## Edit Global Application Command % PATCH /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

> info
> All parameters for this endpoint are optional.

Edit a global command. Updates will be available in all guilds after 1 hour. Returns `200` and an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object.

###### JSON Params

| Field               | Type                                                                                                                                           | Description                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| name?               | string                                                                                                                                         | [1-32 character name](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming)  |
| description?        | string                                                                                                                                         | 1-100 character description                                                                                           |
| options?            | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                                                                        |
| default_permission? | boolean (default `true`)                                                                                                                       | whether the command is enabled by default when the app is added to a guild                                            |

## Delete Global Application Command % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

Deletes a global command. Returns `204 No Content` on success.

## Bulk Overwrite Global Application Commands % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

Takes a list of application commands, overwriting the existing global command list for this application. Updates will be available in all guilds after 1 hour. Returns `200` and a list of [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) objects. Commands that do not already exist will count toward daily application command create limits.

> danger
> This will overwrite **all** types of application commands: slash commands, user commands, and message commands.

## Get Guild Application Commands % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

> warn
> The objects returned by this endpoint may be augmented with [additional fields if localization is active](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/retrieving-localized-commands).

Fetch all of the guild commands for your application for a specific guild. Returns an array of [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) objects.

###### Query String Params

| Field               | Type    | Description                                                                                                                                                                                                            |
|---------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| with_localizations? | boolean | Whether to include full localization dictionaries (`name_localizations` and `description_localizations`) in the returned objects, instead of the `name_localized` and `description_localized` fields. Default `false`. |

## Create Guild Application Command % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new guild command. New guild commands will be available in the guild immediately. Returns `201` and an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object. If the command did not already exist, it will count toward daily application command create limits.

###### JSON Params

| Field               | Type                                                                                                                                           | Description                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| name                | string                                                                                                                                         | [1-32 character name](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming)  |
| description         | string                                                                                                                                         | 1-100 character description                                                                                           |
| options?            | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                                                                        |
| default_permission? | boolean (default `true`)                                                                                                                       | whether the command is enabled by default when the app is added to a guild                                            |
| type?               | one of [application command type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-types)                | the type of command, defaults `1` if not set                                                                          |

## Get Guild Application Command % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

Fetch a guild command for your application. Returns an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object.

## Edit Guild Application Command % PATCH /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

> info
> All parameters for this endpoint are optional.

Edit a guild command. Updates for guild commands will be available immediately. Returns `200` and an [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) object.

###### JSON Params

| Field               | Type                                                                                                                                           | Description                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| name?               | string                                                                                                                                         | [1-32 character name](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming)  |
| description?        | string                                                                                                                                         | 1-100 character description                                                                                           |
| options?            | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                                                                        |
| default_permission? | boolean (default `true`)                                                                                                                       | whether the command is enabled by default when the app is added to a guild                                            |

## Delete Guild Application Command % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}

Delete a guild command. Returns `204 No Content` on success.

## Bulk Overwrite Guild Application Commands % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

Takes a list of application commands, overwriting the existing command list for this application for the targeted guild. Returns `200` and a list of [application command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object) objects.

> danger
> This will overwrite **all** types of application commands: slash commands, user commands, and message commands.

###### Bulk Application Command JSON Params

| Field               | Type                                                                                                                                           | Description                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| id                | snowflake                                                                                                                                         | application command id, if known |
| name                | string                                                                                                                                         | [1-32 character name](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-naming)  |
| description         | string                                                                                                                                         | 1-100 character description                                                                                           |
| options?            | array of [application command option](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                                                                        |
| default_permission? | boolean (default `true`)                                                                                                                       | whether the command is enabled by default when the app is added to a guild                                            |
| type?               | one of [application command type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-types)                | the type of command, defaults `1` if not set                                                                          |

## Get Guild Application Command Permissions % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/permissions

Fetches command permissions for all commands for your application in a guild. Returns an array of [guild application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) objects.

## Get Application Command Permissions % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}/permissions

Fetches command permissions for a specific command for your application in a guild. Returns a [guild application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) object.

## Edit Application Command Permissions % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object}/permissions

> warn
> This endpoint will overwrite existing permissions for the command in that guild

Edits command permissions for a specific command for your application in a guild.
You can only add up to 10 permission overwrites for a command.
Returns a [GuildApplicationCommandPermissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) object.

> warn
> Deleting or renaming a command will permanently delete all permissions for that command

###### JSON Params

| Field       | Type                                                                                                                                                                 | Description                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| permissions | array of [application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permissions-structure) | the permissions for the command in the guild |

## Batch Edit Application Command Permissions % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/permissions

> warn
> This endpoint will overwrite all existing permissions for all commands in a guild, including slash commands, user commands, and message commands.

Batch edits permissions for all commands in a guild. Takes an array of partial [guild application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) objects including `id` and `permissions`.

You can only add up to 10 permission overwrites for a command.

Returns an array of [GuildApplicationCommandPermissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) objects.

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
                "permission": True
            }
        ]
    },
    {
        "id": SECOND_COMMAND_ID,
        "permissions": [
            {
                "id": ADMIN_ROLE_ID,
                "type": 1,
                "permission": False
            }
        ]
    }
]

headers = {
    "Authorization": "Bot <my_bot_token>"
}

r = requests.put(url, headers=headers, json=json)
```
