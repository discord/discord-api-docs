# Networking

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Need a networking layer? Have a networking layer! This manager handles all things packets so you can get data from player to player and make your multiplayer...work. It:

- Functions as a connection-oriented, TCP-like API, but over UDP!
- Supports "reliable" and "unreliable" connections
  - Packets with loot in them always get there, but player positioning can be eventually consistent
- Features P2P-like connections, but routed through Discord's high-end server infrastructure
  - All the benefits of direct connections, without the IP leaks!
- Is encrypted!

An important note to make here is that our networking layer **is not peer-to-peer**. Discord has always promised that we will not leak your IP, and we promise to keep it that way. Though it seems like you are connected directly to another user, it routes through Discord's servers in the middle, ensuring both security and robust networking thanks to our servers.

## GetPeerId

Get the unique networking peerId for the current user. Each user has a unique id for that session, used for connecting to that user.

Returns a `UInt64`.

###### Parameters

None

###### Example

```cs
var sid = networkManager.GetSessionId();
```

## Flush

Flushes the network. Run this at the end of your game's loop, once you've finished sending all you need to send. In Unity, for example, stick this in `LateUpdate()`.

Returns `void`.

###### Parameters

None

###### Example

```cs
OnLateUpdate()
{
  networkManager.Flush();
}
```

## OpenChannel

Opens a channel to a user with their given peer on the given channel number.

Unreliable channels—`reliable = false`—should be used for loss-tolerant data, like player positioning in the world. Reliable channels—`reliable = true`—should be used for data that _must_ get to the user, like loot drops!

Returns `void`.

###### Parameters

| name      | type   | description                                          |
| --------- | ------ | ---------------------------------------------------- |
| peerId    | UInt64 | the peerId of the user to connect to                 |
| channelId | byte   | the channel on which to connect                      |
| reliable  | bool   | whether the channel should be unreliable or reliable |

###### Example

```cs
// In reality, you'd fetch this from their lobby metadata
var playerAPeerId = 1234;
networkManager.OpenChannel(playerAPeerId, 0, false);
```

## ConnectPeer

Opens a network connection to another Discord user.

Returns `void`.

###### Parameters

| name   | type   | description                                  |
| ------ | ------ | -------------------------------------------- |
| peerId | UInt64 | the peerId of the user to connect to         |
| route  | byte[] | the route the user is currently broadcasting |

###### Example

```cs
networkManager.OpenRemote(1, 2222);
```

## UpdatePeer

Updates the network connection to another Discord user. This should be called after an `OnRouteChange` event so that your connection to a user is updated to reflect the new route.

Returns `void`.

###### Parameters

| name   | type   | description                |
| ------ | ------ | -------------------------- |
| peerId | UInt64 | the user's peerId          |
| route  | byte[] | the new route for the user |

###### Example

```cs
networkManager.OnRouteUpdate += (route) =>
{
  // Should I have user info here?
  networkManager.UpdateRoute(, route);
}
```

## SendMessage

Sends data to a given sessionid through the given channel.

Returns `void`.

###### Parameters

| name            | type   | description                     |
| --------------- | ------ | ------------------------------- |
| remoteSessionId | UInt64 | the session id to connect to    |
| channelId       | byte   | the channel on which to connect |
| data            | byte[] | the data to send                |

###### Example

```cs
// In reality, you'd fetch this from their lobby metadata
var playerAPeerId = 1234;

byte[] lootDrops = GameEngine.GetLootData();
networkManager.SendMessage(playerAPeerId, 1, lootDrops);
```

## CloseChannel

Close the connection to a given user by peerId on the given channel.

Returns `void`.

###### Parameters

| name      | type   | description                               |
| --------- | ------ | ----------------------------------------- |
| peerId    | UInt64 | the peerId of the user to disconnect from |
| channelId | byte   | the route to close                        |

###### Example

```cs
// In reality, you'd fetch this from their lobby metadata
var playerAPeerId = 1234;
networkManager.CloseChannel(playerAPeerId, 0);
Console.WriteLine("Connection to {0} closed", playerAPeerId);
```

## DisconnectPeer

Disconnects the network session to another Discord user.

Returns `void`.

###### Parameters

| name      | type   | description       |
| --------- | ------ | ----------------- |
| peerId    | UInt64 | the user's peerId |
| channelId | byte   | the cu            |

###### Example

```cs
// In reality, you'd fetch this from their lobby metadata
var playerAPeerId = 1234;
networkManager.DisconnectPeer(playerAPeerId, 0);
```

## OnMessage

Fires when you receive data from another user. This callback will only fire if you already have an open channel with the user sending you data. Make sure you're running `RunCallbacks()` in your game loop, or you'll never get data!

###### Parameters

| name            | type   | description                  |
| --------------- | ------ | ---------------------------- |
| senderSessionId | UInt64 | the session id of the sender |
| channel         | byte   | the channel it was sent on   |
| data            | byte[] | the data sent                |

###### Example

```cs
OnMessage += (senderSessionId, channel, data) =>
{
  var stringData = Encoding.UTF8.GetString(data);
  Console.WriteLine("Message from {0}: {1}", senderSessionId, stringData)
}
```

## OnRouteUpdate

Fires when the networking route to the user has changed. You should then call `UpdateRoute()` for that user.

###### Parameters

| name  | type   | description               |
| ----- | ------ | ------------------------- |
| route | byte[] | the new route to the user |

###### Example

```cs
OnRouteUpdate+= (route) =>
{
  networkManager.UpdateRoute(1, route);
}
```

## Flush vs RunCallbacks

A quick note here may be helpful for the two functions that should be called continuously in your game loop: `discord.RunCallbacks()` and `networkManager.Flush()`. `RunCallbacks()` pumps the SDK's event loop, sending any newly-received data down the SDK tubes to your game. For this reason, you should call it at the beginning of your game loop; that way, any new data is handled immediately by callbacks you've registered. In Unity, for example, this goes in `Update()`.

`Flush()` is specific to the network manager. It actually _writes_ the packets out to the stream. You should call this at the _end_ of your game loop as a way of saying "OK, I'm done with networking stuff, go send all the stuff to people who need it". In Unity, for example, this goes in `LateUpdate()`.

## Connecting to Each Other

This manager is built around the concept of routes between players, and then channels on those routes. Player A opens a route to Player B. This route will often change as our scaled networking system works to find the best networking path between those players. As that route changes, the player will receive `OnRouteUpdate` events. They should then alert other lobby members that their route has changed by updating their lobbymetadata. Other lobby members will see those updates from the `OnLobbyMemberUpdate` event, and can call `UpdateRoute()` accordingly. A user's route could change frequently, so architect your system anticipating frequent route changes and updates.

Once Player A has a route open to Player B, Player A then opens a channel to Player B, and Player B does the same to Player A. Channels are the pipes down which data is actually sent. These two users can now send data back and forth to each other with `SendMessage()` and receive it with `OnMessage`.

In order to properly send and receive data between A and B, both users need to have **the same type of channel** open to each other **on the same channel number**. If A has Reliable Channel 4 open to B, B also needs Reliable Channel 4 open to A. There are many ways to keep track of this; utilizing metadata on the lobby is one great way.

## Example: Connecting to Another Player in a Lobby

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

// Join a lobby with another user in it
// Get their peer id, and connect to them

var networkManager = discord.GetNetworkManager();
var lobbyManager = discord.GetLobbyManager();
var userManager = discord.GetUserManager();

var me;
var otherUserPeerId;
var lobbyId;

// Get yourself
userManager.GetCurrentUser((user) =>
{
  me = user;
});

// This will fire once you connect to the lobby
// Telling you which route is yours
networkManager.OnRouteUpdate += route =>
{
  var txn = lobbyManager.GetMemberTransaction();
  txn.SetMetadataString("route", route);
  lobbyManager.UpdateMember(lobbyId, me.Id, txn, (result =>
  {
    // Who needs error handling anyway
    Console.WriteLine(result);
  }))
}

// When other users get new routes, they'll update their metadata
// Fetch it and update their route
lobbyManager.OnMemberUpdate += (lobbyId, userId) =>
{
  var peerId = lobbyManager.GetMemberMetadata(lobbyId, userId, "peer_id");
  var newRoute = lobbyManager.GetMemberMetadata(lobbyId, userId, "route");
  lobbyManger.UpdateRoute(peerId, newRoute);
}

// Connect to lobby with an id of 12345 and a secret of "password"
lobbyManager.Connect(12345, "password", (lobby) =>
{
  lobbyId = lobby.Id;

  // Add our own peer id to our lobby member metadata
  // So other users can get it to connect to us
  var txn = lobbyManager.CreateMemberTransaction();
  txn.SetMetadataString("peer_id", networkManager.GetPeerId());
  lobbyManager.UpdateMember(lobby.Id, me.Id, txn, (result) =>
  {
    // Who needs error handling anyway
    Console.WriteLine(result);
  }

  // Get the first member in the lobby, assuming someone is already there
  var member = lobbyManager.GetMemberUserId(lobby.Id, 0);

  // Get their peer id and route from their metadata, added previously
  otherUserPeerId = lobbyManager.GetMemberMetadata(lobby.Id, member.Id, "peer_id");
  var otherRoute = lobbyManager.GetMemberMetadata(lobby.Id, member.Id, "route");

  // Connect to them
  lobbyManager.OpenRoute(otherUserPeerId, otherRoute);

}

// Open an unreliable channel to the user on channel 0
// And a reliable one on channel 1
networkManager.OpenChannel(otherUserPeerId, 0, false);
networkManager.OpenChannel(otherUserPeerId, 1, true);

// An important data packet from our game engine
byte[] data = GameEngine.GetImportantData();

if (isDataAboutPlayerLootDrops(data))
{
  // This is important and has to get there
  // Send over reliable channel
  networkManager.SendMessage(otherUserPeerId, 1, data);
}
else
{
    // This is eventually consistent data, like the player's position in the world
    // It can be sent over the unreliable channel
    networkManager.SendMessage(otherUserPeerId, 0, data);
}

// Done; ship it!
networkManager.Flush();
```
