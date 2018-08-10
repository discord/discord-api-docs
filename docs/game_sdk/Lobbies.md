# Lobbies

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Looking to integrate multiplayer into your game? Lobbies are a great way to organize players into contexts to play together. This manager works hand in hand with the networking layer of our SDK to make multiplayer integrations a breeze by:

- Creating, managing, and joining lobbies
- Matchmaking users based on lobby metadata, like ELO
- Getting and setting arbitrary metadata on lobbies and lobby members

Lobbies in Discord work in one of two ways. By using calls from the SDK, lobbies are effectively "owned" by the user who's client creates the lobby. Someone boots up the game, hits your "Create Lobby" button, and their game client calls `lobbiesManager.CreateLobby()` from the Discord SDK.

There is also another way to create and "own" lobbies with which the source of truth can be your own server. These SDK functions calls map to API endpoints that are exposed in Discord's HTTP API. In lieu of creating and managing lobbies in the SDK, you can call those endpoints directly with a token for your application and take care of it all on some far-away, totally secure server. Let's go over the SDK first.

## The SDK Way

In order to ensure that Discord lobbies are consistent for all players, this manager works with "transactions". A `LobbyTransaction` is needed to set lobby properties, like capacity. A `MemberTransaction` is needed to set lobby member properties, like metadata.

To update a user or a lobby, create or get a transaction for that resource, call the needed methods on it, and then pass it to the `Create()` or `Update()` methods. When passed to a `Create()` or `Update()` method, the transaction objected is consumed. So, if you want to do another `Create()` or `Update()`, you need to get a new transaction.

### Example: Creating a Lobby

```cs
var lobbiesManager = Discord.CreateLobbiesManager();

// Create the transaction
var txn = lobbiesManager.CreateLobbyTransaction();

// Set lobby information
txn.SetCapacity(6);
txn.SetType(Discord.LobbyType.Public);
txn.SetMetadata("a", "123");

// Create it!
lobbiesManager.CreateLobby(txn, (Discord.Result result, ref Discord.Lobby lobby) =>
{
  Console.WriteLine("lobby {0} created with secret {1}", lobby.Id, lobby.Secret);

  // We want to update the capacity of the lobby
  // So we get a new transaction for the lobby
  var newTxn = lobbiesManager.GetLobbyTransaction(lobby.id);
  newTxn.SetCapacity(5);

  lobbiesManager.UpdateLobby(lobby.id, newTxn, (Discord.Result result, ref Discord.Lobby newLobby) =>
  {
    Console.WriteLine("lobby {0} updated", newLobby.Id);
  });
});
```

### Data Models

```cs
enum LobbyType
{
  Private = 1,
  Public = 2,
};

struct Lobby
{
  Int64 Id;
  LobbyType Type;
  Int64 OwnerId;
  string Secret;
  UInt32 Capacity;
};

enum LobbySearchComparison
{
  LessThanOrEqual = -2,
  LessThan = -1,
  Equal = 0,
  GreaterThan = 1,
  GreaterThanOrEqual = 2,
  NotEqual = 3
};

enum LobbySearchCast
{
  String = 1,
  Number
};

struct LobbyTransaction
{
  void SetType(LobbyType type);
  // Marks a lobby private or public

  void SetOwner(Int64 userId);
  // Marks a new user as the lobby owner

  void SetCapacity(UInt32 capacity);
  // Sets the maximum lobby size

  void SetMetadata(string key, string value);
  // Sets arbitrary metadata on the lobby

  void DeleteMetadata(string key);
  // Deletes lobby metadata by key
};

struct LobbyMemberTransaction
{
  void SetMetadata(string key, string value);
  // Sets arbitrary metadata on a user

  void DeleteMetadata(string key);
  // Deletes user metadata by key
};

struct LobbySearch
{
  void Filter(string key, LobbySearchComparison comp, LobbySearchCast cast, string value);
  // Filters lobbies based on metadata comparison
  // Available filter values are owner_id, capacity, slots, and metadata
  // If you are filtering based on metadata, make sure you prepend your key with "metadata."
  // For example, filtering on matchmaking rating would be "metadata.matchmaking_rating"
  // Example:
  // var query = LobbiesManager.create_lobby_search();
  // query.LobbySearchFilter("metadata.matchmaking_rating", LobbySearchComparison.GreaterThan, LobbySearchCast.Number, "455");

  void Sort(string key, LobbySearchCast cast, string value);
  // Sorts available lobbies based on metadata "near-ness" to a given value
  // Example: query.LobbySearchSort("metadata.ELO", LobbySearchCast.Number, "1337");

  void Limit(UInt32 limit);
  // Limits the number of lobbies returned in a search
}
```

### Methods

```cs
LobbyTransaction CreateLobbyTransaction();
// Returns a new lobby transaction

LobbyTransaction GetLobbyTransaction(int lobbyId);
// Returns the transaction for a given lobby

LobbyMemberTransaction GetMemberTransaction(Int64 lobbyId, Int64 userId);
// Returns a new member transaction for a user

void CreateLobby(LobbyTransaction transaction, (Discord.Result result, Lobby lobby) =>
{
  // Creates a lobby
  // Note that creating a lobby auto-joins the connected member to it
  // Remember - no SetOwner in this transaction!
});

void UpdateLobby(Int64 lobbyId, LobbyTransaction transaction, (Discord.Result result) =>
{
  // Updates a lobby
  // You can safely SetOwner in here, though
});

void DeleteLobby(int lobbyId, (Discord.Result result) =>
{
  // Deletes a lobby
});

void Connect(Int64 lobbyId, string lobbySecret, (Discord.Result result, Lobby lobby) =>
{
  // Connects the current user to a lobby
  // Requires both the secret and the lobby ID
  // You can be connected to up to 5 lobbies at a time
});

void ConnectWithActivitySecret(string activitySecret, (Discord.Result result, ref Lobby Lobby) =>
{
  // Connects the current user to a lobby
  // Requires the special activity secret
  // Retrieved from GetLobbyActivitySecret()
});

string GetLobbyActivitySecret(Int64 lobbyId);
// Returns a unique secret for the given lobby concatenated with the lobby id
// If you are creating lobbies from game clients, use this to easily interact with Rich Presence invites
// Set the returned secret to your activity's JoinSecret

void Disconnect(Int64 lobbyId, (Discord.Result result) =>
{
  // Disconnects the current user from a lobby
});

Lobby GetLobby(Int64 lobbyId);
// Returns the lobby object for the given id

Int32 GetLobbyMetadataCount(Int64 lobbyid);
// Returns the number of metadata pairs on the given lobby
// Used for accessing metadata by iterating over a list

string GetLobbyMetadataKey(Int64 lobbyId, Int32 index);
// Returns the key for the lobby metadata at the given index

string GetLobbyMetadataValue(Int64 lobbyId, string key);
// Returns lobby metadata value for a key
// Can be used in conjunction with the count and get key functions if you're iterating over metadata
// Or you can access the metadata directly by keyname

Int32 GetMemberCount(Int64 lobbyId);
// Returns the number of members in a lobby

Int64 GetMemberUserId(Int64 lobbyId, Int32 index);
// Returns the userId for a member at the index

User GetMemberUser(Int64 lobbyId, Int64 userId);
// Returns the user info for a userId

Int32 GetMemberMetadataCount(Int64 lobbyid, Int64 userId);
// Returns the number of metadata pairs on the given lobby member
// Used for accessing metadata by iterating over a list

string GetMemberMetadataKey(Int64 lobbyId, Int64 userId Int32 index);
// Returns the key for the lobby metadata at the given index

string GetMemberMetadataValue(Int64 lobbyId, Int64 userId, string key);
// Returns user metadata for a given key
// Can be used in conjunction with the count and get key functions if you're iterating over metadata
// Or you can access the metadata directly by keyname

void UpdateMember(Int64 lobbyId, Int64 userId, MemberTransaction transaction, (Discord.Result result) =>
{
  // Updates info for a lobby member
});

void Send(int lobbyId, byte[] data);
// Sends a message to the lobby on behalf of the current user
// You must be connected to the lobby you are sending a message to

LobbySearch CreateLobbySearch();
// Creates a search object to search available lobbies

void Search(LobbySearch search, () =>
{
  // Searches available lobbies based on the search criteria
  // Lobbies that meet criteria are available within the context of the callback
});

Int32 GetLobbyCount();
// Returns the number of lobbies that match the search

Int64 GetLobbyId(Int32 index);
// Returns the id for the lobby at the given index

void VoiceConnect(Int64 lobbyId, (Discord.Result result) =>
{
  // Connect to the voice channel of the current lobby
});

void VoiceDisconnect(Int64 lobbyId, (Discord.Result result) =>
{
  // Disconnect from the voice channel of the current lobby
});
```

### Callbacks

```cs
OnLobbyUpdate+= (Int64 lobbyId) =>
{
  // Fired when the lobby is updated
};

OnLobbyDelete+= (Int64 lobbyId, string reason) =>
{
  // Fired when the lobby is deleted
};

OnLobbyMemberJoin+= (Int64 lobbyId, int userId) =>
{
  // Fires when a new member joins the lobby
};

OnLobbyMemberUpdate += (Int64 lobbyId, Int64 userId) =>
{
  // Fires when data for a lobby member is updated
};

OnLobbyMemberDisconnect += (Int64 lobbyId, Int64 userId) =>
{
  // Fires when a member leaves the lobby
};

OnLobbyMessage += (Int64 lobbyId, Int64 userId, byte[] data) =>
{
  // Fires when a message is sent to the lobby
  // Turn back into a string with something like Encoding.UTF8.GetString(data);
};

OnLobbySpeaking += (Int64 lobbyId, Int64 userId, bool speaking) =>
{
  // Fires when a user connected to voice starts speaking (true) or stops (false)
};
```

### Connecting to Lobbies

In the preceding section, you probably noticed there are a couple different methods for connecting to a lobby: `Connect()` and `ConnectWithActivitySecret()`. Lobbies in Discord are even more useful when hooked together with Activities/Rich Presence functionality; they give you everything you need to create an awesome game invite system.

If you are creating lobbies for users in the game client, and not on a backend server, consider using `GetLobbyActivitySecret` and `ConnectWithActivitySecret()`. `GetLobbyActivitySecret()` will return you a unique secret for the lobby concatenated with the lobby's id. You can pipe this value directly to the `Secrets.Join` field of the `Activity` payload. Then, when a user receives the secret, their client can call `ConnectWithActivitySecret()` with just the secret; the lobby id is parsed out automatically. This saves you the effort of concatenating the secret + id together yourself and then parsing them out again. As a code example:

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var lobbiesManager = Discord.CreateLobbiesManager();
var activitiesManager = Discord.CreateActivitiesManager();

// Create a lobby
var txn = lobbiesManager.CreateLobbyTransaction();
txn.SetCapacity(5);
txn.SetType(Discord.LobbyType.Private);

lobbiesManager.CreateLobby(txn, (result, lobby) =>
{
  // Get the sepcial activity secret
  var secret = lobbiesManager.GetLobbyActivitySecret(lobby.id);

  // Create a new activity
  // Set the party id to the lobby id, so everyone in the lobby has the same value
  // Set the join secret to the special activity secret
  var activity = new Discord.Activity
  {
    Party = {
      Id = lobby.id,
      Size = {
        CurrentSize = 1,
        MaxSize = 5
      }
    },
    Secrets = {
      Join = secret
    }
  };

  activitiesManager.UpdateActivity(activity, result =<
  {
    // Now, you can send chat invites, or others can ask to join
    // When other clients receive the OnActivityJoin() event, they'll receive the special activity secret
    // They can then directly call lobbiesManager.ConnectWithActivitySecret() and be put into the lobby together
  })
});
```

If you are creating lobbies with your own backend system (see the section below), this method may not be useful for you. In that case, you can use `Connect()` and pass the lobby id and secret as you normally would. If you're hooking up to Activities, just make sure you send both the lobby secret and the lobby id in the `Secrets.Join` field, so anyone who tries to join has the right data.

### Example: Search for a Lobby, Connect, and Join Voice

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

// Search lobbies.
var query = lobbiesManager.CreateLobbySearch();

// Filter by a metadata value.
query.Filter("metadata.ELO", Discord.LobbySearchComparison.EqualTo, Discord.LobbySearchCast.Number, "1337");

// Only return 1 result max.
query.Limit(1);

lobbiesManager.Search(query, (_) =>
{
  Console.WriteLine("search returned {0} lobbies", lobbiesManager.GetLobbyCount());

  if (lobbiesManager.GetLobbyCount() == 1)
  {
    Console.WriteLine("first lobby: {0}", lobbiesManager.GetLobbyId(0));
  }

  // Get the id of the lobby, and connect to voice
  var id = lobbiesManager.GetLobbyId(0);
  lobbiesManager.VoiceConnect(id, (_) =>
  {
    Console.WriteLine("Connected to voice!");
  });
});
```

### Example: Crossplay? In my SDK!?

It's more likely than you think. So, an explanation. Because the DLL that you ship with your game is a stub that calls out to the local Discord client for actual operations, the SDK does not necessarily care if the game was launched from Discord. As long as the player launching the game:

1.  Has Discord installed
2.  Has a Discord account
3.  Has logged into Discord on their machine (whether or not Discord is open)

The SDK will function as if the game were launched from Discord and everything will work; if Discord is not currently launched, the SDK will launch it.

That means that if Player A is launching Your Amazing Game from Discord, and Player B is launching it from Other Cool But Not As Cool As Discord Game Store, as long as Player B meets the above criteria, both players can play with each other using Discord's lobbies + networking functions. If the SDK is not able to launch Discord for Player B—maybe they've never installed/used Discord before!—you'll get an error saying as much. We're not saying what you _should_ do, but hey, wouldn't this make a really neat in-game touchpoint for your players to join their friends on Discord, and maybe even join your game's [verified server](https://discordapp.com/verification)?

OK so this wasn't really a code example, but I think you get how this works.

## The API Way

Below are the API endpoints and the parameters they accept. If you choose to interface directly with the Discord API, you will need a "Bot token". This is a special authorization token with which your application can access Discord's HTTP API. Head on over to [your app's dashboard](https://discordapp.com/developers/), and hit the big "Add a Bot User" button. From there, mutter _abra kadabra_ and reaveal the token. This token is used as an authorization header against our API like so:

```
curl -x POST -h "Authorization: Bot <your token>" https://discordapp.com/api/some-route/that-does-a-thing
```

> Make sure to preprend your token with "Bot"!

Here are the routes; they all expect JSON bodies. Also, hey, while you're here. You've got a bot token. You're looking at our API. You should check out all the other [awesome stuff](https://discordapp.com/developers/docs/intro) you can do with it!

### Create Lobby

`POST https://discordapp.com/api/v6/lobbies`

Creates a new lobby. Returns an object similar to the SDK `Lobby` struct, documented below.

To get a list of valid regions, call the [List Voice Regions](https://discordapp.com/developers/docs/resources/voice#list-voice-regions) endpoint.

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

`PATCH https://discordapp.com/api/v6/lobbies/<lobby_id>`

Updates a lobby.

###### Parameters

| name     | type      | description                                                  |
| -------- | --------- | ------------------------------------------------------------ |
| type     | LobbyType | the type of lobby                                            |
| metadata | dict      | metadata for the lobby - key/value pairs with types `string` |
| capacity | int       | max lobby capacity with a default of 16                      |

### Delete Lobby

`DELETE https://discordapp.com/api/v6/lobbies/<lobby_id>`

Deletes a lobby.

### Update Lobby Member

`PATCH https://discordapp.com/api/v6/lobbies/<lobby_id>/members/<user_id>`

Updates the metadata for a lobby member.

###### Parameters

| name     | type | description                                                         |
| -------- | ---- | ------------------------------------------------------------------- |
| metadata | dict | metadata for the lobby member - key/value pairs with types `string` |

### Create Lobby Search

`POST https://discordapp.com/api/v6/lobbies/search`

Creates a lobby search for matchmaking around given criteria.

###### Parameters

| name           | type                | description                              |
| -------------- | ------------------- | ---------------------------------------- |
| application_id | string              | your application id                      |
| filter         | SearchFilter object | the filter to check against              |
| sort           | SearchSort object   | how to sort the results                  |
| limit          | int                 | limit of lobbies returned, default of 25 |

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

`POST https://discordapp.com/api/v6/lobbies/<lobby_id>/send`

Sends a message to the lobby, fanning it out to other lobby members.

This endpoints accepts a UTF8 string. If your message is already a string, you're good to go! If you want to send binary, you can send it to this endpoint as a base64 encoded data uri.

###### Parameters

| name | type   | description                                 |
| ---- | ------ | ------------------------------------------- |
| data | string | a message to be sent to other lobby members |
