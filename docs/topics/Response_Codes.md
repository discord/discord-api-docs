# Response/Error Codes

## HTTP Response/Error Codes

Our API will return semantically valid HTTP response codes based on the success of your request. The following table can be used as a reference for response codes it will return.

###### HTTP Response/Error Code List

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
| 429 (TOO MANY REQUESTS) | You've made too many requests, see [Rate Limiting](#DOCS_REFERENCE/rate-limiting) |
| 502 (GATEWAY UNAVAILABLE) | There was not a gateway available to process your request. Wait a bit and retry |
| 5xx (SERVER ERROR) | The server had an error processing your request (these are rare) |

## JSON Error Response

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
| 20001 | Bots cannot use this endpoint |
| 20002 | Only bots can use this endpoint |
| 30001 | Maximum number of guilds reached (100) |
| 30002 | Maximum number of friends reached (1000) |
| 30003 | Maximum number of pins reached (50) |
| 30005 | Maximum number of guild roles reached (250) |
| 30010 | Too many reactions |
| 40001 | Unauthorized |
| 50001 | Missing access |
| 50002 | Invalid account type |
| 50003 | Cannot execute action on a DM channel |
| 50004 | Embed disabled |
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
| 50034 | A message provided was too old to bulk delete |
| 90001 | Reaction Blocked |

###### JSON Error Response Example

```json
{
    "code": 50014,
    "message": "Invalid authentication token"
}
```
