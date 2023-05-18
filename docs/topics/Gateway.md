# Gateway

The Gateway API lets apps open secure WebSocket connections with Discord to receive events about actions that take place in a server/guild, like when a channel is updated or a role is created. There are a few cases where apps will *also* use Gateway connections to update or request resources, like when updating voice state.

> info
> In *most* cases, performing REST operations on Discord resources can be done using the [HTTP API](#DOCS_REFERENCE/http-api) rather than the Gateway API. 

The Gateway is Discord's form of real-time communication used by clients (including apps), so there are nuances and data passed that simply isn't relevant to apps. Interacting with the Gateway can be tricky, but there are [community-built libraries](#DOCS_TOPICS_COMMUNITY_RESOURCES/libraries) with built-in support that simplify the most complicated bits and pieces. If you're planning on writing a custom implementation, be sure to read the following documentation in its entirety so you understand the sacred secrets of the Gateway (or at least those that matter for apps).

## Gateway Events

Gateway events are [payloads](#DOCS_TOPICS_GATEWAY_EVENTS/payload-structure) sent over a [Gateway connection](#DOCS_TOPICS_GATEWAY/connections)—either from an app to Discord, or from Discord to an app. An app typically [*sends* events](#DOCS_TOPICS_GATEWAY/sending-events) when connecting and managing its connection to the Gateway, and [*receives* events](#DOCS_TOPICS_GATEWAY/receiving-events) when listening to actions taking place in a server.

All Gateway events are encapsulated in a [Gateway event payload](#DOCS_TOPICS_GATEWAY_EVENTS/payload-structure).

A full list of Gateway events and their details are in the [Gateway events documentation](#DOCS_TOPICS_GATEWAY_EVENTS).

###### Example Gateway Event

```json
{
  "op": 0,
  "d": {},
  "s": 42,
  "t": "GATEWAY_EVENT_NAME"
}
```

Details about Gateway event payloads are in the [Gateway events documentation](#DOCS_TOPICS_GATEWAY_EVENTS/payload-structure).

### Sending Events

When sending a Gateway event (like when [performing an initial handshake](#DOCS_TOPICS_GATEWAY_EVENTS/identify) or [updating presence](#DOCS_TOPICS_GATEWAY_EVENTS/update-presence)), your app must send an [event payload object](#DOCS_TOPICS_GATEWAY_EVENTS/payload-structure) with a valid opcode (`op`) and inner data object (`d`).

> info
> Specific rate limits are applied when sending events, which you can read about in the [Rate Limiting](#DOCS_TOPICS_GATEWAY/rate-limiting) section.

Event payloads sent over a Gateway connection:

1. Must be serialized in [plain-text JSON or binary ETF](#DOCS_TOPICS_GATEWAY/encoding-and-compression).
2. Must not exceed 4096 bytes. If an event payload *does* exceed 4096 bytes, the connection will be closed with a [`4002` close event code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes).

All events that your app can send via a connection are in [Gateway event documentation](#DOCS_TOPICS_GATEWAY_EVENTS/send-events).

### Receiving Events

Receiving a Gateway event from Discord (like when [a reaction is added to a message](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-add)) is much more common (and slightly more complex) than sending them.

While some events are sent to your app automatically, most events require your app to define intents when [Identifying](#DOCS_TOPICS_GATEWAY/identifying). Intents are bitwise values that can be ORed (`|`) to indicate which events (or groups of events) you want Discord to send your app. A list of intents and their corresponding events are listed in the [intents section](#DOCS_TOPICS_GATEWAY/gateway-intents).

When receiving events, you can also configure *how* events will be sent to your app, like the [encoding and compression](#DOCS_TOPICS_GATEWAY/encoding-and-compression), or whether [sharding should be enabled](#DOCS_TOPICS_GATEWAY/sharding)).

All events that your app can receive via a connection are in the [Gateway event documentation](#DOCS_TOPICS_GATEWAY_EVENTS/receive-events).

#### Dispatch Events

[Dispatch (opcode `0`)](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-opcodes) events are the most common type of event your app will receive. *Most* Gateway events which represent actions taking place in a guild will be sent to your app as Dispatch events.

When your app is parsing a Dispatch event:
- The `t` field can be used to determine which [Gateway event](#DOCS_TOPICS_GATEWAY_EVENTS/receive-events) the payload represents the data you can expect in the `d` field.
- The `s` field represents the sequence number of the event, which is the relative order in which it occurred. You need to cache the most recent non-null `s` value for heartbeats, and to pass when [Resuming](#DOCS_TOPICS_GATEWAY/resuming) a connection.

## Connections

Gateway connections are persistent WebSockets which introduce more complexity than sending HTTP requests or responding to interactions (like Slash Commands). When interacting with the Gateway, your app must know how to open the initial connection, as well as maintain it and handle any disconnects.

### Connection Lifecycle

> info
> There are nuances that aren't included in the overview below. More details about each step and event can be found in the individual sections below.

At a high-level, Gateway connections consist of the following cycle:

![Flowchart with an overview of Gateway connection lifecycle](gateway-lifecycle.svg)
    
1. App establishes a connection with the Gateway after fetching and caching a WSS URL using the [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) or [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot) endpoint.
2. Discord sends the app a [Hello (opcode `10`)](#DOCS_TOPICS_GATEWAY/hello-event) event containing a heartbeat interval in milliseconds. **Read the section on [Connecting](#DOCS_TOPICS_GATEWAY/connecting)**
3. Start the Heartbeat interval. App must send a [Heartbeat (opcode `1`)](#DOCS_TOPICS_GATEWAY_EVENTS/heartbeat) event, then continue to send them every heartbeat interval until the connection is closed. **Read the section on [Sending Heartbeats](#DOCS_TOPICS_GATEWAY/sending-heartbeats)**
   - Discord will respond to each Heartbeat event with a [Heartbeat ACK (opcode `11`)](#DOCS_TOPICS_GATEWAY/sending-heartbeats) event to confirm it was received. If an app doesn't receive a Heartbeat ACK, it should close the connection and reconnect.
   - Discord may send the app a [Heartbeat (opcode `1`)](#DOCS_TOPICS_GATEWAY_EVENTS/heartbeat) event, in which case the app should send a Heartbeat event immediately.
4. App sends an [Identify (opcode `2`)](#DOCS_TOPICS_GATEWAY_EVENTS/identify) event to perform the initial handshake with the Gateway. **Read the section on [Identifying](#DOCS_TOPICS_GATEWAY/identifying)**
5. Discord sends the app a [Ready (opcode `0`)](#DOCS_TOPICS_GATEWAY_EVENTS/ready) event which indicates the handshake was successful and the connection is established. The Ready event contains a `resume_gateway_url` that the app should keep track of to determine the WebSocket URL an app should use to Resume. **Read the section on [the Ready event](#DOCS_TOPICS_GATEWAY/ready-event)**
6. The connection may be dropped for a variety of reasons. Whether the app can [Resume](#DOCS_TOPICS_GATEWAY/resuming) the connection or whether it must re-identify is determined by a variety of factors like the [opcode](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-opcodes) and [close code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes) that it receives. **Read the section on [Disconnecting](#DOCS_TOPICS_GATEWAY/disconnecting)**
7. If an app **can** resume/reconnect, it should open a new connection using `resume_gateway_url`, then send a [Resume (opcode `6`)](#DOCS_TOPICS_GATEWAY_EVENTS/resume) event. If an app **cannot** resume/reconnect, it should open a new connection using the cached URL from step #1, then repeat the whole Gateway cycle. *Yipee!* **Read the section on [Resuming](#DOCS_TOPICS_GATEWAY/resuming)**

### Connecting

Before your app can establish a connection to the Gateway, it should call the [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) or the [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot) endpoint. Either endpoint will return a payload with a `url` field whose value is the WSS URL you can use to open a WebSocket connection. In addition to the URL, [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot) contains additional information about the recommended number of shards and the session start limits for your app.

When initially calling either [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) or [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot), you should cache the value of the `url` field and use that when re-connecting to the Gateway.

When connecting to the URL, it's a good idea to explicitly pass the API version and [encoding](#DOCS_TOPICS_GATEWAY/encoding-and-compression) as query parameters. You can also optionally include whether Discord should [compress](#DOCS_TOPICS_GATEWAY/encoding-and-compression) data that it sends your app.

> info
> `wss://gateway.discord.gg/?v=10&encoding=json` is an example of a WSS URL an app may use to connect to the Gateway.

###### Gateway URL Query String Params

| Field     | Type    | Description                                                                                         | Accepted Values                                            |
| --------- | ------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| v         | integer | [API Version](#DOCS_REFERENCE/api-versioning) to use                                                | [API version](#DOCS_REFERENCE/api-versioning-api-versions) |
| encoding  | string  | The [encoding](#DOCS_TOPICS_GATEWAY/encoding-and-compression) of received gateway packets           | `json` or `etf`                                            |
| compress? | string  | The optional [transport compression](#DOCS_TOPICS_GATEWAY/transport-compression) of gateway packets | `zlib-stream`                                              |

#### Hello Event

Once connected to the Gateway, your app will receive a [Hello (opcode `10`)](#DOCS_TOPICS_GATEWAY/hello-event) event that contains your connection's heartbeat interval (`hearbeat_interval`).

The heartbeat interval indicates a length of time in milliseconds that you should use to determine how often your app needs to send a Heartbeat event in order to maintain the active connection. Heartbeating is detailed in the [Sending Heartbeats](#DOCS_TOPICS_GATEWAY/sending-heartbeats) section.

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

Heartbeats are pings used to let Discord know that your app is still actively using a Gateway connection. After connecting to the Gateway, your app should send heartbeats (as described below) in a background process until the Gateway connection is closed.

#### Heartbeat Interval

When your app opens a Gateway connection, it will receive a [Hello (opcode `10`)](#DOCS_TOPICS_GATEWAY/hello-event) event which includes a `heartbeat_interval` field that has a value representing a length of time in milliseconds.

Upon receiving the Hello event, your app should wait `heartbeat_interval * jitter` where `jitter` is any random value between 0 and 1, then send its first [Heartbeat (opcode `1`)](#DOCS_TOPICS_GATEWAY_EVENTS/heartbeat) event. From that point until the connection is closed, your app must continually send Discord a heartbeat every `heartbeat_interval` milliseconds. If your app fails to send a heartbeat event in time, your connection will be closed and you will be forced to [Resume](#DOCS_TOPICS_GATEWAY/resuming).

When sending a heartbeat, your app will need to include the last sequence number your app received in the `d` field. The sequence number is sent to your app in the [event payload](#DOCS_TOPICS_GATEWAY_EVENTS/payload-structure) in the `s` field. If your app hasn't received any events yet, you can just pass `null` in the `d` field.

> info
> In the first heartbeat, `jitter` is an offset value between 0 and `heartbeat_interval` that is meant to prevent too many clients (both desktop and apps) from reconnecting their sessions at the exact same time (which could cause an influx of traffic).

You *can* send heartbeats before the `heartbeat_interval` elapses, but you should avoid doing so unless necessary. There is already tolerance in the `heartbeat_interval` that will cover network latency, so you don't need to account for it in your implementation.

When you send a Heartbeat event, Discord will respond with a [Heartbeat ACK (opcode `11`)](#DOCS_TOPICS_GATEWAY/heartbeat-interval-example-heartbeat-ack) event, which is an acknowledgement that the heartbeat was received:

###### Example Heartbeat ACK

```json
{
  "op": 11
}
```

> info
> In the event of a service outage where you stay connected to the Gateway, you should continue to send heartbeats and receive heartbeat ACKs. The Gateway will eventually respond and issue a session once it's able to.

If a client does not receive a heartbeat ACK between its attempts at sending heartbeats, this may be due to a failed or "zombied" connection. The client should immediately terminate the connection with any close code besides `1000` or `1001`, then reconnect and attempt to [Resume](#DOCS_TOPICS_GATEWAY/resuming).

#### Heartbeat Requests

In addition to the Heartbeat interval, Discord may request additional heartbeats from your app by sending a [Heartbeat (opcode `1`)](#DOCS_TOPICS_GATEWAY_EVENTS/heartbeat) event. Upon receiving the event, your app should immediately send back another Heartbeat event without waiting the remainder of the current interval.

Just like with the interval, Discord will respond with an [Heartbeat ACK (opcode `11`)](#DOCS_TOPICS_GATEWAY/heartbeat-interval-example-heartbeat-ack) event.

### Identifying

After the connection is open and your app is sending heartbeats, you should send an [Identify (opcode `2`)](#DOCS_TOPICS_GATEWAY_EVENTS/identify) event. The Identify event is an initial handshake with the Gateway that's required before your app can begin sending or receiving most Gateway events.

Apps are limited by maximum concurrency (`max_concurrency` in the [session start limit object](#DOCS_TOPICS_GATEWAY/session-start-limit-object)) when identifying. If your app exceeds this limit, Discord will respond with a [Invalid Session (opcode `9`)](#DOCS_TOPICS_GATEWAY_EVENTS/invalid-session) event.

After your app sends a valid Identify payload, Discord will respond with a [Ready](#DOCS_TOPICS_GATEWAY_EVENTS/ready) event which indicates that your app is in a successfully-connected state with the Gateway. The Ready event is sent as a standard [Dispatch (opcode `0`)](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-opcodes).

> warn
> Clients are limited to 1000 `IDENTIFY` calls to the websocket in a 24-hour period. This limit is global and across all shards, but does not include `RESUME` calls. Upon hitting this limit, all active sessions for the app will be terminated, the bot token will be reset, and the owner will receive an email notification. It's up to the owner to update their application with the new token.

###### Example Identify Payload

Below is a minimal `IDENTIFY` payload. `IDENTIFY` supports additional fields for other session properties like payload compression and an initial presence state.

See the [Identify Structure](#DOCS_TOPICS_GATEWAY_EVENTS/identify-identify-structure) for details about the event.

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

As mentioned above, the [Ready](#DOCS_TOPICS_GATEWAY_EVENTS/ready) event is sent to your app after it sends a valid Identify payload. The Ready event includes state, like the guilds your app is in, that it needs to start interacting with the rest of the platform.

The Ready event also includes fields that you'll need to cache in order to eventually [Resume](#DOCS_TOPICS_GATEWAY/resuming) your connection after disconnects. Two fields in particular are important to call out:
- `resume_gateway_url` is a WebSocket URL that your app should use when it Resumes after a disconnect. The `resume_gateway_url` should be used instead of the URL [used when connecting](#DOCS_TOPICS_GATEWAY/connecting).
- `session_id` is the ID for the Gateway session for the new connection. It's required to know which stream of events were associated with your disconnection connection.

Full details about the Ready event is in the [Gateway events documentation](#DOCS_TOPICS_GATEWAY_EVENTS).

### Disconnecting

Gateway disconnects happen for a variety of reasons, and may be initiated by Discord or by your app.

#### Handling a Disconnect

Due to Discord's architecture, disconnects are a semi-regular event and should be expected and handled. When your app encounters a disconnect, it will typically be sent a [close code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes) which can be used to determine whether you can reconnect and [Resume](#DOCS_TOPICS_GATEWAY/resuming) the session, or whether you have to start over and re-Identify.

After you determine whether or not your app can reconnect, you will do one of the following:

- If you determine that your app *can* reconnect and resume the previous session, then you should reconnect using the `resume_gateway_url` and `session_id` from the [Ready](#DOCS_TOPICS_GATEWAY_EVENTS/ready) event. Details about when and how to resume can be found in the [Resuming](#DOCS_TOPICS_GATEWAY/resuming) section.
- If you *cannot* reconnect **or the reconnect fails**, you should open a new connection using the URL from the initial call to [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) or [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot). In the case you cannot reconnect, you'll have to re-identify after opening a new connection.

A full list of the close codes can be found in the [Response Codes](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes) documentation.

#### Initiating a Disconnect

When you close the connection to the gateway with close code `1000` or `1001`, your session will be invalidated and your bot will appear offline.

If you simply close the TCP connection or use a different close code, the session will remain active and timeout after a few minutes. This can be useful when you're [Resuming](#DOCS_TOPICS_GATEWAY/resuming) the previous session.

### Resuming

When your app is disconnected, Discord has a process for reconnecting and resuming, which allows your app to replay any lost events starting from the last sequence number it received. After Resuming, your app will receive the missed events in the same way it would have had the connection had stayed active. Unlike the initial connection, your app does **not** need to re-Identify when Resuming.

There are a handful of scenarios when your app should attempt to resume:

1. It receives a [Reconnect (opcode `7`)](#DOCS_TOPICS_GATEWAY_EVENTS/reconnect) event
2. It's disconnected with a close code that indicates it can reconnect. A list of close codes is in the [Opcodes and Status Codes](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes) documentation.
3. It's disconnected but doesn't receive *any* close code.
4. It receives an [Invalid Session (opcode `9`)](#DOCS_TOPICS_GATEWAY_EVENTS/invalid-session) event with the `d` field set to `true`. This is an unlikely scenario, but it is possible.

#### Preparing to Resume

Before your app can send a [Resume (opcode `6`)](#DOCS_TOPICS_GATEWAY_EVENTS/resume) event, it will need three values: the `session_id` and the `resume_gateway_url` from the [Ready](#DOCS_TOPICS_GATEWAY/ready-event) event, and the sequence number (`s`) from the last Dispatch (opcode `0`) event it received before the disconnect.

After the connection is closed, your app should open a new connection using `resume_gateway_url` rather than the URL used to initially connect. If your app doesn't use the `resume_gateway_url` when reconnecting, it will experience disconnects at a higher rate than normal.

Once the new connection is opened, your app should send a [Gateway Resume](#DOCS_TOPICS_GATEWAY_EVENTS/resume) event using the `session_id` and sequence number mentioned above. When sending the event, `session_id` will have the same field name, but the last sequence number will be passed as `seq` in the data object (`d`).

When Resuming, you do not need to send an Identify event after opening the connection.

If successful, the Gateway will send the missed events in order, finishing with a [Resumed](#DOCS_TOPICS_GATEWAY_EVENTS/resumed) event to signal event replay has finished and that all subsequent events will be new.

It's possible your app won't reconnect in time to Resume, in which case it will receive an [Invalid Session (opcode `9`)](#DOCS_TOPICS_GATEWAY_EVENTS/invalid-session) event. If the `d` field is set to `false` (which is most of the time), your app should disconnect. After disconnect, your app should create a new connection with your cached URL from the [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) or the [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot) endpoint, then send an [Identify (opcode `2`)](#DOCS_TOPICS_GATEWAY_EVENTS/identify) event.

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

## Gateway Intents

Maintaining a stateful application can be difficult when it comes to the amount of data your app is expected to process over a Gateway connection, especially at scale. Gateway intents are a system to help you lower the computational burden.

Intents are bitwise values passed in the `intents` parameter when [Identifying](#DOCS_TOPICS_GATEWAY/identifying) which correlate to a set of related events. For example, the event sent when a guild is created (`GUILD_CREATE`) and when a channel is updated (`CHANNEL_UPDATE`) both require the same `GUILDS (1 << 0)` intent (as listed in the table below). If you do not specify an intent when identifying, you will not receive *any* of the Gateway events associated with that intent.

> info
> Intents are optionally supported on the v6 gateway but required as of v8

Two types of intents exist:
- **Standard intents** can be passed by default. You don't need any additional permissions or configurations.
- [**Privileged intents**](#DOCS_TOPICS_GATEWAY/privileged-intents) require you to toggle the intent for your app in your app's settings within the Developer Portal before passing said intent. For verified apps (required for apps in 100+ guilds), the intent must also be approved after the verification process to use the intent. More information about privileged intents can be found [in the section below](#DOCS_TOPICS_GATEWAY/privileged-intents).

The connection with your app will be closed if it passes invalid intents ([`4013` close code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes)), or a privileged intent that hasn't been configured or approved for your app ([`4014` close code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes)).


### List of Intents

Below is a list of all intents and the Gateway events associated with them. Any events *not* listed means it's not associated with an intent and will always be sent to your app.

All events, including those that aren't associated with an intent, are in the [Gateway events](#DOCS_TOPICS_GATEWAY_EVENTS) documentation.

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

GUILD_MEMBERS (1 << 1) **
  - GUILD_MEMBER_ADD
  - GUILD_MEMBER_UPDATE
  - GUILD_MEMBER_REMOVE
  - THREAD_MEMBERS_UPDATE *

GUILD_MODERATION (1 << 2)
  - GUILD_AUDIT_LOG_ENTRY_CREATE
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

GUILD_PRESENCES (1 << 8) **
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

MESSAGE_CONTENT (1 << 15) ***

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

\* [Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update) contains different data depending on which intents are used.

\*\* Events under the `GUILD_PRESENCES` and `GUILD_MEMBERS` intents are turned **off by default on all API versions**. If you are using **API v6**, you will receive those events if you are authorized to receive them and have enabled the intents in the Developer Portal. You do not need to use intents on API v6 to receive these events; you just need to enable the flags. If you are using **API v8** or above, intents are mandatory and must be specified when identifying.

\*\*\* `MESSAGE_CONTENT` does not represent individual events, but rather affects what data is present for events that could contain message content fields. More information is in the [message content intent](#DOCS_TOPICS_GATEWAY/message-content-intent) section.

### Caveats

[Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update) is sent for current-user updates regardless of whether the `GUILD_MEMBERS` intent is set.

[Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) and [Request Guild Members](#DOCS_TOPICS_GATEWAY_EVENTS/request-guild-members) are uniquely affected by intents. See these sections for more information.

[Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update) by default only includes if the current user was added to or removed from a thread.  To receive these updates for other users, request the `GUILD_MEMBERS` [Gateway Intent](#DOCS_TOPICS_GATEWAY/gateway-intents).

### Privileged Intents

Some intents are defined as "privileged" due to the sensitive nature of the data. Currently, those intents include:

- `GUILD_PRESENCES`
- `GUILD_MEMBERS`
- [`MESSAGE_CONTENT`](#DOCS_TOPICS_GATEWAY/message-content-intent)

Apps that qualify for verification **must** be approved for the privileged intent(s) before they can use them. After your app is verified, you can request privileged intents within the app's settings within the Developer Portal.

Before you specify privileged intents in your `IDENTIFY` payload, you must enable the privileged intents your app requires. [Verified apps](https://support.discord.com/hc/en-us/articles/360040720412-Bot-Verification-and-Data-Whitelisting) can only use privileged intents *after* they've been approved for them.

> info
> Unverified apps can use privileged intents without approval, but still must enable them in their app's settings. If the app's verification status changes, it will then have to apply for the privileged intent(s).

In addition to the gateway restrictions described here, Discord's REST API is also affected by Privileged Intents. For example, to use the [List Guild Members](#DOCS_RESOURCES_GUILD/list-guild-members) endpoint, you must have the `GUILD_MEMBERS` intent enabled for your application. This behavior is independent of whether the intent is set during `IDENTIFY`.

#### Enabling Privileged Intents

Before using privileged intents, you must enable them in your app's settings. In the [Developer Portal](#APPLICATIONS), you can navigate to your app's settings then toggle the privileged intents on the **Bots** page under the "Privileged Gateway Intents" section. You should only toggle privileged intents that your bot *requires to function*.

If your app qualifies for [verification](https://dis.gd/bot-verification), you must first [verify your app](https://support.discord.com/hc/en-us/articles/360040720412-Bot-Verification-and-Data-Whitelisting) and request access to these intents during the verification process. If your app is already verified and you need to request additional privileged intents, you can [contact support](https://dis.gd/support).

#### Gateway Restrictions

Privileged intents affect which Gateway events your app is permitted to receive. When using **API v8** and above, all intents (privileged and not) must be specified in the `intents` parameter when Identifying. If you pass a privileged intent in the `intents` parameter without configuring it in your app's settings, or being approved for it during verification, your Gateway connection will be closed with a ([`4014` close code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes)).

> info
> For **API v6**, you will receive events associated with the privileged intents your app has configured and is authorized to receive *without* passing those intents into the `intents` parameter when Identifying.

Events associated with the `GUILD_PRESENCES` and `GUILD_MEMBERS` intents are turned off by default regardless of the API version.

#### HTTP Restrictions

In addition to Gateway restrictions, privileged intents also affect the [HTTP API](#DOCS_REFERENCE/http-api) endpoints your app is permitted to call, and the data it can receive. For example, to use the [List Guild Members](#DOCS_RESOURCES_GUILD/list-guild-members) endpoint, your app must enable the `GUILD_MEMBERS` intent (and be approved for it if eligible for verification).

HTTP API restrictions are independent of Gateway restrictions, and are unaffected by which intents your app passes in the `intents` parameter when Identifying.

#### Message Content Intent

`MESSAGE_CONTENT (1 << 15)` is a unique privileged intent that isn't directly associated with any Gateway events. Instead, access to `MESSAGE_CONTENT` permits your app to receive message content data across the APIs.

Any fields affected by the message content intent are noted in the relevant documentation. For example, the `content`, `embeds`, `attachments`, and `components` fields in [message objects](#DOCS_RESOURCES_CHANNEL/message-object) all contain message content and therefore require the intent.

> info
> Like other privileged intents, `MESSAGE_CONTENT` must be approved for your app. After your app is verified, you can apply for the intent from your app's settings within the Developer Portal. You can read more about the message content intent review policy [in the Help Center](https://support-dev.discord.com/hc/en-us/articles/5324827539479).

Apps **without** the intent will receive empty values in fields that contain user-inputted content with a few exceptions:
- Content in messages that an app sends
- Content in DMs with the app
- Content in which the app is [mentioned](#DOCS_REFERENCE/message-formatting-formats)
- Content of the message a [message context menu command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/message-commands) is used on 

## Rate Limiting

> info
> This section refers to Gateway rate limits, not [HTTP API rate limits](#DOCS_TOPICS_RATE_LIMITS)

Apps can send 120 [gateway events](#DOCS_TOPICS_GATEWAY_EVENTS) per [connection](#DOCS_TOPICS_GATEWAY/connections) every 60 seconds, meaning an average of 2 commands per second. Apps that surpass the limit are immediately disconnected from the Gateway. Similar to other rate limits, repeat offenders will have their API access revoked.

Apps also have a limit for [concurrent](#DOCS_TOPICS_GATEWAY/session-start-limit-object) [Identify](#DOCS_TOPICS_GATEWAY/identifying) requests allowed per 5 seconds. If you hit this limit, the Gateway will respond with an [Invalid Session (opcode `9`)](#DOCS_TOPICS_GATEWAY_EVENTS/invalid-session).

## Encoding and Compression

When [establishing a connection](#DOCS_TOPICS_GATEWAY/connecting) to the Gateway, apps can use the `encoding` parameter to choose whether to communicate with Discord using a plain-text JSON or binary [ETF](https://erlang.org/doc/apps/erts/erl_ext_dist.html) encoding. You can pick whichever encoding type you're more comfortable with, but both have their own quirks. If you aren't sure which encoding to use, JSON is generally recommended.

Apps can also optionally enable compression to receive zlib-compressed packets. [Payload compression](#DOCS_TOPICS_GATEWAY/payload-compression) can only be enabled when using a JSON encoding, but [transport compression](#DOCS_TOPICS_GATEWAY/transport-compression) can be used regardless of encoding type.

### Using JSON Encoding

When using the plain-text JSON encoding, apps have the option to enable [payload compression](#DOCS_TOPICS_GATEWAY/payload-compression). 

#### Payload Compression

> warn
> If an app is using payload compression, it cannot use [transport compression](#DOCS_TOPICS_GATEWAY/transport-compression).

Payload compression enables optional per-packet compression for *some* events when Discord is sending events over the connection.

Payload compression uses the zlib format (see [RFC1950 2.2](https://tools.ietf.org/html/rfc1950#section-2.2)) when sending payloads. To enable payload compression, your app can set `compress` to `true` when sending an [Identify (opcode `2`)](#DOCS_TOPICS_GATEWAY_EVENTS/identify) event. Note that even when payload compression is enabled, not all payloads will be compressed.

When payload compression is enabled, your app (or library) _must_ detect and decompress these payloads to plain-text JSON before attempting to parse them. If you are using payload compression, the gateway does not implement a shared compression context between events sent.

Payload compression will be disabled if you use [transport compression](#DOCS_TOPICS_GATEWAY/transport-compression).

### Using ETF Encoding

When using ETF (External Term Format) encoding, there are some specific behaviors you should know:

- Snowflake IDs are transmitted as 64-bit integers or strings.
- Your app can't send compressed messages to the server.
- When sending payloads, you must use string keys. Using atom keys will result in a [`4002`](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-close-event-codes) decode error.

See [erlpack](https://github.com/discord/erlpack) for an ETF implementation example.

### Transport Compression

Transport compression enables optional compression for all packets when Discord is sending events over the connection. The only currently-available transport compression option is `zlib-stream`.

When transport compression is enabled, your app needs to process received data through a single Gateway connection using a shared zlib context. However, each Gateway connection should use its own unique zlib context.

When processing transport-compressed data, you should push received data to a buffer until you receive the 4-byte `Z_SYNC_FLUSH` suffix (`00 00 ff ff`). After you receive the `Z_SYNC_FLUSH` suffix, you can then decompress the buffer.

###### Transport Compression Example

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

Most of a client's state is provided during the initial [Ready](#DOCS_TOPICS_GATEWAY/ready-event) event and in the [Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) events that follow.

As resources continue to be created, updated, and deleted, Gateway events are sent to notify the app of these changes and to provide associated data. To avoid excessive API calls, apps should cache as many relevant resource states as possible, and update them as new events are received.

> info
> For larger apps, client state can grow to be very large. Therefore, we recommend only storing data in memory that are *needed* for the app to operate. In some cases, there isn't a need to cache member information (like roles or permissions) since some events like [MESSAGE_CREATE](#DOCS_TOPICS_GATEWAY_EVENTS/message-create) have the full member object included.

An example of state tracking can be considered in the case of an app that wants to track member status: when initially connecting to the Gateway, the app will receive information about the online status of guild members (whether they're online, idle, dnd, or offline). To keep the state updated, the app will track and parse [Presence Update](#DOCS_TOPICS_GATEWAY_EVENTS/presence-update) events as they're received, then update the cached member objects accordingly.

## Guild Availability

When connecting to the gateway as a bot user, guilds that the bot is a part of will start out as unavailable. Don't fret! The gateway will automatically attempt to reconnect on your behalf. As guilds become available to you, you will receive [Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) events.

## Sharding

As apps grow and are added to an increasing number of guilds, some developers may find it necessary to divide portions of their app's operations across multiple processes. As such, the Gateway implements a method of user-controlled guild sharding which allows apps to split events across a number of Gateway connections. Guild sharding is entirely controlled by an app, and requires no state-sharing between separate connections to operate. While all apps *can* enable sharding, it's not necessary for apps in a smaller number of guilds. 

> warn
> Each shard can only support a maximum of 2500 guilds, and apps that are in 2500+ guilds *must* enable sharding. 

To enable sharding on a connection, the app should send the `shard` array in the [Identify](#DOCS_TOPICS_GATEWAY_EVENTS/identify) payload. The first item in this array should be the zero-based integer value of the current shard, while the second represents the total number of shards. DMs will only be sent to shard 0.

> info
> The [Get Gateway Bot](#DOCS_TOPICS_GATEWAY/get-gateway-bot) endpoint provides a recommended number of shards for your app in the `shards` field

To calculate which events will be sent to which shard, the following formula can be used:

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

If your bot is in more than 150,000 guilds, there are some additional considerations you must take around sharding. Discord will migrate your bot to large bot sharding when it starts to get near the large bot sharding threshold. The bot owner(s) will receive a system DM and email confirming this move has completed as well as what shard number has been assigned.

The number of shards you run must be a multiple of the shard number provided when reaching out to you. If you attempt to start your bot with an invalid number of shards, your Gateway connection will close with a `4010` Invalid Shard close code.

The [Get Gateway Bot endpoint](#DOCS_TOPICS_GATEWAY/get-gateway-bot) will always return the correct amount of shards, so if you're already using this endpoint to determine your number of shards, you shouldn't require any changes.

The session start limit for these bots will also be increased from 1000 to `max(2000, (guild_count / 1000) * 3)` per day. You also receive an increased `max_concurrency`, the number of [shards you can concurrently start](#DOCS_TOPICS_GATEWAY/session-start-limit-object).

## Get Gateway % GET /gateway

> info
> This endpoint does not require authentication.

Returns an object with a valid WSS URL which the app can use when [Connecting](#DOCS_TOPICS_GATEWAY/connecting) to the Gateway. Apps should cache this value and only call this endpoint to retrieve a new URL when they are unable to properly establish a connection using the cached one.

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

| Field               | Type                                                                          | Description                                                                          |
| ------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| url                 | string                                                                        | WSS URL that can be used for connecting to the Gateway                               |
| shards              | integer                                                                       | Recommended number of [shards](#DOCS_TOPICS_GATEWAY/sharding) to use when connecting |
| session_start_limit | [session_start_limit](#DOCS_TOPICS_GATEWAY/session-start-limit-object) object | Information on the current session start limit                                       |

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
