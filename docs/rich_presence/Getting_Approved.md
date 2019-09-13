# Getting Approved for Spectate

> danger
> The SDK that this documentation references, [Discord-RPC](https://github.com/discordapp/discord-rpc), has been deprecated in favor of our new [Discord GameSDK](#DOCS_GAME_SDK_SDK_STARTER_GUIDE/). Replacement functionality for the Rich Presence SDK can be found in the [Activity Manager](#DOCS_GAME_SDK_ACTIVITIES/) of that SDK. This documentation can be referenced for education but does not entirely reflect the new SDK.

For the majority of Rich Presence, we do not require any sort of approval or whitelisting. You are free to update presence data and create join and spectate chat invites without us looking it over. However, if you want to add the “Spectate” button on your players’ profiles, we want to take a look first and ensure that you get any support you might need.

You’ll need to have the following prepared for the approval process:

- A video demonstrating your integration of the feature

These submissions should be in a polished, finalized state rather than works in progress.

## Spectate Video

If your game supports spectating, you probably want to apply for our Spectate feature as well! This displays a button on your players’ profiles that allows their friends to easily spectate their game. Clicking the button will launch the game client into its specific spectate mode. Here’s an example!

![](spectate.gif)

To be approved for Spectate, submit a video of your game’s Spectate flow that looks something like the above example. Specifically, we want to see:

#### Player

- Clicks Spectate on a friend’s profile
- Game client launches
- Begin spectating friend

In the case of spectating, your players should not be able to join the game directly. If you want players to be able to join a game session, use our Ask to Join feature instead. Discord’s Spectate feature is limited to a “true spectate” experience—that means no joining on.

To test Spectate for your game, you can add whitelisted users on [your app's developer dashboard](https://discordapp.com/developers/applications) who will then have the feature enabled on their profile.
