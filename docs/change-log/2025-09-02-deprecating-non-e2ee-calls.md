---
title: "Deprecating Non-E2EE Voice Calls"
date: "2025-09-02"
topics:
- "Voice"
---

We started work on end-to-end encryption for Discord over two years ago to enhance our user privacy and security. With
DAVE now supported across all platforms, we’re very close to making every call fully end-to-end encrypted.

### Developer Impact

To support our long-term privacy goals, we will **only support E2EE calls starting on March 1st, 2026** for all audio 
and video conversations in direct messages (DMs), group messages (GDMs), voice channels, and Go Live streams on 
Discord. After that date, any client or application not updated for DAVE support will no longer be able to 
participate in Discord calls.

### Implementing E2EE Voice

For developers working with Discord's voice APIs, you can consult 
[the updated voice documentation](/docs/topics/voice-connections)
and the implementation examples available in our [open-source repository](https://github.com/discord/libdave) as 
well as [the protocol whitepaper](https://github.com/discord/dave-protocol). 

The [Discord Developers community](https://discord.gg/discord-developers) is also a
great place to find assistance and answers to any integration questions you may have.

We're committed to making this transition as smooth as possible while delivering the enhanced privacy and security that 
DAVE provides to all Discord users.
