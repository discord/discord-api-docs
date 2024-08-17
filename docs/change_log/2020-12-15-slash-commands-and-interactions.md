---
title: "Slash Commands and Interactions"
date: "2020-12-15T08:00:00.000Z"
breaking: false
---

Slash Commands are here! There's a *lot* to cover, so go check out specific documentation under [Slash Commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/).

Slash Commands include some new features for webhooks as well:

* Webhooks can now update previously-sent messages from the same webhook using [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message) and [Delete Webhook Message](#DOCS_RESOURCES_WEBHOOK/delete-webhook-message)

This PR also documents the `application` field on the `READY` gateway event, which is a partial [application object](#DOCS_RESOURCES_APPLICATION/application-object) containing `id` and `flags`.
