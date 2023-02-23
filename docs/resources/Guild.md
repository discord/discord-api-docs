# Guild Resource

Guilds in Discord represent an isolated collection of users and channels, and are often referred to as "servers" in the UI.

### Guild Object

###### Guild Structure

> info
> Fields specific to the `GUILD_CREATE` event are listed in the [Gateway Events documentation](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create).

| Field                         | Type                                                                                | Description                                                                                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                            | snowflake                                                                           | guild id                                                                                                                                                               |
| name                          | string                                                                              | guild name (2-100 characters, excluding trailing and leading whitespace)                                                                                               |
| icon                          | ?string                                                                             | [icon hash](#DOCS_REFERENCE/image-formatting)                                                                                                                          |
| icon_hash?                    | ?string                                                                             | [icon hash](#DOCS_REFERENCE/image-formatting), returned when in the template object                                                                                    |
| splash                        | ?string                                                                             | [splash hash](#DOCS_REFERENCE/image-formatting)                                                                                                                        |
| discovery_splash              | ?string                                                                             | [discovery splash hash](#DOCS_REFERENCE/image-formatting); only present for guilds with the "DISCOVERABLE" feature                                                     |
| owner? \*                     | boolean                                                                             | true if [the user](#DOCS_RESOURCES_USER/get-current-user-guilds) is the owner of the guild                                                                             |
| owner_id                      | snowflake                                                                           | id of owner                                                                                                                                                            |
| permissions? \*               | string                                                                              | total permissions for [the user](#DOCS_RESOURCES_USER/get-current-user-guilds) in the guild (excludes overwrites)                                                      |
| region? \*\*                  | ?string                                                                             | [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id for the guild (deprecated)                                                                                |
| afk_channel_id                | ?snowflake                                                                          | id of afk channel                                                                                                                                                      |
| afk_timeout                   | integer                                                                             | afk timeout in seconds, can be set to: 60, 300, 900, 1800, 3600                                                                                                        |
| widget_enabled?               | boolean                                                                             | true if the server widget is enabled                                                                                                                                   |
| widget_channel_id?            | ?snowflake                                                                          | the channel id that the widget will generate an invite to, or `null` if set to no invite                                                                               |
| verification_level            | integer                                                                             | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level) required for the guild                                                                     |
| default_message_notifications | integer                                                                             | default [message notifications level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level)                                                           |
| explicit_content_filter       | integer                                                                             | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)                                                                      |
| roles                         | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects                       | roles in the guild                                                                                                                                                     |
| emojis                        | array of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects                        | custom guild emojis                                                                                                                                                    |
| features                      | array of [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) strings | enabled guild features                                                                                                                                                 |
| mfa_level                     | integer                                                                             | required [MFA level](#DOCS_RESOURCES_GUILD/guild-object-mfa-level) for the guild                                                                                       |
| application_id                | ?snowflake                                                                          | application id of the guild creator if it is bot-created                                                                                                               |
| system_channel_id             | ?snowflake                                                                          | the id of the channel where guild notices such as welcome messages and boost events are posted                                                                         |
| system_channel_flags          | integer                                                                             | [system channel flags](#DOCS_RESOURCES_GUILD/guild-object-system-channel-flags)                                                                                        |
| rules_channel_id              | ?snowflake                                                                          | the id of the channel where Community guilds can display rules and/or guidelines                                                                                       |
| max_presences?                | ?integer                                                                            | the maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds)                                                            |
| max_members?                  | integer                                                                             | the maximum number of members for the guild                                                                                                                            |
| vanity_url_code               | ?string                                                                             | the vanity url code for the guild                                                                                                                                      |
| description                   | ?string                                                                             | the description of a guild                                                                                                                                             |
| banner                        | ?string                                                                             | [banner hash](#DOCS_REFERENCE/image-formatting)                                                                                                                        |
| premium_tier                  | integer                                                                             | [premium tier](#DOCS_RESOURCES_GUILD/guild-object-premium-tier) (Server Boost level)                                                                                   |
| premium_subscription_count?   | integer                                                                             | the number of boosts this guild currently has                                                                                                                          |
| preferred_locale              | string                                                                              | the preferred [locale](#DOCS_REFERENCE/locales) of a Community guild; used in server discovery and notices from Discord, and sent in interactions; defaults to "en-US" |
| public_updates_channel_id     | ?snowflake                                                                          | the id of the channel where admins and moderators of Community guilds receive notices from Discord                                                                     |
| max_video_channel_users?      | integer                                                                             | the maximum amount of users in a video channel                                                                                                                         |
| approximate_member_count?     | integer                                                                             | approximate number of members in this guild, returned from the `GET /guilds/<id>` endpoint when `with_counts` is `true`                                                |
| approximate_presence_count?   | integer                                                                             | approximate number of non-offline members in this guild, returned from the `GET /guilds/<id>` endpoint when `with_counts` is `true`                                    |
| welcome_screen?               | [welcome screen](#DOCS_RESOURCES_GUILD/welcome-screen-object) object                | the welcome screen of a Community guild, shown to new members, returned in an [Invite](#DOCS_RESOURCES_INVITE/invite-object)'s guild object                            |
| nsfw_level                    | integer                                                                             | [guild NSFW level](#DOCS_RESOURCES_GUILD/guild-object-guild-nsfw-level)                                                                                                |
| stickers?                     | array of [sticker](#DOCS_RESOURCES_STICKER/sticker-object) objects                  | custom guild stickers                                                                                                                                                  |
| premium_progress_bar_enabled  | boolean                                                                             | whether the guild has the boost progress bar enabled                                                                                                                   |

\* These fields are only sent when using the [GET Current User Guilds](#DOCS_RESOURCES_USER/get-current-user-guilds) endpoint and are relative to the requested user

\*\* This field is deprecated and is replaced by [channel.rtc_region](#DOCS_RESOURCES_CHANNEL/channel-object-channel-structure)

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

###### Guild NSFW Level

| Level          | Value |
| -------------- | ----- |
| DEFAULT        | 0     |
| EXPLICIT       | 1     |
| SAFE           | 2     |
| AGE_RESTRICTED | 3     |

###### Premium Tier

| Level  | Integer | Description                                   |
| ------ | ------- | --------------------------------------------- |
| NONE   | 0       | guild has not unlocked any Server Boost perks |
| TIER_1 | 1       | guild has unlocked Server Boost level 1 perks |
| TIER_2 | 2       | guild has unlocked Server Boost level 2 perks |
| TIER_3 | 3       | guild has unlocked Server Boost level 3 perks |

###### System Channel Flags

| Flag                                                     | Value  | Description                                                   |
| -------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| SUPPRESS_JOIN_NOTIFICATIONS                              | 1 << 0 | Suppress member join notifications                            |
| SUPPRESS_PREMIUM_SUBSCRIPTIONS                           | 1 << 1 | Suppress server boost notifications                           |
| SUPPRESS_GUILD_REMINDER_NOTIFICATIONS                    | 1 << 2 | Suppress server setup tips                                    |
| SUPPRESS_JOIN_NOTIFICATION_REPLIES                       | 1 << 3 | Hide member join sticker reply buttons                        |
| SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS        | 1 << 4 | Suppress role subscription purchase and renewal notifications |
| SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES | 1 << 5 | Hide role subscription sticker reply buttons                  |

###### Guild Features

| Feature                                   | Description                                                                                                                   |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ANIMATED_BANNER                           | guild has access to set an animated guild banner image                                                                        |
| ANIMATED_ICON                             | guild has access to set an animated guild icon                                                                                |
| APPLICATION_COMMAND_PERMISSIONS_V2        | guild is using the [old permissions configuration behavior](#DOCS_CHANGE_LOG/upcoming-application-command-permission-changes) |
| AUTO_MODERATION                           | guild has set up auto moderation rules                                                                                        |
| BANNER                                    | guild has access to set a guild banner image                                                                                  |
| COMMUNITY                                 | guild can enable welcome screen, Membership Screening, stage channels and discovery, and receives community updates           |
| CREATOR_MONETIZABLE_PROVISIONAL           | guild has enabled monetization                                                                                                |
| CREATOR_STORE_PAGE                        | guild has enabled the role subscription promo page                                                                            |
| DEVELOPER_SUPPORT_SERVER                  | guild has been set as a support server on the App Directory                                                                   |
| DISCOVERABLE                              | guild is able to be discovered in the directory                                                                               |
| FEATURABLE                                | guild is able to be featured in the directory                                                                                 |
| INVITES_DISABLED                          | guild has paused invites, preventing new users from joining                                                                   |
| INVITE_SPLASH                             | guild has access to set an invite splash background                                                                           |
| MEMBER_VERIFICATION_GATE_ENABLED          | guild has enabled [Membership Screening](#DOCS_RESOURCES_GUILD/membership-screening-object)                                   |
| MORE_STICKERS                             | guild has increased custom sticker slots                                                                                      |
| NEWS                                      | guild has access to create announcement channels                                                                              |
| PARTNERED                                 | guild is partnered                                                                                                            |
| PREVIEW_ENABLED                           | guild can be previewed before joining via Membership Screening or the directory                                               |
| ROLE_ICONS                                | guild is able to set role icons                                                                                               |
| ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE | guild has role subscriptions that can be purchased                                                                            |
| ROLE_SUBSCRIPTIONS_ENABLED                | guild has enabled role subscriptions                                                                                          |
| TICKETED_EVENTS_ENABLED                   | guild has enabled ticketed events                                                                                             |
| VANITY_URL                                | guild has access to set a vanity URL                                                                                          |
| VERIFIED                                  | guild is verified                                                                                                             |
| VIP_REGIONS                               | guild has access to set 384kbps bitrate in voice (previously VIP voice servers)                                               |
| WELCOME_SCREEN_ENABLED                    | guild has enabled the welcome screen                                                                                          |

###### Mutable Guild Features

| Features         | Required Permissions | Effects                                                   |
| ---------------- | -------------------- | --------------------------------------------------------- |
| COMMUNITY        | Administrator        | Enables Community Features in the guild                   |
| INVITES_DISABLED | Manage Guild         | Pauses all invites/access to the server                   |
| DISCOVERABLE     | Administrator*       | Enables discovery in the guild, making it publicly listed |

\* Server also must be passing all discovery requirements

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
  "region": null,
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

A partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object. Represents an Offline Guild, or a Guild whose information has not been provided through [Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) events during the Gateway connect.

###### Example Unavailable Guild

```json
{
  "id": "41771983423143937",
  "unavailable": true
}
```

### Guild Preview Object

###### Guild Preview Structure

| Field                      | Type                                                                                | Description                                               |
| -------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- |
| id                         | snowflake                                                                           | guild id                                                  |
| name                       | string                                                                              | guild name (2-100 characters)                             |
| icon                       | ?string                                                                             | [icon hash](#DOCS_REFERENCE/image-formatting)             |
| splash                     | ?string                                                                             | [splash hash](#DOCS_REFERENCE/image-formatting)           |
| discovery_splash           | ?string                                                                             | [discovery splash hash](#DOCS_REFERENCE/image-formatting) |
| emojis                     | array of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects                        | custom guild emojis                                       |
| features                   | array of [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) strings | enabled guild features                                    |
| approximate_member_count   | integer                                                                             | approximate number of members in this guild               |
| approximate_presence_count | integer                                                                             | approximate number of online members in this guild        |
| description                | ?string                                                                             | the description for the guild                             |
| stickers                   | array of [sticker](#DOCS_RESOURCES_STICKER/sticker-object) objects                  | custom guild stickers                                     |

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
  "description": "The official place to report Discord Bugs!",
  "stickers": []
}
```

### Guild Widget Settings Object

###### Guild Widget Settings Structure

| Field      | Type       | Description                   |
| ---------- | ---------- | ----------------------------- |
| enabled    | boolean    | whether the widget is enabled |
| channel_id | ?snowflake | the widget channel id         |

###### Example Guild Widget Settings

```json
{
  "enabled": true,
  "channel_id": "41771983444115456"
}
```

### Guild Widget Object

###### Guild Widget Structure

| Field          | Type                                                                       | Description                                                          |
| -------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| id             | snowflake                                                                  | guild id                                                             |
| name           | string                                                                     | guild name (2-100 characters)                                        |
| instant_invite | ?string                                                                    | instant invite for the guilds specified widget invite channel        |
| channels       | array of partial [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects | voice and stage channels which are accessible by @everyone           |
| members        | array of partial [user](#DOCS_RESOURCES_USER/user-object) objects          | special widget user objects that includes users presence (Limit 100) |
| presence_count | integer                                                                    | number of online members in this guild                               |

> warn
> The fields `id`, `discriminator` and `avatar` are anonymized to prevent abuse.

###### Example Guild Widget

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

### Guild Member Object

###### Guild Member Structure

| Field                         | Type                                            | Description                                                                                                                                                                                                                          |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| user?                         | [user](#DOCS_RESOURCES_USER/user-object) object | the user this guild member represents                                                                                                                                                                                                |
| nick?                         | ?string                                         | this user's guild nickname                                                                                                                                                                                                           |
| avatar?                       | ?string                                         | the member's [guild avatar hash](#DOCS_REFERENCE/image-formatting)                                                                                                                                                                   |
| roles                         | array of snowflakes                             | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) object ids                                                                                                                                                                     |
| joined_at                     | ISO8601 timestamp                               | when the user joined the guild                                                                                                                                                                                                       |
| premium_since?                | ?ISO8601 timestamp                              | when the user started [boosting](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-) the guild                                                                                                              |
| deaf                          | boolean                                         | whether the user is deafened in voice channels                                                                                                                                                                                       |
| mute                          | boolean                                         | whether the user is muted in voice channels                                                                                                                                                                                          |
| flags                         | integer                                         | [guild member flags](#DOCS_RESOURCES_GUILD/guild-member-object-guild-member-flags) represented as a bit set, defaults to `0`                                                                                                         |
| pending?                      | boolean                                         | whether the user has not yet passed the guild's [Membership Screening](#DOCS_RESOURCES_GUILD/membership-screening-object) requirements                                                                                               |
| permissions?                  | string                                          | total permissions of the member in the channel, including overwrites, returned when in the interaction object                                                                                                                        |
| communication_disabled_until? | ?ISO8601 timestamp                              | when the user's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire and the user will be able to communicate in the guild again, null or a time in the past if the user is not timed out |

> info
> The field `user` won't be included in the member object attached to `MESSAGE_CREATE` and `MESSAGE_UPDATE` gateway events.

> info
> In `GUILD_` events, `pending` will always be included as true or false. In non `GUILD_` events which can only be triggered by non-`pending` users, `pending` will not be included.

###### Example Guild Member

```json
{
  "user": {},
  "nick": "NOT API SUPPORT",
  "avatar": null,
  "roles": [],
  "joined_at": "2015-04-26T06:26:56.936000+00:00",
  "deaf": false,
  "mute": false
}
```

###### Guild Member Flags

| Flag                  | Value  | Description                                           | Editable |
| --------------------- | ------ | ----------------------------------------------------- | -------- |
| DID_REJOIN            | 1 << 0 | Member has left and rejoined the guild                | false    |
| COMPLETED_ONBOARDING  | 1 << 1 | Member has completed onboarding                       | false    |
| BYPASSES_VERIFICATION | 1 << 2 | Member is exempt from guild verification requirements | true     |
| STARTED_ONBOARDING    | 1 << 3 | Member has started onboarding                         | false    |

> info
> BYPASSES_VERIFICATION allows a member who does not meet verification requirements to participate in a server.

### Integration Object

###### Integration Structure

| Field                   | Type                                                                                                 | Description                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| id                      | snowflake                                                                                            | integration id                                                                  |
| name                    | string                                                                                               | integration name                                                                |
| type                    | string                                                                                               | integration type (twitch, youtube, discord, or guild_subscription)              |
| enabled                 | boolean                                                                                              | is this integration enabled                                                     |
| syncing? \*             | boolean                                                                                              | is this integration syncing                                                     |
| role_id? \*             | snowflake                                                                                            | id that this integration uses for "subscribers"                                 |
| enable_emoticons? \*    | boolean                                                                                              | whether emoticons should be synced for this integration (twitch only currently) |
| expire_behavior? \*     | [integration expire behavior](#DOCS_RESOURCES_GUILD/integration-object-integration-expire-behaviors) | the behavior of expiring subscribers                                            |
| expire_grace_period? \* | integer                                                                                              | the grace period (in days) before expiring subscribers                          |
| user?                   | [user](#DOCS_RESOURCES_USER/user-object) object                                                      | user for this integration                                                       |
| account                 | [account](#DOCS_RESOURCES_GUILD/integration-account-object) object                                   | integration account information                                                 |
| synced_at? \*           | ISO8601 timestamp                                                                                    | when this integration was last synced                                           |
| subscriber_count? \*    | integer                                                                                              | how many subscribers this integration has                                       |
| revoked? \*             | boolean                                                                                              | has this integration been revoked                                               |
| application?            | [application](#DOCS_RESOURCES_GUILD/integration-application-object) object                           | The bot/OAuth2 application for discord integrations                             |
| scopes?                 | array of [OAuth2 scopes](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes)                         | the scopes the application has been authorized for                              |

\* These fields are not provided for discord bot integrations.
> warn
> Some older integrations may not have an attached user.

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

| Field            | Type                                                                                                                    | Description                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| description      | ?string                                                                                                                 | the server description shown in the welcome screen |
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

In guilds with [Membership Screening](https://support.discord.com/hc/en-us/articles/1500000466882) enabled, when a member joins, [Guild Member Add](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-add) will be emitted but they will initially be restricted from doing any actions in the guild, and `pending` will be true in the [member object](#DOCS_RESOURCES_GUILD/guild-member-object). When the member completes the screening, [Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update) will be emitted and `pending` will be false.

Giving the member a role will bypass Membership Screening as well as the guild's verification level, giving the member immediate access to chat. Therefore, instead of giving a role when the member joins, it is recommended to not give the role until the user is no longer `pending`.

> warn
> We are making significant changes to the Membership Screening API specifically related to getting and editing the Membership Screening object. Long story short is that it can be improved. As such, we have removed those documentation. There will **not be** any changes to how pending members work, as outlined above. That behavior will stay the same.

## Create Guild % POST /guilds

Create a new guild. Returns a [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) Gateway event.

> warn
> This endpoint can be used only by bots in less than 10 guilds.

###### JSON Params

| Field                          | Type                                                                       | Description                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| name                           | string                                                                     | name of the guild (2-100 characters)                                                                        |
| region?                        | ?string                                                                    | [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id (deprecated)                                   |
| icon?                          | [image data](#DOCS_REFERENCE/image-data)                                   | base64 128x128 image for the guild icon                                                                     |
| verification_level?            | integer                                                                    | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level)                                 |
| default_message_notifications? | integer                                                                    | default [message notification level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level) |
| explicit_content_filter?       | integer                                                                    | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)           |
| roles?                         | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects              | new guild roles                                                                                             |
| channels?                      | array of partial [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects | new guild's channels                                                                                        |
| afk_channel_id?                | snowflake                                                                  | id for afk channel                                                                                          |
| afk_timeout?                   | integer                                                                    | afk timeout in seconds, can be set to: 60, 300, 900, 1800, 3600                                             |
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

> warn
> The `region` field is deprecated and is replaced by [channel.rtc_region](#DOCS_RESOURCES_CHANNEL/channel-object-channel-structure).

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
  "region": null,
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

Returns the [guild preview](#DOCS_RESOURCES_GUILD/guild-preview-object) object for the given id. If the user is not in the guild, then the guild must be lurkable.

## Modify Guild % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Modify a guild's settings. Requires the `MANAGE_GUILD` permission. Returns the updated [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-update) Gateway event.

> info
> All parameters to this endpoint are optional

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

> warn
> Attempting to add or remove the `COMMUNITY` [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) requires the `ADMINISTRATOR` permission.

###### JSON Params

| Field                         | Type                                                                                | Description                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                          | string                                                                              | guild name                                                                                                                                                        |
| region                        | ?string                                                                             | guild [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id (deprecated)                                                                                   |
| verification_level            | ?integer                                                                            | [verification level](#DOCS_RESOURCES_GUILD/guild-object-verification-level)                                                                                       |
| default_message_notifications | ?integer                                                                            | default [message notification level](#DOCS_RESOURCES_GUILD/guild-object-default-message-notification-level)                                                       |
| explicit_content_filter       | ?integer                                                                            | [explicit content filter level](#DOCS_RESOURCES_GUILD/guild-object-explicit-content-filter-level)                                                                 |
| afk_channel_id                | ?snowflake                                                                          | id for afk channel                                                                                                                                                |
| afk_timeout                   | integer                                                                             | afk timeout in seconds, can be set to: 60, 300, 900, 1800, 3600                                                                                                   |
| icon                          | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 1024x1024 png/jpeg/gif image for the guild icon (can be animated gif when the server has the `ANIMATED_ICON` feature)                                      |
| owner_id                      | snowflake                                                                           | user id to transfer guild ownership to (must be owner)                                                                                                            |
| splash                        | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 16:9 png/jpeg image for the guild splash (when the server has the `INVITE_SPLASH` feature)                                                                 |
| discovery_splash              | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 16:9 png/jpeg image for the guild discovery splash (when the server has the `DISCOVERABLE` feature)                                                        |
| banner                        | ?[image data](#DOCS_REFERENCE/image-data)                                           | base64 16:9 png/jpeg image for the guild banner (when the server has the `BANNER` feature; can be animated gif when the server has the `ANIMATED_BANNER` feature) |
| system_channel_id             | ?snowflake                                                                          | the id of the channel where guild notices such as welcome messages and boost events are posted                                                                    |
| system_channel_flags          | integer                                                                             | [system channel flags](#DOCS_RESOURCES_GUILD/guild-object-system-channel-flags)                                                                                   |
| rules_channel_id              | ?snowflake                                                                          | the id of the channel where Community guilds display rules and/or guidelines                                                                                      |
| public_updates_channel_id     | ?snowflake                                                                          | the id of the channel where admins and moderators of Community guilds receive notices from Discord                                                                |
| preferred_locale              | ?string                                                                             | the preferred [locale](#DOCS_REFERENCE/locales) of a Community guild used in server discovery and notices from Discord; defaults to "en-US"                       |
| features                      | array of [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) strings | enabled guild features                                                                                                                                            |
| description                   | ?string                                                                             | the description for the guild                                                                                                                                     |
| premium_progress_bar_enabled  | boolean                                                                             | whether the guild's boost progress bar should be enabled                                                                                                          |

## Delete Guild % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Delete a guild permanently. User must be owner. Returns `204 No Content` on success. Fires a [Guild Delete](#DOCS_TOPICS_GATEWAY_EVENTS/guild-delete) Gateway event.

## Get Guild Channels % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Returns a list of guild [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects. Does not include threads.

## Create Guild Channel % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Create a new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object for the guild. Requires the `MANAGE_CHANNELS` permission. If setting permission overwrites, only permissions your bot has in the guild can be allowed/denied. Setting `MANAGE_ROLES` permission in channels is only possible for guild administrators. Returns the new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Create](#DOCS_TOPICS_GATEWAY_EVENTS/channel-create) Gateway event.

> info
> All parameters to this endpoint are optional and nullable excluding `name`

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                         | Type                                                                           | Description                                                                                                                                                                     | Channel Type                     |
| ----------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| name                          | string                                                                         | channel name (1-100 characters)                                                                                                                                                 | All                              |
| type                          | integer                                                                        | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types)                                                                                                     | All                              |
| topic                         | string                                                                         | channel topic (0-1024 characters)                                                                                                                                               | Text, Announcement, Forum        |
| bitrate\*                     | integer                                                                        | the bitrate (in bits) of the voice or stage channel; min 8000                                                                                                                   | Voice, Stage                     |
| user_limit                    | integer                                                                        | the user limit of the voice channel                                                                                                                                             | Voice, Stage                     |
| rate_limit_per_user           | integer                                                                        | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected | Text, Forum                      |
| position                      | integer                                                                        | sorting position of the channel                                                                                                                                                 | All                              |
| permission_overwrites\*\*     | array of partial [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) objects | the channel's permission overwrites                                                                                                                                             | All                              |
| parent_id                     | snowflake                                                                      | id of the parent category for a channel                                                                                                                                         | Text, Voice, Announcement, Stage, Forum |
| nsfw                          | boolean                                                                        | whether the channel is nsfw                                                                                                                                                     | Text, Voice, Announcement, Stage, Forum |
| rtc_region                    | string                                                                         | channel [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id of the voice or stage channel, automatic when set to null                                                  | Voice, Stage                     |
| video_quality_mode            | integer                                                                        | the camera [video quality mode](#DOCS_RESOURCES_CHANNEL/channel-object-video-quality-modes) of the voice channel                                                                | Voice, Stage                     |
| default_auto_archive_duration | integer                                                                        | the default duration that the clients use (not the API) for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity         | Text, Announcement, Forum        |
| default_reaction_emoji        | [default reaction](#DOCS_RESOURCES_CHANNEL/default-reaction-object) object     | emoji to show in the add reaction button on a thread in a `GUILD_FORUM` channel                                                                                                 | Forum                            |
| available_tags                | array of [tag](#DOCS_RESOURCES_CHANNEL/forum-tag-object) objects               | set of tags that can be used in a `GUILD_FORUM` channel                                                                                                                         | Forum                            |
| default_sort_order            | integer                                                                        | the [default sort order type](#DOCS_RESOURCES_CHANNEL/channel-object-sort-order-types) used to order posts in `GUILD_FORUM` channels                                            | Forum                            |

\* For voice channels, normal servers can set bitrate up to 96000, servers with Boost level 1 can set up to 128000, servers with Boost level 2 can set up to 256000, and servers with Boost level 3 or the `VIP_REGIONS` [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) can set up to 384000. For stage channels, bitrate can be set up to 64000.

\*\* In each overwrite object, the `allow` and `deny` keys can be omitted or set to `null`, which both default to `"0"`.

## Modify Guild Channel Positions % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/channels

Modify the positions of a set of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects for the guild. Requires `MANAGE_CHANNELS` permission. Returns a 204 empty response on success. Fires multiple [Channel Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-update) Gateway events.

> info
> Only channels to be modified are required.

This endpoint takes a JSON array of parameters in the following format:

###### JSON Params

| Field            | Type       | Description                                                                      |
| ---------------- | ---------- | -------------------------------------------------------------------------------- |
| id               | snowflake  | channel id                                                                       |
| position         | ?integer   | sorting position of the channel                                                  |
| lock_permissions | ?boolean   | syncs the permission overwrites with the new parent, if moving to a new category |
| parent_id        | ?snowflake | the new parent ID for the channel that is moved                                  |

## List Active Guild Threads % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/threads/active

Returns all active threads in the guild, including public and private threads. Threads are ordered by their `id`, in descending order.

###### Response Body

| Field   | Type                                                                            | Description                                                                 |
| ------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| threads | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects              | the active threads                                                          |
| members | array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | a thread member object for each returned thread the current user has joined |

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

Adds a user to the guild, provided you have a valid oauth2 access token for the user with the `guilds.join` scope. Returns a 201 Created with the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) as the body, or 204 No Content if the user is already a member of the guild. Fires a [Guild Member Add](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-add) Gateway event.

For guilds with [Membership Screening](#DOCS_RESOURCES_GUILD/membership-screening-object) enabled, this endpoint will default to adding new members as `pending` in the [guild member object](#DOCS_RESOURCES_GUILD/guild-member-object). Members that are `pending` will have to complete membership screening before they become full members that can talk.

> info
> All parameters to this endpoint except for `access_token` are optional.

> info
> The Authorization header must be a Bot token (belonging to the same application used for authorization), and the bot must be a member of the guild with `CREATE_INSTANT_INVITE` permission.

###### JSON Params

| Field        | Type                | Description                                                                                                              | Permission       |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| access_token | string              | an oauth2 access token granted with the `guilds.join` to the bot's application for the user you want to add to the guild |                  |
| nick         | string              | value to set user's nickname to                                                                                          | MANAGE_NICKNAMES |
| roles        | array of snowflakes | array of role ids the member is assigned                                                                                 | MANAGE_ROLES     |
| mute         | boolean             | whether the user is muted in voice channels                                                                              | MUTE_MEMBERS     |
| deaf         | boolean             | whether the user is deafened in voice channels                                                                           | DEAFEN_MEMBERS   |

> warn
> For guilds with Membership Screening enabled, assigning a role using the `roles` parameter will add the user to the guild as a full member (`pending` is false in the [member object](#DOCS_RESOURCES_GUILD/guild-member-object)). A member with a role will bypass membership screening and the guild's verification level, and get immediate access to chat. Therefore, instead of assigning a role when the member joins, it is recommended to grant roles only after the user completes screening.

## Modify Guild Member % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Modify attributes of a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Returns a 200 OK with the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) as the body. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update) Gateway event. If the `channel_id` is set to null, this will force the target user to be disconnected from voice.

> info
> All parameters to this endpoint are optional and nullable. When moving members to channels, the API user _must_ have permissions to both connect to the channel and have the `MOVE_MEMBERS` permission.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                        | Type                | Description                                                                                                                                                                                                                                                                                                                                | Permission       |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| nick                         | string              | value to set user's nickname to                                                                                                                                                                                                                                                                                                            | MANAGE_NICKNAMES |
| roles                        | array of snowflakes | array of role ids the member is assigned                                                                                                                                                                                                                                                                                                   | MANAGE_ROLES     |
| mute                         | boolean             | whether the user is muted in voice channels. Will throw a 400 error if the user is not in a voice channel                                                                                                                                                                                                                                  | MUTE_MEMBERS     |
| deaf                         | boolean             | whether the user is deafened in voice channels. Will throw a 400 error if the user is not in a voice channel                                                                                                                                                                                                                               | DEAFEN_MEMBERS   |
| channel_id                   | snowflake           | id of channel to move user to (if they are connected to voice)                                                                                                                                                                                                                                                                             | MOVE_MEMBERS     |
| communication_disabled_until | ISO8601 timestamp   | when the user's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire and the user will be able to communicate in the guild again (up to 28 days in the future), set to null to remove timeout. Will throw a 403 error if the user has the ADMINISTRATOR permission or is the owner of the guild | MODERATE_MEMBERS |
| flags                        | integer             | [guild member flags](#DOCS_RESOURCES_GUILD/guild-member-object-guild-member-flags)                                                                                                                                                                                                                                                         | MODERATE_MEMBERS

## Modify Current Member % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/@me

Modifies the current member in a guild. Returns a 200 with the updated member object on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field | Type    | Description                     | Permission      |
| ----- | ------- | ------------------------------- | --------------- |
| nick? | ?string | value to set user's nickname to | CHANGE_NICKNAME |

## Modify Current User Nick % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/@me/nick

> danger
> Deprecated in favor of [Modify Current Member](#DOCS_RESOURCES_GUILD/modify-current-member).

Modifies the nickname of the current user in a guild. Returns a 200 with the nickname on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field | Type    | Description                     | Permission      |
| ----- | ------- | ------------------------------- | --------------- |
| nick? | ?string | value to set user's nickname to | CHANGE_NICKNAME |

## Add Guild Member Role % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Adds a role to a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Remove Guild Member Role % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Removes a role from a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Remove Guild Member % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/members/{user.id#DOCS_RESOURCES_USER/user-object}

Remove a member from a guild. Requires `KICK_MEMBERS` permission. Returns a 204 empty response on success. Fires a [Guild Member Remove](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-remove) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Get Guild Bans % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans

Returns a list of [ban](#DOCS_RESOURCES_GUILD/ban-object) objects for the users banned from this guild. Requires the `BAN_MEMBERS` permission.

###### Query String Params

| Field     | Type      | Description                                    | Default |
| --------- | --------- | ---------------------------------------------- | ------- |
| limit?    | number    | number of users to return (up to maximum 1000) | 1000    |
| before? * | snowflake | consider only users before given user id       | null    |
| after? *  | snowflake | consider only users after given user id        | null    |

\* Provide a user id to `before` and `after` for pagination. Users will always be returned in ascending order by `user.id`. If both `before` and `after` are provided, only `before` is respected.

## Get Guild Ban % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [ban](#DOCS_RESOURCES_GUILD/ban-object) object for the given user or a 404 not found if the ban cannot be found. Requires the `BAN_MEMBERS` permission.

## Create Guild Ban % PUT /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans/{user.id#DOCS_RESOURCES_USER/user-object}

Create a guild ban, and optionally delete previous messages sent by the banned user. Requires the `BAN_MEMBERS` permission. Returns a 204 empty response on success. Fires a [Guild Ban Add](#DOCS_TOPICS_GATEWAY_EVENTS/guild-ban-add) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                   | Type    | Description                                                             | Default |
| ----------------------- | ------- | ----------------------------------------------------------------------- | ------- |
| delete_message_days?    | integer | number of days to delete messages for (0-7) (deprecated)                | 0       |
| delete_message_seconds? | integer | number of seconds to delete messages for, between 0 and 604800 (7 days) | 0       |

## Remove Guild Ban % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/bans/{user.id#DOCS_RESOURCES_USER/user-object}

Remove the ban for a user. Requires the `BAN_MEMBERS` permissions. Returns a 204 empty response on success. Fires a [Guild Ban Remove](#DOCS_TOPICS_GATEWAY_EVENTS/guild-ban-remove) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Get Guild Roles % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Returns a list of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects for the guild.

## Create Guild Role % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Create a new [role](#DOCS_TOPICS_PERMISSIONS/role-object) for the guild. Requires the `MANAGE_ROLES` permission. Returns the new [role](#DOCS_TOPICS_PERMISSIONS/role-object) object on success. Fires a [Guild Role Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-role-create) Gateway event. All JSON params are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field         | Type                                      | Description                                                                                                                    | Default                        |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| name          | string                                    | name of the role, max 100 characters                                                                                           | "new role"                     |
| permissions   | string                                    | bitwise value of the enabled/disabled permissions                                                                              | @everyone permissions in guild |
| color         | integer                                   | RGB color value                                                                                                                | 0                              |
| hoist         | boolean                                   | whether the role should be displayed separately in the sidebar                                                                 | false                          |
| icon          | ?[image data](#DOCS_REFERENCE/image-data) | the role's icon image (if the guild has the `ROLE_ICONS` feature)                                                              | null                           |
| unicode_emoji | ?string                                   | the role's unicode emoji as a [standard emoji](#DOCS_REFERENCE/message-formatting) (if the guild has the `ROLE_ICONS` feature) | null                           |
| mentionable   | boolean                                   | whether the role should be mentionable                                                                                         | false                          |

## Modify Guild Role Positions % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles

Modify the positions of a set of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects for the guild. Requires the `MANAGE_ROLES` permission. Returns a list of all of the guild's [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects on success. Fires multiple [Guild Role Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-role-update) Gateway events.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

This endpoint takes a JSON array of parameters in the following format:

###### JSON Params

| Field     | Type      | Description                  |
| --------- | --------- | ---------------------------- |
| id        | snowflake | role                         |
| position? | ?integer  | sorting position of the role |

## Modify Guild Role % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Modify a guild role. Requires the `MANAGE_ROLES` permission. Returns the updated [role](#DOCS_TOPICS_PERMISSIONS/role-object) on success. Fires a [Guild Role Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-role-update) Gateway event.

> info
> All parameters to this endpoint are optional and nullable.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field         | Type                                     | Description                                                                                                                    |
| ------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| name          | string                                   | name of the role, max 100 characters                                                                                           |
| permissions   | string                                   | bitwise value of the enabled/disabled permissions                                                                              |
| color         | integer                                  | RGB color value                                                                                                                |
| hoist         | boolean                                  | whether the role should be displayed separately in the sidebar                                                                 |
| icon          | [image data](#DOCS_REFERENCE/image-data) | the role's icon image (if the guild has the `ROLE_ICONS` feature)                                                              |
| unicode_emoji | string                                   | the role's unicode emoji as a [standard emoji](#DOCS_REFERENCE/message-formatting) (if the guild has the `ROLE_ICONS` feature) |
| mentionable   | boolean                                  | whether the role should be mentionable                                                                                         |

## Modify Guild MFA Level % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/mfa

Modify a guild's MFA level. Requires guild ownership. Returns the updated [level](#DOCS_RESOURCES_GUILD/guild-object-mfa-level) on success. Fires a [Guild Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field | Type    | Description                                               |
| ----- | ------- | --------------------------------------------------------- |
| level | integer | [MFA level](#DOCS_RESOURCES_GUILD/guild-object-mfa-level) |

## Delete Guild Role % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/roles/{role.id#DOCS_TOPICS_PERMISSIONS/role-object}

Delete a guild role. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Role Delete](#DOCS_TOPICS_GATEWAY_EVENTS/guild-role-delete) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Get Guild Prune Count % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/prune

Returns an object with one `pruned` key indicating the number of members that would be removed in a prune operation. Requires the `KICK_MEMBERS` permission.

By default, prune will not remove users with roles. You can optionally include specific roles in your prune by providing the `include_roles` parameter. Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.

###### Query String Params

| Field         | Type                                        | Description                              | Default |
| ------------- | ------------------------------------------- | ---------------------------------------- | ------- |
| days          | integer                                     | number of days to count prune for (1-30) | 7       |
| include_roles | string; comma-delimited array of snowflakes | role(s) to include                       | none    |

## Begin Guild Prune % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/prune

Begin a prune operation. Requires the `KICK_MEMBERS` permission. Returns an object with one `pruned` key indicating the number of members that were removed in the prune operation. For large guilds it's recommended to set the `compute_prune_count` option to `false`, forcing `pruned` to `null`. Fires multiple [Guild Member Remove](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-remove) Gateway events.

By default, prune will not remove users with roles. You can optionally include specific roles in your prune by providing the `include_roles` parameter. Any inactive user that has a subset of the provided role(s) will be included in the prune and users with additional roles will not.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field               | Type                | Description                                                | Default |
| ------------------- | ------------------- | ---------------------------------------------------------- | ------- |
| days                | integer             | number of days to prune (1-30)                             | 7       |
| compute_prune_count | boolean             | whether `pruned` is returned, discouraged for large guilds | true    |
| include_roles       | array of snowflakes | role(s) to include                                         | none    |
| reason?             | string              | reason for the prune (deprecated)                          |         |

## Get Guild Voice Regions % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/regions

Returns a list of [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) objects for the guild. Unlike the similar `/voice` route, this returns VIP servers when the guild is VIP-enabled.

## Get Guild Invites % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/invites

Returns a list of [invite](#DOCS_RESOURCES_INVITE/invite-object) objects (with [invite metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)) for the guild. Requires the `MANAGE_GUILD` permission.

## Get Guild Integrations % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations

Returns a list of [integration](#DOCS_RESOURCES_GUILD/integration-object) objects for the guild. Requires the `MANAGE_GUILD` permission.

> info
> This endpoint returns a maximum of 50 integrations. If a guild has more integrations, they cannot be accessed.

## Delete Guild Integration % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/integrations/{integration.id#DOCS_RESOURCES_GUILD/integration-object}

Delete the attached [integration](#DOCS_RESOURCES_GUILD/integration-object) object for the guild. Deletes any associated webhooks and kicks the associated bot if there is one. Requires the `MANAGE_GUILD` permission. Returns a 204 empty response on success. Fires [Guild Integrations Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-integrations-update) and [Integration Delete](#DOCS_TOPICS_GATEWAY_EVENTS/integration-delete) Gateway events.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Get Guild Widget Settings % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget

Returns a [guild widget settings](#DOCS_RESOURCES_GUILD/guild-widget-settings-object) object. Requires the `MANAGE_GUILD` permission.

## Modify Guild Widget % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget

Modify a [guild widget settings](#DOCS_RESOURCES_GUILD/guild-widget-settings-object) object for the guild. All attributes may be passed in with JSON and modified. Requires the `MANAGE_GUILD` permission. Returns the updated [guild widget](#DOCS_RESOURCES_GUILD/guild-widget-settings-object) object.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Get Guild Widget % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/widget.json

Returns the [widget](#DOCS_RESOURCES_GUILD/guild-widget-object) for the guild.

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

Returns the [Welcome Screen](#DOCS_RESOURCES_GUILD/welcome-screen-object) object for the guild. If the welcome screen is not enabled, the `MANAGE_GUILD` permission is required.

## Modify Guild Welcome Screen % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/welcome-screen

Modify the guild's [Welcome Screen](#DOCS_RESOURCES_GUILD/welcome-screen-object). Requires the `MANAGE_GUILD` permission. Returns the updated [Welcome Screen](#DOCS_RESOURCES_GUILD/welcome-screen-object) object. May fire a [Guild Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-update) Gateway event.

> info
> All parameters to this endpoint are optional and nullable

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field            | Type                                                                                                                    | Description                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| enabled          | boolean                                                                                                                 | whether the welcome screen is enabled                           |
| welcome_channels | array of [welcome screen channel](#DOCS_RESOURCES_GUILD/welcome-screen-object-welcome-screen-channel-structure) objects | channels linked in the welcome screen and their display options |
| description      | string                                                                                                                  | the server description to show in the welcome screen            |

## Modify Current User Voice State % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/@me

Updates the current user's voice state. Returns `204 No Content` on success. Fires a [Voice State Update](#DOCS_TOPICS_GATEWAY_EVENTS/voice-state-update) Gateway event.

###### JSON Params

| Field                       | Type               | Description                                    |
| --------------------------- | ------------------ | ---------------------------------------------- |
| channel_id?                 | snowflake          | the id of the channel the user is currently in |
| suppress?                   | boolean            | toggles the user's suppress state              |
| request_to_speak_timestamp? | ?ISO8601 timestamp | sets the user's request to speak               |

###### Caveats

There are currently several caveats for this endpoint:

- `channel_id` must currently point to a stage channel.
- current user must already have joined `channel_id`.
- You must have the `MUTE_MEMBERS` permission to unsuppress yourself. You can always suppress yourself.
- You must have the `REQUEST_TO_SPEAK` permission to request to speak. You can always clear your own request to speak.
- You are able to set `request_to_speak_timestamp` to any present or future time.

## Modify User Voice State % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/{user.id#DOCS_RESOURCES_USER/user-object}

Updates another user's voice state. Fires a [Voice State Update](#DOCS_TOPICS_GATEWAY_EVENTS/voice-state-update) Gateway event.

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
