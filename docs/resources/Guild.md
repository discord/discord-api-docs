# Guild Resource

Guilds in Discord represent an isolated collection of users and channels, and are often referred to as "servers" in the UI.

### Guild Object

###### Guild Structure

| Field                         | Type                                                                                | Description                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| id                            | snowflake                                                                           | guild id                                                                                                                                     |
| name                          | string                                                                              | guild name (2-100 characters, excluding trailing and leading whitespace)                                                                     |
| icon                          | ?string                                                                             | [icon hash](#DOCS_REFERENCE/image-formatting)                                                                                                |
| icon_hash?                    | ?string                                                                             | [icon hash](#DOCS_REFERENCE/image-formatting), returned when in the template object                                                          |
| splash                        | ?string                                                                             | [splash hash](#DOCS_REFERENCE/image-formatting)                                                                                              |
| discovery_splash              | ?string                                                                             | [discovery splash hash](#DOCS_REFERENCE/image-formatting); only present for guilds with the "DISCOVERABLE" feature                           |
| owner? \*\*                   | boolean                                                                             | true if [the user](#DOCS_RESOURCES_USER/get-current-user-guilds) is the owner of the guild                                                   |
| owner_id                      | snowflake                                                                           | id of owner                                                                                                                                  |
| permissions? \*\*             | string                                                                              | total permissions for [the user](#DOCS_RESOURCES_USER/get-current-user-guilds) in the guild (excludes overrides)                             |
| region                        | string                                                                              | [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id for the guild                                                                   |
| afk_channel_id                | ?snowflake                                                                          | id of afk channel                                                                                                                            |
| afk_timeout                   | integer                                                                             | afk timeout in seconds                                                                                                                       |
| widget_enabled?               | boolean                                                                             | true if the server widget is enabled                                                                                                         |
| widget_channel_id?            | ?snowflake                                                                          | the channel id that the widget will generate an invite to, or `null` if set to no invite                                                     |
| verification_level            | integer                                                                             | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level) required for the guild                                           |
| default_message_notifications | integer                                                                             | default [message notifications level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level)                                 |
| explicit_content_filter       | integer                                                                             | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)                                            |
| roles                         | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects                       | roles in the guild                                                                                                                           |
| emojis                        | array of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects                        | custom guild emojis                                                                                                                          |
| features                      | array of [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) strings | enabled guild features                                                                                                                       |
| mfa_level                     | integer                                                                             | required [MFA level](#DOCS_RESOURCES_GUILD/guild-object-mfa-level) for the guild                                                             |
| application_id                | ?snowflake                                                                          | application id of the guild creator if it is bot-created                                                                                     |
| system_channel_id             | ?snowflake                                                                          | the id of the channel where guild notices such as welcome messages and boost events are posted                                               |
| system_channel_flags          | integer                                                                             | [system channel flags](#DOCS_RESOURCES_GUILD/guild-object-system-channel-flags)                                                              |
| rules_channel_id              | ?snowflake                                                                          | the id of the channel where Community guilds can display rules and/or guidelines                                                             |
| joined_at? \*                 | ISO8601 timestamp                                                                   | when this guild was joined at                                                                                                                |
| large? \*                     | boolean                                                                             | true if this is considered a large guild                                                                                                     |
| unavailable? \*               | boolean                                                                             | true if this guild is unavailable due to an outage                                                                                           |
| member_count? \*              | integer                                                                             | total number of members in this guild                                                                                                        |
| voice_states? \*              | array of partial [voice state](#DOCS_RESOURCES_VOICE/voice-state-object) objects    | states of members currently in voice channels; lacks the `guild_id` key                                                                      |
| members? \*                   | array of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects          | users in the guild                                                                                                                           |
| channels? \*                  | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects                  | channels in the guild                                                                                                                        |
| presences? \*                 | array of partial [presence update](#DOCS_TOPICS_GATEWAY/presence-update) objects    | presences of the members in the guild, will only include non-offline members if the size is greater than `large threshold`                   |
| max_presences?                | ?integer                                                                            | the maximum number of presences for the guild (the default value, currently 25000, is in effect when `null` is returned)                     |
| max_members?                  | integer                                                                             | the maximum number of members for the guild                                                                                                  |
| vanity_url_code               | ?string                                                                             | the vanity url code for the guild                                                                                                            |
| description                   | ?string                                                                             | the description for the guild, if the guild is discoverable                                                                                  |
| banner                        | ?string                                                                             | [banner hash](#DOCS_REFERENCE/image-formatting)                                                                                              |
| premium_tier                  | integer                                                                             | [premium tier](#DOCS_RESOURCES_GUILD/guild-object-premium-tier) (Server Boost level)                                                         |
| premium_subscription_count?   | integer                                                                             | the number of boosts this guild currently has                                                                                                |
| preferred_locale              | string                                                                              | the preferred locale of a Community guild; used in server discovery and notices from Discord; defaults to "en-US"                            |
| public_updates_channel_id     | ?snowflake                                                                          | the id of the channel where admins and moderators of Community guilds receive notices from Discord                                           |
| max_video_channel_users?      | integer                                                                             | the maximum amount of users in a video channel                                                                                               |
| approximate_member_count?     | integer                                                                             | approximate number of members in this guild, returned from the `GET /guilds/<id>` endpoint when `with_counts` is `true`                      |
| approximate_presence_count?   | integer                                                                             | approximate number of non-offline members in this guild, returned from the `GET /guilds/<id>` endpoint when `with_counts` is `true`          |
| welcome_screen?               | [welcome screen](#DOCS_RESOURCES_GUILD/welcome-screen-object) object                | the welcome screen of a Community guild, shown to new members, returned in an [Invite](#DOCS_RESOURCES_INVITE/invite-object)'s guild object |
| nsfw                          | boolean                                                                             | true if this guild is [designated as NSFW](https://support.discord.com/hc/en-us/articles/1500005389362-NSFW-Server-Designation)              |

** \* These fields are only sent within the [GUILD_CREATE](#DOCS_TOPICS_GATEWAY/guild-create) event **

** \*\* These fields are only sent when using the [GET Current User Guilds](#DOCS_RESOURCES_USER/get-current-user-guilds) endpoint and are relative to the requested user **

###### Default Message Notification Level

| Key           | Value | Description                                                                        |
| ------------- | ----- | ---------------------------------------------------------------------------------- |
| ALL_MESSAGES  | 0     | members will receive notifications for all messages by default                     |
| ONLY_MENTIONS | 1     | members will receive notifications only for messages that @mention them by default |

###### Explicit Content Filter Level

| Level                 | Integer | Description                                                 |
| --------------------- | ------- | ----------------------------------------------------------- |
| DISABLED              | 0       | media content will not be scanned                           |
| MEMBERS_WITHOUT_ROLES | 1       | media content sent by members without roles will be scanned |
| ALL_MEMBERS           | 2       | media content sent by all members will be scanned           |

###### MFA Level

| Level    | Integer | Description                                             |
| -------- | ------- | ------------------------------------------------------- |
| NONE     | 0       | guild has no MFA/2FA requirement for moderation actions |
| ELEVATED | 1       | guild has a 2FA requirement for moderation actions      |

###### Verification Level

| Level     | Integer | Description                                               |
| --------- | ------- | --------------------------------------------------------- |
| NONE      | 0       | unrestricted                                              |
| LOW       | 1       | must have verified email on account                       |
| MEDIUM    | 2       | must be registered on Discord for longer than 5 minutes   |
| HIGH      | 3       | must be a member of the server for longer than 10 minutes |
| VERY_HIGH | 4       | must have a verified phone number                         |

###### Premium Tier

| Level  | Integer | Description                                   |
| ------ | ------- | --------------------------------------------- |
| NONE   | 0       | guild has not unlocked any Server Boost perks |
| TIER_1 | 1       | guild has unlocked Server Boost level 1 perks |
| TIER_2 | 2       | guild has unlocked Server Boost level 2 perks |
| TIER_3 | 3       | guild has unlocked Server Boost level 3 perks |

###### System Channel Flags

| Flag                                  | Value  | Description                         |
| ------------------------------------- | ------ | ----------------------------------- |
| SUPPRESS_JOIN_NOTIFICATIONS           | 1 << 0 | Suppress member join notifications  |
| SUPPRESS_PREMIUM_SUBSCRIPTIONS        | 1 << 1 | Suppress server boost notifications |
| SUPPRESS_GUILD_REMINDER_NOTIFICATIONS | 1 << 2 | Suppress server setup tips          |

###### Guild Features

| Feature                          | Description                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ANIMATED_ICON                    | guild has access to set an animated guild icon                                                                      |
| BANNER                           | guild has access to set a guild banner image                                                                        |
| COMMERCE                         | guild has access to use commerce features (i.e. create store channels)                                              |
| COMMUNITY                        | guild can enable welcome screen, Membership Screening, stage channels and discovery, and receives community updates |
| DISCOVERABLE                     | guild is able to be discovered in the directory                                                                     |
| FEATURABLE                       | guild is able to be featured in the directory                                                                       |
| INVITE_SPLASH                    | guild has access to set an invite splash background                                                                 |
| MEMBER_VERIFICATION_GATE_ENABLED | guild has enabled [Membership Screening](#DOCS_RESOURCES_GUILD/membership-screening-object)                         |
| NEWS                             | guild has access to create news channels                                                                            |
| PARTNERED                        | guild is partnered                                                                                                  |
| PREVIEW_ENABLED                  | guild can be previewed before joining via Membership Screening or the directory                                     |
| VANITY_URL                       | guild has access to set a vanity URL                                                                                |
| VERIFIED                         | guild is verified                                                                                                   |
| VIP_REGIONS                      | guild has access to set 384kbps bitrate in voice (previously VIP voice servers)                                     |
| WELCOME_SCREEN_ENABLED           | guild has enabled the welcome screen                                                                                |

###### Example Guild

```json
{
  "id": "197038439483310086",
  "name": "Discord Testers",
  "icon": "f64c482b807da4f539cff778d174971c",
  "description": "The official place to report Discord Bugs!",
  "splash": null,
  "discovery_splash": null,
  "features": [
    "ANIMATED_ICON",
    "VERIFIED",
    "NEWS",
    "VANITY_URL",
    "DISCOVERABLE",
    "MORE_EMOJI",
    "INVITE_SPLASH",
    "BANNER",
    "COMMUNITY"
  ],
  "emojis": [],
  "banner": "9b6439a7de04f1d26af92f84ac9e1e4a",
  "owner_id": "73193882359173120",
  "application_id": null,
  "region": "us-west",
  "afk_channel_id": null,
  "afk_timeout": 300,
  "system_channel_id": null,
  "widget_enabled": true,
  "widget_channel_id": null,
  "verification_level": 3,
  "roles": [],
  "default_message_notifications": 1,
  "mfa_level": 1,
  "explicit_content_filter": 2,
  "max_presences": 40000,
  "max_members": 250000,
  "vanity_url_code": "discord-testers",
  "premium_tier": 3,
  "premium_subscription_count": 33,
  "system_channel_flags": 0,
  "preferred_locale": "en-US",
  "rules_channel_id": "441688182833020939",
  "public_updates_channel_id": "281283303326089216"
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

### Guild Preview Object

###### Guild Preview Structure

| Field                      | Type                                                                                | Description                                                 |
| -------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| id                         | snowflake                                                                           | guild id                                                    |
| name                       | string                                                                              | guild name (2-100 characters)                               |
| icon                       | ?string                                                                             | [icon hash](#DOCS_REFERENCE/image-formatting)               |
| splash                     | ?string                                                                             | [splash hash](#DOCS_REFERENCE/image-formatting)             |
| discovery_splash           | ?string                                                                             | [discovery splash hash](#DOCS_REFERENCE/image-formatting)   |
| emojis                     | array of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects                        | custom guild emojis                                         |
| features                   | array of [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) strings | enabled guild features                                      |
| approximate_member_count   | integer                                                                             | approximate number of members in this guild                 |
| approximate_presence_count | integer                                                                             | approximate number of online members in this guild          |
| description                | ?string                                                                             | the description for the guild, if the guild is discoverable |

###### Example Guild Preview

```json
{
  "id": "197038439483310086",
  "name": "Discord Testers",
  "icon": "f64c482b807da4f539cff778d174971c",
  "splash": null,
  "discovery_splash": null,
  "emojis": [],
  "features": [
    "DISCOVERABLE",
    "VANITY_URL",
    "ANIMATED_ICON",
    "INVITE_SPLASH",
    "NEWS",
    "COMMUNITY",
    "BANNER",
    "VERIFIED",
    "MORE_EMOJI"
  ],
  "approximate_member_count": 60814,
  "approximate_presence_count": 20034,
  "description": "The official place to report Discord Bugs!"
}
```

### Guild Widget Object

###### Guild Widget Structure

| Field      | Type       | Description                   |
| ---------- | ---------- | ----------------------------- |
| enabled    | boolean    | whether the widget is enabled |
| channel_id | ?snowflake | the widget channel id         |

###### Example Guild Widget

```json
{
  "enabled": true,
  "channel_id": "41771983444115456"
}
```

### Guild Member Object

###### Guild Member Structure

| Field          | Type                                            | Description                                                                                                                            |
| -------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| user?          | [user](#DOCS_RESOURCES_USER/user-object) object | the user this guild member represents                                                                                                  |
| nick?          | ?string                                         | this users guild nickname                                                                                                              |
| roles          | array of snowflakes                             | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) object ids                                                                       |
| joined_at      | ISO8601 timestamp                               | when the user joined the guild                                                                                                         |
| premium_since? | ?ISO8601 timestamp                              | when the user started [boosting](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-) the guild                |
| deaf           | boolean                                         | whether the user is deafened in voice channels                                                                                         |
| mute           | boolean                                         | whether the user is muted in voice channels                                                                                            |
| pending?       | boolean                                         | whether the user has not yet passed the guild's [Membership Screening](#DOCS_RESOURCES_GUILD/membership-screening-object) requirements |
| permissions?   | string                                          | total permissions of the member in the channel, including overrides, returned when in the interaction object                           |

> info
> The field `user` won't be included in the member object attached to `MESSAGE_CREATE` and `MESSAGE_UPDATE` gateway events.

> info
> In `GUILD_` events, `pending` will always be included as true or false. In non `GUILD_` events which can only be triggered by non-`pending` users, `pending` will not be included.

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

| Field                   | Type                                                                                                 | Description                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| id                      | snowflake                                                                                            | integration id                                                                  |
| name                    | string                                                                                               | integration name                                                                |
| type                    | string                                                                                               | integration type (twitch, youtube, or discord)                                  |
| enabled                 | boolean                                                                                              | is this integration enabled                                                     |
| syncing? \*             | boolean                                                                                              | is this integration syncing                                                     |
| role_id? \*             | snowflake                                                                                            | id that this integration uses for "subscribers"                                 |
| enable_emoticons? \*    | boolean                                                                                              | whether emoticons should be synced for this integration (twitch only currently) |
| expire_behavior? \*     | [integration expire behavior](#DOCS_RESOURCES_GUILD/integration-object-integration-expire-behaviors) | the behavior of expiring subscribers                                            |
| expire_grace_period? \* | integer                                                                                              | the grace period (in days) before expiring subscribers                          |
| user? \*                | [user](#DOCS_RESOURCES_USER/user-object) object                                                      | user for this integration                                                       |
| account                 | [account](#DOCS_RESOURCES_GUILD/integration-account-object) object                                   | integration account information                                                 |
| synced_at? \*           | ISO8601 timestamp                                                                                    | when this integration was last synced                                           |
| subscriber_count? \*    | integer                                                                                              | how many subscribers this integration has                                       |
| revoked? \*             | boolean                                                                                              | has this integration been revoked                                               |
| application?            | [application](#DOCS_RESOURCES_GUILD/integration-application-object) object                           | The bot/OAuth2 application for discord integrations                             |

** \* These fields are not provided for discord bot integrations. **

###### Integration Expire Behaviors

| Value | Name        |
| ----- | ----------- |
| 0     | Remove role |
| 1     | Kick        |

### Integration Account Object

###### Integration Account Structure

| Field | Type   | Description         |
| ----- | ------ | ------------------- |
| id    | string | id of the account   |
| name  | string | name of the account |

### Integration Application Object

###### Integration Application Structure

| Field       | Type                                            | Description                                                  |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------ |
| id          | snowflake                                       | the id of the app                                            |
| name        | string                                          | the name of the app                                          |
| icon        | ?string                                         | the [icon hash](#DOCS_REFERENCE/image-formatting) of the app |
| description | string                                          | the description of the app                                   |
| summary     | string                                          | the description of the app                                   |
| bot?        | [user](#DOCS_RESOURCES_USER/user-object) object | the bot associated with this application                     |

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
    "avatar": "a_bab14f271d565501444b2ca3be944b25",
    "public_flags": 131141
  }
}
```

### Welcome Screen Object

###### Welcome Screen Structure

| Field            | Type                                                                                              | Description                                        |
| ---------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| description      | ?string                                                                                           | the server description shown in the welcome screen |
| welcome_channels | array of [welcome screen channel](#DOCS_RESOURCES_GUILD/welcome-screen-object-welcome-screen-channel-structure) objects | the channels shown in the welcome screen, up to 5  |

###### Welcome Screen Channel Structure

| Field       | Type       | Description                                                                               |
| ----------- | ---------- | ----------------------------------------------------------------------------------------- |
| channel_id  | snowflake  | the channel's id                                                                          |
| description | string     | the description shown for the channel                                                     |
| emoji_id    | ?snowflake | the [emoji id](#DOCS_REFERENCE/image-formatting), if the emoji is custom                  |
| emoji_name  | ?string    | the emoji name if custom, the unicode character if standard, or `null` if no emoji is set |

###### Example Welcome Screen

```json
{
  "description": "Discord Developers is a place to learn about Discord's API, bots, and SDKs and integrations. This is NOT a general Discord support server.",
  "welcome_channels": [
    {
      "channel_id": "697138785317814292",
      "description": "Follow for official Discord API updates",
      "emoji_id": null,
      "emoji_name": "📡"
    },
    {
      "channel_id": "697236247739105340",
      "description": "Get help with Bot Verifications",
      "emoji_id": null,
      "emoji_name": "📸"
    },
    {
      "channel_id": "697489244649816084",
      "description": "Create amazing things with Discord's API",
      "emoji_id": null,
      "emoji_name": "🔬"
    },
    {
      "channel_id": "613425918748131338",
      "description": "Integrate Discord into your game",
      "emoji_id": null,
      "emoji_name": "🎮"
    },
    {
      "channel_id": "646517734150242346",
      "description": "Find more places to help you on your quest",
      "emoji_id": null,
      "emoji_name": "🔦"
    }
  ]
}
```

### Membership Screening Object

In guilds with [Membership Screening](https://support.discord.com/hc/en-us/articles/1500000466882) enabled, when a member joins, [Guild Member Add](#DOCS_TOPICS_GATEWAY/guild-member-add) will be emitted but they will initially be restricted from doing any actions in the guild, and `pending` will be true in the [member object](#DOCS_RESOURCES_GUILD/guild-member-object). When the member completes the screening, [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) will be emitted and `pending` will be false.

Giving the member a role will bypass Membership Screening as well as the guild's verification level, giving the member immediate access to chat. Therefore, instead of giving a role when the member joins, it is recommended to not give the role until the user is no longer `pending`.

> warn
> We are making significant changes to the Membership Screening API specifically related to getting and editing the Membership Screening object. Long story short is that it can be improved. As such, we have removed those documentation. There will **not be** any changes to how pending members work, as outlined above. That behavior will stay the same.

## Create Guild % POST /guilds

Create a new guild. Returns a [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) Gateway event.

> warn
> This endpoint can be used only by bots in less than 10 guilds.

###### JSON Params

| Field                          | Type                                                                       | Description                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| name                           | string                                                                     | name of the guild (2-100 characters)                                                                        |
| region?                        | string                                                                     | [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id                                                |
| icon?                          | [image data](#DOCS_REFERENCE/image-data)                                   | base64 128x128 image for the guild icon                                                                     |
| verification_level?            | integer                                                                    | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level)                                 |
| default_message_notifications? | integer                                                                    | default [message notification level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level) |
| explicit_content_filter?       | integer                                                                    | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)           |
| roles?                         | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects              | new guild roles                                                                                             |
| channels?                      | array of partial [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects | new guild's channels                                                                                        |
| afk_channel_id?                | snowflake                                                                  | id for afk channel                                                                                          |
| afk_timeout?                   | integer                                                                    | afk timeout in seconds                                                                                      |
| system_channel_id?             | snowflake                                                                  | the id of the channel where guild notices such as welcome messages and boost events are posted              |
| system_channel_flags?          | integer                                                                    | [system channel flags](#DOCS_RESOURCES_GUILD/guild-object-system-channel-flags)                             |

> warn
> When using the `roles` parameter, the first member of the array is used to change properties of the guild's `@everyone` role. If you are trying to bootstrap a guild with additional roles, keep this in mind.

> info
> When using the `roles` parameter, the required `id` field within each role object is an integer placeholder, and will be replaced by the API upon consumption. Its purpose is to allow you to [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) a role's permissions in a channel when also passing in channels with the channels array.

> warn
> When using the `channels` parameter, the `position` field is ignored, and none of the default channels are created.

> info
> When using the `channels` parameter, the `id` field within each channel object may be set to an integer placeholder, and will be replaced by the API upon consumption. Its purpose is to allow you to create `GUILD_CATEGORY` channels by setting the `parent_id` field on any children to the category's `id` field. Category channels must be listed before any children.

###### Example Partial Channel Object

```json
{
  "name": "naming-things-is-hard",
  "type": 0
}
```

###### Example Category Channel

```json
{
  "name": "my-category",
  "type": 4,
  "id": 1
}
{
  "name": "naming-things-is-hard",
  "type": 0,
  "id": 2,
  "parent_id": 1
}
```

## Get Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Returns the [guild](#DOCS_RESOURCES_GUILD/guild-object) object for the given id. If `with_counts` is set to `true`, this endpoint will also return `approximate_member_count` and `approximate_presence_count` for the guild.

###### Query String Params

| Field        | Type    | Description                                                                   | Required | Default |
| ------------ | ------- | ----------------------------------------------------------------------------- | -------- | ------- |
| with_counts? | boolean | when `true`, will return approximate member and presence counts for the guild | false    | false   |

###### Example Response

```json
{
  "id": "2909267986263572999",
  "name": "Mason's Test Server",
  "icon": "389030ec9db118cb5b85a732333b7c98",
  "description": null,
  "splash": "75610b05a0dd09ec2c3c7df9f6975ea0",
  "discovery_splash": null,
  "approximate_member_count": 2,
  "approximate_presence_count": 2,
  "features": [
    "INVITE_SPLASH",
    "VANITY_URL",
    "COMMERCE",
    "BANNER",
    "NEWS",
    "VERIFIED",
    "VIP_REGIONS"
  ],
  "emojis": [
    {
      "name": "ultrafastparrot",
      "roles": [],
      "id": "393564762228785161",
      "require_colons": true,
      "managed": false,
      "animated": true,
      "available": true
    }
  ],
  "banner": "5c3cb8d1bc159937fffe7e641ec96ca7",
  "owner_id": "53908232506183680",
  "application_id": null,
  "region": "us-east",
  "afk_channel_id": null,
  "afk_timeout": 300,
  "system_channel_id": null,
  "widget_enabled": true,
  "widget_channel_id": "639513352485470208",
  "verification_level": 0,
  "roles": [
    {
      "id": "2909267986263572999",
      "name": "@everyone",
      "permissions": "49794752",
      "position": 0,
      "color": 0,
      "hoist": false,
      "managed": false,
      "mentionable": false
    }
  ],
  "default_message_notifications": 1,
  "mfa_level": 0,
  "explicit_content_filter": 0,
  "max_presences": null,
  "max_members": 250000,
  "max_video_channel_users": 25,
  "vanity_url_code": "no",
  "premium_tier": 0,
  "premium_subscription_count": 0,
  "system_channel_flags": 0,
  "preferred_locale": "en-US",
  "rules_channel_id": null,
  "public_updates_channel_id": null
}
```

## Get Guild Preview % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/preview

Returns the [guild preview](#DOCS_RESOURCES_GUILD/guild-preview-object) object for the given id. If the user is not in the guild, then the guild must be Discoverable.

## Modify Guild % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Modify a guild's settings. Requires the `MANAGE_GUILD` permission. Returns the updated [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Update](#DOCS_TOPICS_GATEWAY/guild-update) Gateway event.

> info
> All parameters to this endpoint are optional

###### JSON Params

| Field                         | Type                                                                                | Description                                                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| name                          | string                                                                              | guild name                                                                                                                   |
| region                        | ?string                                                                             | guild [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id                                                           |
| verification_level            | ?integer                                                                            | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level)                                                  |
| default_message_notifications | ?integer                                                                            | default [message notification level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level)                  |
| explicit_content_filter       | ?integer                                                                            | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)                            |
| afk_channel_id                | ?snowflake                                                                          | id for afk channel                                                                                                           |
| afk_timeout                   | integer                                                                             | afk timeout in seconds                                                                                                       |
| icon                          | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 1024x1024 png/jpeg/gif image for the guild icon (can be animated gif when the server has the `ANIMATED_ICON` feature) |
| owner_id                      | snowflake                                                                           | user id to transfer guild ownership to (must be owner)                                                                       |
| splash                        | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 16:9 png/jpeg image for the guild splash (when the server has the `INVITE_SPLASH` feature)                            |
| discovery_splash              | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 16:9 png/jpeg image for the guild discovery splash (when the server has the `DISCOVERABLE` feature)                   |
| banner                        | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 16:9 png/jpeg image for the guild banner (when the server has the `BANNER` feature)                                   |
| system_channel_id             | ?snowflake                                                                          | the id of the channel where guild notices such as welcome messages and boost events are posted                               |
| system_channel_flags          | integer                                                                             | [system channel flags](#DOCS_RESOURCES_GUILD/guild-object-system-channel-flags)                                              |
| rules_channel_id              | ?snowflake                                                                          | the id of the channel where Community guilds display rules and/or guidelines                                                 |
| public_updates_channel_id     | ?snowflake                                                                          | the id of the channel where admins and moderators of Community guilds receive notices from Discord                           |
| preferred_locale              | ?string                                                                             | the preferred locale of a Community guild used in server discovery and notices from Discord; defaults to "en-US"             |
| features                      | array of [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) strings | enabled guild features                                                                                                       |
| description                   | ?string                                                                             | the description for the guild, if the guild is discoverable                                                                  |

## Delete Guild % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Delete a guild permanently. User must be owner. Returns `204 No Content` on success. Fires a [Guild Delete](#DOCS_TOPICS_GATEWAY/guild-delete) Gateway event.

## Get Guild Channels % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Returns a list of guild [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects.

## Create Guild Channel % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Create a new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object for the guild. Requires the `MANAGE_CHANNELS` permission. If setting permission overwrites, only permissions your bot has in the guild can be allowed/denied. Setting `MANAGE_ROLES` permission in channels is only possible for guild administrators. Returns the new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Create](#DOCS_TOPICS_GATEWAY/channel-create) Gateway event.

> info
> All parameters to this endpoint are optional excluding 'name'

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

| Field            | Type       | Description                                                                      |
| ---------------- | ---------- | -------------------------------------------------------------------------------- |
| id               | snowflake  | channel id                                                                       |
| position         | ?integer   | sorting position of the channel                                                  |
| lock_permissions | ?boolean   | syncs the permission overwrites with the new parent, if moving to a new category |
| parent_id        | ?snowflake | the new parent ID for the channel that is moved                                  |

## Get Guild Member % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object for the specified user.

## List Guild Members % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members

Returns a list of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects that are members of the guild.

> warn
> This endpoint is restricted according to whether the `GUILD_MEMBERS` [Privileged Intent](#DOCS_TOPICS_GATEWAY/privileged-intents) is enabled for your application.

> info
> All parameters to this endpoint are optional

###### Query String Params

| Field | Type      | Description                              | Default |
| ----- | --------- | ---------------------------------------- | ------- |
| limit | integer   | max number of members to return (1-1000) | 1       |
| after | snowflake | the highest user id in the previous page | 0       |

## Search Guild Members % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/search

Returns a list of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects whose username or nickname starts with a provided string.

> info
> All parameters to this endpoint except for `query` are optional

###### Query String Params

| Field | Type    | Description                                                | Default |
| ----- | ------- | ---------------------------------------------------------- | ------- |
| query | string  | Query string to match username(s) and nickname(s) against. |         |
| limit | integer | max number of members to return (1-1000)                   | 1       |

## Add Guild Member % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Adds a user to the guild, provided you have a valid oauth2 access token for the user with the `guilds.join` scope. Returns a 201 Created with the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) as the body, or 204 No Content if the user is already a member of the guild. Fires a [Guild Member Add](#DOCS_TOPICS_GATEWAY/guild-member-add) Gateway event.

For guilds with [Membership Screening](#DOCS_RESOURCES_GUILD/membership-screening-object) enabled, this endpoint will default to adding new members as `pending` in the [guild member object](#DOCS_RESOURCES_GUILD/guild-member-object). Members that are `pending` will have to complete membership screening before they become full members that can talk.

> info
> All parameters to this endpoint except for `access_token` are optional.

> info
> The Authorization header must be a Bot token (belonging to the same application used for authorization), and the bot must be a member of the guild with `CREATE_INSTANT_INVITE` permission.

###### JSON Params

| Field        | Type                | Description                                                                                                              | Permission       |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| access_token | string              | an oauth2 access token granted with the `guilds.join` to the bot's application for the user you want to add to the guild |                  |
| nick         | string              | value to set users nickname to                                                                                           | MANAGE_NICKNAMES |
| roles        | array of snowflakes | array of role ids the member is assigned                                                                                 | MANAGE_ROLES     |
| mute         | boolean             | whether the user is muted in voice channels                                                                              | MUTE_MEMBERS     |
| deaf         | boolean             | whether the user is deafened in voice channels                                                                           | DEAFEN_MEMBERS   |

> warn
> For guilds with Membership Screening enabled, assigning a role using the `roles` parameter will add the user to the guild as a full member (`pending` is false in the [member object](#DOCS_RESOURCES_GUILD/guild-member-object)). A member with a role will bypass membership screening and the guild's verification level, and get immediate access to chat. Therefore, instead of assigning a role when the member joins, it is recommended to grant roles only after the user completes screening.

## Modify Guild Member % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Modify attributes of a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Returns a 200 OK with the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) as the body. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event. If the `channel_id` is set to null, this will force the target user to be disconnected from voice.

> info
> All parameters to this endpoint are optional and nullable. When moving members to channels, the API user _must_ have permissions to both connect to the channel and have the `MOVE_MEMBERS` permission.

###### JSON Params

| Field      | Type                | Description                                                                                            | Permission       |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------ | ---------------- |
| nick       | string              | value to set users nickname to                                                                         | MANAGE_NICKNAMES |
| roles      | array of snowflakes | array of role ids the member is assigned                                                               | MANAGE_ROLES     |
| mute       | boolean             | whether the user is muted in voice channels. Will throw a 400 if the user is not in a voice channel    | MUTE_MEMBERS     |
| deaf       | boolean             | whether the user is deafened in voice channels. Will throw a 400 if the user is not in a voice channel | DEAFEN_MEMBERS   |
| channel_id | snowflake           | id of channel to move user to (if they are connected to voice)                                         | MOVE_MEMBERS     |

## Modify Current User Nick % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/@me/nick

Modifies the nickname of the current user in a guild. Returns a 200 with the nickname on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.

###### JSON Params

| Field | Type    | Description                    | Permission      |
| ----- | ------- | ------------------------------ | --------------- |
| ?nick | ?string | value to set users nickname to | CHANGE_NICKNAME |

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

> info
> Supplying a reason in the JSON body will override `X-Audit-Log-Reason` header if both are provided.

###### JSON Params

| Field                | Type    | Description                                 |
| -------------------- | ------- | ------------------------------------------- |
| delete_message_days? | integer | number of days to delete messages for (0-7) |
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
| permissions | string  | bitwise value of the enabled/disabled permissions              | @everyone permissions in guild |
| color       | integer | RGB color value                                                | 0                              |
| hoist       | boolean | whether the role should be displayed separately in the sidebar | false                          |
| mentionable | boolean | whether the role should be mentionable                         | false                          |

## Modify Guild Role Positions % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Modify the positions of a set of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects for the guild. Requires the `MANAGE_ROLES` permission. Returns a list of all of the guild's [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects on success. Fires multiple [Guild Role Update](#DOCS_TOPICS_GATEWAY/guild-role-update) Gateway events.

This endpoint takes a JSON array of parameters in the following format:

###### JSON Params

| Field     | Type      | Description                  |
| --------- | --------- | ---------------------------- |
| id        | snowflake | role                         |
| ?position | ?integer  | sorting position of the role |

## Modify Guild Role % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Modify a guild role. Requires the `MANAGE_ROLES` permission. Returns the updated [role](#DOCS_TOPICS_PERMISSIONS/role-object) on success. Fires a [Guild Role Update](#DOCS_TOPICS_GATEWAY/guild-role-update) Gateway event.

> info
> All parameters to this endpoint are optional and nullable.

###### JSON Params

| Field       | Type    | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| name        | string  | name of the role                                               |
| permissions | string  | bitwise value of the enabled/disabled permissions              |
| color       | integer | RGB color value                                                |
| hoist       | boolean | whether the role should be displayed separately in the sidebar |
| mentionable | boolean | whether the role should be mentionable                         |

## Delete Guild Role % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Delete a guild role. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Role Delete](#DOCS_TOPICS_GATEWAY/guild-role-delete) Gateway event.

## Get Guild Prune Count % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/prune

Returns an object with one 'pruned' key indicating the number of members that would be removed in a prune operation. Requires the `KICK_MEMBERS` permission.

By default, prune will not remove users with roles. You can optionally include specific roles in your prune by providing the `include_roles` parameter. Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.

###### Query String Params

| Field         | Type                                        | Description                              | Default |
| ------------- | ------------------------------------------- | ---------------------------------------- | ------- |
| days          | integer                                     | number of days to count prune for (1-30) | 7       |
| include_roles | string; comma-delimited array of snowflakes | role(s) to include                       | none    |

## Begin Guild Prune % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/prune

Begin a prune operation. Requires the `KICK_MEMBERS` permission. Returns an object with one 'pruned' key indicating the number of members that were removed in the prune operation. For large guilds it's recommended to set the `compute_prune_count` option to `false`, forcing 'pruned' to `null`. Fires multiple [Guild Member Remove](#DOCS_TOPICS_GATEWAY/guild-member-remove) Gateway events.

By default, prune will not remove users with roles. You can optionally include specific roles in your prune by providing the `include_roles` parameter. Any inactive user that has a subset of the provided role(s) will be included in the prune and users with additional roles will not.

> info
> Supplying a reason in the JSON body will override `X-Audit-Log-Reason` header if both are provided.

###### JSON Params

| Field               | Type                | Description                                                | Default |
| ------------------- | ------------------- | ---------------------------------------------------------- | ------- |
| days                | integer             | number of days to prune (1-30)                             | 7       |
| compute_prune_count | boolean             | whether 'pruned' is returned, discouraged for large guilds | true    |
| include_roles       | array of snowflakes | role(s) to include                                         | none    |
| reason?             | string              | reason for the prune                                       |         |

## Get Guild Voice Regions % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/regions

Returns a list of [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) objects for the guild. Unlike the similar `/voice` route, this returns VIP servers when the guild is VIP-enabled.

## Get Guild Invites % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/invites

Returns a list of [invite](#DOCS_RESOURCES_INVITE/invite-object) objects (with [invite metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)) for the guild. Requires the `MANAGE_GUILD` permission.

## Get Guild Integrations % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations

Returns a list of [integration](#DOCS_RESOURCES_GUILD/integration-object) objects for the guild. Requires the `MANAGE_GUILD` permission.

## Delete Guild Integration % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations/{integration.id#DOCS_RESOURCES_GUILD/integration-object}

Delete the attached [integration](#DOCS_RESOURCES_GUILD/integration-object) object for the guild. Deletes any associated webhooks and kicks the associated bot if there is one. Requires the `MANAGE_GUILD` permission. Returns a 204 empty response on success. Fires a [Guild Integrations Update](#DOCS_TOPICS_GATEWAY/guild-integrations-update) Gateway event.

## Get Guild Widget Settings % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget

Returns a [guild widget](#DOCS_RESOURCES_GUILD/guild-widget-object) object. Requires the `MANAGE_GUILD` permission.

## Modify Guild Widget % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget

Modify a [guild widget](#DOCS_RESOURCES_GUILD/guild-widget-object) object for the guild. All attributes may be passed in with JSON and modified. Requires the `MANAGE_GUILD` permission. Returns the updated [guild widget](#DOCS_RESOURCES_GUILD/guild-widget-object) object.

## Get Guild Widget % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget.json

Returns the widget for the guild.

###### Example Get Guild Widget

```json
{
  "id": "290926798626999250",
  "name": "Test Server",
  "instant_invite": "https://discord.com/invite/abcdefg",
  "channels": [
    {
      "id": "705216630279993882",
      "name": "elephant",
      "position": 2
    },
    {
      "id": "669583461748992190",
      "name": "groovy-music",
      "position": 1
    }
  ],
  "members": [
    {
      "id": "0",
      "username": "1234",
      "discriminator": "0000",
      "avatar": null,
      "status": "online",
      "avatar_url": "https://cdn.discordapp.com/widget-avatars/FfvURgcr3Za92K3JtoCppqnYMppMDc5B-Rll74YrGCU/C-1DyBZPQ6t5q2RuATFuMFgq0_uEMZVzd_6LbGN_uJKvZflobA9diAlTjhf6CAESLLeTuu4dLuHFWOb_PNLteooNfhC4C6k5QgAGuxEOP12tVVVCvX6t64k14PMXZrGTDq8pWZhukP40Wg"
    }
  ],
  "presence_count": 1
}
```

## Get Guild Vanity URL % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/vanity-url

Returns a partial [invite](#DOCS_RESOURCES_INVITE/invite-object) object for guilds with that feature enabled. Requires the `MANAGE_GUILD` permission. `code` will be null if a vanity url for the guild is not set.

###### Example Partial Invite Object

```json
{
  "code": "abc",
  "uses": 12
}
```

## Get Guild Widget Image % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget.png

Returns a PNG image widget for the guild. Requires no permissions or authentication.

> info
> All parameters to this endpoint are optional.

###### Query String Params

| Field | Type   | Description                                    | Default |
| ----- | ------ | ---------------------------------------------- | ------- |
| style | string | style of the widget image returned (see below) | shield  |

###### Widget Style Options

| Value   | Description                                                                                                                                                    | Example                                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| shield  | shield style widget with Discord icon and guild members online count                                                                                           | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=shield)  |
| banner1 | large image with guild icon, name and online count. "POWERED BY DISCORD" as the footer of the widget                                                           | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=banner1) |
| banner2 | smaller widget style with guild icon, name and online count. Split on the right with Discord logo                                                              | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=banner2) |
| banner3 | large image with guild icon, name and online count. In the footer, Discord logo on the left and "Chat Now" on the right                                        | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=banner3) |
| banner4 | large Discord logo at the top of the widget. Guild icon, name and online count in the middle portion of the widget and a "JOIN MY SERVER" button at the bottom | [Example](https://discord.com/api/guilds/81384788765712384/widget.png?style=banner4) |

## Get Guild Welcome Screen % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/welcome-screen

Returns the [Welcome Screen](#DOCS_RESOURCES_GUILD/welcome-screen-object) object for the guild.

## Modify Guild Welcome Screen % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/welcome-screen

Modify the guild's [Welcome Screen](#DOCS_RESOURCES_GUILD/welcome-screen-object). Requires the `MANAGE_GUILD` permission. Returns the updated [Welcome Screen](#DOCS_RESOURCES_GUILD/welcome-screen-object) object.

> info
> All parameters to this endpoint are optional and nullable

| Field            | Type                                                                                                                    | Description                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| enabled          | boolean                                                                                                                 | whether the welcome screen is enabled                           |
| welcome_channels | array of [welcome screen channel](#DOCS_RESOURCES_GUILD/welcome-screen-object-welcome-screen-channel-structure) objects | channels linked in the welcome screen and their display options |
| description      | string                                                                                                                  | the server description to show in the welcome screen            |

## Update Current User Voice State % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/@me

Updates the current user's voice state.

###### JSON Params

| Field                       | Type               | Description                                    |
| --------------------------- | ------------------ | ---------------------------------------------- |
| channel_id                  | snowflake          | the id of the channel the user is currently in |
| suppress?                   | boolean            | toggles the user's suppress state              |
| request_to_speak_timestamp? | ?ISO8601 timestamp | sets the user's request to speak               |

###### Caveats

There are currently several caveats for this endpoint:

- `channel_id` must currently point to a stage channel.
- current user must already have joined `channel_id`.
- You must have the `MUTE_MEMBERS` permission to unsuppress yourself. You can always suppress yourself.
- You must have the `REQUEST_TO_SPEAK` permission to request to speak. You can always clear your own request to speak.
- You are able to set `request_to_speak_timestamp` to any present or future time.

## Update User Voice State % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/{user.id#DOCS_RESOURCES_USER/user-object}

Updates another user's voice state.

###### JSON Params

| Field      | Type      | Description                                    |
| ---------- | --------- | ---------------------------------------------- |
| channel_id | snowflake | the id of the channel the user is currently in |
| suppress?  | boolean   | toggles the user's suppress state              |

###### Caveats

There are currently several caveats for this endpoint:

- `channel_id` must currently point to a stage channel.
- User must already have joined `channel_id`.
- You must have the `MUTE_MEMBERS` permission. (Since suppression is the only thing that is available currently.)
- When unsuppressed, non-bot users will have their `request_to_speak_timestamp` set to the current time. Bot users will not.
- When suppressed, the user will have their `request_to_speak_timestamp` removed.
