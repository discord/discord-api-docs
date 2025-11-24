---
title: "New BYPASS_SLOWMODE Permission & Permission Split"
date: "2025-11-24"
---

We have introduced a new permission: `BYPASS_SLOWMODE`. This permission allows designated roles or users to bypass slowmode restrictions in channels.

- The `BYPASS_SLOWMODE` permission (`1 << 52`) is being split from `MANAGE_MESSAGES`, `MANAGE_CHANNEL`, and `MANAGE_THREADS`.
- Note: This primarily affects users, as bots are not affected by slowmode restrictions.
- Starting on February 23, 2026, users will need the `BYPASS_SLOWMODE` permission to not be affected by slowmode restrictions.