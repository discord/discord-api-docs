---
title: "Experimenting with End-to-End Encryption for Voice & Video"
date: "2023-12-01"
topics:
- "Voice"
---

#### What’s Happening?

As outlined in [a blog post earlier this year](https://discord.com/blog/encryption-for-voice-and-video-on-discord), we are experimenting with end-to-end encryption (e2ee) for voice and video channels.

End-to-end encryption is designed to only allow the participants in a call to decipher its contents. One of the protocols we’re experimenting with is called Messaging Layer Security, which we believe would allow us to deliver end-to-end encryption at scale. Intermediaries, including platforms like Discord, are unable to access the content of communications encrypted with end-to-end encryption.

#### How do I prepare for the changes?

During this testing phase, there is nothing developers need to do to support end-to-end encryption. Voice channels will automatically downgrade to documented, non-e2ee protocols when a bot user joins the channel. This is transparent to the connecting client but may result in a slight delay between establishing a connection and receiving audio.

#### What is planned for the future?

We will be continuing our testing and will share updates along with developer documentation and sample code once it is available.

Once this information is published, we will provide developers with a substantial timeframe to implement end-to-end encryption when interacting with voice and video.
