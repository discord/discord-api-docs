# Activities

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

Are you looking to integrate Rich Presence into your game? No need to manage multiple SDKs—this one does all that awesome stuff, too!. Delight your players with the ability to post-game invites in chat and party up directly from Discord. Surface interesting live game data in their profile and on the Games Tab for their friends, encouraging them to group up and play together.

For more detailed information and documentation around the Rich Presence feature set and integration tips, check out our [Rich Presence Documentation](https://discord.com/developers/docs/rich-presence/how-to).

## Data Models

###### User Struct

| name          | type   | description                   |
| ------------- | ------ | ----------------------------- |
| Id            | Int64  | the user's id                 |
| Username      | string | their name                    |
| Discriminator | string | the user's unique discriminator     |
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
| Start | Int64 | UNIX timestamp - send this to have an "elapsed" timer  |
| End   | Int64 | UNIX timestamp - send this to have a "remaining" timer |

###### ActivityAssets Struct

| name       | type   | description                    |
| ---------- | ------ | ------------------------------ |
| LargeImage | string | key name of an asset to display |
| LargeText  | string | hover text for the large image |
| SmallImage | string | key name of an asset to display |
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
| Custom    | 4     |
| Competing | 5     |

For more details about the activity types, [see Gateway documentation](#DOCS_TOPICS_GATEWAY/activity-object-activity-types).

`ActivityType` is strictly for the purpose of handling events that you receive from Discord; though the SDK/our API will not reject a payload with an `ActivityType` sent, it will be discarded and will not change anything in the client.

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
| ActivityAssets.SmallText       |       x        |          |      |             |
| ActivityParty.Id               |                |          |  x   |      x      |
| ActivityParty.Size.CurrentSize |                |          |  x   |      x      |
| ActivityParty.Size.MaxSize     |                |          |  x   |      x      |
| ActivitySecrets.Join           |                |          |  x   |      x      |
| ActivitySecrets.Spectate       |                |    x     |      |             |

## RegisterCommand

Registers a command by which Discord can launch your game. This might be a custom protocol, like `my-awesome-game://`, or a path to an executable. It also supports any launch parameters that may be needed, like `game.exe --full-screen --no-hax`.

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

> info
> It is possible for users to hide their presence on Discord (User Settings -> Game Activity). Presence set through this SDK may not be visible when this setting is toggled off.

Returns a `Discord.Result` via callback.

###### Parameters

| name     | type     | description                   |
| -------- | -------- | ----------------------------- |
| activity | Activity | the new activity for the user |

###### Example

```cs
var activity = new Discord.Activity
{
  State = "In Play Mode",
  Details = "Playing the Trumpet!",
  Timestamps =
  {
      Start = 5,
  },
  Assets =
  {
      LargeImage = "foo largeImageKey", // Larger Image Asset Key
      LargeText = "foo largeImageText", // Large Image Tooltip
      SmallImage = "foo smallImageKey", // Small Image Asset Key
      SmallText = "foo smallImageText", // Small Image Tooltip
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
    if (result == Discord.Result.Ok)
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
    if (result == Discord.Result.Ok)
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

###### Parameters

| name   | type                     | description                                 |
| ------ | ------------------------ | ------------------------------------------- |
| userId | Int64                    | the user id of the person who asked to join |
| reply  | ActivityJoinRequestReply | No, Yes, or Ignore                          |

###### Example

```cs
activityManager.OnActivityJoinRequest += user =>
{
    Console.WriteLine("Join request from: {0}", user.Id);
    activityManager.SendRequestReply(user.Id, Discord.ActivityJoinRequestReply.Yes, (res) =>
    {
      if (res == Discord.Result.Ok)
      {
        Console.WriteLine("Responded successfully");
      }
    });
}
```

## SendInvite

Sends a game invite to a given user. If you do not have a valid activity with all the required fields, this call will error. See [Activity Action Field Requirements](#DOCS_GAME_SDK_ACTIVITIES/activity-action-field-requirements) for the fields required to have join and spectate invites function properly.

Returns a `Discord.Result` via callback.

###### Parameters

| name    | type               | description                                           |
| ------- | ------------------ | ----------------------------------------------------- |
| userId  | Int64              | the id of the user to invite                          |
| type    | ActivityActionType | marks the invite as an invitation to join or spectate |
| content | string             | a message to send along with the invite               |

###### Example

```cs
var userId = 53908232506183680;
activityManager.SendInvite(userId, Discord.ActivityActionType.Join, "Come play!", (result) =>
{
    if (result == Discord.Result.Ok)
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
    if (result == Discord.Result.Ok)
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

###### Example

```cs
// Received when someone accepts a request to join or invite.
// Use secrets to receive back the information needed to add the user to the group/party/match
activityManager.OnActivityJoin += secret => {
    Console.WriteLine("OnJoin {0}", secret);
    lobbyManager.ConnectLobbyWithActivitySecret(secret, (Discord.Result result, ref Discord.Lobby lobby) =>
    {
        Console.WriteLine("Connected to lobby: {0}", lobby.Id);
        // Connect to voice chat, used in this case to actually know in overlay if your successful in connecting.
        lobbyManager.ConnectVoice(lobby.Id, (Discord.Result voiceResult) => {

            if (voiceResult == Discord.Result.Ok)
            {
                Console.WriteLine("New User Connected to Voice! Say Hello! Result: {0}", voiceResult);
            }
            else
            {
                Console.WriteLine("Failed with Result: {0}", voiceResult);
            };
        });
		//Connect to given lobby with lobby Id
        lobbyManager.ConnectNetwork(lobby.Id);
        lobbyManager.OpenNetworkChannel(lobby.Id, 0, true);
        foreach (var user in lobbyManager.GetMemberUsers(lobby.Id))
        {
			//Send a hello message to everyone in the lobby
            lobbyManager.SendNetworkMessage(lobby.Id, user.Id, 0,
                Encoding.UTF8.GetBytes(String.Format("Hello, {0}!", user.Username)));
        }
		//Sends this off to an Activity callback named here as 'UpdateActivity' passing in the discord instance details and lobby details
        UpdateActivity(discord, lobby);
    });
};

void UpdateActivity(Discord.Discord discord, Discord.Lobby lobby)
    {
    	//Creates a Static String for Spectate Secret.
        string discordSpectateSecret = "wdn3kvj320r8vk3";
        spectateActivitySecret = discordSpectateSecret;
        var activity = new Discord.Activity
        {
            State = "Playing Co-Op",
            Details = "In a Multiplayer Match!",
            Timestamps =
            {
                Start = startTimeStamp,
            },
            Assets =
            {
                LargeImage = "matchimage1",
                LargeText = "Inside the Arena!",
            },
            Party = {
                Id = lobby.Id.ToString(),
                Size = {
                    CurrentSize = lobbyManager.MemberCount(lobby.Id),
                    MaxSize = (int)lobby.Capacity,
                },
            },
            Secrets = {
                Spectate = spectateActivitySecret,
                Join = joinActivitySecret,
            },
            Instance = true,
        };

        activityManager.UpdateActivity(activity, result =>
        {
            Debug.LogFormat("Updated to Multiplayer Activity: {0}", result);

            // Send an invite to another user for this activity.
            // Receiver should see an invite in their DM.
            // Use a relationship user's ID for this.
            // activityManager
            //   .SendInvite(
            //       364843917537050624,
            //       Discord.ActivityActionType.Join,
            //       "",
            //       inviteResult =>
            //       {
            //           Console.WriteLine("Invite {0}", inviteResult);
            //       }
            //   );
        });
    }
```

## OnActivitySpectate

Fired when a user accepts a spectate chat invite or clicks the Spectate button on a user's profile.

###### Parameters

| name           | type   | description                                       |
| -------------- | ------ | ------------------------------------------------- |
| spectateSecret | string | the secret to join the user's game as a spectator |

###### Example

```cs
// Received when someone accepts a request to spectate
activityManager.OnActivitySpectate += secret =>
{
    Console.WriteLine("OnSpectate {0}", secret);
};
```

## OnActivityJoinRequest

Fires when a user asks to join the current user's game.

###### Parameters

| name | type | description             |
| ---- | ---- | ----------------------- |
| user | User | the user asking to join |

###### Example

```cs
// A join request has been received. Render the request on the UI.
activityManager.OnActivityJoinRequest += (ref Discord.User user) =>
{
    Console.WriteLine("OnJoinRequest {0} {1}", user.Username, user.Id);
};
```

## OnActivityInvite

Fired when the user receives a join or spectate invite.

###### Parameters

| name     | type               | description                                |
| -------- | ------------------ | ------------------------------------------ |
| type     | ActivityActiontype | whether this invite is to join or spectate |
| user     | User               | the user sending the invite                |
| activity | Activity           | the inviting user's current activity       |

###### Example

```cs
// An invite has been received. Consider rendering the user/activity on the UI.
activityManager.OnActivityInvite += (Discord.ActivityActionType Type, ref Discord.User user, ref Discord.Activity activity2) =>
{
      Console.WriteLine("Recieved Invite Type: {0}, from User: {1}, with Activity Name: {2}", Type, user.Username, activity2.Name);
      // activityManager.AcceptInvite(user.Id, result =>
      // {
      //     Console.WriteLine("AcceptInvite {0}", result);
      // });
};
```

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
    activityManager.SendInvite(364843917537050999, Discord.ActivityActionType.Join, "", (inviteUserResult) =>
    {
        Console.WriteLine("Invite User {0}", inviteUserResult);
    });
});
```
