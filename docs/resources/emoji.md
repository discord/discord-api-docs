---
sidebar_label: Emoji
---

# Emoji Resource

> warn
> Routes for controlling emojis do not follow the normal rate limit conventions. These routes are specifically limited on a per-guild basis to prevent abuse. This means that the quota returned by our APIs may be inaccurate, and you may encounter 429s.

### Emoji Object

###### Emoji Structure

| Field           | Type                                                             | Description                                                               |
|-----------------|------------------------------------------------------------------|---------------------------------------------------------------------------|
| id              | ?snowflake                                                       | [emoji id](#DOCS_REFERENCE/image-formatting)                              |
| name            | ?string (can be null only in reaction emoji objects)             | emoji name                                                                |
| roles?          | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) object ids | roles allowed to use this emoji                                           |
| user?           | [user](#DOCS_RESOURCES_USER/user-object) object                  | user that created this emoji                                              |
| require_colons? | boolean                                                          | whether this emoji must be wrapped in colons                              |
| managed?        | boolean                                                          | whether this emoji is managed                                             |
| animated?       | boolean                                                          | whether this emoji is animated                                            |
| available?      | boolean                                                          | whether this emoji can be used, may be false due to loss of Server Boosts |

###### Premium Emoji

Roles with the `integration_id` tag being the guild's guild_subscription integration are considered subscription roles.  
An emoji cannot have both subscription roles and non-subscription roles.  
Emojis with subscription roles are considered premium emoji, and count toward a separate limit of 25.  
Emojis cannot be converted between normal and premium after creation.

###### Application-Owned Emoji

An application can own up to 2000 emojis that can only be used by that app.
App emojis can be managed using the API with a bot token, or using the app's settings in the portal.
The `USE_EXTERNAL_EMOJIS` permission is not required to use app emojis.
The `user` field of an app emoji object represents the team member that uploaded the emoji from the app's settings, or the bot user if uploaded using the API.

###### Emoji Example

```json
{
  "id": "41771983429993937",
  "name": "LUL",
  "roles": ["41771983429993000", "41771983429993111"],
  "user": {
    "username": "Luigi",
    "discriminator": "0002",
    "id": "96008815106887111",
    "avatar": "5500909a3274e1812beb4e8de6631111",
    "public_flags": 131328
  },
  "require_colons": true,
  "managed": false,
  "animated": false
}
```

###### Standard Emoji Example

```json
{
  "id": null,
  "name": "🔥"
}
```

###### Custom Emoji Examples

>info
>In `MESSAGE_REACTION_ADD`, `MESSAGE_REACTION_REMOVE` and `MESSAGE_REACTION_REMOVE_EMOJI` gateway events `animated` will be returned for animated emoji.

>info
>In `MESSAGE_REACTION_ADD` and `MESSAGE_REACTION_REMOVE` gateway events `name` may be `null` when custom emoji data is not available (for example, if it was deleted from the guild).

```json
{
  "id": "41771983429993937",
  "name": "LUL",
  "animated": true
}
```

```json
{
  "id": "41771983429993937",
  "name": null
}
```

## List Guild Emojis % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis

Returns a list of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects for the given guild. Includes `user` fields if the bot has the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission.

## Get Guild Emoji % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Returns an [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object for the given guild and emoji IDs. Includes the `user` field if the bot has the `MANAGE_GUILD_EXPRESSIONS` permission, or if the bot created the emoji and has the the `CREATE_GUILD_EXPRESSIONS` permission.

## Create Guild Emoji % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis

Create a new emoji for the guild. Requires the `CREATE_GUILD_EXPRESSIONS` permission. Returns the new [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_EVENTS_GATEWAY_EVENTS/guild-emojis-update) Gateway event.

> warn
> Emojis and animated emojis have a maximum file size of 256 KiB. Attempting to upload an emoji larger than this limit will fail and return 400 Bad Request and an error message, but not a [JSON status code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/json).

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field | Type                                     | Description                     |
|-------|------------------------------------------|---------------------------------|
| name  | string                                   | name of the emoji               |
| image | [image data](#DOCS_REFERENCE/image-data) | the 128x128 emoji image         |
| roles | array of snowflakes                      | roles allowed to use this emoji |

## Modify Guild Emoji % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Modify the given emoji. For emojis created by the current user, requires either the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission. For other emojis, requires the `MANAGE_GUILD_EXPRESSIONS` permission. Returns the updated [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_EVENTS_GATEWAY_EVENTS/guild-emojis-update) Gateway event.

> info
> All parameters to this endpoint are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field | Type                 | Description                     |
|-------|----------------------|---------------------------------|
| name  | string               | name of the emoji               |
| roles | ?array of snowflakes | roles allowed to use this emoji |

## Delete Guild Emoji % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Delete the given emoji. For emojis created by the current user, requires either the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission. For other emojis, requires the `MANAGE_GUILD_EXPRESSIONS` permission. Returns `204 No Content` on success. Fires a [Guild Emojis Update](#DOCS_EVENTS_GATEWAY_EVENTS/guild-emojis-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## List Application Emojis % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/emojis

Returns an object containing a list of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects for the given application under the `items` key. Includes a `user` object for the team member that uploaded the emoji from the app's settings, or for the bot user if uploaded using the API.

```json
{
  "items": [
    {
      "id": "41771983429993937",
      "name": "LUL",
      "roles": [],
      "user": {
        "username": "Luigi",
        "discriminator": "0002",
        "id": "96008815106887111",
        "avatar": "5500909a3274e1812beb4e8de6631111",
        "public_flags": 131328
      },
      "require_colons": true,
      "managed": false,
      "animated": false
    }
  ]
}
```

## Get Application Emoji % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Returns an [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object for the given application and emoji IDs. Includes the `user` field.

## Create Application Emoji % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/emojis

Create a new emoji for the application. Returns the new [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success.

> warn
> Emojis and animated emojis have a maximum file size of 256 KiB. Attempting to upload an emoji larger than this limit will fail and return 400 Bad Request and an error message, but not a [JSON status code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/json).

###### JSON Params

| Field | Type                                     | Description             |
|-------|------------------------------------------|-------------------------|
| name  | string                                   | name of the emoji       |
| image | [image data](#DOCS_REFERENCE/image-data) | the 128x128 emoji image |

## Modify Application Emoji % PATCH /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Modify the given emoji. Returns the updated [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success.

###### JSON Params

| Field | Type   | Description       |
|-------|--------|-------------------|
| name  | string | name of the emoji |

## Delete Application Emoji % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Delete the given emoji. Returns `204 No Content` on success.
