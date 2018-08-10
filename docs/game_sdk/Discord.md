# Discord

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Making a game? Need a whole bunch of fancy APIs to help make it great and your players' lives a breeze? Look no further! The Discord GameSDK is an easy drop-in SDK to help you manage all the hard things that come with making a game. Well, all the hards things about coding it at least. Interpersonal communication skills are on you (have you heard of this cool chat app called Discord?).

OK, cool, so how's it work?

## General Structure

At a high level, the Discord GameSDK has a class, `Discord`. This class is in charge of the creation of a few "manager" sub-classes. They are:

- `ActivitiesManager` - for Rich Presence and game invites
- `RelationshipsManager` - for users' social relationships across Discord, including friends list
- `ImagesManager` - for getting data about images on Discord, like user avatars or chat images
- `UsersManager` - for fetching user data for a given id and the current user
- `LobbiesManager` - for multiplayer lobbies
- `NetworkManager` - for all your networking layer needs
- `ApplicationManager` - for retrieving a user's OAuth2 bearer token, locale, and current game branch
- `StorageManager` - for saving game data to the disk and the cloud
- `OverlayManager` - for interacting with Discord's built-in overlay

Each one of these managers contain a number of methods and events used to interact with Discord in the context of the manager. For example, `RelationshipsManager` has a function called `filter()`, which lets you pare down a user's inter-Discord relationships based on a boolean condition, like being friends!

## Functions in the SDK

Most functions in the Discord GameSDK, uh, _function_ in a similar way. They take whatever parameters are required for the function to do its job—a user id, the requested size for an image, etc.—and a callback by means of a function pointer. That callback is fired when the function completes its work, letting you handle events without worrying about piping asynchronously-returned data to the right context.

Some functions behave with a normal return behavior; e.g. `RelationshipsManager.Count()` just returns the number directly. Don't worry, it's outlined in the docs.

A quick example with our C# binding:

```c#
var userManager = Discord.CreateUsersManager();
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

### Data Models

```cs
enum Result
{
  Ok,
  ServiceUnavailable,
  InvalidVersion,
  LockFailed,
  InternalError,
  InvalidPaylaod,
  InvalidCommand,
  InvalidPermissions,
  NotFetched,
  NotFound,
  Conflict,
  InvalidSecret,
  InvalidJoinSecret,
  NoEligibleActivity,
  InvalidInvite,
  NotAuthenticated,
  InvalidAccessToken,
  ApplicationMismatch,
  InvalidDataUrl,
  InvalidBase64,
  NotFiltered,
  LobbyFull,
  InvalidLobbySecret,
  InvalidFilename,
  InvalidFileSize,
  InvalidEntitlement,
  NotInstalled,
  NotRunning
};

enum LogLevel
{
  Error = 1,
  Warning,
  Info,
  Debug
};

// CreateFlags are a set of flags that tell Discord to do different things on initialization
// Each flag below has been documented with what it tells Discord to do
enum CreateFlags
{
  // Keep it simple and default. Default values:
  // DRM: Require Discord to be running to play. SDK will close the game, open Discord, and then relaunch the game
  Default = 0,

  // Tells the SDK not to close the game if Discord is not running
  // You probably want to ship with this flag on other platforms
  NoRequireDiscord
};
```

### Methods

```cs
Discord.Core Create(Int64 clientId, CreateFlags flags);
// Creates an instance of Discord with your client id
// This is the overlord of all things Discord. We like to call her Nelly
// In C# land, you can just `new` up an instance of the Discord class with these parameters

void Destroy();
// Destroys the instance. Wave goodbye, Nelly!
// You monster.
// Called Dispose() in C# land

void SetLogHook(LogLevel level, MyCallbackFunction callback);
// Registers a logging callback function with a minimum level of message to receive
// The callback function has a signature of void MyCallbackFunction(LogLevel level, string message)

void RunCallbacks();
// Runs all pending callbacks
// Put this in your game's main event loop, like Update() in Unity
// That way the first thing your game does is check for any new info from Discord
```

There are also methods to create managers, which control the data that pertain to their respective names. For brevity's sake, these managers all have a `Destroy()` (`Dispose()` in C# land) function that kills the instance. Now I won't have to repeat myself:

```cs
var ActivitiesManager = Discord.CreateActivitiesManager();
var RelationshipsManager = Discord.CreateRelationshipsManager();
var ImagesManager = Discord.CreateImagesManager();
var UsersManager = Discord.CreateUsersManager();
var LobbiesManager = Discord.CreateLobbiesManager();
var NetworkManager = Discord.CreateNetworkManager();
var OverlayManager = Discord.CreateOverlayManager();
var ApplicationsManager = Discord.CreateApplicationsManager();
var StorageManager = Discord.CreateStorageMaager();
```

### Callbacks

```cs
OnReady += () =>
{
  // Fires when Discord is connected and ready to roll!
};
```
