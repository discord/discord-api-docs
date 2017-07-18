# Change Log

>danger
>API versions below v6 will be discontinued on October 16, 2017, after which they will be non-functioning.

This document contains breaking changes between API versions.

## Version 6

* [Channel](#DOCS_CHANNEL/channel-objects) Object
  * `is_private` removed
  * `type` is now an integer
  * `recipient` is now `recipients`, an array of [user](#DOCS_USER/user-object) objects
  * `type`, `last_message_id`, `name`, `icon`, and `owner_id` added
* [Message](#DOCS_CHANNEL/message-object) Object
  * `type` added to support system messages
* [Status Update](#DOCS_GATEWAY/gateway-status-update-structure) Object
  * `idle_since` renamed to `since`
  * `status` and `afk` added
