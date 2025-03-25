---
title: "New Properties on Guild Members Chunk Event"
date: "2020-04-24"
---

The [Guild Members Chunk](#DOCS_EVENTS_GATEWAY_EVENTS/guild-members-chunk) gateway event now contains two properties: `chunk_index` and `chunk_count`. These values can be used to keep track of how many events you have left to receive in response to a [Request Guild Members](#DOCS_EVENTS_GATEWAY_EVENTS/request-guild-members) command.
