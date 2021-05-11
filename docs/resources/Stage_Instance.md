# Stage Instance Resource

A _Stage Instance_ holds information about a live stage.

## Definitions

Below are some definitions related to stages.

- **Liveness:** A Stage channel is considered _live_ when there is an associated stage instance. Conversely, a Stage channel is _not live_ when there is no associated stage instance.
- **Speakers:** A participant of a Stage channel is a _speaker_ when their [voice state](#DOCS_RESOURCES_VOICE/voice-state-object)
  is not `suppress`ed, and has no `request_to_speak_timestamp`.
- **Moderators**: A member of the guild is a _moderator_ of a Stage channel if they have all of the following [permissions](#DOCS_TOPICS_PERMISSIONS/permissions):
  - `MANAGE_CHANNELS`
  - `MUTE_MEMBERS`
  - `MOVE_MEMBERS`
- Topic: This is the blurb that gets shown below the channel's name, among other places.

## Auto Closing

When a Stage channel has no speakers for a certain period of time (on the order of minutes) it will be automatically deleted.

###### Stage Instance Structure

| Field      | Type      | Description                                        |
| ---------- | --------- | -------------------------------------------------- |
| id         | snowflake | The id of this Stage instance                      |
| guild_id   | snowflake | The guild id of the associated Stage channel       |
| channel_id | snowflake | The id of the associated Stage channel             |
| topic      | string    | The topic of the Stage instance (1-120 characters) |

###### Example Stage Instance

```json
{
  "id": "840647391636226060",
  "guild_id": "197038439483310086",
  "channel_id": "733488538393510049",
  "topic": "Testing Testing, 123"
}
```

## Create Stage Instance % POST /stage-instances

Creates a new Stage instance associated to a Stage channel.

Requires the user to be a moderator of the Stage channel.

###### JSON Params

| Field      | Type      | Description                                        |
| ---------- | --------- | -------------------------------------------------- |
| channel_id | snowflake | The id of the Stage channel                        |
| topic      | string    | The topic of the Stage instance (1-120 characters) |

## Get Stage Instance % GET /stage-instances/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Gets the stage instance associated with the Stage channel, if it exists.

## Update Stage Instance % PATCH /stage-instances/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Updates fields of an existing Stage instance.

Requires the user to be a moderator of the Stage channel.

###### JSON Params

| Field | Type   | Description                                        |
| ----- | ------ | -------------------------------------------------- |
| topic | string | The topic of the Stage instance (1-120 characters) |

## Delete Stage Instance % DELETE /stage-instances/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Deletes the Stage instance.

Requires the user to be a moderator of the Stage channel.
