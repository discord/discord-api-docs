---
title: "Voice Gateway Version 8 and Deprecation of Versions < 4"
date: "2024-08-13"
topics:
- "Gateway"
- "Voice"
---

We are officially deprecating some very old voice gateway versions (> 7 years ago).

* The voice gateway now supports a resume which re-sends lost messages. Use voice gateway version 8 and refer to [Buffered Resume](/docs/topics/voice-connections#buffered-resume).
* We have removed the default option for voice gateway version. Once this is deprecated, you must pass a voice gateway version.

:::danger
You will be required to pass a voice gateway version and deprecated voice gateway versions will be discontinued as of November 18th, 2024. See [Voice Gateway Versioning](/docs/topics/voice-connections#voice-gateway-versioning) for futher details.
:::
