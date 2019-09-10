# Channels Resource

### Channel Object

Represents a guild or DM channel within Discord.

###### Channel Structure

| Field                  | Type                                                                   | Description                                                                                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                     | snowflake                                                              | the id of this channel                                                                                                                                                          |
| type                   | integer                                                                | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types)                                                                                                     |
| guild_id?              | snowflake                                                              | the id of the guild                                                                                                                                                             |
| position?              | integer                                                                | sorting position of the channel                                                                                                                                                 |
| permission_overwrites? | array of [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) objects | explicit permission overwrites for members and roles                                                                                                                            |
| name?                  | string                                                                 | the name of the channel (2-100 characters)                                                                                                                                      |
| topic?                 | ?string                                                                | the channel topic (0-1024 characters)                                                                                                                                           |
| nsfw?                  | boolean                                                                | whether the channel is nsfw                                                                                                                                                     |
| last_message_id?       | ?snowflake                                                             | the id of the last message sent in this channel (may not point to an existing or valid message)                                                                                 |
| bitrate?               | integer                                                                | the bitrate (in bits) of the voice channel                                                                                                                                      |
| user_limit?            | integer                                                                | the user limit of the voice channel                                                                                                                                             |
| rate_limit_per_user?   | integer                                                                | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected |
| recipients?            | array of [user](#DOCS_RESOURCES_USER/user-object) objects              | the recipients of the DM                                                                                                                                                        |
| icon?                  | ?string                                                                | icon hash                                                                                                                                                                       |
| owner_id?              | snowflake                                                              | id of the DM creator                                                                                                                                                            |
| application_id?        | snowflake                                                              | application id of the group DM creator if it is bot-created                                                                                                                     |
| parent_id?             | ?snowflake                                                             | id of the parent category for a channel                                                                                                                                         |
| last_pin_timestamp?    | ISO8601 timestamp                                                      | when the last pinned message was pinned                                                                                                                                         |

###### Channel Types

| Type           | ID  | Description                                                                                                                                                |
| -------------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GUILD_TEXT     | 0   | a text channel within a server                                                                                                                             |
| DM             | 1   | a direct message between users                                                                                                                             |
| GUILD_VOICE    | 2   | a voice channel within a server                                                                                                                            |
| GROUP_DM       | 3   | a direct message between multiple users                                                                                                                    |
| GUILD_CATEGORY | 4   | an [organizational category](https://support.discordapp.com/hc/en-us/articles/115001580171-Channel-Categories-101) that contains channels                  |  |
| GUILD_NEWS     | 5   | a channel that [users can follow and crosspost into their own server](https://support.discordapp.com/hc/en-us/articles/360032008192) |
| GUILD_STORE    | 6   | a channel in which game developers can [sell their game on Discord](https://discordapp.com/developers/docs/game-and-server-management/special-channels)    |

###### Example Guild Text Channel

```json
{
  "id": "41771983423143937",
  "guild_id": "41771983423143937",
  "name": "general",
  "type": 0,
  "position": 6,
  "permission_overwrites": [],
  "rate_limit_per_user": 2,
  "nsfw": true,
  "topic": "24/7 chat about how to gank Mike #2",
  "last_message_id": "155117677105512449",
  "parent_id": "399942396007890945"
}
```

###### Example Guild News Channel

```json
{
  "id": "41771983423143937",
  "guild_id": "41771983423143937",
  "name": "important-news",
  "type": 5,
  "position": 6,
  "permission_overwrites": [],
  "nsfw": true,
  "topic": "Rumors about Half Life 3",
  "last_message_id": "155117677105512449",
  "parent_id": "399942396007890945"
}
```

###### Example Guild Voice Channel

```json
{
  "id": "155101607195836416",
  "guild_id": "41771983423143937",
  "name": "ROCKET CHEESE",
  "type": 2,
  "nsfw": false,
  "position": 5,
  "permission_overwrites": [],
  "bitrate": 64000,
  "user_limit": 0,
  "parent_id": null
}
```

###### Example DM Channel

```json
{
  "last_message_id": "3343820033257021450",
  "type": 1,
  "id": "319674150115610528",
  "recipients": [
    {
      "username": "test",
      "discriminator": "9999",
      "id": "82198898841029460",
      "avatar": "33ecab261d4681afa4d85a04691c4a01"
    }
  ]
}
```

###### Example Group DM Channel

```json
{
  "name": "Some test channel",
  "icon": null,
  "recipients": [
    {
      "username": "test",
      "discriminator": "9999",
      "id": "82198898841029460",
      "avatar": "33ecab261d4681afa4d85a04691c4a01"
    },
    {
      "username": "test2",
      "discriminator": "9999",
      "id": "82198810841029460",
      "avatar": "33ecab261d4681afa4d85a10691c4a01"
    }
  ],
  "last_message_id": "3343820033257021450",
  "type": 3,
  "id": "319674150115710528",
  "owner_id": "82198810841029460"
}
```

###### Example Channel Category

```json
{
  "permission_overwrites": [],
  "name": "Test",
  "parent_id": null,
  "nsfw": false,
  "position": 0,
  "guild_id": "290926798629997250",
  "type": 4,
  "id": "399942396007890945"
}
```

###### Example Store Channel

```json
{
  "id": "41771983423143937",
  "guild_id": "41771983423143937",
  "name": "buy dota-2",
  "type": 6,
  "position": 0,
  "permission_overwrites": [],
  "nsfw": false,
  "parent_id": null
}
```

### Message Object

Represents a message sent in a channel within Discord.

###### Message Structure

| Field                      | Type                                                                                                                                      | Description                                                                                                                   |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| id                         | snowflake                                                                                                                                 | id of the message                                                                                                             |
| channel_id                 | snowflake                                                                                                                                 | id of the channel the message was sent in                                                                                     |
| guild_id?                  | snowflake                                                                                                                                 | id of the guild the message was sent in                                                                                       |
| author\*                   | [user](#DOCS_RESOURCES_USER/user-object) object                                                                                           | the author of this message (not guaranteed to be a valid user, see below)                                                     |
| member?\*\*                | partial [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object                                                                  | member properties for this message's author                                                                                   |
| content                    | string                                                                                                                                    | contents of the message                                                                                                       |
| timestamp                  | ISO8601 timestamp                                                                                                                         | when this message was sent                                                                                                    |
| edited_timestamp           | ?ISO8601 timestamp                                                                                                                        | when this message was edited (or null if never)                                                                               |
| tts                        | boolean                                                                                                                                   | whether this was a TTS message                                                                                                |
| mention_everyone           | boolean                                                                                                                                   | whether this message mentions everyone                                                                                        |
| mentions\*\*\*             | array of [user](#DOCS_RESOURCES_USER/user-object) objects, with an additional partial [member](#DOCS_RESOURCES_GUILD/member-object) field | users specifically mentioned in the message                                                                                   |
| mention_roles              | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) object ids                                                                          | roles specifically mentioned in this message                                                                                  |
| mention\_channels?\*\*\*\* | array of [channel mention](#DOCS_RESOURCES_CHANNEL/channel-mention-object) objects                                                        | channels specifically mentioned in this message                                                                               |
| attachments                | array of [attachment](#DOCS_RESOURCES_CHANNEL/attachment-object) objects                                                                  | any attached files                                                                                                            |
| embeds                     | array of [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects                                                                            | any embedded content                                                                                                          |
| reactions?                 | array of [reaction](#DOCS_RESOURCES_CHANNEL/reaction-object) objects                                                                      | reactions to the message                                                                                                      |
| nonce?                     | ?snowflake                                                                                                                                | used for validating a message was sent                                                                                        |
| pinned                     | boolean                                                                                                                                   | whether this message is pinned                                                                                                |
| webhook_id?                | snowflake                                                                                                                                 | if the message is generated by a webhook, this is the webhook's id                                                            |
| type                       | integer                                                                                                                                   | [type of message](#DOCS_RESOURCES_CHANNEL/message-object-message-types)                                                       |
| activity?                  | [message activity](#DOCS_RESOURCES_CHANNEL/message-object-message-activity-structure) object                                              | sent with Rich Presence-related chat embeds                                                                                   |
| application?               | [message application](#DOCS_RESOURCES_CHANNEL/message-object-message-application-structure) object                                        | sent with Rich Presence-related chat embeds                                                                                   |
| message_reference?         | [message_reference](#DOCS_RESOURCES_CHANNEL/message-object-message-reference-structure) object                                            | reference data sent with crossposted messages                                                                                 |
| flags?                     | integer                                                                                                                                   | [message flags](#DOCS_RESOURCES_CHANNEL/message-object-message-flags) `OR`d together, describes extra features of the message |

\* The author object follows the structure of the user object, but is only a valid user in the case where the message is generated by a user or bot user. If the message is generated by a webhook, the author object corresponds to the webhook's id, username, and avatar. You can tell if a message is generated by a webhook by checking for the `webhook_id` on the message object.

\*\* The member object exists in [MESSAGE_CREATE](#DOCS_TOPICS_GATEWAY/message-create) and [MESSAGE_UPDATE](#DOCS_TOPICS_GATEWAY/message-update) events from text-based guild channels. This allows bots to obtain real-time member data without requiring bots to store member state in memory.

\*\*\* The user objects in the mentions array will only have the partial `member` field present in [MESSAGE_CREATE](#DOCS_TOPICS_GATEWAY/message-create) and [MESSAGE_UPDATE](#DOCS_TOPICS_GATEWAY/message-update) events from text-based guild channels.

\*\*\*\* Not all channel mentions in a message will appear in `mention_channels`. Only textual channels that are visible to everyone in a lurkable guild will ever be included. Only crossposted messages (via Channel Following) currently include `mention_channels` at all. If no mentions in the message meet these requirements, this field will not be sent.

###### Message Types

| Type                                   | Value |
| -------------------------------------- | ----- |
| DEFAULT                                | 0     |
| RECIPIENT_ADD                          | 1     |
| RECIPIENT_REMOVE                       | 2     |
| CALL                                   | 3     |
| CHANNEL_NAME_CHANGE                    | 4     |
| CHANNEL_ICON_CHANGE                    | 5     |
| CHANNEL_PINNED_MESSAGE                 | 6     |
| GUILD_MEMBER_JOIN                      | 7     |
| USER_PREMIUM_GUILD_SUBSCRIPTION        | 8     |
| USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 | 9     |
| USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 | 10    |
| USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 | 11    |
| CHANNEL_FOLLOW_ADD                     | 12    |

###### Message Activity Structure

| Field     | Type    | Description                                                                                                        |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| type      | integer | [type of message activity](#DOCS_RESOURCES_CHANNEL/message-object-message-activity-types)                          |
| party_id? | string  | party_id from a [Rich Presence event](#DOCS_RICH_PRESENCE_HOW_TO/updating-presence-update-presence-payload-fields) |

###### Message Application Structure

| Field        | Type      | Description                   |
| ------------ | --------- | ----------------------------- |
| id           | snowflake | id of the application         |
| cover_image? | string    | id of the embed's image asset |
| description  | string    | application's description     |
| icon         | ?string   | id of the application's icon  |
| name         | string    | name of the application       |

###### Message Reference Structure

| Field       | Type      | Description                             |
| ----------- | --------- | --------------------------------------- |
| message_id? | snowflake | id of the originating message           |
| channel_id  | snowflake | id of the originating message's channel |
| guild_id?   | snowflake | id of the originating message's guild   |

###### Message Activity Types

| Type         | Value |
| ------------ | ----- |
| JOIN         | 1     |
| SPECTATE     | 2     |
| LISTEN       | 3     |
| JOIN_REQUEST | 5     |

###### Message Flags

| Flag            | Value  | Description                                                                       |
| --------------- | ------ | --------------------------------------------------------------------------------- |
| CROSSPOSTED     | 1 << 0 | this message has been published to subscribed channels (via Channel Following)    |
| IS_CROSSPOST    | 1 << 1 | this message originated from a message in another channel (via Channel Following) |
| SUPPRESS_EMBEDS | 1 << 2 | do not include any embeds when serializing this message                           |

###### Example Message

```json
{
  "reactions": [
    {
      "count": 1,
      "me": false,
      "emoji": {
        "id": null,
        "name": "🔥"
      }
    }
  ],
  "attachments": [],
  "tts": false,
  "embeds": [],
  "timestamp": "2017-07-11T17:27:07.299000+00:00",
  "mention_everyone": false,
  "id": "334385199974967042",
  "pinned": false,
  "edited_timestamp": null,
  "author": {
    "username": "Mason",
    "discriminator": "9999",
    "id": "53908099506183680",
    "avatar": "a_bab14f271d565501444b2ca3be944b25"
  },
  "mention_roles": [],
  "content": "Supa Hot",
  "channel_id": "290926798999357250",
  "mentions": [],
  "type": 0
}
```

###### Example Crossposted Message

```json
{
  "reactions": [
    {
      "count": 1,
      "me": false,
      "emoji": {
        "id": null,
        "name": "🔥"
      }
    }
  ],
  "attachments": [],
  "tts": false,
  "embeds": [],
  "timestamp": "2017-07-11T17:27:07.299000+00:00",
  "mention_everyone": false,
  "id": "334385199974967042",
  "pinned": false,
  "edited_timestamp": null,
  "author": {
    "username": "Mason",
    "discriminator": "9999",
    "id": "53908099506183680",
    "avatar": "a_bab14f271d565501444b2ca3be944b25"
  },
  "mention_roles": [],
  "mention_channels": [
    {
      "id": "278325129692446722",
      "guild_id": "278325129692446720",
      "name": "big-news",
      "type": 5
    }
  ],
  "content": "Big news! In this <#278325129692446722> channel!",
  "channel_id": "290926798999357250",
  "mentions": [],
  "type": 0,
  "flags": 2,
  "message_reference": {
    "channel_id": "278325129692446722",
    "guild_id": "278325129692446720",
    "message_id": "306588351130107906"
  }
}
```

### Reaction Object

###### Reaction Structure

| Field | Type                                                       | Description                                       |
| ----- | ---------------------------------------------------------- | ------------------------------------------------- |
| count | integer                                                    | times this emoji has been used to react           |
| me    | boolean                                                    | whether the current user reacted using this emoji |
| emoji | partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object | emoji information                                 |

### Overwrite Object

###### Overwrite Structure

| Field | Type      | Description               |
| ----- | --------- | ------------------------- |
| id    | snowflake | role or user id           |
| type  | string    | either "role" or "member" |
| allow | integer   | permission bit set        |
| deny  | integer   | permission bit set        |

### Embed Object

###### Embed Structure

| Field        | Type                                                                                       | Description                                      |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| title?       | string                                                                                     | title of embed                                   |
| type?        | string                                                                                     | type of embed (always "rich" for webhook embeds) |
| description? | string                                                                                     | description of embed                             |
| url?         | string                                                                                     | url of embed                                     |
| timestamp?   | ISO8601 timestamp                                                                          | timestamp of embed content                       |
| color?       | integer                                                                                    | color code of the embed                          |
| footer?      | [embed footer](#DOCS_RESOURCES_CHANNEL/embed-object-embed-footer-structure) object         | footer information                               |
| image?       | [embed image](#DOCS_RESOURCES_CHANNEL/embed-object-embed-image-structure) object           | image information                                |
| thumbnail?   | [embed thumbnail](#DOCS_RESOURCES_CHANNEL/embed-object-embed-thumbnail-structure) object   | thumbnail information                            |
| video?       | [embed video](#DOCS_RESOURCES_CHANNEL/embed-object-embed-video-structure) object           | video information                                |
| provider?    | [embed provider](#DOCS_RESOURCES_CHANNEL/embed-object-embed-provider-structure) object     | provider information                             |
| author?      | [embed author](#DOCS_RESOURCES_CHANNEL/embed-object-embed-author-structure) object         | author information                               |
| fields?      | array of [embed field](#DOCS_RESOURCES_CHANNEL/embed-object-embed-field-structure) objects | fields information                               |

###### Embed Thumbnail Structure

| Field      | Type    | Description                                                     |
| ---------- | ------- | --------------------------------------------------------------- |
| url?       | string  | source url of thumbnail (only supports http(s) and attachments) |
| proxy_url? | string  | a proxied url of the thumbnail                                  |
| height?    | integer | height of thumbnail                                             |
| width?     | integer | width of thumbnail                                              |

###### Embed Video Structure

| Field   | Type    | Description         |
| ------- | ------- | ------------------- |
| url?    | string  | source url of video |
| height? | integer | height of video     |
| width?  | integer | width of video      |

###### Embed Image Structure

| Field      | Type    | Description                                                 |
| ---------- | ------- | ----------------------------------------------------------- |
| url?       | string  | source url of image (only supports http(s) and attachments) |
| proxy_url? | string  | a proxied url of the image                                  |
| height?    | integer | height of image                                             |
| width?     | integer | width of image                                              |

###### Embed Provider Structure

| Field | Type   | Description      |
| ----- | ------ | ---------------- |
| name? | string | name of provider |
| url?  | string | url of provider  |

###### Embed Author Structure

| Field           | Type   | Description                                                |
| --------------- | ------ | ---------------------------------------------------------- |
| name?           | string | name of author                                             |
| url?            | string | url of author                                              |
| icon_url?       | string | url of author icon (only supports http(s) and attachments) |
| proxy_icon_url? | string | a proxied url of author icon                               |

###### Embed Footer Structure

| Field           | Type   | Description                                                |
| --------------- | ------ | ---------------------------------------------------------- |
| text            | string | footer text                                                |
| icon_url?       | string | url of footer icon (only supports http(s) and attachments) |
| proxy_icon_url? | string | a proxied url of footer icon                               |

###### Embed Field Structure

| Field   | Type    | Description                                     |
| ------- | ------- | ----------------------------------------------- |
| name    | string  | name of the field                               |
| value   | string  | value of the field                              |
| inline? | boolean | whether or not this field should display inline |

### Attachment Object

###### Attachment Structure

| Field     | Type      | Description               |
| --------- | --------- | ------------------------- |
| id        | snowflake | attachment id             |
| filename  | string    | name of file attached     |
| size      | integer   | size of file in bytes     |
| url       | string    | source url of file        |
| proxy_url | string    | a proxied url of file     |
| height    | ?integer  | height of file (if image) |
| width     | ?integer  | width of file (if image)  |

### Channel Mention Object

###### Channel Mention Structure

| Field    | Type      | Description                                                                 |
| -------- | --------- | --------------------------------------------------------------------------- |
| id       | snowflake | id of the channel                                                           |
| guild_id | snowflake | id of the guild containing the channel                                      |
| type     | integer   | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) |
| name     | string    | the name of the channel                                                     |

=======

## Embed Limits

To facilitate showing rich content, rich embeds do not follow the traditional limits of message content. However, some limits are still in place to prevent excessively large embeds. The following table describes the limits:

###### Limits

| Field                                                                      | Limit                                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| title                                                                      | 256 characters                                                                       |
| description                                                                | 2048 characters                                                                      |
| fields                                                                     | Up to 25 [field](#DOCS_RESOURCES_CHANNEL/embed-object-embed-field-structure) objects |
| [field.name](#DOCS_RESOURCES_CHANNEL/embed-object-embed-field-structure)   | 256 characters                                                                       |
| [field.value](#DOCS_RESOURCES_CHANNEL/embed-object-embed-field-structure)  | 1024 characters                                                                      |
| [footer.text](#DOCS_RESOURCES_CHANNEL/embed-object-embed-footer-structure) | 2048 characters                                                                      |
| [author.name](#DOCS_RESOURCES_CHANNEL/embed-object-embed-author-structure) | 256 characters                                                                       |

In addition to the limits above, the sum of all characters in an embed structure must not exceed 6000 characters.

## Get Channel % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Get a channel by ID. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.

## Modify Channel % PUT/PATCH /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Update a channel's settings. Requires the `MANAGE_CHANNELS` permission for the guild. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway event. If modifying a category, individual [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) events will fire for each child channel that also changes. For the **PATCH** method, all the JSON Params are optional.

###### JSON Params

| Field                 | Type                                                                   | Description                                                                                                                                                                     | Channel Type |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| name                  | string                                                                 | 2-100 character channel name                                                                                                                                                    | All          |
| position              | integer                                                                | the position of the channel in the left-hand listing                                                                                                                            | All          |
| topic                 | string                                                                 | 0-1024 character channel topic                                                                                                                                                  | Text         |
| nsfw                  | boolean                                                                | whether the channel is nsfw                                                                                                                                                     | Text         |
| rate_limit_per_user   | integer                                                                | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected | Text         |
| bitrate               | integer                                                                | the bitrate (in bits) of the voice channel; 8000 to 96000 (128000 for VIP servers)                                                                                              | Voice        |
| user_limit            | integer                                                                | the user limit of the voice channel; 0 refers to no limit, 1 to 99 refers to a user limit                                                                                       | Voice        |
| permission_overwrites | array of [overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object) objects | channel or category-specific permissions                                                                                                                                        | All          |
| parent_id             | snowflake                                                              | id of the new parent category for a channel                                                                                                                                     | Text, Voice  |

## Delete/Close Channel % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}

Delete a channel, or close a private message. Requires the `MANAGE_CHANNELS` permission for the guild. Deleting a category does not delete its child channels; they will have their `parent_id` removed and a [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway event will fire for each of them. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Delete](#DOCS_TOPICS_GATEWAY/channel-delete) Gateway event.

> warn
> Deleting a guild channel cannot be undone. Use this with caution, as it is impossible to undo this action when performed on a guild channel. In contrast, when used with a private message, it is possible to undo the action by opening a private message with the recipient again.

## Get Channel Messages % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages

Returns the messages for a channel. If operating on a guild channel, this endpoint requires the `VIEW_CHANNEL` permission to be present on the current user. If the current user is missing the 'READ_MESSAGE_HISTORY' permission in the channel then this will return no messages (since they cannot read the message history). Returns an array of [message](#DOCS_RESOURCES_CHANNEL/message-object) objects on success.

> info
> The before, after, and around keys are mutually exclusive, only one may be passed at a time.

###### Query String Params

| Field  | Type      | Description                              | Required | Default |
| ------ | --------- | ---------------------------------------- | -------- | ------- |
| around | snowflake | get messages around this message ID      | false    | absent  |
| before | snowflake | get messages before this message ID      | false    | absent  |
| after  | snowflake | get messages after this message ID       | false    | absent  |
| limit  | integer   | max number of messages to return (1-100) | false    | 50      |

## Get Channel Message % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Returns a specific message in the channel. If operating on a guild channel, this endpoint requires the 'READ_MESSAGE_HISTORY' permission to be present on the current user. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object on success.

## Create Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages

> warn
> Before using this endpoint, you must connect to and identify with a [gateway](#DOCS_TOPICS_GATEWAY/gateways) at least once.

Post a message to a guild text or DM channel. If operating on a guild channel, this endpoint requires the `SEND_MESSAGES` permission to be present on the current user. If the `tts` field is set to `true`, the `SEND_TTS_MESSAGES` permission is required for the message to be spoken. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object. Fires a [Message Create](#DOCS_TOPICS_GATEWAY/message-create) Gateway event. See [message formatting](#DOCS_REFERENCE/message-formatting) for more information on how to properly format messages.

The maximum request size when sending a message is 8MB.

This endpoint supports requests with `Content-Type`s of both `application/json` and `multipart/form-data`. You must however use `multipart/form-data` when uploading files. Note that when sending `multipart/form-data` requests the `embed` field cannot be used, however you can pass a JSON encoded body as form value for `payload_json`, where additional request parameters such as `embed` can be set.

> info
> Note that when sending `application/json` you must send at least one of `content` or `embed`, and when sending `multipart/form-data`, you must send at least one of `content`, `embed` or `file`. For a `file` attachment, the `Content-Disposition` subpart header MUST contain a `filename` parameter.

###### Params

| Field        | Type                                                 | Description                                             |
| ------------ | ---------------------------------------------------- | ------------------------------------------------------- |
| content      | string                                               | the message contents (up to 2000 characters)            |
| nonce        | snowflake                                            | a nonce that can be used for optimistic message sending |
| tts          | boolean                                              | true if this is a TTS message                           |
| file         | file contents                                        | the contents of the file being sent                     |
| embed        | [embed](#DOCS_RESOURCES_CHANNEL/embed-object) object | embedded `rich` content                                 |
| payload_json | string                                               | JSON encoded body of any additional request fields.     |

> info
> For the embed object, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.

###### Example Request Body (application/json)

```json
{
  "content": "Hello, World!",
  "tts": false,
  "embed": {
    "title": "Hello, Embed!",
    "description": "This is an embedded message."
  }
}
```

###### Example Request Bodies (multipart/form-data)

| Field Name   | Form Value                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| payload_json | `"content": "Hello, World!", "tts": false, "embed": { "title": "Hello, Embed!", "description": "This is an embedded message." }` |
| file         | file contents                                                                                                                    |

| Field Name | Form Value    |
| ---------- | ------------- |
| content    | Hello, World! |
| tts        | false         |
| file       | file contents |

> warn
> When sending `payload_json` in multipart requests, fields except for `file` are ignored.

###### Using Attachments within Embeds

You can upload attachments when creating a message and use those attachments within your embed. To do this, you will want to upload files as part of your `multipart/form-data` body. Make sure that you're uploading files that contain a filename, as you will need a filename to reference against.

In the embed object, you can then set an image to use an attachment as its url with our attachment scheme syntax: `attachment://filename.png`

For example:

```json
{
  "embed": {
    "image": {
      "url": "attachment://screenshot.png"
    }
  }
}
```

> warn
> Only filenames with proper image extensions are supported for the time being.

## Create Reaction % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/@me

Create a reaction for the message. `emoji` takes the form of `name:id` for custom guild emoji, or Unicode characters. This endpoint requires the 'READ_MESSAGE_HISTORY' permission to be present on the current user. Additionally, if nobody else has reacted to the message using this emoji, this endpoint requires the 'ADD_REACTIONS' permission to be present on the current user. Returns a 204 empty response on success.

## Delete Own Reaction % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/@me

Delete a reaction the current user has made for the message. Returns a 204 empty response on success.

## Delete User Reaction % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/{user.id#DOCS_RESOURCES_USER/user-object}

Deletes another user's reaction. This endpoint requires the 'MANAGE_MESSAGES' permission to be present on the current user. Returns a 204 empty response on success.

## Get Reactions % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}

Get a list of users that reacted with this emoji. Returns an array of [user](#DOCS_RESOURCES_USER/user-object) objects on success.

###### Query String Params

| Field  | Type      | Description                           | Required | Default |
| ------ | --------- | ------------------------------------- | -------- | ------- |
| before | snowflake | get users before this user ID         | false    | absent  |
| after  | snowflake | get users after this user ID          | false    | absent  |
| limit  | integer   | max number of users to return (1-100) | false    | 25      |

## Delete All Reactions % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}/reactions

Deletes all reactions on a message. This endpoint requires the 'MANAGE_MESSAGES' permission to be present on the current user.

## Edit Message % PATCH /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Edit a previously sent message. You can only edit messages that have been sent by the current user. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object. Fires a [Message Update](#DOCS_TOPICS_GATEWAY/message-update) Gateway event.

> info
> All parameters to this endpoint are optional.

###### JSON Params

| Field   | Type                                                 | Description                                      |
| ------- | ---------------------------------------------------- | ------------------------------------------------ |
| content | string                                               | the new message contents (up to 2000 characters) |
| embed   | [embed](#DOCS_RESOURCES_CHANNEL/embed-object) object | embedded `rich` content                          |

## Delete Message % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Delete a message. If operating on a guild channel and trying to delete a message that was not sent by the current user, this endpoint requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete](#DOCS_TOPICS_GATEWAY/message-delete) Gateway event.

## Bulk Delete Messages % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/bulk-delete

Delete multiple messages in a single request. This endpoint can only be used on guild channels and requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete Bulk](#DOCS_TOPICS_GATEWAY/message-delete-bulk) Gateway event.

Any message IDs given that do not exist or are invalid will count towards the minimum and maximum message count (currently 2 and 100 respectively). Additionally, duplicated IDs will only be counted once.

> warn
> This endpoint will not delete messages older than 2 weeks, and will fail if any message provided is older than that.

###### JSON Params

| Field    | Type                | Description                               |
| -------- | ------------------- | ----------------------------------------- |
| messages | array of snowflakes | an array of message ids to delete (2-100) |

## Bulk Delete Messages (deprecated) % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/bulk_delete

Same as above, but this endpoint is deprecated.

## Edit Channel Permissions % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/permissions/{overwrite.id#DOCS_RESOURCES_CHANNEL/overwrite-object}

Edit the channel permission overwrites for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions).

###### JSON Params

| Field | Type    | Description                                     |
| ----- | ------- | ----------------------------------------------- |
| allow | integer | the bitwise value of all allowed permissions    |
| deny  | integer | the bitwise value of all disallowed permissions |
| type  | string  | "member" for a user or "role" for a role        |

## Get Channel Invites % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/invites

Returns a list of [invite](#DOCS_RESOURCES_INVITE/invite-object) objects (with [invite metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)) for the channel. Only usable for guild channels. Requires the `MANAGE_CHANNELS` permission.

## Create Channel Invite % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/invites

Create a new [invite](#DOCS_RESOURCES_INVITE/invite-object) object for the channel. Only usable for guild channels. Requires the `CREATE_INSTANT_INVITE` permission. All JSON parameters for this route are optional, however the request body is not. If you are not sending any fields, you still have to send an empty JSON object (`{}`). Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object.

###### JSON Params

| Field     | Type    | Description                                                                                         | Default          |
| --------- | ------- | --------------------------------------------------------------------------------------------------- | ---------------- |
| max_age   | integer | duration of invite in seconds before expiry, or 0 for never                                         | 86400 (24 hours) |
| max_uses  | integer | max number of uses or 0 for unlimited                                                               | 0                |
| temporary | boolean | whether this invite only grants temporary membership                                                | false            |
| unique    | boolean | if true, don't try to reuse a similar invite (useful for creating many unique one time use invites) | false            |

## Delete Channel Permission % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/permissions/{overwrite.id#DOCS_RESOURCES_CHANNEL/overwrite-object}

Delete a channel permission overwrite for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions)

## Trigger Typing Indicator % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/typing

Post a typing indicator for the specified channel. Generally bots should **not** implement this route. However, if a bot is responding to a command and expects the computation to take a few seconds, this endpoint may be called to let the user know that the bot is processing their message. Returns a 204 empty response on success. Fires a [Typing Start](#DOCS_TOPICS_GATEWAY/typing-start) Gateway event.

## Get Pinned Messages % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins

Returns all pinned messages in the channel as an array of [message](#DOCS_RESOURCES_CHANNEL/message-object) objects.

## Add Pinned Channel Message % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Pin a message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success.

> warn
> The max pinned messages is 50.

## Delete Pinned Channel Message % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/pins/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Delete a pinned message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success.

## Group DM Add Recipient % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/recipients/{user.id#DOCS_RESOURCES_USER/user-object}

Adds a recipient to a Group DM using their access token

###### JSON Params

| Field        | Type   | Description                                                           |
| ------------ | ------ | --------------------------------------------------------------------- |
| access_token | string | access token of a user that has granted your app the `gdm.join` scope |
| nick         | string | nickname of the user being added                                      |

## Group DM Remove Recipient % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/recipients/{user.id#DOCS_RESOURCES_USER/user-object}

Removes a recipient from a Group DM
