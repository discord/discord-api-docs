# Activities

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Looking to integrate Rich Presence into your game? No need to manage multiple SDKs—this one does all that awesome stuff, too!. Delight your players with the ability to post game invites in chat and party up directly from Discord. Surface interesting live game data in their profile and on the Games Tab for their friends, encouraging them to group up and play together.

For more detailed information and documentation around the Rich Presence feature set and integration tips, check out our [Rich Presence Documentation](https://discordapp.com/developers/docs/rich-presence/how-to).

## Data Models

###### User Struct

| name          | type   | description                   |
| ------------- | ------ | ----------------------------- |
| Id            | Int64  | the user's id                 |
| Username      | string | their name                    |
| Discriminator | string | the user's unique discrim     |
| Avatar        | string | the hash of the user's avatar |
| Bot           | bool   | if the user is a bot user     |

###### Activity Struct

| name          | type               | description                                                     |
| ------------- | ------------------ | --------------------------------------------------------------- |
| ApplicationId | Int64              | your application id - this is a read-only field                 |
| Name          | string             | name of the application - this is a read-only field             |
| State         | string             | the player's current party status                               |
| Details       | string             | what the player is currently doing                              |
| Timestamps    | ActivityTimestamps | helps create elapsed/remaining timestamps on a player's profile |
| Assets        | ActivityAssets     | assets to display on the player's profile                       |
| Party         | ActivityParty      | information about the player's party                            |
| Secrets       | ActivitySecrets    | secret passwords for joining and spectating the player's game   |
| Instance      | bool               | whether this activity is an instanced context, like a match     |

###### ActivityTimestamps Struct

| name  | type  | description                                            |
| ----- | ----- | ------------------------------------------------------ |
| Start | Int64 | unix timestamp - send this to have an "elapsed" timer  |
| End   | Int64 | unix timestamp - send this to have a "remaining" timer |

###### ActivityAssets Struct

| name       | type   | description                    |
| ---------- | ------ | ------------------------------ |
| LargeImage | string | keyname of an asset to display |
| LargeText  | string | hover text for the large image |
| SmallImage | string | keyname of an asset to display |
| SmallText  | string | hover text for the small image |

###### ActivityParty Struct

| name | type      | description                        |
| ---- | --------- | ---------------------------------- |
| Id   | string    | a unique identifier for this party |
| Size | PartySize | info about the size of the party   |

###### PartySize Struct

| name        | type  | description                        |
| ----------- | ----- | ---------------------------------- |
| CurrentSize | Int32 | the current size of the party      |
| MaxSize     | Int32 | the max possible size of the party |

###### ActivitySecrets Struct

| name     | type   | description                                  |
| -------- | ------ | -------------------------------------------- |
| Match    | string | unique hash for the given match context      |
| Join     | string | unique hash for chat invites and Ask to Join |
| Spectate | string | unique hash for Spectate button              |

###### ActivityType Enum

| name      | Value |
| --------- | ----- |
| Playing   | 0     |
| Streaming | 1     |
| Listening | 2     |
| Watching  | 3     |

###### ActivityJoinRequestReply Enum

| name   | value |
| ------ | ----- |
| No     | 0     |
| Yes    | 1     |
| Ignore | 2     |

###### ActivityActionType Enum

| name     | value |
| -------- | ----- |
| Join     | 1     |
| Spectate | 2     |

## Activity Action Field Requirements

If you want to hook up joining and spectating for your games, there are certain fields in the activity payload that need to be sent. Refer to the following handy table for what needs to be set for certain actions.

###### Requirements

| Field                          | Custom Artwork | Spectate | Join | Ask to Join |
| ------------------------------ | :------------: | :------: | :--: | :---------: |
| State                          |                |          |      |             |
| Details                        |                |          |      |             |
| ActivityTimestamps.Start       |                |          |      |             |
| ActivityTimestamps.End         |                |          |      |             |
| ActivityAssets.LargeImage      |       x        |          |      |             |
| ActivityAssets.SmallImage      |       x        |          |      |             |
| ActivityAssets.LargeText       |       x        |          |      |             |
| ActivityAssets.SmallTest       |       x        |          |      |             |
| ActivityParty.Id               |                |          |  x   |      x      |
| ActivityParty.Size.CurrentSize |                |          |  x   |      x      |
| ActivityParty.Size.MaxSize     |                |          |  x   |      x      |
| ActivitySecrets.Join           |                |          |  x   |      x      |
| ActivitySecrets.Spectate       |                |    x     |      |             |  |

## RegisterCommand

Registers a command by which Discord can launch your game. This might be a custom protocol, like `my-awesome-game://`, or a path to an executable. It also supports any lauch parameters that may be needed, like `game.exe --full-screen --no-hax`.

On macOS, due to the way Discord registers executables, your game needs to be bundled for this command to work. That means it should be a `.app`.

Returns `void`.

###### Parameters

| name    | type   | description             |
| ------- | ------ | ----------------------- |
| command | string | the command to register |

###### Example

```cs
activityManager.RegisterCommand("my-awesome-game://run --full-screen");
```

## RegisterSteam

Used if you are distributing this SDK on Steam. Registers your game's Steam app id for the protocol `steam://run-game-id/<id>`.

Returns `void`.

###### Parameters

| name    | type   | description              |
| ------- | ------ | ------------------------ |
| steamId | UInt32 | your game's Steam app id |

###### Example

```cs
activityManager.RegisterSteam(1938123);
```

## UpdateActivity

Sets a user's presence in Discord to a new activity. This has a rate limit of 5 updates per 20 seconds.

Returns a `Discord.Result` via callback.

###### Parameters

| name     | type     | description                   |
| -------- | -------- | ----------------------------- |
| activity | Activity | the new activity for the user |

###### Example

```cs
var activity = new Discord.Activity();
activity.State = "Hello!";
activity.Details = "In Game";
activity.Party.Size = 1;
activity.Party.Max = 4;

activityManager.UpdateActivity(activity, (result) =>
{
    if (result == Discord.Result.OK)
    {
        Console.WriteLine("Success!");
    }
    else
    {
        Console.WriteLine("Failed");
    }
});
```

## ClearActivity

Clear's a user's presence in Discord to make it show nothing.

Results a `Discord.Result` via callback.

###### Parameters

None

###### Example

```cs
activityManager.ClearActivity((result) =>
{
    if (result == Discord.Result.OK)
    {
        Console.WriteLine("Success!");
    }
    else
    {
        Console.WriteLine("Failed");
    }
});
```

## SendRequestReply

Sends a reply to an Ask to Join request.

Returns a `Discord.Result` via callback.

###### Paramerters

| name   | type                     | description                                 |
| ------ | ------------------------ | ------------------------------------------- |
| userId | Int64                    | the user id of the person who asked to join |
| reply  | ActivityJoinRequestReply | No, Yes, or Ignore                          |

###### Example

```cs
activityManager.OnActivityJoinRequest += user =>
{
    Console.WriteLine("Join request from: {0}", user.Id);
    activityManager.SendRequestReply(user.Id, Discord.ActivityJoinRequestReply.Yes);
}
```

## SendInvite

Sends a game invite to a given user.

Returns a `Discord.Result` via callback.

###### Parameters

| name    | type               | description                                           |
| ------- | ------------------ | ----------------------------------------------------- |
| userId  | Int64              | the id of the user to invite                          |
| type    | ActivityActionType | marks the invite as an invitation to join or spectate |
| content | string             | a message to send along with the invite               |

###### Example

```cs
activityManager.InviteUser(53908232506183689, Discord.ActivityActionType.Join, "Come play!", (result) =>
{
    if (result == Discord.Result.OK)
    {
        Console.WriteLine("Success!");
    }
    else
    {
        Console.WriteLine("Failed");
    }
});
```

## AcceptInvite

Accepts a game invitation from a given userId.

Returns a `Discord.Result` via callback.

###### Parameters

| name   | type  | description                        |
| ------ | ----- | ---------------------------------- |
| userId | Int64 | the id of the user who invited you |

###### Example

```cs
activityManager.AcceptInvite(290926444748734466, (result) =>
{
    if (result == Discord.Result.OK)
    {
        Console.WriteLine("Success!");
    }
    else
    {
        Console.WriteLine("Failed");
    }
});
```

## OnActivityJoin

Fires when a user accepts a game chat invite or receives confirmation from Asking to Join.

###### Parameters

| name       | type   | description                        |
| ---------- | ------ | ---------------------------------- |
| joinSecret | string | the secret to join the user's game |

## OnActivitySpectate

Fires when a user accepts a spectate chat invite or clicks the Spectate button on a user's profile.

###### Parameters

| name           | type   | description                                       |
| -------------- | ------ | ------------------------------------------------- |
| spectateSecret | string | the secret to join the user's game as a spectator |

## OnActivityJoinRequest

Fires when a user asks to join the current user's game.

###### Parameters

| name | type | description             |
| ---- | ---- | ----------------------- |
| user | User | the user asking to join |

## OnActivityInvite

Fires when the user receives a join or spectate invite.

###### Parameters

| name     | type               | description                                |
| -------- | ------------------ | ------------------------------------------ |
| type     | ActivityActiontype | whether this invite is to join or spectate |
| user     | User               | the user sending the invite                |
| activity | Activity           | the inviting user's current activity       |

## Example: Inviting a User to a Game

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
  Party =
  {
      Id = "foo partyID",
      Size = {
          CurrentSize = 1,
          MaxSize = 4,
      },
  },
  Secrets =
  {
      Match = "foo matchSecret",
      Join = "foo joinSecret",
      Spectate = "foo spectateSecret",
  },
  Instance = true,
};

activityManager.UpdateActivity(activity, (result) =>
{
    Console.WriteLine("Update Activity {0}", result);

    // Send an invite to another user for this activity.
    // Receiver should see an invite in their DM.
    // Use a relationship user's ID for this.
    activityManager.InviteUser(364843917537050999, Discord.ActivityActionType.Join, "", (inviteUserResult) =>
    {
        Console.WriteLine("Invite User {0}", inviteUserResult);
    });
});
```
