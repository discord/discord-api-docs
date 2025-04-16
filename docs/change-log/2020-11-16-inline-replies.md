---
title: "Inline Replies"
date: "2020-11-16"
---

Inline Replies have been added to our documentation. They behave differently in v6 and v8, so be cautious in your implementation:

* Inline replies are type `19` in v8, but remain type `0` in v6
* You can now add a `message_reference` on message create to create a reply
* A new field `referenced_message` has been added to the [Message Object](/docs/resources/message#message-object)
* A new field `replied_user` has been added to the [Allowed Mentions Object](/docs/resources/message#allowed-mentions-object)
* [Message Create](/docs/events/gateway-events#message-create) gateway event is guaranteed to have a `referenced_message` if the message created is a reply. Otherwise, that field is not guaranteed.
