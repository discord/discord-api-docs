---
title: "Voice End-to-End Encryption (DAVE Protocol)"
date: "2024-09-17"
topics:
- "Voice"
---

Introduced [high-level documentation](/docs/topics/voice-connections) for Discord's Audio and Video End-to-End Encryption (DAVE) protocol, and the [new voice gateway opcodes](/docs/topics/opcodes-and-status-codes#voice) required to support it

### **Developer Impact**

Starting September 2024, Discord is migrating voice and video in DMs, Group DMs, voice channels, and Go Live streams to use end-to-end encryption (E2EE). 

**Who this affects:** Any libraries or apps that support [Voice Connections](/docs/topics/voice-connections).

You are not immediately required to support the E2EE protocol, as calls will automatically upgrade/downgrade to/from E2EE depending on the support of clients in the call.

### **Implementing E2EE Voice**

We have added high-level documentation for Discord's Audio and Video End-to-End Encryption (DAVE) protocol, and the new voice gateway opcodes required to support it.

The most thorough documentation on the DAVE protocol is found in the [Protocol Whitepaper](https://daveprotocol.com/). You can also use our open-source library [libdave](https://github.com/discord/libdave) to assist with your implementation. The exact format of the DAVE protocol opcodes is detailed in the [Voice Gateway Opcodes section of the protocol whitepaper](https://daveprotocol.com/#voice-gateway-opcodes).

### **Future Deprecation and Discontinuation of Non-E2EE Voice**

Non-E2EE connections to voice in DMs, Group DMs, voice channels, and Go Live streams will eventually be deprecated and discontinued.

In 2025, all official Discord clients will support the protocol and it will be an enforced requirement to connect to the end-to-end encryption-eligible audio/video session types listed above.

Once a timeline for deprecation and discontinuation is finalized, we will share details and developers will have **at least six months** to implement before we sunset non-E2EE voice connections.

Read more about Discord's Audio and Video End-to-End Encryption (DAVE) protocol:

- [Meet DAVE: Discord's New End-to-End Encryption for Audio & Video](https://discord.com/blog/meet-dave-e2ee-for-audio-video)
- [DAVE Protocol Whitepaper](https://daveprotocol.com/)
- [libdave open-source library on GitHub](https://github.com/discord/libdave)