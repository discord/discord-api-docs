# Introducing Rich Presence

>danger
>Rich Presence is live! If you are testing a game integration with Rich Presence, other users will be able to see it. Please create a private test account and do not join any public servers while testing your integration.

How easy is it for people to play your game together? With Rich Presence from Discord—a new feature in the ever-expanding GameBridge suite—it just got so easy, a ~~caveman~~ Junior Dev could do it.

Rich Presence is currently in a private alpha phase intended for game integrations and not yet ready for general public access. If you are a game developer interested in getting early access, mention Rich Presence in an [application to our Gamebridge program](https://discordapp.com/gamebridge) and we'll keep it in mind when we review your application.

## So, what is it?

Rich Presence allows you to leverage the totally overhauled "Now Playing" section in a Discord user's profile to help people play your game together. Rich game data—including duration, score, current boss or map, and so much more—lives inside Discord. You can spectate a friend's game directly from their profile popout, or party up via beautiful chat embeds with real-time information about open party slots and the party's in-game status. No more exchanging usernames and friend codes, or wondering if there's room for you to join. Rich Presence is a living invitation to play together, or to watch your friends kick butt.

## So, how does it work?

>Note: While the SDK for Rich Presence is not currently publically available, the documentation here accurately reflects any eventual implementation you would need to do. That means that you can have your codebase all ready to be hooked up to the SDK before having access to it.

We worked hard to make using Discord's Rich Presence system as easy as possible. All you need is our header file—what you will interact with—and our library—where we did all the hard work for you—and you are ready to roll!

In the header file, you'll find five event-emitting callbacks:

1. `ready()`
2. `errored()`
3. `disconnected()`
4. `joinGame()`
5. `spectateGame()`

These five callbacks make up the entirety of what you need to implement. Behind the scenes, we do all the heavy lifting for you.

## A note on testing and Game Detection

In order to test your Rich Presence integration locally, you and your testers will need to make sure that your game client is detected by Discord. If your game is not automatically detected, presence data will not be shown. To detect your game, go to User Settings -> Games -> Add it! and select your application from the dropdown list. Every user working with your local development build will need to follow these steps in order for Discord to detect their presence.

If you don't see Rich Presence data in your profile while testing, make sure you have the correct process selected for Game Detection. Also make sure you don't have multiple isntances of Discord running—if you do, your presence might be changing in one of those!

If you are having issues with your release build not being detected, send us an email at [gamedevs@discordapp.com](mailto:gamedevs@discordapp.com) and we'll add it to our database for you.

If you're testing on your own, we recommend [downloading two separate release channels](https://discordapp.com/download) of the Discord desktop client. You can log into the stable, public test, and canary builds with separate credentials, making testing easier for a single developer.

## Whatcha dooooooin'?

The first step in implementing Rich Presence is [creating an application](https://discordapp.com/developers/applications/me). Once you've created your application, note and save your `Client ID`. You will need this to initialize the SDK; this value will be referred to throughout this documentation as both `client_id` and `application_id`. Next, scroll down to the bottom of your application's page and hit the button that says "Enable Rich Presence". This will allow you to upload assets to your dashboard for later use.

 Now we're ready to get coding! To begin, you'll register your callback functions to the five `DiscordEventHandlers` and then call `Discord_Initialize()` with your `APPLICATION_ID`. If your game is distributed via Steam, you should also pass your application's Steam ID so Discord can launch your game through Steam:

```cpp
void InitDiscord()
{
    DiscordEventHandlers handlers;
    memset(&handlers, 0, sizeof(handlers));
    handlers.ready = handleDiscordReady;
    handlers.disconnected = handleDiscordDisconnected;
    handlers.errored = handleDiscordError;
    Discord_Initialize(APPLICATION_ID, &handlers, 1, STEAM_APP_ID);
}
```

The `Discord_Initialize()` function also has a parameter `autoRegister`. Marking this field as true lets Discord register an application protocol in the format `discord-[application_id]://`—or use Steam's browser protocol if you gave us a Steam ID—so that joining and spectating will work even when the game is closed. Once the game launches, we'll call your `joinGame()` and `spectateGame()` functions to continue the flow. If your game needs custom parameters on launch, such as an auth ticket, you'll need to register your own protocol on the system. More information on this coming soon. For now, just ask us!

The core of Discord's Rich Presence SDK is the `Discord_UpdatePresence()` function. This is what sends your game data up to Discord to be seen and used by others. You should call `Discord_UpdatePresence()` with the necessary data in your `ready()` callback and any time something in the presence payload changes. The payload is outlined in detail in a later section, but for now, here's an example of a super rich presence:

```cpp
void UpdatePresence()
{
    DiscordRichPresence discordPresence;
    discordPresence.state = "In a Group";
    discordPresence.details = "Competitive | In a Match";
    discordPresence.endTimestamp = time(nullptr) + ((60 * 5) + 23);
    discordPresence.partyId = GameEngine.GetPartyId();
    discordPresence.partySize = 3;
    discordPresence.partyMax = 6;
    discordPresence.matchSecret = "4b2fdce12f639de8bfa7e3591b71a0d679d7c93f";
    discordPresence.spectateSecret = "e7eb30d2ee025ed05c71ea495f770b76454ee4e0";
    discordPresence.instance = 1;
    Discord_UpdatePresence(&discordPresence);
}
```

>info
>In order for a user to send a join or spectate invite, Discord needs a `joinSecret` or `spectateSecret`. This means you should call `Discord_UpdatePresence()` even when a user is not actively in a group or game match. That way, Discord has all the data it needs to properly route a party request to other players.

## Knock knock! Who's there? You!

Let's get into the meat of the callback functions:

`ready()` lets you know when your game is connected to Discord, usually on a first connection or a reconnect.

`joinGame()` and `spectateGame()` are up to you to handle and implement in your game's infrastructure. For these functions, we send you back either the `joinSecret` or `spectateSecret`, depending on which action happens. You should then reverse your secret back into usable data and handle it as necessary. More on what those secrets are and how to generate them later.

`disconnected()` and `errored()` don't actually require you to do anything. If for some reason your client disconnects from Discord or encounters an error, we'll reconnect automatically. However, we will send you the events if you'd like to display them, log them, or ignore the problem like a good developer.

The header file also contains the `Discord_RunCallbacks()` function. This invokes any pending callbacks from Discord on the calling thread (it's thread safe!), giving you ultimate control over your events. If you aren't sure what to do, just call it once per frame in your game's main loop. As Captain Planet says, the power is _yours_!

## Movin' with the payload

Earlier, we showed an example payload of some really rich presence data. The full list of fields is as follows:

```cpp
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

*Ooo, let's break it down!*

`state` is the user's current party status. This could be "In Queue," "Looking to Play," "Looking for More," "Playing Solo," or any other states you want to denote.

`details` is the first line of data displayed under the name of your game, and should provide others—in conjunction with `state`—a clear understanding of what the user is currently doing. For example, "Competitive | Match Type (Score)".

`startTimestamp` is the Unix timestamp (in seconds) at which the player entered their most recent instanced state, for example, a new game. Providing `startTimestamp` will cause the timer in the profile to count up from `00:00`.

`endTimestamp` is also a Unix timestamp (in seconds), but denotes at what time the player's current instanced state will end. Send this if you want us to do the math and display the timer as counting down to `00:00` from your timestamp.

`largeImageKey` and `smallImageKey` are the key values for the artwork you have uploaded to your Developer Dashboard (more on that later!). `largeImageText` and `smallImageText` are the mouseover tooltips on the corresponding artwork.

`partyId` is the id for the player's current party, lobby, or other differentiated group. Discord uses this to power party status and render dynamic party slots in the invite embeds. If you have multiple ids to choose from—for example, a lobby with two teams inside that lobby—`partyId` should reflect the group the player will join from the invite.

`partySize` is the current size of the player's party. Sending `0` is the same as omitting it.

`partyMax` is the maximum allowed size for a party. Sending `0` means there is no limit on the size.

`matchSecret` works in tandem with `instance` to power the "Notify Me" piece of Rich Presence. When you send us a `matchSecret` with `instance` set to `true`, we know a further change in `matchSecret` means the player is done with whatever they were doing, or finally gave up on the Water Temple, and we can send a notification to anyone who subscribed.

`spectateSecret` is a unique, non-guessable string that powers the spectate button in a user's profile and the ability to invite a channel to spectate the user's game. More on secrets in the next section.

`joinSecret` is a unique, non-guessable string that allows a user to post a game invitation in chat. When this is sent along with a `partyId`, `partySize`, and `partyMax`, the user's chat bar will show them that they can invite friends to join their game. More on secrets in the next section.

`instance` helps Discord be smart about notifications and display. Setting it to `true` tells us to show the "Notify me" button and alert whoever clicks it when the `matchSecret` changes.

>warn
>The "Notify Me" feature is coming soon. If you want your game to support it on release, you should hook up the necessary fields now.

We've chosen the fields based on common data between the most popular games on Discord, but they are by no means rigid. Play with them to fit the data you'd like to display for your game! You can also omit any of the fields, and the UI will gracefully adjust. Below is an image that shows which fields go where when sending a full data payload with spectating and notifications enabled; use it for reference for your own data:

![](rp-profile-view.png)

## Secrets, secrets are...fun!

Security is of the utmost importance to us here at Discord, and we know it is for you, too. That's why we want to make sure that you properly understand `matchSecret`, `joinSecret`, and `spectateSecret` so that your game data is safe and secure over the wire.

Secrets are obfuscated data of your choosing. They could be match ids, player ids, lobby ids, or your favorite color in hexadecimal over and over. You should send us data that someone else's game client would need to join or spectate their friend. If you can't or don't want to support those actions, you don't need to send us secrets. In fact, you could skip the rest of this section, but we all know that the real magic is _learning_.

Your secrets on Discord need to be well-kept. When someone wants to spectate a friend's game, for example, they hit the "Spectate" button in their friend's profile. Discord checks to make sure their permissions are in order, and then passes their client the `spectateSecret` so the callback can fire on their machine, and their game client can handle it.

To keep security on the up and up, Discord requires that you properly hash/encode/encrypt/put-a-padlock-on-and-swallow-the-key-but-wait-then-how-would-you-open-it your secrets. There are more than a couple of ways of going about this, but here's a couple points to muse over:

#### What does your game require to join a party, spectate a match, or other actions available through Rich Presence?

The secrets you send us can be whatever data you want, so make life easy for yourself! If you need a `matchId`, `playerId`, `lobbyPassword`, and `bloodType` (we hope not), hash all of those up as your secret. Then, when you reverse the hash on callback, you'll have everything you need to complete the action.

#### How good is your security?

Just because you're doing it doesn't necessarily mean you're doing it in the best—and safest—way possible. Create your secrets on your server, not on your client, and consider using strong encryption methods (anyone seen my private key?) to keep your data safe. [Sodium](https://download.libsodium.org/doc/), a multi-language, cross-compilable crypto library, is a great place to start. It's available straight from [GitHub](https://github.com/jedisct1/libsodium), as a [pre-built library](https://download.libsodium.org/doc/installation/) for some common editors, and on [NuGet](https://www.nuget.org/packages?q=libsodium). It's so easy to use, even this example in C isn't scary:

```cpp
#include <sodium.h>

unsigned char* myMessage = "a super secret message for Discord";
printf("Original text: %s \n \n", myMessage);

int messageLength = strlen(myMessage) + 1; // Accounting for null terminator byte
int ciphertextLength = crypto_secretbox_MACBYTES + messageLength;

unsigned char nonce[crypto_secretbox_NONCEBYTES]; // Buffer for your nonce
unsigned char key[crypto_secretbox_KEYBYTES];     // Buffer for your key
unsigned char* ciphertext = malloc(ciphertextLength);

randombytes_buf(nonce, sizeof nonce);
randombytes_buf(key, sizeof key);
crypto_secretbox_easy(ciphertext, myMessage, messageLength, nonce, key);

char* hex = malloc(2 * ciphertextLength + 1);
int hexLength = 2 * ciphertextLength + 1;
sodium_bin2hex(hex, hexLength, ciphertext, ciphertextLength);
printf("Encrypted: %s \n \n", hex);
```

We encrypt the data, and then convert it to hex for the sake of readability. Your key is then stored as `hex`, which is what you should send to Discord. And to unencrypt on callback:

```cpp
unsigned char* decrypted = malloc(messageLength);
unsigned char* bin = malloc(ciphertextLength);
sodium_hex2bin(bin, ciphertextLength, hex, hexLength, "", NULL, NULL);
crypto_secretbox_open_easy(decrypted, bin, ciphertextLength, nonce, key);
printf("Decrypted: %s", decrypted);

free(ciphertext); // Don't forget to free up the memory when you're done!
free(decrypted);
free(hex);
free(bin);
```

Running this code snippet gives the following output:

```
Original text: a super secret message for Discord

Encrypted: 1a4a00a71fac73a645f9bbbc09b089b986210a50c17a926543384c7548f1742d2f92d8d635967264196372fbf0363c879b76b8

Decrypted: a super secret message for Discord
```

Discord maintains the highest standards of security for data, so we require that you hold yourself to those same standards if you wish to implement these secrets. Remember, it's for your benefit as well! We wouldn't want evildoers ending up in places they shouldn't be.

## There's a time and a place for everything

All fields in the `DiscordRichPresence` object are entirely optional. Anything you choose to omit simply won't be displayed; the UI will dynamically adapt from the full Rich Presence object all the way down to the basic presence view. We highly encourage you to include as many fields as you can to make your game as attractive and interactive for other players as possible. However, if you choose to be a bit more selective, here's a handy table for what each piece of Rich Presence requires:

###### Rich Presence Field Requirements

| Field          | Custom Artwork | Notification | Spectating | Joining  |
| :------------: | :------------: | :----------: | :--------: | :------: |
| state          |                |              |            |          |
| details        |                |              |            |          |
| startTimestamp |                |              |            |          |
| endTimestamp   |                |              |            |          |
| largeImageKey  | x              |              |            |          |
| smallImageKey  | x              |              |            |          |
| largeImageText | x              |              |            |          |
| smallImageText | x              |              |            |          |
| partyId        |                |              |            | x        |
| partySize      |                |              |            | x        |
| partyMax       |                |              |            | x        |
| matchSecret    |                | x            |            |          |
| joinSecret     |                |              |            | x        |
| spectateSecret |                |              | x          |          |
| instance       |                | x            |            |          | |

## Your New Developer Dashboard

Included with the launch of Rich Presence is an overhaul of Discord's Developer Dashboard. We want to make Rich Presence and the rest of the GameBridge Suite as easy as possible to use. Our first step is helping you ditch your CDN. You're welcome.

OK, well, not entirely. But! Discord _will_ host any and all artwork that you need to have the very richest of presences. Upload an image, tag it with a key—preferrably one you can remember—and **bam**. It's ready for Rich Presence use. Head over to your [applications page](#MY_APPLICATIONS/top) to check it out!

## It's always better when we're together

Discord's Rich Presence system is an awesome way to get gamers together in your game. We've done the heavy lifting on the engineering side to make it easy-as-pie for you to implement. So get to coding and make your game's presence as rich as it can be!
