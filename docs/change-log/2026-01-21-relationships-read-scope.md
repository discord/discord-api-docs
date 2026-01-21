---
title: "Relationships.read scope"
date: "2026-01-21"
topics:
- "Activities"
- "Embedded App SDK"
---

We've opened up the `relationships.read` scope for Activities under the [Social SDK terms](https://support-dev.discord.com/hc/en-us/articles/30225844245271-Discord-Social-SDK-Terms). To get access to the scope you will need to accept the Social SDK terms for your app in the [Social SDK settings](https://discord.com/developers/applications/select/social-sdk/getting-started). Requesting approval for this scope from Discord is no longer necessary. With this scope `getRelationships()` in the embedded app SDK will now return a player's relationships.

The Embedded App SDK is available via [npm](https://www.npmjs.com/package/@discord/embedded-app-sdk) and [GitHub](https://github.com/discord/embedded-app-sdk). You can check out our [installation guide and reference](/docs/developer-tools/embedded-app-sdk) to get started with it!
