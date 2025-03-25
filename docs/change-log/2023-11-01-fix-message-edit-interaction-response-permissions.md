---
title: "Fix Message Edit Interaction Response Permissions"
date: "2023-11-01"
---

Behavior for message edit interaction response actions like [updating interaction responses](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/edit-original-interaction-response) and [sending follow-up messages](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/followup-messages) have been updated to follow a bot user's permissions.

Previously, some message edit interaction response actions would use the default permissions rather than a bot user's permissions.
