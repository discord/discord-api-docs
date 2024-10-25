---
title: "Breaking Change: Version 6"
date: "2017-07-19"
breaking: true
---

* [Channel](#DOCS_RESOURCES_CHANNEL/channel-object) Object
  * `is_private` removed
  * [`type`](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) is now an integer
  * `recipient` is now `recipients`, an array of [user](#DOCS_RESOURCES_USER/user-object) objects
* [Message](#DOCS_RESOURCES_MESSAGE/message-object) Object
  * [`type`](#DOCS_RESOURCES_MESSAGE/message-object-message-types) added to support system messages
* [Status Update](#DOCS_EVENTS_GATEWAY_EVENTS/update-presence-gateway-presence-update-structure) Object
  * `idle_since` renamed to `since`
