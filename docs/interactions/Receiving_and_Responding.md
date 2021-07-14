# Interactions

An **[Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object)** is the message that your application receives when a user uses a slash command or a message component. For [Slash Commands](#DOCS_INTERACTIONS_SLASH_COMMANDS/), it includes the values that the user submitted, for [Message Components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/) it includes identifying information about the component that was used. It will also include some metadata about how the interaction was triggered: the `guild_id`, `channel_id`, `member` and other fields. You can find all the values in our [data models](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/data-models-and-types).

## Interactions and Bot Users

We're all used to the way that Discord bots have worked for a long time. You make an application in the Dev Portal, you add a bot user to it, and you copy the token. That token can be used to connect to the gateway and to make requests against our API.

Interactions bring something entirely new to the table: the ability to interact with an application _without needing a bot user in the guild_. As you read through this documentation, you'll see that bot tokens are only referenced as a helpful alternative to doing a client credentials auth flow. Responding to interactions does not require a bot token.

In many cases, you may still need a bot user. If you need to receive gateway events, or need to interact with other parts of our API (like fetching a guild, or a channel, or updating permissions on a user), those actions are all still tied to having a bot token. However, if you don't need any of those things, you never have to add a bot user to your application at all.

Welcome to the new world.

## Receiving an Interaction

When a user interacts with your app, your app will receive an **[Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object)**. Your app can receive an interaction in one of two ways:

- Via [Interaction Create](#DOCS_TOPICS_GATEWAY/interaction-create) gateway event
- Via outgoing webhook

These two methods are **mutually exclusive**; you can _only_ receive Interactions one of the two ways. The `INTERACTION_CREATE` [Gateway Event](#DOCS_TOPICS_GATEWAY/interaction-create) may be handled by connected clients, while the webhook method detailed below does not require a connected client.

In your application in the Developer Portal, there is a field on the main page called "Interactions Endpoint URL". If you want to receive Interactions via outgoing webhook, you can set your URL in this field. In order for the URL to be valid, you must be prepared for two things ahead of time:

> info
> These steps are only necessary for webhook-based Interactions. It is not required for receiving them over the gateway.

1. Your endpoint must be prepared to ACK a `PING` message
2. Your endpoint must be set up to properly handle signature headers--more on that in [Security and Authorization](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/security-and-authorization)

If either of these are not complete, we will not validate your URL and it will fail to save.

When you attempt to save a URL, we will send a `POST` request to that URL with a `PING` payload. The `PING` payload has a `type: 1`. So, to properly ACK the payload, return a `200` response with a payload of `type: 1`:

```py
@app.route('/', methods=['POST'])
def my_command():
    if request.json["type"] == 1:
        return jsonify({
            "type": 1
        })
```

You'll also need to properly set up [Security and Authorization](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/security-and-authorization) on your endpoint for the URL to be accepted. Once both of those are complete and your URL has been saved, you can start receiving Interactions via webhook! At this point, your app will **no longer receive Interactions over the gateway**. If you want to receive them over the gateway again, simply delete your URL.

An [Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object) includes metadata to aid your application in handling it as well as `data` specific to the interaction type. You can find samples for each interaction type on their respective pages:

- [Slash Commands](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-interaction-object-sample-application-command-interaction)
- [Message Components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-interaction-object-sample-component-interaction)

An explanation of all the fields can be found in our [data models](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/data-models-and-types).

Now that you've gotten the data from the user, it's time to respond to them.

## Responding to an Interaction

Interactions--both receiving and responding--are webhooks under the hood. So responding to an Interaction is just like sending a webhook request!

> warn
> While interaction responses and followups are webhooks, they respect @everyone's ability to ping @everyone / @here . Nonetheless if your application responds with user data, you should still use [`allowed_mentions`](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object) to filter which mentions in the content actually ping. Other differences include the ability to send named links in the message content (`[text](url)`).

When responding to an interaction received **via webhook**, your server can simply respond to the received `POST` request. You'll want to respond with a `200` status code (if everything went well), as well as specifying a `type` and `data`, which is an [Interaction Response](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object) object:

```py
@app.route('/', methods=['POST'])
def my_command():
    if request.json["type"] == 1:
        return jsonify({
            "type": 1
        })

    else:
        return jsonify({
            "type": 4,
            "data": {
                "tts": False,
                "content": "Congrats on sending your command!",
                "embeds": [],
                "allowed_mentions": { "parse": [] }
            }
        })
```

If you are receiving Interactions over the gateway, you will **also need to respond via HTTP**. Responses to Interactions **are not sent as commands over the gateway**.

To respond to a gateway Interaction, make a `POST` request like this. `interaction_id` is the unique id of that individual Interaction from the received payload. `interaction_token` is the unique token for that interaction from the received payload. **This endpoint is only valid for Interactions received over the gateway. Otherwise, respond to the `POST` request to issue an initial response.**

```py
url = "https://discord.com/api/v8/interactions/<interaction_id>/<interaction_token>/callback"

json = {
    "type": 4,
    "data": {
        "content": "Congrats on sending your command!"
    }
}
r = requests.post(url, json=json)
```

> info
> Interaction `tokens` are valid for **15 minutes** and can be used to send followup messages but you **must send an initial response within 3 seconds of receiving the event**.  If the 3 second deadline is exceeded, the token will be invalidated.

## Followup Messages

Sometimes, your bot will want to send followup messages to a user after responding to an interaction. Or, you may want to edit your original response. Whether you receive Interactions over the gateway or by outgoing webhook, you can use the following endpoints to edit your initial response or send followup messages:

- [`PATCH /webhooks/<application_id>/<interaction_token>/messages/@original`](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/edit-original-interaction-response) to edit your initial response to an Interaction
- [`DELETE /webhooks/<application_id>/<interaction_token>/messages/@original`](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/delete-original-interaction-response) to delete your initial response to an Interaction
- [`POST /webhooks/<application_id>/<interaction_token>`](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/create-followup-message) to send a new followup message
- [`PATCH /webhooks/<application_id>/<interaction_token>/messages/<message_id>`](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/edit-followup-message) to edit a message sent with that `token`

> info
> Interactions webhooks share the same rate limit properties as normal webhooks

Interaction tokens are valid for **15 minutes**, meaning you can respond and update to a Slash Command within that amount of time.

## Security and Authorization

> info
> Check out our [Community Resources](#DOCS_TOPICS_COMMUNITY_RESOURCES/interactions) for libraries to help you with security in your language of choice

The internet is a scary place, especially for people hosting open, unauthenticated endpoints. If you are receiving Interactions via outgoing webhook, there are some security steps you **must** take before your app is eligible to receive requests.

Every Interaction is sent with the following headers:

- `X-Signature-Ed25519` as a signature
- `X-Signature-Timestamp` as a timestamp

Using your favorite security library, you **must validate the request each time you receive an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object)**. If the signature fails validation, respond with a `401` error code. Here's a couple code examples:

```js
const nacl = require('tweetnacl');

// Your public key can be found on your application in the Developer Portal
const PUBLIC_KEY = 'APPLICATION_PUBLIC_KEY';

const signature = req.get('X-Signature-Ed25519');
const timestamp = req.get('X-Signature-Timestamp');
const body = req.rawBody; // rawBody is expected to be a string, not raw bytes

const isVerified = nacl.sign.detached.verify(
  Buffer.from(timestamp + body),
  Buffer.from(signature, 'hex'),
  Buffer.from(PUBLIC_KEY, 'hex')
);

if (!isVerified) {
  return res.status(401).end('invalid request signature');
}
 ```

```py
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError

# Your public key can be found on your application in the Developer Portal
PUBLIC_KEY = 'APPLICATION_PUBLIC_KEY'

verify_key = VerifyKey(bytes.fromhex(PUBLIC_KEY))

signature = request.headers["X-Signature-Ed25519"]
timestamp = request.headers["X-Signature-Timestamp"]
body = request.data.decode("utf-8")

try:
    verify_key.verify(f'{timestamp}{body}'.encode(), bytes.fromhex(signature))
except BadSignatureError:
    abort(401, 'invalid request signature')
```

If you are not properly validating this signature header, we will not allow you to save your interactions URL in the Dev Portal. We will also do automated, routine security checks against your endpoint, including purposefully sending you invalid signatures. If you fail the validation, we will remove your interactions URL in the future and alert you via email and System DM.

We highly recommend checking out our [Community Resources](#DOCS_TOPICS_COMMUNITY_RESOURCES/interactions) and the two libraries found there. They not only provide typing for Interactions data models, but also include decorators for API frameworks like Flask and Express to make validation easy.

### Endpoints

> info
> For authorization, all endpoints take either a [bot token](#DOCS_REFERENCE/authentication) or [client credentials token](#DOCS_TOPICS_OAUTH2/client-credentials-grant) for your application

## Create Interaction Response % POST /interactions/{interaction.id#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/callback

Create a response to an Interaction from the gateway. Takes an [interaction response](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object).

## Get Original Interaction Response % GET /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/@original

Returns the initial Interaction response. Functions the same as [Get Webhook Message](#DOCS_RESOURCES_WEBHOOK/get-webhook-message).

## Edit Original Interaction Response % PATCH /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/@original

Edits the initial Interaction response. Functions the same as [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message).

## Delete Original Interaction Response % DELETE /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/@original

Deletes the initial Interaction response. Returns `204` on success.

## Create Followup Message % POST /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}

Create a followup message for an Interaction. Functions the same as [Execute Webhook](#DOCS_RESOURCES_WEBHOOK/execute-webhook), but `wait` is always true, and `flags` can be set to `64` in the body to send an ephemeral message. The `thread_id` query parameter is not required (and is furthermore ignored) when using this endpoint for interaction followups.

## Edit Followup Message % PATCH /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Edits a followup message for an Interaction. Functions the same as [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message).

## Delete Followup Message % DELETE /webhooks/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/{interaction.token#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object}/messages/{message.id#DOCS_RESOURCES_CHANNEL/message-object}

Deletes a followup message for an Interaction. Returns `204` on success.

## Data Models and Types

### Interaction Object

An interaction is the base "thing" that is sent when a user interacts with your application, it is the same for all current and future interaction types.

###### Interaction Structure

| Field          | Type                                                                                                          | Description                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------| -------------------------------------------------------------- |
| id             | snowflake                                                                                                     | id of the interaction                                          |
| application_id | snowflake                                                                                                     | id of the application this interaction is for                  |
| type           | [interaction type](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-type)           | the type of interaction                                        |
| data?\*        | [interaction data](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-data-structure) | the command data payload                                       |
| guild_id?      | snowflake                                                                                                     | the guild it was sent from                                     |
| channel_id?    | snowflake                                                                                                     | the channel it was sent from                                   |
| member?\*\*    | [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object                                              | guild member data for the invoking user, including permissions |
| user?          | [user](#DOCS_RESOURCES_USER/user-object) object                                                               | user object for the invoking user, if invoked in a DM          |
| token          | string                                                                                                        | a continuation token for responding to the interaction         |
| version        | integer                                                                                                       | read-only property, always `1`                                 |
| message?       | [message](#DOCS_RESOURCES_CHANNEL/message-object) object                                                      | for components, the message they were attached to              |

\* This is always present on application command and message component interaction types. It is optional for future-proofing against new interaction types

\*\* `member` is sent when the command is invoked in a guild, and `user` is sent when invoked in a DM

###### Interaction Request Type

| Name                | Value |
| ------------------- | ----- |
| PING                | 1     |
| APPLICATION_COMMAND | 2     |
| MESSAGE_COMPONENT   | 3     |

###### Interaction Data Structure

| Field          | Type                                                                                                                                                                                   | Description                                                                                                                     | Interaction Type |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| id             | snowflake                                                                                                                                                                              | the [`ID`](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) of the invoked command   | Slash Command    |
| name           | string                                                                                                                                                                                 | the [`name`](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) of the invoked command | Slash Command    |
| resolved?      | [application command interaction data resolved](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-interaction-object-application-command-interaction-data-resolved-structure)      | converted users + roles + channels                                                                                              | Slash Command    |
| options?       | array of [application command interaction data option](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-interaction-object-application-command-interaction-data-option-structure) | the params + values from the user                                                                                               | Slash Command    |
| custom_id      | string                                                                                                                                                                                 | the [`custom_id`](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/custom-id) of the component                                             | Component        |
| component_type | integer                                                                                                                                                                                | the [type](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-types) of the component                                              | Component        |

### Interaction Response Object

After receiving an interaction, you must respond to acknowledge it. You can choose to respond with a message immediately using type `4`, or you can choose to send a deferred response with type `5`. If choosing a deferred response, the user will see a loading state for the interaction, and you'll have up to 15 minutes to edit the original deferred response using [Edit Original Interaction Response](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/edit-original-interaction-response).

![A deferred response tells the user "{bot.name} is thinking"](deferred-example.png)

Interaction responses can also be public—everyone can see it—or "ephemeral"—only the invoking user can see it. That is determined by setting `flags` to `64` on the [interaction application command callback data](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-data-structure).

###### Interaction Response Structure

| Field | Type                                                                                                                                     | Description                  |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| type  | [interaction callback type](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type)           | the type of response         |
| data? | [interaction callback data](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-data-structure) | an optional response message |

###### Interaction Callback Type

| Name                                 | Value | Description                                                                                                   |
| ------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------- |
| PONG                                 | 1     | ACK a `Ping`                                                                                                  |
| CHANNEL_MESSAGE_WITH_SOURCE          | 4     | respond to an interaction with a message                                                                      |
| DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE | 5     | ACK an interaction and edit a response later, the user sees a loading state                                   |
| DEFERRED_UPDATE_MESSAGE\*            | 6     | for components, ACK an interaction and edit the original message later; the user does not see a loading state |
| UPDATE_MESSAGE\*                     | 7     | for components, edit the message the component was attached to                                                |

\* Only valid for [component-based](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/) interactions

###### Interaction Callback Data Structure

Not all message fields are currently supported.

| Name              | Type                                                                | Description                                                                                    |
| ----------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| tts?              | boolean                                                             | is the response TTS                                                                            |
| content?          | string                                                              | message content                                                                                |
| embeds?           | array of [embeds](#DOCS_RESOURCES_CHANNEL/embed-object)             | supports up to 10 embeds                                                                       |
| allowed_mentions? | [allowed mentions](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object) | [allowed mentions](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object) object                     |
| flags?            | integer                                                             | [interaction callback data flags](interaction-response-object-interaction-callback-data-flags) |
| components?       | array of [components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/)       | message components                                                                             |

###### Interaction Callback Data Flags

| Name      | Value  | Description                                    |
| --------- | ------ | ---------------------------------------------- |
| EPHEMERAL | 1 << 6 | only the user receiving the message can see it |

### Message Interaction Object

This is sent on the [message object](#DOCS_RESOURCES_CHANNEL/message-object) when the message is a response to an Interaction without an existing message.

> info
> This means responses to [Message Components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/) do not include this property, instead inlcuding a [message reference](#DOCS_RESOURCES_CHANNEL/message-reference-object-message-reference-structure) object as components _always_ exist on preexisting messages.

###### Message Interaction Structure

| Name | Type                                                                                                | Description                                                                                                                       |
| ---- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| id   | snowflake                                                                                           | id of the interaction                                                                                                             |
| type | [interaction type](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-type) | the type of interaction                                                                                                           |
| name | string                                                                                              | the name of the [application command](#DOCS_INTERACTIONS_SLASH_COMMANDS/application-command-object-application-command-structure) |
| user | [user object](#DOCS_RESOURCES_USER/user-object)                                                     | the user who invoked the interaction                                                                                              |