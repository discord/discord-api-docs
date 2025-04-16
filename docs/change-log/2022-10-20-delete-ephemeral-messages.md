---
title: "Delete Ephemeral Messages"
date: "2022-10-20"
---

Ephemeral interaction responses and follow-ups can now be deleted with a valid interaction token using the following endpoints:

* [`DELETE /webhooks/<application_id>/<interaction_token>/messages/@original`](/docs/interactions/receiving-and-responding#delete-original-interaction-response)
* [`DELETE /webhooks/<application_id>/<interaction_token>/messages/<message_id>`](/docs/interactions/receiving-and-responding#delete-followup-message)

As a reminder, interaction tokens stay valid for up to 15 minutes after the interaction occurs. Details can be found in the [interaction documentation](/docs/interactions/receiving-and-responding).
