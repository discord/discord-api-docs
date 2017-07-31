# Change Log

>danger
>API and Gateway versions below v6 will be discontinued on October 16, 2017, after which they will be non-functioning.

## July 31, 2017 - Semi-breaking Change

After today, we are removing the existing concept of a default channel from Discord. We saw a use case in many servers where the previously-default #general channel was being repurposed as an announcement-only, non-writable channel for new members. In practice, server owners were deleting the entire message history of #general, which created a huge number of tombstones in our Cassandra database clusters, significantly affecting performance.

From now on, new servers will no longer have a default channel with the same snowflake id as its guild. Existing guilds are unaffected. This means that your library can no longer assume that channel as a default. The "default" channel for a given user is now the channel with the highest position that their permissions allow them to see. This change also allows for deletion of a guild's #general channel and the use of override permissions to hide it from certain roles.

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