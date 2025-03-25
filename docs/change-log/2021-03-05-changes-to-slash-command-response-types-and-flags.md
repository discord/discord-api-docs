---
title: "Changes to Slash Command Response Types and Flags"
date: "2021-03-05"
---

Changes to interaction response types have been made to support better designs for application commands:

* Type `2` `Acknowledge` has been deprecated
* Type `3` `ChannelMessage` has been deprecated
* Type `5` `AcknowledgeWithSource` has been renamed to `DeferredChannelMessageWithSource`

These deprecated types will be removed and break on **April 9, 2021**.

Additionally, `flags` has been documented on [InteractionApplicationCommandCallbackData](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-data-structure). Setting `flags` to `64` will make the interaction response ephemeral.
