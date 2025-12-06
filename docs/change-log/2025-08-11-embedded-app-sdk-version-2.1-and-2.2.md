---
title: "Embedded App SDK Version 2.1 & 2.2"
date: "2025-08-11"
topics:
- "Activities"
- "Embedded App SDK"
---

We've made a few improvements to the Embedded App SDK for version 2.2.0, here are the highlights:

### Changes in version 2.1

#### New URL fields

We now support new fields for rich presence activities:

- `state_url` - URL that is linked to when clicking on the state text in the activity card
- `details_url` - URL that is linked to when clicking on the details text in the activity card
- `assets.large_url` - URL that is linked to when clicking on the large image in the activity card
- `assets.small_url` - URL that is linked to when clicking on the small image in the activity card

### Changes in version 2.2

#### patchUrlMappings

In line with the [recent change](/docs/change-log#remove-proxy-from-discord-activity-proxy-path) to remove the `.proxy/` path from Discord Activity proxy URLs, the `patchUrlMappings` utility has been updated to generate simplified URLs by default. It will now create mappings without the `.proxy/` prefix.

The Embedded App SDK is available via [npm](https://www.npmjs.com/package/@discord/embedded-app-sdk) and [GitHub](https://github.com/discord/embedded-app-sdk). You can check out our [installation guide and reference](/docs/developer-tools/embedded-app-sdk) to get started with it!
