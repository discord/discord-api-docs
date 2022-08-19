# Gateway

// TODO: literally need to figure out app/bot verbiage here. hella inconsistent

The Gateway API lets apps open secure WebSocket connections with Discord in order to receive events about things that happen in a server, like when a channel is updated or a role is created. There are a few scenarios where apps will also use a Gateway connection to update or request a resource (like when [updating voice state](#DOCS_TOPICS_GATEWAY/update-voice-state)), but in *most* cases they'll instead use the [HTTP API](#DOCS_REFERENCE/http-api) when performing REST operations on resources (like creating, updating, deleting, or fetching them). 

The Gateway is Discord's form of real-time communication used by all clients (including apps), so there is data and nuances that simply aren't relevant to apps. Interacting with the Gateway can be tricky, but there are [community-built libraries](#DOCS_TOPICS_COMMUNITY_RESOURCES/libraries) with built-in support that simplify the most complicated bits. If you're planning to write a custom implementation, be sure to read the following documentation in its entirety so you understand the sacred secrets of the Gateway.

## Gateway Events

Gateway events are payloads sent over a Gateway connection either from an app to Discord, or from Discord to an app. An app typically sends events when connecting and managing its connection to the Gateway, and receives events when it's listening to things taking place in a server.

Below is the common Gateway event payload structure and information about sending and receiving events. A full list of events, and details about them, are in the [Gateway event documentation](#DOCS_TOPICS_GATEWAY_EVENTS).

> warn
> Not all Gateway event fields are documented. You should assume that undocumented fields are not supported for apps, and their format and data may change at any time.

### Payload Structure

Gateway event payloads have a common structure, but the contents of the associated data (the `d` field) varies between events.

| Field | Type                    | Description                                                                                                                       |
| ----- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| op    | integer                 | [Gateway opcode](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-opcodes), which indicates the payload type                 |
| d     | ?mixed (any JSON value) | Event data                                                                                                                        |
| s     | ?integer \*             | Sequence number used for [resuming sessions](#DOCS_TOPICS_GATEWAY/resuming) and [heartbeating](#DOCS_TOPICS_GATEWAY/heartbeating) |
| t     | ?string \*              | Event name                                                                                                                        |

\* `s` and `t` are `null` when `op` is not `0` ([Gateway Dispatch opcode](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-opcodes)).

###### Example Gateway Event Payload

```json
{
  "op": 0,
  "d": {},
  "s": 42,
  "t": "GATEWAY_EVENT_NAME"
}
```

### Sending Events

When sending an [event](#DOCS_TOPICS_GATEWAY/commands-and-events-gateway-commands) (like when [performing an initial handshake](#DOCS_TOPICS_GATEWAY/identify) or [updating presence](#DOCS_TOPICS_GATEWAY/update-presence)), an app must send a [Gateway event payload object](#DOCS_TOPICS_GATEWAY/sending-payloads-example-gateway-event-payload) with a valid opcode and inner data object.

> info
> TODO: rate limit

Event payloads sent over a Gateway connection:

1. Must be serialized in [plain-text JSON or binary ETF](#DOCS_TOPICS_GATEWAY/etfjson)
2. Must not exceed 4096 bytes. If an event payload *does* exceed 4096, the connection will be closed with a [`4002` gateway close event code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes)

All send events are in the [event documentation](TODO).

### Receiving Events

Receiving an [event](#DOCS_TOPICS_GATEWAY/commands-and-events-gateway-commands) from Discord (like when [a reaction is added to a message](TODO)) is slightly more complex than sending them.

While some events are sent by default after your app successfully connects to the Gateway, other events require your app to define intents when initially [identifying](TODO). Intents are [TODO: bitwise whatever] that indicate which events (or groups of events) you want Discord to send your app. A list of intents and their corresponding events are listed in the [intents] section.

When receiving events, you can also configure how events will be sent to your app like how payloads are [encoded and compressed](), or whether to [enable sharding](TODO)).

All receive events are in the [event documentation](TODO).

## Gateway Connection Lifecycle

// TODO: rename to just "Gateway Connections" then make lifecycle the first section

Gateway connections are persistent WebSockets, which introduce more complexity than sending HTTP requests or responding to slash commands. An app must know how to open the initial connection, as well as maintain it and handle any disconnects. At a high-level, Gateway connections require the following cycle:

> info
> There are some nuances that aren't included below. More information about each connection step and event can be found in the sections below.

// TODO: maybe a flowchart?

![High level overview of Gateway connection lifecycle](gateway-lifecycle.png)

1. App calls the [Get Gateway](TODO) or [Get Gateway Bot](TODO) endpoint to fetch a valid WebSocket URL to use when connecting to the Gateway.
2. App establishes a connection with the Gateway using the WebSocket URL.
3. Discord sends the app a [Hello event](TODO) (opcode `10`) containing a heartbeat interval (in milliseconds).
   - From this point forward, the app must continue to send a [Heartbeat event](TODO) (opcode `1`) every heartbeat interval until the connection is closed.
   - Discord will respond to a Heartbeat event with a [Heartbeat ACK event](TODO) to confirm it was received. If an app doesn't receive a Heartbeat ACK, it should [Reconnect](TODO).
4. App sends an [Identify event](TODO) (opcode `2`) to perform the initial handshake with the Gateway.
5. Discord sends the app a [Ready event](TODO) which indicates the handshake was successful and the connection was established.
   - The Ready event contains a `resume_gateway_url` that the app should keep track of to determine the WebSocket URL an app should resume/reconnect with.
6. The connection may be dropped for a variety of reasons. Whether your app can [Resume](TODO) the connection or whether it must fully re-identify is determined by a variety of factors like the [opcode](TODO) or [close code](TODO) the app receives.
   - If an app **can** resume/reconnect, it should open a new connection then send a [Resume event](TODO) (opcode `6`)
   - If an app **cannot** resume/reconnect, it should open a new connection and repeat the whole cycle. *Yipee!*

### Connecting

Before you can establish a connection to the Gateway, you should call the [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) or the [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot) endpoint. Either method will return a payload with a `url` field whose value is the URL you can use to open a WebSocket connection.

> info
> TODO: wss://gateway.discord.gg always works??

You can go ahead and open a connection to the WebSocket URL. When connecting to the URL, it's a good idea to explicitly pass the API version and [encoding](TODO) as query parameters. You can also optionally include whether Discord should [compress](TODO) packets that it sends to your app. Details about the query parameters are in the table below.

> info
> `wss://gateway.discord.gg/?v=10&encoding=json` is an example of a WebSocket URL an app may connect to

###### Gateway URL Query String Params

| Field     | Type    | Description                                             | Accepted Values                                            |
| --------- | ------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| v         | integer | API Version to use                                      | [API version](#DOCS_REFERENCE/api-versioning-api-versions) |
| encoding  | string  | The encoding of received gateway packets                | `json` or `etf`                                            |
| compress? | string  | The (optional) transport compression of gateway packets | `zlib-stream`                                              |

#### Hello Event

Once connected to the Gateway, your app should receive a [Opcode 10 Hello](#DOCS_TOPICS_GATEWAY/hello) payload that contains the connection's heartbeat interval (`hearbeat_interval`). The heartbeat interval indicates a length of time in milliseconds that an app should use to determine how often it needs to send a [Heartbeat event](TODO) to in order to maintain the active Gateway connection. Details about heartbeats is in the [Sending Heartbeats](TODO) section.

###### Example Hello Event

```json
{
  "op": 10,
  "d": {
    "heartbeat_interval": 45000
  }
}
```

### Sending Heartbeats

// TODO: what is jitter? after `heartbeat_interval * jitter` milliseconds (where jitter is a random value between 0 and 1), and every `heartbeat_interval` milliseconds thereafter. 

Heartbeats are pings used to let Discord know that an app is still actively using the Gateway connection.

#### Heartbeat Interval

When an app receives an [Opcode 10 Hello](#DOCS_TOPICS_GATEWAY/hello) event, the payload includes a `heartbeat_interval`. From that point until the connection is closed, the app must continually send Discord a [Heartbeat event](TODO) every `heartbeat_interval` milliseconds. If the app fails to send a [Opcode 1 Heartbeat](TODO) in time, it will be disconnected and forced to [Resume](TODO).

You *can* send heartbeats before the `heartbeat_interval` elapses, but you should avoid doing so unless necessary. There is already tolerance in the `heartbeat_interval` that will cover network latency, so you do not need to account for it in your own implementation.

When an app sends a Heartbeat event, Discord will respond with [Opcode 11 Heartbeat ACK](#DOCS_TOPICS_GATEWAY/heartbeating-example-gateway-heartbeat-ack), which is an acknowledgement that the heartbeat was received:

###### Example Heartbeat ACK

```json
{
  "op": 11
}
```

> info
> In the event of a service outage where you stay connected to the Gateway, you should continue to send heartbeats and receive heartbeat ACKs. The Gateway will eventually respond and issue a session once it's able to.

If a client does not receive a heartbeat ack between its attempts at sending heartbeats, this may be due to a failed or "zombied" connection. The client should then immediately terminate the connection with a non-1000 close code, reconnect, and attempt to [Resume](#DOCS_TOPICS_GATEWAY/resuming).

// TODO: does non-1000 close code need extra clarity?

#### Heartbeat Requests

In addition to the Heartbeat interval, the Gateway may request additional heartbeats from an app by sending it a [Opcode 1 Heartbeat](#DOCS_TOPICS_GATEWAY/heartbeat). Upon receiving the event, the app should immediately send an [Opcode 1 Heartbeat](#DOCS_TOPICS_GATEWAY/heartbeat) without waiting the remainder of the current heartbeat interval.

Just like with the interval, Discord will respond with [Opcode 11 Heartbeat ACK](#DOCS_TOPICS_GATEWAY/heartbeating-example-gateway-heartbeat-ack).

### Identifying

// TODO: max concurrency cleanup

After the connection is open and your app is sending heartbeats, you should send an [Opcode 2 Identify](#DOCS_TOPICS_GATEWAY/identify) event. The Identify event is an initial handshake with the Gateway that's required before your app can begin sending or receiving most Gateway events. Apps are limited by [maximum concurrency](#DOCS_TOPICS_GATEWAY/session-start-limit-object) when identifying. If they exceed this limit, Discord will respond with a [Opcode 9 Invalid Session](#DOCS_TOPICS_GATEWAY/invalid-session).

After an app sends a valid Identify payload, Discord will respond with a [Ready](#DOCS_TOPICS_GATEWAY/ready) event which indicates that your app is in a connected state with the Gateway.

> warn
> Clients are limited to 1000 `IDENTIFY` calls to the websocket in a 24-hour period. This limit is global and across all shards, but does not include `RESUME` calls. Upon hitting this limit, all active sessions for the app will be terminated, the bot token will be reset, and the owner will receive an email notification. It's up to the owner to update their application with the new token.

###### Example Identify Payload

This is a minimal `IDENTIFY` payload. `IDENTIFY` supports additional optional fields for other session properties such as payload compression or an initial presence state.

See the [Identify Structure](#DOCS_TOPICS_GATEWAY/identify) for details about all of the options you can pass.

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

#### Ready event

As mentioned above, the [Ready](TODO) event is sent to an app after it sends a valid Identify payload. The Ready event includes state required for your app to start interacting with the rest of the platform (like the guilds your app is in).

//TODO: session_id field to highlight is the `resume_gateway_url` field, which contains a new WebSocket URL that your app should use when it [Resumes](TODO) after a disconnect. This URL should be used instead of the one [initially used when connecting](TODO). If the Resume fails, the app should use .

Full details about the Ready event is in the [Gateway events documentation](TODO).

### Disconnecting

Gateway disconnects happen for a variety of reasons, and may be initiated by Discord or by your app.

#### Handling a Disconnect

Due to Discord's architecture, disconnects are a semi-regular event and should be expected and handled. When your app encounters a disconnect, it will typically be sent a [close code](TODO) which can be used to determine whether you can reconnect and [Resume](TODO) the session or not.

After you determine whether you app can reconnect you will do one of the following:

- If you determine that your app *can* reconnect and resume the previous session, then you should reconnect using the `resume_gateway_url` and `session_id` from the [Ready event](TODO). Details about when and how to resume can be found in the [Resuming](TODO) section.
- If you *cannot* reconnect (or the reconnect fails), you should open a new connection using the URL from the initial call to [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) or the [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot) endpoint. **In the case you cannot reconnect, you'll have to re-[Identify](TODO) after opening a new connection**.

A full list of the close codes can be found in the [Response Codes](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes) documentation.

#### Initiating a Disconnect

When you close the connection to the gateway with the close code `1000` or `1001`, your session will be invalidated and your bot will appear offline.

If you simply close the TCP connection or use a different close code, the session will remain active and timeout after a few minutes. This can be useful when you're [reconnecting](TODO), which will resume the previous session.

### Resuming

When your app is disconnected, Discord has a process for resuming (or reconnecting) a connection that allows the app to replay any lost events from the last sequence number they received in the same way they would have normally received them. Unlike the initial connection, your app does **not** need to re-identify when resuming a session.

There are a handful of scenarios when your app should attempt to resume a session:

1. TODO

#### Preparing to Resume

Before your app can send a [Resume event](TODO), it will need three values: the `session_id` and `resume_gateway_url` from the [Ready](#DOCS_TOPICS_GATEWAY/ready) event, and the sequence number of the last event it received before the disconnect.

After the connection is closed, your app should open a new connection using the value of `resume_gateway_url` rather than the URL you used to initially connect. 
// TODO: when reconnecting, do you need to pass in the query params?

Once the new connection is opened, your app should send a [Gateway Resume](#DOCS_TOPICS_GATEWAY/resume) event using the `session_id` and sequence number mentioned above.

###### Example Gateway Resume Event

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

## Gateway Intents

Maintaining a stateful application can be difficult when it comes to the amount of data you're expected to process, especially at scale. Gateway Intents are a system to help you lower that computational burden.

> info
> Intents are optionally supported on the v6 gateway but required as of v8

> info
> Starting in v10, `MESSAGE_CONTENT` (`1 << 15`) is required to receive non-empty values for content fields (`content`, `attachments`, `embeds`, and `components`). This doesn't apply for DMs, messages your bot sends, or messages in which your bot is mentioned. `MESSAGE_CONTENT` is not currently required for previous API versions.

When [identifying](#DOCS_TOPICS_GATEWAY/identifying) to the gateway, you can specify an `intents` parameter which allows you to conditionally subscribe to pre-defined "intents", groups of events (or event data) defined by Discord. If you do not specify a certain intent, you will not receive any of the gateway events that are batched into that group. The valid intents are:

### List of Intents

// TODO: example of this?
Any [events not associated with an intent below](#DOCS_TOPICS_GATEWAY/commands-and-events-gateway-events) will always be sent to your app.

// TODO: should this be turned into a table? moved to events? idkidk

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
> This section refers to Gateway rate limits, not [HTTP API rate limits](#DOCS_TOPICS_RATE_LIMITS)

Apps can send 120 [gateway events](#DOCS_TOPICS_GATEWAY/commands-and-events) every 60 seconds, meaning an average of 2 commands per second. Apps that surpass the limit are immediately disconnected from the Gateway. Similarly to other rate limits, repeat offenders will have their API access revoked.

Apps also have a limit for [concurrent](#DOCS_TOPICS_GATEWAY/session-start-limit-object) [Identify](#DOCS_TOPICS_GATEWAY/identify) requests allowed per 5 seconds. If you hit this limit, the Gateway will respond with an [Opcode 9 Invalid Session](#DOCS_TOPICS_GATEWAY/invalid-session).

## Encoding and Compression

When [establishing a connection](#DOCS_TOPICS_GATEWAY/connecting) to the Gateway, apps can use the `encoding` parameter to choose whether to communicate with Discord using either a plain-text JSON or binary [ETF](https://erlang.org/doc/apps/erts/erl_ext_dist.html) encoding. You can pick whichever encoding type you're more comfortable with, but both have their own quirks. If you aren't sure which encoding to use, JSON is generally recommended.

Apps can also optionally enable compression ([payload](TODO) or [transport](TODO)) to receive zlib-compressed //TODO: what word? events?// over the Gateway.

### Using JSON Encoding

// TODO: present transport as alternative
When using the plain-text JSON encoding, apps have the option to enable [Payload Compression](#DOCS_TOPICS_GATEWAY/using-json-payload-compression).

#### Payload Compression

> warn
> Payload compression can only be enabled when using JSON as the encoding type

// TODO: how do you tell when a payload is compressed? something about zlib header i think

Payload compression enables optional per-packet compression when Discord is sending events over the Gateway. Payload compression uses the zlib format (see [RFC1950 2.2](https://tools.ietf.org/html/rfc1950#section-2.2)) when sending payloads. To enable payload compression, your app can set `compress` to `true` when sending an [Identify event](#DOCS_TOPICS_GATEWAY/identify). Note that even when payload compression is enabled, not all payloads will be compressed.

When payload compression is enabled, your app (or library) _must_ detect and decompress these payloads to plain-text JSON before attempting to parse them. If you are using payload compression, the gateway does not implement a shared compression context between events sent.

Payload compression will be disabled if you use [transport compression](TODO).

### Using ETF Encoding

When using ETF (External Term Format) encoding, there are some specific behaviors you should know:

- Snowflake IDs are transmitted as 64-bit integers or strings.
- Your app can't send compressed messages to the server.
- When sending payloads, you must use string keys. Using atom keys will result in a [`4002`](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes) decode error.

See [erlpack](https://github.com/discord/erlpack) for an ETF implementation example.

### Transport Compression

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

## Tracking State

Most of a client's state is provided during the initial [Ready](#DOCS_TOPICS_GATEWAY/ready) event, and in the [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) events that follow.

As resources continue to be created, updated, and deleted, other events are sent to notify the app of these changes and to provide the new or updated data. To avoid excessive API calls, it's expected that apps locally cache as many relevant resource states as possible, and update them as new Gateway events are received.

> info
> For larger apps, client state can grow to be very large. Therefore, we recommend only storing data in memory that are *needed* for the app to operate. In some cases, there isn't a need to cache member information (like roles or permissions) since some events like [MESSAGE_CREATE](#DOCS_TOPICS_GATEWAY/message-create) have the full member object included.

An example of state tracking can be considered in the case of an app that wants to track member status: when initially connecting to the Gateway, the app will receive information about the online status of guild members (whether they're online, idle, dnd, or offline). To keep the state updated, the app will track and parse [Presence Update](#DOCS_TOPICS_GATEWAY/presence-update) events as they're received, then update the cached member objects accordingly.

## Guild Availability

// TODO: can this be cut and incorporated into another section instead?

When connecting to the gateway as a bot user, guilds that the bot is a part of will start out as unavailable. Don't fret! The gateway will automatically attempt to reconnect on your behalf. As guilds become available to you, you will receive [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) events.

## Sharding

// TODO: recommended number of shards

As apps grow and are added to an increasing number of guilds, some developers may find it necessary to break or split portions of their app's operations into separate processes. As such, Gateways implement a method of user-controlled guild sharding which allows apps to split events across a number of Gateway connections. Guild sharding is entirely controlled by an app, and requires no state-sharing between separate connections to operate.

To enable sharding on a connection, the app should send the `shard` array in the [Identify](#DOCS_TOPICS_GATEWAY/identify) payload. The first item in this array should be the zero-based integer value of the current shard, while the second represents the total number of shards. DMs will only be sent to shard 0. To calculate which events will be sent to which shard, the following formula can be used:

###### Sharding Formula

```python
shard_id = (guild_id >> 22) % num_shards
```

As an example, if you wanted to split the connection between three shards, you'd use the following values for `shard` for each connection: `[0, 3]`, `[1, 3]`, and `[2, 3]`. Note that only the first shard (`[0, 3]`) would receive DMs.

Note that `num_shards` does not relate to (or limit) the total number of potential sessions. It is only used for *routing* traffic. As such, sessions do not have to be identified in an evenly-distributed manner when sharding. You can establish multiple sessions with the same `[shard_id, num_shards]`, or sessions with different `num_shards` values. This allows you to create sessions that will handle more or less traffic for more fine-tuned load balancing, or to orchestrate "zero-downtime" scaling/updating by handing off traffic to a new deployment of sessions with a higher or lower `num_shards` count that are prepared in parallel.

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

### Sharding for Large Bots

If you own a bot that is near or in over 150,000 guilds, there are some additional considerations you must take around sharding. Discord will migrate your bot to large bot sharding when it starts to get near the large bot sharding threshold. The bot owner(s) will receive a system DM and email confirming this move has completed as well as what shard number has been assigned.

The number of shards you run must be a multiple of the shard number provided when reaching out to you. If you attempt to start your bot with an invalid number of shards, your websocket connection will close with a 4010 Invalid Shard opcode.

The [Get Gateway Bot endpoint](#DOCS_TOPICS_GATEWAY/get-gateway-bot) will always return the correct amount of shards, so if you're already using this endpoint to determine your number of shards, you shouldn't require any changes.

The session start limit for these bots will also be increased from 1000 to `max(2000, (guild_count / 1000) * 3)` per day. You also receive an increased `max_concurrency`, the number of [shards you can concurrently start](#DOCS_TOPICS_GATEWAY/session-start-limit-object).

## Get Gateway % GET /gateway

> info
> This endpoint does not require authentication.

Returns an object with a valid WSS URL, which the client can use for [Connecting](#DOCS_TOPICS_GATEWAY/connecting). Apps should cache this value and only call this endpoint to retrieve a new URL if they are unable to properly establish a connection using the cached one.

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
| url                 | string                                                                        | WSS URL that can be used for connecting to the gateway                               |
| shards              | integer                                                                       | Recommended number of [shards](#DOCS_TOPICS_GATEWAY/sharding) to use when connecting |
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

| Field           | Type    | Description                                                    |
| --------------- | ------- | -------------------------------------------------------------- |
| total           | integer | Total number of session starts the current user is allowed     |
| remaining       | integer | Remaining number of session starts the current user is allowed |
| reset_after     | integer | Number of milliseconds after which the limit resets            |
| max_concurrency | integer | Number of identify requests allowed per 5 seconds              |
