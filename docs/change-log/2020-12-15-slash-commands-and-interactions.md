---
title: "Slash Commands and Interactions"
date: "2020-12-15"
---

Slash Commands are here! There's a *lot* to cover, so go check out specific documentation under [Slash Commands](/docs/interactions/application-commands).

Slash Commands include some new features for webhooks as well:

* Webhooks can now update previously-sent messages from the same webhook using [Edit Webhook Message](/docs/resources/webhook#edit-webhook-message) and [Delete Webhook Message](/docs/resources/webhook#delete-webhook-message)

This PR also documents the `application` field on the `READY` gateway event, which is a partial [application object](/docs/resources/application#application-object) containing `id` and `flags`.
