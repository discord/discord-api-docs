# SDK Starter Guide

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

Welcome to the Discord GameSDK! We're glad you made it. This SDK is here to solve all your problems if your problems include finding an awesome SDK to help develop your game. Our SDK is like Clippy, if Clippy were built on a modern tech stack, talked less, and was an awesome game development SDK.

## Step 0 - Some Notes

Before we get off to the races, a couple of notes on the SDK:

- All strings in the SDK are UTF8 strings
  - Make sure you've converted properly if necessary!
- The SDK is **_NOT_** threadsafe!
  - Being callback-based, we thought that'd be confusing and inconsistent

Now you know, and knowing is half the battle.

## Step 1 - Get the Thing

I know you're already convinced, so let's begin. First, get the SDK. Here it is:

- [Discord Game SDK](https://dl-game-sdk.discordapp.net/2.5.6/discord_game_sdk.zip)

There are a few things in there, but let's quickly talk about what the SDK actually _is_. Inside the `lib/` folder, you'll see `x86/` and `x86_64/` that have some `.lib`, `.bundle`, and `.dll` files. These are the things you want to distribute with your game.

These files are comprised of two parts: a "stub", and fallback modules. What that means is that when everything is running smoothly, the DLLs will just call back to the local running Discord client to do the heavy lifting. If, however, something is wrong, like a breaking change, the files also include "fallback" modules that reflect the native SDK modules in Discord at the time that version of the SDK was published. TLDR - you don't need to worry about breaking changes.

## Get Set Up

Next, we need to set up the application for your game. An application is the base "entity" in Discord for your game; it's what all the builds, branches, SKUs, store pages, assets, etc., will be filed under.

Head over to our [developer site](https://discord.com/developers/) and create an account/login if you haven't yet. The first thing we're going to do is create a Team. Teams are groups of developers working together on applications; you should create a team for your organization at [https://discord.com/developers/teams](https://discord.com/developers/teams). You can invite other users to join your team and work on applications together with you.

Now that your team is created, you'll want to make an application. To do so, click on "Applications" at the top of the page and create an application. Make sure you pick your newly-created team in the `Team` dropdown. You want your team to own the application; this unlocks store functionality! Now that your app is made let's dive into some more setup.

> warn
> If you're integrating our SDK into an already-released game, there's a good chance that we may _already have_ an application in our database for your game! Reach out to our [Dev Support](https://dis.gd/devsupport) to learn more

First, we'll need to set an OAuth2 redirect URL. You can add `http://127.0.0.1` in there for now; this powers some behind-the-scenes stuff you don't need to worry about.

Next, copy the **Client ID** at the top of the page. This id also referred to as an "application id", is your game's unique identifier across Discord. Keep it handy!

While you're here, head to the "OAuth2" section of your application and add `http://127.0.0.1` as a redirect URI for your application. This will allow us to do the OAuth2 token exchange within the Discord client.

Now we're gonna start coding. Didn't think we'd get there so fast, did ya? _Think again!_ The next sections are code primers for the main languages of the SDK: C#, C, and C++. They'll get you up and running with the most basic examples, and then you're off to the races.

## Code Primer - Unity (Csharp)

- Open up that SDK zip that you downloaded.
- Copy the contents of the `lib/` folder to `Assets/Plugins` in your Unity project
- Copy the contents of the `csharp/` folder to `Assets/Plugins/DiscordGameSDK`

From there, you'll be able to reference functions in the DLL within your scripts. A basic example of a script can be found [in this example repo](https://github.com/msciotti/discord-game-sdk-test-apps/tree/master/cs-examples/unity-examples/Assets). In this example, we attach our `DiscordController.cs` script to the Main Camera object of the default created scene. We then instantiate the SDK with:

```cs
/*
    Grab that Client ID from earlier
    Discord.CreateFlags.Default will require Discord to be running for the game to work
    If Discord is not running, it will:
    1. Close your game
    2. Open Discord
    3. Attempt to re-open your game
    Step 3 will fail when running directly from the Unity editor
    Therefore, always keep Discord running during tests, or use Discord.CreateFlags.NoRequireDiscord
*/
var discord = new Discord.Discord(CLIENT_ID, (UInt64)Discord.CreateFlags.Default);
```

You're now free to use other functionality in the SDK! Make sure to call `discord.RunCallbacks()` in your main game loop; that's your `Update()` function.

You're ready to go! Check out the rest of the documentation for more info on how to use the other pieces of the SDK. See an example of everything it can do in `examples/Program.cs` in the SDK zip file.

## Code Primer - Non-Unity Projects (Csharp)

- Open up that SDK zip that you downloaded.
- Create a folder in your project directory called `DiscordGameSDK` and copy the contents of the `csharp/` folder to it
- Build your solution, then place the `.dll` in the directory of the `.exe` (either x86 or x86_64 version depending on your compile platform). If you compile for Any CPU you may need to perform additional wrapping around DLL importing (like setting the DLL directory dynamically) to make sure you load the correct DLL.

From there, you'll be able to reference functions in the DLL within your scripts. We then instantiate the SDK with:

```cs
/*
    Grab that Client ID from earlier
    Discord.CreateFlags.Default will require Discord to be running for the game to work
    If Discord is not running, it will:
    1. Close your game
    2. Open Discord
    3. Attempt to re-open your game
    Step 3 may fail when running directly from your editor
    Therefore, always keep Discord running during tests, or use Discord.CreateFlags.NoRequireDiscord
*/
var discord = new Discord.Discord(CLIENT_ID, (UInt64)Discord.CreateFlags.Default);
```

You're now free to use other functionality in the SDK! Make sure to call `discord.RunCallbacks()` in your main game loop; that's your `Update()` function.

You're ready to go! Check out the rest of the documentation for more info on how to use the other pieces of the SDK. See an example of everything it can do in `examples/Program.cs` in the SDK zip file.

## Code Primer - Unreal Engine (C)

Before jumping into the C binding, a word of caution. If you are using Unreal Engine 3 or need to support an older version of Visual Studio, you may at first see some unexpected crashes due to compile configurations. The way to fix this is to wrap the include statement for the Discord GameSDK header file like so:

```c
#pragma pack(push, 8)
#include "discord_game_sdk.h"
#pragma pack(pop)
```

This should let you use the SDK without any further crashes. Now, on with the show!

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

DiscordCreate(DISCORD_VERSION, &params, &app.core);
```

- Make sure to call `core->run_callbacks(core, 0)` in your game loop.

You're ready to go! Check out the rest of the documentation for more info on how to use the other pieces of the SDK. See an example of everything it can do in `examples/c/main.c` in the SDK zip file.

## Code Primer - Unreal Engine 4 (Cpp)

Open up that SDK zip that you downloaded. There are a couple of things in there that we care about. The first is the contents of the `cpp/` folder. These are our source files, including headers and `.cpp` file, that we'll need to reference in our build script. The second is the contents of the `lib/` folder. In this walkthrough, we'll assume that we only care about win64 for ease of use.

First, you'll want to copy the header files and `.cpp` files to a folder somewhere in your project directory. For ease of a quickstart example, you can put them right inside your `Source/your-project-name` folder; I'd put them in a containing folder called something like `discord-files/`.

Second, you'll want to copy the `.dll` and `.lib` files from the `lib/x86_64` folder of the downloaded zip. These files should be put in `your-project-name/Binaries/Win64/`. For win32, take the files from `x86/` and put them in `your-project-name/Binaries/Win32`.

Next, we need to link these files within our project so that we can reference them. If you open up your project's `.sln` file in Visual Studio, you'll find a file called `your-project-name.Build.cs`. We're going to add the following lines of code to that file:

```cpp
/*
    ABSOLUTE_PATH_TO_DISCORD_FILES_DIRECTORY will look something like this:

    "H:\\Unreal Projects\\gamesdktest\\Source\\gamesdktest\\discord-files\\"

    You should get this value programatically
*/
PublicIncludePaths.Add(ABSOLUTE_PATH_TO_DISCORD_FILES_DIRECTORY)

/*
    ABSOLUTE_PATH_TO_LIB_FILE will look something like this:

    "H:\\Unreal Projects\\gamesdktest\\Binaries\\Win64\\discord_game_sdk.dll.lib"

    You should get this value programatically
*/
PublicAdditionalLibraries.Add(ABSOLUTE_PATH_TO_LIB_FILE)
```

Now that we've got our new dependencies properly linked, we can reference them in our code. In this example, we're going to make a new `Pawn` class called `MyPawn`. It will look something like this:

```cpp
#include "MyPawn.h"
#include "discord-files/discord.h"

discord::Core* core{};

AMyPawn::AMyPawn()
{
 	// Set this pawn to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

// Called when the game starts or when spawned
void AMyPawn::BeginPlay()
{
	Super::BeginPlay();
    /*
        Grab that Client ID from earlier
        Discord.CreateFlags.Default will require Discord to be running for the game to work
        If Discord is not running, it will:
        1. Close your game
        2. Open Discord
        3. Attempt to re-open your game
        Step 3 will fail when running directly from the Unreal Engine editor
        Therefore, always keep Discord running during tests or use Discord.CreateFlags.NoRequireDiscord
    */
	auto result = discord::Core::Create(461618159171141643, DiscordCreateFlags_Default, &core);
	discord::Activity activity{};
	activity.SetState("Testing");
	activity.SetDetails("Fruit Loops");
	core->ActivityManager().UpdateActivity(activity, [](discord::Result result) {

    });
}

// Called every frame
void AMyPawn::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	::core->RunCallbacks();
}

// Called to bind functionality to input
void AMyPawn::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
}
```

Make sure you've got `core->RunCallbacks()` going every frame!

You're ready to go! Check out the rest of the documentation for more info on how to use the other pieces of the SDK. See an example of everything it can do in `examples/cpp/main.cpp` in the SDK zip file.

## Testing Locally with Two Clients

> info
> Value from environment variable `DISCORD_INSTANCE_ID`

While integrating the Discord GameSDK, you will probably find yourself wanting to test functionality between two game clients locally, be it for networking, Rich Presence, etc.

We also know that getting a test build of a game on two separate machines can be both difficult and cumbersome. So, we've got a solution for you! By using system environment variables, you can tell the SDK in a certain game client to connect to a specific Discord client. Here's how it works:

1. Download Discord Canary. This is our most updated build, and is good to develop against: [Windows](https://discord.com/api/download/canary?platform=win) - [Mac](https://discord.com/api/download/canary?platform=osx)
2. Download a second Discord Build. Here's our Public Test Build: [Windows](https://discord.com/api/download/ptb?platform=win) - [Mac](https://discord.com/api/download/ptb?platform=osx)
3. Open up two Discord clients. We recommend you develop against Discord Canary, so you can use PTB or Stable for your test account
4. Login with two separate users. Make sure any test account is added to the application's App Whitelist in the portal!

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

If you can check all those boxes, you are doing great! You're well-equipped to venture forth into the rest of the SDK and make full use of its myriad of functionality. So, onwards, to game development!

If you ever need help during the process, you can always reach out to us at our [Dev Support](https://dis.gd/devsupport). If you have feedback on things you'd like to see added to the SDK, drop us a line at our [Dev Feedback](https://dis.gd/devfeedback).

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
- [Store](#DOCS_GAME_SDK_STORE/)
- [Discord Voice](#DOCS_GAME_SDK_DISCORD_VOICE/)
- [Achievements](#DOCS_GAME_SDK_ACHIEVEMENTS/)
