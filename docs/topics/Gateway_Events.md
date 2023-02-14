# Gateway Events

Gateway connections are WebSockets, meaning they're bidirectional and either side of the WebSocket can send events to the other. The following events are split up into two types:

- **Send events** are Gateway events sent by an app to Discord (like when identifying with the Gateway)
- **Receive events** are Gateway events that are sent by Discord to an app. These events typically represent something happening inside of a server where an app is installed, like a channel being updated.

All Gateway events are encapsulated in a [Gateway event payload](#DOCS_TOPICS_GATEWAY_EVENTS/payload-structure).

For more information about interacting with the Gateway, you can reference the [Gateway documentation](#DOCS_TOPICS_GATEWAY).

> warn
> Not all Gateway event fields are documented. You should assume that undocumented fields are not supported for apps, and their format and data may change at any time.

### Event Names

In practice, event names are UPPER-CASED with under_scores joining each word in the name. For instance, [Channel Create](#DOCS_TOPICS_GATEWAY_EVENTS/channel-create) would be `CHANNEL_CREATE` and [Voice State Update](#DOCS_TOPICS_GATEWAY_EVENTS/voice-state-update) would be `VOICE_STATE_UPDATE`.

For readability, event names in the following documentation are typically left in Title Case.

### Payload Structure

Gateway event payloads have a common structure, but the contents of the associated data (`d`) varies between the different events.

| Field | Type                    | Description                                                                                                                                      |
| ----- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| op    | integer                 | [Gateway opcode](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-opcodes), which indicates the payload type                                |
| d     | ?mixed (any JSON value) | Event data                                                                                                                                       |
| s     | ?integer \*             | Sequence number of event used for [resuming sessions](#DOCS_TOPICS_GATEWAY/resuming) and [heartbeating](#DOCS_TOPICS_GATEWAY/sending-heartbeats) |
| t     | ?string \*              | Event name                                                                                                                                       |

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

## Send Events

Send events are Gateway events encapsulated in an [event payload](#DOCS_TOPICS_GATEWAY_EVENTS/payload-structure), and are sent by an app to Discord through a Gateway connection.

> info
> Previously, Gateway send events were labeled as commands

| Name                                                                       | Description                                               |
| -------------------------------------------------------------------------- | --------------------------------------------------------- |
| [Identify](#DOCS_TOPICS_GATEWAY_EVENTS/identify)                           | Triggers the initial handshake with the gateway           |
| [Resume](#DOCS_TOPICS_GATEWAY_EVENTS/resume)                               | Resumes a dropped gateway connection                      |
| [Heartbeat](#DOCS_TOPICS_GATEWAY_EVENTS/heartbeat)                         | Maintains an active gateway connection                    |
| [Request Guild Members](#DOCS_TOPICS_GATEWAY_EVENTS/request-guild-members) | Requests members for a guild                              |
| [Update Voice State](#DOCS_TOPICS_GATEWAY_EVENTS/update-voice-state)       | Joins, moves, or disconnects the app from a voice channel |
| [Update Presence](#DOCS_TOPICS_GATEWAY_EVENTS/update-presence)             | Updates an app's presence                                  |

#### Identify

Used to trigger the initial handshake with the gateway.

Details about identifying is in the [Gateway documentation](#DOCS_TOPICS_GATEWAY/identifying).

###### Identify Structure

| Field            | Type                                                                  | Description                                                                                                                    | Default |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------- |
| token            | string                                                                | Authentication token                                                                                                           | -       |
| properties       | object                                                                | [Connection properties](#DOCS_TOPICS_GATEWAY_EVENTS/identify-identify-connection-properties)                                   | -       |
| compress?        | boolean                                                               | Whether this connection supports compression of packets                                                                        | false   |
| large_threshold? | integer                                                               | Value between 50 and 250, total number of members where the gateway will stop sending offline members in the guild member list | 50      |
| shard?           | array of two integers (shard_id, num_shards)                          | Used for [Guild Sharding](#DOCS_TOPICS_GATEWAY/sharding)                                                                       | -       |
| presence?        | [update presence](#DOCS_TOPICS_GATEWAY_EVENTS/update-presence) object | Presence structure for initial presence information                                                                            | -       |
| intents          | integer                                                               | [Gateway Intents](#DOCS_TOPICS_GATEWAY/gateway-intents) you wish to receive                                                    | -       |

###### Identify Connection Properties

| Field   | Type   | Description           |
| ------- | ------ | --------------------- |
| os      | string | Your operating system |
| browser | string | Your library name     |
| device  | string | Your library name     |

> warn
> These fields originally were $ prefixed (i.e: `$browser`) but [this syntax is deprecated](#DOCS_CHANGE_LOG/updated-connection-property-field-names). While they currently still work, it is recommended to move to non-prefixed fields.

###### Example Identify

```json
{
  "op": 2,
  "d": {
    "token": "my_token",
    "properties": {
      "os": "linux",
      "browser": "disco",
      "device": "disco"
    },
    "compress": true,
    "large_threshold": 250,
    "shard": [0, 1],
    "presence": {
      "activities": [{
        "name": "Cards Against Humanity",
        "type": 0
      }],
      "status": "dnd",
      "since": 91879201,
      "afk": false
    },
    // This intent represents 1 << 0 for GUILDS, 1 << 1 for GUILD_MEMBERS, and 1 << 2 for GUILD_BANS
    // This connection will only receive the events defined in those three intents
    "intents": 7
  }
}
```

#### Resume

Used to replay missed events when a disconnected client resumes.

Details about resuming are in the [Gateway documentation](#DOCS_TOPICS_GATEWAY/resuming).

###### Resume Structure

| Field      | Type    | Description                   |
| ---------- | ------- | ----------------------------- |
| token      | string  | Session token                 |
| session_id | string  | Session ID                    |
| seq        | integer | Last sequence number received |

###### Example Resume

```json
{
  "op": 6,
  "d": {
    "token": "randomstring",
    "session_id": "evenmorerandomstring",
    "seq": 1337
  }
}
```

#### Heartbeat

Used to maintain an active gateway connection. Must be sent every `heartbeat_interval` milliseconds after the [Opcode 10 Hello](#DOCS_TOPICS_GATEWAY_EVENTS/hello) payload is received. The inner `d` key is the last sequence number—`s`—received by the client. If you have not yet received one, send `null`.

Details about heartbeats are in the [Gateway documentation](#DOCS_TOPICS_GATEWAY/sending-heartbeats).

###### Example Heartbeat

```
{
	"op": 1,
	"d": 251
}
```

#### Request Guild Members

Used to request all members for a guild or a list of guilds. When initially connecting, if you don't have the `GUILD_PRESENCES` [Gateway Intent](#DOCS_TOPICS_GATEWAY/gateway-intents), or if the guild is over 75k members, it will only send members who are in voice, plus the member for you (the connecting user). Otherwise, if a guild has over `large_threshold` members (value in the [Gateway Identify](#DOCS_TOPICS_GATEWAY_EVENTS/identify)), it will only send members who are online, have a role, have a nickname, or are in a voice channel, and if it has under `large_threshold` members, it will send all members. If a client wishes to receive additional members, they need to explicitly request them via this operation. The server will send [Guild Members Chunk](#DOCS_TOPICS_GATEWAY_EVENTS/guild-members-chunk) events in response with up to 1000 members per chunk until all members that match the request have been sent.

Due to our privacy and infrastructural concerns with this feature, there are some limitations that apply:

- `GUILD_PRESENCES` intent is required to set `presences = true`. Otherwise, it will always be false
- `GUILD_MEMBERS` intent is required to request the entire member list—`(query=‘’, limit=0<=n)`
- You will be limited to requesting 1 `guild_id` per request
- Requesting a prefix (`query` parameter) will return a maximum of 100 members
- Requesting `user_ids` will continue to be limited to returning 100 members

###### Guild Request Members Structure

| Field      | Type                             | Description                                                                                                                           | Required                   |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| guild_id   | snowflake                        | ID of the guild to get members for                                                                                                    | true                       |
| query?     | string                           | string that username starts with, or an empty string to return all members                                                            | one of query or user_ids   |
| limit      | integer                          | maximum number of members to send matching the `query`; a limit of `0` can be used with an empty string `query` to return all members | true when specifying query |
| presences? | boolean                          | used to specify if we want the presences of the matched members                                                                       | false                      |
| user_ids?  | snowflake or array of snowflakes | used to specify which users you wish to fetch                                                                                         | one of query or user_ids   |
| nonce?     | string                           | nonce to identify the [Guild Members Chunk](#DOCS_TOPICS_GATEWAY_EVENTS/guild-members-chunk) response                                 | false                      |

> info
> Nonce can only be up to 32 bytes. If you send an invalid nonce it will be ignored and the reply member_chunk(s) will not have a nonce set.

###### Guild Request Members

```json
{
  "op": 8,
  "d": {
    "guild_id": "41771983444115456",
    "query": "",
    "limit": 0
  }
}
```

#### Update Voice State

Sent when a client wants to join, move, or disconnect from a voice channel.

###### Gateway Voice State Update Structure

| Field      | Type       | Description                                                          |
| ---------- | ---------- | -------------------------------------------------------------------- |
| guild_id   | snowflake  | ID of the guild                                                      |
| channel_id | ?snowflake | ID of the voice channel client wants to join (null if disconnecting) |
| self_mute  | boolean    | Whether the client is muted                                          |
| self_deaf  | boolean    | Whether the client deafened                                          |

###### Example Gateway Voice State Update

```json
{
  "op": 4,
  "d": {
    "guild_id": "41771983423143937",
    "channel_id": "127121515262115840",
    "self_mute": false,
    "self_deaf": false
  }
}
```

#### Update Presence

Sent by the client to indicate a presence or status update.

###### Gateway Presence Update Structure

| Field      | Type                                                                     | Description                                                                                 |
| ---------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| since      | ?integer                                                                 | Unix time (in milliseconds) of when the client went idle, or null if the client is not idle |
| activities | array of [activity](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object) objects | User's activities                                                                           |
| status     | string                                                                   | User's new [status](#DOCS_TOPICS_GATEWAY_EVENTS/update-presence-status-types)               |
| afk        | boolean                                                                  | Whether or not the client is afk                                                            |

###### Status Types

| Status    | Description                    |
| --------- | ------------------------------ |
| online    | Online                         |
| dnd       | Do Not Disturb                 |
| idle      | AFK                            |
| invisible | Invisible and shown as offline |
| offline   | Offline                        |

###### Example Gateway Presence Update

```json
{
  "op": 3,
  "d": {
    "since": 91879201,
    "activities": [{
      "name": "Save the Oxford Comma",
      "type": 0
    }],
    "status": "online",
    "afk": false
  }
}
```

## Receive Events

Receive events are Gateway events encapsulated in an [event payload](#DOCS_TOPICS_GATEWAY_EVENTS/payload-structure), and are sent by Discord to an app through a Gateway connection. Receive events correspond to events that happen in a Discord server where the app is installed.

| Name                                                                                                         | Description                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [Hello](#DOCS_TOPICS_GATEWAY_EVENTS/hello)                                                                   | Defines the heartbeat interval                                                                                                                 |
| [Ready](#DOCS_TOPICS_GATEWAY_EVENTS/ready)                                                                   | Contains the initial state information                                                                                                         |
| [Resumed](#DOCS_TOPICS_GATEWAY_EVENTS/resumed)                                                               | Response to [Resume](#DOCS_TOPICS_GATEWAY_EVENTS/resume)                                                                                       |
| [Reconnect](#DOCS_TOPICS_GATEWAY_EVENTS/reconnect)                                                           | Server is going away, client should reconnect to gateway and resume                                                                            |
| [Invalid Session](#DOCS_TOPICS_GATEWAY_EVENTS/invalid-session)                                               | Failure response to [Identify](#DOCS_TOPICS_GATEWAY_EVENTS/identify) or [Resume](#DOCS_TOPICS_GATEWAY_EVENTS/resume) or invalid active session |
| [Application Command Permissions Update](#DOCS_TOPICS_GATEWAY_EVENTS/application-command-permissions-update) | Application command permission was updated                                                                                                     |
| [Auto Moderation Rule Create](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-rule-create)                       | Auto Moderation rule was created                                                                                                               |
| [Auto Moderation Rule Update](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-rule-update)                       | Auto Moderation rule was updated                                                                                                               |
| [Auto Moderation Rule Delete](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-rule-delete)                       | Auto Moderation rule was deleted                                                                                                               |
| [Auto Moderation Action Execution](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-action-execution)             | Auto Moderation rule was triggered and an action was executed (e.g. a message was blocked)                                                     |
| [Channel Create](#DOCS_TOPICS_GATEWAY_EVENTS/channel-create)                                                 | New guild channel created                                                                                                                      |
| [Channel Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-update)                                                 | Channel was updated                                                                                                                            |
| [Channel Delete](#DOCS_TOPICS_GATEWAY_EVENTS/channel-delete)                                                 | Channel was deleted                                                                                                                            |
| [Channel Pins Update](#DOCS_TOPICS_GATEWAY_EVENTS/channel-pins-update)                                       | Message was pinned or unpinned                                                                                                                 |
| [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create)                                                   | Thread created, also sent when being added to a private thread                                                                                 |
| [Thread Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-update)                                                   | Thread was updated                                                                                                                             |
| [Thread Delete](#DOCS_TOPICS_GATEWAY_EVENTS/thread-delete)                                                   | Thread was deleted                                                                                                                             |
| [Thread List Sync](#DOCS_TOPICS_GATEWAY_EVENTS/thread-list-sync)                                             | Sent when gaining access to a channel, contains all active threads in that channel                                                             |
| [Thread Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-member-update)                                     | [Thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) for the current user was updated                                                 |
| [Thread Members Update](#DOCS_TOPICS_GATEWAY_EVENTS/thread-members-update)                                   | Some user(s) were added to or removed from a thread                                                                                            |
| [Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create)                                                     | Lazy-load for unavailable guild, guild became available, or user joined a new guild                                                            |
| [Guild Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-update)                                                     | Guild was updated                                                                                                                              |
| [Guild Delete](#DOCS_TOPICS_GATEWAY_EVENTS/guild-delete)                                                     | Guild became unavailable, or user left/was removed from a guild                                                                                |
| [Guild Audit Log Entry Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-audit-log-entry-create)                     | A guild audit log entry was created                                                                                                             |
| [Guild Ban Add](#DOCS_TOPICS_GATEWAY_EVENTS/guild-ban-add)                                                   | User was banned from a guild                                                                                                                   |
| [Guild Ban Remove](#DOCS_TOPICS_GATEWAY_EVENTS/guild-ban-remove)                                             | User was unbanned from a guild                                                                                                                 |
| [Guild Emojis Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-emojis-update)                                       | Guild emojis were updated                                                                                                                      |
| [Guild Stickers Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-stickers-update)                                   | Guild stickers were updated                                                                                                                    |
| [Guild Integrations Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-integrations-update)                           | Guild integration was updated                                                                                                                  |
| [Guild Member Add](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-add)                                             | New user joined a guild                                                                                                                        |
| [Guild Member Remove](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-remove)                                       | User was removed from a guild                                                                                                                  |
| [Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update)                                       | Guild member was updated                                                                                                                       |
| [Guild Members Chunk](#DOCS_TOPICS_GATEWAY_EVENTS/guild-members-chunk)                                       | Response to [Request Guild Members](#DOCS_TOPICS_GATEWAY_EVENTS/request-guild-members)                                                         |
| [Guild Role Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-role-create)                                           | Guild role was created                                                                                                                         |
| [Guild Role Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-role-update)                                           | Guild role was updated                                                                                                                         |
| [Guild Role Delete](#DOCS_TOPICS_GATEWAY_EVENTS/guild-role-delete)                                           | Guild role was deleted                                                                                                                         |
| [Guild Scheduled Event Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-scheduled-event-create)                     | Guild scheduled event was created                                                                                                              |
| [Guild Scheduled Event Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-scheduled-event-update)                     | Guild scheduled event was updated                                                                                                              |
| [Guild Scheduled Event Delete](#DOCS_TOPICS_GATEWAY_EVENTS/guild-scheduled-event-delete)                     | Guild scheduled event was deleted                                                                                                              |
| [Guild Scheduled Event User Add](#DOCS_TOPICS_GATEWAY_EVENTS/guild-scheduled-event-user-add)                 | User subscribed to a guild scheduled event                                                                                                     |
| [Guild Scheduled Event User Remove](#DOCS_TOPICS_GATEWAY_EVENTS/guild-scheduled-event-user-remove)           | User unsubscribed from a guild scheduled event                                                                                                 |
| [Integration Create](#DOCS_TOPICS_GATEWAY_EVENTS/integration-create)                                         | Guild integration was created                                                                                                                  |
| [Integration Update](#DOCS_TOPICS_GATEWAY_EVENTS/integration-update)                                         | Guild integration was updated                                                                                                                  |
| [Integration Delete](#DOCS_TOPICS_GATEWAY_EVENTS/integration-delete)                                         | Guild integration was deleted                                                                                                                  |
| [Interaction Create](#DOCS_TOPICS_GATEWAY_EVENTS/interaction-create)                                         | User used an interaction, such as an [Application Command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/)                                           |
| [Invite Create](#DOCS_TOPICS_GATEWAY_EVENTS/invite-create)                                                   | Invite to a channel was created                                                                                                                |
| [Invite Delete](#DOCS_TOPICS_GATEWAY_EVENTS/invite-delete)                                                   | Invite to a channel was deleted                                                                                                                |
| [Message Create](#DOCS_TOPICS_GATEWAY_EVENTS/message-create)                                                 | Message was created                                                                                                                            |
| [Message Update](#DOCS_TOPICS_GATEWAY_EVENTS/message-update)                                                 | Message was edited                                                                                                                             |
| [Message Delete](#DOCS_TOPICS_GATEWAY_EVENTS/message-delete)                                                 | Message was deleted                                                                                                                            |
| [Message Delete Bulk](#DOCS_TOPICS_GATEWAY_EVENTS/message-delete-bulk)                                       | Multiple messages were deleted at once                                                                                                         |
| [Message Reaction Add](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-add)                                     | User reacted to a message                                                                                                                      |
| [Message Reaction Remove](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove)                               | User removed a reaction from a message                                                                                                         |
| [Message Reaction Remove All](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove-all)                       | All reactions were explicitly removed from a message                                                                                           |
| [Message Reaction Remove Emoji](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove-emoji)                   | All reactions for a given emoji were explicitly removed from a message                                                                         |
| [Presence Update](#DOCS_TOPICS_GATEWAY_EVENTS/presence-update)                                               | User was updated                                                                                                                               |
| [Stage Instance Create](#DOCS_TOPICS_GATEWAY_EVENTS/stage-instance-create)                                   | Stage instance was created                                                                                                                     |
| [Stage Instance Update](#DOCS_TOPICS_GATEWAY_EVENTS/stage-instance-update)                                   | Stage instance was updated                                                                                                                     |
| [Stage Instance Delete](#DOCS_TOPICS_GATEWAY_EVENTS/stage-instance-delete)                                   | Stage instance was deleted or closed                                                                                                           |
| [Typing Start](#DOCS_TOPICS_GATEWAY_EVENTS/typing-start)                                                     | User started typing in a channel                                                                                                               |
| [User Update](#DOCS_TOPICS_GATEWAY_EVENTS/user-update)                                                       | Properties about the user changed                                                                                                              |
| [Voice State Update](#DOCS_TOPICS_GATEWAY_EVENTS/voice-state-update)                                         | Someone joined, left, or moved a voice channel                                                                                                 |
| [Voice Server Update](#DOCS_TOPICS_GATEWAY_EVENTS/voice-server-update)                                       | Guild's voice server was updated                                                                                                               |
| [Webhooks Update](#DOCS_TOPICS_GATEWAY_EVENTS/webhooks-update)                                               | Guild channel webhook was created, update, or deleted                                                                                          |

#### Hello

Sent on connection to the websocket. Defines the heartbeat interval that an app should heartbeat to.

###### Hello Structure

| Field              | Type    | Description                                             |
| ------------------ | ------- | ------------------------------------------------------- |
| heartbeat_interval | integer | Interval (in milliseconds) an app should heartbeat with |

###### Example Hello

```json
{
  "op": 10,
  "d": {
    "heartbeat_interval": 45000
  }
}
```

#### Ready

The ready event is dispatched when a client has completed the initial handshake with the gateway (for new sessions). The ready event can be the largest and most complex event the gateway will send, as it contains all the state required for a client to begin interacting with the rest of the platform.

`guilds` are the guilds of which your bot is a member. They start out as unavailable when you connect to the gateway. As they become available, your bot will be notified via [Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create) events.

###### Ready Event Fields

| Field              | Type                                                                                 | Description                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| v                  | integer                                                                              | [API version](#DOCS_REFERENCE/api-versioning-api-versions)                                                |
| user               | [user](#DOCS_RESOURCES_USER/user-object) object                                      | Information about the user including email                                                                |
| guilds             | array of [Unavailable Guild](#DOCS_RESOURCES_GUILD/unavailable-guild-object) objects | Guilds the user is in                                                                                     |
| session_id         | string                                                                               | Used for resuming connections                                                                             |
| resume_gateway_url | string                                                                               | Gateway URL for resuming connections                                                                      |
| shard?             | array of two integers (shard_id, num_shards)                                         | [Shard information](#DOCS_TOPICS_GATEWAY/sharding) associated with this session, if sent when identifying |
| application        | partial [application object](#DOCS_RESOURCES_APPLICATION/application-object)         | Contains `id` and `flags`                                                                                 |

#### Resumed

The resumed event is dispatched when a client has sent a [resume payload](#DOCS_TOPICS_GATEWAY_EVENTS/resume) to the gateway (for resuming existing sessions).

#### Reconnect

The reconnect event is dispatched when a client should reconnect to the gateway (and resume their existing session, if they have one). This event usually occurs during deploys to migrate sessions gracefully off old hosts.

###### Example Gateway Reconnect

```json
{
  "op": 7,
  "d": null
}
```

#### Invalid Session

Sent to indicate one of at least three different situations:

- the gateway could not initialize a session after receiving an [Opcode 2 Identify](#DOCS_TOPICS_GATEWAY_EVENTS/identify)
- the gateway could not resume a previous session after receiving an [Opcode 6 Resume](#DOCS_TOPICS_GATEWAY_EVENTS/resume)
- the gateway has invalidated an active session and is requesting client action

The inner `d` key is a boolean that indicates whether the session may be resumable. See [Connecting](#DOCS_TOPICS_GATEWAY/connecting) and [Resuming](#DOCS_TOPICS_GATEWAY/resuming) for more information.

###### Example Gateway Invalid Session

```json
{
  "op": 9,
  "d": false
}
```

### Application Commands

#### Application Command Permissions Update

`APPLICATION_COMMAND_PERMISSIONS_UPDATE` event, sent when an application command's permissions are updated. The inner payload is an [application command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-guild-application-command-permissions-structure) object.

### Auto Moderation

All [Auto Moderation](#DOCS_RESOURCES_AUTO_MODERATION) related events are only sent to bot users which have the `MANAGE_GUILD` permission.

#### Auto Moderation Rule Create

Sent when a rule is created. The inner payload is an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) object.

#### Auto Moderation Rule Update

Sent when a rule is updated. The inner payload is an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) object.

#### Auto Moderation Rule Delete

Sent when a rule is deleted. The inner payload is an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) object.

#### Auto Moderation Action Execution

Sent when a rule is triggered and an action is executed (e.g. when a message is blocked).

###### Auto Moderation Action Execution Event Fields

| Field                    | Type                                                                                           | Description                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| guild_id                 | snowflake                                                                                      | ID of the guild in which action was executed                                   |
| action                   | [auto moderation action](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) object | Action which was executed                                                      |
| rule_id                  | snowflake                                                                                      | ID of the rule which action belongs to                                         |
| rule_trigger_type        | [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)      | Trigger type of rule which was triggered                                       |
| user_id                  | snowflake                                                                                      | ID of the user which generated the content which triggered the rule            |
| channel_id?              | snowflake                                                                                      | ID of the channel in which user content was posted                             |
| message_id?              | snowflake                                                                                      | ID of any user message which content belongs to *                              |
| alert_system_message_id? | snowflake                                                                                      | ID of any system auto moderation messages posted as a result of this action ** |
| content ***              | string                                                                                         | User-generated text content                                                    |
| matched_keyword          | ?string                                                                                        | Word or phrase configured in the rule that triggered the rule                  |
| matched_content ***      | ?string                                                                                        | Substring in content that triggered the rule                                   |


\* `message_id` will not exist if message was blocked by [Auto Moderation](#DOCS_RESOURCES_AUTO_MODERATION) or content was not part of any message

\*\* `alert_system_message_id` will not exist if this event does not correspond to an action with type `SEND_ALERT_MESSAGE`

\*\*\* `MESSAGE_CONTENT` (`1 << 15`) [gateway intent](#DOCS_TOPICS_GATEWAY/gateway-intents) is required to receive the `content` and `matched_content` fields

### Channels

#### Channel Create

Sent when a new guild channel is created, relevant to the current user. The inner payload is a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.

#### Channel Update

Sent when a channel is updated. The inner payload is a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object. This is not sent when the field `last_message_id` is altered. To keep track of the last_message_id changes, you must listen for [Message Create](#DOCS_TOPICS_GATEWAY_EVENTS/message-create) events (or [Thread Create](#DOCS_TOPICS_GATEWAY_EVENTS/thread-create) events for `GUILD_FORUM` channels).

This event may reference roles or guild members that no longer exist in the guild.

#### Channel Delete

Sent when a channel relevant to the current user is deleted. The inner payload is a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.

#### Thread Create

Sent when a thread is created, relevant to the current user, or when the current user is added to a thread. The inner payload is a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.
- When a thread is created, includes an additional `newly_created` boolean field.
- When being added to an existing private thread, includes a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object.

#### Thread Update

Sent when a thread is updated. The inner payload is a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object. This is not sent when the field `last_message_id` is altered. To keep track of the last_message_id changes, you must listen for [Message Create](#DOCS_TOPICS_GATEWAY_EVENTS/message-create) events.

#### Thread Delete

Sent when a thread relevant to the current user is deleted. The inner payload is a subset of the [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object, containing just the `id`, `guild_id`, `parent_id`, and `type` fields.

#### Thread List Sync

Sent when the current user _gains_ access to a channel.

###### Thread List Sync Event Fields

| Field        | Type                                                                           | Description                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| guild_id     | snowflake                                                                      | ID of the guild                                                                                                                                                                                                         |
| channel_ids? | array of snowflakes                                                            | Parent channel IDs whose threads are being synced.  If omitted, then threads were synced for the entire guild.  This array may contain channel_ids that have no active threads as well, so you know to clear that data. |
| threads      | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects             | All active threads in the given channels that the current user can access                                                                                                                                               |
| members      | array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | All thread member objects from the synced threads for the current user, indicating which threads the current user has been added to                                                                                     |

#### Thread Member Update

Sent when the [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object for the current user is updated. The inner payload is a [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object with an extra `guild_id` field. This event is documented for completeness, but unlikely to be used by most bots. For bots, this event largely is just a signal that you are a member of the thread. See the [threads docs](#DOCS_TOPICS_THREADS) for more details.

###### Thread Member Update Event Extra Fields

| Field    | Type      | Description     |
| -------- | --------- | --------------- |
| guild_id | snowflake | ID of the guild |


#### Thread Members Update

Sent when anyone is added to or removed from a thread.  If the current user does not have the `GUILD_MEMBERS` [Gateway Intent](#DOCS_TOPICS_GATEWAY/gateway-intents), then this event will only be sent if the current user was added to or removed from the thread.

###### Thread Members Update Event Fields

| Field               | Type                                                                           | Description                                               |
| ------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| id                  | snowflake                                                                      | ID of the thread                                          |
| guild_id            | snowflake                                                                      | ID of the guild                                           |
| member_count        | integer                                                                        | Approximate number of members in the thread, capped at 50 |
| added_members?\*    | array of [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) objects | Users who were added to the thread                        |
| removed_member_ids? | array of snowflakes                                                            | ID of the users who were removed from the thread          |

\* In this gateway event, the thread member objects will also include the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) and nullable [presence](#DOCS_TOPICS_GATEWAY_EVENTS/presence) objects for each added thread member.

#### Channel Pins Update

Sent when a message is pinned or unpinned in a text channel. This is not sent when a pinned message is deleted.

###### Channel Pins Update Event Fields

| Field               | Type               | Description                                             |
| ------------------- | ------------------ | ------------------------------------------------------- |
| guild_id?           | snowflake          | ID of the guild                                         |
| channel_id          | snowflake          | ID of the channel                                       |
| last_pin_timestamp? | ?ISO8601 timestamp | Time at which the most recent pinned message was pinned |

### Guilds

#### Guild Create

This event can be sent in three different scenarios:

1.  When a user is initially connecting, to lazily load and backfill information for all unavailable guilds sent in the [Ready](#DOCS_TOPICS_GATEWAY_EVENTS/ready) event. Guilds that are unavailable due to an outage will send a [Guild Delete](#DOCS_TOPICS_GATEWAY_EVENTS/guild-delete) event.
2.  When a Guild becomes available again to the client.
3.  When the current user joins a new Guild.

> note
> During an outage, the guild object in scenarios 1 and 3 may be marked as unavailable.

The inner payload can be:
- An available Guild: a [guild](#DOCS_RESOURCES_GUILD/guild-object) object with extra fields, as noted below.
- An unavailable Guild: an [unavailable guild](#DOCS_RESOURCES_GUILD/unavailable-guild-object) object.

###### Guild Create Extra Fields

| Field                  | Type                                                                                                         | Description                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| joined_at              | ISO8601 timestamp                                                                                            | When this guild was joined at                                                                                              |
| large                  | boolean                                                                                                      | `true` if this is considered a large guild                                                                                 |
| unavailable?           | boolean                                                                                                      | `true` if this guild is unavailable due to an outage                                                                       |
| member_count           | integer                                                                                                      | Total number of members in this guild                                                                                      |
| voice_states           | array of partial [voice state](#DOCS_RESOURCES_VOICE/voice-state-object) objects                             | States of members currently in voice channels; lacks the `guild_id` key                                                    |
| members                | array of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects                                   | Users in the guild                                                                                                         |
| channels               | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects                                           | Channels in the guild                                                                                                      |
| threads                | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects                                           | All active threads in the guild that current user has permission to view                                                   |
| presences              | array of partial [presence update](#DOCS_TOPICS_GATEWAY_EVENTS/presence-update) objects                      | Presences of the members in the guild, will only include non-offline members if the size is greater than `large threshold` |
| stage_instances        | array of [stage instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object) objects                      | Stage instances in the guild                                                                                               |
| guild_scheduled_events | array of [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) objects | Scheduled events in the guild                                                                                              |

> warn
> If your bot does not have the `GUILD_PRESENCES` [Gateway Intent](#DOCS_TOPICS_GATEWAY/gateway-intents), or if the guild has over 75k members, members and presences returned in this event will only contain your bot and users in voice channels.

#### Guild Update

Sent when a guild is updated. The inner payload is a [guild](#DOCS_RESOURCES_GUILD/guild-object) object.

#### Guild Delete

Sent when a guild becomes or was already unavailable due to an outage, or when the user leaves or is removed from a guild. The inner payload is an [unavailable guild](#DOCS_RESOURCES_GUILD/unavailable-guild-object) object. If the `unavailable` field is not set, the user was removed from the guild.

#### Guild Audit Log Entry Create

Sent when a guild audit log entry is created. The inner payload is an [Audit Log Entry](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object) object. This event is only sent to bots with the `VIEW_AUDIT_LOG` permission.

#### Guild Ban Add

Sent when a user is banned from a guild.

###### Guild Ban Add Event Fields

| Field    | Type                                              | Description         |
| -------- | ------------------------------------------------- | ------------------- |
| guild_id | snowflake                                         | ID of the guild     |
| user     | a [user](#DOCS_RESOURCES_USER/user-object) object | User who was banned |

#### Guild Ban Remove

Sent when a user is unbanned from a guild.

###### Guild Ban Remove Event Fields

| Field    | Type                                              | Description           |
| -------- | ------------------------------------------------- | --------------------- |
| guild_id | snowflake                                         | ID of the guild       |
| user     | a [user](#DOCS_RESOURCES_USER/user-object) object | User who was unbanned |

#### Guild Emojis Update

Sent when a guild's emojis have been updated.

###### Guild Emojis Update Event Fields

| Field    | Type      | Description                                           |
| -------- | --------- | ----------------------------------------------------- |
| guild_id | snowflake | ID of the guild                                       |
| emojis   | array     | Array of [emojis](#DOCS_RESOURCES_EMOJI/emoji-object) |

#### Guild Stickers Update

Sent when a guild's stickers have been updated.

###### Guild Stickers Update Event Fields

| Field    | Type      | Description                                                 |
| -------- | --------- | ----------------------------------------------------------- |
| guild_id | snowflake | ID of the guild                                             |
| stickers | array     | Array of [stickers](#DOCS_RESOURCES_STICKER/sticker-object) |

#### Guild Integrations Update

Sent when a guild integration is updated.

###### Guild Integrations Update Event Fields

| Field    | Type      | Description                                     |
| -------- | --------- | ----------------------------------------------- |
| guild_id | snowflake | ID of the guild whose integrations were updated |

#### Guild Member Add

> warn
> If using [Gateway Intents](#DOCS_TOPICS_GATEWAY/gateway-intents), the `GUILD_MEMBERS` intent will be required to receive this event.

Sent when a new user joins a guild. The inner payload is a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object with an extra `guild_id` key:

###### Guild Member Add Extra Fields

| Field    | Type      | Description     |
| -------- | --------- | --------------- |
| guild_id | snowflake | ID of the guild |

#### Guild Member Remove

> warn
> If using [Gateway Intents](#DOCS_TOPICS_GATEWAY/gateway-intents), the `GUILD_MEMBERS` intent will be required to receive this event.

Sent when a user is removed from a guild (leave/kick/ban).

###### Guild Member Remove Event Fields

| Field    | Type                                              | Description          |
| -------- | ------------------------------------------------- | -------------------- |
| guild_id | snowflake                                         | ID of the guild      |
| user     | a [user](#DOCS_RESOURCES_USER/user-object) object | User who was removed |

#### Guild Member Update

> warn
> If using [Gateway Intents](#DOCS_TOPICS_GATEWAY/gateway-intents), the `GUILD_MEMBERS` intent will be required to receive this event.

Sent when a guild member is updated. This will also fire when the user object of a guild member changes.

###### Guild Member Update Event Fields

| Field                         | Type                                              | Description                                                                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| guild_id                      | snowflake                                         | ID of the guild                                                                                                                                                                                                                      |
| roles                         | array of snowflakes                               | User role ids                                                                                                                                                                                                                        |
| user                          | a [user](#DOCS_RESOURCES_USER/user-object) object | User                                                                                                                                                                                                                                 |
| nick?                         | ?string                                           | Nickname of the user in the guild                                                                                                                                                                                                    |
| avatar                        | ?string                                           | Member's [guild avatar hash](#DOCS_REFERENCE/image-formatting)                                                                                                                                                                       |
| joined_at                     | ?ISO8601 timestamp                                | When the user joined the guild                                                                                                                                                                                                       |
| premium_since?                | ?ISO8601 timestamp                                | When the user starting [boosting](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-) the guild                                                                                                             |
| deaf?                         | boolean                                           | Whether the user is deafened in voice channels                                                                                                                                                                                       |
| mute?                         | boolean                                           | Whether the user is muted in voice channels                                                                                                                                                                                          |
| pending?                      | boolean                                           | Whether the user has not yet passed the guild's [Membership Screening](#DOCS_RESOURCES_GUILD/membership-screening-object) requirements                                                                                               |
| communication_disabled_until? | ?ISO8601 timestamp                                | When the user's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire and the user will be able to communicate in the guild again, null or a time in the past if the user is not timed out |

#### Guild Members Chunk

Sent in response to [Guild Request Members](#DOCS_TOPICS_GATEWAY_EVENTS/request-guild-members).
You can use the `chunk_index` and `chunk_count` to calculate how many chunks are left for your request.

###### Guild Members Chunk Event Fields

| Field       | Type                                                                       | Description                                                                                    |
| ----------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| guild_id    | snowflake                                                                  | ID of the guild                                                                                |
| members     | array of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects | Set of guild members                                                                           |
| chunk_index | integer                                                                    | Chunk index in the expected chunks for this response (0 <= chunk\_index < chunk\_count)        |
| chunk_count | integer                                                                    | Total number of expected chunks for this response                                              |
| not_found?  | array                                                                      | When passing an invalid ID to `REQUEST_GUILD_MEMBERS`, it will be returned here                |
| presences?  | array of [presence](#DOCS_TOPICS_GATEWAY_EVENTS/presence) objects          | When passing `true` to `REQUEST_GUILD_MEMBERS`, presences of the returned members will be here |
| nonce?      | string                                                                     | Nonce used in the [Guild Members Request](#DOCS_TOPICS_GATEWAY_EVENTS/request-guild-members)   |

#### Guild Role Create

Sent when a guild role is created.

###### Guild Role Create Event Fields

| Field    | Type                                                  | Description           |
| -------- | ----------------------------------------------------- | --------------------- |
| guild_id | snowflake                                             | ID of the guild       |
| role     | a [role](#DOCS_TOPICS_PERMISSIONS/role-object) object | Role that was created |

#### Guild Role Update

Sent when a guild role is updated.

###### Guild Role Update Event Fields

| Field    | Type                                                  | Description           |
| -------- | ----------------------------------------------------- | --------------------- |
| guild_id | snowflake                                             | ID of the guild       |
| role     | a [role](#DOCS_TOPICS_PERMISSIONS/role-object) object | Role that was updated |

#### Guild Role Delete

Sent when a guild role is deleted.

###### Guild Role Delete Event Fields

| Field    | Type      | Description     |
| -------- | --------- | --------------- |
| guild_id | snowflake | ID of the guild |
| role_id  | snowflake | ID of the role  |

### Guild Scheduled Event Create

Sent when a guild scheduled event is created. The inner payload is a [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object.

### Guild Scheduled Event Update

Sent when a guild scheduled event is updated. The inner payload is a [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object.

### Guild Scheduled Event Delete

Sent when a guild scheduled event is deleted. The inner payload is a [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object.

### Guild Scheduled Event User Add

Sent when a user has subscribed to a guild scheduled event.

###### Guild Scheduled Event User Add Event Fields

| Field                    | Type      | Description                     |
| ------------------------ | --------- | ------------------------------- |
| guild_scheduled_event_id | snowflake | ID of the guild scheduled event |
| user_id                  | snowflake | ID of the user                  |
| guild_id                 | snowflake | ID of the guild                 |

### Guild Scheduled Event User Remove

Sent when a user has unsubscribed from a guild scheduled event.

###### Guild Scheduled Event User Remove Event Fields

| Field                    | Type      | Description                     |
| ------------------------ | --------- | ------------------------------- |
| guild_scheduled_event_id | snowflake | ID of the guild scheduled event |
| user_id                  | snowflake | ID of the user                  |
| guild_id                 | snowflake | ID of the guild                 |

### Integrations

#### Integration Create

Sent when an integration is created. The inner payload is an [integration](#DOCS_RESOURCES_GUILD/integration-object) object with an additional `guild_id` key:

###### Integration Create Event Additional Fields

| Field    | Type      | Description     |
| -------- | --------- | --------------- |
| guild_id | snowflake | ID of the guild |

#### Integration Update

Sent when an integration is updated. The inner payload is an [integration](#DOCS_RESOURCES_GUILD/integration-object) object with an additional `guild_id` key:

###### Integration Update Event Additional Fields

| Field    | Type      | Description     |
| -------- | --------- | --------------- |
| guild_id | snowflake | ID of the guild |

#### Integration Delete

Sent when an integration is deleted.

###### Integration Delete Event Fields

| Field           | Type      | Description                                                   |
| --------------- | --------- | ------------------------------------------------------------- |
| id              | snowflake | Integration ID                                                |
| guild_id        | snowflake | ID of the guild                                               |
| application_id? | snowflake | ID of the bot/OAuth2 application for this discord integration |

### Invites

#### Invite Create

Sent when a new invite to a channel is created.

###### Invite Create Event Fields

| Field               | Type                                                                         | Description                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| channel_id          | snowflake                                                                    | Channel the invite is for                                                                                          |
| code                | string                                                                       | Unique invite [code](#DOCS_RESOURCES_INVITE/invite-object)                                                         |
| created_at          | ISO8601 timestamp                                                            | Time at which the invite was created                                                                               |
| guild_id?           | snowflake                                                                    | Guild of the invite                                                                                                |
| inviter?            | [user](#DOCS_RESOURCES_USER/user-object) object                              | User that created the invite                                                                                       |
| max_age             | integer                                                                      | How long the invite is valid for (in seconds)                                                                      |
| max_uses            | integer                                                                      | Maximum number of times the invite can be used                                                                     |
| target_type?        | integer                                                                      | [Type of target](#DOCS_RESOURCES_INVITE/invite-object-invite-target-types) for this voice channel invite           |
| target_user?        | [user](#DOCS_RESOURCES_USER/user-object) object                              | User whose stream to display for this voice channel stream invite                                                  |
| target_application? | partial [application](#DOCS_RESOURCES_APPLICATION/application-object) object | Embedded application to open for this voice channel embedded application invite                                    |
| temporary           | boolean                                                                      | Whether or not the invite is temporary (invited users will be kicked on disconnect unless they're assigned a role) |
| uses                | integer                                                                      | How many times the invite has been used (always will be 0)                                                         |

#### Invite Delete

Sent when an invite is deleted.

###### Invite Delete Event Fields

| Field      | Type      | Description                                                |
| ---------- | --------- | ---------------------------------------------------------- |
| channel_id | snowflake | Channel of the invite                                      |
| guild_id?  | snowflake | Guild of the invite                                        |
| code       | string    | Unique invite [code](#DOCS_RESOURCES_INVITE/invite-object) |

### Messages

> warn
> Unlike persistent messages, ephemeral messages are sent directly to the user and the bot who sent the message rather than through the guild channel. Because of this, ephemeral messages are tied to the [`DIRECT_MESSAGES` intent](#DOCS_TOPICS_GATEWAY/list-of-intents), and the message object won't include `guild_id` or `member`.

#### Message Create

Sent when a message is created. The inner payload is a [message](#DOCS_RESOURCES_CHANNEL/message-object) object with the following extra fields:

###### Message Create Extra Fields

| Field     | Type                                                                                                                                            | Description                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| guild_id? | snowflake                                                                                                                                       | ID of the guild the message was sent in - unless it is an ephemeral message                            |
| member?   | partial [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object                                                                        | Member properties for this message's author. Missing for ephemeral messages and messages from webhooks |
| mentions  | array of [user](#DOCS_RESOURCES_USER/user-object) objects, with an additional partial [member](#DOCS_RESOURCES_GUILD/guild-member-object) field | Users specifically mentioned in the message                                                            |

#### Message Update

Sent when a message is updated. The inner payload is a [message](#DOCS_RESOURCES_CHANNEL/message-object) object with the same extra fields as [MESSAGE_CREATE](#DOCS_TOPICS_GATEWAY_EVENTS/message-create).

> warn
> Unlike creates, message updates may contain only a subset of the full message object payload (but will always contain an ID and channel_id).

#### Message Delete

Sent when a message is deleted.

###### Message Delete Event Fields

| Field      | Type      | Description       |
| ---------- | --------- | ----------------- |
| id         | snowflake | ID of the message |
| channel_id | snowflake | ID of the channel |
| guild_id?  | snowflake | ID of the guild   |

#### Message Delete Bulk

Sent when multiple messages are deleted at once.

###### Message Delete Bulk Event Fields

| Field      | Type                | Description         |
| ---------- | ------------------- | ------------------- |
| ids        | array of snowflakes | IDs of the messages |
| channel_id | snowflake           | ID of the channel   |
| guild_id?  | snowflake           | ID of the guild     |

#### Message Reaction Add

Sent when a user adds a reaction to a message.

###### Message Reaction Add Event Fields

| Field      | Type                                                         | Description                                                                                |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| user_id    | snowflake                                                    | ID of the user                                                                             |
| channel_id | snowflake                                                    | ID of the channel                                                                          |
| message_id | snowflake                                                    | ID of the message                                                                          |
| guild_id?  | snowflake                                                    | ID of the guild                                                                            |
| member?    | [member](#DOCS_RESOURCES_GUILD/guild-member-object) object   | Member who reacted if this happened in a guild                                             |
| emoji      | a partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object | Emoji used to react - [example](#DOCS_RESOURCES_EMOJI/emoji-object-standard-emoji-example) |

#### Message Reaction Remove

Sent when a user removes a reaction from a message.

###### Message Reaction Remove Event Fields

| Field      | Type                                                         | Description                                                                                |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| user_id    | snowflake                                                    | ID of the user                                                                             |
| channel_id | snowflake                                                    | ID of the channel                                                                          |
| message_id | snowflake                                                    | ID of the message                                                                          |
| guild_id?  | snowflake                                                    | ID of the guild                                                                            |
| emoji      | a partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object | Emoji used to react - [example](#DOCS_RESOURCES_EMOJI/emoji-object-standard-emoji-example) |

#### Message Reaction Remove All

Sent when a user explicitly removes all reactions from a message.

###### Message Reaction Remove All Event Fields

| Field      | Type      | Description       |
| ---------- | --------- | ----------------- |
| channel_id | snowflake | ID of the channel |
| message_id | snowflake | ID of the message |
| guild_id?  | snowflake | ID of the guild   |

#### Message Reaction Remove Emoji

Sent when a bot removes all instances of a given emoji from the reactions of a message.

###### Message Reaction Remove Emoji Event Fields

| Field      | Type                                                       | Description            |
| ---------- | ---------------------------------------------------------- | ---------------------- |
| channel_id | snowflake                                                  | ID of the channel      |
| guild_id?  | snowflake                                                  | ID of the guild        |
| message_id | snowflake                                                  | ID of the message      |
| emoji      | [partial emoji object](#DOCS_RESOURCES_EMOJI/emoji-object) | Emoji that was removed |

### Presence

#### Presence Update

> warn
> If you are using [Gateway Intents](#DOCS_TOPICS_GATEWAY/gateway-intents), you _must_ specify the `GUILD_PRESENCES` intent in order to receive Presence Update events

A user's presence is their current state on a guild. This event is sent when a user's presence or info, such as name or avatar, is updated.

> warn
> The user object within this event can be partial, the only field which must be sent is the `id` field, everything else is optional. Along with this limitation, no fields are required, and the types of the fields are **not** validated. Your client should expect any combination of fields and types within this event.

###### Presence Update Event Fields

| Field         | Type                                                                     | Description                                  |
| ------------- | ------------------------------------------------------------------------ | -------------------------------------------- |
| user          | [user](#DOCS_RESOURCES_USER/user-object) object                          | User whose presence is being updated         |
| guild_id      | snowflake                                                                | ID of the guild                              |
| status        | string                                                                   | Either "idle", "dnd", "online", or "offline" |
| activities    | array of [activity](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object) objects | User's current activities                    |
| client_status | [client_status](#DOCS_TOPICS_GATEWAY_EVENTS/client-status-object) object | User's platform-dependent status             |

#### Client Status Object

Active sessions are indicated with an "online", "idle", or "dnd" string per platform. If a user is offline or invisible, the corresponding field is not present.

| Field    | Type   | Description                                                                       |
| -------- | ------ | --------------------------------------------------------------------------------- |
| desktop? | string | User's status set for an active desktop (Windows, Linux, Mac) application session |
| mobile?  | string | User's status set for an active mobile (iOS, Android) application session         |
| web?     | string | User's status set for an active web (browser, bot account) application session    |

#### Activity Object

###### Activity Structure

| Field           | Type                                                                                 | Description                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| name            | string                                                                               | Activity's name                                                                                                                  |
| type            | integer                                                                              | [Activity type](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-types)                                                      |
| url?            | ?string                                                                              | Stream URL, is validated when type is 1                                                                                          |
| created_at      | integer                                                                              | Unix timestamp (in milliseconds) of when the activity was added to the user's session                                            |
| timestamps?     | [timestamps](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-timestamps) object | Unix timestamps for start and/or end of the game                                                                                 |
| application_id? | snowflake                                                                            | Application ID for the game                                                                                                      |
| details?        | ?string                                                                              | What the player is currently doing                                                                                               |
| state?          | ?string                                                                              | User's current party status                                                                                                      |
| emoji?          | ?[emoji](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-emoji) object          | Emoji used for a custom status                                                                                                   |
| party?          | [party](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-party) object           | Information for the current party of the player                                                                                  |
| assets?         | [assets](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-assets) object         | Images for the presence and their hover texts                                                                                    |
| secrets?        | [secrets](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-secrets) object       | Secrets for Rich Presence joining and spectating                                                                                 |
| instance?       | boolean                                                                              | Whether or not the activity is an instanced game session                                                                         |
| flags?          | integer                                                                              | [Activity flags](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-flags) `OR`d together, describes what the payload includes |
| buttons?        | array of [buttons](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-buttons)     | Custom buttons shown in the Rich Presence (max 2)                                                                                |

> info
> Bots are only able to send `name`, `type`, and optionally `url`.

###### Activity Types

| ID  | Name      | Format              | Example                              |
| --- | --------- | ------------------- | ------------------------------------ |
| 0   | Game      | Playing {name}      | "Playing Rocket League"              |
| 1   | Streaming | Streaming {details} | "Streaming Rocket League"            |
| 2   | Listening | Listening to {name} | "Listening to Spotify"               |
| 3   | Watching  | Watching {name}     | "Watching YouTube Together"          |
| 4   | Custom    | {emoji} {name}      | ":smiley: I am cool"                 |
| 5   | Competing | Competing in {name} | "Competing in Arena World Champions" |

> info
> The streaming type currently only supports Twitch and YouTube. Only `https://twitch.tv/` and `https://youtube.com/` urls will work.

###### Activity Timestamps

| Field  | Type    | Description                                              |
| ------ | ------- | -------------------------------------------------------- |
| start? | integer | Unix time (in milliseconds) of when the activity started |
| end?   | integer | Unix time (in milliseconds) of when the activity ends    |

###### Activity Emoji

| Field     | Type      | Description                   |
| --------- | --------- | ----------------------------- |
| name      | string    | Name of the emoji             |
| id?       | snowflake | ID of the emoji               |
| animated? | boolean   | Whether the emoji is animated |

###### Activity Party

| Field | Type                                           | Description                                       |
| ----- | ---------------------------------------------- | ------------------------------------------------- |
| id?   | string                                         | ID of the party                                   |
| size? | array of two integers (current_size, max_size) | Used to show the party's current and maximum size |

###### Activity Assets

| Field        | Type   | Description                                                                                  |
| ------------ | ------ | -------------------------------------------------------------------------------------------- |
| large_image? | string | See [Activity Asset Image](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-asset-image) |
| large_text?  | string | Text displayed when hovering over the large image of the activity                            |
| small_image? | string | See [Activity Asset Image](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-asset-image) |
| small_text?  | string | Text displayed when hovering over the small image of the activity                            |

###### Activity Asset Image

Activity asset images are arbitrary strings which usually contain snowflake IDs or prefixed image IDs. Treat data within this field carefully, as it is user-specifiable and not sanitized.

To use an external image via media proxy, specify the URL as the field's value when sending. You will only receive the `mp:` prefix via the gateway.

| Type              | Format                   | Image URL                                                                  |
| ----------------- | ------------------------ | -------------------------------------------------------------------------- |
| Application Asset | `{application_asset_id}` | See [Application Asset Image Formatting](#DOCS_REFERENCE/image-formatting) |
| Media Proxy Image | `mp:{image_id}`          | `https://media.discordapp.net/{image_id}`                                  |

###### Activity Secrets

| Field     | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| join?     | string | Secret for joining a party            |
| spectate? | string | Secret for spectating a game          |
| match?    | string | Secret for a specific instanced match |

###### Activity Flags

| Name                        | Value  |
| --------------------------- | ------ |
| INSTANCE                    | 1 << 0 |
| JOIN                        | 1 << 1 |
| SPECTATE                    | 1 << 2 |
| JOIN_REQUEST                | 1 << 3 |
| SYNC                        | 1 << 4 |
| PLAY                        | 1 << 5 |
| PARTY_PRIVACY_FRIENDS       | 1 << 6 |
| PARTY_PRIVACY_VOICE_CHANNEL | 1 << 7 |
| EMBEDDED                    | 1 << 8 |

###### Activity Buttons

When received over the gateway, the `buttons` field is an array of strings, which are the button labels. Bots cannot access a user's activity button URLs. When sending, the `buttons` field must be an array of the below object:

| Field | Type   | Description                                            |
| ----- | ------ | ------------------------------------------------------ |
| label | string | Text shown on the button (1-32 characters)             |
| url   | string | URL opened when clicking the button (1-512 characters) |

###### Example Activity

```json
{
  "details": "24H RL Stream for Charity",
  "state": "Rocket League",
  "name": "Twitch",
  "type": 1,
  "url": "https://www.twitch.tv/discord"
}
```

###### Example Activity with Rich Presence

```json
{
  "name": "Rocket League",
  "type": 0,
  "application_id": "379286085710381999",
  "state": "In a Match",
  "details": "Ranked Duos: 2-1",
  "timestamps": {
    "start": 15112000660000
  },
  "party": {
    "id": "9dd6594e-81b3-49f6-a6b5-a679e6a060d3",
    "size": [2, 2]
  },
  "assets": {
    "large_image": "351371005538729000",
    "large_text": "DFH Stadium",
    "small_image": "351371005538729111",
    "small_text": "Silver III"
  },
  "secrets": {
    "join": "025ed05c71f639de8bfaa0d679d7c94b2fdce12f",
    "spectate": "e7eb30d2ee025ed05c71ea495f770b76454ee4e0",
    "match": "4b2fdce12f639de8bfa7e3591b71a0d679d7c93f"
  }
}
```

> warn
> Clients may only update their game status 5 times per 20 seconds.

#### Typing Start

Sent when a user starts typing in a channel.

###### Typing Start Event Fields

| Field      | Type                                                       | Description                                            |
| ---------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| channel_id | snowflake                                                  | ID of the channel                                      |
| guild_id?  | snowflake                                                  | ID of the guild                                        |
| user_id    | snowflake                                                  | ID of the user                                         |
| timestamp  | integer                                                    | Unix time (in seconds) of when the user started typing |
| member?    | [member](#DOCS_RESOURCES_GUILD/guild-member-object) object | Member who started typing if this happened in a guild  |

#### User Update

Sent when properties about the current bot's user change. Inner payload is a [user](#DOCS_RESOURCES_USER/user-object) object.

### Voice

#### Voice State Update

Sent when someone joins/leaves/moves voice channels. Inner payload is a [voice state](#DOCS_RESOURCES_VOICE/voice-state-object) object.

#### Voice Server Update

Sent when a guild's voice server is updated. This is sent when initially connecting to voice, and when the current voice instance fails over to a new server.

> warn
> A null endpoint means that the voice server allocated has gone away and is trying to be reallocated. You should attempt to disconnect from the currently connected voice server, and not attempt to reconnect until a new voice server is allocated.

###### Voice Server Update Event Fields

| Field    | Type      | Description                           |
| -------- | --------- | ------------------------------------- |
| token    | string    | Voice connection token                |
| guild_id | snowflake | Guild this voice server update is for |
| endpoint | ?string   | Voice server host                     |

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

###### Webhooks Update Event Fields

| Field      | Type      | Description       |
| ---------- | --------- | ----------------- |
| guild_id   | snowflake | ID of the guild   |
| channel_id | snowflake | ID of the channel |

### Interactions

#### Interaction Create

Sent when a user uses an [Application Command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/) or [Message Component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS). Inner payload is an [Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure).

### Stage Instances

#### Stage Instance Create

Sent when a [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE) is created (i.e. the Stage is now "live"). Inner payload is a [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object)

#### Stage Instance Update

Sent when a [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE) has been updated. Inner payload is a [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object)

#### Stage Instance Delete

Sent when a [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE) has been deleted (i.e. the Stage has been closed). Inner payload is a [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object)


