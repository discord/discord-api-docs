---
title: "Supported Activity Types for SET_ACTIVITY"
date: "2024-07-25"
---

The [`SET_ACTIVITY` RPC command](/docs/topics/rpc#setactivity) has been updated to support 3 additional [activity types](/docs/events/gateway-events#activity-object-activity-types): Listening (`2`), Watching (`3`), and Competing (`5`). Previously, it only accepted Playing (`0`).

:::warn
The [Game SDK](/docs/developer-tools/game-sdk#activities) has not been updated to support setting [`ActivityType`](/docs/developer-tools/game-sdk#activitytype-enum), and is still limited to read-only (to handle events that you receive from Discord).
:::
