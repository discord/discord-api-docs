# Emoji Resource

>warn
>Routes for controlling emojis do not follow the normal rate limit conventions. These routes are specifically limited on a per-guild basis to prevent abuse. This means that the quota returned by our APIs may be inaccurate, and you may encounter 429s.

### Emoji Object

###### Emoji Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | [emoji id](#DOCS_REFERENCE/image-formatting) |
| name | string | emoji name |
| roles | array of [role object](#DOCS_PERMISSIONS/role-object) ids | roles this emoji is whitelisted to |
| user? | [user](#DOCS_USER/user-object) object | user that created this emoji |
| require\_colons | bool | whether this emoji must be wrapped in colons |
| managed | bool | whether this emoji is managed |

## List Guild Emojis % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/emojis

Returns a list of [emoji](#DOCS_EMOJI/emoji-object) objects for the given guild.

## Get Guild Emoji % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/emojis/{emoji.id#DOCS_EMOJI/emoji-object}

Returns an [emoji](#DOCS_EMOJI/emoji-object) object for the given guild and emoji IDs.

## Create Guild Emoji % POST /guilds/{guild.id#DOCS_GUILD/guild-object}/emojis

Create a new emoji for the guild. Returns the new [emoji](#DOCS_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_GATEWAY/guild-emojis-update) Gateway event.

>info
>Passing the roles field will be ignored unless the application is whitelisted as an emoji provider. For more information and to request whitelisting please contact support@discordapp.com

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| name | string | name of the emoji |
| image | base64 image data | the 128x128 emoji image |
| roles | array of snowflakes | roles for which this emoji will be whitelisted |

## Modify Guild Emoji % PATCH /guilds/{guild.id#DOCS_GUILD/guild-object}/emojis/{emoji.id#DOCS_EMOJI/emoji-object}

Modify the given emoji. Returns the updated [emoji](#DOCS_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_GATEWAY/guild-emojis-update) Gateway event.

>info
>Passing the roles field will be ignored unless the application is whitelisted as an emoji provider. For more information and to request whitelisting please contact support@discordapp.com

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| name | string | name of the emoji |
| roles | array of snowflakes | roles to which this emoji will be whitelisted |

## Delete Guild Emoji % DELETE /guilds/{guild.id#DOCS_GUILD/guild-object}/emojis/{emoji.id#DOCS_EMOJI/emoji-object}

Delete the given emoji. Returns `204 No Content` on success. Fires a [Guild Emojis Update](#DOCS_GATEWAY/guild-emojis-update) Gateway event.
