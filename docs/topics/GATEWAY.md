# Gateways

Gateways are Discords from of real-time communication over secure web-sockets. Clients will mostly receive events and data over the gateways, and send data over the REST API. For information about connecting to a gateway, please see the [Connecting](#DOCS_GATEWAY/connecting) section.

### Get Gateway %  GET /gateway

Return an object with a single valid WSS URL. Clients should **not** cache this value, but instead should call this endpoint whenever they wish to reestablish a Gateway connection.

###### Example Response

```json
{
	"url": "wss://gateway-33.discord.gg/4"
}
```

## Gateway Protocol Versions

Out of Services versions are versions who's subset of changes compared to the most recent version have been completely removed from the Gateway. Using these versions will break your client, and result in undefined behavior.

| Version | Out of Service |
|------------|----------------|
| 4 | no |


## Gateway OP Codes/Payloads

###### Gateway Payload Structure

| Field | Type | Description | Present |
|-------|------|-------------|-------------|
| op | integer | opcode for the payload | Always |
| d | mixed (object, integer) | event data | Always |
| s | integer | sequence number, used for reconnecting | Only for OP0 |
| t | string | the event name for this payload | Only for OP0 |

###### Gateway OP Codes

| Code | Name | Description |
|--------|----------|-----------------|
| 0 | Dispatch | dispatches an event |
| 1 | Heartbeat | used for ping checking |
| 2 | Identify | used for client handshake |
| 3 | Status Update | used to update the client status |
| 4 | Voice State Update | used to join/move/leave voice channels |
| 5 | Voice Server Ping | used for voice ping checking |
| 6 | Resume | used to resume a closed connection |
| 7 | Reconnect | used to redirect clients to a new gateway |
| 8 | Request Guild Members | used to request guild members |
| 9 | Invalid Session | used to notify client they have an invalid session id |

### Gateway Dispatch

Used by the gateway to notify the client of events.

###### Gateway Dispatch Example

```json
{
	"op": 0,
	"d": {},
	"s": 42,
	"t": "GATEWAY_EVENT_NAME"
}
```

### Gateway Heartbeat

Used to maintain an active gateway connection. Must be sent every `heartbeat_interval` seconds after the [ready](#DOCS_GATEWAY/ready) payload is received. The inner `d` key should be set to the current unix timestamp in seconds, as an integer.

###### Gateway Heartbeat Example

```json
{
	"op": 1,
	"d": 1445412480
}
```

### Gateway Identify

Used to trigger the initial handshake with the gateway.

####### Gateway Identify Structure

| Field | Type | Description |
|-------|------|-------------|
| token | string | authentication token |
| properties | object | connection properties |
| compress | boolean | whether this connection supports compression (should always be set to true) |
| large_threshold | integer | value between 50 and 250, total number of members where the gateway will stop sending offline members |

###### Example Gateway Identify Example

```json
{
	"token": "my_token",
	"properties": {
		"$os": "linux",
		"$browser": "my_library_name",
		"$device": "my_library_name",
		"$referrer": "",
		"$referring_domain": ""
	},
	"compress": true,
	"large_threshold": 250,
}
```

### Gateway Status Update

Sent by the client to indicate a presence or status update.

###### Gateway Status Update Structure

| Field | Type | Description |
|-------|------|-------------|
| idle_since | integer | unix time (in milliseconds) the client has been idle since |
| game | object | either null, or an object with one key "name", the name of the game being played |

###### Gateway Status Update Example

```json
{
	"idle_since": 91879201,
	"game": {
		"name": "Writing Docs FTW"
	}
}
```

### Gateway Voice State Update

Sent when a client wants to join, move, or disconnect from a voice channel.

###### Gateway Voice State Update Structure

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild |
| channel_id | snowflake | id of the voice channel client wants to join (null if disconnecting) |
| self_mute | boolean | is the client muted |
| self_deaf | boolean | is the client deafened |

###### Gateway Voice State Update Example

```json
{
	"guild_id": "41771983423143937",
	"channel_id": "127121515262115840",
	"self_mute": false,
	"self_deaf": false
}
```

### Gateway Server Ping

Shouldn't be used by bot accounts.


### Gateway Resume

Used to replay missed events when a disconnected client resumes.

###### Gateway Resume Structure

| Field | Type | Description |
|-------|------|-------------|
| token | string | session token |
| session_id | string | session id |
| seq | integer | last sequence number received |

###### Gateway Resume Example

```json
{
	"token": "randomstring",
	"session_id": "evenmorerandomstring",
	"seq": 1337
}
```

### Gateway Reconnect

Used to tell clients to reconnect to another gateway. Clients should immediately reconnect, and use the resume payload on the new gateway.

### Gateway Request Guild Members

Used to request offline members for a guild. When initially connecting, the gateway will only send offline members if a guild has less than the `large_threshold` value in the [Gateway Identify](#DOCS_GATEWAY/gateway-identify). If a client wishes to receive all offline members, they need to send this request.

###### Gateway Request Guild Members Structure

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild to get offline members for |
| query | string | should always be empty |
| limit | integer | maximum number of members to send |

###### Gateway Request Guild Members Example

```json
{
	"guild_Id": "41771983444115456",
	"query": "",
	"limit": 0
}
```

## Connecting

The first step to establishing a gateway connection, is requesting a new gateway URL through the [Get Gateway](#DOCS_GATEWAY/get-gateway) API endpoint. Using the "url" field from the response, you can then create a new secure websocket connection that will be used for the duration of your gateway session (optionally passing any URL params). Once connected you must send an OP2 [Identify](#DOCS_GATEWAY/gateway-identify-payload). If your token is correct, the gateway will respond with a [Ready](#DOCS_GATEWAY/ready-event) payload. After the ready payload, your client needs to start sending OP1 [heartbeat](#DOCS_GATEWAY/gateway-heartbeat-payload) payloads every `heartbeat_interval` (which is sent in the ready payload) seconds.

###### Gateway URL Params

| Field | Type | Description |
|-------|------|-------------|
| v | integer | Gateway Version to use |
| encoding | string | 'json' or 'etf' |

### Resuming

When clients lose their connection to the gateway and are able to reconnect in a short period of time after, they can utilize a Gateway feature called "client resuming". Once reconnected to a new (or the previous) gateway, the client should send a [Gateway Reconnect](#DOCS_GATEWAY/gateway-reconnect) payload to the server. If successful, the gateway will respond by replying all missed events to the client.

### ETF/JSON

When initially creating and handshaking connections to the Gateway, a user can chose whether they wish to communicate over plain-text JSON, or binary [ETF](http://erlang.org/doc/apps/erts/erl_ext_dist.html). Payloads to the gateway are limited to a maximum of 4096 bytes sent, going over this will cause a connection termination with error code 4002.

### Rate Limiting

Unlike the HTTP API, Gateways do not provide a method for forced back-off or cooldown, but instead implement a hard limit on the number of messages sent over a period of time. Currently clients are allowed 120 events every 60 seconds, meaning you can send at a rate of up to 2 events per second. Clients who surpass this limit are immediately disconnected from the Gateway, and similarly to the HTTP API, repeat offenders will have their API access revoked. Clients are limited to one gateway connection per 5 seconds, if you hit this limit the Gateway will delay your connection until the cooldown has timed out.

>warn
> Clients may only update their game status once every 12 seconds.

## Tracking State

Users who implement the Gateway API should keep in mind that Discord expects clients to track information and state locally, and will only provide events for objects that are updated/deleted. A good example of state tracking is user status, when initially connecting to the gateway, the client receives information regarding the online status of members. However to keep this state updated a user must receive and track [Presence Update](#DOCS_GATEWAY/presence-update)'s. Generally clients should try to cache and track as much information locally to avoid excess API calls.

## Payloads

### Sending Payloads

Packets sent from the client to the Gateway API are encapsulated within a [gateway payload object](#DOCS_GATEWAY/gateway-payload-object) and must have the proper OP code and data object set. The payload object can then be serialized in the format of choice, and sent over the websocket.

### Receiving Payloads

Receiving payloads with the Gateway API is slightly more complex than sending. The Gateway API has the option of sending payloads compressed using zlib, meaning your library _must_ detect and decompress these payloads.

## Events

### Ready

The ready event is dispatched when a client has completed the handshake with the gateway. The ready event is the largest and most complex event the gateway will send, as it contains all the state required for a client to begin interacting with the rest of the platform.

###### Ready Event Fields

| Field | Type | Description |
|-------|------|-------------|
| v | integer | [gateway protocol version](#DOCS_GATEWAY/gateway-protocol-versions) |
| user | object | [user object](#DOCS_USER/user-object) (with email information) |
| private_channels | array | array of [DM channel](#DOCS_CHANNEL/dm-channel-object) objects |
| guilds | array | array of [Unavailable Guild](#DOCS_GUILD/unavailable-guild-object) objects |
| read_state | array | array of [read state](#DOCS_CHANNEL/read-state-object) objects |

### Channel Create

Sent when a new channel is created, relevant to the current user. The inner payload is a [DM](#DOCS_CHANNEL/dm-channel-object) or [Guild](#DOCS_CHANNEL/guild-channel-object) channel object.

### Channel Update

Sent when a channel is updated. The inner payload is a [guild channel](#DOCS_CHANNEL/guild-channel-object) object.

### Channel Delete

Sent when a channel relevant to the current user is deleted. The inner payload is a [DM](#DOCS_CHANNEL/dm-channel-object) or [Guild](#DOCS_CHANNEL/guild-channel-object) channel object.

### Guild Ban Add

Sent when a user is banned from a guild. The inner payload is a [user](#DOCS_USER/user-object) object.

### Guild Ban Remove

Sent when a user is unbanned from a guild. The inner payload is a [user](#DOCS_USER/user-object) object.

### Guild Create

This event can be sent in three different scenarios:

1. When a user is initially connecting, to lazily load and backfill information for all unavailable guilds sent in the [ready](#DOCS_GATEWAY/ready) event
2. When a Guild returns to an online state after being unavailable.
3. When a user joins a new Guild

The inner payload is a [guild](#DOCS_GUILD/guild-object) object. An additional 'unavailable' key set to false is added for scenarios 1 and 2.

### Guild Update

Sent when a guild is updated. The inner payload is a [guild](#DOCS_GUILD/guild-object) object.

### Guild Emoji Update

Sent when a guilds emojis have been updated. The inner payload is a `guild_id` snowflake, and a `emojis` key which is an array of [emoji](#DOCS_GUILD/emoji-object) objects.

### Guild Delete

Sent when a guild becomes unavailable during a guild outage. See GUILD_CREATE for more information about how to handle this event.

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | id of the guild |
| unavailable | boolean | whether the guild is unavailable, should always be true |

### Guild Integrations Update

Sent when a guild integration is updated.

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild whose integrations where updated |

### Guild Member Add

Sent when a new user joins a guild. The inner payload is a [guild member](#DOCS_GUILD/guild-member-object) object, with an extra `guild_id` key.

### Guild Member Remove

Sent when a user is removed from a guild (leave/kick/ban).

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | the id of the guild |
| user | a [user](#DOCS_USER/user-object) object | the user who was removed |

### Guild Member Update

Sent when a guild member is updated.

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | the id of the guild |
| roles | array of [role](#DOCS_PERMISSIONS/role-object) objects | user roles |
| user | a [user](#DOCS_USER/user-object) object | the user |

### Guild Role Create

Sent when a guild role is created.

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | the id of the guild |
| role | a [role](#DOCS_PERMISSIONS/role-object) object | the role created |

### Guild Role Update

Sent when a guild role is updated.

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | the id of the guild |
| role | a [role](#DOCS_PERMISSIONS/role-object) object | the role created |

### Guild Role Delete

Sent when a guild role is deleted

| Field | Type | Description |
|-------|------|-------------|
| guild_id | snowflake | id of the guild |
| role_id | snowflake | id of the role |

### Message Create

Sent when a message is created. The inner payload is a [message](#DOCS_CHANNEL/message-object) object.

### Message Update

Sent when a message is updated. The inner payload is a [message](#DOCS_CHANNEL/message-object) object. Unlike creates, message updates may contain only a subset of the full message object payload (but will always contain an id and channel_id).

### Message Delete

Sent when a message is deleted.

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | the id of the message |
| channel_id | snowflake | the id of the channel |

### Presence Update

Sent when a users presence is updated.

| Field | Type | Description |
|-------|------|-------------|
| user | [user](#DOCS_USER/user-object) object | the user presence is being updated for |
| roles | array of snowflakes | roles this user is in |
| game | object | null, or an object containing one key of "name" |
| guild_id | snowflake | id of the guild |
| status | string | either "idle", "online" or "offline" |

### Typing Start

Sent when a user starts typing in a channel.

| Field | Type | Description |
|-------|------|-------------|
| channel_id | snowflake | id of the channel |
| user_id | snowflake | id of the user |
| timestamp | timestamp | when the user started typing |

### User Settings Update

Sent when the current user updates their settings. Inner payload is a [user settings](#DOCS_USER/user-settings-object) object.

### User Update

Sent when properties about the user change. Inner payload is a [user](#DOCS_USER/user-object) object.

### Voice State Update

Sent when someone joins/leaves/moves voice channels.

| Field | Type | Description |
|-------|------|-------------|
| user_id | snowflake | id of the user |
| guild_id | snowflake | id of the guild |
| channel_id | snowflake | id of the channel |
| session_id | string | id of the session |
| self_mute | boolean | whether the user is muted |
| self_deaf | boolean | whether the user is deafened |
| mute | boolean | whether the user is server-muted |
| deaf | boolean | whether the user is server-deafened |
