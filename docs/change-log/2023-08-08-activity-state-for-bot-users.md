---
title: "Activity State for Bot Users"
date: "2023-08-08"
---

The `state` field in [activity objects](/docs/events/gateway-events#activity-object) can now be set when [updating presence](/docs/events/gateway-events#update-presence) for a bot user. The value of `state` will appear as a custom status for the bot user when an [activity's `type`](/docs/events/gateway-events#activity-object-activity-types) is set to `4`, or as additional data under an activity's name for other activity types.
