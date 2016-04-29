# Channels Resource

## Channel Objects

### Guild Channel Object

Guild channels represent an isolated set of users and messages within a Guild.

###### Guild Channel Structure

| Field | Type | Description | Present |
|-------|------|-------------|---------|
| id | snowflake | the id of this channel (will be equal to the guild if it's the "general" channel) | Always|
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
| mention_count | integer | number of unread mentions in this channel |
| last_message_id | snowflake | last message read in this channel |

###### Example Read State

```json
{
	"id": "78703938047582208",
	"mention_count": 5,
	"last_message_id": "72465239836196864"
}
```

### Messages Object

Represents a message sent in a channel within Discord.

###### Message Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | id of the message |
| channel_id | snowflake | id of the channel the message was sent in |
| author | a [user](#DOCS_USER/user-object) object | the author of this message |
| content | string | contents of the message |
| timestamp | timestamp | when this message was sent |
| edited_timestamp | ?timestamp | when this message was edited (or null if never) |
| tts | boolean | whether this was a TTS message |
| mention_everyone | boolean | whether this message mentions everyone |
| mentions | array of [user objects](#DOCS_USER/user-object) | and users specifically mentioned in the message |
| attachments | array of [attachment objects](#DOC_CHANNEL/attachment-object) | any attached files |
| embeds | array of [embed objects](#DOC_CHANNEL/embed-object) | any embedded content |
| nonce | ?integer | used for validating a message was sent |

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

### Overwrite Object

###### Overwrite Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | role or user id |
| type | string | either "role" or "member" |
| allow | integer | permission bit set |
| deny | integer | permission bit set |

### Embed Object

###### Embed Structure

| Field | Type | Description |
|-------|------|-------------|
| title | string | title of embed |
| type | string | type of embed |
| description | string | description of embed |
| url | string | url of embed |
| thumbnail | [embed thumbnail object](#DOCS_CHANNEL/embed-thumbnail-structure) | thumbnail information |
| provider | [embed provider object](#DOCS_CHANNEL/embed-provider-structure) | provider information |

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

### Attachment Object

###### Attachment Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | attachment id |
| filename | string | name of file attached |
| size | integer | size of file in bytes |
| url | string | source url of file |
| proxy_url | string | a proxied url of file |
| height | ?integer | height of file (if image) |
| width | ?integer | width of file (if image) |

## Message Formatting

Discord utilizes a subset of markdown for rendering message content on its clients, while also adding some custom functionality to enable things like mentioning users and channels. Mentions can be created using the following format:

### Mentions

| Type | Structure | Example |
|---------|-------------|-------------|
| User | `<@USER_SNOWFLAKE_ID>` | `<@80351110224678912>` |
| User (Nickname) | `<@!USER_SNOWFLAKE_ID>` | `<@!80351110224678912>` |
| Channel | `<#CHANNEL_SNOWFLAKE_ID>` | `<#103735883630395392>` |
| Role | `<@&ROLE_SNOWFLAKE_ID` | `<@&165511591545143296>` |

## Get Channel % GET /channels/{channel.id#DOCS_CHANNEL/channel-objects}

Return a channel by ID. This returns a [guild channel](#DOCS_CHANNEL/guild-channel-object) or [dm channel](#DOCS_CHANNEL/dm-channel-object) object.

## Modify Channel % PUT/PATCH /channels/{channel.id#DOCS_CHANNEL/guild-channel-object}

Update a channels settings. Requires the 'MANAGE_GUILD' permission for the guild. This returns a [guild channel](#DOCS_CHANNEL/guild-channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Channel Update](#DOCS_GATEWAY/channel-update) Gateway event.

###### JSON Params

| Field | Type | Description | Channel Type |
|-------|------|-------------|--------------|
| name | string | 2-100 character channel name | Both |
| position | integer | the position of the channel in the left-hand listing | Both |
| topic | string | 0-1024 character channel topic | Text |
| bitrate | integer | the bitrate (in bits) of the voice channel; 8000 to 96000 (128000 for VIP servers) | Voice |

## Delete/Close Channel % DELETE /channels/{channel.id#DOCS_CHANNEL/channel-objects}

Delete a guild channel, or close a private message. Requires the 'MANAGE_GUILD' permission for the guild. Returns a [guild channel](#DOCS_CHANNEL/guild-channel-object) or [dm channel](#DOCS_CHANNEL/dm-channel-object) object on success. Fires a [Channel Delete](#DOCS_GATEWAY/channel-delete) Gateway event. Deleting a guild channel cannot be undone. Use with caution, as it is impossible to undo this action when performed on a guild channel. In contrast, when used with a private message, it is possible to undo the action by opening a private message with the recipient again.

## Get Channel Messages % GET /channels/{channel.id#DOCS_CHANNEL/channel-objects}/messages

Return the messages for a channel. If operating on a guild channel, this endpoint requires the 'READ_MESSAGES' permission to be present on the current user. Returns an array of [message](#DOCS_CHANNEL/message-object) objects on success.

>info
> The before and after keys are mutually exclusive, only one may be passed at a time.

###### JSON Params

| Field | Type | Description | Required | Default |
|-------|------|-------------|----------|---------|
| before | snowflake | get messages before this message ID | false | absent |
| after | snowflake | get messages after this message ID | false | absent |
| limit | integer | max number of messages to return (1-100) | false | 50 |

## Create Message % POST /channels/{channel.id#DOCS_CHANNEL/channel-objects}/messages

Post a message to a guild text or DM channel. If operating on a guild channel, this endpoint requires the 'SEND_MESSAGES' permission to be present on the current user. Returns a [message](#DOCS_CHANNEL/message-object) object. Fires a [Message Create](#DOCS_GATEWAY/message-create) Gateway event. See [message formatting](#DOCS_CHANNEL/message-formatting) for more information on how to properly format messages.

###### JSON Params

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| content | string | the message contents (up to 2000 characters) | true |
| nonce | string | a nonce that can be used for optimistic message sending | false |
| tts | bool | true if this is a TTS message | false |

## Upload File % POST /channels/{channel.id#DOCS_CHANNEL/channel-objects}/messages

Post a file to a guild text or DM channel. If operating on a guild channel, this endpoint requires the 'SEND\_MESSAGES' and 'ATTACH\_FILES' permissions to be present on the current user. Returns a [message](#DOCS_CHANNEL/message-object) object. Fires a [Message Create](#DOCS_GATEWAY/message-create) Gateway event.

>warn
> This endpoint uses multipart/form-data requests instead of the normal JSON request type. Make sure you set your `Content-Type` to `multipart/form-data`.

###### Multipart Params

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| content | string | the message contents (up to 2000 characters) | false |
| nonce | string | a nonce that can be used for optimistic message sending | false |
| tts | string | true if this is a TTS message | false |
| file | file contents | the contents of the file being sent | true |

## Edit Message % PATCH /channels/{channel.id#DOCS_CHANNEL/channel-objects}/messages/{message.id#DOCS_CHANNEL/message-object}

Edit a previously sent message. Returns a [message](#DOCS_CHANNEL/message-object) object. You can only edit messages that have been sent by the current user. Fires a [Message Update](#DOCS_GATEWAY/message-update) Gateway event.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| content | string | the new message contents |

## Delete Message % DELETE /channels/{channel.id#DOCS_CHANNEL/channel-objects}/messages/{message.id#DOCS_CHANNEL/message-object}

Delete a message. If operating on a guild channel and trying to delete a message that was not sent by the current user, this endpoint requires the 'MANAGE_MESSAGES' permission. Returns a [message](#DOCS_CHANNEL/message-object) object. Fires a [Message Delete](#DOCS_GATEWAY/message-delete) Gateway event.

>warn
> This endpoint has a rate limit of 5 requests per second. Deleting messages created within the last 10 seconds does _not_ count towards this limit.

## Ack Message % POST /channels/{channel.id#DOCS_CHANNEL/channel-objects}/messages/{message.id#DOCS_CHANNEL/message-object}/ack

Ack a message. Generally bots should **not** implement this route.

## Edit Channel Permissions % PUT /channels/{channel.id#DOCS_CHANNEL/guild-channel-object}/permissions/{overwrite.id}

Edit the channel permission overwrites for a user or role in a channel. Only usable for guild channels. Requires the 'MANAGE_ROLES' permission. Returns a 204 empty response on success. For more information about permissions, see [permissions](#DOCS_PERMISSIONS/permissions)

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| allow | integer | the bitwise value of all allowed permissions |
| deny | integer | the bitwise value of all disallowed permissions |

## Get Channel Invites % GET /channels/{channel.id#DOCS_CHANNEL/guild-channel-object}/invites

Return a list of [invite](#DOCS_INVITE/invite-object) objects (with [invite metadata](#DOCS_INVITE/invite-metadata-object)) for the channel. Only usable for guild channels. Requires the 'MANAGE_CHANNELS' permission.

## Create Channel Invite % POST /channels/{channel.id#DOCS_CHANNEL/guild-channel-object}/invites

Create a new [invite](#DOCS_INVITE/invite-object) object for the channel. Only usable for guild channels. Requires the `CREATE_INSTANT_INVITE` permission. All JSON paramaters for this route are optional.

###### JSON Params

| Field | Type | Description | Default |
|-------|------|-------------|----------|
| max_age | integer | duration of invite in seconds before expiry, or 0 for never | 86400 (24 hours) |
| max_uses | integer | max number of uses or 0 for unlimited | 0 |
| temporary | boolean | whether this invite only grants temporary membership | false |
| xkcdpass | boolean | whether to generate an xkcdpass version of the invite code | false |

## Delete Channel Permission % DELETE /channels/{channel.id#DOCS_CHANNEL/guild-channel-object}/permissions/{overwrite.id#DOCS_CHANNEL/overwrite-object}

Delete a channel permission overwrite for a user or role in a channel. Only usable for guild channels. Requires the 'MANAGE_ROLES' permission. Returns a 200 empty response on success. For more information about permissions, see [permissions](#DOCS_PERMISSIONS/permissions)

## Trigger Typing Indicator % POST /channels/{channel.id#DOCS_CHANNEL/channel-objects}/typing

Post a typing indicator for the specified channel. Generally bots should **not** implement this route. However, if a bot is responding to a command and expects the computation to take a few seconds, this endpoint may be called to let the user know that the bot is processing their message. Fires a [Typing Start](#DOCS_GATEWAY/typing-start) Gateway event.
