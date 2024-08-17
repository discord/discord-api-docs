---
title: "Upcoming Permissions Change to Webhook Routes"
date: "2022-07-13T07:00:00.000Z"
breaking: false
---

On August 8th, 2022 we will begin requiring the `VIEW_CHANNEL (1 << 10)` permission for webhook routes which require `MANAGE_WEBHOOKS (1 << 29)`, to align with our documented behavior. We don't expect that many applications will be affected by this, but in case you are, please ensure you have updated permissions needed for accessing the following routes:

* [`GET /webhooks/{webhook.id}`](#DOCS_RESOURCES_WEBHOOK/get-webhook)
* [`DELETE /webhooks/{webhook.id}`](#DOCS_RESOURCES_WEBHOOK/delete-webhook)
* [`PATCH /webhooks/{webhook.id}`](#DOCS_RESOURCES_WEBHOOK/modify-webhook)
* [`GET /channels/{channel.id}/webhooks`](#DOCS_RESOURCES_WEBHOOK/get-channel-webhooks)
* [`POST /channels/{channel.id}/webhooks`](#DOCS_RESOURCES_WEBHOOK/create-webhook)
