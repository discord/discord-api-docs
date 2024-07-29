# Soundboard Resource

Users can play soundboard sounds in voice channels, triggering a Voice Channel Effect Send Gateway event for users connected to the voice channel. Bots cannot play soundboard sounds. Soundboard use is controlled by the `USE_SOUNDBOARD` and `USE_EXTERNAL_SOUNDS` [permissions](#DOCS_TOPICS_PERMISSIONS).

There is a set of [default sounds](#DOCS_RESOURCES_SOUNDBOARD/list-soundboard-default-sounds) available to all users. Soundboard sounds can also be [created in a guild](#DOCS_RESOURCES_SOUNDBOARD/create-guild-soundboard-sound); users will be able to use the sounds in the guild, and Nitro subscribers can use them in all guilds.

Soundboard sounds in a set of guilds can be retrieved over the Gateway using [Request Soundboard Sounds](#DOCS_TOPICS_GATEWAY_EVENTS/request-soundboard-sounds).

### Soundboard Sound Object

###### Soundboard Sound Structure

| Field      | Type                                            | Description                                                               |
|------------|-------------------------------------------------|---------------------------------------------------------------------------|
| name       | string                                          | the name of this sound                                                    |
| sound_id   | snowflake                                       | the id of this sound                                                      |
| volume     | double                                          | the volume of this sound, from 0 to 1                                     |
| emoji_id   | ?snowflake                                      | the id of this sound's custom emoji                                       |
| emoji_name | ?string                                         | the unicode character of this sound's standard emoji                      |
| guild_id?  | snowflake                                       | the id of the guild this sound is in                                      |
| available  | boolean                                         | whether this sound can be used, may be false due to loss of Server Boosts |
| user?      | [user](#DOCS_RESOURCES_USER/user-object) object | the user who created this sound                                           |

### Sound Files

A soundboard sound can be retrieved in MP3 format at the URL:

```
https://cdn.discordapp.com/soundboard-sounds/{sound_id}
```

## List Soundboard Default Sounds % GET /soundboard-default-sounds

Returns an array of [soundboard sound](#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object) objects that can be used by all users.

## Create Guild Soundboard Sound % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/soundboard-sounds

Create a new soundboard sound for the guild. Requires the `MANAGE_GUILD_EXPRESSIONS` permission. Returns the new [soundboard sound](#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object) object on success. Fires a [Guild Soundboard Sound Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-soundboard-sound-create) Gateway event.

> info
> Soundboard sounds have a max file size of 512kb and a max duration of 5.2 seconds.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field       | Type       | Description                                                                             |
|-------------|------------|-----------------------------------------------------------------------------------------|
| name        | string     | name of the soundboard sound (2-32 characters)                                          |
| sound       | data uri   | the mp3 sound data, base64 encoded, similar to [image data](#DOCS_REFERENCE/image-data) |
| volume?     | ?double    | the volume of the soundboard sound, from 0 to 1, defaults to 1                          |
| emoji_id?   | ?snowflake | the id of the custom emoji for the soundboard sound                                     |
| emoji_name? | ?string    | the unicode character of a standard emoji for the soundboard sound                      |

## Modify Guild Soundboard Sound % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/soundboard-sounds/{sound.id#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object}

Modify the given soundboard sound. Requires the `MANAGE_GUILD_EXPRESSIONS` permission. Returns the updated [soundboard sound](#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object) object on success. Fires a [Guild Soundboard Sound Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-soundboard-sound-update) Gateway event.

> warn
> All parameters to this endpoint are optional, but the volume and emoji will be cleared if they are not included.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field      | Type       | Description                                                        |
|------------|------------|--------------------------------------------------------------------|
| name       | string     | name of the soundboard sound (2-32 characters)                     |
| volume     | ?double    | the volume of the soundboard sound, from 0 to 1, defaults to 1     |
| emoji_id   | ?snowflake | the id of the custom emoji for the soundboard sound                |
| emoji_name | ?string    | the unicode character of a standard emoji for the soundboard sound |

## Delete Guild Soundboard Sound % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/soundboard-sounds/{sound.id#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object}

Delete the given soundboard sound. Requires the `MANAGE_GUILD_EXPRESSIONS` permission. Returns `204 No Content` on success. Fires a [Guild Soundboard Sound Delete](#DOCS_TOPICS_GATEWAY_EVENTS/guild-soundboard-sound-delete) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.
