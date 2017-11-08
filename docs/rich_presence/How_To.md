# Introducing Rich Presence

How easy is it for people to play your game together? With Rich Presence from Discord—a new feature in the ever-expanding GameBridge suite—it just got so easy, a ~~caveman~~ Junior Dev could do it.

Rich Presence is now **live**! If you are testing a game integration with Rich Presence, other users will be able to see it. Please create a private test account and do not join any public servers while testing your integration.

>info
>If you want to stay up to date with the latest developer news from Discord and learn about new and exciting ways to work with us, sign up for our [developer newsletter](https://discordapp.com/dev-newsletter).

## So, what is it?

Rich Presence allows you to leverage the totally overhauled "Now Playing" section in a Discord user's profile to help people play your game together. Rich game data—including duration, score, current boss or map, and so much more—lives inside Discord. You can spectate a friend's game directly from their profile popout, or party up via beautiful chat embeds with real-time information about open party slots and the party's in-game status. No more exchanging usernames and friend codes, or wondering if there's room for you to join. Rich Presence is a living invitation to play together, or to watch your friends kick butt.

## Step 0: Get the SDK

You've decided you want to integrate with Rich Presence. Of course you did! It's awesome—just ask us. You can get the SDK from our [GitHub repository](https://github.com/discordapp/discord-rpc). Grab a release build or use our build scripts, and check out the examples while you're there! We support C, C++, Unity, and Unreal Engine out of the box. If we don't have a release type that fits your development needs, roll your own! It's all open-source.

>warn
>Our precompiled libraries depend on the [Visual C++ Redistributable for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48145). If you distribute your game on Steam, make sure to check that box in your common redistributable settings.

## So, how does it work?

We worked hard to make using Discord's Rich Presence system as easy as possible. All you need is our header file—what you will interact with—and our library—where we did all the hard work for you—and you are ready to roll!

In the header file, you'll find six event-emitting callbacks:

1. `ready()`
2. `errored()`
3. `disconnected()`
4. `joinGame()`
5. `spectateGame()`
6. `joinRequest()`

These six callbacks make up the entirety of what you need to implement. Behind the scenes, we do all the heavy lifting for you.

The header file also contains the `Discord_RunCallbacks()` function. This invokes any pending callbacks from Discord on the calling thread (it's thread safe!).

## Initialization

The first step in implementing Rich Presence is [creating an application](https://discordapp.com/developers/applications/me). Once you've created your application, note and save your `Client ID`. You will need this to initialize the SDK; this value will be referred to throughout this documentation as both `client_id` and `application_id`. Next, scroll down to the bottom of your application's page and hit the button that says "Enable Rich Presence". This will allow you to upload assets to your dashboard for later use.

 To begin, you'll register your callback functions to the six `DiscordEventHandlers` and then call `Discord_Initialize()` with your `APPLICATION_ID`. If your game is distributed via Steam, you should also pass your application's Steam ID so Discord can launch your game through Steam:

 ###### SDK Initialization Example

```c
void InitDiscord()
{
    DiscordEventHandlers handlers;
    memset(&handlers, 0, sizeof(handlers));
    handlers.ready = handleDiscordReady;
    handlers.errored = handleDiscordError;
    handlers.disconnected = handleDiscordDisconnected;
    handlers.joinGame = handleDiscordJoinGame;
    handlers.spectateGame = handleDiscordSpectateGame;
    handlers.joinRequest = handleDiscordJoinRequest;
    Discord_Initialize(APPLICATION_ID, &handlers, 1, STEAM_APP_ID);
}
```

When you are ready to publish your integration, we recommend digging into the source code of the SDK and copying `discord_register.h`, `discord_register_win.cpp`, `discord_register_osx.m`, and `discord_register_linux.cpp` into your installation and update process. By registering your application protocols on installation and update, your players won't need to run the game before being able to interact with invites, Ask to Join, and spectating in Discord.

## Updating Presence

The core of Discord's Rich Presence SDK is the `Discord_UpdatePresence()` function. This is what sends your game data up to Discord to be seen and used by others. You should call `Discord_UpdatePresence()` any time something important in the presence payload changes. Here's an example:

###### Update Presence Example

```c
void UpdatePresence()
{
    char buffer[256];
    DiscordRichPresence discordPresence;
    memset(&discordPresence, 0, sizeof(discordPresence));
    discordPresence.state = "In a Group";
    sprintf(buffer, "Ranked | Mode: %d", GameEngine.GetMode());
    discordPresence.details = buffer;
    discordPresence.endTimestamp = time(0) + 5 * 60;
    discordPresence.largeImageKey = "canary-large";
    discordPresence.smallImageKey = "ptb-small";
    discordPresence.partyId = GameEngine.GetPartyId();
    discordPresence.partySize = 1;
    discordPresence.partyMax = 6;
    discordPresence.matchSecret = "4b2fdce12f639de8bfa7e3591b71a0d679d7c93f";
    discordPresence.spectateSecret = "e7eb30d2ee025ed05c71ea495f770b76454ee4e0";
    discordPresence.instance = 1;
    Discord_UpdatePresence(&discordPresence);
}
```

###### Update Presence Payload

```c
typedef struct DiscordRichPresence {
    const char* state; /* max 128 bytes */
    const char* details; /* max 128 bytes */
    int64_t startTimestamp;
    int64_t endTimestamp;
    const char* largeImageKey; /* max 32 bytes */
    const char* largeImageText; /* max 128 bytes */
    const char* smallImageKey; /* max 32 bytes */
    const char* smallImageText; /* max 128 bytes */
    const char* partyId; /* max 128 bytes */
    int partySize;
    int partyMax;
    const char* matchSecret; /* max 128 bytes */
    const char* joinSecret; /* max 128 bytes */
    const char* spectateSecret; /* max 128 bytes */
    int8_t instance;
} DiscordRichPresence;
```

###### Update Presence Payload Fields

| parameter      | type    | description                                                               | example                                                    |
| -------------- | ------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| state          | char*   | the user's current party status                                           | "Looking to Play", "Playing Solo", "In a Group"            |
| details        | char*   | what the player is currently doing                                        | "Competitive - Captain's Mode", "In Queue", "Unranked PvP" |
| startTimestamp | int64_t | unix timestamp for the start of the game                                  | 1507665886                                                 |
| endTimestamp   | int64_t | unix timestamp for when the game will end                                 | 1507665886                                                 |
| largeImageKey  | char*   | name of the uploaded image for the large profile artwork                  | "default"                                                  |
| largeImageText | char*   | tooltip for the largeImageKey                                             | "Blade's Edge Arena", "Numbani", "Danger Zone"             |
| smallImageKey  | char*   | name of the uploaded image for the small profile artwork                  | "rogue"                                                    |
| smallImageText | char*   | tootltip for the smallImageKey                                            | "Rogue - Level 100"                                        |
| partyId        | char*   | id of the player's party, lobby, or group                                 | "ae488379-351d-4a4f-ad32-2b9b01c91657"                     |
| partySize      | int     | current size of the player's party, lobby, or group                       | 1                                                          |
| partyMax       | int     | maximum size of the player's party, lobby, or group                       | 5                                                          |
| matchSecret    | char*   | unique hashed string for Spectate and Join                                | MmhuZToxMjMxMjM6cWl3amR3MWlqZA==                           |
| spectateSecret | char*   | unique hased string for Spectate button                                   | MTIzNDV8MTIzNDV8MTMyNDU0                                   |
| joinSecret     | char*   | unique hased string for chat invitations and Ask to Join                  | MTI4NzM0OjFpMmhuZToxMjMxMjM=                               |
| instance       | int8_t  | marks the matchSecret as a game session with a specific beginning and end | 1                                                          |

## Joining

#### Relevant Callbacks:

`joinGame()`
`joinRequest()`

#### Relevant Payload Data:

`partyId`
`partySize`
`partyMax`
`joinSecret`
`matchSecret`

When you send the relevant payload data in the `Discord_UpdatePresence()` call, your player can invite a Discord chat channel to play with them. This invite is tied to the player's party information; if their `partyId` changes, the invite will expire. If their `partySize` and `partyMax` changes, the invite will add, remove, and fill up slots dynamically.

Other Discord users can click "Join" on the invitation. Their game will then launch, and the `joinGame()` callback will fire in their client with the inviting player's `joinSecret`. The client should reverse hash or otherwise unencrypt this secret and match the players together.

### Ask to Join

>warn
>Requires Approval

To enable the Ask to Join button on your players' profiles, you'll need to be approved by us. Submit your integration for approval on your [app's developer dashboard](https://discordapp.com/developers/applications/me). While there, you can also whitelist individual accounts for testing. Those accounts will see an Ask to Join button on their profiles and be able to interact with others' profiles. Non-whitelisted users will not see the button. For an in-depth explanation of what we look for during approval, see the [article in our Help Center](https://support.discordapp.com/hc/).

When Player B clicks the Ask to Join button on Player A's profile, the `joinRequest()` callback fires for Player A, sending the following data:

###### Ask to Join Payload

```c
typedef struct DiscordJoinRequest {
    char userId[24];
    char username[48];
    char avatarUrl[128];
} DiscordJoinRequest;
```

###### Ask to Join Payload Fields

| parameter | type | description |
| --------- | ---- | ----------- |
| userId    | char[24]  | the userId of the player asking to join |
| username  | char[48]  | the username of the player asking to join |
| avatar*   | char[128] | the avatar hash of the player asking to join—see [image formatting](#DOCS_REFERENCE/image-formatting) for how to retrieve the image |

>warn
>`avatar` can be an empty string if the user has not uploaded an avatar to Discord

When it fires, your game should surface this data with a Yes or No choice for Player A to accept whether or not they wish to play with Player B. Then, call `Discord_Respond()` with Player B's `userId` and the appropriate response code:

###### Ask to Join Response Codes

| code | value |
| ---- | ----- |
| DISCORD\_REPLY_NO | 0 |
| DISCORD\_REPLY_YES | 1 |
| DISCORD\_REPLY_IGNORE | 2 |

The Ask to Join request persists for 30 seconds after the request is received, regardless of whether you have called `Discord_RunCallbacks()` within that window. Therefore, keep these two points in mind:

- Ensure you call `Discord_RunCallbacks()` as frequently as possible to ensure your game client is up to date with any data from Discord
- If the player is in a state in which they cannot interact with an Ask to Join request—like in the middle of a match—you should not send a `joinSecret` in the presence payload

## Spectating

>warn
>Requires Approval

To enable the Spectate button on your players' profiles, you'll need to be approved by us. Submit your integration for approval on your [app's developer dashboard](https://discordapp.com/developers/applications/me). While there, you can also whitelist individual accounts for testing. Those accounts will see a Spectate button on their profiles and be able to interact with others' profiles. Non-whitelisted users will not see the button. For an in-depth explanation of what we look for during approval, see the [article in our Help Center](https://support.discordapp.com/hc/).

#### Relevant Callbacks:

`spectateGame()`

#### Relevant Payload Data:

`spectateSecret`
`matchSecret`

When you send the relevant payload data in the `Discord_UpdatePresence()` call, your player will gain the ability to invite a Discord chat channel to spectate their game. This invite is tied to the `matchSecret` and will expire when it changes.

Other Discord users can click "Spectate" on the invitation. Their game will launch, and the `spectateGame()` callback will fire in their client with the original player's `spectateSecret`. The client should reverse hash or otherwise unencrypt this secret and spectate that player's game.

## Secrets

Security is of the utmost importance to us here at Discord, and we know it is for you, too. That's why we want to make sure that you properly understand `matchSecret`, `joinSecret`, and `spectateSecret` so that your game data is safe and secure over the wire.

To keep security on the up and up, Discord requires that you properly hash/encode/encrypt/put-a-padlock-on-and-swallow-the-key-but-wait-then-how-would-you-open-it your secrets.

Secrets are obfuscated data of your choosing. They could be match ids, player ids, lobby ids, etc. You should send us data that someone else's game client would need to join or spectate their friend. If you can't or don't want to support those actions, you don't need to send us secrets.

## Rich Presence Field Requirements

All fields in the `DiscordRichPresence` object are entirely optional. Anything you choose to omit simply won't be displayed; the UI will dynamically adapt from the full Rich Presence object all the way down to the basic presence view. We highly encourage you to include as many fields as you can to make your game as attractive and interactive for other players as possible. However, if you choose to be a bit more selective, here's a handy table for what each piece of Rich Presence requires:

###### Rich Presence Field Requirements

| Field          | Custom Artwork | Notification | Spectating | Joining  | Ask to Join |
| :------------: | :------------: | :----------: | :--------: | :------: | :---------: |
| state          |                |              |            |          |             |
| details        |                |              |            |          |             |
| startTimestamp |                |              |            |          |             |
| endTimestamp   |                |              |            |          |             |
| largeImageKey  | x              |              |            |          |             |
| smallImageKey  | x              |              |            |          |             |
| largeImageText | x              |              |            |          |             |
| smallImageText | x              |              |            |          |             |
| partyId        |                |              |            | x        | x           |
| partySize      |                |              |            | x        | x           |
| partyMax       |                |              |            | x        | x           |
| matchSecret    |                | x            |            |          |             |
| joinSecret     |                |              |            | x        | x           |
| spectateSecret |                |              | x          |          |             |
| instance       |                | x            |            |          |             | |

## Your New Developer Dashboard

Included with the launch of Rich Presence is an overhaul of Discord's Developer Dashboard. We want to make Rich Presence and the rest of the GameBridge Suite as easy as possible to use. Our first step is helping you ditch your CDN. You're welcome.

OK, well, not entirely. But! Discord _will_ host any and all artwork that you need to have the very richest of presences. Upload an image, tag it with a key—preferrably one you can remember—and **bam**. It's ready for Rich Presence use. Head over to your [applications page](#MY_APPLICATIONS/top) to check it out!

>warn
>**Asset keys are automatically normalized to lowercase**. Be mindful of this when referring to them in your code.

## A note on testing and Game Detection

In order to test your Rich Presence integration locally, you and your testers will need to make sure that your game client is detected by Discord. If your game is not automatically detected, presence data will not be shown. To detect your game, go to User Settings -> Games -> Add it! and select your application from the dropdown list. Every user working with your local development build will need to follow these steps in order for Discord to detect their presence.

If you don't see Rich Presence data in your profile while testing, make sure you have the correct process selected for Game Detection. Also make sure you don't have multiple instances of Discord running—if you do, your presence might be changing in one of those!

If you are having issues with your release build not being detected, send us an email at [gamedevs@discordapp.com](mailto:gamedevs@discordapp.com) and we'll add it to our database for you.

If you're testing on your own, we recommend [downloading two separate release channels](https://discordapp.com/download) of the Discord desktop client. You can log into the stable, public test, and canary builds with separate credentials, making testing easier for a single developer.

## So, what now?

Get to coding! We can't wait to see the awesome integration you come up with. If you need some quick questions answered, look no further than our [Rich Presence FAQ](#DOCS_FAQ/). If you want to know how to make your integration the best it can be, read our [Best Practices Guide](#DOCS_BEST_PRACTICES/). If you're ready to release, consult our [Launch Checklist](#DOCS_LAUNCH_CHECKLIST/) and make sure you haven't missed anything!
