# Webhook Resource

Webhooks are a low-effort way to post messages to channels in Discord. They do not require a bot user or authentication to use.

### Webhook Object

Used to represent a webhook.

###### Webhook Structure

| Field           | Type                                                             | Description                                                                                                   |
| --------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| id              | snowflake                                                        | the id of the webhook                                                                                         |
| type            | integer                                                          | the [type](#DOCS_RESOURCES_WEBHOOK/webhook-object-webhook-types) of the webhook                               |
| guild_id?       | snowflake                                                        | the guild id this webhook is for                                                                              |
| channel_id      | snowflake                                                        | the channel id this webhook is for                                                                            |
| user?           | [user](#DOCS_RESOURCES_USER/user-object) object                  | the user this webhook was created by (not returned when getting a webhook with its token)                     |
| name            | ?string                                                          | the default name of the webhook                                                                               |
| avatar          | ?string                                                          | the default user avatar [hash](#DOCS_REFERENCE/image-formatting) of the webhook                               |
| token?          | string                                                           | the secure token of the webhook (returned for Incoming Webhooks)                                              |
| application_id  | ?snowflake                                                       | the bot/OAuth2 application that created this webhook                                                          |
| source_guild?   | partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object       | the guild of the channel that this webhook is following (returned for Channel Follower Webhooks)              |
| source_channel? | partial [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object | the channel that this webhook is following (returned for Channel Follower Webhooks)                           |
| url?            | str                                                              | the url used for executing the webhook (returned by the [webhooks](#DOCS_TOPICS_OAUTH2/webhooks) OAuth2 flow) |

###### Webhook Types

| Value | Name             | Description                                                                                                    |
| ----- | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| 1     | Incoming         | Incoming Webhooks can post messages to channels with a generated token                                         |
| 2     | Channel Follower | Channel Follower Webhooks are internal webhooks used with Channel Following to post new messages into channels |

###### Example Webhook

```json
{
  "name": "test webhook",
  "type": 1,
  "channel_id": "199737254929760256",
  "token": "3d89bb7572e0fb30d8128367b3b1b44fecd1726de135cbe28a41f8b2f777c372ba2939e72279b94526ff5d1bd4358d65cf11",
  "avatar": null,
  "guild_id": "199737254929760256",
  "id": "223704706495545344",
  "user": {
    "username": "test",
    "discriminator": "7479",
    "id": "190320984123768832",
    "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
    "public_flags": 131328
  }
}
```

## Create Webhook % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/webhooks

Create a new webhook. Requires the `MANAGE_WEBHOOKS` permission. Returns a [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success. Webhook names follow our naming restrictions that can be found in our [Usernames and Nicknames](#DOCS_RESOURCES_USER/usernames-and-nicknames) documentation, with the following additional stipulations:

- Webhook names cannot be: 'clyde'

###### JSON Params

| Field  | Type                                      | Description                           |
| ------ | ----------------------------------------- | ------------------------------------- |
| name   | string                                    | name of the webhook (1-80 characters) |
| avatar | ?[image data](#DOCS_REFERENCE/image-data) | image for the default webhook avatar  |

## Get Channel Webhooks % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/webhooks

Returns a list of channel [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the `MANAGE_WEBHOOKS` permission.

## Get Guild Webhooks % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/webhooks

Returns a list of guild [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the `MANAGE_WEBHOOKS` permission.

## Get Webhook % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Returns the new [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object for the given id.

## Get Webhook with Token % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication and returns no user in the webhook object.

## Modify Webhook % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Modify a webhook. Requires the `MANAGE_WEBHOOKS` permission. Returns the updated [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success.

> info
> All parameters to this endpoint are optional

###### JSON Params

| Field      | Type                                      | Description                                        |
| ---------- | ----------------------------------------- | -------------------------------------------------- |
| name       | string                                    | the default name of the webhook                    |
| avatar     | ?[image data](#DOCS_REFERENCE/image-data) | image for the default webhook avatar               |
| channel_id | snowflake                                 | the new channel id this webhook should be moved to |

## Modify Webhook with Token % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication, does not accept a `channel_id` parameter in the body, and does not return a user in the webhook object.

## Delete Webhook % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Delete a webhook permanently. Requires the `MANAGE_WEBHOOKS` permission. Returns a 204 NO CONTENT response on success.

## Delete Webhook with Token % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication.

## Execute Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

> warn
> This endpoint supports both JSON and form data bodies. It does require multipart/form-data requests instead of the normal JSON request type when uploading files. Make sure you set your `Content-Type` to `multipart/form-data` if you're doing that. Note that in that case, the `embeds` field cannot be used, but you can pass an url-encoded JSON body as a form value for `payload_json`.

###### Query String Params

| Field | Type    | Description                                                                                                                                                                                  | Required |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| wait  | boolean | waits for server confirmation of message send before response, and returns the created message body (defaults to `false`; when `false` a message that is not saved does not return an error) | false    |

###### JSON/Form Params

| Field            | Type                                                                      | Description                                                  | Required                     |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------- |
| content          | string                                                                    | the message contents (up to 2000 characters)                 | one of content, file, embeds |
| username         | string                                                                    | override the default username of the webhook                 | false                        |
| avatar_url       | string                                                                    | override the default avatar of the webhook                   | false                        |
| tts              | boolean                                                                   | true if this is a TTS message                                | false                        |
| file             | file contents                                                             | the contents of the file being sent                          | one of content, file, embeds |
| embeds           | array of up to 10 [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects   | embedded `rich` content                                      | one of content, file, embeds |
| payload_json     | string                                                                    | See [message create](#DOCS_RESOURCES_CHANNEL/create-message) | `multipart/form-data` only   |
| allowed_mentions | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object) | allowed mentions for the message                             | false                        |

> info
> For the webhook embed objects, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.

## Execute Slack-Compatible Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/slack

###### Query String Params

| Field | Type    | Description                                                                                                                                           | Required |
| ----- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| wait  | boolean | waits for server confirmation of message send before response (defaults to `true`; when `false` a message that is not saved does not return an error) | false    |

Refer to [Slack's documentation](https://api.slack.com/incoming-webhooks) for more information. We do not support Slack's `channel`, `icon_emoji`, `mrkdwn`, or `mrkdwn_in` properties.

## Execute GitHub-Compatible Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/github

###### Query String Params

| Field | Type    | Description                                                                                                                                           | Required |
| ----- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| wait  | boolean | waits for server confirmation of message send before response (defaults to `true`; when `false` a message that is not saved does not return an error) | false    |

Add a new webhook to your GitHub repo (in the repo's settings), and use this endpoint as the "Payload URL." You can choose what events your Discord channel receives by choosing the "Let me select individual events" option and selecting individual events for the new webhook you're configuring.

## Edit Webhook Message % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Edits a previously-sent webhook message from the same token. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object on success.

When the `content` field is edited, the `mentions` array in the message object will be reconstructed from scratch based on the new content. The `allowed_mentions` field of the edit request controls how this happens. If there is no explicit `allowed_mentions` in the edit request, the content will be parsed with _default_ allowances, that is, without regard to whether or not an `allowed_mentions` was present in the request that originally created the message.

> info
> All parameters to this endpoint are optional and nullable.

###### JSON/Form Params

| Field            | Type                                                                      | Description                                                  |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| content          | string                                                                    | the message contents (up to 2000 characters)                 |
| embeds           | array of up to 10 [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects   | embedded `rich` content                                      |
| file             | file contents                                                             | the contents of the file being sent/edited                   |
| payload_json     | string                                                                    | See [message create](#DOCS_RESOURCES_CHANNEL/create-message) |
| allowed_mentions | [allowed mention object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object) | allowed mentions for the message                             |

# Delete Webhook Message % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Deletes a message that was created by the webhook. Returns a 204 NO CONTENT response on success.
