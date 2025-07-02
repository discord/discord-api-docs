---
title: "Breaking Change: Version 6"
date: "2017-07-19"
breaking: true
---

* [Channel](/docs/resources/channel#channel-object) Object
  * `is_private` removed
  * [`type`](/docs/resources/channel#channel-object-channel-types) is now an integer
  * `recipient` is now `recipients`, an array of [user](/docs/resources/user#user-object) objects
* [Message](/docs/resources/message#message-object) Object
  * [`type`](/docs/resources/message#message-object-message-types) added to support system messages
* [Status Update](/docs/events/gateway-events#update-presence-gateway-presence-update-structure) Object
  * `idle_since` renamed to `since`
