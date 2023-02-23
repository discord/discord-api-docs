# Rate Limits

Rate limits exist across Discord's APIs to prevent spam, abuse, and service overload. Limits are applied to individual bots and users both on a per-route basis and globally. Individuals are determined using a request's authentication—for example, a bot token for a bot.

> info
> Because rate limits depend on a variety of factors and are subject to change, **rate limits should not be hard coded into your app**. Instead, your app should parse [response headers](#DOCS_TOPICS_RATE_LIMITS/header-format-rate-limit-header-examples) to prevent hitting the limit, and to respond accordingly in case you do.

**Per-route rate limits** exist for many individual endpoints, and may include the HTTP method (`GET`, `POST`, `PUT`, or `DELETE`). In some cases, per-route limits will be shared across a set of similar endpoints, indicated in the `X-RateLimit-Bucket` header. It's recommended to use this header as a unique identifier for a rate limit, which will allow you to group shared limits as you encounter them.

During calculation, per-route rate limits often account for top-level resources within the path using an identifier—for example, `guild_id` when calling [`/guilds/{guild.id}/channels`](#DOCS_RESOURCES_GUILD/get-guild-channels). Top-level resources are currently limited to channels (`channel_id`), guilds (`guild_id`), and webhooks (`webhook_id` or `webhook_id + webhook_token`). This means that an endpoint with two different top-level resources may calculate limits independently. As an example, if you exceeded a rate limit when calling one endpoint `/channels/1234`, you could still call another similar endpoint like `/channels/9876` without a problem.

**Global rate limits** apply to the total number of requests a bot or user makes, independent of any per-route limits. You can read more on [global rate limits](#DOCS_TOPICS_RATE_LIMITS/global-rate-limit) below.

> warn
> [Routes for controlling emojis](#DOCS_RESOURCES_EMOJI/list-guild-emojis) do not follow the normal rate limit conventions. These routes are specifically limited on a per-guild basis to prevent abuse. This means that the quota returned by our APIs may be inaccurate, and you may encounter 429s.

## Header Format

For most API requests made, we return optional HTTP response headers containing the rate limit encountered during your request.

###### Rate Limit Header Examples

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1470173023
X-RateLimit-Reset-After: 1
X-RateLimit-Bucket: abcd1234
```

- **X-RateLimit-Limit** - The number of requests that can be made
- **X-RateLimit-Remaining** - The number of remaining requests that can be made
- **X-RateLimit-Reset** - Epoch time (seconds since 00:00:00 UTC on January 1, 1970) at which the rate limit resets
- **X-RateLimit-Reset-After** - Total time (in seconds) of when the current rate limit bucket will reset. Can have decimals to match previous millisecond ratelimit precision
- **X-RateLimit-Bucket** - A unique string denoting the rate limit being encountered (non-inclusive of top-level resources in the path)
- **X-RateLimit-Global** - Returned only on HTTP 429 responses if the rate limit encountered is the global rate limit (not per-route)
- **X-RateLimit-Scope** - Returned only on HTTP 429 responses. Value can be `user` (per bot or user limit), `global` (per bot or user global limit), or `shared` (per resource limit)

## Exceeding A Rate Limit

In the case that a rate limit is exceeded, the API will return a HTTP 429 response code with a JSON body. Your application should rely on the `Retry-After` header or `retry_after` field to determine when to retry the request.

###### Rate Limit Response Structure

| Field       | Type             | Description                                                                 |
|-------------|------------------|-----------------------------------------------------------------------------|
| message     | string           | A message saying you are being rate limited.                                |
| retry_after | float            | The number of seconds to wait before submitting another request.            |
| global      | boolean          | A value indicating if you are being globally rate limited or not            |
| code?       | integer          | An [error code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/json) for some limits |

Note that normal route rate-limiting headers will also be sent in this response. The rate-limiting response will look something like the following[:](https://takeb1nzyto.space/)

###### Example Exceeded User Rate Limit Response

```
< HTTP/1.1 429 TOO MANY REQUESTS
< Content-Type: application/json
< Retry-After: 65
< X-RateLimit-Limit: 10
< X-RateLimit-Remaining: 0
< X-RateLimit-Reset: 1470173023.123
< X-RateLimit-Reset-After: 64.57
< X-RateLimit-Bucket: abcd1234
< X-RateLimit-Scope: user
{
  "message": "You are being rate limited.",
  "retry_after": 64.57,
  "global": false
}
```


###### Example Exceeded Resource Rate Limit Response

```
< HTTP/1.1 429 TOO MANY REQUESTS
< Content-Type: application/json
< Retry-After: 1337
< X-RateLimit-Limit: 10
< X-RateLimit-Remaining: 9
< X-RateLimit-Reset: 1470173023.123
< X-RateLimit-Reset-After: 64.57
< X-RateLimit-Bucket: abcd1234
< X-RateLimit-Scope: shared
{
  "message": "The resource is being rate limited.",
  "retry_after": 1336.57,
  "global": false
}
```

###### Example Exceeded Global Rate Limit Response

```
< HTTP/1.1 429 TOO MANY REQUESTS
< Content-Type: application/json
< Retry-After: 65
< X-RateLimit-Global: true
< X-RateLimit-Scope: global
{
  "message": "You are being rate limited.",
  "retry_after": 64.57,
  "global": true
}
```

## Global Rate Limit

All bots can make up to 50 requests per second to our API. If no authorization header is provided, then the limit is applied to the IP address. This is independent of any individual rate limit on a route. If your bot gets big enough, based on its functionality, it may be impossible to stay below 50 requests per second during normal operations.

Global rate limit issues generally show up as repeatedly getting banned from the Discord API when your bot starts (see below). If your bot gets temporarily Cloudflare banned from the Discord API every once in a while, it is most likely **not** a global rate limit issue. You probably had a spike of errors that was not properly handled and hit our error threshold.

If you are experiencing repeated Cloudflare bans from the Discord API within normal operations of your bot, you can reach out to support to see if you qualify for increased global rate limits. You can contact Discord support using [https://dis.gd/contact](https://dis.gd/contact).

[Interaction endpoints](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/endpoints) are not bound to the bot's Global Rate Limit.

## Invalid Request Limit aka Cloudflare bans

IP addresses that make too many invalid HTTP requests are automatically and temporarily restricted from accessing the Discord API. Currently, this limit is **10,000 per 10 minutes**. An invalid request is one that results in **401**, **403**, or **429** statuses.	

All applications should make reasonable attempts to avoid making invalid requests. For example:	

- **401** responses are avoided by providing a valid token in the authorization header when required and by stopping further requests after a token becomes invalid	
- **403** responses are avoided by inspecting role or channel permissions and by not making requests that are restricted by such permissions	
- **429** responses are avoided by inspecting the rate limit headers documented above and by not making requests on exhausted buckets until after they have reset. *429 errors returned with `X-RateLimit-Scope: shared` are not counted against you.*

Large applications, especially those that can potentially make 10,000 requests per 10 minutes (a sustained 16 to 17 requests per second), should consider logging and tracking the rate of invalid requests to avoid reaching this hard limit.

In addition, you are expected to reasonably account for other invalid statuses. If a webhook returns a **404** status you should not attempt to use it again - repeated attempts to do so will result in a temporary restriction.
