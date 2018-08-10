# Activities

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Looking to integrate Rich Presence into your game? No need to manage multiple SDKs—this one does all that awesome stuff, too!. Delight your players with the ability to post game invites in chat and party up directly from Discord. Surface interesting live game data in their profile and on the Games Tab for their friends, encouraging them to group up and play together.

For more detailed information and documentation around the Rich Presence feature set and integration tips, check out our [Rich Presence Documentation](https://discordapp.com/developers/docs/rich-presence/how-to).

### Data Models

```cs
struct Activity
{
  ActivityType Type;

  // ApplicationId is a read-only field
  // It's used by Discord to help filter users playing the same game in the RelationshipsManager
  // Setting it in an UpdateActivity() call does nothing. It will succeed, but this field will not change
  Int64 ApplicationId;
  string Name;
  string State;
  string Details;
  ActivityTimestamps Timestamps;
  ActivityAssets Assets;
  ActivityParty Party;
  ActivitySecrets Secrets;
  bool Instance;
};

enum ActivityType
{
  Playing,
  Streaming,
  Listening,
  Watching
};

struct ActivityTimestamps
{
  Int64 Start;
  Int64 End;
};

struct ActivityAssets
{
  string LargeImage;
  string LargeText;
  string SmallImage;
  string SmallText;
};

struct ActivityParty
{
  string Id;
  PartySize size;
};

struct PartySize
{
  Int32 CurrentSize;
  Int32 MaxSize;
}

struct ActivitySecrets
{
  string Match;
  string Join;
  string Spectate;
};

struct User
{
  Int32 Id;
  string Username;
  string Discriminator;
  string Avatar;
  bool Bot;
};

enum ActivityJoinRequestReply
{
  No,
  Yes,
  Ignore,
};

enum ActivityActionType
{
  Join = 1,
  Spectate
};
```

### Methods

```cs
void Register(string command);
// Registers a command by which Discord can launch your game
// Example: register("my-amazing_game://run/12345 --full-screen --all-the-hacks");

void RegisterSteam(UInt32 steamId);
// Same as above, but takes a game's steamId
// Registers it to `steam://rungameid://<id>`
// Example: register_steam("9912378");

void UpdateActivity(Activity activity, (Discord.Result result) =>
{
  // Sets a user's presence to some newer, richer presence of your choosing
});

void ClearActivity((Discord.Result result) =>
{
  // Clears a user's presence
});

void Respond(Int64 userId, ActivityJoinRequestReply reply, (Discord.Result result) =>
{
  // Responds to an Ask to Join request
});

void InviteUser(Int64 userId, ActivityActionType type, string content, (Discord.Result result) =>
{
  // Invites a user to join you to play or spectate with an optional message
});

void AcceptInvite(Int64 userId, (Discord.Result result) =>
{
  // Accepts an invitation from a given userId
});
```

### Callbacks

```cs
OnActivityJoin += (string joinSecret) =>
{
  // Fires when a user completes an Ask to Join flow
  // Or joins via a chat invite
};

OnActivitySpectate =+ (string spectateSecret) =>
{
  // Same as above, but with spectate
};

OnActivityJoinRequest += (User user) =>
{
  // Fires when you receive an Ask to Join request from a user
};

OnActivityInvite += (ActivityActionType type, User user, Activity activity) =>
{
  // Fires when you receive a game invitation from another user
};
```

### Example: Inviting a User to a Game

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

// Update user's activity for your game.
// Party and secrets are vital.
var activity = new Discord.Activity
{
  State = "olleh",
  Details = "foo details",
  Timestamps =
  {
      Start = 5,
      End = 6,
  },
  Assets =
  {
      LargeImage = "foo largeImageKey",
      LargeText = "foo largeImageText",
      SmallImage = "foo smallImageKey",
      SmallText = "foo smallImageText",
  },
  Party = {
      Id = "foo partyID",
      Size = {
          CurrentSize = 1,
          MaxSize = 4,
      },
  },
  Secrets = {
      Match = "foo matchSecret",
      Join = "foo joinSecret",
      Spectate = "foo spectateSecret",
  },
  Instance = true,
};

activitiesManager.UpdateActivity(activity, result =>
{
  Console.WriteLine("Update Activity {0}", result);

  // Send an invite to another user for this activity.
  // Receiver should see an invite in their DM.
  // Use a relationship user's ID for this.
  activitiesManager
    .InviteUser(
        364843917537050999,
        Discord.ActivityActionType.Join,
        "",
        inviteUserResult =>
        {
            Console.WriteLine("Invite User {0}", inviteUserResult);
        }
    );
});
```
