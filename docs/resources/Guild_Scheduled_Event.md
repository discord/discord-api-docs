# Guild Scheduled Event

A representation of a scheduled event in a [guild](#DOCS_RESOURCES_GUILD/).

### Guild Scheduled Event Object

###### Guild Scheduled Event Structure

| Field                 | Type                                                                                                                           | Description                                                                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                    | snowflake                                                                                                                      | the id of the scheduled event                                                                                                                                                                                         |
| guild_id              | snowflake                                                                                                                      | the guild id which the scheduled event belongs to                                                                                                                                                                     |
| channel_id **         | ?snowflake                                                                                                                     | the channel id in which the scheduled event will be hosted, or `null` if [scheduled entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types) is `EXTERNAL` |
| creator_id? *         | ?snowflake                                                                                                                     | the id of the user that created the scheduled event *                                                                                                                                                                 |
| name                  | string                                                                                                                         | the name of the scheduled event (1-100 characters)                                                                                                                                                                    |
| description?          | ?string                                                                                                                        | the description of the scheduled event (1-1000 characters)                                                                                                                                                            |
| scheduled_start_time  | ISO8601 timestamp                                                                                                              | the time the scheduled event will start                                                                                                                                                                               |
| scheduled_end_time ** | ?ISO8601 timestamp                                                                                                             | the time the scheduled event will end, required if entity_type is `EXTERNAL`                                                                                                                                          |
| privacy_level         | [privacy level](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-privacy-level)        | the privacy level of the scheduled event                                                                                                                                                                              |
| status                | [event status](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-status)                | the status of the scheduled event                                                                                                                                                                                     |
| entity_type           | [scheduled entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types) | the type of the scheduled event                                                                                                                                                                                       |
| entity_id             | ?snowflake                                                                                                                     | the id of an entity associated with a guild scheduled event                                                                                                                                                           |
| entity_metadata **    | ?[entity metadata](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-metadata)   | additional metadata for the guild scheduled event                                                                                                                                                                     |
| creator?              | [user](#DOCS_RESOURCES_USER/user-object) object                                                                                | the user that created the scheduled event                                                                                                                                                                             |
| user_count?           | integer                                                                                                                        | the number of users subscribed to the scheduled event                                                                                                                                                                 |
| image?                | ?string                                                                                                                        | the [cover image hash](#DOCS_REFERENCE/image-formatting) of the scheduled event                                                                                                                                       |


\* `creator_id` will be null and `creator` will not be included for events created before October 25th, 2021, when the concept of `creator_id` was introduced and tracked.

\** See [field requirements by entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-field-requirements-by-entity-type) to understand the relationship between `entity_type` and the following fields: `channel_id`, `entity_metadata`, and `scheduled_end_time`

###### Guild Scheduled Event Privacy Level

| Level      | Value | Description                                              |
| ---------- | ----- | -------------------------------------------------------- |
| GUILD_ONLY | 2     | the scheduled event is only accessible to guild members  |

###### Guild Scheduled Event Entity Types

| Type           | Value |
| -------------- | ----- |
| STAGE_INSTANCE | 1     |
| VOICE          | 2     |
| EXTERNAL       | 3     |

###### Field Requirements By Entity Type

The following table shows field requirements based on current entity type.

`value` : This field is required to be a non-null value

`null`     : This field is required to be null

`-`        : No strict requirements

| Entity Type    | channel_id | entity_metadata | scheduled_end_time |
| -------------- | ---------- | --------------- | ------------------ |
| STAGE_INSTANCE |    value   |      null       |         -          |
| VOICE          |    value   |      null       |         -          |
| EXTERNAL       |    null    |     value *     |       value        |

\* `entity_metadata` with a non-null `location` must be provided


###### Guild Scheduled Event Status

| Type        | Value |
| ----------- | ----- |
| SCHEDULED   | 1     |
| ACTIVE      | 2     |
| COMPLETED * | 3     |
| CANCELED  * | 4     |

\* Once `status` is set to `COMPLETED` or `CANCELED`, the `status` can no longer be updated

###### Valid Guild Scheduled Event Status Transitions

SCHEDULED --> ACTIVE

ACTIVE --------> COMPLETED

SCHEDULED --> CANCELED


###### Guild Scheduled Event Entity Metadata

| Field        | Type                | Description                              |
| ------------ | ------------------- | ---------------------------------------- |
| location? *  | string              | location of the event (1-100 characters) |

\* [required](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-metadata) for events with `'entity_type': EXTERNAL`

### Guild Scheduled Event User Object

###### Guild Scheduled Event User Structure

| Field                     | Type                                                         | Description                                                                                         |
| --------------------      | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| guild_scheduled_event_id  | snowflake                                                    | the scheduled event id which the user subscribed to                                                 |
| user                      | [user](#DOCS_RESOURCES_USER/user-object)                     | user which subscribed to an event                                                                   |
| member?                   | [guild member](#DOCS_RESOURCES_GUILD/guild-member-object)    | guild member data for this user for the guild which this event belongs to, if any                   |


## List Scheduled Events for Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events

Returns a list of [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) objects for the given guild.

###### Query String Params

| Field            | Type    | Description                                      |
| ---------------- | ------- | ------------------------------------------------ |
| with_user_count? | boolean | include number of users subscribed to each event |

## Create Guild Scheduled Event % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events

Create a guild scheduled event in the guild. Returns a [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

> info
> A guild can have a maximum of 100 events with `SCHEDULED` or `ACTIVE` status at any time.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field                  | Type                                                                                                                        | Description                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| channel_id? *          | snowflake *                                                                                                                 | the channel id of the scheduled event.                                                     |
| entity_metadata? **    | [entity metadata](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-metadata) | the entity metadata of the scheduled event                                                 |
| name                   | string                                                                                                                      | the name of the scheduled event                                                            |
| privacy_level          | [privacy level](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-privacy-level)     | the privacy level of the scheduled event                                                   |
| scheduled_start_time   | ISO8601 timestamp                                                                                                           | the time to schedule the scheduled event                                                   |
| scheduled_end_time? ** | ISO8601 timestamp                                                                                                           | the time when the scheduled event is scheduled to end                                      |
| description?           | string                                                                                                                      | the description of the scheduled event                                                     |
| entity_type            | [entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types)        | the entity type of the scheduled event                                                     |
| image?                 | [image data](#DOCS_REFERENCE/image-data)                                                                                    | the cover image of the scheduled event                                                     |

\* Optional for events with `'entity_type': EXTERNAL`

\*\* Required for events with `'entity_type': EXTERNAL`

## Get Guild Scheduled Event % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events/{guild_scheduled_event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}

Get a guild scheduled event. Returns a [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

###### Query String Params

| Field            | Type    | Description                                      |
| ---------------- | ------- | ------------------------------------------------ |
| with_user_count? | boolean | include number of users subscribed to this event |

## Modify Guild Scheduled Event % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events/{guild_scheduled_event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}

Modify a guild scheduled event. Returns the modified [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

> info
> To start or end an event, use this endpoint to modify the event's [status](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-status) field.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

> info
> This endpoint silently discards `entity_metadata` for non-`EXTERNAL` events.

###### JSON Params

| Field                 | Type                                                                                                                         | Description                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| channel_id? *         | ?snowflake                                                                                                                   | the channel id of the scheduled event, set to `null` if changing entity type to `EXTERNAL` |
| entity_metadata?      | ?[entity metadata](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-metadata) | the entity metadata of the scheduled event                                                 |
| name?                 | string                                                                                                                       | the name of the scheduled event                                                            |
| privacy_level?        | [privacy level](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-privacy-level)      | the privacy level of the scheduled event                                                   |
| scheduled_start_time? | ISO8601 timestamp                                                                                                            | the time to schedule the scheduled event                                                   |
| scheduled_end_time? * | ISO8601 timestamp                                                                                                            | the time when the scheduled event is scheduled to end                                      |
| description?          | ?string                                                                                                                      | the description of the scheduled event                                                     |
| entity_type? *        | [event entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types)   | the entity type of the scheduled event                                                     |
| status?               | [event status](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-status)              | the status of the scheduled event                                                          |
| image?                | [image data](#DOCS_REFERENCE/image-data)                                                                                     | the cover image of the scheduled event                                                     |

\* If updating `entity_type` to `EXTERNAL`:

- `channel_id` is required and [must be set to null](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-field-requirements-by-entity-type)
- `entity_metadata` with a `location` field must be provided
- `scheduled_end_time` must be provided

## Delete Guild Scheduled Event % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events/{guild_scheduled_event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}

Delete a guild scheduled event. Returns a `204` on success.

## Get Guild Scheduled Event Users % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/scheduled-events/{guild_scheduled_event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/users

Get a list of guild scheduled event users subscribed to a guild scheduled event. Returns a list of [guild scheduled event user](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-user-object) objects on success. Guild member data, if it exists, is included if the `with_member` query parameter is set.

###### Query String Params

| Field        | Type      | Description                                                                    | Default |
| ------------ | -------   | ------------------------------------------------------------------------------ | ------- |
| limit?       | number    | number of users to return (up to maximum 100)                                  | 100     |
| with_member? | boolean   | include guild member data if it exists                                         | false   |
| before? *    | snowflake | consider only users before given user id                                       | null    |
| after? *     | snowflake | consider only users after given user id                                        | null    |

\* Provide a user id to `before` and `after` for pagination. Users will always be returned in ascending order by `user_id`. If both `before` and `after` are provided, only `before` is respected. Fetching users in-between `before` and `after` is not supported.


## Guild Scheduled Event Status Update Automation

NOTE: `status` and `entity_type` here are expressed by name rather than their value for readability

### An active scheduled event for a stage channel where all users have left the stage channel will automatically end a few minutes after the last user leaves the channel

When an event with `'status': ACTIVE` and `'entity_type': STAGE_INSTANCE` has no users connected to the stage channel for a certain period of time (on the order of minutes), the event `status` will be automatically set to `COMPLETED`.

### An active scheduled event for a voice channel where all users have left the voice channel will automatically end a few minutes after the last user leaves the channel

When an event with `'status': ACTIVE` and `'entity_type': VOICE` has no users connected to the voice channel for a certain period of time (on the order of minutes), the event `status` will be automatically set to `COMPLETED`.

### An external event will automatically begin at its scheduled start time

An event with `'entity_type': EXTERNAL` at its `scheduled_start_time` will automatically have `status` set to `ACTIVE`.

### An external event will automatically end at its scheduled end time

An event with `'entity_type': EXTERNAL` at its `scheduled_end_time`  will automatically have `status` set to `COMPLETED`.

### Any scheduled event which has not begun after its scheduled start time will be automatically cancelled after a few hours

Any event with `'status': SCHEDULED` after a certain time interval (on the order of hours) beyond its `scheduled_start_time` will have its `status` automatically set to `CANCELLED`.

## Guild Scheduled Event Permissions Requirements

NOTE: `entity_type` is expressed by name rather than value for readability

> info
> A user must be a member of the guild in order to access events for that guild unless the guild is lurkable. If a guild is lurkable,
> events in that guild may be visible to lurkers depending on the event type and the permissions of any channels associated with the event.

### Permissions to create an event with entity_type: STAGE_INSTANCE

#### Write Permissions (CREATE / UPDATE)

- `MANAGE_EVENTS` at the guild level or at least `MANAGE_EVENTS` for the `channel_id` associated with the event
- `MANAGE_CHANNELS`
- `MUTE_MEMBERS`
- `MOVE_MEMBERS`

#### Read Permissions (GET)

- `VIEW_CHANNEL` for `channel_id` associated with the event

### Permissions to create an event with entity_type: VOICE

#### Write Permissions (CREATE / UPDATE)

- `MANAGE_EVENTS` at the guild level or `MANAGE_EVENTS` for the `channel_id` associated with the event
- `VIEW_CHANNEL` for `channel_id` associated with event
- `CONNECT` for `channel_id` associated with event

#### Read Permissions (GET)

- `VIEW_CHANNEL` for `channel_id` associated with the event


### Permissions to create an event with entity_type: EXTERNAL

#### Write Permissions (CREATE / UPDATE)

- `MANAGE_EVENTS` at the guild level

#### Read Permissions (GET)

* *No other permissions required*
