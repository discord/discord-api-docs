---
title: "Enforced Nonces on Create Message Endpoint"
date: "2024-02-12"
---

The [Create message](/docs/resources/message#create-message) endpoint now supports an `enforce_nonce` parameter. When set to true, the message will be deduped for the same sender within a few minutes. If a message was created with the same nonce, no new message will be created and the previous message will be returned instead. This behavior will become the default for this endpoint in a future API version.
