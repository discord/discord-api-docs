---
title: "Interaction Channel Data"
date: "2023-04-06"
---

Interactions now contain a `channel` field which is a partial channel object and guaranteed to contain `id` and `type`. We recommend that you begin using this channel field to identify the source channel of the interaction, and may deprecate the existing `channel_id` field in the future. See the [interaction documentation](/docs/interactions/receiving-and-responding#interaction-object) for more details.
