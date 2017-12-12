# Gateways

Gateways are Discord's form of real-time communication over secure websockets. Clients will receive events and data over the gateway they are connected to and send data over the REST API. The API for interacting with Gateways is complex and fairly unforgiving, therefore its highly recommended you read _all_ of the following documentation before writing a custom implementation.

The Discord Gateway has a versioning system which is separate from the core APIs. The documentation herein is only for the latest version in the following table, unless otherwise specified.

###### Gateway Versions

| Version | Status |
|---------|--------|
| 6 | Available |
| 5 | Discontinued |
| 4 | Discontinued |

## Topics

1. [Payloads and Opcodes](#DOCS_GATEWAY/payloads)
2. [Encoding and Compression](#DOCS_GATEWAY/encoding-and-compression)
2. [Connecting to the Gateway](#DOCS_GATEWAY/connecting)
3. [Resuming a Disconnected Session](#DOCS_GATEWAY/resuming)
4. [Rate Limits](#DOCS_GATEWAY/rate-limits)
5. [Tracking State](#DOCS_GATEWAY/tracking-state)
6. [Guild Availability](#DOCS_GATEWAY/guild-availability)
7. [Sharding](#DOCS_GATEWAY/sharding)
8. [Commands](#DOCS_GATEWAY/commands)
9. [Events](#DOCS_GATEWAY/events)

## Payloads and Opcodes

###### Gateway Payload Structure

| Field | Type | Description | Present |
|-------|------|-------------|---------|
| op | integer | opcode for the payload | Always |
| d | ?mixed (any JSON value) | event data | Always |
| s | integer | sequence number, used for resuming sessions and heartbeats | Only for Opcode 0 |
| t | string | the event name for this payload | Only for Opcode 0 |

###### Gateway Opcodes

| Code | Name | Client Action | Description |
|------|------|------|-------------|
| 0 | Dispatch | Receive | dispatches an event |
| 1 | Heartbeat | Send/Receive | used for ping checking |
| 2 | Identify | Send | used for client handshake |
| 3 | Status Update | Send | used to update the client status |
| 4 | Voice State Update | Send | used to join/move/leave voice channels |
| 5 | Voice Server Ping | Send | used for voice ping checking |
| 6 | Resume | Send | used to resume a closed connection |
| 7 | Reconnect | Receive | used to tell clients to reconnect to the gateway |
| 8 | Request Guild Members | Send | used to request guild members |
| 9 | Invalid Session | Receive | used to notify client they have an invalid session id |
| 10 | Hello | Receive | sent immediately after connecting, contains heartbeat and server debug information |
| 11 | Heartbeat ACK | Receive | sent immediately following a client heartbeat that was received |


### Sending Payloads

Packets sent from the client to the Gateway API are encapsulated within a [gateway payload object](#DOCS_GATEWAY/sending-payloads-example-gateway-dispatch) and must have the proper opcode and data object set. The payload object can then be serialized in the format of choice (see [ETF/JSON](#DOCS_GATEWAY/encoding-and-compression-etf-json)), and sent over the websocket. Payloads to the gateway are limited to a maximum of 4096 bytes sent, going over this will cause a connection termination with error code 4002.

###### Example Gateway Dispatch

```json
{
	"op": 0,
	"d": {},
	"s": 42,
	"t": "GATEWAY_EVENT_NAME"
}
```

### Receiving Payloads

Receiving payloads with the Gateway API is slightly more complex than sending. When using the JSON encoding with compression enabled, the Gateway has the option of sending payloads as compressed JSON binaries using zlib, meaning your library _must_ detect (see [RFC1950 2.2](https://tools.ietf.org/html/rfc1950#section-2.2)) and decompress these payloads before attempting to parse them. The gateway does not implement a shared compression context between messages sent.

## Encoding and Compression

#### ETF/JSON

When initially creating and handshaking connections to the Gateway, a user can chose whether they wish to communicate over plain-text JSON or binary [ETF](http://erlang.org/doc/apps/erts/erl_ext_dist.html). When using ETF, the client must not send compressed messages to the server. Note that Snowflake IDs are transmitted as 64-bit integers over ETF, but are transmitted as strings over JSON. See [erlpack](https://github.com/discordapp/erlpack) for an implementation example.

#### Payload Compression

When using JSON encoding with payload compression enabled (`compress: true` in identify), the Gateway may optionally send zlib-compressed payloads (see [RFC1950 2.2](https://tools.ietf.org/html/rfc1950#section-2.2)). Your library _must_ detect and decompress these payloads to plain-text JSON before attempting to parse them. If you are using payload compression, the gateway does not implement a shared compression context between messages sent. Payload compression will be disabled if you use transport compression (see below).

#### Transport Compression

Currently the only available transport compression option is `zlib-stream`. You will need to run all received packets through a shared zlib context, as seen in the example below. Every connection to the gateway should use its own unique zlib context.

###### Transport Compression Example

```python
# Z_SYNC_FLUSH suffix
ZLIB_SUFFIX = '\x00\x00\xff\xff'
# initialize a buffer to store chunks
buffer = bytearray()
# create a zlib inflation context to run chunks through
inflator = zlib.decompressobj()

# ...
def on_websocket_message(msg):
  # always push the message data to your cache
  buffer.extend(msg)

  # check if the last four bytes are equal to ZLIB_SUFFIX
  if len(msg) < 4 or msg[-4:] != ZLIB_SUFFIX:
    return

  # if the message *does* end with ZLIB_SUFFIX,
  # get the full message by decompressing the buffers
  msg = inflator.decompress(buffer).decode('utf-8')
  buffer = bytearray()

  # here you can treat `msg` as either JSON or ETF encoded,
  # depending on your `encoding` param
```

## Connecting to the Gateway

### Connecting

###### Gateway URL Params

| Field | Type | Description |
|-------|------|-------------|
| v | integer | Gateway Version to use |
| encoding | string | 'json' or 'etf' |

The first step in establishing connectivity to the gateway is requesting a valid websocket endpoint from the API. This can be done through either the [Get Gateway](#DOCS_GATEWAY/get-gateway) or the [Get Gateway Bot](#DOCS_GATEWAY/get-gateway-bot) endpoint.

With the resulting payload, you can now open a websocket connection to the "url" (or endpoint) specified. Generally, it is a good idea to explicitly pass the gateway version and encoding. For example, we may connect to `wss://gateway.discord.gg/?v=6&encoding=json`.

Once connected, the client should immediately receive an [Opcode 10 Hello](#DOCS_GATEWAY/gateway-hello) payload, with information on the connection's heartbeat interval:

###### Example Gateway Hello

```json
{
	"heartbeat_interval": 45000,
	"_trace": ["discord-gateway-prd-1-99"]
}
```

### Heartbeating

The client should now begin sending [Opcode 1 Heartbeat](#DOCS_GATEWAY/gateway-heartbeat) payloads every `heartbeat_interval` milliseconds, until the connection is eventually closed or terminated:

###### Example Gateway Heartbeat

```json
{
	"op": 1,
	"d": 251
}
```

The inner `d` key must be set to the last seq (`s`) received by the client. If none has yet been received you should send `null`.

This OP code is also bidirectional. The gateway may request a heartbeat from you in some situations, and you should send a heartbeat back to the gateway as you normally would.

>info
>In the event of a service outage where you stay connected to the gateway, you should continue to heartbeat and receive ACKs. The gateway will eventually respond and issue a session once it's able to.

Clients can detect zombied or failed connections by listening for [Opcode 11 Heartbeat ACK](#DOCS_GATEWAY/gateway-heartbeat-ack):

###### Example Gateway Heartbeat ACK

```json
{
	"op": 11
}
```

If a client does not receive a heartbeat ack between its attempts at sending heartbeats, it should immediately terminate the connection with a non-1000 close code, reconnect, and attempt to resume.

### Identifying

Next, the client is expected to send an [Opcode 2 Identify](#DOCS_GATEWAY/gateway-identify):

###### Example Gateway Identify

```json
{
	"token": "my_token",
	"properties": {
		"$os": "linux",
		"$browser": "disco",
		"$device": "disco"
	},
	"compress": true,
	"large_threshold": 250,
	"shard": [1, 10],
	"presence": {
		"game": {
			"name": "Cards Against Humanity",
			"type": 0
		},
		"status": "dnd",
		"since": 91879201,
		"afk": false
	}
}
```

If the payload is valid, the gateway will respond with a [Ready](#DOCS_GATEWAY/ready) event. Your client is now considered in a "connected" state. Clients are limited to 1 identify every 5 seconds; if they exceed this limit, the gateway will respond with an [Opcode 9 Invalid Session](#DOCS_GATEWAY/invalid-session). It is important to note that although the ready event contains a large portion of the required initial state, some information (such as guilds and their members) is sent asynchronously (see [Guild Create](#DOCS_GATEWAY/guild-create) event).

>warn
>Clients are limited to 1000 `IDENTIFY` calls to the websocket in a 24-hour period. This limit is global and across all shards, but does not include `RESUME` calls. Upon hitting this limit, all active sessions for the bot will be terminated, the bot's token will be reset, and the owner will receive an email notification. It's up to the owner to update their application with the new token.


## Resuming a Disconnected Session

The internet is a scary place. Disconnections happen, especially with persistent connections. Due to Discord's architecture, this is a semi-regular event and should be expected and handled. Discord has a process for "resuming" (or reconnecting) a connection that allows the client to replay any lost events from the last sequence number they received in the exact same way they would receive them normally.

Your client should store the `session_id` from the [Ready](#DOCS_GATEWAY/ready), and the sequence number of the last event it received. When your client detects that it has been disconnected, it should completely close the connection and open a new one (following the same strategy as [Connecting](#DOCS_GATEWAY/connecting)). Once the new connection has been opened, the client should send a [Gateway Resume](#DOCS_GATEWAY/gateway-resume):


###### Example Gateway Resume

```json
{
	"token": "my_token",
	"session_id": "session_id_i_stored",
	"seq": 1337
}
```

If successful, the gateway will respond by replaying all missed events in order, finishing with a [Resumed](#DOCS_GATEWAY/resumed) event to signal replay has finished, and all subsequent events are new. It's also possible that your client cannot reconnect in time to resume, in which case the client will receive a [Opcode 9 Invalid Session](#DOCS_GATEWAY/invalid-session) and is expected to wait a random amount of time—between 1 and 5 seconds—then send a fresh [Opcode 2 Identify](#DOCS_GATEWAY/gateway-identify).

### Disconnections

If the gateway ever issues a disconnect to your client, it will provide a close event code that you can use to properly handle the disconnection.

###### Gateway Close Event Codes

| Code | Description | Explanation |
|------|-------------|-------------|
| 4000 | unknown error | We're not sure what went wrong. Try reconnecting? |
| 4001 | unknown opcode | You sent an invalid [Gateway opcode](#DOCS_GATEWAY/gateway-opcodespayloads-gateway-opcodes). Don't do that! |
| 4002 | decode error | You sent an invalid [payload](#DOCS_GATEWAY/sending-payloads) to us. Don't do that! |
| 4003 | not authenticated | You sent us a payload prior to [identifying](#DOCS_GATEWAY/gateway-identify). |
| 4004 | authentication failed | The account token sent with your [identify payload](#DOCS_GATEWAY/gateway-identify) is incorrect. |
| 4005 | already authenticated | You sent more than one identify payload. Don't do that! |
| 4007 | invalid seq | The sequence sent when [resuming](#DOCS_GATEWAY/resuming) the session was invalid. Reconnect and start a new session. |
| 4008 | rate limited | Woah nelly! You're sending payloads to us too quickly. Slow it down! |
| 4009 | session timeout | Your session timed out. Reconnect and start a new one. |
| 4010 | invalid shard | You sent us an invalid [shard when identifying](#DOCS_GATEWAY/sharding). |
| 4011 | sharding required | The session would have handled too many guilds - you are required to [shard](#DOCS_GATEWAY/sharding) your connection in order to connect. |

## Rate Limiting

Clients are allowed 120 events every 60 seconds, meaning you can send on average at a rate of up to 2 events per second. Clients who surpass this limit are immediately disconnected from the Gateway, and similarly to the HTTP API, repeat offenders will have their API access revoked. Clients are also limited to one gateway connection per 5 seconds. If you hit this limit, the Gateway will respond with an [Opcode 9 Invalid Session](#DOCS_GATEWAY/gateway-invalid-session).

## Tracking State

Most of a client's state is provided during the initial [Ready](#DOCS_GATEWAY/ready) event and the [Guild Create](#DOCS_GATEWAY/guild-create) events that immediately follow. As objects are further created/updated/deleted, other events are sent to notify the client of these changes and to provide the new or updated data. To avoid excessive API calls, Discord expects clients to locally cache as many object states as possible, and to update them as gateway events are received.

An example of state tracking can be found with member status caching. When initially connecting to the gateway, the client receives information regarding the online status of guild members (online, idle, dnd, offline). To keep this state updated, a client must track and parse [Presence Update](#DOCS_GATEWAY/presence-update) events as they are received, and apply the provided data to the cached member objects.

## Sharding

As bots grow and are added to an increasing number of guilds, some developers may find it necessary to break or split portions of their bots operations into separate logical processes. As such, Discord gateways implement a method of user-controlled guild sharding which allows for splitting events across a number of gateway connections. Guild sharding is entirely user controlled, and requires no state-sharing between separate connections to operate.

To enable sharding on a connection, the user should send the `shard` array in the [identify](#DOCS_GATEWAY/gateway-identify) payload. The first item in this array should be the zero-based integer value of the current shard, while the second represents the total number of shards. DMs will only be sent to shard 0. To calculate what events will be sent to what shard, the following formula can be used:

###### Sharding Formula

```python
(guild_id >> 22) % num_shards == shard_id
```

As an example, if you wanted to split the connection between three shards, you'd use the following values for `shard` for each connection: `[0, 3]`, `[1, 3]`, and `[2, 3]`. Note that only the first shard (`[0, 3]`) would receive DMs.

## Commands

### Identify

Used to trigger the initial handshake with the gateway.

###### Identify Structure

| Field | Type | Description |
|-------|------|-------------|
| token | string | authentication token |
| properties | object | [connection properties](#DOCS_GATEWAY/gateway-identify-gateway-identify-connection-properties) |
| compress | bool | whether this connection supports compression of packets |
| large_threshold | integer | value between 50 and 250, total number of members where the gateway will stop sending offline members in the guild member list |
| shard | array of two integers (shard_id, num_shards) | used for [Guild Sharding](#DOCS_GATEWAY/sharding) |
| presence | [gateway status update](#DOCS_GATEWAY/gateway-status-update) object | presence structure for initial presence information |

###### Identify Connection Properties

| Field | Type | Description |
| ----- | ---- | ----------- |
| $os | string | your operating system |
| $browser | string | your library name |
| $device | string | your library name

###### Example Identify

```json
{
	"token": "my_token",
	"properties": {
		"$os": "linux",
		"$browser": "disco",
		"$device": "disco"
	},
	"compress": true,
	"large_threshold": 250,
	"shard": [1, 10],
	"presence": {
		"game": {
			"name": "Cards Against Humanity",
			"type": 0
		},
		"status": "dnd",
		"since": 91879201,
		"afk": false
	}
}
```

### Resume

Used to replay missed events when a disconnected client resumes.

###### Resume Structure

| Field | Type | Description |
|-------|------|-------------|
| token | string | session token |
| session_id | string | session id |
| seq | integer | last sequence number received |

###### Example Resume

```json
{
	"token": "randomstring",
	"session_id": "evenmorerandomstring",
	"seq": 1337
}
```

### Request Guild Members

Used to request offline members for a guild. When initially connecting, the gateway will only send offline members if a guild has less than the `large_threshold` members (value in the [Gateway Identify](#DOCS_GATEWAY/gateway-identify)). If a client wishes to receive additional members, they need to explicitly request them via this operation. The server will send [Guild Members Chunk](#DOCS_GATEWAY/guild-members-chunk) events in response with up to 1000 members per chunk until all members that match the request have been sent.

###### Guild Request Members Structure

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild to get offline members for |
| query | string | string that username starts with, or an empty string to return all members |
| limit | integer | maximum number of members to send or 0 to request all members matched |

###### Guild Request Members

```json
{
	"guild_id": "41771983444115456",
	"query": "",
	"limit": 0
}
```

### Update Voice State

Sent when a client wants to join, move, or disconnect from a voice channel.

###### Gateway Voice State Update Structure

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild |
| channel_id | ?snowflake | id of the voice channel client wants to join (null if disconnecting) |
| self_mute | bool | is the client muted |
| self_deaf | bool | is the client deafened |

###### Example Gateway Voice State Update

```json
{
	"guild_id": "41771983423143937",
	"channel_id": "127121515262115840",
	"self_mute": false,
	"self_deaf": false
}
```

### Update Status

Sent by the client to indicate a presence or status update.

###### Gateway Status Update Structure

| Field | Type | Description |
|-------|------|-------------|
| since | ?integer | unix time (in milliseconds) of when the client went idle, or null if the client is not idle |
| game | ?[game](#DOCS_GATEWAY/game-object) object | null, or the user's new activity |
| status | string | the user's new [status](#DOCS_GATEWAY/gateway-status-update-status-types) |
| afk | bool | whether or not the client is afk |

###### Status Types

| Status | Description |
| ------ | ----------- |
| online | Online |
| dnd | Do Not Disturb |
| idle | AFK |
| invisible | Invisible and shown as offline |
| offline | Offline |

###### Example Gateway Status Update

```json
{
	"since": 91879201,
	"game": {
		"name": "Save the Oxford Comma",
		"type": 0
	},
	"status": "online",
	"afk": false
}
```

## Events

### Event Names

Event names are in standard constant form, fully upper-cased and replacing all spaces with underscores. For instance, [Channel Create](#DOCS_GATEWAY/channel-create) would be `CHANNEL_CREATE` and [Voice State Update](#DOCS_GATEWAY/voice-state-update) would be `VOICE_STATE_UPDATE`. Within the following documentation they have been left in standard English form to aid in readability.

### Connecting and Resuming

#### Hello

Sent on connection to the websocket. Defines the heartbeat interval that the client should heartbeat to.

###### Hello Structure

| Field | Type | Description |
|-------|------|-------------|
| heartbeat_interval | integer | the interval (in milliseconds) the client should heartbeat with |
| _trace | array of strings | used for debugging, array of servers connected to |

###### Example Hello

```json
{
	"heartbeat_interval": 45000,
	"_trace": ["discord-gateway-prd-1-99"]
}
```

#### Ready

The ready event is dispatched when a client has completed the initial handshake with the gateway (for new sessions). The ready event can be the largest and most complex event the gateway will send, as it contains all the state required for a client to begin interacting with the rest of the platform.

###### Ready Event Fields

| Field | Type | Description |
|-------|------|-------------|
| v | integer | [gateway protocol version](#DOCS_GATEWAY/gateway-protocol-versions) |
| user | [user](#DOCS_USER/user-object) object | information about the user including email |
| private_channels | array of [DM channel](#DOCS_CHANNEL/channel-object) objects | the direct messages the user is in |
| guilds | array of [Unavailable Guild](#DOCS_GUILD/unavailable-guild-object) objects | the guilds the user is in |
| session_id | string | used for resuming connections |
| \_trace | array of strings | used for debugging - the guilds the user is in |

>warn
>`guilds` are the guilds of which your bot is a member. They start out as unavailable when you connect to the gateway. As they become available to your bot, you will be notified via [Guild Create](#DOCS_GATEWAY/guild-create) events.

#### Resumed

The resumed event is dispatched when a client has sent a [resume payload](#DOCS_GATEWAY/resuming) to the gateway (for resuming existing sessions).

###### Resumed Event Fields

| Field | Type | Description |
|-------|------|-------------|
| \_trace | array of strings | used for debugging - the guilds the user is in |

#### Invalid Session

Sent to indicate one of at least three different situations:
- the gateway could not initialize a session after receiving an [Opcode 2 Identify](#DOCS_GATEWAY/gateway-identify)
- the gateway could not resume a previous session after receiving an [Opcode 6 Resume](#DOCS_GATEWAY/gateway-resume)
- the gateway has invalidated an active session and is requesting client action

The inner `d` key is a boolean that indicates whether the session may be resumable. See [Connecting](#DOCS_GATEWAY/connecting) and [Resuming](#DOCS_GATEWAY/resuming) for more information.

###### Example Gateway Invalid Session

```json
{
    "op": 9,
    "d": false
}
```

### Channels

#### Channel Create

Sent when a new channel is created, relevant to the current user. The inner payload is a [channel](#DOCS_CHANNEL/channel-object) object.

#### Channel Update

Sent when a channel is updated. The inner payload is a [channel](#DOCS_CHANNEL/channel-object) object.

#### Channel Delete

Sent when a channel relevant to the current user is deleted. The inner payload is a [channel](#DOCS_CHANNEL/channel-object) object.

#### Channel Pins Update

Sent when a message is pinned or unpinned in a text channel. This is not sent when a pinned message is deleted.

###### Channel Pins Update Event Fields

| Field | Type | Description |
|-------|------|-------------|
| channel_id | snowflake | the id of the channel |
| last_pin_timestamp? | ISO8601 timestamp | the time at which the most recent pinned message was pinned |

### Guilds

#### Guild Create

This event can be sent in three different scenarios:

1. When a user is initially connecting, to lazily load and backfill information for all unavailable guilds sent in the [Ready](#DOCS_GATEWAY/ready) event.
2. When a Guild becomes available again to the client.
3. When the current user joins a new Guild.

The inner payload is a [guild](#DOCS_GUILD/guild-object) object, with all the extra fields specified.

#### Guild Update

Sent when a guild is updated. The inner payload is a [guild](#DOCS_GUILD/guild-object) object.

#### Guild Delete

Sent when a guild becomes unavailable during a guild outage, or when the user leaves or is removed from a guild. The inner payload is an [unavailable guild](#DOCS_GUILD/unavailable-guild-object) object. If the `unavailable` field is not set, the user was removed from the guild.

#### Guild Ban Add

Sent when a user is banned from a guild. The inner payload is a [user](#DOCS_USER/user-object) object, with an extra `guild_id` key.

###### Guild Ban Add Extra Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild |

#### Guild Ban Remove

Sent when a user is unbanned from a guild. The inner payload is a [user](#DOCS_USER/user-object) object, with an extra `guild_id` key.

###### Guild Ban Remove Extra Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild |

#### Guild Emojis Update

Sent when a guild's emojis have been updated.

###### Guild Emojis Update Event Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild |
| emojis | array | array of [emojis](#DOCS_EMOJI/emoji-object) |

#### Guild Integrations Update

Sent when a guild integration is updated.

###### Guild Integrations Update Event Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild whose integrations were updated |

#### Guild Member Add

Sent when a new user joins a guild. The inner payload is a [guild member](#DOCS_GUILD/guild-member-object) object with an extra `guild_id` key:

###### Guild Member Add Extra Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild |

#### Guild Member Remove

Sent when a user is removed from a guild (leave/kick/ban).

###### Guild Member Remove Event Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | the id of the guild |
| user | a [user](#DOCS_USER/user-object) object | the user who was removed |

#### Guild Member Update

Sent when a guild member is updated.

###### Guild Member Update Event Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | the id of the guild |
| roles | array of snowflakes | user role ids |
| user | a [user](#DOCS_USER/user-object) object | the user |
| nick | string | nickname of the user in the guild |

#### Guild Members Chunk

Sent in response to [Guild Request Members](#DOCS_GATEWAY/request-guild-members).

###### Guild Members Chunk Event Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | the id of the guild |
| members | array of [guild members](#DOCS_GUILD/guild-member-object) | set of guild members |

#### Guild Role Create

Sent when a guild role is created.

###### Guild Role Create Event Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | the id of the guild |
| role | a [role](#DOCS_PERMISSIONS/role-object) object | the role created |

#### Guild Role Update

Sent when a guild role is updated.

###### Guild Role Update Event Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | the id of the guild |
| role | a [role](#DOCS_PERMISSIONS/role-object) object | the role updated |

#### Guild Role Delete

Sent when a guild role is deleted.

###### Guild Role Delete Event Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild |
| role_id | snowflake | id of the role |

### Messages

#### Message Create

Sent when a message is created. The inner payload is a [message](#DOCS_CHANNEL/message-object) object.

#### Message Update

Sent when a message is updated. The inner payload is a [message](#DOCS_CHANNEL/message-object) object.

>warn
>Unlike creates, message updates may contain only a subset of the full message object payload (but will always contain an id and channel_id).

#### Message Delete

Sent when a message is deleted.

###### Message Delete Event Fields

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | the id of the message |
| channel_id | snowflake | the id of the channel |

#### Message Delete Bulk

Sent when multiple messages are deleted at once.

###### Message Delete Bulk Event Fields

| Field | Type | Description |
|-------|------|-------------|
| ids | array of snowflakes | the ids of the messages |
| channel_id | snowflake | the id of the channel |

#### Message Reaction Add

Sent when a user adds a reaction to a message.

###### Message Reaction Add Event Fields

| Field | Type | Description |
|-------|------|-------------|
| user_id | snowflake | the id of the user |
| channel_id | snowflake | the id of the channel |
| message_id | snowflake | the id of the message |
| emoji | an [emoji](#DOCS_EMOJI/emoji-object) object | the emoji used to react |

#### Message Reaction Remove

Sent when a user removes a reaction from a message.

###### Message Reaction Remove Event Fields

| Field | Type | Description |
|-------|------|-------------|
| user_id | snowflake | the id of the user |
| channel_id | snowflake | the id of the channel |
| message_id | snowflake | the id of the message |
| emoji | an [emoji](#DOCS_EMOJI/emoji-object) object | the emoji used to react |

#### Message Reaction Remove All

Sent when a user explicitly removes all reactions from a message.

###### Message Reaction Remove All Event Fields

| Field | Type | Description |
|-------|------|-------------|
| channel_id | snowflake | the id of the channel |
| message_id | snowflake | the id of the message |

### Presence

#### Presence Update

A user's presence is their current state on a guild. This event is sent when a user's presence is updated for a guild.

>warn
>The user object within this event can be partial, the only field which must be sent is the `id` field, everything else is optional. Along with this limitation, no fields are required, and the types of the fields are **not** validated. Your client should expect any combination of fields and types within this event.

###### Presence Update Event Fields

| Field | Type | Description |
|-------|------|-------------|
| user | [user](#DOCS_USER/user-object) object | the user presence is being updated for |
| roles | array of snowflakes | roles this user is in |
| game | ?[game](#DOCS_GATEWAY/game-object) object | null, or the user's current activity |
| guild_id | snowflake | id of the guild |
| status | string | either "idle", "dnd", "online", or "offline" |

#### Game Object

###### Game Structure

| Field | Type | Description | Present |
|-------|------|-------------|---------|
| name | string | the game's name | Always |
| type | integer | see [Activity Types](#DOCS_GATEWAY/game-object-activity-types)  | Always |
| url | ?string | stream url, is validated when type is 1  | When type is 1 |

###### Activity Types

| ID | Name | Format | Example |
|----|------|--------|---------|
| 0 | Game | Playing {name} | "Playing Rocket League" |
| 1 | Streaming | Streaming {name} | "Streaming Rocket League" |
| 2 | Listening | Listening to {name} | "Listening to Nyan Cat - 10 Hour Version" |
| 3 | Watching | Watching {name} | "Watching Stranger Things" |

>info
>The streaming type currently only supports Twitch. Only `https://twitch.tv/` urls will work.

###### Example Game

```json
{
	"name": "Rocket League",
	"type": 1,
	"url": "https://www.twitch.tv/123"
}
```

>warn
>Clients may only update their game status 5 times per minute.

#### Typing Start

Sent when a user starts typing in a channel.

###### Typing Start Event Fields

| Field | Type | Description |
|-------|------|-------------|
| channel_id | snowflake | id of the channel |
| user_id | snowflake | id of the user |
| timestamp | integer | unix time (in seconds) of when the user started typing |

#### User Update

Sent when properties about the user change. Inner payload is a [user](#DOCS_USER/user-object) object.

### Voice

#### Voice State Update

Sent when someone joins/leaves/moves voice channels. Inner payload is a [voice state](#DOCS_VOICE/voice-state-object) object.

#### Voice Server Update

Sent when a guild's voice server is updated. This is sent when initially connecting to voice, and when the current voice instance fails over to a new server.

###### Voice Server Update Event Fields

| Field | Type | Description |
|-------|------|-------------|
| token | string | voice connection token |
| guild_id | snowflake | the guild this voice server update is for |
| endpoint | string | the voice server host |

###### Example Voice Server Update Payload

```json
{
	"token": "my_token",
	"guild_id": "41771983423143937",
	"endpoint": "smart.loyal.discord.gg"
}
```

### Webhooks

#### Webhooks Update

Sent when a guild channel's webhook is created, updated, or deleted.

###### Webhook Update Event Fields

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild |
| channel_id | snowflake | id of the channel |

## Get Gateway % GET /gateway

>info
>This endpoint does not require authentication.

###### Example Response

```json
{
	"url": "wss://gateway.discord.gg/"
}
```


## Get Gateway Bot % GET /gateway/bot

>warn
>This endpoint requires authentication using a valid bot token.

###### Example Response

```json
{
  "url": "wss://gateway.discord.gg/",
  "shards": 9
}
```
