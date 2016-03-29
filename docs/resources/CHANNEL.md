# Channels Resource

### Guild Channels

Guild channels represent an isolated set of users and messages within a Guild.

###### Guild Channel Object

| Field | Type | Description | Present |
|-------|------|-------------|---------|
| id    | snowflake | the id of this channel (will be equal to the guild if it's the "general" channel) | Always|
| guild_id | snowflake | the id of the guild | Always |
| name | string | the name of the channel (2-100 characters) | Always |
| type | string | "text" or "voice" | Always |
| position | integer | the ordering position of the channel | Always |
| is_private | bool | should always be false for guild channels | Always |
| permission_overwrites | array | an array of [overwrite](#DOCS_CHANNEL/overwrite-object) objects | Always |
| topic | string | the channel topic (0-1024 characters) | Text only |
| last\_message\_id | snowflake | the id of the last message sent in this channel | Text only |
| bitrate | integer | the bitrate (in bits) of the voice channel | Voice only |

###### Example Text Channel Object

```json
{
	"id": "41771983423143937",
	"guild_id": "41771983423143937",
	"name": "general",
	"type": "text",
	"position": 6,
	"is_private": false,
	"permission_overwrites": [...],
	"topic": "24/7 chat about how to gank Mike #2",
	"last_message_id": "155117677105512449"
}
```

###### Example Voice Channel Object

```json
{
	"id": "155101607195836416",
	"guild_id": "41771983423143937",
	"name": "ROCKET CHEESE",
	"type": "voice",
	"position": 5,
	"is_private": false,
	"permission_overwrites": [...],
	"bitrate": 64000
}
```

### DM Channels

DM Channels represent a one-to-one conversation between two users, outside of the scope of guilds.

###### DM Channel Object

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | the id of this private message |
| is_private | bool | should always be true for dm channels |
| recipient | object | the [user object](#DOCS_USER/user-object) of the DM recipient |
| last_message_id | snowflake | the id of the last message sent in this DM |

###### Example DM Channel Object

```json
{
	"id": "134552934997426176",
	"is_private": true,
	"recipient": ...,
	"last_message_id": "153642275539255296"
}
```

### Read States

###### Read State Object

Read states represent the tracking of what messages and mentions have been read.

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | channel id |
| mention_count | integer | number of mentions in this channel |
| last_message_id | snowflake | last message read in this channel |

###### Example Read State Object

```json
{
      "id": "78703938047582208",
      "mention_count": 5,
      "last_message_id": "72465239836196864"
}
```

### Messages

###### Message Object

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | id of the message |
| channel_id | snowflake | id of the channel the message was sent in |
| author | the [user object](#DOCS_USER/user-object) for the author |
| content | string | contents of the message |
| timestamp | timestamp | when this message was sent |
| edited_timestamp | timestamp | when this message was edited (or null if never) |
| tts | boolean | whether this was a TTS message |
| mention_everyone | boolean | whether this message mentions everyone |
| mentions | array of [user objects](#DOCS_USER/user-object) | and users mentioned in the message |
| attachments | array of [attachment objects](#DOC_CHANNEL/attachment-object) | any attached (uploaded) files |
| embeds | array of [embed objects](#DOC_CHANNEL/embed-object) | any embedded links |

###### Example Message Object

```json
{
    "id": "162701077035089920",
    "channel_id": "131391742183342080",
    "author": {...},
    "content": "Hey guys!",
    "timestamp": "2016-03-24T23:15:59.605000+00:00",
    "edited_timestamp": null,
    "tts": false,
    "mention_everyone": false,
    "mentions": [...],
    "attachments": [...],
    "embeds": [...]
}
```

### Embeds

###### Embed Object

| Field | Type | Description |
|-------|------|-------------|
| title | string | title of embed |
| type | string | type of embed |
| description | string | description of embed |
| url | string | url of embed |
| thumbnail | [embed thumbnail object](#DOCS_CHANNEL/embed-thumbnail-object) | thumbnail information |
| provider | [embed provider object](#DOCS_CHANNEL/embed-provider-object) | provider information |

###### Embed Thumbnail Object

| Field | Type | Description |
|-------|------|-------------|
| url | string | source url of thumbnail |
| proxy_url | string | a proxied url of the thumbnail |
| height | integer | height of thumbnail |
| width | integer | width of thumbnail |

###### Embed Provider Object

| Field | Type | Description |
|-------|------|-------------|
| name | string | name of provider |
| url | string | url of provider |

### Attachments

###### Attachment Object

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | attachment id |
| filename | string | name of file attached |
| size | integer | size of file in bytes |
| url | string | source url of file |
| proxy_url | string | a proxied url of file |
| height | integer | height of file (if image) |
| width | integer | width of file (if image) |

### Invites

###### Invite Object

| Field | Type | Description |
|-------|------|-------------|
| code | string | id of the invite |
| uses | integer | number of times the invite was used |
| max_uses | integer | max number of uses |
| max_age | integer | max age of invite (in seconds) |
| temporary | boolean | whether this invite is temporary |
| revoked | boolean | whether this invite is revoked |
| xkcdpass | string | the xkcdpass version of the code |
| guild | [guild object](#DOCS_GUILD/guild-object) | the guild this invite is for |
| channel | [channel object](#DOCS_CHANNEL/guild-channel-object) | the channel this invite is for |
| inviter | [user object](#DOCS_USER/user-object) | the user that created this invite |

## Get Channel % GET /channels/{channel.id#DOCS_CHANNEL/message-object}

Return a channel by ID. This returns a [guild channel](#DOCS_CHANNEL/guild-channel-object) or [dm channel](#DOCS_CHANNEL/dm-channel-object) object.

## Modify Channel % PUT/PATCH /channels/{channel.id#DOCS_CHANNEL/message-object}

Update a channels settings. Requires the 'MANAGE_GUILD' permission for the guild. This returns a [guild channel](#DOCS_CHANNEL/guild-channel-object) on success, and a 400 BAD REQUEST on invalid parameters.

###### JSON Params

| Field | Type | Description | Channel Type |
|-------|------|-------------|--------------|
| name | string | 2-100 character channel name | Both |
| position | integer | the position of the channel in the left-hand listing | Both |
| topic | string | 0-1024 character channel topic | Text |
| bitrate | integer | the bitrate (in bits) of the voice channel; 8000 to 96000 (128000 for VIP servers) | Voice |

## Delete/Close Channel % DELETE /channels/{channel.id#DOCS_CHANNEL/channel-object}

Delete a guild channel, or close a private message. Requires the 'MANAGE_GUILD' permission for the guild. Returns a [guild channel](#DOCS_CHANNEL/guild-channel-object) or [dm channel](#DOCS_CHANNEL/dm-channel-object) object on success.

## Get Channel Messages % GET /channels/{channel.id#DOCS_CHANNEL/channel-object}/messages

Return the messages for a channel. Requires the 'READ_MESSAGES' permission for the channel. Returns an array of [message](#DOCS_CHANNEL/message-object) objects on success.

```info
The before and after keys are mutually exclusive, only one may be passed at a time.
```

###### JSON Params

| Field | Type | Description | Required | Default |
|-------|------|-------------|----------|---------|
| before | snowflake | get messages before this message ID | false | absent |
| after | snowflake | get messages after this message ID | false | absent |
| limit | integer | max number of messages to return (1-100) | false | 50 |

## Create Message % POST /channels/{channel.id}/messages

Post a message to a guild text or DM channel. Requires the 'SEND_MESSAGES' permission for guild channels. Returns a [message](#DOCS_CHANNEL/message-object) object.

###### JSON Params

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| content | string | the message contents (up to 2000 characters) | true |
| nonce | string | a nonce that can be used for optimistic message sending | false |
| tts | bool | true if this is a TTS message | false |

## Edit Message % PATCH /channels/{channel.id#DOCS_CHANNEL/channel-object}/messages/{message.id#DOCS_CHANNEL/message-object}

Edit a previously sent message. Returns a [message](#DOCS_CHANNEL/message-object) object.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| content | string | the new message contents |

## Delete Message % DELETE /channels/{channel.id#DOCS_CHANNEL/channel-object}/messages/{message.id#DOCS_CHANNEL/message-object}

Delete a message. Requires the 'MANAGE_MESSAGES' permission if the message author is different. Returns a [message](#DOCS_CHANNEL/message-object) object.

## Ack Message % POST /channels/{channel.id#DOCS_CHANNEL/channel-obj}/messages/{message.id#DOCS_CHANNEL/message-object}/ack

Ack a message. Generally bots should **not** implement this route.

## Edit Channel Permissions % PUT /channels/{channel.id#DOCS_CHANNEL/channel-obj}/permissions/{overwrite.id}

Edit the channel permission overwrites for a user or role in a channel. Requires the 'MANAGE_ROLES' permission. Returns a 200 empty response on success. For more information about permissions, see [permissions](#DOCS_PERMISSIONS)

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| allow | integer | the bitwise value of all allowed permissions |
| deny | integer | the bitwise value of all disallowed permissions |

## Trigger Typing Indicator % POST /channels/{channel.id#DOCS_CHANNEL/channel-object}/typing

Post a typing indicator for the specified channel. Generally bots should **not** implement this route.

