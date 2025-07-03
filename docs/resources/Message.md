---
sidebar_label: Message
---

# Messages Resource

### Message Object

Represents a message sent in a channel within Discord.

###### Message Structure

> info
> Fields specific to the `MESSAGE_CREATE` and `MESSAGE_UPDATE` events are listed in the [Gateway documentation](#DOCS_TOPICS_GATEWAY_EVENTS/message-create).

> warn
> An app will receive empty values in the `content`, `embeds`, `attachments`, and `components` fields while `poll` will be omitted if they have not configured (or been approved for) the [`MESSAGE_CONTENT` privileged intent (`1 << 15`)](#DOCS_TOPICS_GATEWAY/message-content-intent).

| Field                     | Type                                                                                                                                      | Description                                                                                                                                                                                                                                                             |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                        | snowflake                                                                                                                                 | id of the message                                                                                                                                                                                                                                                       |
| channel_id                | snowflake                                                                                                                                 | id of the channel the message was sent in                                                                                                                                                                                                                               |
| author \[1\]              | [user](#DOCS_RESOURCES_USER/user-object) object                                                                                           | the author of this message (not guaranteed to be a valid user, see below)                                                                                                                                                                                               |
| content \[2\]             | string                                                                                                                                    | contents of the message                                                                                                                                                                                                                                                 |
| timestamp                 | ISO8601 timestamp                                                                                                                         | when this message was sent                                                                                                                                                                                                                                              |
| edited_timestamp          | ?ISO8601 timestamp                                                                                                                        | when this message was edited (or null if never)                                                                                                                                                                                                                         |
| tts                       | boolean                                                                                                                                   | whether this was a TTS message                                                                                                                                                                                                                                          |
| mention_everyone          | boolean                                                                                                                                   | whether this message mentions everyone                                                                                                                                                                                                                                  |
| mentions                  | array of [user](#DOCS_RESOURCES_USER/user-object) objects                                                                                 | users specifically mentioned in the message                                                                                                                                                                                                                             |
| mention_roles             | array of [role](#DOCS_TOPICS_PERMISSIONS/role-object) object ids                                                                          | roles specifically mentioned in this message                                                                                                                                                                                                                            |
| mention_channels? \[3\]   | array of [channel mention](#DOCS_RESOURCES_MESSAGE/channel-mention-object) objects                                                        | channels specifically mentioned in this message                                                                                                                                                                                                                         |
| attachments \[2\]         | array of [attachment](#DOCS_RESOURCES_MESSAGE/attachment-object) objects                                                                  | any attached files                                                                                                                                                                                                                                                      |
| embeds \[2\]              | array of [embed](#DOCS_RESOURCES_MESSAGE/embed-object) objects                                                                            | any embedded content                                                                                                                                                                                                                                                    |
| reactions?                | array of [reaction](#DOCS_RESOURCES_MESSAGE/reaction-object) objects                                                                      | reactions to the message                                                                                                                                                                                                                                                |
| nonce?                    | integer or string                                                                                                                         | used for validating a message was sent                                                                                                                                                                                                                                  |
| pinned                    | boolean                                                                                                                                   | whether this message is pinned                                                                                                                                                                                                                                          |
| webhook_id?               | snowflake                                                                                                                                 | if the message is generated by a webhook, this is the webhook's id                                                                                                                                                                                                      |
| type                      | integer                                                                                                                                   | [type of message](#DOCS_RESOURCES_MESSAGE/message-object-message-types)                                                                                                                                                                                                 |
| activity?                 | [message activity](#DOCS_RESOURCES_MESSAGE/message-object-message-activity-structure) object                                              | sent with Rich Presence-related chat embeds                                                                                                                                                                                                                             |
| application?              | partial [application](#DOCS_RESOURCES_APPLICATION/application-object) object                                                              | sent with Rich Presence-related chat embeds                                                                                                                                                                                                                             |
| application_id?           | snowflake                                                                                                                                 | if the message is an [Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/) or application-owned webhook, this is the id of the application                                                                                                                        |
| flags?                    | integer                                                                                                                                   | [message flags](#DOCS_RESOURCES_MESSAGE/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field)                                                                                                                                 |
| message_reference?        | [message reference](#DOCS_RESOURCES_MESSAGE/message-reference-structure) object                                                           | data showing the source of a crosspost, channel follow add, pin, or reply message                                                                                                                                                                                       |
| message_snapshots? \[5\]  | array of [message snapshot](#DOCS_RESOURCES_MESSAGE/message-snapshot-object) objects                                                      | the message associated with the `message_reference`. This is a minimal subset of fields in a message (e.g. `author` is excluded.)                                                                                                                                       |
| referenced_message? \[4\] | ?[message object](#DOCS_RESOURCES_MESSAGE/message-object)                                                                                 | the message associated with the message_reference                                                                                                                                                                                                                       |
| interaction_metadata?     | [message interaction metadata object](#DOCS_RESOURCES_MESSAGE/message-interaction-metadata-object-message-interaction-metadata-structure) | [In preview](#DOCS_CHANGE_LOG/user-installable-apps-preview). Sent if the message is sent as a result of an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/)                                                                                                 |
| interaction?              | [message interaction object](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/message-interaction-object-message-interaction-structure)        | **Deprecated in favor of `interaction_metadata`**; sent if the message is a response to an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/)                                                                                                                  |
| thread?                   | [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object                                                                                  | the thread that was started from this message, includes [thread member](#DOCS_RESOURCES_CHANNEL/thread-member-object) object                                                                                                                                            |
| components? \[2\]         | array of [message components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object)                                                     | sent if the message contains components like buttons, action rows, or other interactive components                                                                                                                                                                      |
| sticker_items?            | array of [message sticker item objects](#DOCS_RESOURCES_STICKER/sticker-item-object)                                                      | sent if the message contains stickers                                                                                                                                                                                                                                   |
| stickers?                 | array of [sticker](#DOCS_RESOURCES_STICKER/sticker-object) objects                                                                        | **Deprecated** the stickers sent with the message                                                                                                                                                                                                                       |
| position?                 | integer                                                                                                                                   | A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with `total_message_sent` on parent thread |
| role_subscription_data?   | [role subscription data](#DOCS_RESOURCES_MESSAGE/role-subscription-data-object) object                                                    | data of the role subscription purchase or renewal that prompted this ROLE_SUBSCRIPTION_PURCHASE message                                                                                                                                                                 |
| resolved?                 | [resolved](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-resolved-data-structure) data                                   | data for users, members, channels, and roles in the message's [auto-populated select menus](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menus)                                                                                                                         |
| poll? \[2\]               | [poll](#DOCS_RESOURCES_POLL/poll-object) object                                                                                           | A poll!                                                                                                                                                                                                                                                                 |
| call?                     | [message call](#DOCS_RESOURCES_MESSAGE/message-call-object) object                                                                        | the call associated with the message                                                                                                                                                                                                                                    |

\[1\] The author object follows the structure of the user object, but is only a valid user in the case where the message is generated by a user or bot user. If the message is generated by a webhook, the author object corresponds to the webhook's id, username, and avatar. You can tell if a message is generated by a webhook by checking for the `webhook_id` on the message object.

\[2\] An app will receive empty values in the `content`, `embeds`, `attachments`, and `components` fields while `poll` will be omitted if they have not configured (or been approved for) the [`MESSAGE_CONTENT` privileged intent (`1 << 15`)](#DOCS_TOPICS_GATEWAY/message-content-intent).

\[3\] Not all channel mentions in a message will appear in `mention_channels`. Only textual channels that are visible to everyone in a lurkable guild will ever be included. Only crossposted messages (via Channel Following) currently include `mention_channels` at all. If no mentions in the message meet these requirements, this field will not be sent.

\[4\] This field is only returned for messages with a `type` of `19` (REPLY) or `21` (THREAD_STARTER_MESSAGE). If the message is a reply but the `referenced_message` field is not present, the backend did not attempt to fetch the message that was being replied to, so its state is unknown. If the field exists but is null, the referenced message was deleted.

\[5\] See [message reference types](#DOCS_RESOURCES_MESSAGE/message-reference-types)

###### Message Types

> warn
> Type `19` and `20` are only available in API v8 and above. In v6, they are represented as type `0`.  Additionally, type `21` is only available in API v9 and above.

| Type                                         | Value | Deletable |
|----------------------------------------------|-------|-----------|
| DEFAULT                                      | 0     | true      |
| RECIPIENT_ADD                                | 1     | false     |
| RECIPIENT_REMOVE                             | 2     | false     |
| CALL                                         | 3     | false     |
| CHANNEL_NAME_CHANGE                          | 4     | false     |
| CHANNEL_ICON_CHANGE                          | 5     | false     |
| CHANNEL_PINNED_MESSAGE                       | 6     | true      |
| USER_JOIN                                    | 7     | true      |
| GUILD_BOOST                                  | 8     | true      |
| GUILD_BOOST_TIER_1                           | 9     | true      |
| GUILD_BOOST_TIER_2                           | 10    | true      |
| GUILD_BOOST_TIER_3                           | 11    | true      |
| CHANNEL_FOLLOW_ADD                           | 12    | true      |
| GUILD_DISCOVERY_DISQUALIFIED                 | 14    | true      |
| GUILD_DISCOVERY_REQUALIFIED                  | 15    | true      |
| GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING | 16    | true      |
| GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING   | 17    | true      |
| THREAD_CREATED                               | 18    | true      |
| REPLY                                        | 19    | true      |
| CHAT_INPUT_COMMAND                           | 20    | true      |
| THREAD_STARTER_MESSAGE                       | 21    | false     |
| GUILD_INVITE_REMINDER                        | 22    | true      |
| CONTEXT_MENU_COMMAND                         | 23    | true      |
| AUTO_MODERATION_ACTION                       | 24    | true*     |
| ROLE_SUBSCRIPTION_PURCHASE                   | 25    | true      |
| INTERACTION_PREMIUM_UPSELL                   | 26    | true      |
| STAGE_START                                  | 27    | true      |
| STAGE_END                                    | 28    | true      |
| STAGE_SPEAKER                                | 29    | true      |
| STAGE_TOPIC                                  | 31    | true      |
| GUILD_APPLICATION_PREMIUM_SUBSCRIPTION       | 32    | true      |
| GUILD_INCIDENT_ALERT_MODE_ENABLED            | 36    | true      |
| GUILD_INCIDENT_ALERT_MODE_DISABLED           | 37    | true      |
| GUILD_INCIDENT_REPORT_RAID                   | 38    | true      |
| GUILD_INCIDENT_REPORT_FALSE_ALARM            | 39    | true      |
| PURCHASE_NOTIFICATION                        | 44    | true      |
| POLL_RESULT                                  | 46    | true      |

\* Can only be deleted by members with `MANAGE_MESSAGES` permission

###### Message Activity Structure

| Field     | Type    | Description                                                                               |
|-----------|---------|-------------------------------------------------------------------------------------------|
| type      | integer | [type of message activity](#DOCS_RESOURCES_MESSAGE/message-object-message-activity-types) |
| party_id? | string  | party_id from a Rich Presence event                                                       |

###### Message Activity Types

| Type         | Value |
|--------------|-------|
| JOIN         | 1     |
| SPECTATE     | 2     |
| LISTEN       | 3     |
| JOIN_REQUEST | 5     |

###### Message Flags

| Flag                                   | Value     | Description                                                                       |
|----------------------------------------|-----------|-----------------------------------------------------------------------------------|
| CROSSPOSTED                            | `1 << 0`  | this message has been published to subscribed channels (via Channel Following)    |
| IS_CROSSPOST                           | `1 << 1`  | this message originated from a message in another channel (via Channel Following) |
| SUPPRESS_EMBEDS                        | `1 << 2`  | do not include any embeds when serializing this message                           |
| SOURCE_MESSAGE_DELETED                 | `1 << 3`  | the source message for this crosspost has been deleted (via Channel Following)    |
| URGENT                                 | `1 << 4`  | this message came from the urgent message system                                  |
| HAS_THREAD                             | `1 << 5`  | this message has an associated thread, with the same id as the message            |
| EPHEMERAL                              | `1 << 6`  | this message is only visible to the user who invoked the Interaction              |
| LOADING                                | `1 << 7`  | this message is an Interaction Response and the bot is "thinking"                 |
| FAILED_TO_MENTION_SOME_ROLES_IN_THREAD | `1 << 8`  | this message failed to mention some roles and add their members to the thread     |
| SUPPRESS_NOTIFICATIONS                 | `1 << 12` | this message will not trigger push and desktop notifications                      |
| IS_VOICE_MESSAGE                       | `1 << 13` | this message is a voice message                                                   |

###### Example Message

```json
{
  "reactions": [
    {
      "count": 1,
      "count_details": {
         "burst": 0,
         "normal": 1
      },
      "me": false,
      "me_burst": false,
      "emoji": {
         "id": null,
         "name": "🔥"
      },
      "burst_colors": []
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
      "count_details": {
         "burst": 0,
         "normal": 1
      },
      "me": false,
      "me_burst": false,
      "emoji": {
         "id": null,
         "name": "🔥"
      },
      "burst_colors": []
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
    "type": 0,
    "channel_id": "278325129692446722",
    "guild_id": "278325129692446720",
    "message_id": "306588351130107906"
  }
}
```

### Message Interaction Metadata Object

Metadata about the interaction, including the source of the interaction and relevant server and user IDs.

###### Message Interaction Metadata Structure

| Field                            | Type                                                                                                                                  | Description                                                                                                                                                                                                         |
|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                               | snowflake                                                                                                                             | ID of the interaction                                                                                                                                                                                               |
| type                             | [interaction type](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-type)                                   | Type of interaction                                                                                                                                                                                                 |
| user                             | [user object](#DOCS_RESOURCES_USER/user-object)                                                                                       | User who triggered the interaction                                                                                                                                                                                  |
| authorizing_integration_owners   | dictionary with keys of [application integration types](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-types) | IDs for installation context(s) related to an interaction. Details in [Authorizing Integration Owners Object](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-authorizing-integration-owners-object) |
| original_response_message_id?    | snowflake                                                                                                                             | ID of the original response message, present only on [follow-up messages](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/)                                                                                             |
| interacted_message_id?           | snowflake                                                                                                                             | ID of the message that contained interactive component, present only on messages created from component interactions                                                                                                |
| triggering_interaction_metadata? | Message Interaction Metadata Structure                                                                                                | Metadata for the interaction that was used to open the modal, present only on modal submit interactions                                                                                                             |

### Message Call Object

Information about the call in a private channel.

###### Message Call Object Structure

| Field            | Type                | Description                                                                                |
|------------------|---------------------|--------------------------------------------------------------------------------------------|
| participants     | array of snowflakes | array of [user](#DOCS_RESOURCES_USER/user-object) object ids that participated in the call |
| ended_timestamp? | ?ISO8601 timestamp  | time when call ended                                                                       |

### Message Reference Object

#### Message Reference Structure

| Field               | Type      | Description                                                                                                                             |
|---------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------|
| type? \*            | integer   | [type of reference](#DOCS_RESOURCES_MESSAGE/message-reference-types).                                                                   |
| message_id?         | snowflake | id of the originating message                                                                                                           |
| channel_id? \*\*    | snowflake | id of the originating message's channel                                                                                                 |
| guild_id?           | snowflake | id of the originating message's guild                                                                                                   |
| fail_if_not_exists? | boolean   | when sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true |

\* If `type` is unset, `DEFAULT` can be assumed in order to match the behaviour before message reference had types.
In future API versions this will become a required field.

\*\* `channel_id` is optional when creating a reply, but will always be present when receiving an event/response that includes this data model. **Required for forwards.**

#### Message Reference Types

Determines how associated data is populated.

| Type    | Value | Coupled Message Field | Description                                              |
|---------|-------|-----------------------|----------------------------------------------------------|
| DEFAULT | 0     | `referenced_message`  | A standard reference used by replies.                    |
| FORWARD | 1     | `message_snapshot`    | Reference used to point to a message at a point in time. |

`FORWARD` can only be used for basic messages; i.e. messages which do not have strong bindings to a non global entity.
Thus we support only messages with `DEFAULT` or `REPLY` types, but disallowed if there are any polls, calls, or components.
This is subject to change in the future.

#### Message Reference Content Attribution

Message references are generic attribution on a message.
There are multiple message types that have a `message_reference` object.

###### Crosspost messages

- These are messages that originated from another channel (IS_CROSSPOST flag).
- These messages have all three fields, which point to the original message that was crossposted.

###### Channel Follow Add messages

- These are automatic messages sent when a channel is followed into the current channel (type 12).
- These messages have the `channel_id` and `guild_id` fields, which point to the followed announcement channel.

###### Pin messages

- These are automatic messages sent when a message is pinned (type 6).
- These messages have `message_id` and `channel_id`, and `guild_id` if it is in a guild, which point to the message that was pinned.

###### Forwards

- These are messages which capture a snapshot of a message.
- These messages have an array of [`message_snapshot`](#DOCS_RESOURCES_MESSAGE/message-snapshot-object) objects containing a copy of the original message. This copy follows the same structure as a message, but has only the minimal set of fields returned required for context/rendering.
  - of note: `author` will be excluded
- A forwarded message can be identified by looking at its `message_reference.type` field
  - `message_snapshots` will be the message data associated with the forward. Currently we support only 1 snapshot.
  - prevents spoofing forwarded data
  - `message_snapshots` are taken the moment a forward message is created, and are **immutable**; any mutations to the original message will not be propagated.
- Forwards are created by including a message_reference with `FORWARD` type when sending a message.
  - Required fields: `type`, `message_id`, `channel_id`
  - the requestor must have `VIEW_CHANNEL` permissions

###### Replies

- These are messages replying to a previous message (type 19).
- These messages have `message_id` and `channel_id`, and `guild_id` if it is in a guild, which point to the message that was replied to. The channel_id and guild_id will be the same as the reply.
- Replies are created by including a message_reference when sending a message. When sending, only `message_id` is required.

###### Thread Created messages

- These are automatic messages sent when a public thread is created from an old message or without a message (type 18).
- These messages have the `channel_id` and `guild_id` fields, which point to the created thread channel.

###### Thread starter messages

- These are the first message in public threads created from messages. They point back to the message in the parent channel from which the thread was started. (type 21)
- These messages have `message_id`, `channel_id`, and `guild_id`.
- These messages will never have content, embeds, or attachments, mainly just the `message_reference` and `referenced_message` fields.

###### Poll result messages

- These are automatic messages sent after a poll has ended and the results have been finalized. (type 46)
- These messages have `message_id` and `channel_id`, which point to the original poll message. The `channel_id` will be the same as that of the poll.
- The author will be the same as the author of the poll and will be mentioned.
- These messages contain a [`poll_result` embed](#DOCS_RESOURCES_MESSAGE/embed-fields-by-embed-type-poll-result-embed-fields)

#### Voice Messages

Voice messages are messages with the `IS_VOICE_MESSAGE` flag. They have the following properties.

- They cannot be edited.
- Only a single audio attachment is allowed. No content, stickers, etc...
- The [attachment](#DOCS_RESOURCES_MESSAGE/attachment-object) has additional fields: `duration_secs` and `waveform`. The `Content-Type` of the attachment must begin with `audio/` to respect these fields.

The `waveform` is intended to be a preview of the entire voice message, with 1 byte per datapoint encoded in base64. Clients sample the recording at most
once per 100 milliseconds, but will downsample so that no more than 256 datapoints are in the waveform.

As of 2023-04-14, clients upload a 1 channel, 48000 Hz, 32kbps Opus stream in an OGG container.
The encoding, and the waveform details, are an implementation detail and may change without warning or documentation.


### Message Snapshot Object

#### Message Snapshot Structure

| Field     | Type                                                             | Description                                       |
|-----------|------------------------------------------------------------------|---------------------------------------------------|
| message\* | partial [message](#DOCS_RESOURCES_MESSAGE/message-object) object | minimal subset of fields in the forwarded message |

\* The current subset of message fields consists of:
`type`, `content`, `embeds`, `attachments`, `timestamp`, `edited_timestamp`, `flags`, `mentions`, `mention_roles`, `stickers`, `sticker_items`, and `components`.

> info
> While message snapshots are able to support nested snapshots, we currently limit the depth of nesting to 1.

### Reaction Object

###### Reaction Structure

| Field         | Type                                                       | Description                                                                            |
|---------------|------------------------------------------------------------|----------------------------------------------------------------------------------------|
| count         | integer                                                    | Total number of times this emoji has been used to react (including super reacts)       |
| count_details | object                                                     | [Reaction count details object](#DOCS_RESOURCES_MESSAGE/reaction-count-details-object) |
| me            | boolean                                                    | Whether the current user reacted using this emoji                                      |
| me_burst      | boolean                                                    | Whether the current user super-reacted using this emoji                                |
| emoji         | partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object | emoji information                                                                      |
| burst_colors  | array                                                      | HEX colors used for super reaction                                                     |

### Reaction Count Details Object

The reaction count details object contains a breakdown of normal and super reaction counts for the associated emoji.

###### Reaction Count Details Structure

| Field  | Type    | Description               |
|--------|---------|---------------------------|
| burst  | integer | Count of super reactions  |
| normal | integer | Count of normal reactions |

### Embed Object

###### Embed Structure

| Field        | Type                                                                                       | Description                                                                                          |
|--------------|--------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| title?       | string                                                                                     | title of embed                                                                                       |
| type?        | string                                                                                     | [type of embed](#DOCS_RESOURCES_MESSAGE/embed-object-embed-types) (always "rich" for webhook embeds) |
| description? | string                                                                                     | description of embed                                                                                 |
| url?         | string                                                                                     | url of embed                                                                                         |
| timestamp?   | ISO8601 timestamp                                                                          | timestamp of embed content                                                                           |
| color?       | integer                                                                                    | color code of the embed                                                                              |
| footer?      | [embed footer](#DOCS_RESOURCES_MESSAGE/embed-object-embed-footer-structure) object         | footer information                                                                                   |
| image?       | [embed image](#DOCS_RESOURCES_MESSAGE/embed-object-embed-image-structure) object           | image information                                                                                    |
| thumbnail?   | [embed thumbnail](#DOCS_RESOURCES_MESSAGE/embed-object-embed-thumbnail-structure) object   | thumbnail information                                                                                |
| video?       | [embed video](#DOCS_RESOURCES_MESSAGE/embed-object-embed-video-structure) object           | video information                                                                                    |
| provider?    | [embed provider](#DOCS_RESOURCES_MESSAGE/embed-object-embed-provider-structure) object     | provider information                                                                                 |
| author?      | [embed author](#DOCS_RESOURCES_MESSAGE/embed-object-embed-author-structure) object         | author information                                                                                   |
| fields?      | array of [embed field](#DOCS_RESOURCES_MESSAGE/embed-object-embed-field-structure) objects | fields information, max of 25                                                                        |

###### Embed Types

| Type        | Description                                                                                      |
|-------------|--------------------------------------------------------------------------------------------------|
| rich        | generic embed rendered from embed attributes                                                     |
| image       | image embed                                                                                      |
| video       | video embed                                                                                      |
| gifv        | animated gif image embed rendered as a video embed                                               |
| article     | article embed                                                                                    |
| link        | link embed                                                                                       |
| poll_result | [poll result embed](#DOCS_RESOURCES_MESSAGE/embed-fields-by-embed-type-poll-result-embed-fields) |

###### Embed Thumbnail Structure

| Field      | Type    | Description                                                     |
|------------|---------|-----------------------------------------------------------------|
| url        | string  | source url of thumbnail (only supports http(s) and attachments) |
| proxy_url? | string  | a proxied url of the thumbnail                                  |
| height?    | integer | height of thumbnail                                             |
| width?     | integer | width of thumbnail                                              |

###### Embed Video Structure

| Field      | Type    | Description                |
|------------|---------|----------------------------|
| url?       | string  | source url of video        |
| proxy_url? | string  | a proxied url of the video |
| height?    | integer | height of video            |
| width?     | integer | width of video             |

###### Embed Image Structure

| Field      | Type    | Description                                                 |
|------------|---------|-------------------------------------------------------------|
| url        | string  | source url of image (only supports http(s) and attachments) |
| proxy_url? | string  | a proxied url of the image                                  |
| height?    | integer | height of image                                             |
| width?     | integer | width of image                                              |

###### Embed Provider Structure

| Field | Type   | Description      |
|-------|--------|------------------|
| name? | string | name of provider |
| url?  | string | url of provider  |

###### Embed Author Structure

| Field           | Type   | Description                                                |
|-----------------|--------|------------------------------------------------------------|
| name            | string | name of author                                             |
| url?            | string | url of author (only supports http(s))                      |
| icon_url?       | string | url of author icon (only supports http(s) and attachments) |
| proxy_icon_url? | string | a proxied url of author icon                               |

###### Embed Footer Structure

| Field           | Type   | Description                                                |
|-----------------|--------|------------------------------------------------------------|
| text            | string | footer text                                                |
| icon_url?       | string | url of footer icon (only supports http(s) and attachments) |
| proxy_icon_url? | string | a proxied url of footer icon                               |

###### Embed Field Structure

| Field   | Type    | Description                                     |
|---------|---------|-------------------------------------------------|
| name    | string  | name of the field                               |
| value   | string  | value of the field                              |
| inline? | boolean | whether or not this field should display inline |

###### Embed Limits

To facilitate showing rich content, rich embeds do not follow the traditional limits of message content. However, some limits are still in place to prevent excessively large embeds. The following table describes the limits:

All of the following limits are measured inclusively. Leading and trailing whitespace characters are not included (they are trimmed automatically).

| Field                                                                      | Limit                                                                                |
|----------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| title                                                                      | 256 characters                                                                       |
| description                                                                | 4096 characters                                                                      |
| fields                                                                     | Up to 25 [field](#DOCS_RESOURCES_MESSAGE/embed-object-embed-field-structure) objects |
| [field.name](#DOCS_RESOURCES_MESSAGE/embed-object-embed-field-structure)   | 256 characters                                                                       |
| [field.value](#DOCS_RESOURCES_MESSAGE/embed-object-embed-field-structure)  | 1024 characters                                                                      |
| [footer.text](#DOCS_RESOURCES_MESSAGE/embed-object-embed-footer-structure) | 2048 characters                                                                      |
| [author.name](#DOCS_RESOURCES_MESSAGE/embed-object-embed-author-structure) | 256 characters                                                                       |

Additionally, the combined sum of characters in all `title`, `description`, `field.name`, `field.value`, `footer.text`, and `author.name` fields across all embeds attached to a message must not exceed 6000 characters. Violating any of these constraints will result in a `Bad Request` response.

Embeds are deduplicated by URL.  If a message contains multiple embeds with the same URL, only the first is shown.

#### Embed Fields by Embed Type

Certain embed types are used to power special UIs. These embeds use [fields](#DOCS_RESOURCES_MESSAGE/embed-object-embed-field-structure) to include additional data in key-value pairs. Below is a reference of possible embed fields for each of the following embed types. 

###### Poll Result Embed Fields

| Field                         | Description                                                |
|-------------------------------|------------------------------------------------------------|
| poll_question_text            | question text from the original poll                       |
| victor_answer_votes           | number of votes for the answer(s) with the most votes      |
| total_votes                   | total number of votes in the poll                          |
| victor_answer_id?             | id for the winning answer                                  |
| victor_answer_text?           | text for the winning answer                                |
| victor_answer_emoji_id?       | id for an emoji associated with the winning answer         |
| victor_answer_emoji_name?     | name of an emoji associated with the winning answer        |
| victor_answer_emoji_animated? | if an emoji associated with the winning answer is animated |

### Attachment Object

###### Attachment Structure

> info
> For the `attachments` array in Message Create/Edit requests, only the `id` is required.

| Field          | Type      | Description                                                                                                                                      |
|----------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| id             | snowflake | attachment id                                                                                                                                    |
| filename       | string    | name of file attached                                                                                                                            |
| title?         | string    | the title of the file                                                                                                                            |
| description?   | string    | description for the file (max 1024 characters)                                                                                                   |
| content_type?  | string    | the attachment's [media type](https://en.wikipedia.org/wiki/Media_type)                                                                          |
| size           | integer   | size of file in bytes                                                                                                                            |
| url            | string    | source url of file                                                                                                                               |
| proxy_url      | string    | a proxied url of file                                                                                                                            |
| height?        | ?integer  | height of file (if image)                                                                                                                        |
| width?         | ?integer  | width of file (if image)                                                                                                                         |
| ephemeral? \*  | boolean   | whether this attachment is ephemeral                                                                                                             |
| duration_secs? | float     | the duration of the audio file (currently for voice messages)                                                                                    |
| waveform?      | string    | base64 encoded bytearray representing a sampled waveform (currently for voice messages)                                                          |
| flags?         | integer   | [attachment flags](#DOCS_RESOURCES_MESSAGE/attachment-object-attachment-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) |

\* Ephemeral attachments will automatically be removed after a set period of time. Ephemeral attachments on messages are guaranteed to be available as long as the message itself exists.

###### Attachment Flags

| Flag     | Value    | Description                                                       |
|----------|----------|-------------------------------------------------------------------|
| IS_REMIX | `1 << 2` | this attachment has been edited using the remix feature on mobile |

### Channel Mention Object

###### Channel Mention Structure

| Field    | Type      | Description                                                                 |
|----------|-----------|-----------------------------------------------------------------------------|
| id       | snowflake | id of the channel                                                           |
| guild_id | snowflake | id of the guild containing the channel                                      |
| type     | integer   | the [type of channel](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) |
| name     | string    | the name of the channel                                                     |

### Allowed Mentions Object

The allowed mention field allows for more granular control over mentions without various hacks to the message content. This will always validate against message content to avoid phantom pings (e.g. to ping everyone, you must still have `@everyone` in the message content), and check against user/bot permissions.

###### Allowed Mention Types

| Type              | Value      | Description                           |
|-------------------|------------|---------------------------------------|
| Role Mentions     | "roles"    | Controls role mentions                |
| User Mentions     | "users"    | Controls user mentions                |
| Everyone Mentions | "everyone" | Controls @everyone and @here mentions |

###### Allowed Mentions Structure

| Field        | Type                           | Description                                                                                                                           |
|--------------|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| parse        | array of allowed mention types | An array of [allowed mention types](#DOCS_RESOURCES_MESSAGE/allowed-mentions-object-allowed-mention-types) to parse from the content. |
| roles        | list of snowflakes             | Array of role_ids to mention (Max size of 100)                                                                                        |
| users        | list of snowflakes             | Array of user_ids to mention (Max size of 100)                                                                                        |
| replied_user | boolean                        | For replies, whether to mention the author of the message being replied to (default false)                                            |

###### Allowed Mentions Reference

Due to the complexity of possibilities, we have included a set of examples and behavior for the allowed mentions field.

If `allowed_mentions` is _not_ passed in (i.e. the key does not exist), the mentions will be parsed via the content. This corresponds with existing behavior.

In the example below we would ping @here (and also @role124 and @user123)

```json
{
  "content": "@here Hi there from <@123>, cc <@&124>"
}
```

To suppress all mentions in a message use:

```json
{
  "content": "@everyone hi there, <@&123>",
  "allowed_mentions": {
    "parse": []
  }
}
```

This will suppress _all_ mentions in the message (no @everyone or user mention).

The `parse` field is mutually exclusive with the other fields. In the example below, we would ping users `123` and role `124`, but _not_ @everyone. Note that passing a `Falsy` value ([], null) into the "users" field does not trigger a validation error.

```json
{
  "content": "@everyone <@123> <@&124>",
  "allowed_mentions": {
    "parse": ["users", "roles"],
    "users": []
  }
}
```

In the next example, we would ping @everyone, (and also users `123` and `124` if they suppressed
@everyone mentions), but we would not ping any roles.

```json
{
  "content": "@everyone <@123> <@124> <@125> <@&200>",
  "allowed_mentions": {
    "parse": ["everyone"],
    "users": ["123", "124"]
  }
}
```

Due to possible ambiguities, not all configurations are valid. An _invalid_ configuration is as follows

```json
{
  "content": "@everyone <@123> <@124> <@125> <@&200>",
  "allowed_mentions": {
    "parse": ["users"],
    "users": ["123", "124"]
  }
}
```

Because `parse: ["users"]` and `users: [123, 124]` are both present, we would throw a validation error.
This is because the conditions cannot be fulfilled simultaneously (they are mutually exclusive).

Any entities with an ID included in the list of IDs can be mentioned. Note that the IDs of entities not present in the message's content will simply be ignored.
e.g. The following example is valid, and would mention user 123, but _not_ user 125 since there is no mention of
user 125 in the content.

```json
{
  "content": "<@123> Time for some memes.",
  "allowed_mentions": {
    "users": ["123", "125"]
  }
}
```

### Role Subscription Data Object

###### Role Subscription Data Object Structure

| Field                        | Type      | Description                                                           |
|------------------------------|-----------|-----------------------------------------------------------------------|
| role_subscription_listing_id | snowflake | the id of the sku and listing that the user is subscribed to          |
| tier_name                    | string    | the name of the tier that the user is subscribed to                   |
| total_months_subscribed      | integer   | the cumulative number of months that the user has been subscribed for |
| is_renewal                   | boolean   | whether this notification is for a renewal rather than a new purchase |

## Get Channel Messages % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages

Retrieves the messages in a channel. Returns an array of [message](#DOCS_RESOURCES_MESSAGE/message-object) objects on success.

If operating on a guild channel, this endpoint requires the current user to have the `VIEW_CHANNEL` permission. If the channel is a voice channel, they must _also_ have the `CONNECT` permission.

If the current user is missing the `READ_MESSAGE_HISTORY` permission in the channel, then no messages will be returned.

> info
> The `before`, `after`, and `around` parameters are mutually exclusive, only one may be passed at a time.

###### Query String Params

| Field   | Type      | Description                              | Default |
|---------|-----------|------------------------------------------|---------|
| around? | snowflake | Get messages around this message ID      | absent  |
| before? | snowflake | Get messages before this message ID      | absent  |
| after?  | snowflake | Get messages after this message ID       | absent  |
| limit?  | integer   | Max number of messages to return (1-100) | 50      |

## Get Channel Message % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}

Retrieves a specific message in the channel. Returns a [message](#DOCS_RESOURCES_MESSAGE/message-object) object on success.

If operating on a guild channel, this endpoint requires the current user to have the `VIEW_CHANNEL` and `READ_MESSAGE_HISTORY` permissions. If the channel is a voice channel, they must _also_ have the `CONNECT` permission.

## Create Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages

> warn
> Discord may strip certain characters from message content, like invalid unicode characters or characters which cause unexpected message formatting. If you are passing user-generated strings into message content, consider sanitizing the data to prevent unexpected behavior and using `allowed_mentions` to prevent unexpected mentions.

Post a message to a guild text or DM channel. Returns a [message](#DOCS_RESOURCES_MESSAGE/message-object) object. Fires a [Message Create](#DOCS_TOPICS_GATEWAY_EVENTS/message-create) Gateway event. See [message formatting](#DOCS_REFERENCE/message-formatting) for more information on how to properly format messages.

To create a message as a reply or forward of another message, apps can include a [`message_reference`](#DOCS_RESOURCES_MESSAGE/message-reference-structure).
Refer to the documentation for required fields.

Files must be attached using a `multipart/form-data` body as described in [Uploading Files](#DOCS_REFERENCE/uploading-files).

###### Limitations

- When operating on a guild channel, the current user must have the `SEND_MESSAGES` permission.
- When sending a message with `tts` (text-to-speech) set to `true`, the current user must have the `SEND_TTS_MESSAGES` permission.
- When creating a message as a reply to another message, the current user must have the `READ_MESSAGE_HISTORY` permission.
    - The referenced message must exist and cannot be a system message.
- The maximum request size when sending a message is **25 MiB**
- For the embed object, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.

###### JSON/Form Params

> info
> When creating a message, apps must provide a value for **at least one of** `content`, `embeds`, `sticker_ids`, `components`, `files[n]`, or `poll`.

| Field              | Type                                                                                         | Description                                                                                                                                                                                                                       |
|--------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| content?\*         | string                                                                                       | Message contents (up to 2000 characters)                                                                                                                                                                                          |
| nonce?             | integer or string                                                                            | Can be used to verify a message was sent (up to 25 characters). Value will appear in the [Message Create event](#DOCS_TOPICS_GATEWAY_EVENTS/message-create).                                                                      |
| tts?               | boolean                                                                                      | `true` if this is a TTS message                                                                                                                                                                                                   |
| embeds?\*          | array of [embed](#DOCS_RESOURCES_MESSAGE/embed-object) objects                               | Up to 10 `rich` embeds (up to 6000 characters)                                                                                                                                                                                    |
| allowed_mentions?  | [allowed mention object](#DOCS_RESOURCES_MESSAGE/allowed-mentions-object)                    | Allowed mentions for the message                                                                                                                                                                                                  |
| message_reference? | [message reference](#DOCS_RESOURCES_MESSAGE/message-reference-structure)                     | Include to make your message a reply or a forward                                                                                                                                                                                 |
| components?\*      | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) objects | Components to include with the message                                                                                                                                                                                            |
| sticker_ids?\*     | array of snowflakes                                                                          | IDs of up to 3 [stickers](#DOCS_RESOURCES_STICKER/sticker-object) in the server to send in the message                                                                                                                            |
| files[n]?\*        | file contents                                                                                | Contents of the file being sent. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                                                                           |
| payload_json?      | string                                                                                       | JSON-encoded body of non-file params, only for `multipart/form-data` requests. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                             |
| attachments?       | array of partial [attachment](#DOCS_RESOURCES_MESSAGE/attachment-object) objects             | Attachment objects with filename and description. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                                                                                                          |
| flags?             | integer                                                                                      | [Message flags](#DOCS_RESOURCES_MESSAGE/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) (only `SUPPRESS_EMBEDS` and `SUPPRESS_NOTIFICATIONS` can be set)                          |
| enforce_nonce?     | boolean                                                                                      | If true and nonce is present, it will be checked for uniqueness in the past few minutes. If another message was created by the same author with the same nonce, that message will be returned and no new message will be created. |
| poll?              | [poll](#DOCS_RESOURCES_POLL/poll-create-request-object) request object                       | A poll!                                                                                                                                                                                                                           |

\* At least one of `content`, `embeds`, `sticker_ids`, `components`, `files[n]`, or `poll` is required.

###### Example Request Body (application/json)

```json
{
  "content": "Hello, World!",
  "tts": false,
  "embeds": [{
    "title": "Hello, Embed!",
    "description": "This is an embedded message."
  }]
}
```

Examples for file uploads are available in [Uploading Files](#DOCS_REFERENCE/uploading-files).

## Crosspost Message % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/crosspost

Crosspost a message in an Announcement Channel to following channels. This endpoint requires the `SEND_MESSAGES` permission, if the current user sent the message, or additionally the `MANAGE_MESSAGES` permission, for all other messages, to be present for the current user.

Returns a [message](#DOCS_RESOURCES_MESSAGE/message-object) object. Fires a [Message Update](#DOCS_TOPICS_GATEWAY_EVENTS/message-update) Gateway event.

## Create Reaction % PUT /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/@me

Create a reaction for the message. This endpoint requires the `READ_MESSAGE_HISTORY` permission to be present on the current user. Additionally, if nobody else has reacted to the message using this emoji, this endpoint requires the `ADD_REACTIONS` permission to be present on the current user. Returns a 204 empty response on success. Fires a [Message Reaction Add](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-add) Gateway event.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

## Delete Own Reaction % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/@me

Delete a reaction the current user has made for the message. Returns a 204 empty response on success. Fires a [Message Reaction Remove](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove) Gateway event.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

## Delete User Reaction % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}/{user.id#DOCS_RESOURCES_USER/user-object}

Deletes another user's reaction. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Returns a 204 empty response on success. Fires a [Message Reaction Remove](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove) Gateway event.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

## Get Reactions % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}

Get a list of users that reacted with this emoji. Returns an array of [user](#DOCS_RESOURCES_USER/user-object) objects on success.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

###### Query String Params

| Field  | Type      | Description                                                                  | Default |
|--------|-----------|------------------------------------------------------------------------------|---------|
| type?  | integer   | The [type of reaction](#DOCS_RESOURCES_MESSAGE/get-reactions-reaction-types) | 0       |
| after? | snowflake | Get users after this user ID                                                 | absent  |
| limit? | integer   | Max number of users to return (1-100)                                        | 25      |

###### Reaction Types

| Type   | Value |
|--------|-------|
| NORMAL | 0     |
| BURST  | 1     |

## Delete All Reactions % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/reactions

Deletes all reactions on a message. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Fires a [Message Reaction Remove All](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove-all) Gateway event.

## Delete All Reactions for Emoji % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/reactions/{emoji#DOCS_RESOURCES_EMOJI/emoji-object}

Deletes all the reactions for a given emoji on a message. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Fires a [Message Reaction Remove Emoji](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove-emoji) Gateway event.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`. To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.

## Edit Message % PATCH /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}

Edit a previously sent message. The fields `content`, `embeds`, and `flags` can be edited by the original message author. Other users can only edit `flags` and only if they have the `MANAGE_MESSAGES` permission in the corresponding channel. When specifying flags, ensure to include all previously set flags/bits in addition to ones that you are modifying. Only `flags` documented in the table below may be modified by users (unsupported flag changes are currently ignored without error).

When the `content` field is edited, the `mentions` array in the message object will be reconstructed from scratch based on the new content. The `allowed_mentions` field of the edit request controls how this happens. If there is no explicit `allowed_mentions` in the edit request, the content will be parsed with _default_ allowances, that is, without regard to whether or not an `allowed_mentions` was present in the request that originally created the message.

Returns a [message](#DOCS_RESOURCES_MESSAGE/message-object) object. Fires a [Message Update](#DOCS_TOPICS_GATEWAY_EVENTS/message-update) Gateway event.

Refer to [Uploading Files](#DOCS_REFERENCE/uploading-files) for details on attachments and `multipart/form-data` requests.
Any provided files will be **appended** to the message. To remove or replace files you will have to supply the `attachments` field which specifies the files to retain on the message after edit.

> warn
> Starting with API v10, the `attachments` array must contain all attachments that should be present after edit, including **retained and new** attachments provided in the request body.

> info
> All parameters to this endpoint are optional and nullable.

###### JSON/Form Params

| Field            | Type                                                                                 | Description                                                                                                                             |
|------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| content          | string                                                                               | Message contents (up to 2000 characters)                                                                                                |
| embeds           | array of [embed](#DOCS_RESOURCES_MESSAGE/embed-object) objects                       | Up to 10 `rich` embeds (up to 6000 characters)                                                                                          |
| flags            | integer                                                                              | Edit the [flags](#DOCS_RESOURCES_MESSAGE/message-object-message-flags) of a message (only `SUPPRESS_EMBEDS` can currently be set/unset) |
| allowed_mentions | [allowed mention object](#DOCS_RESOURCES_MESSAGE/allowed-mentions-object)            | Allowed mentions for the message                                                                                                        |
| components       | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) | Components to include with the message                                                                                                  |
| files[n]         | file contents                                                                        | Contents of the file being sent/edited. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                                          |
| payload_json     | string                                                                               | JSON-encoded body of non-file params (multipart/form-data only). See [Uploading Files](#DOCS_REFERENCE/uploading-files)                 |
| attachments      | array of [attachment](#DOCS_RESOURCES_MESSAGE/attachment-object) objects             | Attached files to keep and possible descriptions for new files. See [Uploading Files](#DOCS_REFERENCE/uploading-files)                  |

## Delete Message % DELETE /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}

Delete a message. If operating on a guild channel and trying to delete a message that was not sent by the current user, this endpoint requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete](#DOCS_TOPICS_GATEWAY_EVENTS/message-delete) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Bulk Delete Messages % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/messages/bulk-delete

Delete multiple messages in a single request. This endpoint can only be used on guild channels and requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete Bulk](#DOCS_TOPICS_GATEWAY_EVENTS/message-delete-bulk) Gateway event.

Any message IDs given that do not exist or are invalid will count towards the minimum and maximum message count (currently 2 and 100 respectively).

> warn
> This endpoint will not delete messages older than 2 weeks, and will fail with a 400 BAD REQUEST if any message provided is older than that or if any duplicate message IDs are provided.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field    | Type                | Description                               |
|----------|---------------------|-------------------------------------------|
| messages | array of snowflakes | an array of message ids to delete (2-100) |
