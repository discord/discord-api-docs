# Guild Scheduled Event

A representation of a scheduled event in a [guild](#DOCS_RESOURCES_GUILD/).

### Guild Scheduled Event Object

###### Guild Scheduled Event Structure

| Field                | Type                                                                                                                           | Description                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| id                   | snowflake                                                                                                                      | the id of the scheduled event                                                                       |
| guild_id             | snowflake                                                                                                                      | the guild id of the scheduled event                                                                 |
| channel_id           | ?snowflake                                                                                                                     | the channel id of the scheduled event                                                               |
| creator_id?          | snowflake                                                                                                                      | the id of the user that created the scheduled event                                                 |
| name                 | string                                                                                                                         | the name of the scheduled event                                                                     |
| description?         | string                                                                                                                         | the description of the scheduled event                                                              |
| image                | ?string                                                                                                                        | the image of the scheduled event                                                                    |
| scheduled_start_time | ISO8601 timestamp                                                                                                              | the time the scheduled event will start                                                             |
| scheduled_end_time   | ?ISO8601 timestamp                                                                                                             | the time the scheduled event will end, or `null` if the event does not have a scheduled time to end |
| privacy_level        | [privacy level](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-privacy-level)        | the privacy level of the scheduled event                                                            |
| status               | [event status](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-status)                | the status of the scheduled event                                                                   |
| entity_type          | [scheduled entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types) | the entity type of the scheduled event                                                              |
| entity_id            | ?snowflake                                                                                                                     | entity id                                                                                           |
| entity_metadata      | [entity metadata](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-metadata)    | the entity metadata for the scheduled event                                                         |
| sku_ids              | array of snowflakes                                                                                                            | sku ids                                                                                             |
| creator?             | [user](#DOCS_RESOURCES_USER/user-object) object                                                                                | the creator of the scheduled event                                                                  |
| skus                 | array of SKUs                                                                                                                  | skus                                                                                                |
| user_count?          | integer                                                                                                                        | users subscribed to the scheduled event                                                             |

###### Guild Scheduled Event Privacy Level

| Level      | Value | Description                                                    |
| ---------- | ----- | -------------------------------------------------------------- |
| PUBLIC     | 1     | the guild scheduled event is public and available in discovery |
| GUILD_ONLY | 2     | the guild scheduled event is only accessable to guild members  |

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

###### Guild Scheduled Event Entity Metadata

| Field        | Type                | Description                       |
| ------------ | ------------------- | --------------------------------- |
| speaker_ids? | array of snowflakes | the speakers of the stage channel |
| location?    | string              | location of the event             |

## List Scheduled Events for Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/scheduled-events

Returns a list of [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) objects for the given guild.

###### Query String Params

| Field            | Type    | Description                   |
| ---------------- | ------- | ----------------------------- |
| with_user_count? | boolean | users subscribed to the event |

## Create Guild Scheduled Event % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/scheduled-events

Create a guild scheduled event in the guild. Returns a [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

###### JSON Params

| Field                | Type                                                                                                                        | Description                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| channel_id?          | snowflake                                                                                                                   | the channel id of the scheduled event, if for a stage instance of voice channel |
| entity_metadata?     | [entity metadata](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-metadata) | the entity metadata of the scheduled event                                      |
| name                 | string                                                                                                                      | the name of the scheduled event                                                 |
| privacy_level        | [privacy level](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-privacy-level)     | the privacy level of the scheduled event                                        |
| scheduled_start_time | ISO8601 timestamp                                                                                                           | the time to schedule the scheduled event                                        |
| description?         | string                                                                                                                      | the description of the scheduled event                                          |
| entity_type          | [event entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types)  | the entity type of the scheduled event                                          |

## Get Guild Scheduled Event % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/scheduled-events/{guild_scheduled_event.id}

Get a guild scheduled event. Returns a [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

## Modify Guild Scheduled Event % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/scheduled-events/{guild_scheduled_event.id}

Modify a guild scheduled event. Returns the modified [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) object on success.

> info
> All parameters to this endpoint are optional

###### JSON Params

| Field                | Type                                                                                                                        | Description                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| channel_id           | snowflake                                                                                                                   | the channel id of the scheduled event, if for a stage instance of voice channel |
| entity_metadata      | [entity metadata](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-metadata) | the entity metadata of the scheduled event                                      |
| name                 | string                                                                                                                      | the name of the scheduled event                                                 |
| privacy_level        | [privacy level](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-privacy-level)     | the privacy level of the scheduled event                                        |
| scheduled_start_time | ISO8601 timestamp                                                                                                           | the time to schedule the scheduled event                                        |
| description          | string                                                                                                                      | the description of the scheduled event                                          |
| entity_type          | [event entity type](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object-guild-scheduled-event-entity-types)  | the entity type of the scheduled event                                          |

## Delete Guild Scheduled Event % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/scheduled-events/{guild_scheduled_event.id}

Delete a guild scheduled event. Returns a `204` on success.

## Get Guild Scheduled Event Users % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object}/scheduled-events/{guild_scheduled_event.id}/users

Get a list of users RSVP'd to the guild scheduled event. Returns a list of [user](#DOCS_RESOURCES_USER/user-object) objects on success.

###### Query String Params

| Field        | Type    | Description                                                                    | Default |
| ------------ | ------- | ------------------------------------------------------------------------------ | ------- |
| limit?       | number  | how many users to receive from the event                                       | 100     |
| with_member? | boolean | include guild member data. attaches `guild_member` property to the user object | false   |
