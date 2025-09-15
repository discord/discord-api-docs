---
title: "Pin Permission Split"
date: "2025-08-20"
breaking: true
topics:
- "HTTP API"
---

[Pinning](/docs/resources/message#pin-message) and [unpinning](/docs/resources/message#unpin-message) messages now has its own [permission](/docs/topics/permissions#permissions-bitwise-permission-flags). We split `PIN_MESSAGES` out of `MANAGE_MESSAGES` to give more granular control over who can pin messages in a channel. This is effective immediately for both users and apps. This change will be backwards compatible until January 12th 2026 when `MANAGE_MESSAGES` will no longer grant the ability to pin or unpin messages.
