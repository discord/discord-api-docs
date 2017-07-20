# Change Log

>danger
>API and Gateway versions below v6 will be discontinued on October 16, 2017, after which they will be non-functioning.

This document contains changes between API versions.

## Version 6

### Breaking Changes

* [Channel](#DOCS_CHANNEL/channel-object) Object
  * `is_private` removed
  * [`type`](#DOCS_CHANNEL/channel-object-channel-types) is now an integer
  * `recipient` is now `recipients`, an array of [user](#DOCS_USER/user-object) objects
* [Message](#DOCS_CHANNEL/message-object) Object
  * [`type`](#DOCS_CHANNEL/message-object-message-types) added to support system messages
* [Status Update](#DOCS_GATEWAY/gateway-status-update-gateway-status-update-structure) Object
  * `idle_since` renamed to `since`

### All Changes

* [API Versioning](#DOCS_REFERENCE/api-versioning)
  * API versions below v6 are deprecated
  * API versions below v6 will be discontinued on October 16, 2017
  * API v6 will become the default on October 16, 2017
* Model Changes
  * [Guild](#DOCS_GUILD/guild-object) Object
    * added `application_id`
  * [Channel](#DOCS_CHANNEL/channel-object) Object
    * `is_private` removed
    * `recipients`, `icon`, `owner_id`, and `application_id` added
    * [`type`](#DOCS_CHANNEL/channel-object-channel-types) is now an integer
    * `recipient` is now `recipients`, an array of [user](#DOCS_USER/user-object) objects
  * [Message](#DOCS_CHANNEL/message-object) Object
    * [`type`](#DOCS_CHANNEL/message-object-message-types) added to support system messages
  * [Status Update](#DOCS_GATEWAY/gateway-status-update-gateway-status-update-structure) Object
    * `status` and `afk` added
    * `idle_since` renamed to `since`