---
title: "Upcoming Permissions Change to Webhook Routes"
date: "2022-07-13"
---

On August 8th, 2022 we will begin requiring the `VIEW_CHANNEL (1 << 10)` permission for webhook routes which require `MANAGE_WEBHOOKS (1 << 29)`, to align with our documented behavior. We don't expect that many applications will be affected by this, but in case you are, please ensure you have updated permissions needed for accessing the following routes:

* [`GET /webhooks/{webhook.id}`](/docs/resources/webhook#get-webhook)
* [`DELETE /webhooks/{webhook.id}`](/docs/resources/webhook#delete-webhook)
* [`PATCH /webhooks/{webhook.id}`](/docs/resources/webhook#modify-webhook)
* [`GET /channels/{channel.id}/webhooks`](/docs/resources/webhook#get-channel-webhooks)
* [`POST /channels/{channel.id}/webhooks`](/docs/resources/webhook#create-webhook)
