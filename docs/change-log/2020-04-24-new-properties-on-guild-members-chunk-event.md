---
title: "New Properties on Guild Members Chunk Event"
date: "2020-04-24"
---

The [Guild Members Chunk](/docs/events/gateway-events#guild-members-chunk) gateway event now contains two properties: `chunk_index` and `chunk_count`. These values can be used to keep track of how many events you have left to receive in response to a [Request Guild Members](/docs/events/gateway-events#request-guild-members) command.
