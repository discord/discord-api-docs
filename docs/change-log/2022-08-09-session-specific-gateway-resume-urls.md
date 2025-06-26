---
title: "Session-specific Gateway Resume URLs"
date: "2022-08-09"
---

:::warn
Starting on **September 12, 2022**, apps that aren’t using the new `resume_gateway_url` field to resume gateway sessions will be disconnected significantly faster than normal.
:::

A new `resume_gateway_url` field has been added to the [Ready](/docs/events/gateway-events#ready) gateway event to support session-specific gateway connections. The value of `resume_gateway_url` is a session-specific URL that should be used when resuming the gateway session after a disconnect. Previously, `wss://gateway.discord.gg` was used to connect *and* resume sessions, but should now only be used during the connection.

At the moment, the value of `resume_gateway_url` will always be `wss://gateway.discord.gg` to give developers more time to adopt the new field. In the near future, the value will change to the session-specific URLs.
