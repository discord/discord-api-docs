---
title: "Global Rate Limit added to discordapp.com/*"
date: "2023-10-17"
---

We have added a global rate limit for API requests made to `discordapp.com/*` and may further restrict requests in the future.

To limit impact on your app, please make sure you are making calls to `discord.com/*`.

This does **not** apply for `cdn.discordapp.com`.

Refer to the [API Reference](/docs/reference) for more info on which url(s) to use when building on the REST API

* [February 14, 2022 Change Log](/docs/change-log#api-v10): Requests to v10 and higher will no longer be supported on `discordapp.com` (this does not affect `cdn.discordapp.com`)
* [May 4, 2020 #api-announcements](https://discord.com/channels/613425648685547541/697138785317814292/706944540971630662)
