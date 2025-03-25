---
sidebar_label: Voice
---

# Voice Resource

### Voice State Object

Used to represent a user's voice connection status.

###### Voice State Structure

| Field                      | Type                                                             | Description                                       |
|----------------------------|------------------------------------------------------------------|---------------------------------------------------|
| guild_id?                  | snowflake                                                        | the guild id this voice state is for              |
| channel_id                 | ?snowflake                                                       | the channel id this user is connected to          |
| user_id                    | snowflake                                                        | the user id this voice state is for               |
| member?                    | [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object | the guild member this voice state is for          |
| session_id                 | string                                                           | the session id for this voice state               |
| deaf                       | boolean                                                          | whether this user is deafened by the server       |
| mute                       | boolean                                                          | whether this user is muted by the server          |
| self_deaf                  | boolean                                                          | whether this user is locally deafened             |
| self_mute                  | boolean                                                          | whether this user is locally muted                |
| self_stream?               | boolean                                                          | whether this user is streaming using "Go Live"    |
| self_video                 | boolean                                                          | whether this user's camera is enabled             |
| suppress                   | boolean                                                          | whether this user's permission to speak is denied |
| request_to_speak_timestamp | ?ISO8601 timestamp                                               | the time at which the user requested to speak     |

###### Example Voice State

```json
{
  "channel_id": "157733188964188161",
  "user_id": "80351110224678912",
  "session_id": "90326bd25d71d39b9ef95b299e3872ff",
  "deaf": false,
  "mute": false,
  "self_deaf": false,
  "self_mute": true,
  "suppress": false,
  "request_to_speak_timestamp": "2021-03-31T18:45:31.297561+00:00"
}
```

### Voice Region Object

###### Voice Region Structure

| Field      | Type    | Description                                                           |
|------------|---------|-----------------------------------------------------------------------|
| id         | string  | unique ID for the region                                              |
| name       | string  | name of the region                                                    |
| optimal    | boolean | true for a single server that is closest to the current user's client |
| deprecated | boolean | whether this is a deprecated voice region (avoid switching to these)  |
| custom     | boolean | whether this is a custom voice region (used for events/etc)           |

## List Voice Regions % GET /voice/regions

Returns an array of [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) objects that can be used when setting a voice or stage channel's [`rtc_region`](#DOCS_RESOURCES_CHANNEL/channel-object-channel-structure).

## Get Current User Voice State % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/@me

Returns the current user's [voice state](#DOCS_RESOURCES_VOICE/voice-state-object) in the guild.

## Get User Voice State % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/{user.id#DOCS_RESOURCES_USER/user-object}

Returns the specified user's [voice state](#DOCS_RESOURCES_VOICE/voice-state-object) in the guild.

## Modify Current User Voice State % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/@me

Updates the current user's voice state. Returns `204 No Content` on success. Fires a [Voice State Update](#DOCS_EVENTS_GATEWAY_EVENTS/voice-state-update) Gateway event.

###### JSON Params

| Field                       | Type               | Description                                    |
|-----------------------------|--------------------|------------------------------------------------|
| channel_id?                 | snowflake          | the id of the channel the user is currently in |
| suppress?                   | boolean            | toggles the user's suppress state              |
| request_to_speak_timestamp? | ?ISO8601 timestamp | sets the user's request to speak               |

###### Caveats

There are currently several caveats for this endpoint:

- `channel_id` must currently point to a stage channel.
- current user must already have joined `channel_id`.
- You must have the `MUTE_MEMBERS` permission to unsuppress yourself. You can always suppress yourself.
- You must have the `REQUEST_TO_SPEAK` permission to request to speak. You can always clear your own request to speak.
- You are able to set `request_to_speak_timestamp` to any present or future time.

## Modify User Voice State % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/voice-states/{user.id#DOCS_RESOURCES_USER/user-object}

Updates another user's voice state. Fires a [Voice State Update](#DOCS_EVENTS_GATEWAY_EVENTS/voice-state-update) Gateway event.

###### JSON Params

| Field      | Type      | Description                                    |
|------------|-----------|------------------------------------------------|
| channel_id | snowflake | the id of the channel the user is currently in |
| suppress?  | boolean   | toggles the user's suppress state              |

###### Caveats

There are currently several caveats for this endpoint:

- `channel_id` must currently point to a stage channel.
- User must already have joined `channel_id`.
- You must have the `MUTE_MEMBERS` permission. (Since suppression is the only thing that is available currently.)
- When unsuppressed, non-bot users will have their `request_to_speak_timestamp` set to the current time. Bot users will not.
- When suppressed, the user will have their `request_to_speak_timestamp` removed.
