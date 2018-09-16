# Webhook Resource

Webhooks are a low-effort way to post messages to channels in Discord. They do not require a bot user or authentication to use.

### Webhook Object

Used to represent a webhook.

###### Webhook Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | the id of the webhook |
| guild_id? | snowflake | the guild id this webhook is for |
| channel_id | snowflake | the channel id this webhook is for |
| user? | [user](#DOCS_RESOURCES_USER/user-object) object | the user this webhook was created by (not returned when getting a webhook with its token) |
| name | ?string | the default name of the webhook |
| avatar | ?string | the default avatar of the webhook |
| token | string | the secure token of the webhook |

###### Example Webhook

```json
{
	"name": "test webhook",
	"channel_id": "199737254929760256",
	"token": "3d89bb7572e0fb30d8128367b3b1b44fecd1726de135cbe28a41f8b2f777c372ba2939e72279b94526ff5d1bd4358d65cf11",
	"avatar": null,
	"guild_id": "199737254929760256",
	"id": "223704706495545344",
	"user": {
		"username": "test",
		"discriminator": "7479",
		"id": "190320984123768832",
		"avatar": "b004ec1740a63ca06ae2e14c5cee11f3"
	}
}
```

## Create Webhook % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/webhooks

Create a new webhook. Requires the 'MANAGE_WEBHOOKS' permission. Returns a [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| name | string | name of the webhook (2-32 characters) |
| avatar | ?[avatar data](#DOCS_RESOURCES_USER/avatar-data) string | image for the default webhook avatar |

## Get Channel Webhooks % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/webhooks

Returns a list of channel [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the 'MANAGE_WEBHOOKS' permission.

## Get Guild Webhooks % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/webhooks

Returns a list of guild [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the 'MANAGE_WEBHOOKS' permission.

## Get Webhook % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Returns the new [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object for the given id.

## Get Webhook with Token % GET /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication and returns no user in the webhook object.

## Modify Webhook % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Modify a webhook. Requires the 'MANAGE_WEBHOOKS' permission. Returns the updated [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success.

>info
>All parameters to this endpoint are optional

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| name | string | the default name of the webhook |
| avatar | [avatar data](#DOCS_RESOURCES_USER/avatar-data) string | image for the default webhook avatar |
| channel_id | snowflake | the new channel id this webhook should be moved to |

## Modify Webhook with Token % PATCH /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication, does not accept a `channel_id` parameter in the body, and does not return a user in the webhook object.

## Delete Webhook % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}

Delete a webhook permanently. User must be owner. Returns a 204 NO CONTENT response on success.

## Delete Webhook with Token % DELETE /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

Same as above, except this call does not require authentication.

## Execute Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}

>warn
>This endpoint supports both JSON and form data bodies. It does require multipart/form-data requests instead of the normal JSON request type when uploading files. Make sure you set your `Content-Type` to `multipart/form-data` if you're doing that. Note that in that case, the `embeds` field cannot be used, but you can pass an url-encoded JSON body as a form value for `payload_json`.

###### Querystring Params

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| wait | bool | waits for server confirmation of message send before response, and returns the created message body (defaults to `false`; when `false` a message that is not saved does not return an error) | false |

###### JSON/Form Params

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| content | string | the message contents (up to 2000 characters) | one of content, file, embeds |
| username | string | override the default username of the webhook | false |
| avatar_url | string | override the default avatar of the webhook | false |
| tts | bool | true if this is a TTS message | false |
| file | file contents | the contents of the file being sent | one of content, file, embeds |
| embeds | array of [embed](#DOCS_RESOURCES_CHANNEL/embed-object) objects | embedded `rich` content | one of content, file, embeds |

>info
>For the webhook embed objects, you can set every field except `type` (it will be `rich` regardless of if you try to set it), `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.

## Execute Slack-Compatible Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/slack

###### Querystring Params

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| wait | bool | waits for server confirmation of message send before response (defaults to `true`; when `false` a message that is not saved does not return an error) | false |

Refer to [Slack's documentation](https://api.slack.com/incoming-webhooks) for more information. We do not support Slack's `channel`, `icon_emoji`, `mrkdwn`, or `mrkdwn_in` properties.

## Execute GitHub-Compatible Webhook % POST /webhooks/{webhook.id#DOCS_RESOURCES_WEBHOOK/webhook-object}/{webhook.token#DOCS_RESOURCES_WEBHOOK/webhook-object}/github

###### Querystring Params

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| wait | bool | waits for server confirmation of message send before response (defaults to `true`; when `false` a message that is not saved does not return an error) | false |

Add a new webhook to your GitHub repo (in the repo's settings), and use this endpoint as the "Payload URL." You can choose what events your Discord channel receives by choosing the "Let me select individual events" option and selecting individual events for the new webhook you're configuring.
