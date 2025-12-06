---
title: "Guild Expressions and Events Permissions now available to developers"
date: "2025-11-20"
breaking: true
---

In 2023, we had introduced permission splits for guild expressions (custom emoji and stickers) and scheduled events. These changes were made to give server administrators more granular control over who can create content in their communities. [Read the change log](/docs/change-log#clarification-on-permission-splits-for-expressions-and-events).

Today, we are announcing that these permissions are now available for bot developers to use and will be required for certain actions starting **February 23, 2026**.

**Create Guild Expressions Permission**

- The `CREATE_GUILD_EXPRESSIONS` permission (`1 << 43`) was created in July 2023 and split from `MANAGE_GUILD_EXPRESSIONS` for users in December 2023. 
- As of today, bots now have access to the `CREATE_GUILD_EXPRESSIONS` permission.
- Starting on February 23, 2026, bots will need the `CREATE_GUILD_EXPRESSIONS` permission to create custom emoji and stickers. `MANAGE_GUILD_EXPRESSIONS` alone will no longer be sufficient.

**Create Events Permission**

- The `CREATE_EVENTS` permission (`1 << 44`) was created in July 2023 and split from `MANAGE_EVENTS` for users in December 2023. 
- As of today, bots now have access to the `CREATE_EVENTS` permission.
- Starting on February 23, 2026, bots will need the `CREATE_EVENTS` permission to create scheduled events. `MANAGE_EVENTS` alone will no longer be sufficient.