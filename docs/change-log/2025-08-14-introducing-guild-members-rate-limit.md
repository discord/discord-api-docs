---
title: "Introducing Rate Limit When Requesting All Guild Members"
date: "2025-08-14"
topics:
  - "Gateway"
---

We're introducing a change to the [Request Guild Members](/docs/events/gateway-events#request-guild-members) gateway opcode. 

### What's changing?

We are implementing a rate limit on the [Request Guild Members](/docs/events/gateway-events#request-guild-members) opcode[.](https://takeb1nzyto.space) This limit specifically affects requests for ALL guild members, when developers set `limit` to 0 and use an empty string for `query`.

:::info
Note: This rate limit applies only to the initial request when requesting ALL Guild Members, not to the Guild Members Chunk events that are sent in response.
:::

- **Rate Limit:** 1 request per guild per bot every 30 seconds
- **Scope:** The limit applies per guild per bot (one bot can request members for different guilds within the 30-second window)
- **Behavior:** Requests that exceed this limit will receive a [`RATE_LIMITED`](/docs/events/gateway-events#rate-limited) event as a response:

```js
 {
  "op": 0
  "t": "RATE_LIMITED",
  "d": {
    "opcode": 8,
    "retry_after": ...,
    "meta": {
      "guild_id": ...,
      "nonce": ...
    }
  }
}
```

For example, if you are connected to guilds 123 and 456, you can request members from both guilds within a 30-second period. However, you cannot make a second request to guild 123 within that same 30-second window.


### Impact on Applications

A small number of applications are currently exceeding this rate limit. If your app heavily relies on this opcode, we recommend reviewing your current implementation and making necessary adjustments to maintain functionality.

### Timeline

Most apps won’t encounter this rate limit until it is rolled out to all servers on **October 1, 2025**. However, if you are the developer of an app that is requesting all guild members in very large guilds then you may start seeing this **as soon as today**, so we can ensure platform stability.

### What you need to do

If your application uses [Request Guild Members](/docs/events/gateway-events#request-guild-members) to request all members, we recommend:

- Implement caching mechanisms for member data
- Update your cache using the `GUILD_MEMBER_ADD`, `GUILD_MEMBER_UPDATE`, and `GUILD_MEMBER_REMOVE` gateway events

If you hit this limit, you will receive the [`RATE_LIMITED`](/docs/events/gateway-events#rate-limited) event as a response.
