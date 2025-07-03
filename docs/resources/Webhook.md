---
sidebar_label: Webhook
---

# Webhook Resource

Webhooks are a low-effort way to post messages to channels in Discord. They do not require a bot user or authentication to use.

### Webhook Object

Used to represent a webhook.

###### Webhook Structure

| Field             | Type                                                             | Description                                                                                                   |
|-------------------|------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| id                | snowflake                                                        | the id of the webhook                                                                                         |
| type              | integer                                                          | the [type](#DOCS_RESOURCES_WEBHOOK/webhook-object-webhook-types) of the webhook                               |
| guild_id?         | ?snowflake                                                       | the guild id this webhook is for, if any                                                                      |
| channel_id        | ?snowflake                                                       | the channel id this webhook is for, if any                                                                    |
| user?             | [user](#DOCS_RESOURCES_USER/user-object) object                  | the user this webhook was created by (not returned when getting a webhook with its token)                     |
| name              | ?string                                                          | the default name of the webhook                                                                               |
| avatar            | ?string                                                          | the default user avatar [hash](#DOCS_REFERENCE/image-formatting) of the webhook                               |
| token?            | string                                                           | the secure token of the webhook (returned for Incoming Webhooks)                                              |
| application_id    | ?snowflake                                                       | the bot/OAuth2 application that created this webhook                                                          |
| source_guild? *   | partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object       | the guild of the channel that this webhook is following (returned for Channel Follower Webhooks)              |
| source_channel? * | partial [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object | the channel that this webhook is following (returned for Channel Follower Webhooks)                           |
| url?              | string                                                           | the url used for executing the webhook (returned by the [webhooks](#DOCS_TOPICS_OAUTH2/webhooks) OAuth2 flow) |

\* These fields will be absent if the webhook creator has since lost access to the guild where the followed channel resides

###### Webhook Types

| Value | Name             | Description                                                                                                    |
|-------|------------------|----------------------------------------------------------------------------------------------------------------|
| 1     | Incoming         | Incoming Webhooks can post messages to channels with a generated token                                         |
| 2     | Channel Follower | Channel Follower Webhooks are internal webhooks used with Channel Following to post new messages into channels |
| 3     | Application      | Application webhooks are webhooks used with Interactions                                                       |

###### Example Incoming Webhook

```json
{
  "name": "test webhook",
  "type": 1,
  "channel_id": "199737254929760256",
  "token": "3d89bb7572e0fb30d8128367b3b1b44fecd1726de135cbe28a41f8b2f777c372ba2939e72279b94526ff5d1bd4358d65cf11",
  "avatar": null,
  "guild_id": "199737254929760256",
  "id": "223704706495545344",
  "application_id": null,
  "user": {
    "username": "test",
    "discriminator": "7479",
    "id": "190320984123768832",
    "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
    "public_flags": 131328
  }
}
```

###### Example Channel Follower Webhook

```json
{
  "type": 2,
  "id": "752831914402115456",
  "name": "Guildy name",
  "avatar": "bb71f469c158984e265093a81b3397fb",
  "channel_id": "561885260615255432",
  "guild_id": "56188498421443265",
  "application_id": null,
  "source_guild": {
    "id": "56188498421476534",
    "name": "Guildy name",
    "icon": "bb71f469c158984e265093a81b3397fb"
  },
  "source_channel": {
    "id": "5618852344134324",
    "name": "announcements"
  },
  "user": {
    "username": "test",
    "discriminator": "7479",
    "id": "190320984123768832",
    "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
    "public_flags": 131328
  }
}
```

###### Example Application Webhook

```json
{
  "type": 3,
  "id": "658822586720976555",
  "name": "Clyde",
  "avatar": "689161dc90ac261d00f1608694ac6bfd",
  "channel_id": null,
  "guild_id": null,
  "application_id": "658822586720976555"
}
```

## Create Webhook % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/webhooks

Creates a new webhook and returns a [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success. Requires the `MANAGE_WEBHOOKS` permission. Fires a [Webhooks Update](#DOCS_TOPICS_GATEWAY_EVENTS/webhooks-update) Gateway event.

An error will be returned if a webhook name (`name`) is not valid. A webhook name is valid if:

- It does not contain the substrings `clyde` or `discord` (case-insensitive)
- It follows the nickname guidelines in the [Usernames and Nicknames](#DOCS_RESOURCES_USER/usernames-and-nicknames) documentation, with an exception that webhook names can be up to 80 characters

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field   | Type                                      | Description                           |
|---------|-------------------------------------------|---------------------------------------|
| name    | string                                    | name of the webhook (1-80 characters) |
| avatar? | ?[image data](#DOCS_REFERENCE/image-data) | image for the default webhook avatar  |

## Get Channel Webhooks % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/webhooks

Returns a list of channel [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the `MANAGE_WEBHOOKS` permission.

## Get Guild Webhooks % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/webhooks

Returns a list of guild [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the `MANAGE_WEBHOOKS` permission.

## Get Webhook % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Returns the new [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object for the given id.

This request requires the `MANAGE_WEBHOOKS` permission unless the application making the request owns the
webhook. [(see: webhook.application_id)](#DOCS_RESOURCES_WEBHOOK/webhook-object)

## Get Webhook with Token % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication and returns no user in the webhook object.

## Modify Webhook % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Modify a webhook. Requires the `MANAGE_WEBHOOKS` permission. Returns the updated [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success. Fires a [Webhooks Update](#DOCS_TOPICS_GATEWAY_EVENTS/webhooks-update) Gateway event.

> info
> All parameters to this endpoint are optional

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field      | Type                                      | Description                                        |
|------------|-------------------------------------------|----------------------------------------------------|
| name       | string                                    | the default name of the webhook                    |
| avatar     | ?[image data](#DOCS_REFERENCE/image-data) | image for the default webhook avatar               |
| channel_id | snowflake                                 | the new channel id this webhook should be moved to |

## Modify Webhook with Token % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication, does not accept a `channel_id` parameter in the body, and does not return a user in the webhook object.

## Delete Webhook % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Delete a webhook permanently. Requires the `MANAGE_WEBHOOKS` permission. Returns a `204 No Content` response on success. Fires a [Webhooks Update](#DOCS_TOPICS_GATEWAY_EVENTS/webhooks-update) Gateway event.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

## Delete Webhook with Token % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication.

## Execute Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Refer to [Uploading Files](#DOCS_REFERENCE/uploading-files) for details on attachments and `multipart/form-data` requests. Returns a message or `204 No Content` depending on the `wait` query parameter.

> info
> Note that when sending a message, you must provide a value for at **least one of** `content`, `embeds`, `components`, `file`, or `poll`.

> info
> If the webhook channel is a forum or media channel, you must provide either `thread_id` in the query string params, or `thread_name` in the JSON/form params. If `thread_id` is provided, the message will send in that thread. If `thread_name` is provided, a thread with that name will be created in the channel.

> warn
> Discord may strip certain characters from message content, like invalid unicode characters or characters which cause unexpected message formatting. If you are passing user-generated strings into message content, consider sanitizing the data to prevent unexpected behavior and using `allowed_mentions` to prevent unexpected mentions.

###### Query String Params

| Field     | Type                                             | Description                                                                                                                                                                                  | Required |
|-----------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| wait      | [boolean](#DOCS_REFERENCE/boolean-query-strings) | waits for server confirmation of message send before response, and returns the created message body (defaults to `false`; when `false` a message that is not saved does not return an error) | false    |
| thread_id | snowflake                                        | Send a message to the specified thread within a webhook's channel. The thread will automatically be unarchived.                                                                              | false    |

###### JSON/Form Params

| Field             | Type                                                                                 | Description                                                                                                                                                                                              | Required                           |
|-------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| content           | string                                                                               | the message contents (up to 2000 characters)                                                                                                                                                             | one of content, file, embeds, poll |
| username          | string                                                                               | override the default username of the webhook                                                                                                                                                             | false                              |
| avatar_url        | string                                                                               | override the default avatar of the webhook                                                                                                                                                               | false                              |
| tts               | boolean                                                                              | true if this is a TTS message                                                                                                                                                                            | false                              |
| embeds            | array of up to 10 [embed](#DOCS_RESOURCES_MESSAGE/embed-object) objects              | embedded `rich` content                                                                                                                                                                                  | one of content, file, embeds, poll |
| allowed_mentions  | [allowed mention object](#DOCS_RESOURCES_MESSAGE/allowed-mentions-object)            | allowed mentions for the message                                                                                                                                                                         | false                              |
| components \*     | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) | the components to include with the message                                                                                                                                                               | false                              |
| files[n] \*\*     | file contents                                                                        | the contents of the file being sent                                                                                                                                                                      | one of content, file, embeds, poll |
| payload_json \*\* | string                                                                               | JSON encoded body of non-file params                                                                                                                                                                     | `multipart/form-data` only         |
| attachments \*\*  | array of partial [attachment](#DOCS_RESOURCES_MESSAGE/attachment-object) objects     | attachment objects with filename and description                                                                                                                                                         | false                              |
| flags             | integer                                                                              | [message flags](#DOCS_RESOURCES_MESSAGE/message-object-message-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) (only `SUPPRESS_EMBEDS` and `SUPPRESS_NOTIFICATIONS` can be set) | false                              |
| thread_name       | string                                                                               | name of thread to create (requires the webhook channel to be a forum or media channel)                                                                                                                   | false                              |
| applied_tags      | array of snowflakes                                                                  | array of tag ids to apply to the thread (requires the webhook channel to be a forum or media channel)                                                                                                    | false                              |
| poll              | [poll](#DOCS_RESOURCES_POLL/poll-create-request-object) request object               | A poll!                                                                                                                                                                                                  | one of content, file, embeds, poll |


\* Requires an application-owned webhook.

\*\* See [Uploading Files](#DOCS_REFERENCE/uploading-files) for details.

> info
> For the webhook embed objects, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.

## Execute Slack-Compatible Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/slack

Refer to [Slack's documentation](https://api.slack.com/incoming-webhooks) for more information. We do not support Slack's `channel`, `icon_emoji`, `mrkdwn`, or `mrkdwn_in` properties.

###### Query String Params

| Field     | Type                                             | Description                                                                                                                                           | Required |
|-----------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| thread_id | snowflake                                        | id of the thread to send the message in                                                                                                               | false    |
| wait      | [boolean](#DOCS_REFERENCE/boolean-query-strings) | waits for server confirmation of message send before response (defaults to `true`; when `false` a message that is not saved does not return an error) | false    |

## Execute GitHub-Compatible Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/github

[Add a new webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) to your GitHub repo (in the repo's settings), and use this endpoint as the "Payload URL." You can choose what events your Discord channel receives by choosing the "Let me select individual events" option and selecting individual events for the new webhook you're configuring. The supported [events](https://docs.github.com/en/webhooks/webhook-events-and-payloads) are `commit_comment`, `create`, `delete`, `fork`, `issue_comment`, `issues`, `member`, `public`, `pull_request`, `pull_request_review`, `pull_request_review_comment`, `push`, `release`, `watch`, `check_run`, `check_suite`, `discussion`, and `discussion_comment`.

###### Query String Params

| Field     | Type                                             | Description                                                                                                                                           | Required |
|-----------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| thread_id | snowflake                                        | id of the thread to send the message in                                                                                                               | false    |
| wait      | [boolean](#DOCS_REFERENCE/boolean-query-strings) | waits for server confirmation of message send before response (defaults to `true`; when `false` a message that is not saved does not return an error) | false    |

## Get Webhook Message % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}

Returns a previously-sent webhook message from the same token. Returns a [message](#DOCS_RESOURCES_MESSAGE/message-object) object on success.

###### Query String Params

| Field     | Type      | Description                        | Required |
|-----------|-----------|------------------------------------|----------|
| thread_id | snowflake | id of the thread the message is in | false    |

## Edit Webhook Message % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}

Edits a previously-sent webhook message from the same token. Returns a [message](#DOCS_RESOURCES_MESSAGE/message-object) object on success.

When the `content` field is edited, the `mentions` array in the message object will be reconstructed from scratch based on the new content. The `allowed_mentions` field of the edit request controls how this happens. If there is no explicit `allowed_mentions` in the edit request, the content will be parsed with _default_ allowances, that is, without regard to whether or not an `allowed_mentions` was present in the request that originally created the message.

Refer to [Uploading Files](#DOCS_REFERENCE/uploading-files) for details on attachments and `multipart/form-data` requests.
Any provided files will be **appended** to the message. To remove or replace files you will have to supply the `attachments` field which specifies the files to retain on the message after edit.

> warn
> Starting with API v10, the `attachments` array must contain all attachments that should be present after edit, including **retained and new** attachments provided in the request body.

> info
> All parameters to this endpoint are optional and nullable.

###### Query String Params

| Field     | Type      | Description                        | Required |
|-----------|-----------|------------------------------------|----------|
| thread_id | snowflake | id of the thread the message is in | false    |

###### JSON/Form Params

| Field             | Type                                                                                 | Description                                                     |
|-------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| content           | string                                                                               | the message contents (up to 2000 characters)                    |
| embeds            | array of up to 10 [embed](#DOCS_RESOURCES_MESSAGE/embed-object) objects              | embedded `rich` content                                         |
| allowed_mentions  | [allowed mention object](#DOCS_RESOURCES_MESSAGE/allowed-mentions-object)            | allowed mentions for the message                                |
| components \*     | array of [message component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) | the components to include with the message                      |
| files[n] \*\*     | file contents                                                                        | the contents of the file being sent/edited                      |
| payload_json \*\* | string                                                                               | JSON encoded body of non-file params (multipart/form-data only) |
| attachments \*\*  | array of partial [attachment](#DOCS_RESOURCES_MESSAGE/attachment-object) objects     | attached files to keep and possible descriptions for new files  |
| poll \*\*\*       | [poll](#DOCS_RESOURCES_POLL/poll-create-request-object) request object               | A poll!                                                         |

\* Requires an application-owned webhook.

\*\* See [Uploading Files](#DOCS_REFERENCE/uploading-files) for details.

\*\*\* Polls can only be added when editing a deferred interaction response.

## Delete Webhook Message % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/messages/{message.id#DOCS_RESOURCES_MESSAGE/message-object}

Deletes a message that was created by the webhook. Returns a `204 No Content` response on success.

###### Query String Params

| Field     | Type      | Description                        | Required |
|-----------|-----------|------------------------------------|----------|
| thread_id | snowflake | id of the thread the message is in | false    |
