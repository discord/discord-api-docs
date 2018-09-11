# Opcodes and Status Codes

## Gateway

All gateway events in Discord are tagged with an opcode that denotes the payload type. Your connection to our gateway may also sometimes close. When it does, you will receive a close code that tells you what happened.

###### Gateway Opcodes

| Code | Name | Client Action | Description |
|------|------|------|-------------|
| 0 | Dispatch | Receive | dispatches an event |
| 1 | Heartbeat | Send/Receive | used for ping checking |
| 2 | Identify | Send | used for client handshake |
| 3 | Status Update | Send | used to update the client status |
| 4 | Voice State Update | Send | used to join/move/leave voice channels |
| 6 | Resume | Send | used to resume a closed connection |
| 7 | Reconnect | Receive | used to tell clients to reconnect to the gateway |
| 8 | Request Guild Members | Send | used to request guild members |
| 9 | Invalid Session | Receive | used to notify client they have an invalid session id |
| 10 | Hello | Receive | sent immediately after connecting, contains heartbeat and server debug information |
| 11 | Heartbeat ACK | Receive | sent immediately following a client heartbeat that was received |

###### Gateway Close Event Codes

| Code | Description | Explanation |
|------|-------------|-------------|
| 4000 | unknown error | We're not sure what went wrong. Try reconnecting? |
| 4001 | unknown opcode | You sent an invalid [Gateway opcode](#DOCS_TOPICS_GATEWAY/payloads-and-opcodes) or an invalid payload for an opcode. Don't do that! |
| 4002 | decode error | You sent an invalid [payload](#DOCS_TOPICS_GATEWAY/sending-payloads) to us. Don't do that! |
| 4003 | not authenticated | You sent us a payload prior to [identifying](#DOCS_TOPICS_GATEWAY/identify). |
| 4004 | authentication failed | The account token sent with your [identify payload](#DOCS_TOPICS_GATEWAY/identify) is incorrect. |
| 4005 | already authenticated | You sent more than one identify payload. Don't do that! |
| 4007 | invalid seq | The sequence sent when [resuming](#DOCS_TOPICS_GATEWAY/resume) the session was invalid. Reconnect and start a new session. |
| 4008 | rate limited | Woah nelly! You're sending payloads to us too quickly. Slow it down! |
| 4009 | session timeout | Your session timed out. Reconnect and start a new one. |
| 4010 | invalid shard | You sent us an invalid [shard when identifying](#DOCS_TOPICS_GATEWAY/sharding). |
| 4011 | sharding required | The session would have handled too many guilds - you are required to [shard](#DOCS_TOPICS_GATEWAY/sharding) your connection in order to connect. |

## Voice

Our voice gateways have their own set of opcodes and close codes.

###### Voice Opcodes

| Code | Name | Sent By | Description |
| ---- | ---- | ------- | ----------- |
| 0 | Identify | client | begin a voice websocket connection |
| 1 | Select Protocol | client | select the voice protocol |
| 2 | Ready | server | complete the websocket handshake |
| 3 | Heartbeat | client | keep the websocket connection alive |
| 4 | Session Description | server | describe the session |
| 5 | Speaking | client and server | indicate which users are speaking |
| 6 | Heartbeat ACK | server | sent immediately following a received client heartbeat |
| 7 | Resume | client | resume a connection |
| 8 | Hello | server | the continuous interval in milliseconds after which the client should send a heartbeat |
| 9 | Resumed | server | acknowledge Resume |
| 13 | Client Disconnect | server | a client has disconnected from the voice channel |

###### Voice Close Event Codes

| Code | Description | Explanation |
| ---- | ----------- | ----------- |
| 4001 | Unknown opcode | You sent an invalid [opcode](#DOCS_RESOURCES_VOICE_CONNECTIONS/voice-events-voice-opcodes). |
| 4003 | Not authenticated | You sent a payload before [identifying](#DOCS_TOPICS_GATEWAY/gateway-identify) with the Gateway. |
| 4004 | Authentication failed | The token you sent in your [identify](#DOCS_TOPICS_GATEWAY/gateway-identify) payload is incorrect. |
| 4005 | Already authenticated | You sent more than one [identify](#DOCS_TOPICS_GATEWAY/gateway-identify) payload. Stahp. |
| 4006 | Session no longer valid | Your session is no longer valid. |
| 4009 | Session timeout | Your session has timed out. |
| 4011 | Server not found | We can't find the server you're trying to connect to. |
| 4012 | Unknown Protocol | We didn't recognize the [protocol](#DOCS_RESOURCES_VOICE_CONNECTIONS/establishing-a-voice-udp-connection-example-select-protocol-payload) you sent. |
| 4014 | Disconnected | Oh no! You've been disconnected! Try [resuming](#DOCS_RESOURCES_VOICE_CONNECTIONS/resuming-voice-connection). |
| 4015 | Voice server crashed | The server crashed. Our bad! Try [resuming](#DOCS_RESOURCES_VOICE_CONNECTIONS/resuming-voice-connection). |
| 4016 | Unknown Encryption Mode | We didn't recognize your [encryption](#DOCS_RESOURCES_VOICE_CONNECTIONS/encrypting-and-sending-voice). |


## HTTP

Our API will return semantically valid HTTP response codes based on the success of your request. The following table can be used as a reference for response codes it will return.

###### HTTP Response Codes

| Code | Meaning |
|------|---------|
| 200 (OK) | The request completed successfully |
| 201 (CREATED) | The entity was created successfully |
| 204 (NO CONTENT) | The request completed successfully but returned no content |
| 304 (NOT MODIFIED) | The entity was not modified (no action was taken) |
| 400 (BAD REQUEST) | The request was improperly formatted, or the server couldn't understand it |
| 401 (UNAUTHORIZED) | The `Authorization` header was missing or invalid |
| 403 (FORBIDDEN) | The `Authorization` token you passed did not have permission to the resource |
| 404 (NOT FOUND) | The resource at the location specified doesn't exist |
| 405 (METHOD NOT ALLOWED) | The HTTP method used is not valid for the location specified |
| 429 (TOO MANY REQUESTS) | You've made too many requests, see [Rate Limits](#DOCS_TOPICS_RATE_LIMITS/rate-limits) |
| 502 (GATEWAY UNAVAILABLE) | There was not a gateway available to process your request. Wait a bit and retry |
| 5xx (SERVER ERROR) | The server had an error processing your request (these are rare) |

## JSON

Along with the HTTP error code, our API can also return more detailed error codes through a `code` key in the JSON error response. The response will also contain a `message` key containing a more friendly error string.

###### JSON Error Codes

| Code | Meaning |
|------|---------|
| 10001 | Unknown account |
| 10002 | Unknown application |
| 10003 | Unknown channel |
| 10004 | Unknown guild |
| 10005 | Unknown integration |
| 10006 | Unknown invite |
| 10007 | Unknown member |
| 10008 | Unknown message |
| 10009 | Unknown overwrite |
| 10010 | Unknown provider |
| 10011 | Unknown role |
| 10012 | Unknown token |
| 10013 | Unknown user |
| 10014 | Unknown Emoji |
| 10015 | Unknown Webhook |
| 20001 | Bots cannot use this endpoint |
| 20002 | Only bots can use this endpoint |
| 30001 | Maximum number of guilds reached (100) |
| 30002 | Maximum number of friends reached (1000) |
| 30003 | Maximum number of pins reached (50) |
| 30005 | Maximum number of guild roles reached (250) |
| 30010 | Maximum number of reactions reached (20) |
| 30013 | Maximum number of guild channels reached (500) |
| 40001 | Unauthorized |
| 50001 | Missing access |
| 50002 | Invalid account type |
| 50003 | Cannot execute action on a DM channel |
| 50004 | Widget Disabled |
| 50005 | Cannot edit a message authored by another user |
| 50006 | Cannot send an empty message |
| 50007 | Cannot send messages to this user |
| 50008 | Cannot send messages in a voice channel |
| 50009 | Channel verification level is too high |
| 50010 | OAuth2 application does not have a bot |
| 50011 | OAuth2 application limit reached |
| 50012 | Invalid OAuth state |
| 50013 | Missing permissions |
| 50014 | Invalid authentication token |
| 50015 | Note is too long |
| 50016 | Provided too few or too many messages to delete. Must provide at least 2 and fewer than 100 messages to delete. |
| 50019 | A message can only be pinned to the channel it was sent in |
| 50021 | Cannot execute action on a system message |
| 50025 | Invalid OAuth2 access token |
| 50034 | A message provided was too old to bulk delete |
| 50035 | Invalid Form Body |
| 50036 | An invite was accepted to a guild the application's bot is not in |
| 50041 | Invalid API version |
| 90001 | Reaction blocked |

###### Example JSON Error Response

```json
{
    "code": 50014,
    "message": "Invalid authentication token"
}
```

## RPC

RPC is the [local Discord server](#DOCS_TOPICS_RPC/) running on localhost. Access to the RPC server is gated behind a whitelist.

###### RPC Error Codes

| Code | Name | Description |
|--------|----------|-----------------|
| 1000 | Unknown Error | sent when an unknown error occurred |
| 4000 | Invalid Payload | sent when an invalid payload is received |
| 4002 | Invalid Command | sent when the command name specified is invalid |
| 4003 | Invalid Guild | sent when the guild id specified is invalid |
| 4004 | Invalid Event | sent when the event name specified is invalid |
| 4005 | Invalid Channel | sent when the channel id specified is invalid |
| 4006 | Invalid Permissions | sent when the user doesn't have the permission required to access the requested resource |
| 4007 | Invalid Client ID | sent when an invalid OAuth2 application ID is used to authorize or authenticate with |
| 4008 | Invalid Origin | sent when an invalid OAuth2 application origin is used to authorize or authenticate with |
| 4009 | Invalid Token | sent when an invalid OAuth2 token is used to authorize or authenticate with |
| 4010 | Invalid User | sent when the user id specified is invalid |
| 5000 | OAuth2 Error | sent when a standard OAuth2 error occurred; check the data object for the OAuth 2 error information |
| 5001 | Select Channel Timed Out | sent when an asyncronous SELECT_TEXT_CHANNEL/SELECT_VOICE_CHANNEL command times out |
| 5002 | Get Guild Timed Out | sent when an asyncronous GET_GUILD command times out |
| 5003 | Select Voice Force Required | sent when you try to join a user to a voice channel but the user is already in one |
| 5004 | Capture Shortcut Already Listening | sent when you try to capture a shortcut key when already capturing one |

###### RPC Close Event Codes

| Code | Name | Description |
|--------|----------|-----------------|
| 4000 | Invalid Client ID | sent when you connect to the RPC server with an invalid client ID |
| 4001 | Invalid Origin | sent when you connect to the RPC server with an invalid origin |
| 4002 | Ratelimited | sent when the RPC Server rejects your connection to a ratelimit |
| 4003 | Token Revoke | sent when the OAuth2 token associated with a connection is revoked |
| 4004 | Invalid Version | sent when the RPC Server version specified in the connection string is not valid |
| 4005 | Invalid Encoding | sent when the encoding specified in the connection string is not valid |
