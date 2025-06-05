---
title: "Discord Social SDK Release 1.3"
date: "2025-06-05"
topics:
  - "Discord Social SDK"
---

A new release of the Discord Social SDK is now available, with the following updates:

### Authentication
- Added an `APPLICATION_DEAUTHORIZED` webhook event which can be configured in the developer portal. When a user unlinks their account or revokes authorization for your application in any way, this event will be sent to configured webhooks. The payload will contain serialized user information. See [Webhook Events](/docs/events/webhook-events) docs for more information on configuring webhook events.

### PC
- Added configurable request timeout SDK HTTP client requests to mitigate crashing when connected to unstable/slow internet. Support is on PC in this release with console and mobile support coming in future release. Timeout default value is 30000ms (30 seconds) and can be configured using the new Client API: [Client::SetHttpRequestTimeout]

### Mobile
- `SetSpeakerMode` is now deprecated. Unless `SetEngineManagedAudio` is used, audio routing will be handled automatically by the SDK

#### Android
- Fixed routing of game and voice audio when external audio devices are connected and/or disconnected. `SetEngineManagedAudio` has been added to communicate that the SDK should not manage audio routing and automatically enter and leave `MODE_IN_COMMUNICATION` when joining and leaving calls.
- Fixed an issue with the Authorize method when a device configuration change needs to restart the activity

#### iOS
- Various fixes for audio routing and session management. When using the Unity plugin, game audio will no longer stop playing when ending a call. For standalone SDK use, a method `SetEngineManagedAudio` has been added to communicate that the SDK should not automatically start and stop the `AVAudioSession` when joining and leaving calls.
- Corrected supported platform values in `Info.plist` for iOS .frameworks.

### Consoles
- Standalone archives now only contain console-specific files, like the Unity and Unreal Engine archives

### Misc
- Fixed a thread safety issue with [Client::AddLogCallback]
- Added [Flags] declaration for bit flags enums in C#