# Guild Event

A representation of an event in a Guild.

### Guild Event Object

###### Guild Event Structure

| Field                 | Type                                                                                                   | Description                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| id                    | snowflake                                                                                              | the id of the event                                                                       |
| guild_id              | snowflake                                                                                              | the guild id of the event                                                                 |
| channel_id            | ?snowflake                                                                                             | the stage channel id of the event                                                         |
| name                  | string                                                                                                 | the name of the event                                                                     |
| description?          | string                                                                                                 | the description of the event                                                              |
| image                 | ?string                                                                                                | the image of the event                                                                    |
| scheduled_start_time  | ISO8601                                                                                                | the time the event will start                                                             |
| scheduled_end_time    | ?ISO8601                                                                                               | the time the event will end, or `null` if the event does not have a scheduled time to end |
| privacy_level         | [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level)                    | event privacy level                                                                       |
| status                | integer                                                                                                | the status of the event                                                                   |
| entity_type           | integer                                                                                                | the entity type of the event                                                              |
| entity_id             | ?snowflake                                                                                             | entity id                                                                                 |
| entity_metadata       | [event entity metadata](#DOCS_RESOURCES_STAGE_INSTANCE/guild-event-object-guild-event-entity-metadata) | metadata for the event                                                                    |
| sku_ids               | array of snowflakes                                                                                    | sku ids                                                                                   |
| skus                  | array                                                                                                  | skus                                                                                      |
| user_count?           | integer                                                                                                | users subscribed to the event                                                             |

###### Guild Event Entity Metadata

| Field        | Type                | Description                       |
| ------------ | ------------------- | --------------------------------- |
| speaker_ids? | array of snowflakes | the speakers of the stage channel |

## List Guild events % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/events

Returns a list of [Guild Events](#DOCS_RESOURCES_GUILD_EVENT/guild-event-object) in the guild.

###### Query String Params

| Field            | Type    | Description                   |
| ---------------- | ------- | ----------------------------- |
| with_user_count? | boolean | users subscribed to the event |

## Create Guild event % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/events

Create an event in the guild. Returns a [Guild Event](#DOCS_RESOURCES_GUILD_EVENT/guild-event-object) object on success.

###### JSON Params

| Field                | Type                                                                                | Description                       |
| -------------------- | ----------------------------------------------------------------------------------- | --------------------------------- |
| channel_id?          | snowflake                                                                           | the stage channel id of the event |
| name                 | string                                                                              | the name of the event             |
| privacy_level        | [privacy level](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object-privacy-level) | the privacy level of the event    |
| scheduled_start_time | ISO8601                                                                             | the time to schedule the event    |
| description?         | string                                                                              | the description of the event      |
| entity_type?         | integer                                                                             | event entity type                 |
