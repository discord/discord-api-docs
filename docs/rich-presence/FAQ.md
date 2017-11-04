# Rich Presence FAQ

Below are answers to some common questions about integrating Rich Presence with your game. If you don't see your question answered here, feel free to reach out to [gamedevs@discordapp.com](mailto:gamedevs@discordapp.com) for more help.

#### Q: I don't see any playing status for my game.

Discord is most likely not automatically detecting the test build for your game because it's running from a directory we aren't looking for. In order to add your test build, go to your user settings in Discord, then to the "Games" subsection, click "Add it!", and select your process from the drop-down list.

#### Q: I see "Playing MyGame", but no Rich Presence data.

There's a couple things that could be going on:

- If you're running two instances of the Discord client, check both!
- Double check that your `Discord_Initialize()` function is correct.

Throughout development, make sure you have your `errored()` and `disconnected()` callbacks hooked up for debugging. You can open up the console in Discord and look for errors pertaining to `SET_ACTIVITY` for more information as well.

#### Q: I'm not seeing Spectate or Ask to Join buttons on my profile.

Make sure you applied for approval! If you want these buttons on your players' profiles, we require your integration to go through an approval process. If you have applied and have been approved and still don't see the buttons, check your Discord console for errors.

#### Q: What happens if someone has more than one game running that supports Rich Presence?

Discord will show presence for whichever game is currently focused or was most recently focused.

#### Q: What if someone looking at my profile or an invite doesn't own the game?

Anyone can see your profile data, whether they own the game or not. They'll only be able to interact with chat invites or profile buttons if they own the game and have launched it at least once. Otherwise, the invite/button tooltip will show "Game Not Detected".

#### Q: Do join invitations allow players to select the number of open slots?

Currently, the SDK does not support this. Party slot information is determined by the party data you sent in your presence payload.

#### Q: Can I send images via the payload rather than uploading them to my Developer Dashboard?

Unfortunately, the SDK does not support this feature right now.  However, we hear your desires! We know that a lot of games, like customization-heavy RPGs, would benefit greatly from being able to programmatically upload assets. It may be something we tackle in the future.

#### Q: Can I change something in the SDK for my own purposes?

Go nuts! The SDK is open source by design. If you need or want to change something for the purposes of your specific integration—like changing our JSON parser, or changing all of the variable names to the names of your pets—go ahead and tinker to your heart's content.

#### Q: OK—I've got it working! Now, how do I make my integration look _awesome_?

I'm happy ~~we preempted your question~~ you asked! Check out our [Rich Presence Best Practices](#DOCS_BEST_PRACTICES/) guide for a rundown on how to make your integration the best that it can be!
