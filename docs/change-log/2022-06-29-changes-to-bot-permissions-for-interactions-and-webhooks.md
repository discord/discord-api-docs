---
title: "Changes to Bot Permissions for Interactions and Webhooks"
date: "2022-06-29"
breaking: true
---

#### Upcoming Changes

:::warn
`MENTION_EVERYONE`, `SEND_TTS_MESSAGES` and `USE_EXTERNAL_EMOJIS` are the only permissions that will be affected by this change. In a previous version of this changelog, it was indicated that `ATTACH_FILES` and `EMBED_LINKS` would be affected but this is no longer the case.
:::

Starting **August 3, 2022**, the way some of a bot's `MENTION_EVERYONE`, `SEND_TTS_MESSAGES` and `USE_EXTERNAL_EMOJIS` [permissions](/docs/topics/permissions#permissions) are calculated is changing in two cases:

* When **responding to an [interaction](/docs/interactions/receiving-and-responding)** (like application commands or message components)
* When **executing a [webhook](/docs/resources/webhook) that the bot created**

Going forward, in the above cases, a bot’s `MENTION_EVERYONE`, `SEND_TTS_MESSAGES` and `USE_EXTERNAL_EMOJIS` permissions will be calculated based on the permissions its granted, *including* any [overwrites](/docs/topics/permissions#permission-overwrites). Previously, a bot’s permissions in these cases relied only on those granted to `@everyone`.

This change *only* applies to bots. The permissions for an app without a bot user (or without the `bot` scope) will still depend on `@everyone`.

#### Updating Your App

If your bot wants to use the `MENTION_EVERYONE`, `SEND_TTS_MESSAGES` or `USE_EXTERNAL_EMOJIS` permissions when responding to interactions or executing a webhook, **ensure that the bot was installed (or explicitly granted) with them**.

Note that even if your bot is installed with certain permissions, they can be changed using overwrites. For interactions, you can use the [`app_permissions` field](/docs/interactions/receiving-and-responding#interaction-object-interaction-structure) to determine your app or bot's contextual permissions before replying.
