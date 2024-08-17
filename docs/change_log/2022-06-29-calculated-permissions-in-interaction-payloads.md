---
title: "Calculated Permissions in Interaction Payloads"
date: "2022-06-29T07:00:00.000Z"
breaking: false
---

Interaction payloads now contain an `app_permissions` field whose value is the computed [permissions](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) for a bot or app in the context of a specific interaction (including any channel overwrites). Similar to other permission fields, the value of `app_permissions` is a bitwise OR-ed set of permissions expressed as a string. Read details in the [interactions documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object).

For apps without a bot user (or without the `bot` scope), the value of `app_permissions` will be the same as the permissions for `@everyone`, but limited to the permissions that can be used in interaction responses (currently `ATTACH_FILES`, `EMBED_LINKS`, `MENTION_EVERYONE`, and `USE_EXTERNAL_EMOJIS`).
