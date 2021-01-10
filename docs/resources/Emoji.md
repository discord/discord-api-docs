# Emoji Resource

> warn
> Routes for controlling emojis do not follow the normal rate limit conventions. These routes are specifically limited on a per-guild basis to prevent abuse. This means that the quota returned by our APIs may be inaccurate, and you may encounter 429s.

### Emoji Object

###### Emoji Structure

| Field           | Type                                                             | Description                                                               |
| --------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| id              | ?snowflake                                                       | [emoji id](#DOCS_REFERENCE/image-formatting)                              |
| name            | ?string (can be null only in reaction emoji objects)             | emoji name                                                                |
| roles?          | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) object ids | roles this emoji is whitelisted to                                        |
| user?           | [user](#DOCS_RESOURCES_USER/user-object) object                  | user that created this emoji                                              |
| require_colons? | boolean                                                          | whether this emoji must be wrapped in colons                              |
| managed?        | boolean                                                          | whether this emoji is managed                                             |
| animated?       | boolean                                                          | whether this emoji is animated                                            |
| available?      | boolean                                                          | whether this emoji can be used may be false due to loss of Server Boosts |


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
    "avatar": "5500909a3274e1812beb4e8de6631111"
  },
  "require_colons": true,
  "managed": false,
  "animated": false
}
```

###### Gateway Reaction Standard Emoji Example

```json
{
  "id": null,
  "name": "🔥"
}
```

###### Gateway Reaction Custom Emoji Examples

>info
>In `MESSAGE_REACTION_ADD` gateway events, `animated` will be returned for animated emoji.

>info
>In `MESSAGE_REACTION_ADD` and `MESSAGE_REACTION_REMOVE` gateway events `name` maybe `null` when custom emoji data is not available (for example, if it was deleted from the guild).

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

Returns a list of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects for the given guild.

## Get Guild Emoji % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Returns an [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object for the given guild and emoji IDs.

## Create Guild Emoji % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis

Create a new emoji for the guild. Requires the `MANAGE_EMOJIS` permission. Returns the new [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_TOPICS_GATEWAY/guild-emojis-update) Gateway event.

> warn
> Emojis and animated emojis have a maximum file size of 256kb. Attempting to upload an emoji larger than this limit will fail and return 400 Bad Request and an error message, but not a [JSON status code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/json).

###### JSON Params

| Field | Type                                     | Description                                    |
| ----- | ---------------------------------------- | ---------------------------------------------- |
| name  | string                                   | name of the emoji                              |
| image | [image data](#DOCS_REFERENCE/image-data) | the 128x128 emoji image                        |
| roles | array of snowflakes                      | roles for which this emoji will be whitelisted |

## Modify Guild Emoji % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Modify the given emoji. Requires the `MANAGE_EMOJIS` permission. Returns the updated [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_TOPICS_GATEWAY/guild-emojis-update) Gateway event.

> info
> All parameters to this endpoint are optional.

###### JSON Params

| Field | Type                 | Description                                   |
| ----- | -------------------- | --------------------------------------------- |
| name  | string               | name of the emoji                             |
| roles | ?array of snowflakes | roles to which this emoji will be whitelisted |

## Delete Guild Emoji % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/emojis/{emoji.id#DOCS_RESOURCES_EMOJI/emoji-object}

Delete the given emoji. Requires the `MANAGE_EMOJIS` permission. Returns `204 No Content` on success. Fires a [Guild Emojis Update](#DOCS_TOPICS_GATEWAY/guild-emojis-update) Gateway event.
