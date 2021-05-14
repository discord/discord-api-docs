# Guild Template Resource

### Guild Template Object

Represents a code that when used, creates a guild based on a snapshot of an existing guild.

###### Guild Template Structure

| Field                   | Type                                                       | Description                                            |
|-------------------------|------------------------------------------------------------|--------------------------------------------------------|
| code                    | string                                                     | the template code (unique ID)                          |
| name                    | string                                                     | template name                                          |
| description             | ?string                                                    | the description for the template                       |
| usage_count             | integer                                                    | number of times this template has been used            |
| creator_id              | snowflake                                                  | the ID of the user who created the template            |
| creator                 | [user](#DOCS_RESOURCES_USER/user-object) object            | the user who created the template                      |
| created_at              | ISO8601 timestamp                                          | when this template was created                         |
| updated_at              | ISO8601 timestamp                                          | when this template was last synced to the source guild |
| source_guild_id         | snowflake                                                  | the ID of the guild this template is based on          |
| serialized_source_guild | partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object | the guild snapshot this template contains              |
| is_dirty                | ?boolean                                                   | whether the template has unsynced changes              |

###### Example Guild Template Object

```json
{
  "code": "hgM48av5Q69A",
  "name": "Friends & Family",
  "description": "",
  "usage_count": 49605,
  "creator_id": "132837293881950208",
  "creator": {
    "id": "132837293881950208",
    "username": "hoges",
    "avatar": "79b0d9f8c340f2d43e1f78b09f175b62",
    "discriminator": "0001",
    "public_flags": 129
  },
  "created_at": "2020-04-02T21:10:38+00:00",
  "updated_at": "2020-05-01T17:57:38+00:00",
  "source_guild_id": "678070694164299796",
  "serialized_source_guild": {
    "name": "Friends & Family",
    "description": null,
    "region": "us-west",
    "verification_level": 0,
    "default_message_notifications": 0,
    "explicit_content_filter": 0,
    "preferred_locale": "en-US",
    "afk_timeout": 300,
    "roles": [
      {
        "id": 0,
        "name": "@everyone",
        "permissions": 104324689,
        "color": 0,
        "hoist": false,
        "mentionable": false
      }
    ],
    "channels": [
      {
        "name": "Text Channels",
        "position": 1,
        "topic": null,
        "bitrate": 64000,
        "user_limit": 0,
        "nsfw": false,
        "rate_limit_per_user": 0,
        "parent_id": null,
        "permission_overwrites": [],
        "id": 1,
        "type": 4
      },
      {
        "name": "general",
        "position": 1,
        "topic": null,
        "bitrate": 64000,
        "user_limit": 0,
        "nsfw": false,
        "rate_limit_per_user": 0,
        "parent_id": 1,
        "permission_overwrites": [],
        "id": 2,
        "type": 0
      }
    ],
    "afk_channel_id": null,
    "system_channel_id": 2,
    "system_channel_flags": 0,
    "icon_hash": null
  },
  "is_dirty": null
}
```

## Get Guild Template % GET /guilds/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Returns a [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object for the given code.

## Create Guild from Guild Template % POST /guilds/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Create a new guild based on a template. Returns a [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) Gateway event.

> warn
> This endpoint can be used only by bots in less than 10 guilds.

###### JSON Params

| Field | Type                                     | Description                             |
|-------|------------------------------------------|-----------------------------------------|
| name  | string                                   | name of the guild (2-100 characters)    |
| icon? | [image data](#DOCS_REFERENCE/image-data) | base64 128x128 image for the guild icon |

## Get Guild Templates % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates

Returns an array of [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) objects. Requires the `MANAGE_GUILD` permission.

## Create Guild Template % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates

Creates a template for the guild. Requires the `MANAGE_GUILD` permission. Returns the created [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object on success.

###### JSON Params

| Field        | Type    | Description                                     |
|--------------|---------|-------------------------------------------------|
| name         | string  | name of the template (1-100 characters)         |
| description? | ?string | description for the template (0-120 characters) |

## Sync Guild Template % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Syncs the template to the guild's current state. Requires the `MANAGE_GUILD` permission. Returns the [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object on success.

## Modify Guild Template % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Modifies the template's metadata. Requires the `MANAGE_GUILD` permission. Returns the [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object on success.

###### JSON Params

| Field        | Type    | Description                                     |
|--------------|---------|-------------------------------------------------|
| name?        | string  | name of the template (1-100 characters)         |
| description? | ?string | description for the template (0-120 characters) |

## Delete Guild Template % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/templates/{template.code#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object}

Deletes the template. Requires the `MANAGE_GUILD` permission. Returns the deleted [guild template](#DOCS_RESOURCES_GUILD_TEMPLATE/guild-template-object) object on success.
