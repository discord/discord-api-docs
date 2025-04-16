---
title: "Message Content in Auto Moderation events"
date: "2022-06-21"
breaking: true
---

In API v10, the `MESSAGE_CONTENT` (`1 << 15`) intent is now required to receive non-empty values for the `content` and `matched_content` fields in [`AUTO_MODERATION_ACTION_EXECUTION`](/docs/events/gateway-events#auto-moderation-action-execution) gateway events. This matches the intended behavior for message content across the API.
