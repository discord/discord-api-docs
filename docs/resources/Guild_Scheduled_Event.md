# Guild Scheduled Event

A representation of an scheduled event in a [Guild](#DOCS_RESOURCES_GUILD/).

### Guild Scheduled Event Object

###### Guild Scheduled Event Structure

| Field                | Type                                                                                                                 | Description                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| id                   | snowflake                                                                                                            | the id of the event                                                                       |
| guild_id             | snowflake                                                                                                            | the guild id of the event                                                                 |
| channel_id           | ?snowflake                                                                                                           | the channel id of the event                                                               |
| creator_id           | snowflake                                                                                                            | the id of the user that created the event                                                 |
| name                 | string                                                                                                               | the name of the event                                                                     |
| description?         | string                                                                                                               | the description of the event                                                              |
| image                | ?string                                                                                                              | the image of the event                                                                    |
| scheduled_start_time | ISO8601 timestamp                                                                                                    | the time the event will start                                                             |
| scheduled_end_time   | ?ISO8601 timestamp                                                                                                   | the time the event will end, or `null` if the event does not have a scheduled time to end |
| privacy_level        | [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level)                                  | event privacy level                                                                       |
| status               | [event status](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-event-object-guild-scheduled-event-status)                | the scheduled status of the event                                                         |
| entity_type          | [scheduled entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-event-object-guild-scheduled-event-entity-types) | the scheduled entity type of the event                                                    |
| entity_id            | ?snowflake                                                                                                           | entity id                                                                                 |
| entity_metadata      | [entity metadata](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-event-object-guild-event-entity-metadata)              | metadata for the event                                                                    |
| sku_ids              | array of snowflakes                                                                                                  | sku ids                                                                                   |
| creator?             | [user](#DOCS_RESOURCES_USER/user-object) object                                                                      | the creator of the event                                                                  |
| skus                 | array                                                                                                                | skus                                                                                      |
| user_count?          | integer                                                                                                              | users subscribed to the event                                                             |

###### Guild Scheduled Event Entity Types

| Type           | Value |
| -------------- | ----- |
| NONE           | 0     |
| STAGE_INSTANCE | 1     |
| VOICE          | 2     |
| LOCATION       | 3     |

###### Guild Scheduled Event Status

| Type      | Value |
| --------- | ----- |
| SCHEDULED | 1     |
| ACTIVE    | 2     |
| COMPLETED | 3     |
| CANCELED  | 4     |

###### Guild Event Entity Metadata

| Field        | Type                | Description                       |
| ------------ | ------------------- | --------------------------------- |
| speaker_ids? | array of snowflakes | the speakers of the stage channel |
| location?    | string              | location of the event             |

## List Guild Scheduled Events for Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/events

Returns a list of [Guild Scheduled Event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) objects in the guild.

###### Query String Params

| Field            | Type    | Description                   |
| ---------------- | ------- | ----------------------------- |
| with_user_count? | boolean | users subscribed to the event |

## Create Guild Scheduled Event % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/events

Create a Guild Scheduled Event in the guild. Returns a [Guild Scheduled Event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

###### JSON Params

| Field                | Type                                                                                                                                       | Description                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| channel_id?          | snowflake                                                                                                                                  | the channel id of the event            |
| name                 | string                                                                                                                                     | the name of the event                  |
| privacy_level        | [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level)                                                        | the privacy level of the event         |
| scheduled_start_time | ISO8601 timestamp                                                                                                                          | the time to schedule the event         |
| description?         | string                                                                                                                                     | the description of the event           |
| entity_type          | [guild scheduled event entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types) | the scheduled entity type of the event |

## Get Guild Event % GET /guild-events/{event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}

Get a Guild Scheduled Event. Returns a [Guild Scheduled Event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

## Delete Guild Scheduled Event % DELETE /guild-events/{event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}

Delete a Guild Scheduled Event. Returns a `204` on success.

## Modify Guild Scheduled Event % PATCH /guild-events/{event.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}

Modify a Guild Scheduled Event. Returns the modified [Guild Scheduled Event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

> info
> All parameters to this endpoint are optional

###### JSON Params

| Field                | Type                                                                                                                                       | Description                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| channel_id           | snowflake                                                                                                                                  | the channel id of the event            |
| name                 | string                                                                                                                                     | the name of the event                  |
| privacy_level        | [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level)                                                        | the privacy level of the event         |
| scheduled_start_time | ISO8601 timestamp                                                                                                                          | the time to schedule the event         |
| description          | string                                                                                                                                     | the description of the event           |
| entity_type          | [guild scheduled event entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types) | the scheduled entity type of the event |
