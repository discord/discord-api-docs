# API Reference

Discord's API is based around two core layers, a HTTPS/REST API for general operations, and persistent secure websocket based connection for sending and subscribing to real-time events. The most common use case of the Discord API will be providing a service, or access to a platform through the [OAuth2](http://oauth.net/2/) API.

## Base URL

The base URL for all API requests is:

```
https://discordapp.com/api
```

## Authentication

Authenticating with the Discord API can be done in one of two ways:

1. Using a bot token gained by [registering a bot](#DOCS_OAUTH2/registering-applications).
2. Using an OAuth2 bearer token gained through the [OAuth2 API](#DOCS_OAUTH2/oauth2).

For all authentication types, authentication is performed with the `Authorization` HTTP header in the following format:

```
Authorization: TOKEN_TYPE TOKEN
```

### Example Authorization Headers

For bot tokens:

```
Authorization: Bot MTk4NjIyNDgzNDcxOTI1MjQ4.Cl2FMQ.ZnCjm1XVW7vRze4b7Cq4se7kKWs
```

For OAuth bearer tokens:

```
Authorization: Bearer CZhtkLDpNYXgPH9Ml6shqh2OwykChw
```

## Encryption

All HTTP-layer services and protocols (e.g. http, websocket) within the Discord API use TLS 1.2.

## Snowflake IDs

Discord utilizes Twitter's [snowflake](https://github.com/twitter/snowflake/tree/snowflake-2010) format for uniquely identifiable descriptors (ID's). These ID's are up to 64bits in size (e.g. a uint64) and therefore are always returned as strings in the API to prevent integer overflows in some languages. Snowflake ID's are guaranteed to be unique across all of Discord, except in some unique scenarios in which child objects share their parents ID.

## Consistency

Discord operates at a scale where true consistency is impossible. Because of this, lots of operations in our API and in-between our services are [eventually consistent](https://en.wikipedia.org/wiki/Eventual_consistency). Due to this, client actions can never be serialized and may be executed in _any_ order (if executed at all). Along with these constraints, events in Discord may:

- Never be sent to a client
- Be sent _exactly_ one time to the client
- Be sent up to N times per client

Clients should operate on events and results from the API in as much of a idempotent behavior as possible.

## HTTP API

### User Agent

Clients using the HTTP API must provide a valid [User Agent](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.43) which specifies information about the client library and version, in the following format:

```
User-Agent: DiscordBot ($url, $versionNumber)
```

### Rate Limiting

The HTTP API implements a process for limiting and preventing excessive requests in accordance with [RFC 6585](https://tools.ietf.org/html/rfc6585#section-4). API users that regularly hit and ignore rate limits will have their API keys revoked, and be blocked from the platform. For more information on rate limiting of requests, please see the [Rate Limits](#DOCS_RATE_LIMITS/rate-limits) section.

>warn
> A bot account must connect and identify to a [Gateway](#DOCS_GATEWAY/connecting) at least once before being able to send messages.

## Gateway (WebSocket) API

Discord's Gateway API is used for maintaining persistent, stateful websocket connections between your client and our servers. These connections are used for sending and receiving real-time events your client can use to track and update local state. The Gateway API uses secure websocket connections as specified in [RFC 6455](https://tools.ietf.org/html/rfc6455). For information on opening Gateway connections, please see the [Gateway API](#DOCS_GATEWAY/gateways) section.
