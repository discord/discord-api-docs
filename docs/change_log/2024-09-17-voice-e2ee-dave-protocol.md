---
title: "Voice End-to-End Encryption (DAVE Protocol)"
date: "2024-09-17"
topics:
- "Voice"
---

Introduced high-level documentation for Discord's Audio and Video End-to-End Encryption (DAVE) protocol, and the new voice gateway opcodes required to support it.

Since September 2024, Discord is migrating voice and video in DMs, Group DMs, voice channels, and Go Live streams to use end-to-end encryption (E2EE). You are not immediately required to support the E2EE protocol. Non-E2EE connections to voice in DMs, Group DMs, voice channels, and Go Live streams will eventually be deprecated and discontinued after at least a six month deprecation window, which will be announced in the future.
