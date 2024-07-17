# Threads

[Threads](#DOCS_RESOURCES_CHANNEL/channel-object) can be thought of as temporary sub-channels inside an existing channel, to help better organize conversation in a busy channel.

Threads have been designed to be very similar to [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects, and this topic aggregates all of the information about threads, which should all help to make migrating very straightforward.

## Backwards Compatibility

Threads are only available in API v9 and above. Bots that do not update to API v9 or above will not receive most gateway events for threads, or things that happen in threads (such as [Message Create](#DOCS_TOPICS_GATEWAY_EVENTS/message-create)). Bots on API v8 will still receive gateway events for Interactions.

The list of gateway events that may be dropped includes, but is not limited to:

- MESSAGE_CREATE
- MESSAGE_DELETE
- MESSAGE_DELETE_BULK
- MESSAGE_REACTION_ADD
- MESSAGE_REACTION_REMOVE
- MESSAGE_REACTION_REMOVE_ALL
- MESSAGE_REACTION_REMOVE_EMOJI
- MESSAGE_UPDATE
- THREAD_CREATE
- THREAD_UPDATE
- THREAD_DELETE
- THREAD_MEMBER_UPDATE
- THREAD_MEMBERS_UPDATE

## Thread Fields

Threads share and repurpose a number of the existing fields from the [channel object](#DOCS_RESOURCES_CHANNEL/channel-object):

- `id`, `guild_id`, `type`, `name`, `last_message_id`, `last_pin_timestamp`, `rate_limit_per_user` are being re-used
- `owner_id` has been repurposed to store the id of the user that started the thread
- `parent_id` has been repurposed to store the id of the `GUILD_TEXT` or `GUILD_ANNOUNCEMENT` channel the thread was created in

Additionally, there are a few fields that are only available on threads:

- `member_count` stores an approximate member count, but it stops counting at 50 (this is only used in our UI, so it is not valuable to bots)
- `message_count` and `total_message_sent` store the number of messages in a thread. The difference is that when a message is deleted, `message_count` is decremented, but `total_message_sent` will not be. (threads created before July 1, 2022 stop counting both values at 50).
- `thread_metadata` contains a few thread specific fields, `archived`, `archive_timestamp`, `auto_archive_duration`, `locked`. `archive_timestamp` is changed when creating, archiving, or unarchiving a thread, and when changing the `auto_archive_duration` field.

## Public & Private Threads

Public threads are viewable by everyone who can view the parent channel of the thread. Public threads must be created from an existing message, but can be "orphaned" if that message is deleted. The created thread and the message it was started from will share the same id. The [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) of thread created matches the [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) of the parent channel. `GUILD_TEXT` channels [create](#DOCS_RESOURCES_CHANNEL/start-thread-from-message) `PUBLIC_THREAD` and `GUILD_ANNOUNCEMENT` channels [create](#DOCS_RESOURCES_CHANNEL/start-thread-from-message) `ANNOUNCEMENT_THREAD`.

Private threads behave similar to Group DMs, but in a Guild. Private threads are always [created](#DOCS_RESOURCES_CHANNEL/start-thread-without-message) with the `GUILD_PRIVATE_THREAD` [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) and can only be created in `GUILD_TEXT` channels.

## Locked Threads
Users (including bot users) without the `MANAGE_THREADS` permission are more restricted in locked threads. Users won't be able to create or update messages in locked threads, or update properties like its title or tags. Additionally, some user activity like deleting messages and adding or removing reactions will *only* be allowed in locked threads if that thread is also active (or un-archived).

If a user or bot user has the `MANAGE_THREADS` permission, they will still be able to make changes to the thread and messages.

## Active & Archived Threads

Every thread can be either active or archived. Changing a thread from archived -> active is referred to as unarchiving the thread. Threads that have `locked` set to true can only be unarchived by a user with the `MANAGE_THREADS` permission.

Besides helping to de-clutter the UI for users, archiving exists to limit the working set of threads that need to be kept around. Since the number of archived threads can be quite large, keeping all of them in memory may be quite prohibitive. Therefore guilds are capped at a certain number of active threads, and only active threads can be manipulated. Users cannot edit messages, add reactions, use application commands, or join archived threads. The only operation that should happen within an archived thread is messages being deleted. Sending a message will automatically unarchive the thread, unless the thread has been locked by a moderator.

Because of this constraint, the gateway protocol is designed to ensure that bots are able to have an accurate view of the full set of active threads, but archived threads are not synced up-front via the gateway.

Threads do not count against the max-channels limit in a guild, but there is a limit on the maximum number of active threads in a guild.

Threads automatically archive after a period of inactivity. As a server approaches the max thread limit this timer will automatically lower, usually not below the `auto_archive_duration`. In very busy channels, threads set to a 7 day auto archive may archive earlier to help avoid the server becoming "full"). "Activity" is defined as sending a message, unarchiving a thread, or changing the auto-archive time. The `auto_archive_duration` field previously controlled how long a thread could stay active, but is now repurposed to control how long the thread stays in the channel list. Channels can also set `default_auto_archive_duration`, which is used by our clients to pre-select a different `auto_archive_duration` value when a user creates a thread.

## Permissions

Threads generally inherit permissions from the parent channel (e.g. if you can add reactions in the parent channel, you can do that in a thread as well).

Three permission bits are specific to threads: `CREATE_PUBLIC_THREADS`, `CREATE_PRIVATE_THREADS`, and `SEND_MESSAGES_IN_THREADS`.

> warn
> The `SEND_MESSAGES` permission has no effect in threads; users must have `SEND_MESSAGES_IN_THREADS` to talk in a thread.

Private threads are similar to Group DMs, but in a guild: You must be invited to the thread to be able to view or participate in it, or be a moderator (`MANAGE_THREADS` permission).

Finally, threads are treated slightly differently from channels in the gateway protocol. Clients will not be informed of a thread through the gateway if they do not have permission to view that thread.

## Gateway Events

- [Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) contains a field, `threads`, which is an array of channel objects. This represents all active threads in the guild that the current user is able to view.
- When a thread is created, updated, or deleted, a [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create), [Thread Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-update), or [Thread Delete](#DOCS_TOPICS_GATEWAY_EVENTS/thread-delete) event is sent. Like their channel counterparts, these just contain a thread.
- Since the gateway only syncs active threads that the user can see, if a user _gains_ access to a channel, then the gateway may need to sync the active threads in that channel to the user. It will send a [Thread List Sync](#DOCS_TOPICS_GATEWAY_EVENTS/thread-list-sync) event for this.

## Thread Membership

Each thread tracks explicit membership. There are two primary use cases for this data:

- Clients use _their own_ [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) to calculate read states and notification settings. This is largely irrelevant for bots though, but is the reason for some of the syncing complexity detailed here.
- Knowing everyone that is in a thread.

Membership is tracked in an array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects. These have four fields, `id` (the thread id), `user_id`, `join_timestamp`, and `flags`. Currently the only `flags` are for notification settings, but others may be added in future updates.

### Syncing for the current user

- A [Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update) Gateway Event is always sent when the current user is added to or removed from a thread.
- A [Thread Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-member-update) Gateway Event is sent whenever the current user's [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object is updated.
- Certain API calls, such as listing archived threads and search will return an array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects for any returned threads the current user is a member of. Other API calls, such as getting a channel will return the [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object for the current user as a property on the channel, if the current user is a member of the thread.
- The [Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) Gateway Event will contain a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object as a property on any returned threads the current is a member of.
- The [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) Gateway Event will contain a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object as a property of the thread if the current user is a member of, and the user has recently gained access to view the parent channel.
- The [Thread List Sync](#DOCS_TOPICS_GATEWAY_EVENTS/thread-list-sync) Gateway Event will contain an array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects for any returned threads the current user is a member of.

### Syncing for other users

> info
> These require the `GUILD_MEMBERS` [Gateway Intent](#DOCS_TOPICS_GATEWAY/gateway-intents)

- An API `GET` call to [`/channels/<channel_id>/thread-members`](#DOCS_RESOURCES_CHANNEL/list-thread-members) which returns an array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects.
- The [Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update) Gateway Event which will include all users who were added to or removed from a thread by an action.

## Editing & Deleting Threads

Threads can be edited and deleted with the existing `PATCH` and `DELETE` endpoints to edit a channel.

- Deleting a thread requires the `MANAGE_THREADS` permission.
- Editing a thread to set `archived` to `false` only requires the current user has already been added to the thread. If `locked` is true, then the user must have `MANAGE_THREADS`
- Editing a thread to change the `name`, `archived`, `auto_archive_duration` fields requires `MANAGE_THREADS` or that the current user is the thread creator
- Editing a thread to change `rate_limit_per_user` or `locked` requires `MANAGE_THREADS`

## NSFW Threads

Threads do not explicitly set the `nsfw` field. All threads in a channel marked as `nsfw` inherit that setting though.

## New Message Types

Threads introduce a few [message types](#DOCS_RESOURCES_CHANNEL/message-object-message-types), and repurpose some others:

- `RECIPIENT_ADD` and `RECIPIENT_REMOVE` have been repurposed to also send when a user is added to or removed from a thread by someone else
- `CHANNEL_NAME_CHANGE` has been repurposed and is sent when the thread's name is changed
- `THREAD_CREATED` is a new message sent to the parent `GUILD_TEXT` channel, used to inform users that a thread has been created. It is currently only sent in one case: when a `PUBLIC_THREAD` is created from an older message (older is still TBD, but is currently set to a very small value). The message contains a [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-structure) with the `guild_id` and `channel_id` of the thread. The `content` of the message is the `name` of the thread.
- `THREAD_STARTER_MESSAGE` is a new message sent as the first message in threads that are started from an existing message in the parent channel. It _only_ contains a [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-structure) field that points to the message from which the thread was started.

## Enumerating threads

There are four `GET` routes for enumerating threads in a specific channel:

- [`/guilds/<guild_id>/threads/active`](#DOCS_RESOURCES_GUILD/list-active-guild-threads) returns all active threads in a guild that the current user can access, includes public & private threads
- [`/channels/<channel_id>/users/@me/threads/archived/private`](#DOCS_RESOURCES_CHANNEL/list-joined-private-archived-threads) returns all archived, private threads in a channel, that the current user has is a member of, sorted by thread id descending
- [`/channels/<channel_id>/threads/archived/public`](#DOCS_RESOURCES_CHANNEL/list-public-archived-threads) returns all archived, public threads in a channel, sorted by archive timestamp descending
- [`/channels/<channel_id>/threads/archived/private`](#DOCS_RESOURCES_CHANNEL/list-private-archived-threads) returns all archived, private threads in a channel, sorted by archive timestamp descending

## Webhooks

Webhooks can send messages to threads by using the `thread_id` query parameter. See the [execute webhook](#DOCS_RESOURCES_WEBHOOK/execute-webhook) docs for more details.

## Details about Thread Access and Syncing

While the syncing of threads is similar to channels, there are two important differences that are relevant for [Thread List Sync](#DOCS_TOPICS_GATEWAY_EVENTS/thread-list-sync) and [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) events:

1. The [Gateway](#DOCS_TOPICS_GATEWAY) will only sync threads that the app has permission to view
2. The Gateway will only sync threads once the app has "subscribed" to the guild. For context, in Discord's official clients, a subscription happens when the user visits a channel in the guild.

These differences mean there is some unique behavior that is worth going into.

### Thread Access

#### Gaining Access to Private Threads

When an app is added to a private thread, it likely doesn't have that thread in memory yet since it doesn't have permission to view it.

Private threads are only synced to you if you are a member or a moderator. Whenever a user is added to a private thread, the Gateway also sends a [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) event. This ensures the client always has a non-null value for that thread.

> info
> The `THREAD_CREATE` event is also sent when the user is a moderator (and thus would already have the channel in memory).

#### Gaining Access to Public Threads

Upon connecting to the Gateway, apps will be automatically subscribed to thread events and active threads.

However, when a non-app is added to a public thread but hasn't subscribed to threads, it may not have that thread in memory yet (which is a requirement for Discord's clients). Because of this, the Gateway will send a [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) event when a user is added to _any_ thread, even if the event is not necessary for apps.

### Channel Access

#### Gaining Access to Channels

When an app gains access to a channel (for example, they're given the moderator role), they likely won't have the threads in memory for that channel since the Gateway only syncs threads that the client has permission to view. To account for this, a [Thread List Sync](#DOCS_TOPICS_GATEWAY_EVENTS/thread-list-sync) event is sent.

The [Thread List Sync](#DOCS_TOPICS_GATEWAY_EVENTS/thread-list-sync) event contains a `channel_ids` array, which is the IDs of all channels whose threads are being synced. This field can be used to first clear out any active threads whose `parent_id` is in the `channel_ids` array, and then ingest any threads that were in the event.

#### Losing Access to Channels

When an app loses access to a channel, the Gateway does **not** send it [Thread Delete](#DOCS_TOPICS_GATEWAY_EVENTS/thread-delete) event (or any equivalent thread-specific event). Instead, the app will receive the event that caused its permissions on the channel to change.

If an app wanted to track when it lost access to any thread, it's possible but difficult as it would need to handle all cases correctly. Usually, events that cause permission changes are a [Guild Role Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-role-update), [Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update) or [Channel Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-update) event.

> info
> Discord's clients check their permissions *first* when performing an action. That way, even if it has some stale data, it does not end up acting on it.

Additionally, when a user or app loses access to a channel, they are not removed from the thread and will continue to be reported as a member of that thread. However, they will **not** receive any new Gateway events unless they are removed from the thread, in which case they will receive a [Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update) event.

### Unarchiving a Thread

When a thread is unarchived, there is no guarantee that an app has the thread or its member status in memory. To account for this, the Gateway will send two events (in the listed order):

1. A [Thread Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-update) event, which contains the full channel object.
2. A [Thread Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-member-update) event, which is sent to all members of the unarchived thread. Discord's clients only load active threads into memory on start, so this event is sent even if it may not be relevant to most apps.

## Forums

A `GUILD_FORUM` (type `15`) channel is similar to a `GUILD_TEXT` channel, except *only* threads can be created in them. Unless otherwise noted, threads in forum channels behave in the same way as in text channels—meaning they use the same endpoints and receive the same Gateway events.

Messages cannot be sent directly in forum channels.

> info
> More information about forum channels and how they appear in Discord can be found in the [Forum Channels FAQ](https://support.discord.com/hc/en-us/articles/6208479917079-Forum-Channels-FAQ#h_01G69FJQWTWN88HFEHK7Z6X79N)

## Media Channels

A `GUILD_MEDIA` (type `16`) channel is similar to a `GUILD_FORUM` channel in that only threads can be created in them. Unless otherwise noted, threads in media channels behave in the same way as in forum channels - meaning they use the same endpoints and receive the same Gateway events. More information about media channels and how they appear in Discord can be found in the [media channels Help Center Article](https://creator-support.discord.com/hc/en-us/articles/14346342766743).

> warn
> `GUILD_MEDIA` channels are in beta and still being actively developed. The API and other technical details are subject to change.


### Creating Threads in Forum and Media Channels

Within thread-only channels, threads appear as posts. Threads can be created using the [`POST /channels/<channel_id>/threads`](#DOCS_RESOURCES_CHANNEL/start-thread-in-forum-or-media-channel) endpoint with [slightly different parameters](#DOCS_RESOURCES_CHANNEL/start-thread-in-forum-or-media-channel-jsonform-params) than threads in text channels. For example, when creating threads in a threads-only channel, a message is created that has the same ID as the thread which requires you to pass parameters for both a thread *and* a message.

Threads in thread-only channels have the same permissions behavior as threads in a text channel, inheriting all permissions from the parent channel, with one exception: creating a thread in a thread-only channel only requires the `SEND_MESSAGES` permission.

### Forum and Media Channel Fields

It's worth calling out a few details about fields specific to thread-only channels that may be important to keep in mind:

- The `last_message_id` field is the ID of the most recently created thread in that channel. As with messages, your app will not receive a `CHANNEL_UPDATE` event when the field is changed. Instead clients should update the value when receiving [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) events.
- The `topic` field is what is shown in the "Guidelines" section within the Discord client.
- The `rate_limit_per_user` field limits how frequently threads can be created. There is a new `default_thread_rate_limit_per_user` field on thread-only channels as well, which limits how often messages can be sent _in a thread_. This field is copied into `rate_limit_per_user` on the thread at creation time.
- The `available_tags` field can be set when creating or updating a channel, which determines which tags can be set on individual threads within the thread's `applied_tags` field.
- The `flags` field indicates any [channel flags](#DOCS_RESOURCES_CHANNEL/channel-object-channel-flags) set for a thread-only channel. Currently only `REQUIRE_TAG` can be used, which requires that a tag from `available_tags` be specified when creating a thread in that channel.

All fields for channels, including thread-only channels, can be found in the [Channel Object](#DOCS_RESOURCES_CHANNEL/channel-object).

### Forum and Media Channel Thread Fields

A thread can be pinned within a thread-only, which will be represented as the [`PINNED` flag](#DOCS_RESOURCES_CHANNEL/channel-object-channel-flags) in the `flags` field within a thread-only channel. A thread that is pinned will have the `(1 << 1)` flag set, and archiving that thread will unset the flag. A pinned thread will *not* auto-archive.

The `message_count` and `total_message_sent` fields on threads in thread-only channels will increment on `MESSAGE_CREATE` events, and decrement on `MESSAGE_DELETE` and `MESSAGE_DELETE_BULK` events. There will be no specific `CHANNEL_UPDATE` event that notifies your app of changes to those fields—instead, apps should update those values when receiving corresponding events.

All fields for threads in thread-only channels can be found in the [channel resources documentation](#DOCS_RESOURCES_CHANNEL/start-thread-in-forum-or-media-channel-jsonform-params).

### Forum and Media Channel Formatting

In thread-only channels, the first message in a thread and the channel topic can both contain markdown for bulleted lists and headings (unlike text channels).
