# Gateway

The Gateway API lets apps open secure WebSocket connections with Discord in order to receive events about things that happen in a server, like when a channel is updated or a role is created. There are a few scenarios where apps will also use a Gateway connection to update or request a resource (like when [updating voice state](#DOCS_TOPICS_GATEWAY/update-voice-state)), but in *most* cases they'll instead use the [HTTP API](#DOCS_REFERENCE/http-api) when performing REST operations on resources (like creating, updating, deleting, or fetching them). 

The Gateway is Discord's form of real-time communication used by clients (including apps), so there is data and nuances that simply aren't relevant to apps. Interacting with the Gateway can be tricky, but there are [community-built libraries](#DOCS_TOPICS_COMMUNITY_RESOURCES/libraries) with built-in support that simplify the most complicated bits and bobs. If you're planning to write a custom implementation, be sure to read the following documentation in its entirety to understand the sacred secrets of the Gateway.

## Payloads

Gateway event payloads have a common structure, but the contents of the associated data (the `d` field) varies between events.

> warn
> Not all Gateway event fields are documented. You should assume that undocumented fields are not supported for apps, and their format and data may change at any time.

###### Gateway Payload Structure

| Field | Type                    | Description                                                                                                                       |
| ----- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| op    | integer                 | [Gateway opcode](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-opcodes), which indicates the payload type                 |
| d     | ?mixed (any JSON value) | Event data                                                                                                                        |
| s     | ?integer \*             | Sequence number used for [resuming sessions](#DOCS_TOPICS_GATEWAY/resuming) and [heartbeating](#DOCS_TOPICS_GATEWAY/heartbeating) |
| t     | ?string \*              | Event name                                                                                                                        |

\* `s` and `t` are `null` when `op` is not `0` ([Gateway Dispatch opcode](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-opcodes)).

### Sending Gateway Events

When sending an [event](#DOCS_TOPICS_GATEWAY/commands-and-events-gateway-commands) over a Gateway connection (like when [performing an initial handshake](#DOCS_TOPICS_GATEWAY/identify) or [updating presence](#DOCS_TOPICS_GATEWAY/update-presence)), an app must send a [Gateway event payload object](#DOCS_TOPICS_GATEWAY/sending-payloads-example-gateway-event-payload) with a valid opcode and inner data object.

Event payloads sent over a Gateway connection:

1. Must be serialized in [plain-text JSON or binary ETF](#DOCS_TOPICS_GATEWAY/etfjson)
2. Must not exceed 4096 bytes. If an event payload *does* exceed 4096, the connection will be closed with a [`4002` gateway close event code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes)

###### Example Gateway Event Payload

```json
{
  "op": 0,
  "d": {},
  "s": 42,
  "t": "GATEWAY_EVENT_NAME"
}
```

### Receiving Gateway Events

// TODO: pls revise this intro lol
Receiving events over a Gateway connection is slightly more complex than sending them. 

## Encoding and Compression

When [establishing a connection](#DOCS_TOPICS_GATEWAY/connecting) to the Gateway, apps can use the `encoding` parameter to choose whether to communicate with Discord using either a plain-text JSON or binary [ETF](https://erlang.org/doc/apps/erts/erl_ext_dist.html) encoding. You can pick whichever encoding type you're more comfortable with, but both have their own quirks. If you aren't sure which encoding to use, JSON is generally recommended.

Apps can also optionally enable compression ([payload](TODO) or [transport](TODO)) to receive zlib-compressed [TODO: what word? events?] over the Gateway.

#### Using JSON Encoding

// TODO: present transport as alternative
When using the plain-text JSON encoding, apps have the option to enable [Payload Compression](#DOCS_TOPICS_GATEWAY/using-json-payload-compression).

##### Payload Compression

> warn
> Payload compression can only be enabled when using JSON as the encoding type

// TODO: how do you tell when a payload is compressed? something about zlib header i think

Payload compression enables optional per-packet compression when Discord is sending events over the Gateway. Payload compression uses the zlib format (see [RFC1950 2.2](https://tools.ietf.org/html/rfc1950#section-2.2)) when sending payloads. To enable payload compression, your app can set `compress` to `true` when sending an [Identify event](#DOCS_TOPICS_GATEWAY/identify). Note that even when payload compression is enabled, not all payloads will be compressed.

When payload compression is enabled, your app (or library) _must_ detect and decompress these payloads to plain-text JSON before attempting to parse them. If you are using payload compression, the gateway does not implement a shared compression context between events sent.

Payload compression will be disabled if you use [transport compression](TODO).

#### Using ETF Encoding

When using ETF (External Term Format) encoding, there are some specific behaviors you should know:

- Snowflake IDs are transmitted as 64-bit integers or strings.
- Your app can't send compressed messages to the server.
- When sending payloads, you must use string keys. Using atom keys will result in a [`4002`](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes) decode error.

See [erlpack](https://github.com/discord/erlpack) for an ETF implementation example.

#### Transport Compression

// TODO: define transport compression

> info
> See the [code below](TODO) for an example of handling transport compression.

Currently the only available transport compression option is `zlib-stream`.

When transport compression is enabled, an app needs to process received data through a single Gateway connection using a shared zlib context. However, each Gateway connection should use its own unique zlib context.

When processing data transport compressed data, you should push received data to a buffer until you receive the 4-byte `Z_SYNC_FLUSH` suffix (`00 00 ff ff`). After you receive the `Z_SYNC_FLUSH` suffix, you can then decompress the buffer.

###### Transport Compression Example

// TODO: can i pls link to Gus's example
> info
> The following example is in Python, but you can also find a JavaScript example [on Github](https://gist.github.com/devsnek/4e094812a4798d8f10428d04ee02cab7#file-simplediscord-js-L39)

```python
# Z_SYNC_FLUSH suffix
ZLIB_SUFFIX = b'\x00\x00\xff\xff'
# initialize a buffer to store chunks
buffer = bytearray()
# create a shared zlib inflation context to run chunks through
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
  # NOTE: the message is utf-8 encoded.
  msg = inflator.decompress(buffer)
  buffer = bytearray()

  # here you can treat `msg` as either JSON or ETF encoded,
  # depending on your `encoding` param
```

## Connecting to the Gateway

### Connecting

###### Gateway URL Query String Params

| Field     | Type    | Description                                   | Accepted Values                                                 |
| --------- | ------- | --------------------------------------------- | --------------------------------------------------------------- |
| v         | integer | API Version to use                            | see [API versions](#DOCS_REFERENCE/api-versioning-api-versions) |
| encoding  | string  | The encoding of received gateway packets      | `json` or `etf`                                                 |
| compress? | string  | The (optional) compression of gateway packets | `zlib-stream`                                                   |

The first step in establishing connectivity to the gateway is requesting a valid websocket endpoint from the API. This can be done through either the [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) or the [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot) endpoint.

With the resulting payload, you can now open a websocket connection to the "url" (or endpoint) specified. Generally, it is a good idea to explicitly pass the API version and encoding. For example, we may connect to `wss://gateway.discord.gg/?v=10&encoding=json`.

Once connected, the client should immediately receive an [Opcode 10 Hello](#DOCS_TOPICS_GATEWAY/hello) payload, with information on the connection's heartbeat interval:

###### Example Gateway Hello

```json
{
  "op": 10,
  "d": {
    "heartbeat_interval": 45000
  }
}
```

### Heartbeating

After receiving [Opcode 10 Hello](#DOCS_TOPICS_GATEWAY/hello), the client may begin sending [Opcode 1 Heartbeat](#DOCS_TOPICS_GATEWAY/heartbeat) payloads after `heartbeat_interval * jitter` milliseconds (where jitter is a random value between 0 and 1), and every `heartbeat_interval` milliseconds thereafter. You may send heartbeats before this interval elapses, but you should avoid doing so unless necessary. There is already tolerance in the `heartbeat_interval` that will cover network latency, so you do not need to account for it in your own implementation - waiting the precise interval will suffice.

The gateway may request a heartbeat from the client in some situations by sending an [Opcode 1 Heartbeat](#DOCS_TOPICS_GATEWAY/heartbeat). When this occurs, the client should immediately send an [Opcode 1 Heartbeat](#DOCS_TOPICS_GATEWAY/heartbeat) without waiting the remainder of the current interval.

Any time the client sends a heartbeat, the gateway will respond with [Opcode 11 Heartbeat ACK](#DOCS_TOPICS_GATEWAY/heartbeating-example-gateway-heartbeat-ack), a successful *acknowledgement* of their last heartbeat:

###### Example Gateway Heartbeat ACK

```json
{
  "op": 11
}
```

If a client does not receive a heartbeat ack between its attempts at sending heartbeats, this may be due to a failed or "zombied" connection. The client should then immediately terminate the connection with a non-1000 close code, reconnect, and attempt to [Resume](#DOCS_TOPICS_GATEWAY/resuming).

> info
> In the event of a service outage where you stay connected to the gateway, you should continue to heartbeat and receive ACKs. The gateway will eventually respond and issue a session once it's able to.

### Identifying

Next, the client is expected to send an [Opcode 2 Identify](#DOCS_TOPICS_GATEWAY/identify):

###### Example Gateway Identify

This is a minimal `IDENTIFY` payload. `IDENTIFY` supports additional optional fields for other session properties, such as payload compression, or an initial presence state. See the [Identify Structure](#DOCS_TOPICS_GATEWAY/identify) for a more complete example of all options you can pass in.

```json
{
  "op": 2,
  "d": {
    "token": "my_token",
    "intents": 513,
    "properties": {
      "os": "linux",
      "browser": "my_library",
      "device": "my_library"
    }
  }
}
```

If the payload is valid, the gateway will respond with a [Ready](#DOCS_TOPICS_GATEWAY/ready) event. Your client is now considered in a "connected" state. Clients are limited by [maximum concurrency](#DOCS_TOPICS_GATEWAY/session-start-limit-object) when [Identifying](#DOCS_TOPICS_GATEWAY/identify); if they exceed this limit, the gateway will respond with an [Opcode 9 Invalid Session](#DOCS_TOPICS_GATEWAY/invalid-session). It is important to note that although the ready event contains a large portion of the required initial state, some information (such as guilds and their members) is sent asynchronously (see [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) event).

> warn
> Clients are limited to 1000 `IDENTIFY` calls to the websocket in a 24-hour period. This limit is global and across all shards, but does not include `RESUME` calls. Upon hitting this limit, all active sessions for the bot will be terminated, the bot's token will be reset, and the owner will receive an email notification. It's up to the owner to update their application with the new token.

## Resuming

The Internet is a scary place. Disconnections happen, especially with persistent connections. Due to Discord's architecture, this is a semi-regular event and should be expected and handled. Discord has a process for "resuming" (or reconnecting) a connection that allows the client to replay any lost events from the last sequence number they received in the exact same way they would receive them normally.

Your client should store the `session_id` and `resume_gateway_url` from the [Ready](#DOCS_TOPICS_GATEWAY/ready), and the sequence number of the last event it received. When your client detects that it has been disconnected, it should completely close the connection and open a new one (following the same strategy as [Connecting](#DOCS_TOPICS_GATEWAY/connecting)) to `resume_gateway_url`. Once the new connection has been opened, the client should send a [Gateway Resume](#DOCS_TOPICS_GATEWAY/resume):

###### Example Gateway Resume

```json
{
  "op": 6,
  "d": {
    "token": "my_token",
    "session_id": "session_id_i_stored",
    "seq": 1337
  }
}
```

If successful, the gateway will respond by replaying all missed events in order, finishing with a [Resumed](#DOCS_TOPICS_GATEWAY/resumed) event to signal replay has finished, and all subsequent events are new. It's also possible that your client cannot reconnect in time to resume, in which case the client will receive a [Opcode 9 Invalid Session](#DOCS_TOPICS_GATEWAY/invalid-session) and is expected to wait a random amount of time—between 1 and 5 seconds—then send a fresh [Opcode 2 Identify](#DOCS_TOPICS_GATEWAY/identify).

Failure to respect the `resume_gateway_url` may result in your client being forced to reconnect again after a short period of time.

### Disconnections

If the gateway ever issues a disconnect to your client, it will provide a close event code that you can use to properly handle the disconnection. A full list of these close codes can be found in the [Response Codes](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes) documentation.

When you close the connection to the gateway with the close code 1000 or 1001, your session will be invalidated and your bot will appear offline. If you simply close the TCP connection, or use a different close code, the bot session will remain active and timeout after a few minutes. This can be useful for a reconnect, which will resume the previous session.

## Gateway Intents

Maintaining a stateful application can be difficult when it comes to the amount of data you're expected to process, especially at scale. Gateway Intents are a system to help you lower that computational burden.

> info
> Intents are optionally supported on the v6 gateway but required as of v8

> info
> Starting in v10, `MESSAGE_CONTENT` (`1 << 15`) is required to receive non-empty values for content fields (`content`, `attachments`, `embeds`, and `components`). This doesn't apply for DMs, messages your bot sends, or messages in which your bot is mentioned. `MESSAGE_CONTENT` is not currently required for previous API versions.

When [identifying](#DOCS_TOPICS_GATEWAY/identifying) to the gateway, you can specify an `intents` parameter which allows you to conditionally subscribe to pre-defined "intents", groups of events (or event data) defined by Discord. If you do not specify a certain intent, you will not receive any of the gateway events that are batched into that group. The valid intents are:

### List of Intents

```
GUILDS (1 << 0)
  - GUILD_CREATE
  - GUILD_UPDATE
  - GUILD_DELETE
  - GUILD_ROLE_CREATE
  - GUILD_ROLE_UPDATE
  - GUILD_ROLE_DELETE
  - CHANNEL_CREATE
  - CHANNEL_UPDATE
  - CHANNEL_DELETE
  - CHANNEL_PINS_UPDATE
  - THREAD_CREATE
  - THREAD_UPDATE
  - THREAD_DELETE
  - THREAD_LIST_SYNC
  - THREAD_MEMBER_UPDATE
  - THREAD_MEMBERS_UPDATE *
  - STAGE_INSTANCE_CREATE
  - STAGE_INSTANCE_UPDATE
  - STAGE_INSTANCE_DELETE

GUILD_MEMBERS (1 << 1)
  - GUILD_MEMBER_ADD
  - GUILD_MEMBER_UPDATE
  - GUILD_MEMBER_REMOVE
  - THREAD_MEMBERS_UPDATE *

GUILD_BANS (1 << 2)
  - GUILD_BAN_ADD
  - GUILD_BAN_REMOVE

GUILD_EMOJIS_AND_STICKERS (1 << 3)
  - GUILD_EMOJIS_UPDATE
  - GUILD_STICKERS_UPDATE

GUILD_INTEGRATIONS (1 << 4)
  - GUILD_INTEGRATIONS_UPDATE
  - INTEGRATION_CREATE
  - INTEGRATION_UPDATE
  - INTEGRATION_DELETE

GUILD_WEBHOOKS (1 << 5)
  - WEBHOOKS_UPDATE

GUILD_INVITES (1 << 6)
  - INVITE_CREATE
  - INVITE_DELETE

GUILD_VOICE_STATES (1 << 7)
  - VOICE_STATE_UPDATE

GUILD_PRESENCES (1 << 8)
  - PRESENCE_UPDATE

GUILD_MESSAGES (1 << 9)
  - MESSAGE_CREATE
  - MESSAGE_UPDATE
  - MESSAGE_DELETE
  - MESSAGE_DELETE_BULK

GUILD_MESSAGE_REACTIONS (1 << 10)
  - MESSAGE_REACTION_ADD
  - MESSAGE_REACTION_REMOVE
  - MESSAGE_REACTION_REMOVE_ALL
  - MESSAGE_REACTION_REMOVE_EMOJI

GUILD_MESSAGE_TYPING (1 << 11)
  - TYPING_START

DIRECT_MESSAGES (1 << 12)
  - MESSAGE_CREATE
  - MESSAGE_UPDATE
  - MESSAGE_DELETE
  - CHANNEL_PINS_UPDATE

DIRECT_MESSAGE_REACTIONS (1 << 13)
  - MESSAGE_REACTION_ADD
  - MESSAGE_REACTION_REMOVE
  - MESSAGE_REACTION_REMOVE_ALL
  - MESSAGE_REACTION_REMOVE_EMOJI

DIRECT_MESSAGE_TYPING (1 << 14)
  - TYPING_START

MESSAGE_CONTENT (1 << 15) **

GUILD_SCHEDULED_EVENTS (1 << 16)
  - GUILD_SCHEDULED_EVENT_CREATE
  - GUILD_SCHEDULED_EVENT_UPDATE
  - GUILD_SCHEDULED_EVENT_DELETE
  - GUILD_SCHEDULED_EVENT_USER_ADD
  - GUILD_SCHEDULED_EVENT_USER_REMOVE

AUTO_MODERATION_CONFIGURATION (1 << 20)
  - AUTO_MODERATION_RULE_CREATE
  - AUTO_MODERATION_RULE_UPDATE
  - AUTO_MODERATION_RULE_DELETE

AUTO_MODERATION_EXECUTION (1 << 21)
  - AUTO_MODERATION_ACTION_EXECUTION

```

\* [Thread Members Update](#DOCS_TOPICS_GATEWAY/thread-members-update) contains different data depending on which intents are used.

\*\* `MESSAGE_CONTENT` is a special case as it doesn't represent individual events, but rather affects the data sent for most events that could contain message content fields (`content`, `attachments`, `embeds`, and `components`).

### Caveats

Any [events not defined in an intent](#DOCS_TOPICS_GATEWAY/commands-and-events-gateway-events) are considered "passthrough" and will always be sent to you.

[Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) is sent for current-user updates regardless of whether the `GUILD_MEMBERS` intent is set.

[Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) and [Request Guild Members](#DOCS_TOPICS_GATEWAY/request-guild-members) are uniquely affected by intents. See these sections for more information.

[Thread Members Update](#DOCS_TOPICS_GATEWAY/thread-members-update) by default only includes if the current user was added to or removed from a thread.  To receive these updates for other users, request the `GUILD_MEMBERS` [Gateway Intent](#DOCS_TOPICS_GATEWAY/gateway-intents).

If you specify an `intents` value in your `IDENTIFY` payload that is *invalid*, the socket will close with a [`4013` close code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes). An invalid intent is one that is not meaningful and not documented above.

If you specify an `intents` value in your `IDENTIFY` payload that is *disallowed*, the socket will close with a [`4014` close code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes). A disallowed intent is a privileged intent that has not been approved for your bot.

Bots in under 100 guilds can enable these intents in the bot tab of the developer dashboard. Verified bots can get access to privileged intents when getting verified, or by writing into support after getting verified.

### Privileged Intents

> warn
> `MESSAGE_CONTENT` will become a privileged intent in Aug 2022. [Learn more here](https://support-dev.discord.com/hc/en-us/articles/4404772028055) or read the guide on [upgrading to commands](#DOCS_TUTORIALS_UPGRADING_TO_APPLICATION_COMMANDS).

Some intents are defined as "Privileged" due to the sensitive nature of the data. Those intents are:

- `GUILD_PRESENCES`
- `GUILD_MEMBERS`

To specify these intents in your `IDENTIFY` payload, you must visit your application page in the Developer Portal and enable the toggle for each Privileged Intent that you wish to use. If your bot qualifies for [verification](https://dis.gd/bot-verification), you must first [verify your bot](https://support.discord.com/hc/en-us/articles/360040720412-Bot-Verification-and-Data-Whitelisting) and request access to these intents during the verification process. If your bot is already verified and you need to request additional privileged intents, [contact support](https://dis.gd/support).

Events under the `GUILD_PRESENCES` and `GUILD_MEMBERS` intents are turned **off by default on all API versions**. If you are using **API v6**, you will receive those events if you are authorized to receive them and have enabled the intents in the Developer Portal. You do not need to use Intents on API v6 to receive these events; you just need to enable the flags.

If you are using **API v8** or above, Intents are mandatory and must be specified when identifying.

In addition to the gateway restrictions described here, Discord's REST API is also affected by Privileged Intents. Specifically, to use the [List Guild Members](#DOCS_RESOURCES_GUILD/list-guild-members) endpoint, you must have the `GUILD_MEMBERS` intent enabled for your application. This behavior is independent of whether the intent is set during `IDENTIFY`.

## Rate Limiting

> info
> This section is about Gateway rate limits, not [HTTP API rate limits](#DOCS_TOPICS_RATE_LIMITS/)

Clients are allowed to send 120 [gateway commands](#DOCS_TOPICS_GATEWAY/commands-and-events) every 60 seconds, meaning you can send an average of 2 commands per second. Clients who surpass this limit are immediately disconnected from the Gateway, and similarly to the HTTP API, repeat offenders will have their API access revoked. Clients also have a limit of [concurrent](#DOCS_TOPICS_GATEWAY/session-start-limit-object) [Identify](#DOCS_TOPICS_GATEWAY/identify) requests allowed per 5 seconds. If you hit this limit, the Gateway will respond with an [Opcode 9 Invalid Session](#DOCS_TOPICS_GATEWAY/invalid-session).

## Tracking State

Most of a client's state is provided during the initial [Ready](#DOCS_TOPICS_GATEWAY/ready) event and the [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) events that immediately follow. As objects are further created/updated/deleted, other events are sent to notify the client of these changes and to provide the new or updated data. To avoid excessive API calls, Discord expects clients to locally cache as many _relevant_ object states as possible, and to update them as gateway events are received.

An example of state tracking can be found with member status caching. When initially connecting to the gateway, the client receives information regarding the online status of guild members (online, idle, dnd, offline). To keep this state updated, a client must track and parse [Presence Update](#DOCS_TOPICS_GATEWAY/presence-update) events as they are received, and apply the provided data to the cached member objects.

For larger bots, client state can grow to be quite large. We recommend only storing objects in memory that are needed for a bot's operation. Many bots, for example, just respond to user input through chat commands. These bots may only need to keep guild information (like guild/channel roles and permissions) in memory, since [MESSAGE_CREATE](#DOCS_TOPICS_GATEWAY/message-create) and [MESSAGE_UPDATE](#DOCS_TOPICS_GATEWAY/message-update) events have the full member object available.

## Guild Availability

When connecting to the gateway as a bot user, guilds that the bot is a part of will start out as unavailable. Don't fret! The gateway will automatically attempt to reconnect on your behalf. As guilds become available to you, you will receive [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) events.

## Sharding

As bots grow and are added to an increasing number of guilds, some developers may find it necessary to break or split portions of their bots operations into separate logical processes. As such, Discord gateways implement a method of user-controlled guild sharding which allows for splitting events across a number of gateway connections. Guild sharding is entirely user controlled, and requires no state-sharing between separate connections to operate.

To enable sharding on a connection, the user should send the `shard` array in the [Identify](#DOCS_TOPICS_GATEWAY/identify) payload. The first item in this array should be the zero-based integer value of the current shard, while the second represents the total number of shards. DMs will only be sent to shard 0. To calculate what events will be sent to what shard, the following formula can be used:

###### Sharding Formula

```python
shard_id = (guild_id >> 22) % num_shards
```

As an example, if you wanted to split the connection between three shards, you'd use the following values for `shard` for each connection: `[0, 3]`, `[1, 3]`, and `[2, 3]`. Note that only the first shard (`[0, 3]`) would receive DMs.

Note that `num_shards` does not relate to, or limit, the total number of potential sessions—it is only used for *routing* traffic. As such, sessions do not have to be identified in an evenly distributed manner when sharding. You can establish multiple sessions with the same `[shard_id, num_shards]`, or sessions with different `num_shards` values. This allows you to create sessions that will handle more or less traffic than others for more fine-tuned load balancing, or orchestrate "zero-downtime" scaling/updating by handing off traffic to a new deployment of sessions with a higher or lower `num_shards` count that are prepared in parallel.

###### Max Concurrency

If you have multiple shards, you may start them concurrently based on the [`max_concurrency`](#DOCS_TOPICS_GATEWAY/session-start-limit-object) value returned to you on session start. Which shards you can start concurrently are assigned based on a key for each shard. The rate limit key for a given shard can be computed with

```
rate_limit_key = shard_id % max_concurrency
```

This puts your shards into "buckets" of `max_concurrency` size. When you start your bot, you may start up to `max_concurrency` shards at a time, and you must start them by "bucket" **in order**. To explain another way, let's say you have 16 shards, and your `max_concurrency` is 16:

```
shard_id: 0, rate limit key (0 % 16): 0
shard_id: 1, rate limit key (1 % 16): 1
shard_id: 2, rate limit key (2 % 16): 2
shard_id: 3, rate limit key (3 % 16): 3
shard_id: 4, rate limit key (4 % 16): 4
shard_id: 5, rate limit key (5 % 16): 5
shard_id: 6, rate limit key (6 % 16): 6
shard_id: 7, rate limit key (7 % 16): 7
shard_id: 8, rate limit key (8 % 16): 8
shard_id: 9, rate limit key (9 % 16): 9
shard_id: 10, rate limit key (10 % 16): 10
shard_id: 11, rate limit key (11 % 16): 11
shard_id: 12, rate limit key (12 % 16): 12
shard_id: 13, rate limit key (13 % 16): 13
shard_id: 14, rate limit key (14 % 16): 14
shard_id: 15, rate limit key (15 % 16): 15
```

You may start all 16 of your shards at once, because each has a `rate_limit_key` which fills the bucket of 16 shards. However, let's say you had 32 shards:

```
shard_id: 0, rate limit key (0 % 16): 0
shard_id: 1, rate limit key (1 % 16): 1
shard_id: 2, rate limit key (2 % 16): 2
shard_id: 3, rate limit key (3 % 16): 3
shard_id: 4, rate limit key (4 % 16): 4
shard_id: 5, rate limit key (5 % 16): 5
shard_id: 6, rate limit key (6 % 16): 6
shard_id: 7, rate limit key (7 % 16): 7
shard_id: 8, rate limit key (8 % 16): 8
shard_id: 9, rate limit key (9 % 16): 9
shard_id: 10, rate limit key (10 % 16): 10
shard_id: 11, rate limit key (11 % 16): 11
shard_id: 12, rate limit key (12 % 16): 12
shard_id: 13, rate limit key (13 % 16): 13
shard_id: 14, rate limit key (14 % 16): 14
shard_id: 15, rate limit key (15 % 16): 15
shard_id: 16, rate limit key (16 % 16): 0
shard_id: 17, rate limit key (17 % 16): 1
shard_id: 18, rate limit key (18 % 16): 2
shard_id: 19, rate limit key (19 % 16): 3
shard_id: 20, rate limit key (20 % 16): 4
shard_id: 21, rate limit key (21 % 16): 5
shard_id: 22, rate limit key (22 % 16): 6
shard_id: 23, rate limit key (23 % 16): 7
shard_id: 24, rate limit key (24 % 16): 8
shard_id: 25, rate limit key (25 % 16): 9
shard_id: 26, rate limit key (26 % 16): 10
shard_id: 27, rate limit key (27 % 16): 11
shard_id: 28, rate limit key (28 % 16): 12
shard_id: 29, rate limit key (29 % 16): 13
shard_id: 30, rate limit key (30 % 16): 14
shard_id: 31, rate limit key (31 % 16): 15
```

In this case, you must start the shard buckets **in "order"**. That means that you can start shard 0 -> shard 15 concurrently, and then you can start shard 16 -> shard 31.

## Sharding for Large Bots

If you own a bot that is near or in over 150,000 guilds, there are some additional considerations you must take around sharding. Discord will migrate your bot to large bot sharding when it starts to get near the large bot sharding threshold. The bot owner(s) will receive a system DM and email confirming this move has completed as well as what shard number has been assigned.

The number of shards you run must be a multiple of the shard number provided when reaching out to you. If you attempt to start your bot with an invalid number of shards, your websocket connection will close with a 4010 Invalid Shard opcode.

The [Get Gateway Bot endpoint](#DOCS_TOPICS_GATEWAY/get-gateway-bot) will always return the correct amount of shards, so if you're already using this endpoint to determine your number of shards, you shouldn't require any changes.

The session start limit for these bots will also be increased from 1000 to `max(2000, (guild_count / 1000) * 3)` per day. You also receive an increased `max_concurrency`, the number of [shards you can concurrently start](#DOCS_TOPICS_GATEWAY/session-start-limit-object).

## Get Gateway % GET /gateway

> info
> This endpoint does not require authentication.

Returns an object with a single valid WSS URL, which the client can use for [Connecting](#DOCS_TOPICS_GATEWAY/connecting). Clients **should** cache this value and only call this endpoint to retrieve a new URL if they are unable to properly establish a connection using the cached version of the URL.

###### Example Response

```json
{
  "url": "wss://gateway.discord.gg/"
}
```

## Get Gateway Bot % GET /gateway/bot

> warn
> This endpoint requires authentication using a valid bot token.

Returns an object based on the information in [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway), plus additional metadata that can help during the operation of large or [sharded](#DOCS_TOPICS_GATEWAY/sharding) bots. Unlike the [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway), this route should not be cached for extended periods of time as the value is not guaranteed to be the same per-call, and changes as the bot joins/leaves guilds.

###### JSON Response

| Field               | Type                                                                          | Description                                                                              |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| url                 | string                                                                        | The WSS URL that can be used for connecting to the gateway                               |
| shards              | integer                                                                       | The recommended number of [shards](#DOCS_TOPICS_GATEWAY/sharding) to use when connecting |
| session_start_limit | [session_start_limit](#DOCS_TOPICS_GATEWAY/session-start-limit-object) object | Information on the current session start limit                                           |

###### Example Response

```json
{
  "url": "wss://gateway.discord.gg/",
  "shards": 9,
  "session_start_limit": {
    "total": 1000,
    "remaining": 999,
    "reset_after": 14400000,
    "max_concurrency": 1
  }
}
```

## Session Start Limit Object

###### Session Start Limit Structure

| Field           | Type    | Description                                                        |
| --------------- | ------- | ------------------------------------------------------------------ |
| total           | integer | The total number of session starts the current user is allowed     |
| remaining       | integer | The remaining number of session starts the current user is allowed |
| reset_after     | integer | The number of milliseconds after which the limit resets            |
| max_concurrency | integer | The number of identify requests allowed per 5 seconds              |
