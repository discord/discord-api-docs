# Channels Resource

### Channel Object

Represents a guild or DM channel within Discord.

###### Channel Structure

| Field                               | Type                                                                        | Description                                                                                                                                                                                                                                                                                                   |
|-------------------------------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                                  | snowflake                                                                   | the id of this channel                                                                                                                                                                                                                                                                                        |
| type                                | integer                                                                     | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types)                                                                                                                                                                                                                                   |
| guild_id?                           | snowflake                                                                   | the id of the guild (may be missing for some channel objects received over gateway guild dispatches)                                                                                                                                                                                                          |
| position?                           | integer                                                                     | sorting position of the channel (channels with the same position are sorted by id)                                                                                                                                                                                                                            |
| permission_overwrites?              | array of [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) objects      | explicit permission overwrites for members and roles                                                                                                                                                                                                                                                          |
| name?                               | ?string                                                                     | the name of the channel (1-100 characters)                                                                                                                                                                                                                                                                    |
| topic?                              | ?string                                                                     | the channel topic (0-4096 characters for `GUILD_FORUM` and `GUILD_MEDIA` channels, 0-1024 characters for all others)                                                                                                                                                                                          |
| nsfw?                               | boolean                                                                     | whether the channel is nsfw                                                                                                                                                                                                                                                                                   |
| last_message_id?                    | ?snowflake                                                                  | the id of the last message sent in this channel (or thread for `GUILD_FORUM` or `GUILD_MEDIA` channels) (may not point to an existing or valid message or thread)                                                                                                                                             |
| bitrate?                            | integer                                                                     | the bitrate (in bits) of the voice channel                                                                                                                                                                                                                                                                    |
| user_limit?                         | integer                                                                     | the user limit of the voice channel                                                                                                                                                                                                                                                                           |
| rate_limit_per_user?\*              | integer                                                                     | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected                                                                                                                               |
| recipients?                         | array of [user](#DOCS_RESOURCES_USER/user-object) objects                   | the recipients of the DM                                                                                                                                                                                                                                                                                      |
| icon?                               | ?string                                                                     | icon hash of the group DM                                                                                                                                                                                                                                                                                     |
| owner_id?                           | snowflake                                                                   | id of the creator of the group DM or thread                                                                                                                                                                                                                                                                   |
| application_id?                     | snowflake                                                                   | application id of the group DM creator if it is bot-created                                                                                                                                                                                                                                                   |
| managed?                            | boolean                                                                     | for group DM channels: whether the channel is managed by an application via the `gdm.join` OAuth2 scope                                                                                                                                                                                                       |
| parent_id?                          | ?snowflake                                                                  | for guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created                                                                                                                                 |
| last_pin_timestamp?                 | ?ISO8601 timestamp                                                          | when the last pinned message was pinned. This may be `null` in events such as `GUILD_CREATE` when a message is not pinned.                                                                                                                                                                                    |
| rtc_region?                         | ?string                                                                     | [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id for the voice channel, automatic when set to null                                                                                                                                                                                                |
| video_quality_mode?                 | integer                                                                     | the camera [video quality mode](#DOCS_RESOURCES_CHANNEL/channel-object-video-quality-modes) of the voice channel, 1 when not present                                                                                                                                                                          |
| message_count?\*\*                  | integer                                                                     | number of messages (not including the initial message or deleted messages) in a thread.                                                                                                                                                                                                                       |
| member_count?                       | integer                                                                     | an approximate count of users in a thread, stops counting at 50                                                                                                                                                                                                                                               |
| thread_metadata?                    | a [thread metadata](#DOCS_RESOURCES_CHANNEL/thread-metadata-object) object  | thread-specific fields not needed by other channels                                                                                                                                                                                                                                                           |
| member?                             | a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object      | thread member object for the current user, if they have joined the thread, only included on certain API endpoints                                                                                                                                                                                             |
| default_auto_archive_duration?      | integer                                                                     | default duration, copied onto newly created threads, in minutes, threads will stop showing in the channel list after the specified period of inactivity, can be set to: 60, 1440, 4320, 10080                                                                                                                 |
| permissions?                        | string                                                                      | computed permissions for the invoking user in the channel, including overwrites, only included when part of the `resolved` data received on a slash command interaction. This does not include [implicit permissions](#DOCS_TOPICS_PERMISSIONS/implicit-permissions), which may need to be checked separately |
| flags?                              | integer                                                                     | [channel flags](#DOCS_RESOURCES_CHANNEL/channel-object-channel-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field)                                                                                                                                                                       |
| total_message_sent?                 | integer                                                                     | number of messages ever sent in a thread, it's similar to `message_count` on message creation, but will not decrement the number when a message is deleted                                                                                                                                                    |
| available_tags?                     | array of [tag](#DOCS_RESOURCES_CHANNEL/forum-tag-object) objects            | the set of tags that can be used in a `GUILD_FORUM` or a `GUILD_MEDIA` channel                                                                                                                                                                                                                                |
| applied_tags?                       | array of snowflakes                                                         | the IDs of the set of tags that have been applied to a thread in a `GUILD_FORUM` or a `GUILD_MEDIA` channel                                                                                                                                                                                                   |
| default_reaction_emoji?             | ?[default reaction](#DOCS_RESOURCES_CHANNEL/default-reaction-object) object | the emoji to show in the add reaction button on a thread in a `GUILD_FORUM` or a `GUILD_MEDIA` channel                                                                                                                                                                                                        |
| default_thread_rate_limit_per_user? | integer                                                                     | the initial `rate_limit_per_user` to set on newly created threads in a channel. this field is copied to the thread at creation time and does not live update.                                                                                                                                                 |
| default_sort_order?                 | ?integer                                                                    | the [default sort order type](#DOCS_RESOURCES_CHANNEL/channel-object-sort-order-types) used to order posts in `GUILD_FORUM` and `GUILD_MEDIA` channels. Defaults to `null`, which indicates a preferred sort order hasn't been set by a channel admin                                                         |
| default_forum_layout?               | integer                                                                     | the [default forum layout view](#DOCS_RESOURCES_CHANNEL/channel-object-forum-layout-types) used to display posts in `GUILD_FORUM` channels. Defaults to `0`, which indicates a layout view has not been set by a channel admin                                                                                |

\* `rate_limit_per_user` also applies to thread creation. Users can send one message and create one thread during each `rate_limit_per_user` interval.

\*\* For threads created before July 1, 2022, the message count is inaccurate when it's greater than 50.

###### Channel Types

> warn
> Type 10, 11 and 12 are only available in API v9 and above.

| Type                | ID | Description                                                                                                                                                |
|---------------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GUILD_TEXT          | 0  | a text channel within a server                                                                                                                             |
| DM                  | 1  | a direct message between users                                                                                                                             |
| GUILD_VOICE         | 2  | a voice channel within a server                                                                                                                            |
| GROUP_DM            | 3  | a direct message between multiple users                                                                                                                    |
| GUILD_CATEGORY      | 4  | an [organizational category](https://support.discord.com/hc/en-us/articles/115001580171-Channel-Categories-101) that contains up to 50 channels            |
| GUILD_ANNOUNCEMENT  | 5  | a channel that [users can follow and crosspost into their own server](https://support.discord.com/hc/en-us/articles/360032008192) (formerly news channels) |
| ANNOUNCEMENT_THREAD | 10 | a temporary sub-channel within a GUILD_ANNOUNCEMENT channel                                                                                                |
| PUBLIC_THREAD       | 11 | a temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel                                                                                         |
| PRIVATE_THREAD      | 12 | a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission                    |
| GUILD_STAGE_VOICE   | 13 | a voice channel for [hosting events with an audience](https://support.discord.com/hc/en-us/articles/1500005513722)                                         |
| GUILD_DIRECTORY     | 14 | the channel in a [hub](https://support.discord.com/hc/en-us/articles/4406046651927-Discord-Student-Hubs-FAQ) containing the listed servers                 |
| GUILD_FORUM         | 15 | Channel that can only contain threads                                                                                                                      |
| GUILD_MEDIA         | 16 | Channel that can only contain threads, similar to `GUILD_FORUM` channels                                                                                   |

\* The `GUILD_MEDIA` channel type is still in active development. Avoid implementing any features that are not documented here, since they are subject to change without notice!

###### Video Quality Modes

| Mode | Value | Description                                         |
|------|-------|-----------------------------------------------------|
| AUTO | 1     | Discord chooses the quality for optimal performance |
| FULL | 2     | 720p                                                |

###### Channel Flags

| Flag                        | Value     | Description                                                                                                                                                     |
|-----------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PINNED                      | `1 << 1`  | this thread is pinned to the top of its parent `GUILD_FORUM` or `GUILD_MEDIA` channel                                                                           |
| REQUIRE_TAG                 | `1 << 4`  | whether a tag is required to be specified when creating a thread in a `GUILD_FORUM` or a `GUILD_MEDIA` channel. Tags are specified in the `applied_tags` field. |
| HIDE_MEDIA_DOWNLOAD_OPTIONS | `1 << 15` | when set hides the embedded media download options. Available only for media channels                                                                           |

###### Sort Order Types

| Flag            | Value | Description                                                    |
|-----------------|-------|----------------------------------------------------------------|
| LATEST_ACTIVITY | 0     | Sort forum posts by activity                                   |
| CREATION_DATE   | 1     | Sort forum posts by creation time (from most recent to oldest) |

###### Forum Layout Types

| Flag         | Value | Description                               |
|--------------|-------|-------------------------------------------|
| NOT_SET      | 0     | No default has been set for forum channel |
| LIST_VIEW    | 1     | Display posts as a list                   |
| GALLERY_VIEW | 2     | Display posts as a collection of tiles    |

###### Example Guild Text Channel

```json
{
  "id": "41771983423143937",
  "guild_id": "41771983423143937",
  "name": "general",
  "type": 0,
  "position": 6,
  "permission_overwrites": [],
  "rate_limit_per_user": 2,
  "nsfw": true,
  "topic": "24/7 chat about how to gank Mike #2",
  "last_message_id": "155117677105512449",
  "parent_id": "399942396007890945",
  "default_auto_archive_duration": 60
}
```

###### Example Guild Announcement Channel

Bots can post or publish messages in this type of channel if they have the proper permissions.

```json
{
  "id": "41771983423143937",
  "guild_id": "41771983423143937",
  "name": "important-news",
  "type": 5,
  "position": 6,
  "permission_overwrites": [],
  "nsfw": true,
  "topic": "Rumors about Half Life 3",
  "last_message_id": "155117677105512449",
  "parent_id": "399942396007890945",
  "default_auto_archive_duration": 60
}
```

###### Example Guild Voice Channel

```json
{
  "id": "155101607195836416",
  "last_message_id": "174629835082649376",
  "type": 2,
  "name": "ROCKET CHEESE",
  "position": 5,
  "parent_id": null,
  "bitrate": 64000,
  "user_limit": 0,
  "rtc_region": null,
  "guild_id": "41771983423143937",
  "permission_overwrites": [],
  "rate_limit_per_user": 0,
  "nsfw": false,
}
```

###### Example DM Channel

```json
{
  "last_message_id": "3343820033257021450",
  "type": 1,
  "id": "319674150115610528",
  "recipients": [
    {
      "username": "test",
      "discriminator": "9999",
      "id": "82198898841029460",
      "avatar": "33ecab261d4681afa4d85a04691c4a01"
    }
  ]
}
```

###### Example Group DM Channel

```json
{
  "name": "Some test channel",
  "icon": null,
  "recipients": [
    {
      "username": "test",
      "discriminator": "9999",
      "id": "82198898841029460",
      "avatar": "33ecab261d4681afa4d85a04691c4a01"
    },
    {
      "username": "test2",
      "discriminator": "9999",
      "id": "82198810841029460",
      "avatar": "33ecab261d4681afa4d85a10691c4a01"
    }
  ],
  "last_message_id": "3343820033257021450",
  "type": 3,
  "id": "319674150115710528",
  "owner_id": "82198810841029460"
}
```

###### Example Channel Category

```json
{
  "permission_overwrites": [],
  "name": "Test",
  "parent_id": null,
  "nsfw": false,
  "position": 0,
  "guild_id": "290926798629997250",
  "type": 4,
  "id": "399942396007890945"
}
```

###### Example Thread Channel

[Threads](#DOCS_TOPICS_THREADS) can be either `archived` or `active`.  Archived threads are generally immutable.  To send a message or add a reaction, a thread must first be unarchived.  The API will helpfully automatically unarchive a thread when sending a message in that thread.

Unlike with channels, the API will only sync updates to users about threads the current user can view.  When receiving a [guild create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) payload, the API will only include active threads the current user can view.  Threads inside of private channels are completely private to the members of that private channel.  As such, when _gaining_ access to a channel the API sends a [thread list sync](#DOCS_TOPICS_GATEWAY_EVENTS/thread-list-sync), which includes all active threads in that channel.

Threads also track membership.  Users must be added to a thread before sending messages in them.  The API will helpfully automatically add users to a thread when sending a message in that thread.

Guilds have limits on the number of active threads and members per thread.  Once these are reached additional threads cannot be created or unarchived, and users cannot be added.  Threads do not count against the per-guild channel limit.

The [threads](#DOCS_TOPICS_THREADS) topic has some more information.

```json
{
  "id": "41771983423143937",
  "guild_id": "41771983423143937",
  "parent_id": "41771983423143937",
  "owner_id": "41771983423143937",
  "name": "don't buy dota-2",
  "type": 11,
  "last_message_id": "155117677105512449",
  "message_count": 1,
  "member_count": 5,
  "rate_limit_per_user": 2,
  "thread_metadata": {
    "archived": false,
    "auto_archive_duration": 1440,
    "archive_timestamp": "2021-04-12T23:40:39.855793+00:00",
    "locked": false
  },
  "total_message_sent": 1
}
```

### Message Object

Represents a message sent in a channel within Discord.

###### Message Structure

> info
> Fields specific to the `MESSAGE_CREATE` and `MESSAGE_UPDATE` events are listed in the [Gateway documentation](#DOCS_TOPICS_GATEWAY_EVENTS/message-create).

> warn
> An app will receive empty values in the `content`, `embeds`, `attachments`, and `components` fields while `poll` will be omitted if they have not configured (or been approved for) the [`MESSAGE_CONTENT` privileged intent (`1 << 15`)](#DOCS_TOPICS_GATEWAY/message-content-intent).

| Field                     | Type                                                                                                                                      | Description                                                                                                                                                                                                                                                             |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                        | snowflake                                                                                                                                 | id of the message                                                                                                                                                                                                                                                       |
| channel_id                | snowflake                                                                                                                                 | id of the channel the message was sent in                                                                                                                                                                                                                               |
| author \[1\]              | [user](#DOCS_RESOURCES_USER/user-object) object                                                                                           | the author of this message (not guaranteed to be a valid user, see below)                                                                                                                                                                                               |
| content \[2\]             | string                                                                                                                                    | contents of the message                                                                                                                                                                                                                                                 |
| timestamp                 | ISO8601 timestamp                                                                                                                         | when this message was sent                                                                                                                                                                                                                                              |
| edited_timestamp          | ?ISO8601 timestamp                                                                                                                        | when this message was edited (or null if never)                                                                                                                                                                                                                         |
| tts                       | boolean                                                                                                                                   | whether this was a TTS message                                                                                                                                                                                                                                          |
| mention_everyone          | boolean                                                                                                                                   | whether this message mentions everyone                                                                                                                                                                                                                                  |
| mentions                  | array of [user](#DOCS_RESOURCES_USER/user-object) objects                                                                                 | users specifically mentioned in the message                                                                                                                                                                                                                             |
| mention_roles             | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) object ids                                                                          | roles specifically mentioned in this message                                                                                                                                                                                                                            |
| mention_channels? \[3\]   | array of [channel mention](#DOCS_RESOURCES_CHANNEL/channel-mention-object) objects                                                        | channels specifically mentioned in this message                                                                                                                                                                                                                         |
| attachments \[2\]         | array of [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects                                                                  | any attached files                                                                                                                                                                                                                                                      |
| embeds \[2\]              | array of [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects                                                                            | any embedded content                                                                                                                                                                                                                                                    |
| reactions?                | array of [reaction](#DOCS_RESOURCES_CHANNEL/reaction-object) objects                                                                      | reactions to the message                                                                                                                                                                                                                                                |
| nonce?                    | integer or string                                                                                                                         | used for validating a message was sent                                                                                                                                                                                                                                  |
| pinned                    | boolean                                                                                                                                   | whether this message is pinned                                                                                                                                                                                                                                          |
| webhook_id?               | snowflake                                                                                                                                 | if the message is generated by a webhook, this is the webhook's id                                                                                                                                                                                                      |
| type                      | integer                                                                                                                                   | [type of message](#DOCS_RESOURCES_CHANNEL/message-object-message-types)                                                                                                                                                                                                 |
| activity?                 | [message activity](#DOCS_RESOURCES_CHANNEL/message-object-message-activity-structure) object                                              | sent with Rich Presence-related chat embeds                                                                                                                                                                                                                             |
| application?              | partial [application](#DOCS_RESOURCES_APPLICATION/application-object) object                                                              | sent with Rich Presence-related chat embeds                                                                                                                                                                                                                             |
| application_id?           | snowflake                                                                                                                                 | if the message is an [Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/) or application-owned webhook, this is the id of the application                                                                                                                        |
| flags?                    | integer                                                                                                                                   | [message flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field)                                                                                                                                 |
| message_reference?        | [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-structure) object                                                           | data showing the source of a crosspost, channel follow add, pin, or reply message                                                                                                                                                                                       |
| message_snapshots? \[5\]  | array of [message snapshot](#DOCS_RESOURCES_CHANNEL/message-snapshot-object) objects                                                      | the message associated with the `message_reference`. This is a minimal subset of fields in a message (e.g. `author` is excluded.)                                                                                                                                       |
| referenced_message? \[4\] | ?[message object](#DOCS_RESOURCES_CHANNEL/message-object)                                                                                 | the message associated with the message_reference                                                                                                                                                                                                                       |
| interaction_metadata?     | [message interaction metadata object](#DOCS_RESOURCES_CHANNEL/message-interaction-metadata-object-message-interaction-metadata-structure) | [In preview](#DOCS_CHANGE_LOG/userinstallable-apps-preview). Sent if the message is sent as a result of an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/)                                                                                                  |
| interaction?              | [message interaction object](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/message-interaction-object-message-interaction-structure)        | **Deprecated in favor of `interaction_metadata`**; sent if the message is a response to an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/)                                                                                                                  |
| thread?                   | [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object                                                                                  | the thread that was started from this message, includes [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object                                                                                                                                            |
| components? \[2\]         | array of [message components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object)                                                     | sent if the message contains components like buttons, action rows, or other interactive components                                                                                                                                                                      |
| sticker_items?            | array of [message sticker item objects](#DOCS_RESOURCES_STICKER/sticker-item-object)                                                      | sent if the message contains stickers                                                                                                                                                                                                                                   |
| stickers?                 | array of [sticker](#DOCS_RESOURCES_STICKER/sticker-object) objects                                                                        | **Deprecated** the stickers sent with the message                                                                                                                                                                                                                       |
| position?                 | integer                                                                                                                                   | A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with `total_message_sent` on parent thread |
| role_subscription_data?   | [role subscription data](#DOCS_RESOURCES_CHANNEL/role-subscription-data-object) object                                                    | data of the role subscription purchase or renewal that prompted this ROLE_SUBSCRIPTION_PURCHASE message                                                                                                                                                                 |
| resolved?                 | [resolved](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-resolved-data-structure) data                                   | data for users, members, channels, and roles in the message's [auto-populated select menus](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menus)                                                                                                                         |
| poll? \[2\]               | [poll](#DOCS_RESOURCES_POLL/poll-object) object                                                                                           | A poll!                                                                                                                                                                                                                                                                 |
| call?                     | [message call](#DOCS_RESOURCES_CHANNEL/message-call-object) object                                                                        | the call associated with the message                                                                                                                                                                                                                                    |


\[1\] The author object follows the structure of the user object, but is only a valid user in the case where the message is generated by a user or bot user. If the message is generated by a webhook, the author object corresponds to the webhook's id, username, and avatar. You can tell if a message is generated by a webhook by checking for the `webhook_id` on the message object.

\[2\] An app will receive empty values in the `content`, `embeds`, `attachments`, and `components` fields while `poll` will be omitted if they have not configured (or been approved for) the [`MESSAGE_CONTENT` privileged intent (`1 << 15`)](#DOCS_TOPICS_GATEWAY/message-content-intent).

\[3\] Not all channel mentions in a message will appear in `mention_channels`. Only textual channels that are visible to everyone in a lurkable guild will ever be included. Only crossposted messages (via Channel Following) currently include `mention_channels` at all. If no mentions in the message meet these requirements, this field will not be sent.

\[4\] This field is only returned for messages with a `type` of `19` (REPLY) or `21` (THREAD_STARTER_MESSAGE). If the message is a reply but the `referenced_message` field is not present, the backend did not attempt to fetch the message that was being replied to, so its state is unknown. If the field exists but is null, the referenced message was deleted.

\[5\] See [message reference types](#DOCS_RESOURCES_CHANNEL/message-reference-types)

###### Message Types

> warn
> Type `19` and `20` are only available in API v8 and above. In v6, they are represented as type `0`.  Additionally, type `21` is only available in API v9 and above.

| Type                                         | Value | Deletable |
|----------------------------------------------|-------|-----------|
| DEFAULT                                      | 0     | true      |
| RECIPIENT_ADD                                | 1     | false     |
| RECIPIENT_REMOVE                             | 2     | false     |
| CALL                                         | 3     | false     |
| CHANNEL_NAME_CHANGE                          | 4     | false     |
| CHANNEL_ICON_CHANGE                          | 5     | false     |
| CHANNEL_PINNED_MESSAGE                       | 6     | true      |
| USER_JOIN                                    | 7     | true      |
| GUILD_BOOST                                  | 8     | true      |
| GUILD_BOOST_TIER_1                           | 9     | true      |
| GUILD_BOOST_TIER_2                           | 10    | true      |
| GUILD_BOOST_TIER_3                           | 11    | true      |
| CHANNEL_FOLLOW_ADD                           | 12    | true      |
| GUILD_DISCOVERY_DISQUALIFIED                 | 14    | true      |
| GUILD_DISCOVERY_REQUALIFIED                  | 15    | true      |
| GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING | 16    | true      |
| GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING   | 17    | true      |
| THREAD_CREATED                               | 18    | true      |
| REPLY                                        | 19    | true      |
| CHAT_INPUT_COMMAND                           | 20    | true      |
| THREAD_STARTER_MESSAGE                       | 21    | false     |
| GUILD_INVITE_REMINDER                        | 22    | true      |
| CONTEXT_MENU_COMMAND                         | 23    | true      |
| AUTO_MODERATION_ACTION                       | 24    | true*     |
| ROLE_SUBSCRIPTION_PURCHASE                   | 25    | true      |
| INTERACTION_PREMIUM_UPSELL                   | 26    | true      |
| STAGE_START                                  | 27    | true      |
| STAGE_END                                    | 28    | true      |
| STAGE_SPEAKER                                | 29    | true      |
| STAGE_TOPIC                                  | 31    | true      |
| GUILD_APPLICATION_PREMIUM_SUBSCRIPTION       | 32    | true      |
| GUILD_INCIDENT_ALERT_MODE_ENABLED            | 36    | true      |
| GUILD_INCIDENT_ALERT_MODE_DISABLED           | 37    | true      |
| GUILD_INCIDENT_REPORT_RAID                   | 38    | true      |
| GUILD_INCIDENT_REPORT_FALSE_ALARM            | 39    | true      |
| PURCHASE_NOTIFICATION                        | 44    | true      |

\* Can only be deleted by members with `MANAGE_MESSAGES` permission

###### Message Activity Structure

| Field     | Type    | Description                                                                                                        |
|-----------|---------|--------------------------------------------------------------------------------------------------------------------|
| type      | integer | [type of message activity](#DOCS_RESOURCES_CHANNEL/message-object-message-activity-types)                          |
| party_id? | string  | party_id from a [Rich Presence event](#DOCS_RICH_PRESENCE_HOW_TO/updating-presence-update-presence-payload-fields) |

###### Message Activity Types

| Type         | Value |
|--------------|-------|
| JOIN         | 1     |
| SPECTATE     | 2     |
| LISTEN       | 3     |
| JOIN_REQUEST | 5     |

###### Message Flags

| Flag                                   | Value     | Description                                                                       |
|----------------------------------------|-----------|-----------------------------------------------------------------------------------|
| CROSSPOSTED                            | `1 << 0`  | this message has been published to subscribed channels (via Channel Following)    |
| IS_CROSSPOST                           | `1 << 1`  | this message originated from a message in another channel (via Channel Following) |
| SUPPRESS_EMBEDS                        | `1 << 2`  | do not include any embeds when serializing this message                           |
| SOURCE_MESSAGE_DELETED                 | `1 << 3`  | the source message for this crosspost has been deleted (via Channel Following)    |
| URGENT                                 | `1 << 4`  | this message came from the urgent message system                                  |
| HAS_THREAD                             | `1 << 5`  | this message has an associated thread, with the same id as the message            |
| EPHEMERAL                              | `1 << 6`  | this message is only visible to the user who invoked the Interaction              |
| LOADING                                | `1 << 7`  | this message is an Interaction Response and the bot is "thinking"                 |
| FAILED_TO_MENTION_SOME_ROLES_IN_THREAD | `1 << 8`  | this message failed to mention some roles and add their members to the thread     |
| SUPPRESS_NOTIFICATIONS                 | `1 << 12` | this message will not trigger push and desktop notifications                      |
| IS_VOICE_MESSAGE                       | `1 << 13` | this message is a voice message                                                   |

###### Example Message

```json
{
  "reactions": [
    {
      "count": 1,
      "count_details": {
         "burst": 0,
         "normal": 1
      },
      "me": false,
      "me_burst": false,
      "emoji": {
         "id": null,
         "name": "🔥"
      },
      "burst_colors": []
    }
  ],
  "attachments": [],
  "tts": false,
  "embeds": [],
  "timestamp": "2017-07-11T17:27:07.299000+00:00",
  "mention_everyone": false,
  "id": "334385199974967042",
  "pinned": false,
  "edited_timestamp": null,
  "author": {
    "username": "Mason",
    "discriminator": "9999",
    "id": "53908099506183680",
    "avatar": "a_bab14f271d565501444b2ca3be944b25"
  },
  "mention_roles": [],
  "content": "Supa Hot",
  "channel_id": "290926798999357250",
  "mentions": [],
  "type": 0
}
```

###### Example Crossposted Message

```json
{
  "reactions": [
    {
      "count": 1,
      "count_details": {
         "burst": 0,
         "normal": 1
      },
      "me": false,
      "me_burst": false,
      "emoji": {
         "id": null,
         "name": "🔥"
      },
      "burst_colors": []
    }
  ],
  "attachments": [],
  "tts": false,
  "embeds": [],
  "timestamp": "2017-07-11T17:27:07.299000+00:00",
  "mention_everyone": false,
  "id": "334385199974967042",
  "pinned": false,
  "edited_timestamp": null,
  "author": {
    "username": "Mason",
    "discriminator": "9999",
    "id": "53908099506183680",
    "avatar": "a_bab14f271d565501444b2ca3be944b25"
  },
  "mention_roles": [],
  "mention_channels": [
    {
      "id": "278325129692446722",
      "guild_id": "278325129692446720",
      "name": "big-news",
      "type": 5
    }
  ],
  "content": "Big news! In this <#278325129692446722> channel!",
  "channel_id": "290926798999357250",
  "mentions": [],
  "type": 0,
  "flags": 2,
  "message_reference": {
    "type": 0,
    "channel_id": "278325129692446722",
    "guild_id": "278325129692446720",
    "message_id": "306588351130107906"
  }
}
```

### Message Interaction Metadata Object

Metadata about the interaction, including the source of the interaction and relevant server and user IDs.

###### Message Interaction Metadata Structure

| Field                            | Type                                                                                                                                  | Description                                                                                                                                                                                                         |
|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                               | snowflake                                                                                                                             | ID of the interaction                                                                                                                                                                                               |
| type                             | [interaction type](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-type)                                   | Type of interaction                                                                                                                                                                                                 |
| user                             | [user object](#DOCS_RESOURCES_USER/user-object)                                                                                       | User who triggered the interaction                                                                                                                                                                                  |
| authorizing_integration_owners   | dictionary with keys of [application integration types](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-types) | IDs for installation context(s) related to an interaction. Details in [Authorizing Integration Owners Object](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-authorizing-integration-owners-object) |
| original_response_message_id?    | snowflake                                                                                                                             | ID of the original response message, present only on [follow-up messages](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/)                                                                                             |
| interacted_message_id?           | snowflake                                                                                                                             | ID of the message that contained interactive component, present only on messages created from component interactions                                                                                                |
| triggering_interaction_metadata? | Message Interaction Metadata Structure                                                                                                | Metadata for the interaction that was used to open the modal, present only on modal submit interactions                                                                                                             |

### Message Call Object

Information about the call in a private channel.

###### Message Call Object Structure

| Field            | Type                | Description                                                                                |
|------------------|---------------------|--------------------------------------------------------------------------------------------|
| participants     | array of snowflakes | array of [user](#DOCS_RESOURCES_USER/user-object) object ids that participated in the call |
| ended_timestamp? | ?ISO8601 timestamp  | time when call ended                                                                       |

### Message Reference Object

#### Message Reference Structure

| Field               | Type      | Description                                                                                                                             |
|---------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------|
| type? \*            | integer   | [type of reference](#DOCS_RESOURCES_CHANNEL/message-reference-types).                                                                   |
| message_id?         | snowflake | id of the originating message                                                                                                           |
| channel_id? \*\*    | snowflake | id of the originating message's channel                                                                                                 |
| guild_id?           | snowflake | id of the originating message's guild                                                                                                   |
| fail_if_not_exists? | boolean   | when sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true |

\* If `type` is unset, `DEFAULT` can be assumed in order to match the behaviour before message reference had types.
In future API versions this will become a required field.

\*\* `channel_id` is optional when creating a reply, but will always be present when receiving an event/response that includes this data model. **Required for forwards.**

#### Message Reference Types

Determines how associated data is populated.

| Type    | Value | Coupled Message Field | Description                                              |
|---------|-------|-----------------------|----------------------------------------------------------|
| DEFAULT | 0     | `referenced_message`  | A standard reference used by replies.                    |
| FORWARD | 1     | `message_snapshot`    | Reference used to point to a message at a point in time. |

`FORWARD` can only be used for basic messages; i.e. messages which do not have strong bindings to a non global entity.
Thus we support only messages with `DEFAULT` or `REPLY` types, but disallowed if there are any polls, calls, or components.
This is subject to change in the future.

#### Message Reference Content Attribution

Message references are generic attribution on a message.
There are multiple message types that have a `message_reference` object.

###### Crosspost messages

- These are messages that originated from another channel (IS_CROSSPOST flag).
- These messages have all three fields, which point to the original message that was crossposted.

###### Channel Follow Add messages

- These are automatic messages sent when a channel is followed into the current channel (type 12).
- These messages have the `channel_id` and `guild_id` fields, which point to the followed announcement channel.

###### Pin messages

- These are automatic messages sent when a message is pinned (type 6).
- These messages have `message_id` and `channel_id`, and `guild_id` if it is in a guild, which point to the message that was pinned.

###### Forwards

- These are messages which capture a snapshot of a message.
- These messages have an array of [`message_snapshot`](#DOCS_RESOURCES_CHANNEL/message-snapshot-object) objects containing a copy of the original message. This copy follows the same structure as a message, but has only the minimal set of fields returned required for context/rendering.
  - of note: `author` will be excluded
- A forwarded message can be identified by looking at its `message_reference.type` field
  - `message_snapshots` will be the message data associated with the forward. Currently we support only 1 snapshot.
  - prevents spoofing forwarded data
  - `message_snapshots` are taken the moment a forward message is created, and are **immutable**; any mutations to the original message will not be propagated.
- Forwards are created by including a message_reference with `FORWARD` type when sending a message.
  - Required fields: `type`, `message_id`, `channel_id`
  - the requestor must have `VIEW_CHANNEL` permissions

###### Replies

- These are messages replying to a previous message (type 19).
- These messages have `message_id` and `channel_id`, and `guild_id` if it is in a guild, which point to the message that was replied to. The channel_id and guild_id will be the same as the reply.
- Replies are created by including a message_reference when sending a message. When sending, only `message_id` is required.

###### Thread Created messages

- These are automatic messages sent when a public thread is created from an old message or without a message (type 18).
- These messages have the `channel_id` and `guild_id` fields, which point to the created thread channel.

###### Thread starter messages

- These are the first message in public threads created from messages. They point back to the message in the parent channel from which the thread was started. (type 21)
- These messages have `message_id`, `channel_id`, and `guild_id`.
- These messages will never have content, embeds, or attachments, mainly just the `message_reference` and `referenced_message` fields.

#### Voice Messages

Voice messages are messages with the `IS_VOICE_MESSAGE` flag. They have the following properties.

- They cannot be edited.
- Only a single audio attachment is allowed. No content, stickers, etc...
- The [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) has additional fields: `duration_secs` and `waveform`.

The `waveform` is intended to be a preview of the entire voice message, with 1 byte per datapoint encoded in base64. Clients sample the recording at most
once per 100 milliseconds, but will downsample so that no more than 256 datapoints are in the waveform.

As of 2023-04-14, clients upload a 1 channel, 48000 Hz, 32kbps Opus stream in an OGG container.
The encoding, and the waveform details, are an implementation detail and may change without warning or documentation.


### Message Snapshot Object

#### Message Snapshot Structure

| Field     | Type                                                             | Description                                       |
|-----------|------------------------------------------------------------------|---------------------------------------------------|
| message\* | partial [message](#DOCS_RESOURCES_CHANNEL/message-object) object | minimal subset of fields in the forwarded message |

\* The current subset of message fields consists of:
`type`, `content`, `embeds`, `attachments`, `timestamp`, `edited_timestamp`, `flags`, `mentions`, `mention_roles`.

> info
> While message snapshots are able to support nested snapshots, we currently limit the depth of nesting to 1.


### Followed Channel Object

###### Followed Channel Structure

| Field      | Type      | Description               |
|------------|-----------|---------------------------|
| channel_id | snowflake | source channel id         |
| webhook_id | snowflake | created target webhook id |

### Reaction Object

###### Reaction Structure

| Field         | Type                                                       | Description                                                                            |
|---------------|------------------------------------------------------------|----------------------------------------------------------------------------------------|
| count         | integer                                                    | Total number of times this emoji has been used to react (including super reacts)       |
| count_details | object                                                     | [Reaction count details object](#DOCS_RESOURCES_CHANNEL/reaction-count-details-object) |
| me            | boolean                                                    | Whether the current user reacted using this emoji                                      |
| me_burst      | boolean                                                    | Whether the current user super-reacted using this emoji                                |
| emoji         | partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object | emoji information                                                                      |
| burst_colors  | array                                                      | HEX colors used for super reaction                                                     |

### Reaction Count Details Object

The reaction count details object contains a breakdown of normal and super reaction counts for the associated emoji.

###### Reaction Count Details Structure

| Field  | Type    | Description               |
|--------|---------|---------------------------|
| burst  | integer | Count of super reactions  |
| normal | integer | Count of normal reactions |

### Overwrite Object

See [permissions](#DOCS_TOPICS_PERMISSIONS/permissions) for more information about the `allow` and `deny` fields.

###### Overwrite Structure

| Field | Type      | Description                   |
|-------|-----------|-------------------------------|
| id    | snowflake | role or user id               |
| type  | int       | either 0 (role) or 1 (member) |
| allow | string    | permission bit set            |
| deny  | string    | permission bit set            |

### Thread Metadata Object

The thread metadata object contains a number of thread-specific channel fields that are not needed by other channel types.

###### Thread Metadata Structure

| Field                 | Type               | Description                                                                                                                                |
|-----------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| archived              | boolean            | whether the thread is archived                                                                                                             |
| auto_archive_duration | integer            | the thread will stop showing in the channel list after `auto_archive_duration` minutes of inactivity, can be set to: 60, 1440, 4320, 10080 |
| archive_timestamp     | ISO8601 timestamp  | timestamp when the thread's archive status was last changed, used for calculating recent activity                                          |
| locked                | boolean            | whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it                                     |
| invitable?            | boolean            | whether non-moderators can add other non-moderators to a thread; only available on private threads                                         |
| create_timestamp?     | ?ISO8601 timestamp | timestamp when the thread was created; only populated for threads created after 2022-01-09                                                 |

### Thread Member Object

A thread member object contains information about a user that has joined a thread.

###### Thread Member Structure

| Field           | Type                                                             | Description                                                     |
|-----------------|------------------------------------------------------------------|-----------------------------------------------------------------|
| id? \*          | snowflake                                                        | ID of the thread                                                |
| user_id? \*     | snowflake                                                        | ID of the user                                                  |
| join_timestamp  | ISO8601 timestamp                                                | Time the user last joined the thread                            |
| flags           | integer                                                          | Any user-thread settings, currently only used for notifications |
| member? \* \*\* | [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object | Additional information about the user                           |

\* These fields are omitted on the member sent within each thread in the [GUILD_CREATE](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) event.

\*\* The `member` field is only present when `with_member` is set to `true` when calling [List Thread Members](#DOCS_RESOURCES_CHANNEL/list-thread-members) or [Get Thread Member](#DOCS_RESOURCES_CHANNEL/get-thread-member).

### Default Reaction Object

An object that specifies the emoji to use as the default way to react to a forum post. Exactly one of `emoji_id` and `emoji_name` must be set.

###### Default Reaction Structure

| Field      | Type       | Description                        |
|------------|------------|------------------------------------|
| emoji_id   | ?snowflake | the id of a guild's custom emoji   |
| emoji_name | ?string    | the unicode character of the emoji |

### Forum Tag Object

An object that represents a tag that is able to be applied to a thread in a `GUILD_FORUM` or `GUILD_MEDIA` channel.

###### Forum Tag Structure

> info
> When updating a `GUILD_FORUM` or a `GUILD_MEDIA` channel, tag objects in `available_tags` only require the `name` field.

| Field      | Type       | Description                                                                                                    |
|------------|------------|----------------------------------------------------------------------------------------------------------------|
| id         | snowflake  | the id of the tag                                                                                              |
| name       | string     | the name of the tag (0-20 characters)                                                                          |
| moderated  | boolean    | whether this tag can only be added to or removed from threads by a member with the `MANAGE_THREADS` permission |
| emoji_id   | ?snowflake | the id of a guild's custom emoji \*                                                                            |
| emoji_name | ?string    | the unicode character of the emoji \*                                                                          |

\* At most one of `emoji_id` and `emoji_name` may be set to a non-null value.

### Embed Object

###### Embed Structure

| Field        | Type                                                                                       | Description                                                                                          |
|--------------|--------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| title?       | string                                                                                     | title of embed                                                                                       |
| type?        | string                                                                                     | [type of embed](#DOCS_RESOURCES_CHANNEL/embed-object-embed-types) (always "rich" for webhook embeds) |
| description? | string                                                                                     | description of embed                                                                                 |
| url?         | string                                                                                     | url of embed                                                                                         |
| timestamp?   | ISO8601 timestamp                                                                          | timestamp of embed content                                                                           |
| color?       | integer                                                                                    | color code of the embed                                                                              |
| footer?      | [embed footer](#DOCS_RESOURCES_CHANNEL/embed-object-embed-footer-structure) object         | footer information                                                                                   |
| image?       | [embed image](#DOCS_RESOURCES_CHANNEL/embed-object-embed-image-structure) object           | image information                                                                                    |
| thumbnail?   | [embed thumbnail](#DOCS_RESOURCES_CHANNEL/embed-object-embed-thumbnail-structure) object   | thumbnail information                                                                                |
| video?       | [embed video](#DOCS_RESOURCES_CHANNEL/embed-object-embed-video-structure) object           | video information                                                                                    |
| provider?    | [embed provider](#DOCS_RESOURCES_CHANNEL/embed-object-embed-provider-structure) object     | provider information                                                                                 |
| author?      | [embed author](#DOCS_RESOURCES_CHANNEL/embed-object-embed-author-structure) object         | author information                                                                                   |
| fields?      | array of [embed field](#DOCS_RESOURCES_CHANNEL/embed-object-embed-field-structure) objects | fields information, max of 25                                                                        |

###### Embed Types

Embed types are "loosely defined" and, for the most part, are not used by our clients for rendering. Embed attributes power what is rendered. Embed types should be considered deprecated and might be removed in a future API version.

| Type    | Description                                        |
|---------|----------------------------------------------------|
| rich    | generic embed rendered from embed attributes       |
| image   | image embed                                        |
| video   | video embed                                        |
| gifv    | animated gif image embed rendered as a video embed |
| article | article embed                                      |
| link    | link embed                                         |

###### Embed Thumbnail Structure

| Field      | Type    | Description                                                     |
|------------|---------|-----------------------------------------------------------------|
| url        | string  | source url of thumbnail (only supports http(s) and attachments) |
| proxy_url? | string  | a proxied url of the thumbnail                                  |
| height?    | integer | height of thumbnail                                             |
| width?     | integer | width of thumbnail                                              |

###### Embed Video Structure

| Field      | Type    | Description                |
|------------|---------|----------------------------|
| url?       | string  | source url of video        |
| proxy_url? | string  | a proxied url of the video |
| height?    | integer | height of video            |
| width?     | integer | width of video             |

###### Embed Image Structure

| Field      | Type    | Description                                                 |
|------------|---------|-------------------------------------------------------------|
| url        | string  | source url of image (only supports http(s) and attachments) |
| proxy_url? | string  | a proxied url of the image                                  |
| height?    | integer | height of image                                             |
| width?     | integer | width of image                                              |

###### Embed Provider Structure

| Field | Type   | Description      |
|-------|--------|------------------|
| name? | string | name of provider |
| url?  | string | url of provider  |

###### Embed Author Structure

| Field           | Type   | Description                                                |
|-----------------|--------|------------------------------------------------------------|
| name            | string | name of author                                             |
| url?            | string | url of author (only supports http(s))                      |
| icon_url?       | string | url of author icon (only supports http(s) and attachments) |
| proxy_icon_url? | string | a proxied url of author icon                               |

###### Embed Footer Structure

| Field           | Type   | Description                                                |
|-----------------|--------|------------------------------------------------------------|
| text            | string | footer text                                                |
| icon_url?       | string | url of footer icon (only supports http(s) and attachments) |
| proxy_icon_url? | string | a proxied url of footer icon                               |

###### Embed Field Structure

| Field   | Type    | Description                                     |
|---------|---------|-------------------------------------------------|
| name    | string  | name of the field                               |
| value   | string  | value of the field                              |
| inline? | boolean | whether or not this field should display inline |

###### Embed Limits

To facilitate showing rich content, rich embeds do not follow the traditional limits of message content. However, some limits are still in place to prevent excessively large embeds. The following table describes the limits:

All of the following limits are measured inclusively. Leading and trailing whitespace characters are not included (they are trimmed automatically).

| Field                                                                      | Limit                                                                                |
|----------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| title                                                                      | 256 characters                                                                       |
| description                                                                | 4096 characters                                                                      |
| fields                                                                     | Up to 25 [field](#DOCS_RESOURCES_CHANNEL/embed-object-embed-field-structure) objects |
| [field.name](#DOCS_RESOURCES_CHANNEL/embed-object-embed-field-structure)   | 256 characters                                                                       |
| [field.value](#DOCS_RESOURCES_CHANNEL/embed-object-embed-field-structure)  | 1024 characters                                                                      |
| [footer.text](#DOCS_RESOURCES_CHANNEL/embed-object-embed-footer-structure) | 2048 characters                                                                      |
| [author.name](#DOCS_RESOURCES_CHANNEL/embed-object-embed-author-structure) | 256 characters                                                                       |

Additionally, the combined sum of characters in all `title`, `description`, `field.name`, `field.value`, `footer.text`, and `author.name` fields across all embeds attached to a message must not exceed 6000 characters. Violating any of these constraints will result in a `Bad Request` response.

Embeds are deduplicated by URL.  If a message contains multiple embeds with the same URL, only the first is shown.

### Attachment Object

###### Attachment Structure

> info
> For the `attachments` array in Message Create/Edit requests, only the `id` is required.

| Field          | Type      | Description                                                                                                                                      |
|----------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| id             | snowflake | attachment id                                                                                                                                    |
| filename       | string    | name of file attached                                                                                                                            |
| title?         | string    | the title of the file                                                                                                                            |
| description?   | string    | description for the file (max 1024 characters)                                                                                                   |
| content_type?  | string    | the attachment's [media type](https://en.wikipedia.org/wiki/Media_type)                                                                          |
| size           | integer   | size of file in bytes                                                                                                                            |
| url            | string    | source url of file                                                                                                                               |
| proxy_url      | string    | a proxied url of file                                                                                                                            |
| height?        | ?integer  | height of file (if image)                                                                                                                        |
| width?         | ?integer  | width of file (if image)                                                                                                                         |
| ephemeral? \*  | boolean   | whether this attachment is ephemeral                                                                                                             |
| duration_secs? | float     | the duration of the audio file (currently for voice messages)                                                                                    |
| waveform?      | string    | base64 encoded bytearray representing a sampled waveform (currently for voice messages)                                                          |
| flags?         | integer   | [attachment flags](#DOCS_RESOURCES_CHANNEL/attachment-object-attachment-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) |

\* Ephemeral attachments will automatically be removed after a set period of time. Ephemeral attachments on messages are guaranteed to be available as long as the message itself exists.

###### Attachment Flags

| Flag     | Value    | Description                                                       |
|----------|----------|-------------------------------------------------------------------|
| IS_REMIX | `1 << 2` | this attachment has been edited using the remix feature on mobile |

### Channel Mention Object

###### Channel Mention Structure

| Field    | Type      | Description                                                                 |
|----------|-----------|-----------------------------------------------------------------------------|
| id       | snowflake | id of the channel                                                           |
| guild_id | snowflake | id of the guild containing the channel                                      |
| type     | integer   | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) |
| name     | string    | the name of the channel                                                     |

### Allowed Mentions Object

The allowed mention field allows for more granular control over mentions without various hacks to the message content. This will always validate against message content to avoid phantom pings (e.g. to ping everyone, you must still have `@everyone` in the message content), and check against user/bot permissions.

###### Allowed Mention Types

| Type              | Value      | Description                           |
|-------------------|------------|---------------------------------------|
| Role Mentions     | "roles"    | Controls role mentions                |
| User Mentions     | "users"    | Controls user mentions                |
| Everyone Mentions | "everyone" | Controls @everyone and @here mentions |

###### Allowed Mentions Structure

| Field        | Type                           | Description                                                                                                                           |
|--------------|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| parse        | array of allowed mention types | An array of [allowed mention types](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object-allowed-mention-types) to parse from the content. |
| roles        | list of snowflakes             | Array of role_ids to mention (Max size of 100)                                                                                        |
| users        | list of snowflakes             | Array of user_ids to mention (Max size of 100)                                                                                        |
| replied_user | boolean                        | For replies, whether to mention the author of the message being replied to (default false)                                            |

###### Allowed Mentions Reference

Due to the complexity of possibilities, we have included a set of examples and behavior for the allowed mentions field.

If `allowed_mentions` is _not_ passed in (i.e. the key does not exist), the mentions will be parsed via the content. This corresponds with existing behavior.

In the example below we would ping @here (and also @role124 and @user123)

```json
{
  "content": "@here Hi there from <@123>, cc <@&124>"
}
```

To suppress all mentions in a message use:

```json
{
  "content": "@everyone hi there, <@&123>",
  "allowed_mentions": {
    "parse": []
  }
}
```

This will suppress _all_ mentions in the message (no @everyone or user mention).

The `parse` field is mutually exclusive with the other fields. In the example below, we would ping users `123` and role `124`, but _not_ @everyone. Note that passing a `Falsy` value ([], null) into the "users" field does not trigger a validation error.

```json
{
  "content": "@everyone <@123> <@&124>",
  "allowed_mentions": {
    "parse": ["users", "roles"],
    "users": []
  }
}
```

In the next example, we would ping @everyone, (and also users `123` and `124` if they suppressed
@everyone mentions), but we would not ping any roles.

```json
{
  "content": "@everyone <@123> <@124> <@125> <@&200>",
  "allowed_mentions": {
    "parse": ["everyone"],
    "users": ["123", "124"]
  }
}
```

Due to possible ambiguities, not all configurations are valid. An _invalid_ configuration is as follows

```json
{
  "content": "@everyone <@123> <@124> <@125> <@&200>",
  "allowed_mentions": {
    "parse": ["users"],
    "users": ["123", "124"]
  }
}
```

Because `parse: ["users"]` and `users: [123, 124]` are both present, we would throw a validation error.
This is because the conditions cannot be fulfilled simultaneously (they are mutually exclusive).

Any entities with an ID included in the list of IDs can be mentioned. Note that the IDs of entities not present in the message's content will simply be ignored.
e.g. The following example is valid, and would mention user 123, but _not_ user 125 since there is no mention of
user 125 in the content.

```json
{
  "content": "<@123> Time for some memes.",
  "allowed_mentions": {
    "users": ["123", "125"]
  }
}
```

### Role Subscription Data Object

###### Role Subscription Data Object Structure

| Field                        | Type      | Description                                                           |
|------------------------------|-----------|-----------------------------------------------------------------------|
| role_subscription_listing_id | snowflake | the id of the sku and listing that the user is subscribed to          |
| tier_name                    | string    | the name of the tier that the user is subscribed to                   |
| total_months_subscribed      | integer   | the cumulative number of months that the user has been subscribed for |
| is_renewal                   | boolean   | whether this notification is for a renewal rather than a new purchase |

## Get Channel % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Get a channel by ID. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.  If the channel is a thread, a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object is included in the returned result.

## Modify Channel % PATCH /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Update a channel's settings. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. All JSON parameters are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params (Group DM)

Fires a [Channel Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-update) Gateway event.

| Field | Type   | Description                  |
|-------|--------|------------------------------|
| name  | string | 1-100 character channel name |
| icon  | binary | base64 encoded icon          |

###### JSON Params (Guild channel)

Requires the `MANAGE_CHANNELS` permission for the guild. Fires a [Channel Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-update) Gateway event. If modifying a category, individual [Channel Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-update) events will fire for each child channel that also changes. If modifying permission overwrites, the `MANAGE_ROLES` permission is required. Only permissions your bot has in the guild or parent channel (if applicable) can be allowed/denied (unless your bot has a `MANAGE_ROLES` overwrite in the channel).

| Field                               | Type                                                                            | Description                                                                                                                                                                                                                                                                                                                      | Channel Type                                   |
|-------------------------------------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| name                                | string                                                                          | 1-100 character channel name                                                                                                                                                                                                                                                                                                     | All                                            |
| type                                | integer                                                                         | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types); only conversion between text and announcement is supported and only in guilds with the "NEWS" feature                                                                                                                                               | Text, Announcement                             |
| position                            | ?integer                                                                        | the position of the channel in the left-hand listing (channels with the same position are sorted by id)                                                                                                                                                                                                                          | All                                            |
| topic                               | ?string                                                                         | 0-1024 character channel topic (0-4096 characters for `GUILD_FORUM` and `GUILD_MEDIA` channels)                                                                                                                                                                                                                                  | Text, Announcement, Forum, Media               |
| nsfw                                | ?boolean                                                                        | whether the channel is nsfw                                                                                                                                                                                                                                                                                                      | Text, Voice, Announcement, Stage, Forum, Media |
| rate_limit_per_user                 | ?integer                                                                        | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected                                                                                                                                                  | Text, Voice, Stage, Forum, Media               |
| bitrate\*                           | ?integer                                                                        | the bitrate (in bits) of the voice or stage channel; min 8000                                                                                                                                                                                                                                                                    | Voice, Stage                                   |
| user_limit                          | ?integer                                                                        | the user limit of the voice or stage channel, max 99 for voice channels and 10,000 for stage channels (0 refers to no limit)                                                                                                                                                                                                     | Voice, Stage                                   |
| permission_overwrites\*\*           | ?array of partial [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) objects | channel or category-specific permissions                                                                                                                                                                                                                                                                                         | All                                            |
| parent_id                           | ?snowflake                                                                      | id of the new parent category for a channel                                                                                                                                                                                                                                                                                      | Text, Voice, Announcement, Stage, Forum, Media |
| rtc_region                          | ?string                                                                         | channel [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) id, automatic when set to null                                                                                                                                                                                                                                 | Voice, Stage                                   |
| video_quality_mode                  | ?integer                                                                        | the camera [video quality mode](#DOCS_RESOURCES_CHANNEL/channel-object-video-quality-modes) of the voice channel                                                                                                                                                                                                                 | Voice, Stage                                   |
| default_auto_archive_duration       | ?integer                                                                        | the default duration that the clients use (not the API) for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity                                                                                                                                                          | Text, Announcement, Forum, Media               |
| flags?                              | integer                                                                         | [channel flags](#DOCS_RESOURCES_CHANNEL/channel-object-channel-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field). Currently only `REQUIRE_TAG` (`1 << 4`) is supported by `GUILD_FORUM` and `GUILD_MEDIA` channels. `HIDE_MEDIA_DOWNLOAD_OPTIONS` (`1 << 15`) is supported only by `GUILD_MEDIA` channels | Forum, Media                                   |
| available_tags?                     | array of [tag](#DOCS_RESOURCES_CHANNEL/forum-tag-object) objects                | the set of tags that can be used in a `GUILD_FORUM` or a `GUILD_MEDIA` channel; limited to 20                                                                                                                                                                                                                                    | Forum, Media                                   |
| default_reaction_emoji?             | ?[default reaction](#DOCS_RESOURCES_CHANNEL/default-reaction-object) object     | the emoji to show in the add reaction button on a thread in a `GUILD_FORUM` or a `GUILD_MEDIA` channel                                                                                                                                                                                                                           | Forum, Media                                   |
| default_thread_rate_limit_per_user? | integer                                                                         | the initial `rate_limit_per_user` to set on newly created threads in a channel. this field is copied to the thread at creation time and does not live update.                                                                                                                                                                    | Text, Forum, Media                             |
| default_sort_order?                 | ?integer                                                                        | the [default sort order type](#DOCS_RESOURCES_CHANNEL/channel-object-sort-order-types) used to order posts in `GUILD_FORUM` and `GUILD_MEDIA` channels                                                                                                                                                                           | Forum, Media                                   |
| default_forum_layout?               | integer                                                                         | the [default forum layout type](#DOCS_RESOURCES_CHANNEL/channel-object-forum-layout-types) used to display posts in `GUILD_FORUM` channels                                                                                                                                                                                       | Forum                                          |

\* For voice channels, normal servers can set bitrate up to 96000, servers with Boost level 1 can set up to 128000, servers with Boost level 2 can set up to 256000, and servers with Boost level 3 or the `VIP_REGIONS` [guild feature](#DOCS_RESOURCES_GUILD/guild-object-guild-features) can set up to 384000. For stage channels, bitrate can be set up to 64000.

\*\* In each overwrite object, the `allow` and `deny` keys can be omitted or set to `null`, which both default to `"0"`.

###### JSON Params (Thread)

When setting `archived` to `false`, when `locked` is also `false`, only the `SEND_MESSAGES` permission is required.

Otherwise, requires the `MANAGE_THREADS` permission. Fires a [Thread Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-update) Gateway event. Requires the thread to have `archived` set to `false` or be set to `false` in the request.

| Field                 | Type                | Description                                                                                                                                                                                               |
|-----------------------|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                  | string              | 1-100 character channel name                                                                                                                                                                              |
| archived              | boolean             | whether the thread is archived                                                                                                                                                                            |
| auto_archive_duration | integer             | the thread will stop showing in the channel list after `auto_archive_duration` minutes of inactivity, can be set to: 60, 1440, 4320, 10080                                                                |
| locked                | boolean             | whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it                                                                                                    |
| invitable             | boolean             | whether non-moderators can add other non-moderators to a thread; only available on private threads                                                                                                        |
| rate_limit_per_user   | ?integer            | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages`, `manage_thread`, or `manage_channel`, are unaffected         |
| flags?                | integer             | [channel flags](#DOCS_RESOURCES_CHANNEL/channel-object-channel-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field); `PINNED` can only be set for threads in forum and media channels |
| applied_tags?         | array of snowflakes | the IDs of the set of tags that have been applied to a thread in a `GUILD_FORUM` or a `GUILD_MEDIA` channel; limited to 5                                                                                 |

## Delete/Close Channel % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Delete a channel, or close a private message. Requires the `MANAGE_CHANNELS` permission for the guild, or `MANAGE_THREADS` if the channel is a thread. Deleting a category does not delete its child channels; they will have their `parent_id` removed and a [Channel Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-update) Gateway event will fire for each of them. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Delete](#DOCS_TOPICS_GATEWAY_EVENTS/channel-delete) Gateway event (or [Thread Delete](#DOCS_TOPICS_GATEWAY_EVENTS/thread-delete) if the channel was a thread).

> warn
> Deleting a guild channel cannot be undone. Use this with caution, as it is impossible to undo this action when performed on a guild channel. In contrast, when used with a private message, it is possible to undo the action by opening a private message with the recipient again.

> info
> For Community guilds, the Rules or Guidelines channel and the Community Updates channel cannot be deleted.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Get Channel Messages % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages

Retrieves the messages in a channel. Returns an array of [message](#DOCS_RESOURCES_CHANNEL/message-object) objects on success.

If operating on a guild channel, this endpoint requires the current user to have the `VIEW_CHANNEL` permission. If the channel is a voice channel, they must _also_ have the `CONNECT` permission.

If the current user is missing the `READ_MESSAGE_HISTORY` permission in the channel, then no messages will be returned.

> info
> The `before`, `after`, and `around` parameters are mutually exclusive, only one may be passed at a time.

###### Query String Params

| Field   | Type      | Description                              | Default |
|---------|-----------|------------------------------------------|---------|
| around? | snowflake | Get messages around this message ID      | absent  |
| before? | snowflake | Get messages before this message ID      | absent  |
| after?  | snowflake | Get messages after this message ID       | absent  |
| limit?  | integer   | Max number of messages to return (1-100) | 50      |

## Get Channel Message % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Retrieves a specific message in the channel. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object on success.

If operating on a guild channel, this endpoint requires the current user to have the `VIEW_CHANNEL` and `READ_MESSAGE_HISTORY` permissions. If the channel is a voice channel, they must _also_ have the `CONNECT` permission.

## Create Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages

> warn
> Discord may strip certain characters from message content, like invalid unicode characters or characters which cause unexpected message formatting. If you are passing user-generated strings into message content, consider sanitizing the data to prevent unexpected behavior and using `allowed_mentions` to prevent unexpected mentions.

Post a message to a guild text or DM channel. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object. Fires a [Message Create](#DOCS_TOPICS_GATEWAY_EVENTS/message-create) Gateway event. See [message formatting](#DOCS_REFERENCE/message-formatting) for more information on how to properly format messages.

To create a message as a reply or forward of another message, apps can include a [`message_reference`](#DOCS_RESOURCES_CHANNEL/message-reference-structure).
Refer to the documentation for required fields.

Files must be attached using a `multipart/form-data` body as described in [Uploading Files](#DOCS_REFERENCE/uploading-files).

###### Limitations

- When operating on a guild channel, the current user must have the `SEND_MESSAGES` permission.
- When sending a message with `tts` (text-to-speech) set to `true`, the current user must have the `SEND_TTS_MESSAGES` permission.
- When creating a message as a reply to another message, the current user must have the `READ_MESSAGE_HISTORY` permission.
    - The referenced message must exist and cannot be a system message.
- The maximum request size when sending a message is **25 MiB**
- For the embed object, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.

###### JSON/Form Params

> info
> When creating a message, apps must provide a value for **at least one of** `content`, `embeds`, `sticker_ids`, `components`, `files[n]`, or `poll`.

| Field              | Type                                                                                         | Description                                                                                                                                                                                                                       |
|--------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| content?\*         | string                                                                                       | Message contents (up to 2000 characters)                                                                                                                                                                                          |
| nonce?             | integer or string                                                                            | Can be used to verify a message was sent (up to 25 characters). Value will appear in the [Message Create event](#DOCS_TOPICS_GATEWAY_EVENTS/message-create).                                                                      |
| tts?               | boolean                                                                                      | `true` if this is a TTS message                                                                                                                                                                                                   |
| embeds?\*          | array of [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects                               | Up to 10 `rich` embeds (up to 6000 characters)                                                                                                                                                                                    |
| allowed_mentions?  | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)                    | Allowed mentions for the message                                                                                                                                                                                                  |
| message_reference? | [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-structure)                     | Include to make your message a reply or a forward                                                                                                                                                                                 |
| components?\*      | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) objects | Components to include with the message                                                                                                                                                                                            |
| sticker_ids?\*     | array of snowflakes                                                                          | IDs of up to 3 [stickers](#DOCS_RESOURCES_STICKER/sticker-object) in the server to send in the message                                                                                                                            |
| files[n]?\*        | file contents                                                                                | Contents of the file being sent. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                                                                           |
| payload_json?      | string                                                                                       | JSON-encoded body of non-file params, only for `multipart/form-data` requests. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                             |
| attachments?       | array of partial [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects             | Attachment objects with filename and description. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                                                          |
| flags?             | integer                                                                                      | [Message flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) (only `SUPPRESS_EMBEDS` and `SUPPRESS_NOTIFICATIONS` can be set)                          |
| enforce_nonce?     | boolean                                                                                      | If true and nonce is present, it will be checked for uniqueness in the past few minutes. If another message was created by the same author with the same nonce, that message will be returned and no new message will be created. |
| poll?              | [poll](#DOCS_RESOURCES_POLL/poll-create-request-object) request object                       | A poll!                                                                                                                                                                                                                           |

\* At least one of `content`, `embeds`, `sticker_ids`, `components`, `files[n]`, or `poll` is required.

###### Example Request Body (application/json)

```json
{
  "content": "Hello, World!",
  "tts": false,
  "embeds": [{
    "title": "Hello, Embed!",
    "description": "This is an embedded message."
  }]
}
```

Examples for file uploads are available in [Uploading Files](#DOCS_REFERENCE/uploading-files).

## Crosspost Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/crosspost

Crosspost a message in an Announcement Channel to following channels. This endpoint requires the `SEND_MESSAGES` permission, if the current user sent the message, or additionally the `MANAGE_MESSAGES` permission, for all other messages, to be present for the current user.

Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object. Fires a [Message Update](#DOCS_TOPICS_GATEWAY_EVENTS/message-update) Gateway event.

## Create Reaction % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/@me

Create a reaction for the message. This endpoint requires the `READ_MESSAGE_HISTORY` permission to be present on the current user. Additionally, if nobody else has reacted to the message using this emoji, this endpoint requires the `ADD_REACTIONS` permission to be present on the current user. Returns a 204 empty response on success. Fires a [Message Reaction Add](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-add) Gateway event.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

## Delete Own Reaction % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/@me

Delete a reaction the current user has made for the message. Returns a 204 empty response on success. Fires a [Message Reaction Remove](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove) Gateway event.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

## Delete User Reaction % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/{user.id#DOCS_RESOURCES_USER/user-object}

Deletes another user's reaction. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Returns a 204 empty response on success. Fires a [Message Reaction Remove](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove) Gateway event.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

## Get Reactions % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}

Get a list of users that reacted with this emoji. Returns an array of [user](#DOCS_RESOURCES_USER/user-object) objects on success.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

###### Query String Params

| Field  | Type      | Description                                                                  | Default |
|--------|-----------|------------------------------------------------------------------------------|---------|
| type?  | integer   | The [type of reaction](#DOCS_RESOURCES_CHANNEL/get-reactions-reaction-types) | 0       |
| after? | snowflake | Get users after this user ID                                                 | absent  |
| limit? | integer   | Max number of users to return (1-100)                                        | 25      |

###### Reaction Types

| Type   | Value |
|--------|-------|
| NORMAL | 0     |
| BURST  | 1     |

## Delete All Reactions % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions

Deletes all reactions on a message. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Fires a [Message Reaction Remove All](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove-all) Gateway event.

## Delete All Reactions for Emoji % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}

Deletes all the reactions for a given emoji on a message. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Fires a [Message Reaction Remove Emoji](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove-emoji) Gateway event.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

## Edit Message % PATCH /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Edit a previously sent message. The fields `content`, `embeds`, and `flags` can be edited by the original message author. Other users can only edit `flags` and only if they have the `MANAGE_MESSAGES` permission in the corresponding channel. When specifying flags, ensure to include all previously set flags/bits in addition to ones that you are modifying. Only `flags` documented in the table below may be modified by users (unsupported flag changes are currently ignored without error).

When the `content` field is edited, the `mentions` array in the message object will be reconstructed from scratch based on the new content. The `allowed_mentions` field of the edit request controls how this happens. If there is no explicit `allowed_mentions` in the edit request, the content will be parsed with _default_ allowances, that is, without regard to whether or not an `allowed_mentions` was present in the request that originally created the message.

Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object. Fires a [Message Update](#DOCS_TOPICS_GATEWAY_EVENTS/message-update) Gateway event.

Refer to [Uploading Files](#DOCS_REFERENCE/uploading-files) for details on attachments and `multipart/form-data` requests.
Any provided files will be **appended** to the message. To remove or replace files you will have to supply the `attachments` field which specifies the files to retain on the message after edit.

> warn
> Starting with API v10, the `attachments` array must contain all attachments that should be present after edit, including **retained and new** attachments provided in the request body.

> info
> All parameters to this endpoint are optional and nullable.

###### JSON/Form Params

| Field            | Type                                                                                 | Description                                                                                                                             |
|------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| content          | string                                                                               | Message contents (up to 2000 characters)                                                                                                |
| embeds           | array of [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects                       | Up to 10 `rich` embeds (up to 6000 characters)                                                                                          |
| flags            | integer                                                                              | Edit the [flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) of a message (only `SUPPRESS_EMBEDS` can currently be set/unset) |
| allowed_mentions | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)            | Allowed mentions for the message                                                                                                        |
| components       | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) | Components to include with the message                                                                                                  |
| files[n]         | file contents                                                                        | Contents of the file being sent/edited. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                          |
| payload_json     | string                                                                               | JSON-encoded body of non-file params (multipart/form-data only). See [Uploading Files](#DOCS_REFERENCE/uploading-files)                 |
| attachments      | array of [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects             | Attached files to keep and possible descriptions for new files. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                  |

## Delete Message % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Delete a message. If operating on a guild channel and trying to delete a message that was not sent by the current user, this endpoint requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete](#DOCS_TOPICS_GATEWAY_EVENTS/message-delete) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Bulk Delete Messages % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/bulk-delete

Delete multiple messages in a single request. This endpoint can only be used on guild channels and requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete Bulk](#DOCS_TOPICS_GATEWAY_EVENTS/message-delete-bulk) Gateway event.

Any message IDs given that do not exist or are invalid will count towards the minimum and maximum message count (currently 2 and 100 respectively).

> warn
> This endpoint will not delete messages older than 2 weeks, and will fail with a 400 BAD REQUEST if any message provided is older than that or if any duplicate message IDs are provided.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field    | Type                | Description                               |
|----------|---------------------|-------------------------------------------|
| messages | array of snowflakes | an array of message ids to delete (2-100) |

## Edit Channel Permissions % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/permissions/{overwrite.id#DOCS_RESOURCES_CHANNEL/overwrite-object}

Edit the channel permission overwrites for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Only permissions your bot has in the guild or parent channel (if applicable) can be allowed/denied (unless your bot has a `MANAGE_ROLES` overwrite in the channel). Returns a 204 empty response on success. Fires a [Channel Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-update) Gateway event. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions).

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field  | Type    | Description                                                     |
|--------|---------|-----------------------------------------------------------------|
| allow? | string? | the bitwise value of all allowed permissions (default `"0"`)    |
| deny?  | string? | the bitwise value of all disallowed permissions (default `"0"`) |
| type   | integer | 0 for a role or 1 for a member                                  |

## Get Channel Invites % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/invites

Returns a list of [invite](#DOCS_RESOURCES_INVITE/invite-object) objects (with [invite metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)) for the channel. Only usable for guild channels. Requires the `MANAGE_CHANNELS` permission.

## Create Channel Invite % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/invites

Create a new [invite](#DOCS_RESOURCES_INVITE/invite-object) object for the channel. Only usable for guild channels. Requires the `CREATE_INSTANT_INVITE` permission. All JSON parameters for this route are optional, however the request body is not. If you are not sending any fields, you still have to send an empty JSON object (`{}`). Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object. Fires an [Invite Create](#DOCS_TOPICS_GATEWAY_EVENTS/invite-create) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                 | Type      | Description                                                                                                                               | Default          |
|-----------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| max_age               | integer   | duration of invite in seconds before expiry, or 0 for never. between 0 and 604800 (7 days)                                                | 86400 (24 hours) |
| max_uses              | integer   | max number of uses or 0 for unlimited. between 0 and 100                                                                                  | 0                |
| temporary             | boolean   | whether this invite only grants temporary membership                                                                                      | false            |
| unique                | boolean   | if true, don't try to reuse a similar invite (useful for creating many unique one time use invites)                                       | false            |
| target_type           | integer   | the [type of target](#DOCS_RESOURCES_INVITE/invite-object-invite-target-types) for this voice channel invite                              |                  |
| target_user_id        | snowflake | the id of the user whose stream to display for this invite, required if `target_type` is 1, the user must be streaming in the channel     |                  |
| target_application_id | snowflake | the id of the embedded application to open for this invite, required if `target_type` is 2, the application must have the `EMBEDDED` flag |                  |

## Delete Channel Permission % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/permissions/{overwrite.id#DOCS_RESOURCES_CHANNEL/overwrite-object}

Delete a channel permission overwrite for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Channel Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-update) Gateway event. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions)

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Follow Announcement Channel % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/followers

Follow an Announcement Channel to send messages to a target channel. Requires the `MANAGE_WEBHOOKS` permission in the target channel. Returns a [followed channel](#DOCS_RESOURCES_CHANNEL/followed-channel-object) object. Fires a [Webhooks Update](#DOCS_TOPICS_GATEWAY_EVENTS/webhooks-update) Gateway event for the target channel.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field              | Type      | Description          |
|--------------------|-----------|----------------------|
| webhook_channel_id | snowflake | id of target channel |

## Trigger Typing Indicator % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/typing

Post a typing indicator for the specified channel, which expires after 10 seconds. Returns a 204 empty response on success. Fires a [Typing Start](#DOCS_TOPICS_GATEWAY_EVENTS/typing-start) Gateway event.

Generally bots should **not** use this route. However, if a bot is responding to a command and expects the computation to take a few seconds, this endpoint may be called to let the user know that the bot is processing their message.

## Get Pinned Messages % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins

Returns all pinned messages in the channel as an array of [message](#DOCS_RESOURCES_CHANNEL/message-object) objects.

## Pin Message % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Pin a message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Channel Pins Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-pins-update) Gateway event.

> warn
> The max pinned messages is 50.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Unpin Message % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Unpin a message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Channel Pins Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-pins-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Group DM Add Recipient % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/recipients/{user.id#DOCS_RESOURCES_USER/user-object}

Adds a recipient to a Group DM using their access token.

###### JSON Params

| Field        | Type   | Description                                                           |
|--------------|--------|-----------------------------------------------------------------------|
| access_token | string | access token of a user that has granted your app the `gdm.join` scope |
| nick         | string | nickname of the user being added                                      |

## Group DM Remove Recipient % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/recipients/{user.id#DOCS_RESOURCES_USER/user-object}

Removes a recipient from a Group DM.

## Start Thread from Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/threads

Creates a new thread from an existing message. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) and a [Message Update](#DOCS_TOPICS_GATEWAY_EVENTS/message-update) Gateway event.

When called on a `GUILD_TEXT` channel, creates a `PUBLIC_THREAD`. When called on a `GUILD_ANNOUNCEMENT` channel, creates a `ANNOUNCEMENT_THREAD`. Does not work on a [`GUILD_FORUM`](#DOCS_RESOURCES_CHANNEL/start-thread-in-forum-or-media-channel) or a `GUILD_MEDIA` channel. The id of the created thread will be the same as the id of the source message, and as such a message can only have a single thread created from it.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                  | Type     | Description                                                                                                                                |
|------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------|
| name                   | string   | 1-100 character channel name                                                                                                               |
| auto_archive_duration? | integer  | the thread will stop showing in the channel list after `auto_archive_duration` minutes of inactivity, can be set to: 60, 1440, 4320, 10080 |
| rate_limit_per_user?   | ?integer | amount of seconds a user has to wait before sending another message (0-21600)                                                              |

## Start Thread without Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/threads

Creates a new thread that is not connected to an existing message. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                  | Type     | Description                                                                                                                                |
|------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------|
| name                   | string   | 1-100 character channel name                                                                                                               |
| auto_archive_duration? | integer  | the thread will stop showing in the channel list after `auto_archive_duration` minutes of inactivity, can be set to: 60, 1440, 4320, 10080 |
| type?\*                | integer  | the [type of thread](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) to create                                                       |
| invitable?             | boolean  | whether non-moderators can add other non-moderators to a thread; only available when creating a private thread                             |
| rate_limit_per_user?   | ?integer | amount of seconds a user has to wait before sending another message (0-21600)                                                              |

\* `type` currently defaults to `PRIVATE_THREAD` in order to match the behavior when thread documentation was first published. In a future API version this will be changed to be a required field, with no default.

## Start Thread in Forum or Media Channel % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/threads

Creates a new thread in a forum or a media channel, and sends a message within the created thread. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object), with a nested [message](#DOCS_RESOURCES_CHANNEL/message-object) object, on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) and [Message Create](#DOCS_TOPICS_GATEWAY_EVENTS/message-create) Gateway event.

- The type of the created thread is `PUBLIC_THREAD`.
- See [message formatting](#DOCS_REFERENCE/message-formatting) for more information on how to properly format messages.
- The current user must have the `SEND_MESSAGES` permission (`CREATE_PUBLIC_THREADS` is ignored).
- The maximum request size when sending a message is **25 MiB**.
- For the embed object, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.
- Examples for file uploads are available in [Uploading Files](#DOCS_REFERENCE/uploading-files).
- Files must be attached using a `multipart/form-data` body as described in [Uploading Files](#DOCS_REFERENCE/uploading-files).
- Note that when sending a message, you must provide a value for at **least one of** `content`, `embeds`, `sticker_ids`, `components`, or `files[n]`.

> warn
> Discord may strip certain characters from message content, like invalid unicode characters or characters which cause unexpected message formatting. If you are passing user-generated strings into message content, consider sanitizing the data to prevent unexpected behavior and using `allowed_mentions` to prevent unexpected mentions.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON/Form Params

| Field                    | Type                                                                                                                                                | Description                                                                                                                           |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| name                     | string                                                                                                                                              | 1-100 character channel name                                                                                                          |
| auto_archive_duration?\* | integer                                                                                                                                             | duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080                   |
| rate_limit_per_user?     | ?integer                                                                                                                                            | amount of seconds a user has to wait before sending another message (0-21600)                                                         |
| message                  | a [forum thread message params](#DOCS_RESOURCES_CHANNEL/start-thread-in-forum-or-media-channel-forum-and-media-thread-message-params-object) object | contents of the first message in the forum/media thread                                                                               |
| applied_tags?            | array of snowflakes                                                                                                                                 | the IDs of the set of tags that have been applied to a thread in a `GUILD_FORUM` or a `GUILD_MEDIA` channel                           |
| files[n]?\*              | file contents                                                                                                                                       | Contents of the file being sent. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                               |
| payload_json?            | string                                                                                                                                              | JSON-encoded body of non-file params, only for `multipart/form-data` requests. See [Uploading Files](#DOCS_REFERENCE/uploading-files) |


###### Forum and Media Thread Message Params Object

> info
> When sending a message, apps must provide a value for **at least one of** `content`, `embeds`, `sticker_ids`, `components`, or `files[n]`.

| Field             | Type                                                                                         | Description                                                                                                                                                                                              |
|-------------------|----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| content?\*        | string                                                                                       | Message contents (up to 2000 characters)                                                                                                                                                                 |
| embeds?\*         | array of [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects                               | Up to 10 `rich` embeds (up to 6000 characters)                                                                                                                                                           |
| allowed_mentions? | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)                    | Allowed mentions for the message                                                                                                                                                                         |
| components?\*     | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) objects | Components to include with the message                                                                                                                                                                   |
| sticker_ids?\*    | array of snowflakes                                                                          | IDs of up to 3 [stickers](#DOCS_RESOURCES_STICKER/sticker-object) in the server to send in the message                                                                                                   |
| attachments?      | array of partial [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects             | Attachment objects with `filename` and `description`. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                             |
| flags?            | integer                                                                                      | [Message flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) (only `SUPPRESS_EMBEDS` and `SUPPRESS_NOTIFICATIONS` can be set) |

\* At least one of `content`, `embeds`, `sticker_ids`, `components`, or `files[n]` is required.

## Join Thread % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/@me

Adds the current user to a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a [Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update) and a [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) Gateway event.

## Add Thread Member % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/{user.id#DOCS_RESOURCES_USER/user-object}

Adds another member to a thread. Requires the ability to send messages in the thread. Also requires the thread is not archived. Returns a 204 empty response if the member is successfully added or was already a member of the thread. Fires a [Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update) Gateway event.

## Leave Thread % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/@me

Removes the current user from a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a [Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update) Gateway event.

## Remove Thread Member % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/{user.id#DOCS_RESOURCES_USER/user-object}

Removes another member from a thread. Requires the `MANAGE_THREADS` permission, or the creator of the thread if it is a `PRIVATE_THREAD`. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a [Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update) Gateway event.

## Get Thread Member % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object for the specified user if they are a member of the thread, returns a 404 response otherwise.

When `with_member` is set to `true`, the thread member object will include a `member` field containing a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object.

###### Query String Params

| Field        | Type                                             | Description                                                                                                 |
|--------------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| with_member? | [boolean](#DOCS_REFERENCE/boolean-query-strings) | Whether to include a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object for the thread member |

## List Thread Members % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members

> warn
> Starting in API v11, this endpoint will always return paginated results. Paginated results can be enabled before API v11 by setting `with_member` to `true`. Read [the changelog](#DOCS_CHANGE_LOG/thread-member-details-and-pagination) for details.

Returns array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects that are members of the thread.

When `with_member` is set to `true`, the results will be paginated and each thread member object will include a `member` field containing a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object.

> warn
> This endpoint is restricted according to whether the `GUILD_MEMBERS` [Privileged Intent](#DOCS_TOPICS_GATEWAY/privileged-intents) is enabled for your application.

###### Query String Params

| Field        | Type                                             | Description                                                                                                  |
|--------------|--------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| with_member? | [boolean](#DOCS_REFERENCE/boolean-query-strings) | Whether to include a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object for each thread member |
| after?       | snowflake                                        | Get thread members after this user ID                                                                        |
| limit?       | integer                                          | Max number of thread members to return (1-100). Defaults to 100.                                             |

## List Public Archived Threads % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/threads/archived/public

Returns archived threads in the channel that are public. When called on a `GUILD_TEXT` channel, returns threads of [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) `PUBLIC_THREAD`. When called on a `GUILD_ANNOUNCEMENT` channel returns threads of [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) `ANNOUNCEMENT_THREAD`. Threads are ordered by `archive_timestamp`, in descending order. Requires the `READ_MESSAGE_HISTORY` permission.

###### Query String Params

| Field   | Type              | Description                                    |
|---------|-------------------|------------------------------------------------|
| before? | ISO8601 timestamp | returns threads archived before this timestamp |
| limit?  | integer           | optional maximum number of threads to return   |

###### Response Body

| Field    | Type                                                                            | Description                                                                                  |
|----------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| threads  | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects              | the public, archived threads                                                                 |
| members  | array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | a thread member object for each returned thread the current user has joined                  |
| has_more | boolean                                                                         | whether there are potentially additional threads that could be returned on a subsequent call |

## List Private Archived Threads % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/threads/archived/private

Returns archived threads in the channel that are of [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) `PRIVATE_THREAD`. Threads are ordered by `archive_timestamp`, in descending order. Requires both the `READ_MESSAGE_HISTORY` and `MANAGE_THREADS` permissions.

###### Query String Params

| Field   | Type              | Description                                    |
|---------|-------------------|------------------------------------------------|
| before? | ISO8601 timestamp | returns threads archived before this timestamp |
| limit?  | integer           | optional maximum number of threads to return   |

###### Response Body

| Field    | Type                                                                            | Description                                                                                  |
|----------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| threads  | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects              | the private, archived threads                                                                |
| members  | array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | a thread member object for each returned thread the current user has joined                  |
| has_more | boolean                                                                         | whether there are potentially additional threads that could be returned on a subsequent call |

## List Joined Private Archived Threads % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/users/@me/threads/archived/private

Returns archived threads in the channel that are of [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) `PRIVATE_THREAD`, and the user has joined. Threads are ordered by their `id`, in descending order. Requires the `READ_MESSAGE_HISTORY` permission.

###### Query String Params

| Field   | Type      | Description                                  |
|---------|-----------|----------------------------------------------|
| before? | snowflake | returns threads before this id               |
| limit?  | integer   | optional maximum number of threads to return |

###### Response Body

| Field    | Type                                                                            | Description                                                                                  |
|----------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| threads  | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects              | the private, archived threads the current user has joined                                    |
| members  | array of [thread members](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | a thread member object for each returned thread the current user has joined                  |
| has_more | boolean                                                                         | whether there are potentially additional threads that could be returned on a subsequent call |
