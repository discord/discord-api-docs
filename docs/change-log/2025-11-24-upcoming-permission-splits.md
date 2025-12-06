---
title: "Permission Changes Going into Effect February 2026 for PIN_MESSAGES, BYPASS_SLOWMODE, CREATE_GUILD_EXPRESSIONS, and CREATE_EVENTS"
date: "2025-11-24"
breaking: true
---

We have some important permission changes that will take effect in February 2026.

The introduction of the following permissions were non-breaking changes. 

However, the breaking changes described below - where the old permissions will no longer grant these abilities - will take effect on February 23, 2026. These changes involve a few permissions that we split from their original permission to provide more granular control over bot and user actions.

### What's Changing?

**1. Pin Messages Permission**

- The `PIN_MESSAGES` permission (`1 << 51`) was split from `MANAGE_MESSAGES` on August 20, 2025.
- [Read the change log](/docs/change-log#pin-permission-split).
- Starting February 23, 2026, users and bots will need the `PIN_MESSAGES` permission to pin messages. `MANAGE_MESSAGES` alone will no longer be sufficient.

**2. Bypass Slowmode Permission**

- The `BYPASS_SLOWMODE` permission (`1 << 52`) is being split from `MANAGE_MESSAGES`, `MANAGE_CHANNEL`, and `MANAGE_THREADS`.
- [Read the change log](/docs/change-log#new-bypassslowmode-permission-permission-split).
- Note: This primarily affects users, as bots are not affected by slowmode restrictions.
- Starting on February 23, 2026, users will need the `BYPASS_SLOWMODE` permission to not be affected by slowmode restrictions.

**3. Create Expressions Permission**

- The `CREATE_GUILD_EXPRESSIONS` permission (`1 << 43`) was created in July 2023 and split from `MANAGE_GUILD_EXPRESSIONS` for users in December 2023. [Read the change log](/docs/change-log#clarification-on-permission-splits-for-expressions-and-events).
- As of today, bots now have access to the `CREATE_GUILD_EXPRESSIONS` permission.
- [Read the change log](/docs/change-log#guild-expressions-and-events-permissions-now-available-to-developers).
- Starting on February 23, 2026, bots will need the `CREATE_GUILD_EXPRESSIONS` permission to create custom emoji and stickers. `MANAGE_GUILD_EXPRESSIONS` alone will no longer be sufficient.

**4. Create Events Permission**

- The `CREATE_EVENTS` permission (`1 << 44`) was created in July 2023 and split from `MANAGE_EVENTS` for users in December 2023. [Read the change log](/docs/change-log#clarification-on-permission-splits-for-expressions-and-events).
- As of today, bots now have access to the `CREATE_EVENTS` permission.
- [Read the change log](/docs/change-log#guild-expressions-and-events-permissions-now-available-to-developers).
- Starting on February 23, 2026, bots will need the `CREATE_EVENTS` permission to create scheduled events. `MANAGE_EVENTS` alone will no longer be sufficient.

### What Do You Need to Do?

If your bot performs any of the following actions, please review and update your bot's permission requests before February 23, 2026:

- **Pins messages:** Request the `Pin Messages` permission
- **Creates custom emoji or stickers:** Request the `Create Expressions` permission
- **Creates scheduled events:** Request the `Create Events` permission

These changes are designed to give server administrators more control over what bots and users can do, ensuring better security and permission management.
