# API Reference

Discord's API is based around two core layers, a HTTPS/REST API for general operations, and persistent secure WebSocket based connection for sending and subscribing to real-time events. The most common use case of the Discord API will be providing a service, or access to a platform through the [OAuth2](https://oauth.net/2/) API.

###### Base URL

```
https://discord.com/api
```

## API Versioning

> danger
> Some API and Gateway versions are now non-functioning, and are labeled as discontinued in the table below for posterity. Trying to use these versions will fail and return 400 Bad Request.

Discord exposes different versions of our API. You can specify which version to use by including it in the request path like `https://discord.com/api/v{version_number}`. Omitting the version number from the route will route requests to the current default version (marked below accordingly). You can find the change log for the newest API version [here](https://discord.com/developers/docs/change-log).

###### API Versions

| Version | Status                           | Default |
|---------|----------------------------------|---------|
| 8       | Available                        |         |
| 7       | Doesn't look like anything to me |         |
| 6       | Deprecated                       | ✓       |
| 5       | Discontinued                     |         |
| 4       | Discontinued                     |         |
| 3       | Discontinued                     |         |

## Error Messages

In API v8, we've improved error formatting in form error responses. The response will tell you which json key contains the error, the error code, and a human readable error message. We will be frequently adding new error messages, so a complete list of errors is not feasible and would be almost instantly out of date. Here are some examples instead:

###### Array Error

```json
{
    "code": 50035,
    "errors": {
        "activities": {
            "0": {
                "platform": {
                    "_errors": [
                        {
                            "code": "BASE_TYPE_CHOICES",
                            "message": "Value must be one of ('desktop', 'android', 'ios')."
                        }
                    ]
                },
                "type": {
                    "_errors": [
                        {
                            "code": "BASE_TYPE_CHOICES",
                            "message": "Value must be one of (0, 1, 2, 3, 4, 5)."
                        }
                    ]
                }
            }
        }
    },
    "message": "Invalid Form Body"
}
```

###### Object Error

```json
{
    "code": 50035,
    "errors": {
        "access_token": {
            "_errors": [
                {
                    "code": "BASE_TYPE_REQUIRED",
                    "message": "This field is required"
                }
            ]
        }
    },
    "message": "Invalid Form Body"
}
```

## Authentication

Authenticating with the Discord API can be done in one of two ways:

1. Using a bot token gained by [registering a bot](#DOCS_TOPICS_OAUTH2/registering-applications), for more information on bots see [bots vs user accounts](#DOCS_TOPICS_OAUTH2/bot-vs-user-accounts).
2. Using an OAuth2 bearer token gained through the [OAuth2 API](#DOCS_TOPICS_OAUTH2/oauth2).

For all authentication types, authentication is performed with the `Authorization` HTTP header in the format `Authorization: TOKEN_TYPE TOKEN`.

###### Example Bot Token Authorization Header

```
Authorization: Bot MTk4NjIyNDgzNDcxOTI1MjQ4.Cl2FMQ.ZnCjm1XVW7vRze4b7Cq4se7kKWs
```

###### Example Bearer Token Authorization Header

```
Authorization: Bearer CZhtkLDpNYXgPH9Ml6shqh2OwykChw
```

## Encryption

All HTTP-layer services and protocols (e.g. HTTP, WebSocket) within the Discord API are using TLS 1.2.

## Snowflakes

Discord utilizes Twitter's [snowflake](https://github.com/twitter/snowflake/tree/snowflake-2010) format for uniquely identifiable descriptors (IDs). These IDs are guaranteed to be unique across all of Discord, except in some unique scenarios in which child objects share their parent's ID. Because Snowflake IDs are up to 64 bits in size (e.g. a uint64), they are always returned as strings in the HTTP API to prevent integer overflows in some languages. See [Gateway ETF/JSON](#DOCS_TOPICS_GATEWAY/etfjson) for more information regarding Gateway encoding.

###### Snowflake ID Broken Down in Binary

```
111111111111111111111111111111111111111111 11111 11111 111111111111
64                                         22    17    12          0
```

###### Snowflake ID Format Structure (Left to Right)

| Field               | Bits     | Number of bits | Description                                                                  | Retrieval                           |
|---------------------|----------|----------------|------------------------------------------------------------------------------|-------------------------------------|
| Timestamp           | 63 to 22 | 42 bits        | Milliseconds since Discord Epoch, the first second of 2015 or 1420070400000. | `(snowflake >> 22) + 1420070400000` |
| Internal worker ID  | 21 to 17 | 5 bits         |                                                                              | `(snowflake & 0x3E0000) >> 17`      |
| Internal process ID | 16 to 12 | 5 bits         |                                                                              | `(snowflake & 0x1F000) >> 12`       |
| Increment           | 11 to 0  | 12 bits        | For every ID that is generated on that process, this number is incremented   | `snowflake & 0xFFF`                 |

### Convert Snowflake to DateTime

![Graphical representation of how a Snowflake is constructed](snowflake.png)

### Snowflake IDs in Pagination

We typically use snowflake IDs in many of our API routes for pagination. The standardized pagination paradigm we utilize is one in which you can specify IDs `before` and `after` in combination with `limit` to retrieve a desired page of results. You will want to refer to the specific endpoint documentation for details.

It is useful to note that snowflake IDs are just numbers with a timestamp, so when dealing with pagination where you want results from the beginning of time (in Discord Epoch, but `0` works here too) or before/after a specific time you can generate a snowflake ID for that time.

###### Generating a snowflake ID from a Timestamp Example

```
(timestamp_ms - DISCORD_EPOCH) << 22
```

## ID Serialization

There are some cases in which our API and Gateway may return IDs in an unexpected format. Internally, Discord stores IDs as integer snowflakes. When we serialize IDs to JSON, we transform `bigints` into strings. Given that all Discord IDs are snowflakes, you should always expect a string.

However, there are cases in which passing something to our API will instead return IDs serialized as an integer; this is the case when you send our API or Gateway a value in an `id` field that is not `bigint` size. For example, when requesting `GUILD_MEMBERS_CHUNK` from our gateway:

```
// Send
{
  op: 8,
  d: {
    guild_id: '308994132968210433',
    user_ids: [ '123123' ]
  }
}

// Receive
{
  t: 'GUILD_MEMBERS_CHUNK',
  s: 3,
  op: 0,
  d: {
    not_found: [ 123123 ],
    members: [],
    guild_id: '308994132968210433'
  }
}
```

You can see in this case that the sent `user_id` is not a `bigint`; therefore, when it is serialized back to JSON by Discord, it is not transformed into a string. **This will never happen with IDs that come from Discord.** But, this can happen if you send malformed data in your requests.

## ISO8601 Date/Time

Discord utilizes the [ISO8601 format](https://www.loc.gov/standards/datetime/iso-tc154-wg5_n0038_iso_wd_8601-1_2016-02-16.pdf) for most Date/Times returned in our models. This format is referred to as type `ISO8601` within tables in this documentation.

## Nullable and Optional Resource Fields

Resource fields that may contain a `null` value have types that are prefixed with a question mark.
Resource fields that are optional have names that are suffixed with a question mark.

###### Example Nullable and Optional Fields

| Field                        | Type    |
|------------------------------|---------|
| optional_field?              | string  |
| nullable_field               | ?string |
| optional_and_nullable_field? | ?string |

## Consistency

Discord operates at a scale where true consistency is impossible. Because of this, lots of operations in our API and in-between our services are [eventually consistent](https://en.wikipedia.org/wiki/Eventual_consistency). Due to this, client actions can never be serialized and may be executed in _any_ order (if executed at all). Along with these constraints, events in Discord may:

- Never be sent to a client
- Be sent _exactly_ one time to the client
- Be sent up to N times per client

Clients should operate on events and results from the API in as much of an idempotent behavior as possible.

## HTTP API

### User Agent

Clients using the HTTP API must provide a valid [User Agent](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.43) which specifies information about the client library and version in the following format:

###### User Agent Example

```
User-Agent: DiscordBot ($url, $versionNumber)
```

Clients may append more information and metadata to the _end_ of this string as they wish.

### Rate Limiting

The HTTP API implements a process for limiting and preventing excessive requests in accordance with [RFC 6585](https://tools.ietf.org/html/rfc6585#section-4). API users that regularly hit and ignore rate limits will have their API keys revoked, and be blocked from the platform. For more information on rate limiting of requests, please see the [Rate Limits](#DOCS_TOPICS_RATE_LIMITS/rate-limits) section.

## Gateway (WebSocket) API

Discord's Gateway API is used for maintaining persistent, stateful websocket connections between your client and our servers. These connections are used for sending and receiving real-time events your client can use to track and update local state. The Gateway API uses secure websocket connections as specified in [RFC 6455](https://tools.ietf.org/html/rfc6455). For information on opening Gateway connections, please see the [Gateway API](#DOCS_TOPICS_GATEWAY/gateways) section.

> warn
> A bot must connect to and identify with a gateway at least once before it can use the [Create Message](#DOCS_RESOURCES_CHANNEL/create-message) endpoint.
> If your only requirement is to send messages to a channel, consider using a [Webhook](#DOCS_RESOURCES_WEBHOOK) instead.

## Message Formatting

Discord utilizes a subset of markdown for rendering message content on its clients, while also adding some custom functionality to enable things like mentioning users and channels. This functionality uses the following formats:

###### Formats

| Type                    | Structure          | Example                      |
|-------------------------|--------------------|------------------------------|
| User                    | <@USER_ID>         | <@80351110224678912>         |
| User (Nickname)         | <@!USER_ID>        | <@!80351110224678912>        |
| Channel                 | <#CHANNEL_ID>      | <#103735883630395392>        |
| Role                    | <@&ROLE_ID>        | <@&165511591545143296>       |
| Standard Emoji          | Unicode Characters | 💯                           |
| Custom Emoji            | <:NAME:ID>         | <:mmLol:216154654256398347>  |
| Custom Emoji (Animated) | <a:NAME:ID>        | <a:b1nzy:392938283556143104> |

Using the markdown for either users, roles, or channels will usually mention the target(s) accordingly, but this can be suppressed using the `allowed_mentions` parameter when creating a message. Standard emoji are currently rendered using [Twemoji](https://twemoji.twitter.com/) for Desktop/Android and Apple's native emoji on iOS.

## Image Formatting

###### Image Base Url

```
https://cdn.discordapp.com/
```

Discord uses ids and hashes to render images in the client. These hashes can be retrieved through various API requests, like [Get User](#DOCS_RESOURCES_USER/get-user). Below are the formats, size limitations, and CDN endpoints for images in Discord. The returned format can be changed by changing the [extension name](#DOCS_REFERENCE/image-formatting-image-formats) at the end of the URL. The returned size can be changed by appending a querystring of `?size=desired_size` to the URL. Image size can be any power of two between 16 and 4096.

###### Image Formats

| Name | Extension   |
|------|-------------|
| JPEG | .jpg, .jpeg |
| PNG  | .png        |
| WebP | .webp       |
| GIF  | .gif        |

###### CDN Endpoints

| Type                   | Path                                                                                                                                                                                                                                    | Supports             |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| Custom Emoji           | emojis/[emoji_id](#DOCS_RESOURCES_EMOJI/emoji-object).png                                                                                                                                                                               | PNG, GIF             |
| Guild Icon             | icons/[guild_id](#DOCS_RESOURCES_GUILD/guild-object)/[guild_icon](#DOCS_RESOURCES_GUILD/guild-object).png \*                                                                                                                          | PNG, JPEG, WebP, GIF |
| Guild Splash           | splashes/[guild_id](#DOCS_RESOURCES_GUILD/guild-object)/[guild_splash](#DOCS_RESOURCES_GUILD/guild-object).png                                                                                                                          | PNG, JPEG, WebP      |
| Guild Discovery Splash | discovery-splashes/[guild_id](#DOCS_RESOURCES_GUILD/guild-object)/[guild_discovery_splash](#DOCS_RESOURCES_GUILD/guild-object).png                                                                                                      | PNG, JPEG, WebP      |
| Guild Banner           | banners/[guild_id](#DOCS_RESOURCES_GUILD/guild-object)/[guild_banner](#DOCS_RESOURCES_GUILD/guild-object).png                                                                                                                           | PNG, JPEG, WebP      |
| Default User Avatar    | embed/avatars/[user_discriminator](#DOCS_RESOURCES_USER/user-object).png \*\* \*\*\*                                                                                                                                                      | PNG                  |
| User Avatar            | avatars/[user_id](#DOCS_RESOURCES_USER/user-object)/[user_avatar](#DOCS_RESOURCES_USER/user-object).png \*                                                                                                                            | PNG, JPEG, WebP, GIF |
| Application Icon       | app-icons/[application_id](#APPLICATIONS/top)/[icon](#DOCS_TOPICS_OAUTH2/get-current-application-information).png                                                                                                                    | PNG, JPEG, WebP      |
| Application Asset      | app-assets/[application_id](#APPLICATIONS/top)/[asset_id](#DOCS_TOPICS_GATEWAY/activity-object-activity-assets).png                                                                                                                  | PNG, JPEG, WebP      |
| Achievement Icon       | app-assets/[application_id](#APPLICATIONS/top)/achievements/[achievement_id](#DOCS_GAME_SDK_ACHIEVEMENTS/data-models-user-achievement-struct)/icons/[icon_hash](#DOCS_GAME_SDK_ACHIEVEMENTS/data-models-user-achievement-struct).png | PNG, JPEG, WebP      |
| Team Icon              | team-icons/[team_id](#DOCS_TOPICS_TEAMS/team-object)/[team_icon](#DOCS_TOPICS_TEAMS/team-object).png                                                                                                                                    | PNG, JPEG, WebP      |

\* In the case of endpoints that support GIFs, the hash will begin with `a_` if it is available in GIF format. (example: `a_1269e74af4df7417b13759eae50c83dc`)

\*\* In the case of the Default User Avatar endpoint, the value for `user_discriminator` in the path should be the user's discriminator modulo 5—Test#1337 would be `1337 % 5`, which evaluates to 2.

\*\*\* In the case of the Default User Avatar endpoint, the size of images returned is constant with the "size" querystring parameter being ignored.

## Image Data

Image data is a [Data URI scheme](https://en.wikipedia.org/wiki/Data_URI_scheme) that supports JPG, GIF, and PNG formats. An example Data URI format is:

```
data:image/jpeg;base64,BASE64_ENCODED_JPEG_IMAGE_DATA
```

Ensure you use the proper content type (`image/jpeg`, `image/png`, `image/gif`) that matches the image data being provided.
