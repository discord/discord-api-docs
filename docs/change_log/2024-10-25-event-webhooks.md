---
title: "Webhook Events"
date: "2024-10-25"
topics:
- "Events"
- "User Apps"

---

You can now subscribe to a limited number of HTTP-based outgoing [webhook events](#DOCS_EVENTS_WEBHOOK_EVENTS/event-types) after [configuring a webhook events URL](#DOCS_EVENTS_WEBHOOK_EVENTS/configuring-a-webhook-events-url). Currently, 3 events are available: `APPLICATION_AUTHORIZED`, `ENTITLEMENT_CREATE`, and `QUEST_USER_ENROLLMENT`. Read the [webhook events](#DOCS_EVENTS_WEBHOOK_EVENTS) documentation for details on subscribing and using webhook events.

> info
> When developing [user-installable apps](#DOCS_RESOURCES_APPLICATION/user-context), [Application Authorized](#DOCS_EVENTS_WEBHOOK_EVENTS/application-authorized) (which is not available via [the Gateway](#DOCS_EVENTS_GATEWAY)) is useful to receive events when your app was installed to a user or server.

> warn
> `ENTITLEMENT_CREATE` is the only monetization-related event available using webhook events, so you should still use the Gateway for [entitlement-related events](#DOCS_EVENTS_GATEWAY_EVENTS/entitlements). Other monetization-related events will be supported via webhook events soon.