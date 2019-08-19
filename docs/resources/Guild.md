# Guild Resource

Guilds in Discord represent an isolated collection of users and channels, and are often referred to as "servers" in the UI.

### Guild Object

###### Guild Structure

| Field                         | Type                                                                             | Description                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| id                            | snowflake                                                                        | guild id                                                                                                                         |
| name                          | string                                                                           | guild name (2-100 characters)                                                                                                    |
| icon                          | ?string                                                                          | [icon hash](#DOCS_REFERENCE/image-formatting)                                                                                    |
| splash                        | ?string                                                                          | [splash hash](#DOCS_REFERENCE/image-formatting)                                                                                  |
| owner?                        | boolean                                                                          | whether or not [the user](#DOCS_RESOURCES_USER/get-current-user-guilds) is the owner of the guild                                |
| owner_id                      | snowflake                                                                        | id of owner                                                                                                                      |
| permissions?                  | integer                                                                          | total permissions for [the user](#DOCS_RESOURCES_USER/get-current-user-guilds) in the guild (does not include channel overrides) |
| region                        | string                                                                           | [voice region](#DOCS_RESOURCES_VOICE/voice-region) id for the guild                                                              |
| afk_channel_id                | ?snowflake                                                                       | id of afk channel                                                                                                                |
| afk_timeout                   | integer                                                                          | afk timeout in seconds                                                                                                           |
| embed_enabled?                | boolean                                                                          | whether this guild is embeddable (e.g. widget)                                                                                   |
| embed_channel_id?             | snowflake                                                                        | if not null, the channel id that the widget will generate an invite to                                                           |
| verification_level            | integer                                                                          | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level) required for the guild                               |
| default_message_notifications | integer                                                                          | default [message notifications level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level)                     |
| explicit_content_filter       | integer                                                                          | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)                                |
| roles                         | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects                    | roles in the guild                                                                                                               |
| emojis                        | array of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects                     | custom guild emojis                                                                                                              |
| features                      | array of [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) strings                                                                 | enabled guild features                                                                                                           |
| mfa_level                     | integer                                                                          | required [MFA level](#DOCS_RESOURCES_GUILD/guild-object-mfa-level) for the guild                                                 |
| application_id                | ?snowflake                                                                       | application id of the guild creator if it is bot-created                                                                         |
| widget_enabled?               | boolean                                                                          | whether or not the server widget is enabled                                                                                      |
| widget_channel_id?            | snowflake                                                                        | the channel id for the server widget                                                                                             |
| system_channel_id             | ?snowflake                                                                       | the id of the channel to which system messages are sent                                                                          |
| joined_at? \*                 | ISO8601 timestamp                                                                | when this guild was joined at                                                                                                    |
| large? \*                     | boolean                                                                          | whether this is considered a large guild                                                                                         |
| unavailable? \*               | boolean                                                                          | whether this guild is unavailable                                                                                                |
| member_count? \*              | integer                                                                          | total number of members in this guild                                                                                            |
| voice_states? \*              | array of partial [voice state](#DOCS_RESOURCES_VOICE/voice-state-object) objects | (without the `guild_id` key)                                                                                                     |
| members? \*                   | array of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects       | users in the guild                                                                                                               |
| channels? \*                  | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects               | channels in the guild                                                                                                            |
| presences? \*                 | array of partial [presence update](#DOCS_TOPICS_GATEWAY/presence-update) objects | presences of the users in the guild                                                                                              |
| max_presences?                | ?integer                                                                         | the maximum amount of presences for the guild (the default value, currently 5000, is in effect when null is returned)            |
| max_members?                  | integer                                                                          | the maximum amount of members for the guild                                                                                      |
| vanity_url_code               | ?string                                                                          | the vanity url code for the guild                                                                                                |
| description                   | ?string                                                                          | the description for the guild                                                                                                    |
| banner                        | ?string                                                                          | [banner hash](#DOCS_REFERENCE/image-formatting)                                                                                  |
| premium_tier                  | integer                                                                          | [premium tier](#DOCS_RESOURCES_GUILD/guild-object-premium-tier)                                                                  |
| premium_subscription_count?   | integer                                                                          | the total number of users currently boosting this server                                                                         |
| preferred_locale              | string                                                                           | the preferred locale of this guild only set if guild has the "DISCOVERABLE" feature, defaults to en-US                           |

** \* These fields are only sent within the [GUILD_CREATE](#DOCS_TOPICS_GATEWAY/guild-create) event **

###### Default Message Notification Level

| Key           | Value |
| ------------- | ----- |
| ALL_MESSAGES  | 0     |
| ONLY_MENTIONS | 1     |

###### Explicit Content Filter Level

| Level                 | Integer |
| --------------------- | ------- |
| DISABLED              | 0       |
| MEMBERS_WITHOUT_ROLES | 1       |
| ALL_MEMBERS           | 2       |

###### MFA Level

| Level    | Integer |
| -------- | ------- |
| NONE     | 0       |
| ELEVATED | 1       |

###### Verification Level

| Level     | Integer | Description                                                                |
| --------- | ------- | -------------------------------------------------------------------------- |
| NONE      | 0       | unrestricted                                                               |
| LOW       | 1       | must have verified email on account                                        |
| MEDIUM    | 2       | must be registered on Discord for longer than 5 minutes                    |
| HIGH      | 3       | (╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes |
| VERY_HIGH | 4       | ┻━┻ ミヽ(ಠ 益 ಠ)ﾉ彡 ┻━┻ - must have a verified phone number                |

###### Premium Tier

| Level  | Integer |
| ------ | ------- |
| NONE   | 0       |
| TIER_1 | 1       |
| TIER_2 | 2       |
| TIER_3 | 3       |

###### Guild Features

| Feature       | Description                                                                     |
| ------------- | ------------------------------------------------------------------------------- |
| INVITE_SPLASH | guild has access to set an invite splash background                             |
| VIP_REGIONS   | guild has access to set 320kbps bitrate in voice (previously VIP voice servers) |
| VANITY_URL    | guild has access to set a vanity URL                                            |
| VERIFIED      | guild is verified                                                               |
| PARTNERED     | guild is partnered                                                              |
| LURKABLE      | guild is lurkable                                                               |
| COMMERCE      | guild has access to use commerce features (i.e. create store channels)          |
| NEWS          | guild has access to create news channels                                        |
| DISCOVERABLE  | guild is able to be discovered in the directory                                 |
| FEATURABLE    | guild is able to be featured in the directory                                   |
| ANIMATED_ICON | guild has access to set an animated guild icon                                  |
| BANNER        | guild has access to set a guild banner image                                    |

###### Example Guild

```json
{
  "id": "41771983423143937",
  "application_id": null,
  "name": "Discord Developers",
  "icon": "86e39f7ae3307e811784e2ffd11a7310",
  "splash": null,
  "owner_id": "80351110224678912",
  "region": "us-east",
  "afk_channel_id": "42072017402331136",
  "afk_timeout": 300,
  "embed_enabled": true,
  "embed_channel_id": "41771983444115456",
  "verification_level": 1,
  "default_message_notifications": 0,
  "explicit_content_filter": 0,
  "mfa_level": 0,
  "widget_enabled": false,
  "widget_channel_id": "41771983423143937",
  "roles": [],
  "emojis": [],
  "features": ["INVITE_SPLASH"],
  "unavailable": false
}
```

### Unavailable Guild Object

A partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object. Represents an Offline Guild, or a Guild whose information has not been provided through [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) events during the Gateway connect.

###### Example Unavailable Guild

```json
{
  "id": "41771983423143937",
  "unavailable": true
}
```

### Guild Embed Object

###### Guild Embed Structure

| Field      | Type       | Description                  |
| ---------- | ---------- | ---------------------------- |
| enabled    | boolean    | whether the embed is enabled |
| channel_id | ?snowflake | the embed channel id         |

###### Example Guild Embed

```json
{
  "enabled": true,
  "channel_id": "41771983444115456"
}
```

### Guild Member Object

###### Guild Member Structure

| Field         | Type                                            | Description                                                      |
| ------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| user          | [user](#DOCS_RESOURCES_USER/user-object) object | the user this guild member represents                            |
| nick?         | string                                          | this users guild nickname (if one is set)                        |
| roles         | array of snowflakes                             | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) object ids |
| joined_at     | ISO8601 timestamp                               | when the user joined the guild                                   |
| premium_since | ?ISO8601 timestamp                              | when the user used their Nitro boost on the server               |
| deaf          | boolean                                         | whether the user is deafened in voice channels                   |
| mute          | boolean                                         | whether the user is muted in voice channels                      |

###### Example Guild Member

```json
{
  "user": {},
  "nick": "NOT API SUPPORT",
  "roles": [],
  "joined_at": "2015-04-26T06:26:56.936000+00:00",
  "deaf": false,
  "mute": false
}
```

### Integration Object

###### Integration Structure

| Field               | Type                                                               | Description                                     |
| ------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| id                  | snowflake                                                          | integration id                                  |
| name                | string                                                             | integration name                                |
| type                | string                                                             | integration type (twitch, youtube, etc)         |
| enabled             | boolean                                                            | is this integration enabled                     |
| syncing             | boolean                                                            | is this integration syncing                     |
| role_id             | snowflake                                                          | id that this integration uses for "subscribers" |
| expire_behavior     | integer                                                            | the behavior of expiring subscribers            |
| expire_grace_period | integer                                                            | the grace period before expiring subscribers    |
| user                | [user](#DOCS_RESOURCES_USER/user-object) object                    | user for this integration                       |
| account             | [account](#DOCS_RESOURCES_GUILD/integration-account-object) object | integration account information                 |
| synced_at           | ISO8601 timestamp                                                  | when this integration was last synced           |

### Integration Account Object

###### Integration Account Structure

| Field | Type   | Description         |
| ----- | ------ | ------------------- |
| id    | string | id of the account   |
| name  | string | name of the account |

### Ban Object

###### Ban Structure

| Field  | Type                                            | Description            |
| ------ | ----------------------------------------------- | ---------------------- |
| reason | ?string                                         | the reason for the ban |
| user   | [user](#DOCS_RESOURCES_USER/user-object) object | the banned user        |

###### Example Ban

```json
{
  "reason": "mentioning b1nzy",
  "user": {
    "username": "Mason",
    "discriminator": "9999",
    "id": "53908099506183680",
    "avatar": "a_bab14f271d565501444b2ca3be944b25"
  }
}
```

## Create Guild % POST /guilds

Create a new guild. Returns a [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) Gateway event.

> warn
> This endpoint can be used only by bots in less than 10 guilds. Assigning a channel to a channel category is not supported by this endpoint, i.e. a channel can't have the `parent_id` field.

###### JSON Params

| Field                         | Type                                                                       | Description                                                                                                 |
| ----------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| name                          | string                                                                     | name of the guild (2-100 characters)                                                                        |
| region                        | string                                                                     | [voice region](#DOCS_RESOURCES_VOICE/voice-region) id                                                       |
| icon                          | string                                                                     | base64 128x128 jpeg image for the guild icon                                                                |
| verification_level            | integer                                                                    | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level)                                 |
| default_message_notifications | integer                                                                    | default [message notification level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level) |
| explicit_content_filter       | integer                                                                    | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)           |
| roles                         | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects              | new guild roles                                                                                             |
| channels                      | array of partial [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects | new guild's channels                                                                                        |

> warn
> When using the `roles` parameter, the first member of the array is used to change properties of the guild's `@everyone` role. If you are trying to bootstrap a guild with additional roles, keep this in mind.

###### Example Partial Channel Object

```json
{
  "name": "naming-things-is-hard",
  "type": 0
}
```

> info
> If roles are specified, the required `id` field within each role object is an integer placeholder, and will be replaced by the API upon consumption. Its purpose is to allow you to [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) a role's permissions in a channel when also passing in channels with the channels array.

## Get Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Returns the [guild](#DOCS_RESOURCES_GUILD/guild-object) object for the given id.

## Modify Guild % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Modify a guild's settings. Requires the `MANAGE_GUILD` permission. Returns the updated [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Update](#DOCS_TOPICS_GATEWAY/guild-update) Gateway event.

> info
> All parameters to this endpoint are optional

###### JSON Params

| Field                         | Type      | Description                                                                                                 |
| ----------------------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| name                          | string    | guild name                                                                                                  |
| region                        | string    | guild [voice region](#DOCS_RESOURCES_VOICE/voice-region) id                                                 |
| verification_level            | integer   | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level)                                 |
| default_message_notifications | integer   | default [message notification level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level) |
| explicit_content_filter       | integer   | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)           |
| afk_channel_id                | snowflake | id for afk channel                                                                                          |
| afk_timeout                   | integer   | afk timeout in seconds                                                                                      |
| icon                          | string    | base64 128x128 jpeg image for the guild icon                                                                |
| owner_id                      | snowflake | user id to transfer guild ownership to (must be owner)                                                      |
| splash                        | string    | base64 128x128 jpeg image for the guild splash (VIP only)                                                   |
| system_channel_id             | snowflake | the id of the channel to which system messages are sent                                                     |

## Delete Guild % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Delete a guild permanently. User must be owner. Returns `204 No Content` on success. Fires a [Guild Delete](#DOCS_TOPICS_GATEWAY/guild-delete) Gateway event.

## Get Guild Channels % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Returns a list of guild [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects.

## Create Guild Channel % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Create a new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object for the guild. Requires the `MANAGE_CHANNELS` permission. Returns the new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Create](#DOCS_TOPICS_GATEWAY/channel-create) Gateway event.

> info
> All parameters for this endpoint are optional excluding 'name'

###### JSON Params

| Field                 | Type                                                                   | Description                                                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                  | string                                                                 | channel name (2-100 characters)                                                                                                                                                 |
| type                  | integer                                                                | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types)                                                                                                     |
| topic                 | string                                                                 | channel topic (0-1024 characters)                                                                                                                                               |
| bitrate               | integer                                                                | the bitrate (in bits) of the voice channel (voice only)                                                                                                                         |
| user_limit            | integer                                                                | the user limit of the voice channel (voice only)                                                                                                                                |
| rate_limit_per_user   | integer                                                                | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected |
| position              | integer                                                                | sorting position of the channel                                                                                                                                                 |
| permission_overwrites | array of [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) objects | the channel's permission overwrites                                                                                                                                             |
| parent_id             | snowflake                                                              | id of the parent category for a channel                                                                                                                                         |
| nsfw                  | boolean                                                                | whether the channel is nsfw                                                                                                                                                     |

## Modify Guild Channel Positions % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Modify the positions of a set of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects for the guild. Requires `MANAGE_CHANNELS` permission. Returns a 204 empty response on success. Fires multiple [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway events.

> info
> Only channels to be modified are required, with the minimum being a swap between at least two channels.

This endpoint takes a JSON array of parameters in the following format:

###### JSON Params

| Field    | Type      | Description                     |
| -------- | --------- | ------------------------------- |
| id       | snowflake | channel id                      |
| position | integer   | sorting position of the channel |

## Get Guild Member % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object for the specified user.

## List Guild Members % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members

Returns a list of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects that are members of the guild.

> info
> All parameters to this endpoint are optional

###### Query String Params

| Field | Type      | Description                              | Default |
| ----- | --------- | ---------------------------------------- | ------- |
| limit | integer   | max number of members to return (1-1000) | 1       |
| after | snowflake | the highest user id in the previous page | 0       |

## Add Guild Member % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Adds a user to the guild, provided you have a valid oauth2 access token for the user with the `guilds.join` scope. Returns a 201 Created with the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) as the body, or 204 No Content if the user is already a member of the guild. Fires a [Guild Member Add](#DOCS_TOPICS_GATEWAY/guild-member-add) Gateway event. Requires the bot to have the `CREATE_INSTANT_INVITE` permission.

> info
> All parameters to this endpoint except for `access_token` are optional.

###### JSON Params

| Field        | Type                | Description                                                                                                              | Permission       |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| access_token | string              | an oauth2 access token granted with the `guilds.join` to the bot's application for the user you want to add to the guild |                  |
| nick         | string              | value to set users nickname to                                                                                           | MANAGE_NICKNAMES |
| roles        | array of snowflakes | array of role ids the member is assigned                                                                                 | MANAGE_ROLES     |
| mute         | boolean             | whether the user is muted in voice channels                                                                              | MUTE_MEMBERS     |
| deaf         | boolean             | whether the user is deafened in voice channels                                                                           | DEAFEN_MEMBERS   |

## Modify Guild Member % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Modify attributes of a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event. If the `channel_id` is set to null, this will force the target user to be disconnected from voice.

> info
> All parameters to this endpoint are optional. When moving members to channels, the API user _must_ have permissions to both connect to the channel and have the `MOVE_MEMBERS` permission.

###### JSON Params

| Field      | Type                | Description                                                                                            | Permission       |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------ | ---------------- |
| nick       | string              | value to set users nickname to                                                                         | MANAGE_NICKNAMES |
| roles      | array of snowflakes | array of role ids the member is assigned                                                               | MANAGE_ROLES     |
| mute       | boolean             | whether the user is muted in voice channels. Will throw a 400 if the user is not in a voice channel    | MUTE_MEMBERS     |
| deaf       | boolean             | whether the user is deafened in voice channels. Will throw a 400 if the user is not in a voice channel | DEAFEN_MEMBERS   |
| channel_id | ?snowflake          | id of channel to move user to (if they are connected to voice)                                         | MOVE_MEMBERS     |

## Modify Current User Nick % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/@me/nick

Modifies the nickname of the current user in a guild. Returns a 200 with the nickname on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.

###### JSON Params

| Field | Type   | Description                    | Permission      |
| ----- | ------ | ------------------------------ | --------------- |
| nick  | string | value to set users nickname to | CHANGE_NICKNAME |

## Add Guild Member Role % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Adds a role to a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.

## Remove Guild Member Role % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Removes a role from a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.

## Remove Guild Member % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Remove a member from a guild. Requires `KICK_MEMBERS` permission. Returns a 204 empty response on success. Fires a [Guild Member Remove](#DOCS_TOPICS_GATEWAY/guild-member-remove) Gateway event.

## Get Guild Bans % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans

Returns a list of [ban](#DOCS_RESOURCES_GUILD/ban-object) objects for the users banned from this guild. Requires the `BAN_MEMBERS` permission.

## Get Guild Ban % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [ban](#DOCS_RESOURCES_GUILD/ban-object) object for the given user or a 404 not found if the ban cannot be found. Requires the `BAN_MEMBERS` permission.

## Create Guild Ban % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans/{user.id#DOCS_RESOURCES_USER/user-object}

Create a guild ban, and optionally delete previous messages sent by the banned user. Requires the `BAN_MEMBERS` permission. Returns a 204 empty response on success. Fires a [Guild Ban Add](#DOCS_TOPICS_GATEWAY/guild-ban-add) Gateway event.

###### Query String Params

| Field                | Type    | Description                                 |
| -------------------- | ------- | ------------------------------------------- |
| delete-message-days? | integer | number of days to delete messages for (0-7) |
| reason?              | string  | reason for the ban                          |

## Remove Guild Ban % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans/{user.id#DOCS_RESOURCES_USER/user-object}

Remove the ban for a user. Requires the `BAN_MEMBERS` permissions. Returns a 204 empty response on success. Fires a [Guild Ban Remove](#DOCS_TOPICS_GATEWAY/guild-ban-remove) Gateway event.

## Get Guild Roles % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Returns a list of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects for the guild.

## Create Guild Role % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Create a new [role](#DOCS_TOPICS_PERMISSIONS/role-object) for the guild. Requires the `MANAGE_ROLES` permission. Returns the new [role](#DOCS_TOPICS_PERMISSIONS/role-object) object on success. Fires a [Guild Role Create](#DOCS_TOPICS_GATEWAY/guild-role-create) Gateway event. All JSON params are optional.

###### JSON Params

| Field       | Type    | Description                                                    | Default                        |
| ----------- | ------- | -------------------------------------------------------------- | ------------------------------ |
| name        | string  | name of the role                                               | "new role"                     |
| permissions | integer | bitwise value of the enabled/disabled permissions              | @everyone permissions in guild |
| color       | integer | RGB color value                                                | 0                              |
| hoist       | boolean | whether the role should be displayed separately in the sidebar | false                          |
| mentionable | boolean | whether the role should be mentionable                         | false                          |

## Modify Guild Role Positions % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Modify the positions of a set of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects for the guild. Requires the `MANAGE_ROLES` permission. Returns a list of all of the guild's [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects on success. Fires multiple [Guild Role Update](#DOCS_TOPICS_GATEWAY/guild-role-update) Gateway events.

This endpoint takes a JSON array of parameters in the following format:

###### JSON Params

| Field    | Type      | Description                  |
| -------- | --------- | ---------------------------- |
| id       | snowflake | role                         |
| position | integer   | sorting position of the role |

## Modify Guild Role % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Modify a guild role. Requires the `MANAGE_ROLES` permission. Returns the updated [role](#DOCS_TOPICS_PERMISSIONS/role-object) on success. Fires a [Guild Role Update](#DOCS_TOPICS_GATEWAY/guild-role-update) Gateway event.

> info
> All parameters to this endpoint are optional.

###### JSON Params

| Field       | Type    | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| name        | string  | name of the role                                               |
| permissions | integer | bitwise value of the enabled/disabled permissions              |
| color       | integer | RGB color value                                                |
| hoist       | boolean | whether the role should be displayed separately in the sidebar |
| mentionable | boolean | whether the role should be mentionable                         |

## Delete Guild Role % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Delete a guild role. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Role Delete](#DOCS_TOPICS_GATEWAY/guild-role-delete) Gateway event.

## Get Guild Prune Count % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/prune

Returns an object with one 'pruned' key indicating the number of members that would be removed in a prune operation. Requires the `KICK_MEMBERS` permission.

###### Query String Params

| Field | Type    | Description                                   | Default |
| ----- | ------- | --------------------------------------------- | ------- |
| days  | integer | number of days to count prune for (1 or more) | 7       |

## Begin Guild Prune % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/prune

Begin a prune operation. Requires the `KICK_MEMBERS` permission. Returns an object with one 'pruned' key indicating the number of members that were removed in the prune operation. For large guilds it's recommended to set the `compute_prune_count` option to `false`, forcing 'pruned' to `null`. Fires multiple [Guild Member Remove](#DOCS_TOPICS_GATEWAY/guild-member-remove) Gateway events.

###### Query String Params

| Field               | Type    | Description                                                | Default |
| ------------------- | ------- | ---------------------------------------------------------- | ------- |
| days                | integer | number of days to prune (1 or more)                        | 7       |
| compute_prune_count | boolean | whether 'pruned' is returned, discouraged for large guilds | true    |

## Get Guild Voice Regions % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/regions

Returns a list of [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) objects for the guild. Unlike the similar `/voice` route, this returns VIP servers when the guild is VIP-enabled.

## Get Guild Invites % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/invites

Returns a list of [invite](#DOCS_RESOURCES_INVITE/invite-object) objects (with [invite metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)) for the guild. Requires the `MANAGE_GUILD` permission.

## Get Guild Integrations % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations

Returns a list of [integration](#DOCS_RESOURCES_GUILD/integration-object) objects for the guild. Requires the `MANAGE_GUILD` permission.

## Create Guild Integration % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations

Attach an [integration](#DOCS_RESOURCES_GUILD/integration-object) object from the current user to the guild. Requires the `MANAGE_GUILD` permission. Returns a 204 empty response on success. Fires a [Guild Integrations Update](#DOCS_TOPICS_GATEWAY/guild-integrations-update) Gateway event.

###### JSON Params

| Field | Type      | Description          |
| ----- | --------- | -------------------- |
| type  | string    | the integration type |
| id    | snowflake | the integration id   |

## Modify Guild Integration % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations/{integration.id#DOCS_RESOURCES_GUILD/integration-object}

Modify the behavior and settings of an [integration](#DOCS_RESOURCES_GUILD/integration-object) object for the guild. Requires the `MANAGE_GUILD` permission. Returns a 204 empty response on success. Fires a [Guild Integrations Update](#DOCS_TOPICS_GATEWAY/guild-integrations-update) Gateway event.

###### JSON Params

| Field               | Type    | Description                                                                                                                                 |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| expire_behavior     | integer | the behavior when an integration subscription lapses (see the [integration](#DOCS_RESOURCES_GUILD/integration-object) object documentation) |
| expire_grace_period | integer | period (in seconds) where the integration will ignore lapsed subscriptions                                                                  |
| enable_emoticons    | boolean | whether emoticons should be synced for this integration (twitch only currently)                                                             |

## Delete Guild Integration % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations/{integration.id#DOCS_RESOURCES_GUILD/integration-object}

Delete the attached [integration](#DOCS_RESOURCES_GUILD/integration-object) object for the guild. Requires the `MANAGE_GUILD` permission. Returns a 204 empty response on success. Fires a [Guild Integrations Update](#DOCS_TOPICS_GATEWAY/guild-integrations-update) Gateway event.

## Sync Guild Integration % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations/{integration.id#DOCS_RESOURCES_GUILD/integration-object}/sync

Sync an integration. Requires the `MANAGE_GUILD` permission. Returns a 204 empty response on success.

## Get Guild Embed % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/embed

Returns the [guild embed](#DOCS_RESOURCES_GUILD/guild-embed-object) object. Requires the `MANAGE_GUILD` permission.

## Modify Guild Embed % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/embed

Modify a [guild embed](#DOCS_RESOURCES_GUILD/guild-embed-object) object for the guild. All attributes may be passed in with JSON and modified. Requires the `MANAGE_GUILD` permission. Returns the updated [guild embed](#DOCS_RESOURCES_GUILD/guild-embed-object) object.

## Get Guild Vanity URL % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/vanity-url

Returns a partial [invite](#DOCS_RESOURCES_INVITE/invite-object) object for guilds with that feature enabled. Requires the `MANAGE_GUILD` permission. `code` will be null if a vanity url for the guild is not set.

###### Example Partial Invite Object

```json
{
  "code": "abc"
}
```

## Get Guild Widget Image % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget.png

Returns a PNG image widget for the guild. Requires no permissions or authentication.
The same documentation also applies to `embed.png`.

> info
> All parameters for this endpoint are optional.

###### Query String Params

| Field | Type   | Description                                    | Default |
| ----- | ------ | ---------------------------------------------- | ------- |
| style | string | style of the widget image returned (see below) | shield  |

###### Widget Style Options

| Value   | Description                                                                                                                                                    | Example                                                                                 |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| shield  | shield style widget with Discord icon and guild members online count                                                                                           | [Example](https://discordapp.com/api/guilds/81384788765712384/widget.png?style=shield)  |
| banner1 | large image with guild icon, name and online count. "POWERED BY DISCORD" as the footer of the widget                                                           | [Example](https://discordapp.com/api/guilds/81384788765712384/widget.png?style=banner1) |
| banner2 | smaller widget style with guild icon, name and online count. Split on the right with Discord logo                                                              | [Example](https://discordapp.com/api/guilds/81384788765712384/widget.png?style=banner2) |
| banner3 | large image with guild icon, name and online count. In the footer, Discord logo on the left and "Chat Now" on the right                                        | [Example](https://discordapp.com/api/guilds/81384788765712384/widget.png?style=banner3) |
| banner4 | large Discord logo at the top of the widget. Guild icon, name and online count in the middle portion of the widget and a "JOIN MY SERVER" button at the bottom | [Example](https://discordapp.com/api/guilds/81384788765712384/widget.png?style=banner4) |
