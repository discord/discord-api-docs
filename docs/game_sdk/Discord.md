# Discord

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

Are you making a game? Need a whole bunch of fancy APIs to help make it great and your players' lives a breeze? Look no further! The Discord GameSDK is an easy drop-in SDK to help you manage all the hard things that come with making a game. Well, all the hards things about coding it, at least. Interpersonal communication skills are on you (have you heard of this cool chat app called Discord?).

OK, cool, so how's it work?

## General Structure

At a high level, the Discord GameSDK has a class, `Discord`. This class is in charge of the creation of a few "manager" sub-classes. They are:

- `AchievementManager` - for achievements!
- `ActivityManager` - for Rich Presence and game invites
- `ApplicationManager` - for retrieving a user's OAuth2 bearer token, locale, and current game branch
- `ImageManager` - for getting data about images on Discord, like user avatars or chat images
- `LobbyManager` - for multiplayer lobbies
- `NetworkManager` - for all your networking layer needs
- `OverlayManager` - for interacting with Discord's built-in overlay
- `RelationshipManager` - for users' social relationships across Discord, including friends list
- `StorageManager` - for saving game data to the disk and the cloud
- `StoreManager` - for all things entitlements and SKUs, including IAP functionality
- `UserManager` - for fetching user data for a given id and the current user
- `VoiceManager` - to make use of Discord's awesome voice chat

Each one of these managers contains a number of methods and events used to interact with Discord in the context of the manager. For example, `RelationshipManager` has a function called `Filter()`, which lets you pare down a user's inter-Discord relationships based on a boolean condition, like being friends!

## Functions in the SDK

Most functions in the Discord GameSDK, uh, _function_ in a similar way. They take whatever parameters are required for the function to do its job—a user id, the requested size for an image, etc.—and a callback by means of a function pointer. That callback is fired when the function completes its work, letting you handle events without worrying about piping asynchronously-returned data to the right context.

Some functions behave with a normal return behavior; e.g., `RelationshipManager.Count()` just returns the number directly. Don't worry, it's outlined in the docs.

A quick example with our C# binding:

```c#
var userManager = discord.GetUserManager();

// Return via callback
userManager.GetUser(290926444748734465, (Discord.Result result, ref Discord.User otherUser) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine(otherUser.Username);
    Console.WriteLine(otherUser.Id);
  }
});


// Return normally
userManager.OnCurrentUserUpdate += () =>
{
    var currentUser = userManager.GetCurrentUser();
        Console.WriteLine(currentUser.Username);
        Console.WriteLine(currentUser.Discriminator);
        Console.WriteLine(currentUser.Id);
    };
});
```

## Environment Variables

Discord passes a number of environment variables down to the SDK. These are accessed by various methods in the SDK and can be changed for local testing by changing the value in your local environment.

###### SDK Environment Variables

| name                   | method                                                                                  | description                                                                                                  |
|------------------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| DISCORD_INSTANCE_ID    | [Local Testing](#DOCS_GAME_SDK_SDK_STARTER_GUIDE/testing-locally-with-two-clients)      | the locally running instance of Discord to connect to; allows you to choose between multiple running clients |
| DISCORD_ACCESS_TOKEN   | [ApplicationManager.GetOAuth2Token()](#DOCS_GAME_SDK_APPLICATIONS/get-oauth2-token)     | the connected user's bearer token                                                                            |
| DISCORD_CURRENT_LOCALE | [ApplicationManager.GetCurrentLocale](#DOCS_GAME_SDK_APPLICATIONS/get-current-locale)   | the language that Discord is in for the connected user                                                       |
| DISCORD_CURRENT_BRANCH | [ApplicationManager.GetCurrentBranch()](#DOCS_GAME_SDK_APPLICATIONS/get-current-branch) | the branch of the running application that the user has launched                                             |
| DISCORD_STORAGE_PATH   | [StorageManager.GetPath()](#DOCS_GAME_SDK_STORAGE/get-path)                             | the path to which Discord will save files if you're using the StorageManager                                 |

## Error Handling

Debugging is a pain, so before we get into the meat of the SDK, we want to make sure you're prepared for when things go awry. Within the Discord core is a function called `SetLogHook()`. It takes a `level`, which is the minimum level of log message you want to listen to, and a callback function:

```cs
public void LogProblemsFunction(Discord.LogLevel level, string message)
{
  Console.WriteLine("Discord:{0} - {1}", level, message);
}

discord.SetLogHook(Discord.LogLevel.Debug, LogProblemsFunction);
```

You should begin your integration by setting up this callback to help you debug. Helpfully, if you put a breakpoint inside the callback function you register here, you'll be able to see the stack trace for errors you run into (as long as they fail synchronously). Take the guesswork out of debugging, or hey, ignore any and all logging by setting a callback that does nothing. We're not here to judge.

## Data Models

###### Result Enum

| Code | value                           | description                                                                                     |
|------|---------------------------------|-------------------------------------------------------------------------------------------------|
| 0    | Ok                              | everything is good                                                                              |
| 1    | ServiceUnavailable              | Discord isn't working                                                                           |
| 2    | InvalidVersion                  | the SDK version may be outdated                                                                 |
| 3    | LockFailed                      | an internal error on transactional operations                                                   |
| 4    | InternalError                   | something on our side went wrong                                                                |
| 5    | InvalidPayload                  | the data you sent didn't match what we expect                                                   |
| 6    | InvalidCommand                  | that's not a thing you can do                                                                   |
| 7    | InvalidPermissions              | you aren't authorized to do that                                                                |
| 8    | NotFetched                      | couldn't fetch what you wanted                                                                  |
| 9    | NotFound                        | what you're looking for doesn't exist                                                           |
| 10   | Conflict                        | user already has a network connection open on that channel                                      |
| 11   | InvalidSecret                   | activity secrets must be unique and not match party id                                          |
| 12   | InvalidJoinSecret               | join request for that user does not exist                                                       |
| 13   | NoEligibleActivity              | you accidentally set an `ApplicationId` in your `UpdateActivity()` payload                      |
| 14   | InvalidInvite                   | your game invite is no longer valid                                                             |
| 15   | NotAuthenticated                | the internal auth call failed for the user, and you can't do this                               |
| 16   | InvalidAccessToken              | the user's bearer token is invalid                                                              |
| 17   | ApplicationMismatch             | access token belongs to another application                                                     |
| 18   | InvalidDataUrl                  | something internally went wrong fetching image data                                             |
| 19   | InvalidBase64                   | not valid Base64 data                                                                           |
| 20   | NotFiltered                     | you're trying to access the list before creating a stable list with `Filter()`                  |
| 21   | LobbyFull                       | the lobby is full                                                                               |
| 22   | InvalidLobbySecret              | the secret you're using to connect is wrong                                                     |
| 23   | InvalidFilename                 | file name is too long                                                                           |
| 24   | InvalidFileSize                 | file is too large                                                                               |
| 25   | InvalidEntitlement              | the user does not have the right entitlement for this game                                      |
| 26   | NotInstalled                    | Discord is not installed                                                                        |
| 27   | NotRunning                      | Discord is not running                                                                          |
| 28   | InsufficientBuffer              | insufficient buffer space when trying to write                                                  |
| 29   | PurchaseCancelled               | the user, canceled the purchase flow                                                                |
| 30   | InvalidGuild                    | Discord guild does not exist                                                                    |
| 31   | InvalidEvent                    | the event you're trying to subscribe to does not exist                                          |
| 32   | InvalidChannel                  | Discord channel does not exist                                                                  |
| 33   | InvalidOrigin                   | the origin header on the socket does not match what you've registered (you should not see this) |
| 34   | RateLimited                     | you are calling that method too quickly                                                         |
| 35   | OAuth2Error                     | the OAuth2 process failed at some point                                                         |
| 36   | SelectChannelTimeout            | the user, took too long selecting a channel for an invite                                        |
| 37   | GetGuildTimeout                 | took too long trying to fetch the guild                                                         |
| 38   | SelectVoiceForceRequired        | push to talk is required for this channel                                                       |
| 39   | CaptureShortcutAlreadyListening | that push to talk shortcut is already registered                                                |
| 40   | UnauthorizedForAchievement      | your application cannot update this achievement                                                 |
| 41   | InvalidGiftCode                 | the gift code is not valid                                                                      |
| 42   | PurchaseError                   | something went wrong during the purchase flow                                                   |
| 43   | TransactionAborted              | purchase flow aborted because the SDK is being torn down                                        |

###### LogLevel Enum

| value   | description                    |
|---------|--------------------------------|
| Error   | Log only errors                |
| Warning | Log warnings and errors        |
| Info    | Log info, warnings, and errors |
| Debug   | Log _all_ the things!          |

###### CreateFlags Enum

| value            | description                                                         |
|------------------|---------------------------------------------------------------------|
| Default          | Requires Discord to be running to play the game                     |
| NoRequireDiscord | Does not require Discord to be running; use this on other platforms |

## Create

Creates an instance of Discord to initialize the SDK. This is the overlord of all things Discord. We like to call her Nelly.

Returns a new `Discord`.

###### Parameters

| name     | type        | description                                         |
|----------|-------------|-----------------------------------------------------|
| clientId | Int64       | your application's client id                        |
| flags    | CreateFlags | the creation parameters for the SDK, outlined above |

###### Example

```
// c++ land
discord::Core* core{};
discord::Core::Create(53908232506183680, DiscordCreateFlags_Default, &core);

// c# land
var discord = new Discord(53908232506183680, (UInt64)Discord.CreateFlags.Default);
```

## Destroy

Destroys the instance. Wave goodbye, Nelly! You monster. In C# land, this is `Dispose()`.

> info
> The C++ binding does not include a `destroy()` method, as the destructor for the Core does the work for you.

Returns `void`.

###### Parameters

None

###### Example

```cs
discord.Dispose();
```

## SetLogHook

Registers a logging callback function with the minimum level of message to receive. The callback function should have a signature of:

```
MyCallbackFunction(LogLevel level, string message);
```

Returns `void`.

###### Parameters

| name     | type     | description                                 |
|----------|----------|---------------------------------------------|
| level    | LogLevel | the minimum level of an event to log           |
| callback | function | the callback function to catch the messages |

###### Example

```cs
public void LogProblemsFunction(Discord.LogLevel level, string message)
{
  Console.WriteLine("Discord:{0} - {1}", level, message);
}

discord.SetLogHook(Discord.LogLevel.Debug, LogProblemFunctions);
```

## RunCallbacks

Runs all pending SDK callbacks. Put this in your game's main event loop, like `Update()` in Unity. That way, the first thing your game does is check for any new info from Discord.

This function also serves as a way to know that the local Discord client is still connected. If the user closes Discord while playing your game, `RunCallbacks()` will return/throw `Discord.Result.NotRunning`.

In C and C++, this function returns `Discord.Result`. In C#, it returns `void` and will throw a `Discord.Result` error if something went wrong.

###### Parameters

None

###### Example

```cs
void Update()
{
  discord.RunCallbacks();
}
```

## GetActivityManager

Fetches an instance of the manager for interfacing with activities in the SDK.

Returns an `ActivityManager`.

###### Parameters

None

###### Example

```cs
var activityManager = discord.GetActivityManager();
```

## GetRelationshipManager

Fetches an instance of the manager for interfacing with relationships in the SDK.

Returns a `RelationshipManager`.

###### Parameters

None

###### Example

```cs
var relationshipManager = discord.GetRelationshipManager();
```

## GetImageManager

Fetches an instance of the manager for interfacing with images in the SDK.

Returns an `ImageManager`.

###### Parameters

None

###### Example

```cs
var imageManager = discord.GetImageManager();
```

## GetUserManager

Fetches an instance of the manager for interfacing with users in the SDK.

Returns an `UserManager`.

###### Parameters

None

###### Example

```cs
var userManager = discord.GetUserManager();
```

## GetLobbyManager

Fetches an instance of the manager for interfacing with lobbies in the SDK.

Returns a `LobbyManager`.

###### Parameters

None

###### Example

```cs
var lobbyManager = discord.GetLobbyManager();
```

## GetNetworkManager

Fetches an instance of the manager for interfacing with networking in the SDK.

Returns a `NetworkManager`.

###### Parameters

None

###### Example

```cs
var networkManager = discord.GetNetworkManager();
```

## GetOverlayManager

Fetches an instance of the manager for interfacing with the overlay in the SDK.

Returns an `OverlayManager`.

###### Parameters

None

###### Example

```cs
var overlayManager = discord.GetOverlayManager();
```

## GetApplicationManager

Fetches an instance of the manager for interfacing with applications in the SDK.

Returns an `ApplicationManager`.

###### Parameters

None

###### Example

```cs
var applicationManager = discord.GetApplicationManager();
```

## GetStorageManager

Fetches an instance of the manager for interfacing with storage in the SDK.

Returns a `StorageManager`.

###### Parameters

None

###### Example

```cs
var storageManager = discord.GetStorageManager();
```

## GetStoreManager

Fetches an instance of the manager for interfacing with SKUs and Entitlements in the SDK.

Returns a `StoreManager`.

###### Parameters

None

###### Example

```cs
var storeManager = discord.GetStoreManager();
```

## GetVoiceManager

Fetches an instance of the manager for interfacing with voice chat in the SDK.

Returns a `VoiceManager`.

###### Parameters

None

###### Example

```cs
var voiceManager = discord.GetVoiceManager();
```

## GetAchievementManager

Fetches an instance of the manager for interfacing with achievements in the SDK.

Returns an `AchievementManager`.

###### Parameters

None

###### Example

```cs
var achievementManager = discord.GetAchievementManager();
```
