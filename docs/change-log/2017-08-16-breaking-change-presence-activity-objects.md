---
title: "Breaking Change: Presence Activity Objects"
date: "2017-08-16"
breaking: true
---

The `type` field in the [activity object](/docs/events/gateway-events#activity-object) for [Gateway Status Update](/docs/events/gateway-events#update-presence) and [Presence Update](/docs/events/gateway-events#presence-update) payloads is no longer optional when the activity object is not null.
