# Voice Resource

## Voice State Object

Used to represent a users voice connection status.

###### Voice State Structure

| Field | Type | Description |
|-------|------|-------------|
| channel_id | snowflake | the channel id this user is connected to |
| user_id | snowflake | the user id this voice state is for |
| session_id | string | the session id for this voice state |
| deaf | bool | whether this user is deafened by the server |
| mute | bool | whether this user is muted by the server |
| self_deaf | bool | whether this user is locally deafened |
| self_mute | bool | whether this user is locally muted |
| suppress | bool | whether this user is muted by the current user |

###### Voice State Example

```json
{
	"channel_id": "157733188964188161",
	"user_id": "80351110224678912",
	"session_id": "90326bd25d71d39b9ef95b299e3872ff",
	"deaf": 0,
	"mute": 0,
	"self_deaf": 0,
	"self_mute": 1,
	 "suppress": 0
}
```

## Voice Region

###### Voice Region Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | unique ID for the region |
| name | string | name of the region |
| sample_hostname | string | an example hostname for the region |
| sample_port | integer | an example port for the region |
| vip | bool | true if this is a vip-only server |
| optimal | bool | true for a single server that is closest to the current users client |

## List Voice Regions % GET /voice/regions

Return an array of [voice region](#DOCS_VOICE/voice-region-object) objects that can be used when creating servers.