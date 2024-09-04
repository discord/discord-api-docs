---
title: "Supported Activity Types for SET_ACTIVITY"
date: "2024-07-25"
---

The [`SET_ACTIVITY` RPC command](#DOCS_TOPICS_RPC/setactivity) has been updated to support 3 additional [activity types](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-types): Listening (`2`), Watching (`3`), and Competing (`5`). Previously, it only accepted Playing (`0`).

> warn
> The [Game SDK](#DOCS_DEVELOPER_TOOLS_GAME_SDK/activities) has not been updated to support setting [`ActivityType`](#DOCS_DEVELOPER_TOOLS_GAME_SDK/activitytype-enum), and is still limited to read-only (to handle events that you receive from Discord).
