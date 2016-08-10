# Rate Limits

Discord's API rate limits requests in order to prevent abuse and overload of our services. Rate limits are applied on a per-method basis (meaning they can be different for each method called), with the exception of an additional global rate limit spanning across the entire API.

Because we may change rate limits at any time and rate limits can be different per application, rate limits should not be hard coded into your bot/application. In order to properly support our dynamic rate limits, your bot/application should parse for our rate limits in response headers and locally prevent exceeding of the limits as they change.

## Header Format

For every API request made, we return optional HTTP response headers containing the rate limit encountered during your request.

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1470173023
```

* **X-RateLimit-Global** - Returned only on a HTTP 429 response if the rate limit headers returned are of the global rate limit (not per-method)
* **X-RateLimit-Limit** - The number of requests that can be made
* **X-RateLimit-Remaining** - The number of remaining requests that can be made
* **X-RateLimit-Reset** - Epoch time (in seconds) at which the rate limit resets

## Exceeding A Rate Limit

In the case that a per-method rate limit is exceeded, we do return an HTTP 429 response from our server. It looks something like the following:

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

For a global rate limit, the response would look like:

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
