---
title: "Activity State for Bot Users"
date: "2023-08-08"
---

The `state` field in [activity objects](#DOCS_EVENTS_GATEWAY_EVENTS/activity-object) can now be set when [updating presence](#DOCS_EVENTS_GATEWAY_EVENTS/update-presence) for a bot user. The value of `state` will appear as a custom status for the bot user when an [activity's `type`](#DOCS_EVENTS_GATEWAY_EVENTS/activity-object-activity-types) is set to `4`, or as additional data under an activity's name for other activity types.
