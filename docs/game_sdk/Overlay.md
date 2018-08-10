# Overlay

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Discord comes with an awesome built-in overlay, and you may want to make use of it for your game. This manager will help you do just that! It:

- Gives you the current state of the overlay for the user
  - Locked, enabled, unlocked, open, closed, etc.
- Allows you to change that state

### Data Models

```cs
enum ActivityActionType
{
  Join = 1,
  Spectate
};
```

### Methods

```cs
bool IsEnabled();
// Returns if the user currently has the overlay enabled or disabled

bool IsLocked();
// Returns if the overlay is currently locked or unlocked

void SetLocked(bool locked);
// Toggles the overlay to be locked (true) or unlocked (false)

void OpenActivityInvite(ActivityActionType type, (Discord.Result result) =>
{
  // Opens the overlay modal for game invitations
  // Invite users to Join to Spectate your game based on the action type
  // The user receiving the invite will receive an `ActivityManager.OnActivityInvite` callback
});
```

### Callbacks

```cs
OnOverlayLocked += (bool locked) =>
{
  // Fires when the overlay is locked/unlocked
};
```

### Example: Unlock the Overlay

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

var overlayManager = discord.CreateOverlayManager();

overlayManager.OnOverlayLocked += locked => {
  Console.WriteLine("Overlay Locked: {0}", locked);
};
overlayManager.SetLocked(false);
```

### Example: Activate Overlay Invite Modal

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var overlayManager = discord.CreateOverlayManager();

// Invite users to join your game
overlayManager.OpenActivityInvite(ActivityActionType.Join, result => {
  Console.WriteLine("Overlay is now open!");
})
```

And that invite modal looks like this!

![](overlay-invite.gif)
