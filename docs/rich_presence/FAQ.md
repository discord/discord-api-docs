# Rich Presence FAQ

> danger
> The SDK that this documentation references, [Discord-RPC](https://github.com/discord/discord-rpc), has been deprecated in favor of our new [Discord GameSDK](#DOCS_GAME_SDK_SDK_STARTER_GUIDE/). Replacement functionality for the Rich Presence SDK can be found in the [Activity Manager](#DOCS_GAME_SDK_ACTIVITIES/) of that SDK. This documentation can be referenced for education but does not entirely reflect the new SDK.

Below are answers to some common questions about integrating Rich Presence with your game. If you don't see your question answered here, feel free to reach out to [gamedevs@discord.com](mailto:gamedevs@discord.com) for more help.

#### Q: I see "Playing MyGame", but no Rich Presence data.

There are a couple of things that could be going on:

- If you're running two instances of the Discord client, check both!
- Double-check that your `Discord_Initialize()` function is correct.

Throughout development, make sure you have your `errored()` and `disconnected()` callbacks hooked up for debugging. You can open up the console in Discord and look for errors pertaining to `SET_ACTIVITY` for more information as well.

#### Q: I'm not seeing Spectate buttons on my profile.

Make sure you applied for approval! If you want the Spectate button on your players' profiles, we require your integration to go through an approval process. If you have applied and have been approved and still don't see the buttons, check your Discord console for errors.

#### Q: What happens if someone has more than one game running that supports Rich Presence?

Due to recent changes in our infrastructure for support of multi-activities, the behavior of multiple connected Rich Presence apps has changed from what it was before. Previously, whichever application was focused would be the presence that was shown. With the recent changes, the application that connected _first_ is now displayed.

However, invite functionality across multiple connected applications now works no matter which app is displayed on a user's profile. For example, if you are hosting a Spotify listening party, playing Game A that allows you to send Join invites, and playing Game B that allows you to send Spectate invites, you'll be able to send invites to all three simultaneously!

#### Q: What if someone looking at my profile or an invite doesn't own the game?

Anyone can see your profile data, whether they own the game or not. They'll only be able to interact with chat invites or profile buttons if they own the game and have launched it at least once. Otherwise, the invite/button tooltip will show "Game Not Detected".

#### Q: Do join invitations allow players to select the number of open slots?

Currently, the SDK does not support this. Party slot information is determined by the party data you sent in your presence payload.

#### Q: Can I send images via the payload rather than uploading them to my Developer Dashboard?

Unfortunately, the SDK does not support this feature right now. However, we hear your desires! We know that a lot of games, like customization-heavy RPGs, would benefit greatly from being able to programmatically upload assets. It may be something we tackle in the future.

#### Q: Can I change something in the SDK for my own purposes?

Go nuts! The SDK is open source by design. If you need or want to change something for the purposes of your specific integration—like changing our JSON parser or changing all of the variable names to the names of your pets—go ahead and tinker to your heart's content.

#### Q: OK—I've got it working! Now, how do I make my integration look _awesome_?

I'm happy ~~we preempted your question~~ you asked! Check out our [Rich Presence Best Practices](#DOCS_RICH_PRESENCE_BEST_PRACTICES/) guide for a rundown on how to make your integration the best that it can be!
