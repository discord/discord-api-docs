# SDK Starter Guide

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Welcome to the Store SDK! We're glad you made it. This SDK is here to solve all your problems, if your problems include finding an awesome SDK to help develop your game. Our SDK is like Clippy, if Clippy were built on a modern tech stack, talked less, and was an awesome game development SDK.

So, what's it do?

## Features

- Native C++ and C# bindings
  - Feel right at home in our code
- Authentication
  - Information about the current player
  - OAuth2 token for current player, to use against Discord's HTTP API
- Activities (a.k.a Rich Presence)
  - Spectate
  - Request to Join
  - Direct game invites
  - Rich profile data
- Relationships (Friends)
  - Getting a user's Discord relationships, even implicit ones
    - Users with whom they interact a lot, but aren't officially friends
  - Filtering relationships to build a friends list
  - Getting basic information about any Discord user (by id)
  - Getting the current activity of a user relationship
- Images
  - Getting image data for a user's avatar for in-game display
- Lobbies
  - Creating, updating, deleting, joining, and leaving multiplayer lobbies
  - Getting and setting metadata on lobbies and lobby members
  - Sending and receiving chat messages between lobby members
- Networking
  - TCP-like API, but messsage-oriented UDP infrastructure
    - "Reliable" channels for must-receive data, like loot drops!
    - "Unreliable" channels for eventually consistent data, like players' positions
  - P2P-like connections, routed through Discord's servers — No IP leaks!
  - Encrypted
- Overlay Interactions
  - Open, lock, and unlock the Discord overlay
  - Bring up an invite modal in the overlay for your players to invite their friends to play together
- File Storage
  - Save game data to a special local filepath
  - We sync that to the _C L O U D_
- DRM
  - Built into our amazing build tool, Dispatch!
  - Or, do your own entitlement checking!

**Coming Real Soon**

- In-app Purchase Support

## Step 0 - Some Notes

Before we get off to the races, a couple notes on the SDK:

- All strings in the SDK are UTF8 strings
  - Make sure you've converted properly if necessary!
- The SDK is **_NOT_** threadsafe!
  - Being callback-based, we thought that'd be confusing and inconsistent

And now you know, and knowing is half the battle.

## Step 1 - Get the Thing

I know you're already convinced, so let's begin. First, get the SDK. Right now, the SDK is not publically available. If you are one of our developer partners, you'll have access to it; if not, feel free to keep reading for the sake of learning! And hey, if you've got an awesome game, and _want_ to be one of our developer partners, [drop us a message](https://dis.gd/devstoreform).

There's a few things in there, but let's quickly talk about what the SDK actually _is_. Inside the `lib/` folder, you'll see `x86/` and `x86_64/` that have some `.lib`, `.bundle`, and `.dll` files. You'll also notice that those files are _really_ small, just a couple hundred kilobytes. What these are are stubs for the Discord SDK. These are the things you want to distribute with your game. When you initialize the SDK, these stubs will call back to the locally installed Discord app to actually do the things your game needs. That means that the SDK will launch Discord if it's not already launched, or give you an error if Discord is not installed.

We designed the SDK this way with two things in mind. First, it allows you as a developer to distribute the Discord SDK on other platforms. As long as the player has Discord running, the SDK will work no matter where the game is launched from. Secondly, it lets you get the latest updates without having to actually download and ship a new SDK version—all the updates will happen in the actual Discord client!

You'll also notice that there is a `runtime/` folder. Inside that folder are _actual_ full SDKs, not stubs. If you place these in certain root directories:

- **Windows**: `%USERPROFILE%\.discord_game_sdk\`
- **macOS/Linux**: `~/.discord_game_sdk/`

The SDK will prioritize these DLLs instead of using the stub to call out to the Discord client. That way, if we've got a new build of the SDK you want to test locally, or we gave you a debug build for debugging help, you can stick it in those folders and use it temporarily.

## Get Set Up

> During the Beta period, we ask that you DO NOT create your own OAuth2 application. When you are ready to begin development, let someone on the Discord team know, and we will create an application for you and assign it to your account. We have some special flags that we need to enable on your behalf.

Next, we need to set up the application for your game. An application is the base "entity" in Discord for your game; it's what all the builds, branches, SKUs, store pages, assets, etc. will be filed under. Ask a Discord team member to get an application created for you. Once that's done, head on over to our [developer site](https://discordapp.com/developers/) and click into the application created for you. Now, make it your own by changing it's name and giving it a new icon! There, all pretty.

First, we'll need to set an OAuth2 redirect URL. You can add `http://127.0.0.1` in there for now; this powers some behind-the-scenes stuff you don't need to worry about.

Next, enabled Rich Presence for your application (it's a big button near the bottom of the page). This gives you access to a whitelist of users that you can set and invite to test your SDK. When you're ready to test with users **that are not the direct owner of the application**, you'll need to add them to this list.

Finally, copy the **Client ID** at the top of the page. This id, also referred to as an "application id", is your game's unique identifier across Discord. Keep it handy!

Now we're gonna start coding. Didn't think we'd get there so fast, did ya? _Think again!_ The next sections are code primers for the main languages of the SDK: C#, C, and C++. They'll get you up and running with the most basic examples, and then you're off to the races.

## Code Primer - Unity (Csharp)

- Open up that SDK zip that you downloaded.
- Copy the contents of the `lib/` folder to `Assets/Plugins` in your Unity project
- Copy the contents of the `csharp/` folder to `Assets/Plugins/DiscordGameSDK`
- It's dangerous to go alone—take this small code block with you (to start)!

```cs
// Grab that Client ID from earlier
var discord = new Discord.Discord(CLIENT_ID, Discord.CreateFlags.Default);
```

- Make sure to call `discord.RunCallbacks()` in your main game loop; for Unity, that's your `Update()` function.

During development, Discord will focus itself to ask for permission when you initialize the SDK. This will happen once a week (the duration of our OAuth2 tokens) for now, but will not happen at all in production.

You're ready to go! Check out the rest of the documentation for more info on how to use the other pieces of the SDK. See an example of everything it can do in `examples/Program.cs` in the SDK zip file.

## Code Primer - Unreal Engine 4 (C)

> info
> An Unreal plugin is planned, however, you can use either the C or C++ bindings with Unreal today.

- Open up that SDK zip that you downloaded.
- Copy the contents of the `lib/` folder to the best location within your project for DLLs.
- Copy the contents of the `c/` folder to your source directory
- It's dangerous to go alone—take this small code block with you (to start)!

```c
struct Application {
    struct IDiscordCore* core;
    struct IDiscordUsers* users;
};

struct Application app;
// Don't forget to memset or otherwise initialize your classes!
memset(&app, 0, sizeof(app));

struct IDiscordCoreEvents events;
memset(&events, 0, sizeof(events));

struct DiscordCreateParams params;
params.client_id = CLIENT_ID;
params.flags = DiscordCreateFlags_Default;
params.events = &events;
params.event_data = &app;

DiscordCreate(0, &params, &app.core);
```

- Make sure to call `core->run_callbacks(core, 0)` in your game loop.

During development, Discord will focus itself to ask for permission when you initialize the SDK. This will happen once a week (the duration of our OAuth2 tokens) for now, but will not happen at all in production.

You're ready to go! Check out the rest of the documentation for more info on how to use the other pieces of the SDK. See an example of everything it can do in `examples/c/main.c` in the SDK zip file.

## Code Primer - Unreal Engine 4 (Cpp)

> The C++ API shape is still in flux. Expect future revisions to not return discord::Result for every method and a shift from out parameters to return values.

- Open up that SDK zip that you downloaded.
- Copy the contents of the `lib/` folder to the best location within your project for DLLs.
- Copy the contents of the `cpp/` folder to your source directory
- It's dangerous to go alone—take this small code block with you (to start)!

```cpp
// Don't forget to memset or otherwise initialize your classes!
discord::Core* core{};
auto result = discord::Core::Create(CLIENT_ID, DiscordCreateFlags_Default, &core);
```

- Make sure to call `core->RunCallbacks()` in your game loop

During development, Discord will focus itself to ask for permission when you initialize the SDK. This will happen once a week (the duration of our OAuth2 tokens) for now, but will not happen at all in production.

You're ready to go! Check out the rest of the documentation for more info on how to use the other pieces of the SDK. See an example of everything it can do in `examples/cpp/main.cpp` in the SDK zip file.

## Testing Locally with Two Clients

While integrating the Discord GameSDK, you will probably find yourself wanting to test functionality between two game clients locally, be it for networking, Rich Presence, etc.

We also know that getting a test build of a game on two separate machines can be both difficult and cumbersome. So, we've got a solution for you! By using system environment variables, you can tell the SDK in a certain game client to connect to a specific Discord client. Here's how it works:

1. Download Discord Canary. This is our most updated build, and is good to develop against: [Windows](https://discordapp.com/api/download/canary?platform=win) - [Mac](https://discordapp.com/api/download/canary?platform=osx)
2. Download a second Discord Build. Here's our Public Test Build: [Windows](https://discordapp.com/api/download/ptb?platform=win) - [Mac](https://discordapp.com/api/download/ptb?platform=osx)
3. Open up two Discord clients. We recommend you develop against Discord Canary, so you can use PTB or Stable for your test account
4. Log in with two separate users. Make sure any test account is added to the application's App Whitelist in the portal!

Now, in your game code, you can tell the SDK which client to connect to via the environment variable `DISCORD_INSTANCE_ID` **before initializing the SDK**. The value of the variable corresponds to the order in which you opened the clients, so `0` would connect to the first opened client, `1` the second, etc.

###### Environment Variable Example

```cs
// This machine opened Discord Canary first, and Discord PTB second

// This makes the SDK connect to Canary
System.Environment.SetEnvironmentVariable("DISCORD_INSTANCE_ID", "0");
var discord = new Discord(applicationId, Discord.CreateFlags.Default);

// This makes the SDK connect to PTB
System.Environment.SetEnvironmentVariable("DISCORD_INSTANCE_ID", "1");
var discord = new Discord(applicationId, Discord.CreateFlags.Default);
```

This will set the environment variable only within the context of the running process, so don't worry about messing up global stuff.

> danger
> If you test with this, make sure to remove this code before pushing a production build. It will interfere with the way that Discord launches games for users.

## Section Checklist

Think of these like those end of section review pages from your history textbooks, but we won't give you a pop quiz. I promise. By now, you should have the following:

- The SDK downloaded
- An application created, and a Client ID you're keeping handy
- Rich Presence enabled on that application
- An OAuth2 redirect URL added to that application
- The proper libraries, DLLs, and header files in the right places for your game
- A working SDK, via the small code snippets above

If you can check all those boxes, you are doing great! You're well-equipped to venture forth into the rest of the SDK and make full use of it's myriad of functionality. So, onwards, to game development!

## Where...do I go...

Oh, yeah. Pseudo Table of Contents:

- [The Core - Start Here!](#DOCS_GAME_SDK_DISCORD/)
- [Activities, a.k.a. Rich Presence](#DOCS_GAME_SDK_ACTIVITIES/)
- [Relationships](#DOCS_GAME_SDK_RELATIONSHIPS/)
- [Users](#DOCS_GAME_SDK_USERS/)
- [Images](#DOCS_GAME_SDK_IMAGES/)
- [Lobbies](#DOCS_GAME_SDK_LOBBIES/)
- [Networking](#DOCS_GAME_SDK_NETWORKING/)
- [Storage](#DOCS_GAME_SDK_STORAGE/)
- [Applications](#DOCS_GAME_SDK_APPLICATIONS/)
- [Overlay](#DOCS_GAME_SDK_OVERLAY/)

```

```
