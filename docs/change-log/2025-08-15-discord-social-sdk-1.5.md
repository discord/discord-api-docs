---
title: "Discord Social SDK Release 1.5"
date: "2025-08-15"
topics:
  - "Discord Social SDK"
---

A new release of the Discord Social SDK is now available, with the following updates:

### **DM History Support**

With the release of DM chat history this patch, the Social SDK can now fully support asynchronous player communication between individual players and in larger chat rooms. Players who go offline or background the came can come back to the history of the chat room and get caught up with what’s happening.

- Added [`Client::GetUserMessageSummaries`] and [`Client::GetUserMessagesWithLimit`] to retrieve direct message history

### Rich Presence

Rich Presence can now more accurately display the different types of activities a player might be engaged in. Specifically, the “Competing” status may be valuable for games that host tournaments, weekend brackets, or other competitive play. Also, when you receive game invites, you can now accept them cross-device; don’t miss the group forming even if you’re AFK.

- Added support for additional activity types (Listening, Watching, Competing)
- Added support for new clickable URL fields and additional user status customization
- Support for server-to-server rich presence invites and gateway-based invite handling. This means an invite can be accepted on a different device and the [`ActivityInviteCreatedCallback`] will be invoked on connected SDK sessions.

### Linked Channels

Linked channels are all about keeping groups of friends connected in and outside the game. You can now join a player to channel’s linked Discord server from in-game, helping them bridge that gap and stay connected with friends even when they stop playing.

- Added [`Client::JoinLinkedLobbyGuild()`] to allow members of linked
lobbies to join the linked lobby's guild from in-game

### Android

The many-step process of mobile account linking has been simplified for users with Discord installed by deep-linking into the Discord mobile app to authorize with your game

- Implemented native authentication support
- Fixed native authentication callback when activities are terminated
- Added an experimental audio setting on Android to avoid setting the OS to voice comms mode when connected to a Bluetooth headset on Android. This may be used if you wish to avoid the transition to voice volume controls and other related changes when connected to Bluetooth. To enable this setting, pass a [`ClientCreateOptions`] when instantiating the client and set the [`experimentalAndroidPreventCommsForBluetooth`] flag

### iOS

The many-step process of mobile account linking has been simplified for users with Discord installed by deep-linking into the Discord mobile app to authorize with your game

- Added native authentication support
- The experimental Game audio subsystem now makes use of the iOS 18.2+ echo canceller when available and falls back to Standard mode otherwise.

### Windows

- Added ARM64 support

### Linux

- Ensured glibc 2.31 compatibility

### Bug Fixes

- Fixed bug where [`Client::SetLogVoiceDir`] didn’t have any effect
- Added better error event handling to distinguish server authorization errors from user cancellations
- Fixed activity platform validation for console games
- Fixed crash safety issues with [`Client::GetCurrentUser`] when the client is in an unexpected non-Ready state. Added [`Client::GetCurrentUserV2`] which explicitly returns an optional handle instead of dummy data in this situation. This issue also affected the Unity and Unreal versions of the SDK
- Fixed [`Call::SetPTTActive`]

## Known Issues

- When the network is disconnected temporarily, active Calls may sometimes enter the Disconnected state instead of reconnecting. If a Call reaches Disconnected state, you must end and rejoin the call to reconnect if desired.
- For DM chat history
    - No SDK-side caching for [`GetUserMessagesWithLimit`]
        - Every invocation of [`GetUserMessagesWithLimit`] will directly query the backend rather than using local SDK-side caching. This may have performance implications, particularly under high-frequency usage.
    - Provisional account merge message retrieval
        - After a provisional account is merged into a full account, messages sent while the user was on the provisional account cannot be retrieved.