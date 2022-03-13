# Stage Instance Resource

A _Stage Instance_ holds information about a live stage.

### Stage Instance Object

###### Stage Instance Structure

| Field                    | Type       | Description                                                                                                   |
| ------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------- |
| id                       | snowflake  | The id of this Stage instance                                                                                 |
| guild_id                 | snowflake  | The guild id of the associated Stage channel                                                                  |
| channel_id               | snowflake  | The id of the associated Stage channel                                                                        |
| topic                    | string     | The topic of the Stage instance (1-120 characters)                                                            |
| privacy_level            | integer    | The [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level) of the Stage instance |
| discoverable_disabled    | boolean    | Whether or not Stage Discovery is disabled (deprecated)                                                       |
| guild_scheduled_event_id | ?snowflake | The id of the scheduled event for this Stage instance                                                         |

###### Privacy Level

| Level      | Value | Description                                                         |
| ---------- | ----- | ------------------------------------------------------------------- |
| PUBLIC     | 1     | The Stage instance is visible publicly. (deprecated)                |
| GUILD_ONLY | 2     | The Stage instance is visible to only guild members.                |

###### Example Stage Instance

```json
{
  "id": "840647391636226060",
  "guild_id": "197038439483310086",
  "channel_id": "733488538393510049",
  "topic": "Testing Testing, 123",
  "privacy_level": 1,
  "discoverable_disabled": false,
  "guild_scheduled_event_id": "947656305244532806"
}
```

## Definitions

Below are some definitions related to stages.

- **Liveness:** A Stage channel is considered _live_ when there is an associated stage instance. Conversely, a Stage channel is _not live_ when there is no associated stage instance.
- **Speakers:** A participant of a Stage channel is a _speaker_ when their [voice state](#DOCS_RESOURCES_VOICE/voice-state-object)
  is not `suppress`ed, and has no `request_to_speak_timestamp`.
- **Moderators**: A member of the guild is a _moderator_ of a Stage channel if they have all of the following [permissions](#DOCS_TOPICS_PERMISSIONS/permissions):
  - `MANAGE_CHANNELS`
  - `MUTE_MEMBERS`
  - `MOVE_MEMBERS`
- **Topic**: This is the blurb that gets shown below the channel's name, among other places.
- **Public**: A Stage instance is public when it has a `privacy_level` of `PUBLIC`. While a guild has a public Stage instance:
  - The guild will be lurkable.
  - Lurkers may join any Stage channel with a public Stage instance.
  - Users in the Stage can have the Stage show in their [activities](#DOCS_TOPICS_GATEWAY/presence).
  - [Invites](#DOCS_RESOURCES_INVITE/invite-object) to the Stage channel will have the `stage_instance` field.

## Auto Closing

When a Stage channel has no speakers for a certain period of time (on the order of minutes) it will be automatically deleted.

## Create Stage Instance % POST /stage-instances

Creates a new Stage instance associated to a Stage channel. Returns that [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-stage-instance-structure).

Requires the user to be a moderator of the Stage channel.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field          | Type      | Description                                                                                                                        |
| -------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| channel_id     | snowflake | The id of the Stage channel                                                                                                        |
| topic          | string    | The topic of the Stage instance (1-120 characters)                                                                                 |
| privacy_level? | integer   | The [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level) of the Stage instance (default GUILD_ONLY) |

## Get Stage Instance % GET /stage-instances/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Gets the stage instance associated with the Stage channel, if it exists.

## Modify Stage Instance % PATCH /stage-instances/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Updates fields of an existing Stage instance. Returns the updated [Stage instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-stage-instance-structure).

Requires the user to be a moderator of the Stage channel.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field          | Type    | Description                                                                                                   |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| topic?         | string  | The topic of the Stage instance (1-120 characters)                                                            |
| privacy_level? | integer | The [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level) of the Stage instance |

## Delete Stage Instance % DELETE /stage-instances/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Deletes the Stage instance. Returns `204 No Content`.

Requires the user to be a moderator of the Stage channel.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.
