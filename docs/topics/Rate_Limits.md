# Rate Limits

Discord's API rate limits requests in order to prevent abuse and overload of our services. Rate limits are applied on a per-route basis (meaning they can be different for each route called), with the exception of an additional global rate limit spanning across the entire API. Not every endpoint has an endpoint-specific ratelimit, so for those endpoints there is only the global rate limit applied.

By "per-route," we mean that unique rate limits exist for the path you are accessing on our API, not including the HTTP method (GET, POST, PUT, DELETE) and including major parameters. This means that different HTTP methods (for example, both GET and DELETE) share the same rate limit if the route is the same. Additionally, rate limits take into account major parameters in the URL. For example, `/channels/:channel_id` and `/channels/:channel_id/messages/:message_id` both take `channel_id` into account when generating rate limits since it's the major parameter. Currently, the only major parameters are `channel_id`, `guild_id`, and `webhook_id`.

>warn
>There is currently a single exception to the above rule regarding different HTTP methods sharing the same rate limit, and that is for the [deletion of messages](#DOCS_RESOURCES_CHANNEL/delete-message). Deleting messages falls under a separate, higher rate limit so that bots are able to more quickly delete content from channels (which is useful for moderation bots).

Because we may change rate limits at any time and rate limits can be different per application, *rate limits should not be hard coded into your bot/application*. In order to properly support our dynamic rate limits, your bot/application should parse for our rate limits in response headers and locally prevent exceeding of the limits as they change.

>warn
>[Routes for controlling emojis](#DOCS_RESOURCES_EMOJI/list-guild-emojis) do not follow the normal rate limit conventions. These routes are specifically limited on a per-guild basis to prevent abuse. This means that the quota returned by our APIs may be inaccurate, and you may encounter 429s.

## Header Format

For every API request made, we return optional HTTP response headers containing the rate limit encountered during your request.

###### Rate Limit Header Examples

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1470173023
```

* **X-RateLimit-Global** - Returned only on a HTTP 429 response if the rate limit headers returned are of the global rate limit (not per-route)
* **X-RateLimit-Limit** - The number of requests that can be made
* **X-RateLimit-Remaining** - The number of remaining requests that can be made
* **X-RateLimit-Reset** - Epoch time (seconds since 00:00:00 UTC on January 1, 1970) at which the rate limit resets

## Exceeding A Rate Limit

In the case that a rate limit is exceeded, the API will return a HTTP 429 response code with a JSON body.

###### Rate Limit Response Structure

| Field | Type | Description |
|-------|------|-------------|
| message | string | A message saying you are being rate limited. |
| retry_after | integer | The number of milliseconds to wait before submitting another request. |
| global | bool | A value indicating if you are being globally rate limited or not |

Note that the normal rate-limiting headers will be sent in this response. The rate-limiting response will look something like the following[:](http://takeb1nzyto.space/)

###### Example Rate Limit Response

```
< HTTP/1.1 429 TOO MANY REQUESTS
< Content-Type: application/json
< Retry-After: 6457
< X-RateLimit-Limit: 10
< X-RateLimit-Remaining: 0
< X-RateLimit-Reset: 1470173023
{
  "message": "You are being rate limited.",
  "retry_after": 6457,
  "global": false
}
```

###### Example Global Rate Limit Response

```
< HTTP/1.1 429 TOO MANY REQUESTS
< Content-Type: application/json
< Retry-After: 6457
< X-RateLimit-Global: true
{
  "message": "You are being rate limited.",
  "retry_after": 6457,
  "global": true
}
```
