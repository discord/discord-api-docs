# Getting Approved for Spectate and Ask to Join

For the majority of Rich Presence, we do not require any sort of approval or whitelisting. You are free to update presence data and create join and spectate chat invites without us looking it over. However, if you want to add the “Spectate” and “Ask to Join” buttons on your players’ profiles, we want to take a look first and ensure that you get any support you might need.

You’ll need to have the following prepared for the approval process:

- For Ask to Join, a video demonstrating your integration of the feature
- For Spectate, a video demonstrating your integration of the feature
- For both, screenshots of a Discord profile with your data in various states

These submissions should be in a polished, finalized state rather than works in progress.

## Screenshots

Because you’re taking the extra steps to integrate more deeply with Discord, we want to make sure you have the resources you need to make your profile data look great. We will ask you to submit screenshots for each “state” of your game in which you send data. That doesn’t mean you need to send a separate screenshot for every conceivable map and dungeon. We want to see states like “Main Menu”, “In Queue”, “In Lobby”, and your various game modes.

For example, here’s a screenshot for a fictional games’s Capture the Flag mode:

![](rp-profile-example-2.png)

And another fictional game, where players are fighting a boss:

![](rp-profile-example-1.png)

Be sure to check out our [Best Practices Guide](#DOCS_BEST_PRACTICES/) before submitting!

## Ask to Join Video

Ask to Join is a feature that allows you to display a button on your players’ profiles while they’re playing your game. Their friends in Discord can click that Ask to Join button to request an invite to the group. Here’s an example!

![](ask-to-join.gif)

To be approved for Ask to Join, submit a video of your game’s Ask to Join flow that looks something like the above example. Specifically, we want to see:

#### Player A

- Clicks Ask to Join on a friend’s profile
- Receives an acceptance
- Hits “Join” and the game launches
- Placed into the party with Player B

#### Player B

- Receives in-game notification about the request
- Is directed to act on the notification by accepting, denying, or ignoring
- Accepts the request
- Player A is placed into their party

To test Ask to Join for your game, you can add whitelisted users on [your app's developer dashboard](https://discordapp.com/developers/applications/me) who will then have the feature enabled on their profile.

## Spectate Video

If your game supports spectating, you probably want to apply for our Spectate feature as well! This displays a button on your players’ profiles that allows their friends to easily spectate their game. Clicking the button will launch the game client into its specific spectate mode. Here’s an example!

![](spectate.gif)

To be approved for Spectate, submit a video of your game’s Spectate flow that looks something like the above example. Specifically, we want to see:

#### Player

- Clicks Spectate on a friend’s profile
- Game client launches
- Begin spectating friend

In the case of spectating, your players should not be able to join the game directly via spectating. If you want players to be able to join a game session, use our Ask to Join feature instead. Discord’s Spectate feature is limited to a “true spectate” experience—that means no joining on.

To test Spectate for your game, you can add whitelisted users on [your app's developer dashboard](https://discordapp.com/developers/applications/me) who will then have the feature enabled on their profile.
