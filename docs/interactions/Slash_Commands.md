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

**Slash Commands** (synonymous with application commands) are made up of a name, description, and a block of `options`, which you can think of like arguments to a function. The name and description help users find your command among many others, and the `options` validate user input as they fill out your command.

Your global commands are available in every guild that adds your application. You can also make commands for a specific guild; they're only available in that guild.

## Slash Commands and Interactions

Slash Commands do not depend on a bot user in the guild, instead utilizing _only_ the [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/) model.

## Authorizing Your Application

Since you can implement slash commands without a bot, there is a new special OAuth2 scope for applications called `applications.commands`.

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
    "Authorization": "Bot <my_bot_token>"
}

# or a client credentials token for your app with the applications.commands.update scope
headers = {
    "Authorization": "Bearer <my_credentials_token>"
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

Take a look at the [application command option data structure](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) for extensive info about the types of `options` you can use.

## Updating and Deleting a Command

Slash Commands can be deleted and updated by making `DELETE` and `PATCH` calls to the command endpoint. Those endpoints are

- `applications/<my_application_id>/commands/<command_id>` for global commands, or
- `applications/<my_application_id>/guilds/<guild_id>/commands/<command_id>` for guild commands

Because Slash Commands have unique names within a scope, we treat `POST` requests for new commands as upserts. That means **making a new command with an already-used name for your application will update the existing command**.

Full documentation of endpoints can be found [here](#DOCS_INTERACTIONS_SLASH_COMMANDS/endpoints).

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
    "Authorization": "Bot <my_bot_token>"
}

r = requests.put(url, headers=headers, json=json)
```

### Endpoints

> info
> For authorization, all endpoints take either a [bot token](#DOCS_REFERENCE/authentication) or [client credentials token](#DOCS_TOPICS_OAUTH2/client-credentials-grant) for your application

## Get Global Application Commands % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

Fetch all of the global commands for your application. Returns an array of [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) objects.

## Create Global Application Command % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new global command. New global commands will be available in all guilds after 1 hour. Returns `201` and an [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) object.

###### JSON Params

| Field               | Type                                                                                                                                     | Description                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| name                | string                                                                                                                                   | 1-32 lowercase character name matching `^[\w-]{1,32}$`                     |
| description         | string                                                                                                                                   | 1-100 character description                                                |
| options?            | array of [application command option](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                             |
| default_permission? | boolean (default `true`)                                                                                                                 | whether the command is enabled by default when the app is added to a guild |

## Get Global Application Command % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object}

Fetch a global command for your application. Returns an [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) object.

## Edit Global Application Command % PATCH /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object}

> info
> All parameters for this endpoint are optional.

Edit a global command. Updates will be available in all guilds after 1 hour. Returns `200` and an [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) object.

###### JSON Params

| Field               | Type                                                                                                                                     | Description                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| name                | string                                                                                                                                   | 1-32 lowercase character name matching `^[\w-]{1,32}$`                     |
| description         | string                                                                                                                                   | 1-100 character description                                                |
| options?            | array of [application command option](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                             |
| default_permission? | boolean (default `true`)                                                                                                                 | whether the command is enabled by default when the app is added to a guild |

## Delete Global Application Command % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object}

Deletes a global command. Returns `204`.

## Get Guild Application Commands % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

Fetch all of the guild commands for your application for a specific guild. Returns an array of [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) objects.

## Bulk Overwrite Global Application Commands % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/commands

Takes a list of application commands, overwriting existing commands that are registered globally for this application. Updates will be available in all guilds after 1 hour. Returns `200` and a list of [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) objects. Commands that do not already exist will count toward daily application command create limits.

## Create Guild Application Command % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

> danger
> Creating a command with the same name as an existing command for your application will overwrite the old command.

Create a new guild command. New guild commands will be available in the guild immediately. Returns `201` and an [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) object. If the command did not already exist, it will count toward daily application command create limits.

###### JSON Params

| Field               | Type                                                                                                                                     | Description                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| name                | string                                                                                                                                   | 1-32 lowercase character name matching `^[\w-]{1,32}$`                     |
| description         | string                                                                                                                                   | 1-100 character description                                                |
| options?            | array of [application command option](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                             |
| default_permission? | boolean (default `true`)                                                                                                                 | whether the command is enabled by default when the app is added to a guild |

## Get Guild Application Command % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object}

Fetch a guild command for your application. Returns an [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) object.

## Edit Guild Application Command % PATCH /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object}

> info
> All parameters for this endpoint are optional.

Edit a guild command. Updates for guild commands will be available immediately. Returns `200` and an [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) object.

###### JSON Params

| Field               | Type                                                                                                                                     | Description                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| name                | string                                                                                                                                   | 1-32 lowercase character name matching `^[\w-]{1,32}$`                     |
| description         | string                                                                                                                                   | 1-100 character description                                                |
| options?            | array of [application command option](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                             |
| default_permission? | boolean (default `true`)                                                                                                                 | whether the command is enabled by default when the app is added to a guild |

## Delete Guild Application Command % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object}

Delete a guild command. Returns `204` on success.

## Bulk Overwrite Guild Application Commands % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands

Takes a list of application commands, overwriting existing commands for the guild. Returns `200` and a list of [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object) objects.

## Get Guild Application Command Permissions % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/permissions

Fetches command permissions for all commands for your application in a guild. Returns an array of [guild application command permissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) objects.

## Get Application Command Permissions % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object}/permissions

Fetches command permissions for a specific command for your application in a guild. Returns a [guild application command permissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) object.

## Edit Application Command Permissions % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/{command.id#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object}/permissions

> warn
> This endpoint will overwrite existing permissions for the command in that guild

Edits command permissions for a specific command for your application in a guild.
You can only add up to 10 permission overwrites for a command.
Returns a [GuildApplicationCommandPermissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) object.

> warn
> Deleting or renaming a command will permanently delete all permissions for that command

###### JSON Params

| Field       | Type                                                                                                                                                           | Description                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| permissions | array of [application command permissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-application-command-permissions-structure) | the permissions for the command in the guild |

## Batch Edit Application Command Permissions % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/commands/permissions

> warn
> This endpoint will overwrite all existing permissions for all commands in a guild

Batch edits permissions for all commands in a guild. Takes an array of partial [guild application command permissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) objects including `id` and `permissions`.
You can only add up to 10 permission overwrites for a command.
Returns an array of [GuildApplicationCommandPermissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) objects.

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

## Data Models and Types

### Application Command Object

###### Application Command Structure

> info
> A command, or each individual subcommand, can have a maximum of 25 `options`

An application command is the base "command" model that belongs to an application. This is what you are creating when you `POST` a new command.

| Field               | Type                                                                                                                                     | Description                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| id                  | snowflake                                                                                                                                | unique id of the command                                                   |
| application_id      | snowflake                                                                                                                                | unique id of the parent application                                        |
| guild_id?           | snowflake                                                                                                                                | guild id of the command, if not global                                     |
| name                | string                                                                                                                                   | 1-32 lowercase character name matching `^[\w-]{1,32}$`                     |
| description         | string                                                                                                                                   | 1-100 character description                                                |
| options?            | array of [application command option](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure) | the parameters for the command                                             |
| default_permission? | boolean (default `true`)                                                                                                                 | whether the command is enabled by default when the app is added to a guild |

> warn
> Required `options` must be listed before optional options

###### Application Command Option Structure

> info
> You can specify a maximum of 25 `choices` per option

| Field       | Type                                                                                                                                                   | Description                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| type        | integer                                                                                                                                                | value of [application command option type](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-type) |
| name        | string                                                                                                                                                 | 1-32 lowercase character name matching `^[\w-]{1,32}$`                                                                                   |
| description | string                                                                                                                                                 | 1-100 character description                                                                                                              |
| required?   | boolean                                                                                                                                                | if the parameter is required or optional--default `false`                                                                                |
| choices?    | array of [application command option choice](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-choice-structure) | choices for `string` and `int` types for the user to pick from                                                                           |
| options?    | array of [application command option](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-structure)               | if the option is a subcommand or subcommand group type, this nested options will be the parameters                                       |

###### Application Command Option Type

| Name              | Value |
| ----------------- | ----- |
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

| Field | Type              | Description                                         |
| ----- | ----------------- |---------------------------------------------------- |
| name  | string            | 1-100 character choice name                         |
| value | string or integer | value of the choice, up to 100 characters if string |

### Application Command Permissions Object

###### Guild Application Command Permissions Structure

Returned when fetching the permissions for a command in a guild.

| Field          | Type                                                                                                                                                           | Description                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| id             | snowflake                                                                                                                                                      | the id of the command                            |
| application_id | snowflake                                                                                                                                                      | the id of the application the command belongs to |
| guild_id       | snowflake                                                                                                                                                      | the id of the guild                              |
| permissions    | array of [application command permissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-application-command-permissions-structure) | the permissions for the command in the guild     |

###### Application Command Permissions Structure

Application command permissions allow you to enable or disable commands for specific users or roles within a guild.

| Field      | Type                                                                                                                                                | Description                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| id         | snowflake                                                                                                                                           |  the id of the role or user           |
| type       | [application command permission type](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-permissions-object-application-command-permission-type) | role or user                          |
| permission | boolean                                                                                                                                             | `true` to allow, `false`, to disallow |

###### Application Command Permission Type

| Name | Value |
| ---- | ----- |
| ROLE | 1     |
| USER | 2     |

### Application Command Interaction Object

##### Sample Application Command Interaction

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

###### Application Command Interaction Data Resolved Structure

> info
> If data for a Member is included, data for its corresponding User will also be included.

| Field         | Type                                                                                     | Description                         |
| ------------- | ---------------------------------------------------------------------------------------- | ----------------------------------- |
| users?        | Map of Snowflakes to [user](#DOCS_RESOURCES_USER/user-object) objects                    | the ids and User objects            |
| members?\*    | Map of Snowflakes to [partial member](#DOCS_RESOURCES_GUILD/guild-member-object) objects | the ids and partial Member objects  |
| roles?        | Map of Snowflakes to [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects                | the ids and Role objects            |
| channels?\*\* | Map of Snowflakes to [partial channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects   | the ids and partial Channel objects |

\* Partial `Member` objects are missing `user`, `deaf` and `mute` fields

\*\* Partial `Channel` objects only have `id`, `name`, `type` and `permissions` fields

###### Application Command Interaction Data Option Structure

All options have names, and an option can either be a parameter and input value--in which case `value` will be set--or it can denote a subcommand or group--in which case it will contain a top-level key and another array of `options`.

`value` and `options` are mutually exclusive.

| Field    | Type                                                                                                                                                               | Description                                                                                                                              |
| -------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| name     | string                                                                                                                                                             | the name of the parameter                                                                                                                |
| type     | integer                                                                                                                                                            | value of [application command option type](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-type) |
| value?   | [application command option type](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-option-type)                                    | the value of the pair                                                                                                                    |
| options? | array of [application command interaction data option](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-application-command-interaction-data-option-structure) | present if this option is a group or subcommand                                                                                          |