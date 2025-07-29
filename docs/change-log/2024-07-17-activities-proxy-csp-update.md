---
title: "Activities Proxy CSP Update"
date: "2024-07-17"
breaking: true
topics:
- "Activities"
- "Embedded App SDK"
---

:::warn
This change is outdated. We have since updated the Activities Proxy CSP and the use of `/.proxy/` is no longer required. For the latest information, please refer to [this changelog](/docs/change-log#remove-proxy-from-discord-activity-proxy-path).
:::

This change will be rolled out to all existing applications on **August 28, 2024**.

We will be updating our Content Security Policy (CSP) for the Activities Domain (`https://<application_id>.discordsays.com`). This represents a **breaking change** for **all Activities**, and as such we have a migration plan in order.

our CSP will be updated as follows:

* all requests must be made through `https://<application_id>.discordsays.com/.proxy/`, and requests to other paths on the `discordsays.com` domain will be blocked.
* requests to `https://discord.com/api/` will be permitted, but other paths on the `discord.com` domain will be blocked.
* Only allowed paths on `cdn.discordapp.com` and `media.discordapp.net` will be permitted such as `/attachments/`, `/icons/`, and `/avatars/`.
* nested child iframes must also mount paths prepended by `/.proxy/`

As of [embedded-app-sdk v1.4.0](https://github.com/discord/embedded-app-sdk/releases/tag/v1.4.0) we have updated `patchUrlMappings` to automatically route requests through `/.proxy/`, so updating your SDK version calling `patchUrlMappings` is a good first step. If you are unfamiliar with `patchUrlMappings`, please consult the [documentation](/docs/activities/development-guides/networking#using-external-resources).

All Application IDs created after `07/17/2024 12:00:00` UTC (applicationID greater than `1263102905548800000`) will also automatically have the new CSP applied. Testing your production code on a new application created after this date is a suggested way for developers to test compliance with this new CSP.
