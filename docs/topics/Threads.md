# Threads

[Threads](#DOCS_RESOURCES_CHANNEL/channel-object) are a new Discord feature, only available in API v9. Bots that do not update to API v9 will not receive gateway events for threads, or things that happen in threads (such as [Message Create](#DOCS_TOPICS_GATEWAY/message-create)).  Threads can be thought of as temporary sub-channels inside an existing channel, to help better organize conversation in a busy channel.

Threads have been designed to be very similar to [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects, and this topic aggregates all of the information about threads, which should all help to make migrating very straightforward.

## Disclaimer

Threads have not shipped yet, and so everything in this documentation is still subject to change. At a minimum additional status codes will be added for reaching certain limits, and we may implement additional features, especially around moderation tooling, but we don't expect any of those to be breaking changes for what is currently documented.

## New Thread Fields

Since threads are a new [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types), they share and re-purpose a number of the existing fields on a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object:

- `id`, `guild_id`, `type`, `name`, `last_message_id`, `last_pin_timestamp`, `rate_limit_per_user` are being re-used
- `owner_id` has been repurposed to store the id of the user that started the thread
- `parent_id` has been repurposed to store the id of the `GUILD_TEXT` or `GUILD_NEWS` channel the thread was created in

Additionally, there are a few new fields that are only available on threads:

- `message_count` and `member_count` store an approximate count, but they stop counting at 50 (these are only used in our UI, so likely are not valuable to bots)
- `thread_metadata` contains a few thread specific fields, `archived`, `archive_timestamp`, `archiver_id`, `auto_archive_duration`, `locked`. Archive timestamp is changed when creating, archiving, or unarchiving a thread, and when changing the auto_archive_duration field.

## Public & Private Threads

Public threads are viewable by everyone who can view the parent channel of the thread. Public threads must be created from an existing message, but can be "orphaned" if that message is deleted. The [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) of thread created matches the [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) of the parent channel. `GUILD_TEXT` channels [create](#DOCS_RESOURCES_CHANNEL/start-a-public-thread) `PUBLIC_THREAD` and `GUILD_NEWS` channels [create](#DOCS_RESOURCES_CHANNEL/start-a-public-thread) `NEWS_THREAD`.

Private threads behave similar to Group DMs, but in a Guild. Private threads are always [created](#DOCS_RESOURCES_CHANNEL/start-a-private-thread) with the `PRIVATE_THREAD` [type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) and can only be created in `GUILD_TEXT` channels.

## Active & Archived Threads

Every thread can be either active or archived. Changing a thread from archived -> active is referred to as unarchiving the thread. Threads that have `locked` set to true can only be unarchived by a user with the `MANAGE_THREADS` permission.

Besides helping to de-clutter the UI for users, archiving exists to limit the working set of threads that need to be kept around. Since the number of archived threads can be quite large, keeping all of them in memory may be quite prohibitive. Therefore guilds are capped at a certain number of active threads, and only active threads can be manipulated. Users cannot edit messages, add reactions, use slash commands, or join archived threads. The only operation that should happen within an archived thread is messages being deleted.  Sending a message will automatically unarchive the thread, unless the thread has been locked by a moderator.

Because of this constraint, the gateway protocol is designed to ensure that bots are able to have an accurate view of the full set of active threads, but archived threads are not synced up-front via the gateway.

Threads do not count against the max-channels limit in a guild, but there will be a new limit on the maximum number of active threads in a guild.

## Permissions

Threads generally inherit permissions from the parent channel. If you can send messages or add reactions in the parent channel, you can do that in a thread as well.

Two new permission bits will be added, `USE_PUBLIC_THREADS` and `USE_PRIVATE_THREADS`. Users can _create_ a thread if they have BOTH the `SEND_MESSAGES` permission and the appropriate `USE_THREADS` permission. Users can _send messages_ in a thread if they have EITHER the `SEND_MESSAGES` permission or the appropriate `USE_THREADS` permission.

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

- An API `GET` call to `/channels/<channel_id>/thread-members` which returns an array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects.
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
- `THREAD_CREATED` is a new message sent when a thread is created from an older message, it contains a [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-object-message-reference-structure) with the `guild_id` and `channel_id` of the thread. The `content` of the message is the `name` of the thread.
- `THREAD_STARTER_MESSAGE` is a new message sent as the first message in certain threads. It _only_ contains a [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-object-message-reference-structure) field that points to the message from which the thread was started.

## Enumerating threads

There are four new `GET` routes for enumerating threads in a specific channel

- `/channels/<channel_id>/threads/active` returns all active threads in a channel that the current user can access, includes public & private threads
- `/channels/<channel_id>/users/@me/threads/archived/private` returns all archived, private threads in a channel, that the current user has is a member of, sorted by thread id descending
- `/channels/<channel_id>/threads/archived/public` returns all archived, public threads in a channel, sorted by archive timestamp descending
- `/channels/<channel_id>/threads/archived/private` returns all archived, private threads in a channel, sorted by archive timestamp descending
