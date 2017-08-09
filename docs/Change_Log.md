# Change Log

>danger
>API and Gateway versions below v6 will be discontinued on October 16, 2017, after which they will be non-functioning.

## August 3, 2017 - Breaking Change

After today, we are changing how default channels function. The "default" channel for a given user is now the channel with the highest position that their permissions allow them to see. New guilds will no longer have a default channel with the same id as the guild. Existing guilds will not have their #general channel id changed. It is possible, if permissions are set in such a way, that a user will not have a default channel in a guild.

We saw a use case in many servers where the previously-default #general channel was being repurposed as an announcement-only, non-writable channel for new members by using bots to clear the entire message history. Now, that channel can simply be deleted and re-created with the desired permissions. This change also allows dynamic default channels for users based on permissions.

-We are also rolling out a change in conjunction that will allow Discord to remember your last-visited channel in a guild across sessions. Newly-joined users will be directed to the guild's default channel on first join; existing members will return to whichever channel they last visited.

## July 24, 2017

Audit logs are here! Well, they've been here all along, but now we've got [documentation](#DOCS_AUDIT_LOG/audit-logs) about them. Check it out, but remember: with great power comes great responsibility.

## July 19, 2017 — Version 6 Breaking Changes

* [Channel](#DOCS_CHANNEL/channel-object) Object
  * `is_private` removed
  * [`type`](#DOCS_CHANNEL/channel-object-channel-types) is now an integer
  * `recipient` is now `recipients`, an array of [user](#DOCS_USER/user-object) objects
* [Message](#DOCS_CHANNEL/message-object) Object
  * [`type`](#DOCS_CHANNEL/message-object-message-types) added to support system messages
* [Status Update](#DOCS_GATEWAY/gateway-status-update-gateway-status-update-structure) Object
  * `idle_since` renamed to `since`
