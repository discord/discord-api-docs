# Voice Resource

### Voice State Object

Used to represent a user's voice connection status.

###### Voice State Structure

| Field | Type | Description |
|-------|------|-------------|
| guild_id? | snowflake | the guild id this voice state is for |
| channel_id | ?snowflake | the channel id this user is connected to |
| user_id | snowflake | the user id this voice state is for |
| member? | [member object](#DOCS_RESOURCES_GUILD/member-object) | the guild member this voice state is for |
| session_id | string | the session id for this voice state |
| deaf | bool | whether this user is deafened by the server |
| mute | bool | whether this user is muted by the server |
| self_deaf | bool | whether this user is locally deafened |
| self_mute | bool | whether this user is locally muted |
| suppress | bool | whether this user is muted by the current user |

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
	"suppress": false
}
```

### Voice Region Object

###### Voice Region Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | unique ID for the region |
| name | string | name of the region |
| vip | bool | true if this is a vip-only server |
| optimal | bool | true for a single server that is closest to the current user's client |
| deprecated | bool | whether this is a deprecated voice region (avoid switching to these) |
| custom | bool | whether this is a custom voice region (used for events/etc) |

## List Voice Regions % GET /voice/regions

Returns an array of [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) objects that can be used when creating servers.
