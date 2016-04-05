# Channels Resource

### Guild Channel Object

Guild channels represent an isolated set of users and messages within a Guild.

###### Guild Channel Structure

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

###### Example Text Channel

```json
{
	"id": "41771983423143937",
	"guild_id": "41771983423143937",
	"name": "general",
	"type": "text",
	"position": 6,
	"is_private": false,
	"permission_overwrites": [],
	"topic": "24/7 chat about how to gank Mike #2",
	"last_message_id": "155117677105512449"
}
```

###### Example Voice Channel

```json
{
	"id": "155101607195836416",
	"guild_id": "41771983423143937",
	"name": "ROCKET CHEESE",
	"type": "voice",
	"position": 5,
	"is_private": false,
	"permission_overwrites": [],
	"bitrate": 64000
}
```

### DM Channel Object

DM Channels represent a one-to-one conversation between two users, outside of the scope of guilds.

###### DM Channel Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | the id of this private message |
| is_private | bool | should always be true for dm channels |
| recipient | object | the [user object](#DOCS_USER/user-object) of the DM recipient |
| last_message_id | snowflake | the id of the last message sent in this DM |

###### Example DM Channel

```json
{
	"id": "134552934997426176",
	"is_private": true,
	"recipient": {},
	"last_message_id": "153642275539255296"
}
```

### Read States

Read states represent the tracking of what messages and mentions have been read.

###### Read State Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | channel id |
| mention_count | integer | number of mentions in this channel |
| last_message_id | snowflake | last message read in this channel |

###### Example Read State

```json
{
      "id": "78703938047582208",
      "mention_count": 5,
      "last_message_id": "72465239836196864"
}
```

### Messages

Represents a message sent in a channel within Discord.

###### Message Structure

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
| nonce | integer | used for validating a message was sent |

###### Example Message

```json
{
    "id": "162701077035089920",
    "channel_id": "131391742183342080",
    "author": {},
    "content": "Hey guys!",
    "timestamp": "2016-03-24T23:15:59.605000+00:00",
    "edited_timestamp": null,
    "tts": false,
    "mention_everyone": false,
    "mentions": [],
    "attachments": [],
    "embeds": []
}
```

### Embeds

###### Embed Structure

| Field | Type | Description |
|-------|------|-------------|
| title | string | title of embed |
| type | string | type of embed |
| description | string | description of embed |
| url | string | url of embed |
| thumbnail | [embed thumbnail object](#DOCS_CHANNEL/embed-thumbnail-object) | thumbnail information |
| provider | [embed provider object](#DOCS_CHANNEL/embed-provider-object) | provider information |

###### Embed Thumbnail Structure

| Field | Type | Description |
|-------|------|-------------|
| url | string | source url of thumbnail |
| proxy_url | string | a proxied url of the thumbnail |
| height | integer | height of thumbnail |
| width | integer | width of thumbnail |

###### Embed Provider Structure

| Field | Type | Description |
|-------|------|-------------|
| name | string | name of provider |
| url | string | url of provider |

### Attachments

###### Attachment Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | attachment id |
| filename | string | name of file attached |
| size | integer | size of file in bytes |
| url | string | source url of file |
| proxy_url | string | a proxied url of file |
| height | integer | height of file (if image) |
| width | integer | width of file (if image) |

## Get Channel % GET /channels/{channel.id#DOCS_CHANNEL/channel-object}

Return a channel by ID. This returns a [guild channel](#DOCS_CHANNEL/guild-channel-object) or [dm channel](#DOCS_CHANNEL/dm-channel-object) object.

## Modify Channel % PUT/PATCH /channels/{channel.id#DOCS_CHANNEL/channel-object}

Update a channels settings. Requires the 'MANAGE_GUILD' permission for the guild. This returns a [guild channel](#DOCS_CHANNEL/guild-channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Channel Update](#DOCS_GATEWAY/channel-update) Gateway event.

###### JSON Params

| Field | Type | Description | Channel Type |
|-------|------|-------------|--------------|
| name | string | 2-100 character channel name | Both |
| position | integer | the position of the channel in the left-hand listing | Both |
| topic | string | 0-1024 character channel topic | Text |
| bitrate | integer | the bitrate (in bits) of the voice channel; 8000 to 96000 (128000 for VIP servers) | Voice |

## Delete/Close Channel % DELETE /channels/{channel.id#DOCS_CHANNEL/channel-object}

Delete a guild channel, or close a private message. Requires the 'MANAGE_GUILD' permission for the guild. Returns a [guild channel](#DOCS_CHANNEL/guild-channel-object) or [dm channel](#DOCS_CHANNEL/dm-channel-object) object on success. Fires a [Channel Delete](#DOCS_GATEWAY/channel-delete) Gateway event.

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

Post a message to a guild text or DM channel. Requires the 'SEND_MESSAGES' permission for guild channels. Returns a [message](#DOCS_CHANNEL/message-object) object. Fires a [Message Create](#DOCS_GATEWAY/message-create) Gateway event.

###### JSON Params

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| content | string | the message contents (up to 2000 characters) | true |
| nonce | string | a nonce that can be used for optimistic message sending | false |
| tts | bool | true if this is a TTS message | false |

## Edit Message % PATCH /channels/{channel.id#DOCS_CHANNEL/channel-object}/messages/{message.id#DOCS_CHANNEL/message-object}

Edit a previously sent message. Returns a [message](#DOCS_CHANNEL/message-object) object. Fires a [Message Update](#DOCS_GATEWAY/message-update) Gateway event.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| content | string | the new message contents |

## Delete Message % DELETE /channels/{channel.id#DOCS_CHANNEL/channel-object}/messages/{message.id#DOCS_CHANNEL/message-object}

Delete a message. Requires the 'MANAGE_MESSAGES' permission if the message author is different. Returns a [message](#DOCS_CHANNEL/message-object) object. Fires a [Message Delete](#DOCS_GATEWAY/message-delete) Gateway event.

## Ack Message % POST /channels/{channel.id#DOCS_CHANNEL/channel-obj}/messages/{message.id#DOCS_CHANNEL/message-object}/ack

Ack a message. Generally bots should **not** implement this route.

## Edit Channel Permissions % PUT /channels/{channel.id#DOCS_CHANNEL/channel-obj}/permissions/{overwrite.id}

Edit the channel permission overwrites for a user or role in a channel. Requires the 'MANAGE_ROLES' permission. Returns a 200 empty response on success. For more information about permissions, see [permissions](#DOCS_PERMISSIONS)

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| allow | integer | the bitwise value of all allowed permissions |
| deny | integer | the bitwise value of all disallowed permissions |

## Get Channel Invites % GET /channels/{channel.id#DOCS_CHANNEL/channel-obj}/invites

Return a list of [invite](#DOCS_INVITE/invite-object) objects (with [invite metadata](#DOCS_INVITE/invite-metadata-object)) for the channel. Requires the 'MANAGE_CHANNELS' permission.

## Create Channel Invite % POST /channels/{channel.id#DOCS_CHANNEL/channel-obj}/invites

Create a new [invite](#DOCS_INVITE/invite-object) object for the channel. Requires the `CREATE_INSTANT_INVITE` permission. All params for this route are optional.

###### JSON Params

| Field | Type | Description | Default |
|-------|------|-------------|----------|
| max_age | integer | duration of invite in seconds before expiry, or 0 for never | 86400 (24 hours) |
| max_uses | integer | max number of uses or 0 for unlimited | 0 |
| temporary | boolean | whether this invite only grants temporary membership | false |
| xkcdpass | boolean | whether to generate an xkcdpass version of the invite code | false |

## Delete Channel Permission % DELETE /channels/{channel.id#DOCS_CHANNEL/channel-obj}/permissions/{overwrite.id}

Delete a channel permission overwrite for a user or role in a channel. Requires the 'MANAGE_ROLES' permission. Returns a 200 empty response on success. For more information about permissions, see [permissions](#DOCS_PERMISSIONS)

## Trigger Typing Indicator % POST /channels/{channel.id#DOCS_CHANNEL/channel-object}/typing

Post a typing indicator for the specified channel. Generally bots should **not** implement this route. Fires a [Typing Start](#DOCS_GATEWAY/typing-start) Gateway event.