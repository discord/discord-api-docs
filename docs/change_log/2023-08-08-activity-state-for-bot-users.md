---
title: "Activity State for Bot Users"
date: "2023-08-08T07:00:00.000Z"
breaking: false
---

The `state` field in [activity objects](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object) can now be set when [updating presence](#DOCS_TOPICS_GATEWAY_EVENTS/update-presence) for a bot user. The value of `state` will appear as a custom status for the bot user when an [activity's `type`](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-types) is set to `4`, or as additional data under an activity's name for other activity types.
