---
title: "Delete Ephemeral Messages"
date: "2022-10-20T07:00:00.000Z"
breaking: false
---

Ephemeral interaction responses and follow-ups can now be deleted with a valid interaction token using the following endpoints:

* [`DELETE /webhooks/<application_id>/<interaction_token>/messages/@original`](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/delete-original-interaction-response)
* [`DELETE /webhooks/<application_id>/<interaction_token>/messages/<message_id>`](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/delete-followup-message)

As a reminder, interaction tokens stay valid for up to 15 minutes after the interaction occurs. Details can be found in the [interaction documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING).
