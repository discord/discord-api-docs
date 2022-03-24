# Threads

[Threads](#DOCS_RESOURCES_CHANNEL/channel-object) are a new Discord feature. Threads can be thought of as temporary sub-channels inside an existing channel, to help better organize conversation in a busy channel.

Threads have been designed to be very similar to [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects, and this topic aggregates all of the information about threads, which should all help to make migrating very straightforward.

## Backwards Compatibility

Threads are only available in API v9. Bots that do not update to API v9 will not receive most gateway events for threads, or things that happen in threads (such as [Message Create](#DOCS_TOPICS_GATEWAY/message-create)). Bots on APIv8 will still receive gateway events for Interactions though.

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

## New Thread Fields

Since threads are a new [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types), they share and re-purpose a number of the existing fields on a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object:

- `id`, `guild_id`, `type`, `name`, `last_message_id`, `last_pin_timestamp`, `rate_limit_per_user` are being re-used
- `owner_id` has been repurposed to store the id of the user that started the thread
- `parent_id` has been repurposed to store the id of the `GUILD_TEXT` or `GUILD_NEWS` channel the thread was created in

Additionally, there are a few new fields that are only available on threads:

- `message_count` and `member_count` store an approximate count, but they stop counting at 50 (these are only used in our UI, so likely are not valuable to bots)
- `thread_metadata` contains a few thread specific fields, `archived`, `archive_timestamp`, `auto_archive_duration`, `locked`. `archive_timestamp` is changed when creating, archiving, or unarchiving a thread, and when changing the `auto_archive_duration` field.

## Public & Private Threads

Public threads are viewable by everyone who can view the parent channel of the thread. Public threads must be created from an existing message, but can be "orphaned" if that message is deleted. The created thread and the message it was started from will share the same id. The [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) of thread created matches the [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) of the parent channel. `GUILD_TEXT` channels [create](#DOCS_RESOURCES_CHANNEL/start-thread-with-message) `GUILD_PUBLIC_THREAD` and `GUILD_NEWS` channels [create](#DOCS_RESOURCES_CHANNEL/start-thread-with-message) `GUILD_NEWS_THREAD`.

Private threads behave similar to Group DMs, but in a Guild. Private threads are always [created](#DOCS_RESOURCES_CHANNEL/start-thread-without-message) with the `GUILD_PRIVATE_THREAD` [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) and can only be created in `GUILD_TEXT` channels.

## Active & Archived Threads

Every thread can be either active or archived. Changing a thread from archived -> active is referred to as unarchiving the thread. Threads that have `locked` set to true can only be unarchived by a user with the `MANAGE_THREADS` permission.

Besides helping to de-clutter the UI for users, archiving exists to limit the working set of threads that need to be kept around. Since the number of archived threads can be quite large, keeping all of them in memory may be quite prohibitive. Therefore guilds are capped at a certain number of active threads, and only active threads can be manipulated. Users cannot edit messages, add reactions, use application commands, or join archived threads. The only operation that should happen within an archived thread is messages being deleted. Sending a message will automatically unarchive the thread, unless the thread has been locked by a moderator.

Because of this constraint, the gateway protocol is designed to ensure that bots are able to have an accurate view of the full set of active threads, but archived threads are not synced up-front via the gateway.

Threads do not count against the max-channels limit in a guild, but there will be a new limit on the maximum number of active threads in a guild.

Threads automatically archive after inactivity. "Activity" is defined as sending a message, unarchiving a thread, or changing the auto-archive time. Bots can control how long a thread can be inactive with the `auto_archive_duration` field. Channels can also set `default_auto_archive_duration`, which is primarily used by our clients to pre-select a different auto-archive duration when a user starts the thread creation flow.

## Permissions

Threads generally inherit permissions from the parent channel (e.g. if you can add reactions in the parent channel, you can do that in a thread as well).

Three new permission bits have been added, `CREATE_PUBLIC_THREADS`, `CREATE_PRIVATE_THREADS`, and `SEND_MESSAGES_IN_THREADS`. Note: `SEND_MESSAGES` has no effect in threads; users must have `SEND_MESSAGES_IN_THREADS` to talk in a thread.

Private threads are similar to Group DMs, but in a guild: You must be invited to the thread to be able to view or participate in it, or be a moderator (`MANAGE_THREADS` permission).

Finally, threads are treated slightly differently from channels in the gateway protocol. Clients will not be informed of a thread through the gateway if they do not have permission to view that thread.

## Gateway Events

- [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) contains a new field, `threads`, which is an array of channel objects. This represents all active threads in the guild, that the current user is able to view.
- When a thread is created, updated, or deleted, a [Thread Create](#DOCS_TOPICS_GATEWAY/thread-create), [Thread Update](#DOCS_TOPICS_GATEWAY/thread-update), or [Thread Delete](#DOCS_TOPICS_GATEWAY/thread-delete) event is sent. Like their channel counterparts, these just contain a thread.
- Since the gateway only syncs active threads that the user can see, if a user _gains_ access to a channel, then the gateway may need to sync the active threads in that channel to the user. It will send a [Thread List Sync](#DOCS_TOPICS_GATEWAY/thread-list-sync) event for this.

## Thread Membership

Each thread tracks explicit membership. There are two primary use cases for this data:

- Clients use _their own_ [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) to calculate read states and notification settings. This is largely irrelevant for bots though, but is the reason for some of the syncing complexity detailed here.
- Knowing everyone that is in a thread.

Membership is tracked in an array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects. These have four fields, `id` (the thread id), `user_id`, `join_timestamp`, and `flags`. Currently the only `flags` are for notification settings, but others may be added in future updates.

### Syncing for the current user

- A [Thread Members Update](#DOCS_TOPICS_GATEWAY/thread-members-update) Gateway Event is always sent when the current user is added to or removed from a thread.
- A [Thread Member Update](#DOCS_TOPICS_GATEWAY/thread-member-update) Gateway Event is sent whenever the current user's [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object is updated.
- Certain API calls, such as listing archived threads and search will return an array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects for any returned threads the current user is a member of. Other API calls, such as getting a channel will return the [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object for the current user as a property on the channel, if the current user is a member of the thread.
- The [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) Gateway Event will contain a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object as a property on any returned threads the current is a member of.
- The [Thread Create](#DOCS_TOPICS_GATEWAY/thread-create) Gateway Event will contain a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object as a property of the thread if the current user is a member of, and the user has recently gained access to view the parent channel.
- The [Thread List Sync](#DOCS_TOPICS_GATEWAY/thread-list-sync) Gateway Event will contain an array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects for any returned threads the current user is a member of.

### Syncing for other users

> info
> These require the `GUILD_MEMBERS` [Gateway Intent](#DOCS_TOPICS_GATEWAY/gateway-intents)

- An API `GET` call to [`/channels/<channel_id>/thread-members`](#DOCS_RESOURCES_CHANNEL/list-thread-members) which returns an array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects.
- The [Thread Members Update](#DOCS_TOPICS_GATEWAY/thread-members-update) Gateway Event which will include all users who were added to or removed from a thread by an action.

## Editing & Deleting Threads

Threads can be edited and deleted with the existing `PATCH` and `DELETE` endpoints to edit a channel.

- Deleting a thread requires the `MANAGE_THREADS` permission.
- Editing a thread to set `archived` to `false` only requires the current user has already been added to the thread. If `locked` is true, then the user must have `MANAGE_THREADS`
- Editing a thread to change the `name`, `archived`, `auto_archive_duration` fields requires `MANAGE_THREADS` or that the current user is the thread creator
- Editing a thread to change `rate_limit_per_user` or `locked` requires `MANAGE_THREADS`

## NSFW Threads

Threads do not explicitly set the `nsfw` field. All threads in a channel marked as `nsfw` inherit that setting though.

## New Message Types

Threads introduce a few new [message types](#DOCS_RESOURCES_CHANNEL/message-object-message-types), and re-purpose some others:

- `RECIPIENT_ADD` and `RECIPIENT_REMOVE` have been repurposed to also send when a user is added to or removed from a thread by someone else
- `CHANNEL_NAME_CHANGE` has been repurposed and is sent when the thread's name is changed
- `THREAD_CREATED` is a new message sent to the parent `GUILD_TEXT` channel, used to inform users that a thread has been created. It is currently only sent in one case: when a `GUILD_PUBLIC_THREAD` is created from an older message (older is still TBD, but is currently set to a very small value). The message contains a [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-object-message-reference-structure) with the `guild_id` and `channel_id` of the thread. The `content` of the message is the `name` of the thread.
- `THREAD_STARTER_MESSAGE` is a new message sent as the first message in threads that are started from an existing message in the parent channel. It _only_ contains a [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-object-message-reference-structure) field that points to the message from which the thread was started.

## Enumerating threads

There are four new `GET` routes for enumerating threads in a specific channel:

- [`/guilds/<guild_id>/threads/active`](#DOCS_RESOURCES_GUILD/list-active-threads) returns all active threads in a guild that the current user can access, includes public & private threads
- [`/channels/<channel_id>/users/@me/threads/archived/private`](#DOCS_RESOURCES_CHANNEL/list-joined-private-archived-threads) returns all archived, private threads in a channel, that the current user has is a member of, sorted by thread id descending
- [`/channels/<channel_id>/threads/archived/public`](#DOCS_RESOURCES_CHANNEL/list-public-archived-threads) returns all archived, public threads in a channel, sorted by archive timestamp descending
- [`/channels/<channel_id>/threads/archived/private`](#DOCS_RESOURCES_CHANNEL/list-private-archived-threads) returns all archived, private threads in a channel, sorted by archive timestamp descending

## Webhooks

Webhooks can send messages to threads by using the `thread_id` query parameter. See the [execute webhook](#DOCS_RESOURCES_WEBHOOK/execute-webhook) docs for more details.

## Additional context on the the THREAD_LIST_SYNC and THREAD_CREATE dispatches

While threads are mostly similar to channels in terms of structure and how they are synced, there are two important product requirements that lead to differences in how threads and channels are synced. This section helps explain the behavior behind the [Thread List Sync](#DOCS_TOPICS_GATEWAY/thread-list-sync) and [Thread Create](#DOCS_TOPICS_GATEWAY/thread-create) dispatches by going over those problems and how they are solved.

The two product requirements are: The gateway will only sync threads to a client that the client has permission to view, and it will only sync those threads once the client has "subscribed" to the guild. For context, in Discord's official clients, a subscription happens when the user visits a channel in the guild.

As mentioned, these lead to a couple of edge cases that are worth going into:

### Gaining access to a private thread

When a client is added to a private thread, they likely don't have that private thread in memory yet because of the product requirement that we only sync threads you have permission to view. Private threads are only synced to you if you are a member or a moderator. To solve this, whenever a user is added to a private thread, the gateway also sends a [Thread Create](#DOCS_TOPICS_GATEWAY/thread-create) dispatch. This ensures the client always has a non-null value for that thread. Note: This is also sent even if the user is a moderator, and thus would already have the channel in memory, mainly for simplicity purposes.

### Gaining access to a public thread

When a client is added to a public thread, but has not yet subscribed to threads, they might not have that public thread in memory yet. This is actually only a problem for Discord's official clients, and not for bots. The gateway will auto-subscribe bots to all thread dispatches and active threads on connect. But Discord's clients only receive threads that are active and they have also joined on connect in order to reduce the amount of data needed on initial connect. But this means when a user with the official client is added to a thread, that thread now becomes an "active-joined" thread and needs to be synced to the client. To solve this, whenever a user is added to _any_ thread, the gateway also sends a [Thread Create](#DOCS_TOPICS_GATEWAY/thread-create) dispatch.

### Gaining access to a channel

When a client gains access to a channel (example: they _gain_ the moderator role, and thus now they have more channels they can view), they won't have any of the threads in memory for that channel (since the gateway only syncs threads that the client has permission to view). To solve this, we send the [Thread List Sync](#DOCS_TOPICS_GATEWAY/thread-list-sync) dispatch to a client when they gain access to a channel! This dispatch includes a `channel_ids` array, which is the id of all the channels whose threads are being synced. This field can be used to first clear out any active threads whose `parent_id` is in the `channel_ids` array, and then ingest any threads that were in the dispatch.

### Losing access to a channel

When a client loses access to a channel, the gateway does not send them a [Thread Delete](#DOCS_TOPICS_GATEWAY/thread-delete) event or any equivalent. They will still receive _an_ event when this happens, it just will not be a thread-specific event. Usually the event will be [Guild Role Update](#DOCS_TOPICS_GATEWAY/guild-role-update), [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) or [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update). It will be some event that caused the permissions on a channel to change. So _if_ a bot wanted to simulate a "lost access to thread" event, it is entirely possible, albeit quite complicated to handle all cases correctly. Under the hood, Discord's clients actually don't worry about this detail. Instead, when performing an action, the client checks permissions first (which implicitly checks if the client has access to the parent channel too, since threads inherit permissions), that way _even if_ the client has some stale data, it does not end up acting on it.

Additionally, when a client loses access to a channel they are not removed from the thread. Users may want to temporarily shut down access to a server or channel. Removing someone from all threads when that happens would not be a good experience, so we've chosen not to go that route. Users will still be reported as members of a thread, even if they no longer have access to the parent channel. They will **not** receive new gateway events for those threads though, with one exception: If a client is removed from a thread _after_ losing access to the parent channel, they will still receive a [Thread Members Update](#DOCS_TOPICS_GATEWAY/thread-members-update) dispatch.

### Unarchiving a thread

Discord's clients only load active threads into memory on start. So when a thread is unarchived, there is no guarantee that the client has either the thread or whether they are a member, in memory. As such, the Gateway sends a [Thread Update](#DOCS_TOPICS_GATEWAY/thread-update) first, which contains the full channel object. And then sends a [Thread Member Update](#DOCS_TOPICS_GATEWAY/thread-member-update) to each member of the thread, so those clients know they are a member, and what their notification setting is. This event is not that valuable for bots right now, but is going to be received by bots, so is documented here none the less.
