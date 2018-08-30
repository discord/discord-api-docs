# Discord

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Making a game? Need a whole bunch of fancy APIs to help make it great and your players' lives a breeze? Look no further! The Discord GameSDK is an easy drop-in SDK to help you manage all the hard things that come with making a game. Well, all the hards things about coding it at least. Interpersonal communication skills are on you (have you heard of this cool chat app called Discord?).

OK, cool, so how's it work?

## General Structure

At a high level, the Discord GameSDK has a class, `Discord`. This class is in charge of the creation of a few "manager" sub-classes. They are:

- `ActivityManager` - for Rich Presence and game invites
- `RelationshipManager` - for users' social relationships across Discord, including friends list
- `ImageManager` - for getting data about images on Discord, like user avatars or chat images
- `UserManager` - for fetching user data for a given id and the current user
- `LobbyManager` - for multiplayer lobbies
- `NetworkManager` - for all your networking layer needs
- `ApplicationManager` - for retrieving a user's OAuth2 bearer token, locale, and current game branch
- `StorageManager` - for saving game data to the disk and the cloud
- `OverlayManager` - for interacting with Discord's built-in overlay

Each one of these managers contain a number of methods and events used to interact with Discord in the context of the manager. For example, `RelationshipManager` has a function called `filter()`, which lets you pare down a user's inter-Discord relationships based on a boolean condition, like being friends!

## Functions in the SDK

Most functions in the Discord GameSDK, uh, _function_ in a similar way. They take whatever parameters are required for the function to do its job—a user id, the requested size for an image, etc.—and a callback by means of a function pointer. That callback is fired when the function completes its work, letting you handle events without worrying about piping asynchronously-returned data to the right context.

Some functions behave with a normal return behavior; e.g. `RelationshipManager.Count()` just returns the number directly. Don't worry, it's outlined in the docs.

A quick example with our C# binding:

```c#
var userManager = Discord.CreateUserManager();
userManager.GetCurrentUser((Discord.Result result, ref Discord.User currentUser) =>
{
 Console.WriteLine(currentUser.username);
 Console.WriteLine(currentUser.ID);
});
```

## Discord

Discord is the interface through which your game talks to...Discord...obfuscating all the hard stuff and getting you to what you want quickly and easily.

## Error Handling

Debugging is a pain, so before we get into the meat of the SDK, we want to make sure you're prepared for when things go awry. Within the Discord core is a function called `SetLogHook()`. It takes a `level`, which is minimum level of log message you want to listen to, and a callback function:

```cs
enum LogLevel
{
  // Tell me what crashed
  Error = 1,

  // Tell me when I might be doing something bad
  Warning,

  // Tell me the details of each call I make
  Info,

  // Tell me ALL the things
  Debug
};

public void LogProblemsFunction(LogLevel level, string message);

SetLogHook(LogLevel level, LogProblemsFunction callback);
```

You should begin your integration by setting up this callback to help you debug. Helpfully, if you put a breakpoint inside the callback function you register here, you'll be able to see the stack trace for errors you run into (as long as they fail synchronously). Take the guess work out of debugging, or hey, ignore any and all logging by setting a callback that does nothing. We're not here to judge.

## Models

####### Result Enum

| Value               | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| Ok                  | everything is good                                                             |
| ServiceUnavailable  | Discord isn't working                                                          |
| InvalidVersion      | the SDK version may be outdated                                                |
| LockFailed          | an internal error on transactional operations                                  |
| InternalError       | something on our side went wrong                                               |
| InvalidPayload      | the data you sent didn't match what we expect                                  |
| InvalidCommand      | that's not a thing you can do                                                  |
| InvalidPermissions  | you aren't authorized to do that                                               |
| NotFetched          | couldn't fetch what you wanted                                                 |
| NotFound            | what you're looking for doesn't exist                                          |
| Conflict            | ?                                                                              |
| InvalidSecret       | activity secrets must be unique                                                |
| InvalidJoinSecret   | the secret you're using to connect is wrong                                    |
| NoEligibleActivity  | ?                                                                              |
| InvalidInvite       | your game invite is no longer valid                                            |
| NotAuthenticated    | the internal auth call failed for the user, and you can't do this              |
| InvalidAccessToken  | the user's bearer token is invalid                                             |
| ApplicationMismatch | ?                                                                              |
| InvalidDataUrl      | ?                                                                              |
| InvalidBase64       | ?                                                                              |
| NotFiltered         | you're trying to access the list before creating a stable list with `Filter()` |
| LobbyFull           | the lobby is full                                                              |
| InvalidLobbySecret  | the secret you're using to connect is wrong                                    |
| InvalidFilename     | ?                                                                              |
| InvalidFileSize     | ?                                                                              |
| InvalidEntitlement  | the user does not have the right entitlement for this game                     |
| NotInstalled        | Discord is not installed                                                       |
| NotRunning          | Discord is not running                                                         |

###### LogLevel Enum

| Value   | Description                    |
| ------- | ------------------------------ |
| Error   | Log only errors                |
| Warning | Log warnings and errors        |
| Info    | Log info, warnings, and errors |
| Debug   | Log _all_ the things!          |

###### CreateFlags Enum

| Value            | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| Default          | Requires Discord to be running to play the game                     |
| NoRequireDiscord | Does not require Discord to be running, use this on other platforms |

## Create

Creates an instance of Discord to initialize the SDK. This is the overlord of all things Discord. We like to call her Nelly.

Returns a new `Discord`.

###### Parameters

| name     | type        | description                                         |
| -------- | ----------- | --------------------------------------------------- |
| clientId | Int64       | your application's client id                        |
| flags    | CreateFlags | the creation parameters for the SDK, outlined above |

###### Example

```cpp
Discord.Core core;
core->Create(53908232506183680, Discord.CreateFlags.Default, &core);
```

```cs
var discord = new Discord(53908232506183680, Discord.CreateFlags.Default);
```

## Destroy

Destroys the instance. Wave goodbye, Nelly! You monster. In C# land, this is `Dispose()`.

Returns `void`.

###### Parameters

None

###### Example

```cpp
core->Destroy();
```

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
| -------- | -------- | ------------------------------------------- |
| level    | LogLevel | the minimum level of event to log           |
| callback | function | the callback function to catch the messages |

###### Example

```cs
public void LogProblemsFunction(LogLevel level, string message);
SetLogHook(LogLevel level, LogProblemsFunction callback);
```

## RunCallbacks

Runs all pending SDK callbacks. Put this in your game's main event loop, like `Update()` in Unity. That way, the first thing your game does is check for any new info from Discord.

Returns `void`.

###### Parameters

None

###### Example

```cs
void Update() {
  discord.RunCallbacks();
}
```

## CreateActivityManager

Creates the manager for interfacing with activities in the SDK.

Returns an `ActivityManager`.

###### Parameters

None

###### Example

```cs
var activityManager = Discord.CreateActivityManager();
```

## CreateRelationshipManager

Creates the manager for interfacing with relationships in the SDK.

Returns a `RelationshipManager`.

###### Parameters

None

###### Example

```cs
var relationshipManager = Discord.CreateRelationshipManager();
```

## CreateImageManager

Creates the manager for interfacing with images in the SDK.

Returns an `ImageManager`.

###### Parameters

None

###### Example

```cs
var imageManager = Discord.CreateImageManager();
```

## CreateUserManager

Creates the manager for interfacing with users in the SDK.

Returns an `UserManager`.

###### Parameters

None

###### Example

```cs
var userManager = Discord.CreateUserManager();
```

## CreateLobbyManager

Creates the manager for interfacing with lobbies in the SDK.

Returns a `LobbyManager`.

###### Parameters

None

###### Example

```cs
var lobbyManager = Discord.CreateLobbyManager();
```

## CreateNetworkManager

Creates the manager for interfacing with networking in the SDK.

Returns an `NetworkManager`.

###### Parameters

None

###### Example

```cs
var networkManager = Discord.CreateNetworkManager();
```

## CreateOverlayManager

Creates the manager for interfacing with the overlay in the SDK.

Returns an `OverlayManager`.

###### Parameters

None

###### Example

```cs
var overlayManager = Discord.CreateOverlayManager();
```

## CreateApplicationManager

Creates the manager for interfacing with applications in the SDK.

Returns an `ApplicationManager`.

###### Parameters

None

###### Example

```cs
var applicationManager = Discord.CreateApplicationManager();
```

## CreateStorageManager

Creates the manager for interfacing with storage in the SDK.

Returns an `StorageManager`.

###### Parameters

None

###### Example

```cs
var storageManager = Discord.CreateStorageManager();
```

## OnReady

Fires when Discord is connected and ready to roll!

###### Parameters

None

###### Example

```cs
OnReady += () =>
{
  Console.WriteLine("Let's do this!");
};
```
