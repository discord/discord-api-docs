---
title: "Updated Connection Property Field Names"
date: "2022-06-17"
---

The `$` prefix in [identify connection properties](/docs/events/gateway-events#identify-identify-connection-properties) are deprecated. The new field names are `os`, `browser`, and `device`. When passed, the `$`-prefixed names will resolve to the new ones.

In API v11, support for the previous field names (`$os`, `$browser`, and `$device`) will be removed.
