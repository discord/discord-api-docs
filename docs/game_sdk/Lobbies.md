# Lobbies

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

Looking to integrate multiplayer into your game? Lobbies are a great way to organize players into contexts to play together. This manager works hand in hand with the networking layer of our SDK to make multiplayer integrations a breeze by:

- Creating, managing, and joining lobbies
- Matchmaking users based on lobby metadata, like ELO
- Getting and setting arbitrary metadata on lobbies and lobby members

Lobbies in Discord work in one of two ways. By using calls from the SDK, lobbies are effectively "owned" by the user who's client creates the lobby. Someone boots up the game hits your "Create Lobby" button, and their game client calls `LobbyManager.CreateLobby()` from the Discord SDK.

There is also another way to create and "own" lobbies with which the source of truth can be your own server. These SDK functions calls map to API endpoints that are exposed in Discord's HTTP API. In lieu of creating and managing lobbies in the SDK, you can call those endpoints directly with a token for your application and take care of it all on some far-away, totally secure server. Let's go over the SDK first.

## The SDK Way

In order to ensure that Discord lobbies are consistent for all players, this manager works with "transactions". A `LobbyTransaction` is needed to set lobby properties, like capacity. A `MemberTransaction` is needed to set lobby member properties, like metadata.

To update a user or a lobby, create or get a transaction for that resource, call the needed methods on it, and then pass it to the `Create()` or `Update()` methods. When passed to a `Create()` or `Update()` method, the transaction objected is consumed. So, if you want to do another `Create()` or `Update()`, you need to get a new transaction.

###### Example: Creating a Lobby

```cs
var lobbyManager = discord.GetLobbyManager();

// Create the transaction
var txn = lobbyManager.GetLobbyCreateTransaction();

// Set lobby information
txn.SetCapacity(6);
txn.SetType(Discord.LobbyType.Public);
txn.SetMetadata("a", "123");

// Create it!
lobbyManager.CreateLobby(txn, (result, lobby) =>
{
  Console.WriteLine("lobby {0} created with secret {1}", lobby.Id, lobby.Secret);

  // We want to update the capacity of the lobby
  // So we get a new transaction for the lobby
  var newTxn = lobbyManager.GetLobbyUpdateTransaction(lobby.id);
  newTxn.SetCapacity(5);

  lobbyManager.UpdateLobby(lobby.id, newTxn, (result) =>
  {
    Console.WriteLine("lobby {0} updated", lobby.Id);
  });
});
```

## Data Models

###### LobbyType Enum

| name    | value |
| ------- | ----- |
| Private | 1     |
| Public  | 2     |

###### Lobby Struct

| name     | type      | description                            |
| -------- | --------- | -------------------------------------- |
| Id       | Int64     | the unique id of the lobby             |
| Type     | LobbyType | if the lobby is public or private      |
| OwnerId  | Int64     | the userId of the lobby owner          |
| Secret   | string    | the password to the lobby              |
| Capacity | UInt32    | the max capacity of the lobby          |
| Locked   | bool      | whether or not the lobby can be joined |

###### LobbySearchComparison Enum

| name               | value |
| ------------------ | ----- |
| LessThanOrEqual    | -2    |
| LessThan           | -1    |
| Equal              | 0     |
| GreaterThan        | 1     |
| GreaterThanOrEqual | 2     |
| NotEqual           | 3     |

###### LobbySearchCast Enum

| name   | value |
| ------ | ----- |
| String | 1     |
| Number | 2     |

###### LobbySearchDistance Enum

| name     | value | description                          |
| -------- | ----- | ------------------------------------ |
| Local    | 0     | within the same region               |
| Default  | 1     | within the same and adjacent regions |
| Extended | 2     | far distances, like the US to EU         |
| Global   | 3     | all regions                          |

###### LobbyTransaction Struct

Has no values, but has member functions outlined later.

###### LobbyMemberTransaction Struct

Has no values, but has member functions outlined later.

###### LobbySearchQuery Struct

Has no values, but has member functions outlined later.

## LobbyTransaction.SetType

Marks a lobby as private or public.

Returns `void`.

###### Parameters

| name | type      | description       |
| ---- | --------- | ----------------- |
| type | LobbyType | private or public |

###### Example

```cs
var txn = lobbyManager.GetLobbyUpdateTransaction();
txn.SetType(Discord.LobbyType.Public);
lobbyManager.UpdateLobby(lobbyId, txn, (Discord.Result result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Lobby type updated!");
  }
});
```

## LobbyTransaction.SetOwner

> warn
> This method is only valid for `LobbyUpdateTransactions` and may cause issues if you set it on a `LobbyCreateTransaction`.

Sets a new owner for the lobby.

Returns `void`.

###### Parameters

| name   | type  | description             |
| ------ | ----- | ----------------------- |
| userId | Int64 | the new owner's user id |

###### Example

```cs
var txn = lobbyManager.GetLobbyUpdateTransaction();
txn.SetOwner(53908232506183680);
lobbyManager.UpdateLobby(lobbyId, txn, (Discord.Result result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Lobby owner updated!");
  }
});
```

## LobbyTransaction.SetCapacity

Sets a new capacity for the lobby.

Returns `void`.

###### Parameters

| name     | type   | description            |
| -------- | ------ | ---------------------- |
| capacity | UInt32 | the new max lobby size |

###### Example

```cs
var txn = lobbyManager.GetLobbyUpdateTransaction();
txn.SetCapacity(10);
lobbyManager.UpdateLobby(lobbyId, txn, (Discord.Result result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Lobby capacity updated!");
  }
});
```

## LobbyTransaction.SetMetadata

Sets metadata value under a given key name for the lobby.

Returns `void`.

###### Parameters

| name  | type   | description      |
| ----- | ------ | ---------------- |
| key   | string | key for the data |
| value | string | data value       |

###### Example

```cs
var txn = lobbyManager.GetLobbyUpdateTransaction();
txn.SetMetadata("average_mmr", "4500");
lobbyManager.UpdateLobby(lobbyId, txn, (Discord.Result result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Lobby metadata updated!");
  }
});
```

## LobbyTransaction.DeleteMetadata

Deletes the lobby metadata for a key.

Returns `void`.

###### Parameters

| name | type   | description      |
| ---- | ------ | ---------------- |
| key  | string | key for the data |

###### Example

```cs
var txn = lobbyManager.GetLobbyUpdateTransaction();
txn.DeleteMetadata("average_mmr");
lobbyManager.UpdateLobby(lobbyId, txn, (Discord.Result result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Lobby metadata updated!");
  }
});
```

## LobbyTransaction.SetLocked

Sets the lobby to locked or unlocked. When locked, new users cannot join the lobby.

Returns `void`.

###### Parameters

| name   | type | description                         |
| ------ | ---- | ----------------------------------- |
| locked | bool | whether to lock or unlock the lobby |

###### Example

```cs
var txn = lobbyManager.GetLobbyUpdateTransaction();
txn.SetLocked(true);
lobbyManager.UpdateLobby(lobbyId, txn, (Discord.Result result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Lobby type updated!");
  }
});
```

## LobbyMemberTransaction.SetMetadata

Sets metadata value under a given key name for the current user.

Returns `void`.

###### Parameters

| name  | type   | description      |
| ----- | ------ | ---------------- |
| key   | string | key for the data |
| value | string | data value       |

###### Example

```cs
var txn = lobbyManager.GetMemberUpdateTransaction();
txn.SetMetadata("current_mmr", "4267");
lobbyManager.UpdateMember(lobbyId, memberId, txn, (result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Member metadata updated!");
  }
});
```

## LobbyMemberTransaction.DeleteMetadata

Sets metadata value under a given key name for the current user.

Returns `void`.

###### Parameters

| name | type   | description      |
| ---- | ------ | ---------------- |
| key  | string | key for the data |

###### Example

```cs
var txn = lobbyManager.GetMemberUpdateTransaction();
txn.DeleteMetadata("current_mmr");
lobbyManager.UpdateMember(lobbyId, memberId, txn, (result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Member metadata updated!");
  }
});
```

## LobbySearchQuery.Filter

Filters lobbies based on metadata comparison. Available filter values are `owner_id`, `capacity`, `slots`, and `metadata`. If you are filtering based on metadata, make sure you prepend your key with `"metadata."` For example, filtering on matchmaking rating would be `"metadata.matchmaking_rating"`.

Returns `void`.

###### Parameters

| name  | type                  | description                                                                |
| ----- | --------------------- | -------------------------------------------------------------------------- |
| key   | string                | key to search for filter data                                              |
| comp  | LobbySearchComparison | how the value on the lobby metadata should be compared to the search value |
| cast  | LobbySearchCast       | should the search value be cast as a string or a number                    |
| value | string                | the value to filter against                                                |

###### Example

```cs
var query = lobbyManager.GetSearchQuery();
query.Filter("metadata.matchmaking_rating", LobbySearchComparison.GreaterThan, LobbySearchCast.Number, "455");
```

## LobbySearchQuery.Sort

Sorts the filtered lobbies based on "near-ness" to a given value.

Returns `void`.

###### Parameters

| name  | type            | description                                             |
| ----- | --------------- | ------------------------------------------------------- |
| key   | string          | key for the data                                        |
| cast  | LobbySearchCast | should the search value be cast as a string or a number |
| value | string          | the value to sort by                                    |

###### Example

```cs
var query = lobbyManager.GetSearchQuery();
query.Sort("metadata.ELO", LobbySearchCast.Number, "1337");
```

## LobbySearchQuery.Limit

Limits the number of lobbies returned in a search.

Returns `void`.

###### Parameters

| name  | type   | description                            |
| ----- | ------ | -------------------------------------- |
| limit | UInt32 | the number of lobbies to return at max |

###### Example

```cs
var query = lobbyManager.GetSearchQuery();
query.Limit(10);
```

## LobbySearchQuery.Distance

Filters lobby results to within certain regions relative to the user's location.

Returns `void`.

###### Parameters

| name     | type                        | description                                     |
| -------- | --------------------------- | ----------------------------------------------- |
| distance | Discord.LobbySearchDistance | the distance within which to search for lobbies |

###### Example

```cs
var query = lobbyManager.GetSearchQuery();
query.Distance(LobbySearchDistance.Local);
```

## GetLobbyCreateTransaction

Gets a Lobby transaction used for creating a new lobby

Returns a `Discord.LobbyTransaction`.

###### Parameters

None

###### Example

```cs
var txn = lobbyManager.GetLobbyCreateTransaction();
```

## GetLobbyUpdateTransaction

Gets a lobby transaction used for updating an existing lobby.

Returns a `Discord.LobbyTransaction`.

###### Parameters

| name    | type  | description                  |
| ------- | ----- | ---------------------------- |
| lobbyId | Int64 | the lobby you want to change |

###### Example

```cs
var txn = lobbyManager.GetLobbyUpdateTransaction(290926798626357250);
```

## GetMemberUpdateTransaction

Gets a new member transaction for a lobby member in a given lobby.

Returns a `Discord.LobbyMemberTransaction`.

###### Parameters

| name    | type  | description                  |
| ------- | ----- | ---------------------------- |
| lobbyId | Int64 | the lobby you want to change |
| userId  | Int64 | the user you wish to change  |

###### Example

```cs
var txn = lobbyManager.GetMemberUpdateTransaction(290926798626357250, 53908232506183680);
```

## CreateLobby

Creates a lobby. Creating a lobby auto-joins the connected user to it. **Do not call `SetOwner()` in the transaction for this method.**

Returns `Discord.Result` and `ref Lobby` via callback.

###### Parameters

| name        | type             | description                                           |
| ----------- | ---------------- | ----------------------------------------------------- |
| transaction | LobbyTransaction | a lobby transaction with set properties like capacity |

###### Example

```cs
lobbyManager.CreateLobby(txn, (Discord.Result result, ref Discord.Lobby lobby) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Created lobby {0}", lobby.Id);
  }
});
```

## UpdateLobby

Updates a lobby with data from the given transaction. You _can_ call `SetOwner()` in this transaction.

Returns `Discord.Result` via callback.

> warn
> This call has a rate limit of 10 updates per 5 seconds. If you fear you might hit that, it may be a good idea to batch your lobby updates into transactions.

###### Parameters

| name        | type             | description                         |
| ----------- | ---------------- | ----------------------------------- |
| lobbyId     | Int64            | the lobby you want to change        |
| transaction | LobbyTransaction | the transaction with wanted changes |

###### Example

```cs
lobbymanager.UpdateLobby(290926798626357250, transaction, (result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Lobby updated!");
  }
});
```

## DeleteLobby

Deletes a given lobby.

Returns `Discord.Result` via callback.

###### Parameters

| name    | type  | description                  |
| ------- | ----- | ---------------------------- |
| lobbyId | Int64 | the lobby you want to delete |

###### Example

```cs
lobbyManager.DeleteLobby(290926798626357250, (result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Lobby deleted!");
  }
});
```

## ConnectLobby

Connects the current user to a given lobby. You can be connected to up to five lobbies at a time.

Returns `Discord.Result` and `ref Discord.Lobby` via callback.

###### Parameters

| name        | type   | description                      |
| ----------- | ------ | -------------------------------- |
| lobbyId     | Int64  | the lobby you want to connect to |
| lobbySecret | string | the password for the lobby       |

###### Example

```cs
lobbyManager.ConnectLobby(290926798626357250, "363446008341987328:123123", (Discord.Result result, ref Discord.Lobby lobby) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Connected to lobby {0}!", lobby.Id);
  }
});
```

## ConnectLobbyWithActivitySecret

Connects the current user to a lobby; requires the special activity secret from the lobby, which is a concatenated lobbyId and secret.

Returns `Discord.Result` and `ref Discord.Lobby` via callback.

###### Parameters

| name           | type   | description                               |
| -------------- | ------ | ----------------------------------------- |
| activitySecret | string | the special activity secret for the lobby |

###### Example

```cs
lobbyManager.ConnectLobbyWithActivitySecret("363446008341987328:123123", (Discord.Result result, ref Discord.Lobby lobby) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Connected to lobby {0}!", lobby.Id);
  }
});
```

## GetLobbyActivitySecret

Gets the special activity secret for a given lobby. If you are creating lobbies from game clients, use this to easily interact with Rich Presence invites. Set the returned secret to your activity's `JoinSecret`.

Returns `string`.

###### Parameters

| name    | type  | description                              |
| ------- | ----- | ---------------------------------------- |
| lobbyId | Int64 | the lobby you want to get the secret for |

###### Example

```cs
var activitySecret = lobbyManager.GetLobbyActivitySecret(290926798626357250);
var activity = new Discord.Activity
{
  State = "olleh",
  Details = "foo details",
    Party = {
      Id = "foo partyID",
      Size = {
          CurrentSize = 1,
          MaxSize = 4,
      },
  },
  Secrets = {
      Join = activitySecret,
  },
  Instance = true,
};

ActivityManager.UpdateActivity(activity, (result) =>
{
  Console.WriteLine("Update Activity {0}", result);
});
```

## DisconnectLobby

Disconnects the current user from a lobby.

Returns `Discord.Result` via callback.

###### Parameters

| name    | type  | description                 |
| ------- | ----- | --------------------------- |
| lobbyId | Int64 | the lobby you want to leave |

###### Example

```cs
lobbyManager.DisconnectLobby(290926798626357250, (result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Left lobby!");
  }
});
```

## GetLobby

Gets the lobby object for a given lobby id. Because of the way that the SDK is architected, you must first call [`Search()`](#DOCS_GAME_SDK_LOBBIES/search) to build a stable list of lobbies. This function will then query those lobbies for ones with a matching id.

Returns a `Discord.Lobby`.

###### Parameters

| name    | type  | description               |
| ------- | ----- | ------------------------- |
| lobbyId | Int64 | the lobby you want to get |

###### Example

```cs
var lobbyId = 12345;

var query = lobbyManager.GetSearchQuery();
lobbyManager.Search(query, (res) =>
{
  if (res == Discord.Result.Ok)
  {
    // This will return you a lobby
    var lobby = lobbyManager.GetLobby(lobbyId);
  }
});

// This will return NotFound
var lobby_2 = lobbyManager.GetLobby(lobbyId);
```

## LobbyMetadataCount

Returns the number of metadata key/value pairs on a given lobby. Used for accessing metadata by iterating over the list.

Returns `Int32`.

###### Parameters

| name    | type  | description                            |
| ------- | ----- | -------------------------------------- |
| lobbyId | Int64 | the lobby you want to get metadata for |

###### Example

```cs
var count = lobbyManager.LobbyMetadataCount(290926798626357250);
for (int i = 0; i < count; i++)
{
  var value = lobbyManager.GetLobbyMetadataKey(290926798626357250, i);
}
```

## GetLobbyMetadataKey

Returns the key for the lobby metadata at the given index.

Returns `string`.

###### Parameters

| name    | type  | description                            |
| ------- | ----- | -------------------------------------- |
| lobbyId | Int64 | the lobby you want to get metadata for |
| index   | Int32 | the index of lobby metadata to access  |

###### Example

```cs
var count = lobbyManager.GetLobbyMetadataCount(290926798626357250);
for (int i = 0; i < count; i++)
{
  var value = lobbyManager.GetLobbyMetadataKey(290926798626357250, i);
}
```

## GetLobbyMetadataValue

Returns lobby metadata value for a given key and id. Can be used with iteration or direct access by key name.

###### Parameters

| name    | type   | description                            |
| ------- | ------ | -------------------------------------- |
| lobbyId | Int64  | the lobby you want to get metadata for |
| key     | string | the key name to access                 |

###### Example

```cs
var averageMmr = lobbyManager.GetLobbyMetadataValue(290926798626357250, "metadata.average_mmr");
```

## MemberCount

Get the number of members in a lobby.

Returns `Int32`.

###### Parameters

| name    | type  | description                           |
| ------- | ----- | ------------------------------------- |
| lobbyId | Int64 | the lobby you want to get members for |

###### Example

```cs
var count = lobbyManager.MemberCount(290926798626357250);
for (int i = 0; i < count; i++)
{
  var id = lobbyManager.GetMemberUserId(290926798626357250, i);
}
```

## GetMemberUserId

Gets the user id of the lobby member at the given index.

Returns `Int64`.

###### Parameters

| name    | type  | description                           |
| ------- | ----- | ------------------------------------- |
| lobbyId | Int64 | the lobby you want to get members for |
| index   | Int32 | the index of lobby member to access   |

###### Example

```cs
var count = lobbyManager.MemberCount(290926798626357250);
for (int i = 0; i < count; i++)
{
  var id = lobbyManager.GetMemberUserId(290926798626357250, i);
}
```

## GetMemberUser

Gets the user object for a given user id.

Returns `Discord.User`.

###### Parameters

| name    | type  | description                           |
| ------- | ----- | ------------------------------------- |
| lobbyId | Int64 | the lobby you want to get members for |
| userId  | Int64 | the user's userId                     |

###### Example

```cs
var count = lobbyManager.MemberCount(290926798626357250);
for (int i = 0; i < count; i++)
{
  var id = lobbyManager.GetMemberUserId(290926798626357250, i);
  var user = lobbyManager.GetMemberUser(290926798626357250, id);
  Console.WriteLine("Got user {0}", user.Id);
}
```

## MemberMetadataCount

Gets the number of metadata key/value pairs for the given lobby member. Used for accessing metadata by iterating over a list.

Returns `Int32`.

###### Parameters

| name    | type  | description                            |
| ------- | ----- | -------------------------------------- |
| lobbyId | Int64 | the lobby the member belongs to        |
| userId  | Int64 | the id of the user to get metadata for |

###### Example

```cs
var count = lobbyManager.MemberMetadataCount(290926798626357250, 53908232506183680);
for (int i = 0; i < count; i++)
{
  var key = lobbyManager.GetMemberMetadataKey(290926798626357250, 53908232506183680, i);
}
```

## GetMemberMetadataKey

Gets the key for the lobby metadata at the given index on a lobby member.

Returns `string`.

###### Parameters

| name    | type  | description                            |
| ------- | ----- | -------------------------------------- |
| lobbyId | Int64 | the lobby the member belongs to        |
| userId  | Int64 | the id of the user to get metadata for |
| index   | Int32 | the index of metadata to access        |

###### Example

```cs
var count = lobbyManager.MemberMetadataCount(290926798626357250, 53908232506183680);
for (int i = 0; i < count; i++)
{
  var key = lobbyManager.GetMemberMetadataKey(290926798626357250, 53908232506183680, i);
}
```

## GetMemberMetadataValue

Returns user metadata for a given key. Can be used in conjunction with the count and get key functions if you're iterating over metadata. Or you can access the metadata directly by key name

Returns `string`.

###### Parameters

| name    | type   | description                            |
| ------- | ------ | -------------------------------------- |
| lobbyId | Int64  | the lobby the member belongs to        |
| userId  | Int64  | the id of the user to get metadata for |
| key     | string | the metadata key to access             |

###### Example

```cs
var count = lobbyManager.MemberMetadataCount(290926798626357250, 53908232506183680);
for (int i = 0; i < count; i++)
{
  var key = lobbyManager.GetMemberMetadataKey(290926798626357250, 53908232506183680, i);
  var value = lobbyManager.GetMemberMetadataValue(290926798626357250, 53908232506183680, key);
  Console.WriteLine("Value: {0}", value);
}
```

## UpdateMember

Updates lobby member info for a given member of the lobby.

Returns `Discord.Result` via callback.

###### Parameters

| name        | type                   | description                       |
| ----------- | ---------------------- | --------------------------------- |
| lobbyId     | Int64                  | lobby the member belongs to       |
| userId      | Int64                  | id of the user                    |
| transaction | LobbyMemberTransaction | transaction with the changed data |

###### Example

```cs
var txn = lobbyManager.GetLobbyMemberTransaction(290926798626357250, 53908232506183680);
txn.SetMetadata("my_mmr", "9999");
lobbyManager.UpdateMember(290926798626357250, 53908232506183680, txn, (result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Lobby member updated!");
  }
});
```

## SendLobbyMessage

Sends a message to the lobby on behalf of the current user. You must be connected to the lobby you are messaging. You should use this function for message sending if you are _not_ using the built-in networking layer for the lobby. If you are, you should use [SendNetworkMessage](#DOCS_GAME_SDK_LOBBIES/sendnetworkmessage) instead.

This method has a rate limit of 10 messages per 5 seconds.

Returns a `Discord.Result` via callback.

###### Parameters

| name    | type   | description                 |
| ------- | ------ | --------------------------- |
| lobbyId | Int64  | lobby the member belongs to |
| data    | byte[] | the data to send            |

###### Example

```cs
lobbyManager.SendLobbyMessage(290926798626357250, Encoding.UTF8.GetBytes("hey."), (result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Message sent successfully");
  }
});
```

## GetSearchQuery

Creates a search object to search available lobbies.

Returns `Discord.LobbySearchQuery`.

###### Parameters

None

###### Example

```cs
var search = lobbyManager.GetSearchQuery();
```

## Search

Searches available lobbies based on the search criteria chosen in the `Discord.LobbySearch` member functions. Lobbies that meet the criteria are then globally filtered, and can be accessed via iteration with `LobbyCount()` and `GetLobbyId()`. The callback fires when the list of lobbies is stable and ready for iteration.

You do not necessarily need to access the filtered lobbies within the context of the result callback, but it may make it easier for the sake of asynchronous timing.

Returns `Discord.Result` via callback.

###### Parameters

| name   | type        | description         |
| ------ | ----------- | ------------------- |
| search | LobbySearch | the search criteria |

###### Example

```cs
var search = lobbyManger.GetSearchQuery();
search.Filter("metadata.matchmaking_rating", LobbySearchComparison.GreaterThan, LobbySearchCast.Number, "455");
search.Sort("metadata.matchmaking_rating", LobbySearchCast.Number, "456");
search.Limit(10);
lobbyManager.Search(search, (result) =>
{
  if (result == Discord.Result.Ok)
  {
    var count = lobbyManager.LobbyCount();
    Console.WriteLine("There are {0} lobbies that match your search criteria", count);
  }
});
```

## LobbyCount

Get the number of lobbies that match the search.

Returns `Int32`.

###### Parameters

None

###### Example

```cs
lobbyManager.Search(search, () =>
{
  var count = lobbyManager.LobbyCount();
  Console.WriteLine("There are {0} lobbies that match your search criteria", count);
});
```

## GetLobbyId

Returns the id for the lobby at the given index.

Returns `Int64`.

###### Parameters

| name  | type  | description                                      |
| ----- | ----- | ------------------------------------------------ |
| index | Int32 | the index at which to access the list of lobbies |

###### Example

```cs
lobbyManager.Search(search, () =>
{
  var count = lobbyManager.LobbyCount();
  for (int i = 0; i < count; i++)
  {
    var id = lobbyManager.GetLobbyId(i);
    Console.WriteLine("Found lobby {0}", id);
  }
});
```

## ConnectVoice

Connects to the voice channel of the current lobby. When connected to voice, the user can open their Discord overlay to see a list of other users with whom they are in voice, allowing them to mute/deafen themselves as well as mute/adjust the volume of other lobby members.

You can also allow users to adjust voice settings for your game with [Overlay OpenVoiceSettings](#DOCS_GAME_SDK_OVERLAY/openvoicesettings).

When integrating lobby voice into your game, be thoughtful about the user's experience. Auto-joining to voice can be jarring for users who may not be expecting it. We recommend voice always being opt-in, or at least that you provide an option for a player to choose whether or not to auto-join the voice channel of lobbies they join.

Returns `Discord.Result` via callback.

###### Parameters

| name    | type  | description               |
| ------- | ----- | ------------------------- |
| lobbyId | Int64 | lobby to voice connect to |

###### Example

```cs
lobbyManager.ConnectVoice(290926798626357250, (result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Voice connected!");
  }
});
```

## DisconnectVoice

Disconnects from the voice channel of a given lobby.

###### Parameters

| name    | type  | description                    |
| ------- | ----- | ------------------------------ |
| lobbyId | Int64 | lobby to voice disconnect from |

###### Example

```cs
lobbyManager.DisconnectVoice(290926798626357250, (result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Voice disconnected!");
  }
});
```

## OnLobbyUpdate

Fires when a lobby is updated.

###### Parameters

| name    | type  | description        |
| ------- | ----- | ------------------ |
| lobbyId | Int64 | lobby that updated |

###### Example

```cs
lobbyManager.OnLobbyUpdate += (lobbyID) =>
{
  Console.WriteLine("lobby successfully updated: {0}", lobbyID);
};
```

## OnLobbyDelete

Fired when a lobby is deleted.

###### Parameters

| name    | type   | description                                    |
| ------- | ------ | ---------------------------------------------- |
| lobbyId | Int64  | lobby that was deleted                         |
| reason  | string | reason for deletion - this is a system message |

###### Example

```cs
lobbyManager.OnLobbyDelete += (lobbyID, reason) =>
{
  Console.WriteLine("lobby successfully deleted: {0} with reason: {1}", lobbyID, reason);
};
```

## OnMemberConnect

Fires when a new member joins the lobby.

###### Parameters

| name    | type  | description           |
| ------- | ----- | --------------------- |
| lobbyId | Int64 | lobby the user joined |
| userId  | Int64 | user that joined      |

###### Example

```cs
lobbyManager.OnMemberConnect += (lobbyID, userID) =>
{
  Console.WriteLine("user {0} connected to lobby: {1}", userID, lobbyID);
};
```

## OnMemberUpdate

Fires when data for a lobby member is updated.

###### Parameters

| name    | type  | description                   |
| ------- | ----- | ----------------------------- |
| lobbyId | Int64 | lobby the user is a member of |
| userId  | Int64 | user that was updated         |

###### Example

```cs
lobbyManager.OnMemberUpdate += (lobbyID, userID) =>
{
  Console.WriteLine("user {0} got updated in lobby: {1}", userID, lobbyID);
};
```

## OnMemberDisconnect

Fires when a member leaves the lobby.

###### Parameters

| name    | type  | description                    |
| ------- | ----- | ------------------------------ |
| lobbyId | Int64 | lobby the user was a member of |
| userId  | Int64 | user that left                 |

###### Example

```cs
lobbyManager.OnMemberDisconnect += (lobbyID, userID) =>
{
  Console.WriteLine("user {0} disconnected from lobby: {1}", userID, lobbyID);
};
```

## OnLobbyMessage

Fires when a message is sent to the lobby.

###### Parameters

| name    | type   | description                  |
| ------- | ------ | ---------------------------- |
| lobbyId | Int64  | lobby the message is sent to |
| userId  | Int64  | user that sent the message   |
| data    | byte[] | the message contents         |

###### Example

```cs
lobbyManager.OnLobbyMessage += (lobbyID, userID, data) =>
{
  Console.WriteLine("lobby message: {0}, user who sent the message: {1}, Containing: {2}", lobbyID, userID, Encoding.UTF8.GetString(data));
};
```

## OnSpeaking

Fires when a user connected to voice starts or stops speaking.

###### Parameters

| name     | type  | description                                             |
| -------- | ----- | ------------------------------------------------------- |
| lobbyId  | Int64 | lobby the user is connected to                          |
| userId   | Int64 | user in voice                                           |
| speaking | bool  | `true` == started speaking, `false` == stopped speaking |

###### Example

```cs
lobbyManager.OnSpeaking += (lobbyID, userID, speaking) =>
{
  Console.WriteLine("lobby speaking: {0} {1} {2}", lobbyID, userID, speaking);
};
```

## Connecting to Lobbies

In the preceding section, you probably noticed there are a couple of different methods for connecting to a lobby: `Connect()` and `ConnectWithActivitySecret()`. Lobbies in Discord are even more useful when hooked together with Activities/Rich Presence functionality; they give you everything you need to create an awesome game invite system.

If you are creating lobbies for users in the game client and not on a backend server, consider using `GetLobbyActivitySecret` and `ConnectWithActivitySecret()`. `GetLobbyActivitySecret()` will return you a unique secret for the lobby concatenated with the lobby's id. You can pipe this value directly to the `Secrets.Join` field of the `Activity` payload. Then, when a user receives the secret, their client can call `ConnectWithActivitySecret()` with just the secret; the lobby id is parsed out automatically. This saves you the effort of concatenating the secret + id together yourself and then parsing them out again. As a code example:

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var lobbyManager = discord.GetLobbyManager();
var activityManager = discord.GetActivityManager();

// Create a lobby
var txn = lobbyManager.GetLobbyCreateTransaction();
txn.SetCapacity(5);
txn.SetType(Discord.LobbyType.Private);

lobbyManager.CreateLobby(txn, (result, lobby) =>
{
  // Get the sepcial activity secret
  var secret = lobbyManager.GetLobbyActivitySecret(lobby.id);

  // Create a new activity
  // Set the party id to the lobby id, so everyone in the lobby has the same value
  // Set the join secret to the special activity secret
  var activity = new Discord.Activity
  {
    Party =
    {
      Id = lobby.id,
      Size = {
        CurrentSize = 1,
        MaxSize = 5
      }
    },
    Secrets =
    {
      Join = secret
    }
  };

  activityManager.UpdateActivity(activity, (result) =>
  {
    // Now, you can send chat invites, or others can ask to join
    // When other clients receive the OnActivityJoin() event, they'll receive the special activity secret
    // They can then directly call lobbyManager.ConnectLobbyWithActivitySecret() and be put into the lobby together
  })
});
```

If you are creating lobbies with your own backend system (see the section below), this method may not be useful for you. In that case, you can use `Connect()` and pass the lobby id and secret as you normally would. If you're hooking up to Activities, just make sure you send both the lobby secret and the lobby id in the `Secrets.Join` field, so anyone who tries to join has the right data.

### Example: Search for a Lobby, Connect, and Join Voice

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

// Search lobbies.
var query = lobbyManager.GetSearchQuery();

// Filter by a metadata value.
query.Filter("metadata.ELO", Discord.LobbySearchComparison.EqualTo, Discord.LobbySearchCast.Number, "1337");

// Only return 1 result max.
query.Limit(1);

lobbyManager.Search(query, () =>
{
  Console.WriteLine("search returned {0} lobbies", lobbyManager.LobbyCount());

  if (lobbyManager.LobbyCount() == 1)
  {
    Console.WriteLine("first lobby: {0}", lobbyManager.GetLobbyId(0));
  }

  // Get the id of the lobby, and connect to voice
  var id = lobbyManager.GetLobbyId(0);
  lobbyManager.ConnectVoice(id, (result) =>
  {
    Console.WriteLine("Connected to voice!");
  });
});
```

## Example: Crossplayish

So, an explanation. Because the DLL that you ship with your game is a stub that calls out to the local Discord client for actual operations, the SDK does not necessarily care if the game was launched from Discord. As long as the player launching the game:

1.  Has Discord installed
2.  Has a Discord account
3.  Has logged into Discord on their machine (whether or not Discord is open)

The SDK will function as if the game were launched from Discord, and everything will work; if Discord is not currently launched, the SDK will launch it.

That means that if Player A is launching Your Amazing Game from Discord and Player B is launching it from Other Cool But Not As Cool As Discord Game Store, as long as Player B meets the above criteria, both players can play with each other using Discord's lobbies + networking functions. If the SDK is not able to launch Discord for Player B—maybe they've never installed/used Discord before!—you'll get an error saying as much. We're not saying what you _should_ do, but hey, wouldn't this make a really neat in-game touchpoint for your players to join their friends on Discord, and maybe even join your game's [verified server](https://discord.com/verification)?

OK, so this wasn't really a code example, but I think you get how this works.

## The API Way

Below are the API endpoints and the parameters they accept. If you choose to interface directly with the Discord API, you will need a "Bot token". This is a special authorization token with which your application can access Discord's HTTP API. Head on over to [your app's dashboard](https://discord.com/developers/), and hit the big "Add a Bot User" button. From there, mutter _abra kadabra_ and reveal the token. This token is used as an authorization header against our API like so:

```
curl -x POST -h "Authorization: Bot <your token>" https://discord.com/api/some-route/that-does-a-thing
```

> info
> Make sure to prepend your token with "Bot"!

Here are the routes; they all expect JSON bodies. Also, hey, while you're here. You've got a bot token. You're looking at our API. You should check out all the other [awesome stuff](https://discord.com/developers/docs/intro) you can do with it!

### Create Lobby

`POST https://discord.com/api/v6/lobbies`

Creates a new lobby. Returns an object similar to the SDK `Lobby` struct, documented below.

To get a list of valid regions, call the [List Voice Regions](https://discord.com/developers/docs/resources/voice#list-voice-regions) endpoint.

###### Parameters

| name           | type      | description                                                                                          |
| -------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| application_id | string    | your application id                                                                                  |
| type           | LobbyType | the type of lobby                                                                                    |
| metadata       | dict      | metadata for the lobby - key/value pairs with types `string`                                         |
| capacity       | int       | max lobby capacity with a default of 16                                                              |
| region         | string    | the region in which to make the lobby - defaults to the region of the requesting server's IP address |

###### Return Object

```json
{
  "capacity": 10,
  "region": "us-west",
  "secret": "400316b221351324",
  "application_id": "299996444748734465",
  "metadata": {
    "a": "wow",
    "b": "some test metadata"
  },
  "type": 1,
  "id": "469317204969993265",
  "owner_id": "53908232599983680"
}
```

### Update Lobby

`PATCH https://discord.com/api/v6/lobbies/<lobby_id>`

Updates a lobby.

###### Parameters

| name     | type      | description                                                  |
| -------- | --------- | ------------------------------------------------------------ |
| type     | LobbyType | the type of lobby                                            |
| metadata | dict      | metadata for the lobby - key/value pairs with types `string` |
| capacity | int       | max lobby capacity with a default of 16                      |

### Delete Lobby

`DELETE https://discord.com/api/v6/lobbies/<lobby_id>`

Deletes a lobby.

### Update Lobby Member

`PATCH https://discord.com/api/v6/lobbies/<lobby_id>/members/<user_id>`

Updates the metadata for a lobby member.

###### Parameters

| name     | type | description                                                         |
| -------- | ---- | ------------------------------------------------------------------- |
| metadata | dict | metadata for the lobby member - key/value pairs with types `string` |

### Create Lobby Search

`POST https://discord.com/api/v6/lobbies/search`

Creates a lobby search for matchmaking around given criteria.

###### Parameters

| name           | type                | description                              |
| -------------- | ------------------- | ---------------------------------------- |
| application_id | string              | your application id                      |
| filter         | SearchFilter object | the filter to check against              |
| sort           | SearchSort object   | how to sort the results                  |
| limit          | int                 | limit of lobbies returned, with a default of 25 |

###### SearchFilter Object

| name       | type             | description                                       |
| ---------- | ---------------- | ------------------------------------------------- |
| key        | string           | the metadata key to search                        |
| value      | string           | the value of the metadata key to validate against |
| cast       | SearchCast       | the type to cast `value` as                       |
| comparison | SearchComparison | how to compare the metadata values                |

###### SearchComparison Types

| name                     | value |
| ------------------------ | ----- |
| EQUAL_TO_OR_LESS_THAN    | -2    |
| LESS_THAN                | -1    |
| EQUAL                    | 0     |
| EQUAL_TO_OR_GREATER_THAN | 1     |
| GREATER_THAN             | 2     |
| NOT_EQUAL                | 3     |

###### SearchSort Object

| name       | type       | description                                                             |
| ---------- | ---------- | ----------------------------------------------------------------------- |
| key        | string     | the metadata key on which to sort lobbies that meet the search criteria |
| cast       | SearchCast | the type to cast `value` as                                             |
| near_value | string     | the value around which to sort the key                                  |

###### SearchCast Types

| name   | value |
| ------ | ----- |
| STRING | 1     |
| NUMBER | 2     |

### Send Lobby Data

`POST https://discord.com/api/v6/lobbies/<lobby_id>/send`

Sends a message to the lobby, fanning it out to other lobby members.

This endpoint accepts a UTF8 string. If your message is already a string, you're good to go! If you want to send binary, you can send it to this endpoint as a base64 encoded data URI.

###### Parameters

| name | type   | description                                 |
| ---- | ------ | ------------------------------------------- |
| data | string | a message to be sent to other lobby members |

## Integrated Networking

Discord lobbies have the option of being used with a wrapped networking layer, allowing you to start sending packets quickly and easily without needing to do state management around routes, peer IDs, member metadata, and the like.

This layer allows you to easily connect to the network and open channels to all lobby members with one function call. You can then send network messages to users by their user ID, easily retrieved via lobby methods.

We take care of all the route updating for you, so you can get up and running quickly and easily. If you'd like to see how the lower-level networking functionality works or want to try it yourself so you can tweak it to your liking, check out [Networking](#DOCS_GAME_SDK_NETWORKING/);

## ConnectNetwork

Connects to the networking layer for the given lobby ID. Call this when connecting to the lobby.

Returns `void`.

###### Parameters

| name    | type  | description                    |
| ------- | ----- | ------------------------------ |
| lobbyId | Int64 | the ID of the lobby you are in |

###### Example

```cs
lobbyManager.ConnectLobby(lobbyId, (result, lobby) =>
{
  lobbyManager.ConnectNetwork(lobby.Id);
});
```

## DisconnectNetwork

Disconnects from the networking layer for the given lobby ID.

Returns `void`.

###### Parameters

| name    | type  | description                    |
| ------- | ----- | ------------------------------ |
| lobbyId | Int64 | the ID of the lobby you are in |

###### Example

```cs
lobbyManager.DisconnectNetwork(lobby.Id);
```

## FlushNetwork

Flushes the network. Call this when you're done sending messages. In Unity, this should be in `LateUpdate()`.

Returns `void`.

###### Parameters

None

###### Example

```cs
void LateUpdate()
{
  var lobbyManager = discord.GetLobbyManager();
  lobbyManager.FlushNetwork();
}
```

## OpenNetworkChannel

Opens a network channel to all users in a lobby on the given channel number. No need to iterate over everyone!

Returns `void`.

###### Parameters

| name      | type  | description                                          |
| --------- | ----- | ---------------------------------------------------- |
| lobbyId   | Int64 | the ID of the lobby you are in                       |
| channelId | byte  | the channel on which to connect                      |
| reliable  | bool  | whether the channel should be unreliable or reliable |

###### Example

```cs
var lobbyManager = discord.GetLobbyManager();
lobbyManager.ConnectLobby(lobbyId, (result, lobby) =>
{
  lobbyManager.ConnectNetwork(lobby.Id);
  lobbyManager.OpenNetworkChannel(lobby.Id, 0, true);
});
```

## SendNetworkMessage

Sends a network message to the given user ID that is a member of the given lobby ID over the given channel ID.

Returns `void`.

###### Parameters

| name      | type   | description                             |
| --------- | ------ | --------------------------------------- |
| lobbyId   | Int64  | the ID of the lobby you are in          |
| userId    | Int64  | the ID of the user to send a message to |
| channelId | byte   | the channel on which to connect         |
| data      | byte[] | the message to send                     |

###### Example

```cs
var lobbyManager = discord.GetLobbyManager();
lobbyManager.ConnectLobby(lobbyId, (result, lobby) =>
{
  lobbyManager.ConnectNetwork(lobby.Id);
  lobbyManager.OpenNetworkChannel(lobby.Id, 0, true);
  for (int i = 0; i < lobbyManager.MemberCount(); i++)
  {
    var userId = lobbyManager.GetMemberUserId(i);
    lobbyManager.SendNetworkMessage(lobby.Id, userId, 0, System.Text.Encoding.UTF8.GetBytes("Hello!"));
  }
});
```

## OnNetworkMessage

Fires when the user receives a message from the lobby's networking layer.

###### Parameters

| name      | type   | description                             |
| --------- | ------ | --------------------------------------- |
| lobbyId   | Int64  | the ID of the lobby you are in          |
| userId    | Int64  | the ID of the user who sent the message |
| channelId | byte   | the channel the message was sent on     |
| data      | byte[] | the message                             |

## Example: Networking the Easy Way

```cs
// We can create a helper method to easily connect to the networking layer of the lobby
public void InitNetworking(Int64 lobbyId)
{
  // First, connect to the lobby network layer
  var lobbyManager = discord.GetLobbyManager();
  lobbyManager.ConnectNetwork(lobbyId);

  // Next, deterministically open our channels
  // Reliable on 0, unreliable on 1
  lobbyManager.OpenNetworkChannel(lobbyId, 0, true);
  lobbyManager.OpenNetworkChannel(lobbyId, 1, false);

  // We're ready to go!
}

// Let's say we got a game invite from Rich Presence
activityManager.OnActivityJoin += secret =>
{
  var lobbyManager = discord.GetLobbyManager();
  lobbyManager.ConnectLobbyWithActivitySecret(secret, (Discord.Result result, ref Discord.Lobby lobby) =>
  {
    // Connect to networking
    InitNetworking(lobby.Id);

    // Say hello!
    for (int i = 0; i < lobbyManager.MemberCount(); i++)
    {
      var userId = lobbyManager.GetMemberUserId(i);
      lobbyManager.SendNetworkMessage(lobby.Id, userId, 0, System.Text.Encoding.UTF8.GetBytes("Hello!"));
    }
  });
}
```
