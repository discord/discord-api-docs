---
title: "Clarification on Permission Splits for Expressions and Events"
date: "2023-12-15"
---

:::info
The existing behavior for `MANAGE_GUILD_EXPRESSIONS` and `MANAGE_EVENTS` will **not be changing**. These permissions will continue to allow your bot users to create, update and delete expressions/events. No action will be needed if you plan to continue using these permissions.
:::

To support added controls for expressions and events, new [permissions](/docs/topics/permissions#permissions) were added for users and roles in July 2023:

* `CREATE_GUILD_EXPRESSIONS`: `1 << 43`
* `CREATE_EVENTS`: `1 << 44`

These allow for creating new expressions and events, as well as editing and deleting those created by the current user.

:::warn
These were rolled out in July 2023 to users and roles and have been added to our developer documentation but **are not yet available to app developers**. We will share an update here when these new permissions are available in your apps.
:::
