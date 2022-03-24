# Opcodes and Status Codes

## Gateway

All gateway events in Discord are tagged with an opcode that denotes the payload type. Your connection to our gateway may also sometimes close. When it does, you will receive a close code that tells you what happened.

###### Gateway Opcodes

| Code | Name                  | Client Action | Description                                                                             |
|------|-----------------------|---------------|-----------------------------------------------------------------------------------------|
| 0    | Dispatch              | Receive       | An event was dispatched.                                                                |
| 1    | Heartbeat             | Send/Receive  | Fired periodically by the client to keep the connection alive.                          |
| 2    | Identify              | Send          | Starts a new session during the initial handshake.                                      |
| 3    | Presence Update       | Send          | Update the client's presence.                                                           |
| 4    | Voice State Update    | Send          | Used to join/leave or move between voice channels.                                      |
| 6    | Resume                | Send          | Resume a previous session that was disconnected.                                        |
| 7    | Reconnect             | Receive       | You should attempt to reconnect and resume immediately.                                 |
| 8    | Request Guild Members | Send          | Request information about offline guild members in a large guild.                       |
| 9    | Invalid Session       | Receive       | The session has been invalidated. You should reconnect and identify/resume accordingly. |
| 10   | Hello                 | Receive       | Sent immediately after connecting, contains the `heartbeat_interval` to use.            |
| 11   | Heartbeat ACK         | Receive       | Sent in response to receiving a heartbeat to acknowledge that it has been received.     |

###### Gateway Close Event Codes

In order to prevent broken reconnect loops, you should consider some close codes as a signal to stop reconnecting. This can be because your token expired, or your identification is invalid. This table explains what the application defined close codes for the gateway are, and which close codes you should not attempt to reconnect.


| Code | Description           | Explanation                                                                                                                                                                                                                      | Reconnect |
|------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| 4000 | Unknown error         | We're not sure what went wrong. Try reconnecting?                                                                                                                                                                                | true      |
| 4001 | Unknown opcode        | You sent an invalid [Gateway opcode](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway-gateway-opcodes) or an invalid payload for an opcode. Don't do that!                                                                          | true      |
| 4002 | Decode error          | You sent an invalid [payload](#DOCS_TOPICS_GATEWAY/sending-payloads) to us. Don't do that!                                                                                                                                       | true      |
| 4003 | Not authenticated     | You sent us a payload prior to [identifying](#DOCS_TOPICS_GATEWAY/identify).                                                                                                                                                     | true      |
| 4004 | Authentication failed | The account token sent with your [identify payload](#DOCS_TOPICS_GATEWAY/identify) is incorrect.                                                                                                                                 | false     |
| 4005 | Already authenticated | You sent more than one identify payload. Don't do that!                                                                                                                                                                          | true      |
| 4007 | Invalid `seq`         | The sequence sent when [resuming](#DOCS_TOPICS_GATEWAY/resume) the session was invalid. Reconnect and start a new session.                                                                                                       | true      |
| 4008 | Rate limited          | Woah nelly! You're sending payloads to us too quickly. Slow it down! You will be disconnected on receiving this.                                                                                                                 | true      |
| 4009 | Session timed out     | Your session timed out. Reconnect and start a new one.                                                                                                                                                                           | true      |
| 4010 | Invalid shard         | You sent us an invalid [shard when identifying](#DOCS_TOPICS_GATEWAY/sharding).                                                                                                                                                  | false     |
| 4011 | Sharding required     | The session would have handled too many guilds - you are required to [shard](#DOCS_TOPICS_GATEWAY/sharding) your connection in order to connect.                                                                                 | false     |
| 4012 | Invalid API version   | You sent an invalid version for the gateway.                                                                                                                                                                                     | false     |
| 4013 | Invalid intent(s)     | You sent an invalid intent for a [Gateway Intent](#DOCS_TOPICS_GATEWAY/gateway-intents). You may have incorrectly calculated the bitwise value.                                                                                  | false     |
| 4014 | Disallowed intent(s)  | You sent a disallowed intent for a [Gateway Intent](#DOCS_TOPICS_GATEWAY/gateway-intents). You may have tried to specify an intent that you [have not enabled or are not approved for](#DOCS_TOPICS_GATEWAY/privileged-intents). | false     |

## Voice

Our voice gateways have their own set of opcodes and close codes.

###### Voice Opcodes

| Code | Name                | Sent By           | Description                                              |
|------|---------------------|-------------------|----------------------------------------------------------|
| 0    | Identify            | client            | Begin a voice websocket connection.                      |
| 1    | Select Protocol     | client            | Select the voice protocol.                               |
| 2    | Ready               | server            | Complete the websocket handshake.                        |
| 3    | Heartbeat           | client            | Keep the websocket connection alive.                     |
| 4    | Session Description | server            | Describe the session.                                    |
| 5    | Speaking            | client and server | Indicate which users are speaking.                       |
| 6    | Heartbeat ACK       | server            | Sent to acknowledge a received client heartbeat.         |
| 7    | Resume              | client            | Resume a connection.                                     |
| 8    | Hello               | server            | Time to wait between sending heartbeats in milliseconds. |
| 9    | Resumed             | server            | Acknowledge a successful session resume.                 |
| 13   | Client Disconnect   | server            | A client has disconnected from the voice channel         |

###### Voice Close Event Codes

| Code | Description              | Explanation                                                                                                                                      |
|------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| 4001 | Unknown opcode           | You sent an invalid [opcode](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-voice-opcodes).                                                         |
| 4002 | Failed to decode payload | You sent a invalid payload in your [identifying](#DOCS_TOPICS_GATEWAY/identify) to the Gateway.                                                  |
| 4003 | Not authenticated        | You sent a payload before [identifying](#DOCS_TOPICS_GATEWAY/identify) with the Gateway.                                                         |
| 4004 | Authentication failed    | The token you sent in your [identify](#DOCS_TOPICS_GATEWAY/identify) payload is incorrect.                                                       |
| 4005 | Already authenticated    | You sent more than one [identify](#DOCS_TOPICS_GATEWAY/identify) payload. Stahp.                                                                 |
| 4006 | Session no longer valid  | Your session is no longer valid.                                                                                                                 |
| 4009 | Session timeout          | Your session has timed out.                                                                                                                      |
| 4011 | Server not found         | We can't find the server you're trying to connect to.                                                                                            |
| 4012 | Unknown protocol         | We didn't recognize the [protocol](#DOCS_TOPICS_VOICE_CONNECTIONS/establishing-a-voice-udp-connection-example-select-protocol-payload) you sent. |
| 4014 | Disconnected             | Channel was deleted, you were kicked, voice server changed, or the main gateway session was dropped. Should not reconnect.                       |
| 4015 | Voice server crashed     | The server crashed. Our bad! Try [resuming](#DOCS_TOPICS_VOICE_CONNECTIONS/resuming-voice-connection).                                           |
| 4016 | Unknown encryption mode  | We didn't recognize your [encryption](#DOCS_TOPICS_VOICE_CONNECTIONS/encrypting-and-sending-voice).                                              |

## HTTP

Our API will return semantically valid HTTP response codes based on the success of your request. The following table can be used as a reference for response codes it will return.

###### HTTP Response Codes

| Code                      | Meaning                                                                          |
|---------------------------|----------------------------------------------------------------------------------|
| 200 (OK)                  | The request completed successfully.                                              |
| 201 (CREATED)             | The entity was created successfully.                                             |
| 204 (NO CONTENT)          | The request completed successfully but returned no content.                      |
| 304 (NOT MODIFIED)        | The entity was not modified (no action was taken).                               |
| 400 (BAD REQUEST)         | The request was improperly formatted, or the server couldn't understand it.      |
| 401 (UNAUTHORIZED)        | The `Authorization` header was missing or invalid.                               |
| 403 (FORBIDDEN)           | The `Authorization` token you passed did not have permission to the resource.    |
| 404 (NOT FOUND)           | The resource at the location specified doesn't exist.                            |
| 405 (METHOD NOT ALLOWED)  | The HTTP method used is not valid for the location specified.                    |
| 429 (TOO MANY REQUESTS)   | You are being rate limited, see [Rate Limits](#DOCS_TOPICS_RATE_LIMITS).         |
| 502 (GATEWAY UNAVAILABLE) | There was not a gateway available to process your request. Wait a bit and retry. |
| 5xx (SERVER ERROR)        | The server had an error processing your request (these are rare).                |

## JSON

Along with the HTTP error code, our API can also return more detailed error codes through a `code` key in the JSON error response. The response will also contain a `message` key containing a more friendly error string. Some of these errors may include additional details in the form of [Error Messages](#DOCS_REFERENCE/error-messages) provided by an `errors` object.

###### JSON Error Codes

| Code   | Meaning                                                                                                                       |
|--------|-------------------------------------------------------------------------------------------------------------------------------|
| 0      | General error (such as a malformed request body, amongst other things)                                                        |
| 10001  | Unknown account                                                                                                               |
| 10002  | Unknown application                                                                                                           |
| 10003  | Unknown channel                                                                                                               |
| 10004  | Unknown guild                                                                                                                 |
| 10005  | Unknown integration                                                                                                           |
| 10006  | Unknown invite                                                                                                                |
| 10007  | Unknown member                                                                                                                |
| 10008  | Unknown message                                                                                                               |
| 10009  | Unknown permission overwrite                                                                                                  |
| 10010  | Unknown provider                                                                                                              |
| 10011  | Unknown role                                                                                                                  |
| 10012  | Unknown token                                                                                                                 |
| 10013  | Unknown user                                                                                                                  |
| 10014  | Unknown emoji                                                                                                                 |
| 10015  | Unknown webhook                                                                                                               |
| 10016  | Unknown webhook service                                                                                                       |
| 10020  | Unknown session                                                                                                               |
| 10026  | Unknown ban                                                                                                                   |
| 10027  | Unknown SKU                                                                                                                   |
| 10028  | Unknown Store Listing                                                                                                         |
| 10029  | Unknown entitlement                                                                                                           |
| 10030  | Unknown build                                                                                                                 |
| 10031  | Unknown lobby                                                                                                                 |
| 10032  | Unknown branch                                                                                                                |
| 10033  | Unknown store directory layout                                                                                                |
| 10036  | Unknown redistributable                                                                                                       |
| 10038  | Unknown gift code                                                                                                             |
| 10049  | Unknown stream                                                                                                                |
| 10050  | Unknown premium server subscribe cooldown                                                                                     |
| 10057  | Unknown guild template                                                                                                        |
| 10059  | Unknown discoverable server category                                                                                          |
| 10060  | Unknown sticker                                                                                                               |
| 10062  | Unknown interaction                                                                                                           |
| 10063  | Unknown application command                                                                                                   |
| 10065  | Unknown voice state                                                                                                           |
| 10066  | Unknown application command permissions                                                                                       |
| 10067  | Unknown Stage Instance                                                                                                        |
| 10068  | Unknown Guild Member Verification Form                                                                                        |
| 10069  | Unknown Guild Welcome Screen                                                                                                  |
| 10070  | Unknown Guild Scheduled Event                                                                                                 |
| 10071  | Unknown Guild Scheduled Event User                                                                                            |
| 20001  | Bots cannot use this endpoint                                                                                                 |
| 20002  | Only bots can use this endpoint                                                                                               |
| 20009  | Explicit content cannot be sent to the desired recipient(s)                                                                   |
| 20012  | You are not authorized to perform this action on this application                                                             |
| 20016  | This action cannot be performed due to slowmode rate limit                                                                    |
| 20018  | Only the owner of this account can perform this action                                                                        |
| 20022  | This message cannot be edited due to announcement rate limits                                                                 |
| 20028  | The channel you are writing has hit the write rate limit                                                                      |
| 20029  | The write action you are performing on the server has hit the write rate limit                                                |
| 20031  | Your Stage topic, server name, server description, or channel names contain words that are not allowed                        |
| 20035  | Guild premium subscription level too low                                                                                      |
| 30001  | Maximum number of guilds reached (100)                                                                                        |
| 30002  | Maximum number of friends reached (1000)                                                                                      |
| 30003  | Maximum number of pins reached for the channel (50)                                                                           |
| 30004  | Maximum number of recipients reached (10)                                                                                     |
| 30005  | Maximum number of guild roles reached (250)                                                                                   |
| 30007  | Maximum number of webhooks reached (10)                                                                                       |
| 30008  | Maximum number of emojis reached                                                                                              |
| 30010  | Maximum number of reactions reached (20)                                                                                      |
| 30013  | Maximum number of guild channels reached (500)                                                                                |
| 30015  | Maximum number of attachments in a message reached (10)                                                                       |
| 30016  | Maximum number of invites reached (1000)                                                                                      |
| 30018  | Maximum number of animated emojis reached                                                                                     |
| 30019  | Maximum number of server members reached                                                                                      |
| 30030  | Maximum number of server categories has been reached (5)                                                                      |
| 30031  | Guild already has a template                                                                                                  |
| 30033  | Max number of thread participants has been reached (1000)                                                                     |
| 30035  | Maximum number of bans for non-guild members have been exceeded                                                               |
| 30037  | Maximum number of bans fetches has been reached                                                                               |
| 30038  | Maximum number of uncompleted guild scheduled events reached (100)                                                            |
| 30039  | Maximum number of stickers reached                                                                                            |
| 30040  | Maximum number of prune requests has been reached. Try again later                                                            |
| 30042  | Maximum number of guild widget settings updates has been reached. Try again later                                             |
| 30046  | Maximum number of edits to messages older than 1 hour reached. Try again later                                                |
| 40001  | Unauthorized. Provide a valid token and try again                                                                             |
| 40002  | You need to verify your account in order to perform this action                                                               |
| 40003  | You are opening direct messages too fast                                                                                      |
| 40004  | Send messages has been temporarily disabled                                                                                   |
| 40005  | Request entity too large. Try sending something smaller in size                                                               |
| 40006  | This feature has been temporarily disabled server-side                                                                        |
| 40007  | The user is banned from this guild                                                                                            |
| 40032  | Target user is not connected to voice                                                                                         |
| 40033  | This message has already been crossposted                                                                                     |
| 40041  | An application command with that name already exists                                                                          |
| 40060  | Interaction has already been acknowledged                                                                                     |
| 50001  | Missing access                                                                                                                |
| 50002  | Invalid account type                                                                                                          |
| 50003  | Cannot execute action on a DM channel                                                                                         |
| 50004  | Guild widget disabled                                                                                                         |
| 50005  | Cannot edit a message authored by another user                                                                                |
| 50006  | Cannot send an empty message                                                                                                  |
| 50007  | Cannot send messages to this user                                                                                             |
| 50008  | Cannot send messages in a non-text channel                                                                                    |
| 50009  | Channel verification level is too high for you to gain access                                                                 |
| 50010  | OAuth2 application does not have a bot                                                                                        |
| 50011  | OAuth2 application limit reached                                                                                              |
| 50012  | Invalid OAuth2 state                                                                                                          |
| 50013  | You lack permissions to perform that action                                                                                   |
| 50014  | Invalid authentication token provided                                                                                         |
| 50015  | Note was too long                                                                                                             |
| 50016  | Provided too few or too many messages to delete. Must provide at least 2 and fewer than 100 messages to delete                |
| 50019  | A message can only be pinned to the channel it was sent in                                                                    |
| 50020  | Invite code was either invalid or taken                                                                                       |
| 50021  | Cannot execute action on a system message                                                                                     |
| 50024  | Cannot execute action on this channel type                                                                                    |
| 50025  | Invalid OAuth2 access token provided                                                                                          |
| 50026  | Missing required OAuth2 scope                                                                                                 |
| 50027  | Invalid webhook token provided                                                                                                |
| 50028  | Invalid role                                                                                                                  |
| 50033  | Invalid Recipient(s)                                                                                                          |
| 50034  | A message provided was too old to bulk delete                                                                                 |
| 50035  | Invalid form body (returned for both `application/json` and `multipart/form-data` bodies), or invalid `Content-Type` provided |
| 50036  | An invite was accepted to a guild the application's bot is not in                                                             |
| 50041  | Invalid API version provided                                                                                                  |
| 50045  | File uploaded exceeds the maximum size                                                                                        |
| 50046  | Invalid file uploaded                                                                                                         |
| 50054  | Cannot self-redeem this gift                                                                                                  |
| 50055  | Invalid Guild                                                                                                                 |
| 50068  | Invalid message type                                                                                                          |
| 50070  | Payment source required to redeem gift                                                                                        |
| 50074  | Cannot delete a channel required for Community guilds                                                                         |
| 50081  | Invalid sticker sent                                                                                                          |
| 50083  | Tried to perform an operation on an archived thread, such as editing a message or adding a user to the thread                 |
| 50084  | Invalid thread notification settings                                                                                          |
| 50085  | `before` value is earlier than the thread creation date                                                                       |
| 50086  | Community server channels must be text channels                                                                               |
| 50095  | This server is not available in your location                                                                                 |
| 50097  | This server needs monetization enabled in order to perform this action                                                        |
| 50101  | This server needs more boosts to perform this action                                                                          |
| 50109  | The request body contains invalid JSON.                                                                                       |
| 60003  | Two factor is required for this operation                                                                                     |
| 80004  | No users with DiscordTag exist                                                                                                |
| 90001  | Reaction was blocked                                                                                                          |
| 130000 | API resource is currently overloaded. Try again a little later                                                                |
| 150006 | The Stage is already open                                                                                                     |
| 160002 | Cannot reply without permission to read message history                                                                       |
| 160004 | A thread has already been created for this message                                                                            |
| 160005 | Thread is locked                                                                                                              |
| 160006 | Maximum number of active threads reached                                                                                      |
| 160007 | Maximum number of active announcement threads reached                                                                         |
| 170001 | Invalid JSON for uploaded Lottie file                                                                                         |
| 170002 | Uploaded Lotties cannot contain rasterized images such as PNG or JPEG                                                         |
| 170003 | Sticker maximum framerate exceeded                                                                                            |
| 170004 | Sticker frame count exceeds maximum of 1000 frames                                                                            |
| 170005 | Lottie animation maximum dimensions exceeded                                                                                  |
| 170006 | Sticker frame rate is either too small or too large                                                                           |
| 170007 | Sticker animation duration exceeds maximum of 5 seconds                                                                       |
| 180000 | Cannot update a finished event                                                                                                |
| 180002 | Failed to create stage needed for stage event                                                                                 |

###### Example JSON Error Response

```json
{
  "message": "Invalid authentication token",
  "code": 50014
}
```

## RPC

RPC is the [local Discord server](#DOCS_TOPICS_RPC/) running on localhost. Access to the RPC server requires approval from Discord.

###### RPC Error Codes

| Code | Name                               | Description                                                                           |
|------|------------------------------------|---------------------------------------------------------------------------------------|
| 1000 | Unknown error                      | An unknown error occurred.                                                            |
| 4000 | Invalid payload                    | You sent an invalid payload.                                                          |
| 4002 | Invalid command                    | Invalid command name specified.                                                       |
| 4003 | Invalid guild                      | Invalid guild ID specified.                                                           |
| 4004 | Invalid event                      | Invalid event name specified.                                                         |
| 4005 | Invalid channel                    | Invalid channel ID specified.                                                         |
| 4006 | Invalid permissions                | You lack permissions to access the given resource.                                    |
| 4007 | Invalid client ID                  | An invalid OAuth2 application ID was used to authorize or authenticate with.          |
| 4008 | Invalid origin                     | An invalid OAuth2 application origin was used to authorize or authenticate with.      |
| 4009 | Invalid token                      | An invalid OAuth2 token was used to authorize or authenticate with.                   |
| 4010 | Invalid user                       | The specified user ID was invalid.                                                    |
| 5000 | OAuth2 error                       | A standard OAuth2 error occurred; check the data object for the OAuth2 error details. |
| 5001 | Select channel timed out           | An asynchronous `SELECT_TEXT_CHANNEL`/`SELECT_VOICE_CHANNEL` command timed out.       |
| 5002 | `GET_GUILD` timed out              | An asynchronous `GET_GUILD` command timed out.                                        |
| 5003 | Select voice force required        | You tried to join a user to a voice channel but the user was already in one.          |
| 5004 | Capture shortcut already listening | You tried to capture more than one shortcut key at once.                              |

###### RPC Close Event Codes

| Code | Name              | Description                                                               |
|------|-------------------|---------------------------------------------------------------------------|
| 4000 | Invalid client ID | You connected to the RPC server with an invalid client ID.                |
| 4001 | Invalid origin    | You connected to the RPC server with an invalid origin.                   |
| 4002 | Rate limited      | You are being rate limited.                                               |
| 4003 | Token revoked     | The OAuth2 token associated with a connection was revoked, get a new one! |
| 4004 | Invalid version   | The RPC Server version specified in the connection string was not valid.  |
| 4005 | Invalid encoding  | The encoding specified in the connection string was not valid.            |
