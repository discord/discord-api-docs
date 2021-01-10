# Networking

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

A note before starting: this documentation covers the "low layer" networking level of the Discord GameSDK. What that means is that using the network manager directly affords you the flexibility to update routes, open channels, and handle events directly emitted by the SDK. If you're looking for something a bit easier and faster to integrate, we recommend that you check out the networking wrapper around our lobby documentation: [Integrated Networking](#DOCS_GAME_SDK_LOBBIES/integrated-networking)

Need a networking layer? Have a networking layer! This manager handles all things packets so you can get data from player to player and make your multiplayer...work. It:

- Functions as a connection-oriented, TCP-like API, but over UDP!
- Supports "reliable" and "unreliable" connections
  - Packets with loot in them always get there, but player positioning can be eventually consistent
- Features P2P-like connections, but routed through Discord's high-end server infrastructure
  - All the benefits of direct connections, without the IP leaks!
- Is encrypted!

An important note to make here is that our networking layer **is not peer-to-peer**. Discord has always promised that we will not leak your IP, and we promise to keep it that way. Though it seems like you are connected directly to another user, it routes through Discord's servers in the middle, ensuring both security and robust networking thanks to our servers.

## GetPeerId

Get the networking peer ID for the current user, allowing other users to send packets to them.

Returns a `UInt64`.

###### Parameters

None

###### Example

```cs
var myPeerId = networkManager.GetPeerId();
```

## Flush

Flushes the network. Run this at the end of your game's loop once you've finished sending all you need to send. In Unity, for example, stick this in `LateUpdate()`.

Returns `void`.

###### Parameters

None

###### Example

```cs
void LateUpdate()
{
  networkManager.Flush();
}
```

## OpenChannel

Opens a channel to a user with their given peer ID on the given channel number.

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
var userId = 53908232506183680;
var lobbyId = 290926798626357250;

var rawPeerId = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "metadata.peer_id");
// Metadata is stored as a string, so we need to make it an integer for OpenChannel
var peerId = System.Convert.ToUInt64(rawPeerId);
networkManager.OpenChannel(peerId, 0, false);
```

## OpenPeer

Opens a network connection to another Discord user.

Returns `void`.

###### Parameters

| name   | type   | description                                  |
| ------ | ------ | -------------------------------------------- |
| peerId | UInt64 | the peerId of the user to connect to         |
| route  | string | the route the user is currently broadcasting |

###### Example

```cs
var userId = 53908232506183680;
var lobbyId = 290926798626357250;

var rawPeerId = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "metadata.peer_id");
// Metadata is stored as a string, so we need to make it an integer for OpenChannel
var peerId = System.Convert.ToUInt64(rawPeerId);
var route = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "metadata.route");
networkManager.OpenPeer(peerId, route);
```

## UpdatePeer

Updates the network connection to another Discord user. You'll want to call this when notified that the route for a user to which you are connected has changed, most likely from a lobby member update event.

Returns `void`.

###### Parameters

| name   | type   | description                |
| ------ | ------ | -------------------------- |
| peerId | UInt64 | the user's peerId          |
| route  | string | the new route for the user |

###### Example

```cs
lobbyManager.OnMemberUpdate += (lobbyId, userId) =>
{
  var rawPeerId = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "metadata.peer_id");
  // Metadata is stored as a string, so we need to make it an integer for OpenChannel
  var peerId = System.Convert.ToUInt64(rawPeerId);
  var newRoute = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "metadata.route");
  networkManager.UpdatePeer(peerId, newRoute);
}
```

## SendMessage

Sends data to a given peer ID through the given channel.

Returns `void`.

###### Parameters

| name      | type   | description                     |
| --------- | ------ | ------------------------------- |
| peerId    | UInt64 | the peer id to connect to       |
| channelId | byte   | the channel on which to connect |
| data      | byte[] | the data to send                |

###### Example

```cs
var userId = 53908232506183680;
var lobbyId = 290926798626357250;
var rawPeerId = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "metadata.peer_id");
// Metadata is stored as a string, so we need to make it an integer for OpenChannel
var peerId = System.Convert.ToUInt64(rawPeerId);

byte[] lootDrops = GameEngine.GetLootData();
networkManager.SendMessage(peerId, 1, lootDrops);
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
var userId = 53908232506183680;
var lobbyId = 290926798626357250;

var rawPeerId = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "metadata.peer_id");
// Metadata is stored as a string, so we need to make it an integer for OpenChannel
var peerId = System.Convert.ToUInt64(rawPeerId);
networkManager.CloseChannel(peerId, 0);
Console.WriteLine("Channel {0} to {1} closed", 0, peerId);
```

## ClosePeer

Disconnects the network session to another Discord user.

Returns `void`.

###### Parameters

| name   | type   | description       |
| ------ | ------ | ----------------- |
| peerId | UInt64 | the user's peerId |

###### Example

```cs
var userId = 53908232506183680;
var lobbyId = 290926798626357250;

var rawPeerId = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "metadata.peer_id");
// Metadata is stored as a string, so we need to make it an integer for OpenChannel
var peerId = System.Convert.ToUInt64(rawPeerId);
networkManager.ClosePeer(peerId);
Console.WriteLine("Connection to {0} closed", peerId);
```

## OnMessage

Fires when you receive data from another user. This callback will only fire if you already have an open channel with the user sending you data. Make sure you're running `RunCallbacks()` in your game loop, or you'll never get data!

###### Parameters

| name      | type   | description                |
| --------- | ------ | -------------------------- |
| peerId    | UInt64 | the peer id of the sender  |
| channelId | byte   | the channel it was sent on |
| data      | byte[] | the data sent              |

###### Example

```cs
networkManager.OnMessage += (peerId, channel, data) =>
{
  var stringData = Encoding.UTF8.GetString(data);
  Console.WriteLine("Message from {0}: {1}", peerId, stringData)
}
```

## OnRouteUpdate

Fires when your networking route has changed. You should broadcast to other users to whom you are connected that this has changed, probably by updating your lobby member metadata for others to receive.

###### Parameters

| name  | type   | description               |
| ----- | ------ | ------------------------- |
| route | string | the new route to the user |

###### Example

```cs
networkManager.OnRouteUpdate += route =>
{
  var currentUser = userManager.GetCurrentUser();
  var lobbyId = 290926798626357250;

  var txn = lobbyManager.GetMemberUpdateTransaction(lobbyId, currentUser.Id);
  txn.SetMetadata("route", route);
  lobbyManager.UpdateMember(lobbyId, currentUser.Id, txn, (result) =>
  {
    // Who needs error handling anyway
    Console.WriteLine(result);
  });
}
```

## Flush vs. RunCallbacks

A quick note here may be helpful for the two functions that should be called continuously in your game loop: `discord.RunCallbacks()` and `networkManager.Flush()`. `RunCallbacks()` pumps the SDK's event loop, sending any newly-received data down the SDK tubes to your game. For this reason, you should call it at the beginning of your game loop; that way, any new data is handled immediately by callbacks you've registered. In Unity, for example, this goes in `Update()`.

`Flush()` is specific to the network manager. It actually _writes_ the packets out to the stream. You should call this at the _end_ of your game loop as a way of saying, "OK, I'm done with networking stuff, go send all the stuff to people who need it". In Unity, for example, this goes in `LateUpdate()`.

## Connecting to Each Other

This manager is built around the concept of routes between players and then channels on those routes. Player A opens a route to Player B. This route will change, most commonly if the user's external IP address changes. As that route changes, the player will receive `OnRouteUpdate` events. They should then alert other lobby members that their route has changed by updating their lobbymetadata. Other lobby members will see those updates from the `OnLobbyMemberUpdate` event and can call `UpdateRoute()` accordingly. A user's route could change frequently, so architect your system anticipating frequent route changes and updates.

Once Player A has a route open to Player B, Player A then opens a channel to Player B, and Player B does the same to Player A. Channels are the pipes down which data is actually sent. These two users can now send data back and forth to each other with `SendMessage()` and receive it with `OnMessage`.

In order to properly send and receive data between A and B, both users need to have **the same type of channel** open to each other **on the same channel number**. If A has Reliable Channel 4 open to B, B also needs Reliable Channel 4 open to A.

## Example: Connecting to Another Player in a Lobby

```cs
var discord = new Discord.Discord(clientId, (UInt64)Discord.CreateFlags.Default);

// Join a lobby with another user in it
// Get their peer id and connect to them

var networkManager = discord.GetNetworkManager();
var lobbyManager = discord.GetLobbyManager();
var userManager = discord.GetUserManager();

Discord.User currentUser;
var otherUserPeerId;
var lobbyId;

// Get yourself
currentUser = userManager.GetCurrentUser();

// This will fire once you connect to the lobby
// Telling you which route is yours
networkManager.OnRouteUpdate += route =>
{
  var txn = lobbyManager.GetMemberUpdateTransaction(lobbyId, currentUser.Id);
  txn.SetMetadata("route", route);
  lobbyManager.UpdateMember(lobbyId, currentUser.Id, txn, (result =>
  {
    // Who needs error handling anyway
    Console.WriteLine(result);
  }))
}

// When other users get new routes, they'll update their metadata
// Fetch it and update their route
lobbyManager.OnMemberUpdate += (lobbyId, userId) =>
{
  var rawPeerId = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "peer_id");
  // Metadata is stored as a string, so we need to make it an integer for OpenChannel
  var peerId = System.Convert.ToUInt64(rawPeerId);
  var newRoute = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "route");
  lobbyManager.UpdatePeer(peerId, newRoute);
}

// Connect to lobby with an id of 12345 and a secret of "password"
// This may occur in a generated lobby search when a user needs to input a password to connect
lobbyManager.ConnectLobby(12345, "password", (Discord.Result x, ref Discord.Lobby lobby) =>
{
  lobbyId = lobby.Id;

  // Add our own peer id to our lobby member metadata
  // So other users can get it to connect to us
  var localPeerId = Convert.ToString(networkManager.GetPeerId());
  var txn = lobbyManager.GetMemberUpdateTransaction(lobby.Id, currentUser.Id);
  txn.SetMetadata("peer_id", localPeerId);
  lobbyManager.UpdateMember(lobby.Id, currentUser.Id, txn, (result) =>
  {
    // Who needs error handling anyway
    Console.WriteLine(result);
  });

  // Get the first member in the lobby, assuming someone is already there
  var memberId = lobbyManager.GetMemberUserId(lobby.Id, 0);

  // Get their peer id and route from their metadata, added previously
  var rawPeerId = lobbyManager.GetMemberMetadataValue(lobbyId, userId, "peer_id");
  // Metadata is stored as a string, so we need to make it an integer for OpenChannel
  otherUserPeerId = System.Convert.ToUInt64(rawPeerId);
  var otherRoute = lobbyManager.GetMemberMetadataValue(lobby.Id, memberId, "route");

  // Connect to them
  networkManager.OpenPeer(otherUserPeerId, otherRoute);

}

// Open an unreliable channel to the user on channel 0
// And a reliable one on channel 1
networkManager.OpenChannel(otherUserPeerId, 0, false);
networkManager.OpenChannel(otherUserPeerId, 1, true);

// An important data packet from our game engine
byte[] data = GameEngine.GetImportantData();

// Determine if that data is about Player Loot Drops; if so, send it on reliable; if not send it on unreliable
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
