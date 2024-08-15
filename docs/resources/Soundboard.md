# Soundboard Resource

Users can play soundboard sounds in voice channels, triggering a Voice Channel Effect Send Gateway event for users connected to the voice channel.

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

A soundboard sound can be retrieved in MP3 or Ogg format at the URL:

```
https://cdn.discordapp.com/soundboard-sounds/{sound_id}
```

## Send Soundboard Sound % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/send-soundboard-sound

Send a soundboard sound to a voice channel the user is connected to. Fires a Voice Channel Effect Send Gateway event.

Requires the `SPEAK` and `USE_SOUNDBOARD` permissions, and also the `USE_EXTERNAL_SOUNDS` permission if the sound is from a different server. Additionally, requires the user's [voice state](#DOCS_RESOURCES_VOICE/voice-state-object) to not have `deaf`, `self_deaf`, `mute`, or `suppress` enabled.

###### JSON Params

| Field            | Type      | Description                                                                                      |
|------------------|-----------|--------------------------------------------------------------------------------------------------|
| sound_id         | snowflake | the id of the soundboard sound to play                                                           |
| source_guild_id? | snowflake | the id of the guild the soundboard sound is from, required to play sounds from different servers |

## List Soundboard Default Sounds % GET /soundboard-default-sounds

Returns an array of [soundboard sound](#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object) objects that can be used by all users.

## List Guild Soundboard Sounds % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/soundboard-sounds

Returns a list of the guild's soundboard sounds. Includes `user` fields if the bot has the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission.

###### Response Structure

| Field | Type                                                                                    |
|-------|-----------------------------------------------------------------------------------------|
| items | array of [soundboard sound](#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object) objects |

## Get Guild Soundboard Sound % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/soundboard-sounds/{sound.id#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object}

Returns a [soundboard sound](#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object) object for the given sound id. Includes the `user` field if the bot has the `MANAGE_GUILD_EXPRESSIONS` permission, or if the bot created the emoji and has the the `CREATE_GUILD_EXPRESSIONS` permission.

## Create Guild Soundboard Sound % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/soundboard-sounds

Create a new soundboard sound for the guild. Requires the `CREATE_GUILD_EXPRESSIONS` permission. Returns the new [soundboard sound](#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object) object on success. Fires a [Guild Soundboard Sound Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-soundboard-sound-create) Gateway event.

> info
> Soundboard sounds have a max file size of 512kb and a max duration of 5.2 seconds.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field       | Type       | Description                                                                                    |
|-------------|------------|------------------------------------------------------------------------------------------------|
| name        | string     | name of the soundboard sound (2-32 characters)                                                 |
| sound       | data uri   | the mp3 or ogg sound data, base64 encoded, similar to [image data](#DOCS_REFERENCE/image-data) |
| volume?     | ?double    | the volume of the soundboard sound, from 0 to 1, defaults to 1                                 |
| emoji_id?   | ?snowflake | the id of the custom emoji for the soundboard sound                                            |
| emoji_name? | ?string    | the unicode character of a standard emoji for the soundboard sound                             |

## Modify Guild Soundboard Sound % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/soundboard-sounds/{sound.id#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object}

Modify the given soundboard sound. For sounds created by the current user, requires either the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission. For other sounds, requires the `MANAGE_GUILD_EXPRESSIONS` permission. Returns the updated [soundboard sound](#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object) object on success. Fires a [Guild Soundboard Sound Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-soundboard-sound-update) Gateway event.

> warn
> All parameters to this endpoint are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field      | Type       | Description                                                        |
|------------|------------|--------------------------------------------------------------------|
| name       | string     | name of the soundboard sound (2-32 characters)                     |
| volume     | ?double    | the volume of the soundboard sound, from 0 to 1                    |
| emoji_id   | ?snowflake | the id of the custom emoji for the soundboard sound                |
| emoji_name | ?string    | the unicode character of a standard emoji for the soundboard sound |

## Delete Guild Soundboard Sound % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/soundboard-sounds/{sound.id#DOCS_RESOURCES_SOUNDBOARD/soundboard-sound-object}

Delete the given soundboard sound. For sounds created by the current user, requires either the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission. For other sounds, requires the `MANAGE_GUILD_EXPRESSIONS` permission. Returns `204 No Content` on success. Fires a [Guild Soundboard Sound Delete](#DOCS_TOPICS_GATEWAY_EVENTS/guild-soundboard-sound-delete) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.
