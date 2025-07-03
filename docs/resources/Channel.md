---
sidebar_label: Channel
---

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

Unlike with channels, the API will only sync updates to users about threads the current user can view.  When receiving a [guild create](#DOCS_EVENTS_GATEWAY_EVENTS/guild-create) payload, the API will only include active threads the current user can view.  Threads inside of private channels are completely private to the members of that private channel.  As such, when _gaining_ access to a channel the API sends a [thread list sync](#DOCS_EVENTS_GATEWAY_EVENTS/thread-list-sync), which includes all active threads in that channel.

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

### Followed Channel Object

###### Followed Channel Structure

| Field      | Type      | Description               |
|------------|-----------|---------------------------|
| channel_id | snowflake | source channel id         |
| webhook_id | snowflake | created target webhook id |

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

\* These fields are omitted on the member sent within each thread in the [GUILD_CREATE](#DOCS_EVENTS_GATEWAY_EVENTS/guild-create) event.

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

## Get Channel % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Get a channel by ID. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.  If the channel is a thread, a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object is included in the returned result.

## Modify Channel % PATCH /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Update a channel's settings. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. All JSON parameters are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params (Group DM)

Fires a [Channel Update](#DOCS_EVENTS_GATEWAY_EVENTS/channel-update) Gateway event.

| Field | Type   | Description                  |
|-------|--------|------------------------------|
| name  | string | 1-100 character channel name |
| icon  | binary | base64 encoded icon          |

###### JSON Params (Guild channel)

Requires the `MANAGE_CHANNELS` permission for the guild. Fires a [Channel Update](#DOCS_EVENTS_GATEWAY_EVENTS/channel-update) Gateway event. If modifying a category, individual [Channel Update](#DOCS_EVENTS_GATEWAY_EVENTS/channel-update) events will fire for each child channel that also changes. If modifying permission overwrites, the `MANAGE_ROLES` permission is required. Only permissions your bot has in the guild or parent channel (if applicable) can be allowed/denied (unless your bot has a `MANAGE_ROLES` overwrite in the channel).

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

Otherwise, requires the `MANAGE_THREADS` permission. Fires a [Thread Update](#DOCS_EVENTS_GATEWAY_EVENTS/thread-update) Gateway event. Requires the thread to have `archived` set to `false` or be set to `false` in the request.

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

Delete a channel, or close a private message. Requires the `MANAGE_CHANNELS` permission for the guild, or `MANAGE_THREADS` if the channel is a thread. Deleting a category does not delete its child channels; they will have their `parent_id` removed and a [Channel Update](#DOCS_EVENTS_GATEWAY_EVENTS/channel-update) Gateway event will fire for each of them. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Delete](#DOCS_EVENTS_GATEWAY_EVENTS/channel-delete) Gateway event (or [Thread Delete](#DOCS_EVENTS_GATEWAY_EVENTS/thread-delete) if the channel was a thread).

> warn
> Deleting a guild channel cannot be undone. Use this with caution, as it is impossible to undo this action when performed on a guild channel. In contrast, when used with a private message, it is possible to undo the action by opening a private message with the recipient again.

> info
> For Community guilds, the Rules or Guidelines channel and the Community Updates channel cannot be deleted.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Edit Channel Permissions % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/permissions/{overwrite.id#DOCS_RESOURCES_CHANNEL/overwrite-object}

Edit the channel permission overwrites for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Only permissions your bot has in the guild or parent channel (if applicable) can be allowed/denied (unless your bot has a `MANAGE_ROLES` overwrite in the channel). Returns a 204 empty response on success. Fires a [Channel Update](#DOCS_EVENTS_GATEWAY_EVENTS/channel-update) Gateway event. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions).

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

Create a new [invite](#DOCS_RESOURCES_INVITE/invite-object) object for the channel. Only usable for guild channels. Requires the `CREATE_INSTANT_INVITE` permission. All JSON parameters for this route are optional, however the request body is not. If you are not sending any fields, you still have to send an empty JSON object (`{}`). Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object. Fires an [Invite Create](#DOCS_EVENTS_GATEWAY_EVENTS/invite-create) Gateway event.

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

Delete a channel permission overwrite for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Channel Update](#DOCS_EVENTS_GATEWAY_EVENTS/channel-update) Gateway event. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions)

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Follow Announcement Channel % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/followers

Follow an Announcement Channel to send messages to a target channel. Requires the `MANAGE_WEBHOOKS` permission in the target channel. Returns a [followed channel](#DOCS_RESOURCES_CHANNEL/followed-channel-object) object. Fires a [Webhooks Update](#DOCS_EVENTS_GATEWAY_EVENTS/webhooks-update) Gateway event for the target channel.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field              | Type      | Description          |
|--------------------|-----------|----------------------|
| webhook_channel_id | snowflake | id of target channel |

## Trigger Typing Indicator % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/typing

Post a typing indicator for the specified channel, which expires after 10 seconds. Returns a 204 empty response on success. Fires a [Typing Start](#DOCS_EVENTS_GATEWAY_EVENTS/typing-start) Gateway event.

Generally bots should **not** use this route. However, if a bot is responding to a command and expects the computation to take a few seconds, this endpoint may be called to let the user know that the bot is processing their message.

## Get Pinned Messages % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins

Returns all pinned messages in the channel as an array of [message](#DOCS_RESOURCES_MESSAGE/message-object) objects.

## Pin Message % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins/{message.id#DOCS_RESOURCES_MESSAGE/message-object}

Pin a message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Channel Pins Update](#DOCS_EVENTS_GATEWAY_EVENTS/channel-pins-update) Gateway event.

> warn
> The max pinned messages is 50.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Unpin Message % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins/{message.id#DOCS_RESOURCES_MESSAGE/message-object}

Unpin a message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Channel Pins Update](#DOCS_EVENTS_GATEWAY_EVENTS/channel-pins-update) Gateway event.

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

## Start Thread from Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/threads

Creates a new thread from an existing message. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Thread Create](#DOCS_EVENTS_GATEWAY_EVENTS/thread-create) and a [Message Update](#DOCS_EVENTS_GATEWAY_EVENTS/message-update) Gateway event.

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

Creates a new thread that is not connected to an existing message. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Thread Create](#DOCS_EVENTS_GATEWAY_EVENTS/thread-create) Gateway event.

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

Creates a new thread in a forum or a media channel, and sends a message within the created thread. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object), with a nested [message](#DOCS_RESOURCES_MESSAGE/message-object) object, on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Thread Create](#DOCS_EVENTS_GATEWAY_EVENTS/thread-create) and [Message Create](#DOCS_EVENTS_GATEWAY_EVENTS/message-create) Gateway event.

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
| embeds?\*         | array of [embed](#DOCS_RESOURCES_MESSAGE/embed-object) objects                               | Up to 10 `rich` embeds (up to 6000 characters)                                                                                                                                                           |
| allowed_mentions? | [allowed mention object](#DOCS_RESOURCES_MESSAGE/allowed-mentions-object)                    | Allowed mentions for the message                                                                                                                                                                         |
| components?\*     | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) objects | Components to include with the message                                                                                                                                                                   |
| sticker_ids?\*    | array of snowflakes                                                                          | IDs of up to 3 [stickers](#DOCS_RESOURCES_STICKER/sticker-object) in the server to send in the message                                                                                                   |
| attachments?      | array of partial [attachment](#DOCS_RESOURCES_MESSAGE/attachment-object) objects             | Attachment objects with `filename` and `description`. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                             |
| flags?            | integer                                                                                      | [Message flags](#DOCS_RESOURCES_MESSAGE/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) (only `SUPPRESS_EMBEDS` and `SUPPRESS_NOTIFICATIONS` can be set) |

\* At least one of `content`, `embeds`, `sticker_ids`, `components`, or `files[n]` is required.

## Join Thread % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/@me

Adds the current user to a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a [Thread Members Update](#DOCS_EVENTS_GATEWAY_EVENTS/thread-members-update) and a [Thread Create](#DOCS_EVENTS_GATEWAY_EVENTS/thread-create) Gateway event.

## Add Thread Member % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/{user.id#DOCS_RESOURCES_USER/user-object}

Adds another member to a thread. Requires the ability to send messages in the thread. Also requires the thread is not archived. Returns a 204 empty response if the member is successfully added or was already a member of the thread. Fires a [Thread Members Update](#DOCS_EVENTS_GATEWAY_EVENTS/thread-members-update) Gateway event.

## Leave Thread % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/@me

Removes the current user from a thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a [Thread Members Update](#DOCS_EVENTS_GATEWAY_EVENTS/thread-members-update) Gateway event.

## Remove Thread Member % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/thread-members/{user.id#DOCS_RESOURCES_USER/user-object}

Removes another member from a thread. Requires the `MANAGE_THREADS` permission, or the creator of the thread if it is a `PRIVATE_THREAD`. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a [Thread Members Update](#DOCS_EVENTS_GATEWAY_EVENTS/thread-members-update) Gateway event.

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
> This endpoint is restricted according to whether the `GUILD_MEMBERS` [Privileged Intent](#DOCS_EVENTS_GATEWAY/privileged-intents) is enabled for your application.

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
