# OAuth2

OAuth2 enables application developers to build applications that utilize authentication and data from the Discord API. Within Discord, there are multiple types of OAuth2 authentication. We support the authorization code grant, the implicit grant, client credentials, and some modified special-for-Discord flows for Bots and Webhooks.

## Shared Resources

The first step in implementing OAuth2 is [registering a developer application](#APPLICATIONS) and retrieving your client ID and client secret. Most people who will be implementing OAuth2 will want to find and utilize a library in the language of their choice. For those implementing OAuth2 from scratch, please see [RFC 6749](https://tools.ietf.org/html/rfc6749) for details. After you create your application with Discord, make sure that you have your `client_id` and `client_secret` handy. The next step is to figure out which OAuth2 flow is right for your purposes.

###### OAuth2 URLs

| URL                                         | Description                                                 |
| ------------------------------------------- | ----------------------------------------------------------- |
| https://discord.com/api/oauth2/authorize    | Base authorization URL                                      |
| https://discord.com/api/oauth2/token        | Token URL                                                   |
| https://discord.com/api/oauth2/token/revoke | [Token Revocation](https://tools.ietf.org/html/rfc7009) URL |

> warn
> In accordance with the relevant RFCs, the token and token revocation URLs will **only** accept a content type of `application/x-www-form-urlencoded`. JSON content is not permitted and will return an error.

###### OAuth2 Scopes

These are a list of all the OAuth2 scopes that Discord supports. Some scopes require approval from Discord to use. Requesting them from a user without approval from Discord may cause errors or undocumented behavior in the OAuth2 flow.

| Name                         | Description                                                                                                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| activities.read              | allows your app to fetch data from a user's "Now Playing/Recently Played" list - requires Discord approval                                                                               |
| activities.write             | allows your app to update a user's activity - requires Discord approval (NOT REQUIRED FOR [GAMESDK ACTIVITY MANAGER](#DOCS_GAME_SDK_ACTIVITIES/))                                        |
| applications.builds.read     | allows your app to read build data for a user's applications                                                                                                                             |
| applications.builds.upload   | allows your app to upload/update builds for a user's applications - requires Discord approval                                                                                            |
| applications.commands        | allows your app to use [commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/) in a guild                                                                                                   |
| applications.commands.update | allows your app to update its [commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/) via this bearer token - [client credentials grant](#DOCS_TOPICS_OAUTH2/client-credentials-grant) only |
| applications.entitlements    | allows your app to read entitlements for a user's applications                                                                                                                           |
| applications.store.update    | allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications                                                                       |
| bot                          | for oauth2 bots, this puts the bot in the user's selected guild by default                                                                                                               |
| connections                  | allows [/users/@me/connections](#DOCS_RESOURCES_USER/get-user-connections) to return linked third-party accounts                                                                         |
| email                        | enables [/users/@me](#DOCS_RESOURCES_USER/get-current-user) to return an `email`                                                                                                         |
| gdm.join                     | allows your app to [join users to a group dm](#DOCS_RESOURCES_CHANNEL/group-dm-add-recipient)                                                                                            |
| guilds                       | allows [/users/@me/guilds](#DOCS_RESOURCES_USER/get-current-user-guilds) to return basic information about all of a user's guilds                                                        |
| guilds.join                  | allows [/guilds/{guild.id}/members/{user.id}](#DOCS_RESOURCES_GUILD/add-guild-member) to be used for joining users to a guild                                                            |
| guilds.members.read          | allows [/users/@me/guilds/{guild.id}/member](#DOCS_RESOURCES_USER/get-current-user-guild-member) to return a user's member information in a guild                                        |
| identify                     | allows [/users/@me](#DOCS_RESOURCES_USER/get-current-user) without `email`                                                                                                               |
| messages.read                | for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates)                                    |
| relationships.read           | allows your app to know a user's friends and implicit relationships - requires Discord approval                                                                                          |
| rpc                          | for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval                                                                        |
| rpc.activities.write         | for local rpc server access, this allows you to update a user's activity - requires Discord approval                                                                                     |
| rpc.notifications.read       | for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval                                                                 |
| rpc.voice.read               | for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval                                                     |
| rpc.voice.write              | for local rpc server access, this allows you to update a user's voice settings - requires Discord approval                                                                               |
| webhook.incoming             | this generates a webhook that is returned in the oauth token response for authorization code grants                                                                                      |

> info
> `guilds.join` and `bot` require you to have a bot account linked to your application. Also, in order to add a user to a guild, your bot has to already belong to that guild.

## State and Security

Before we dive into the semantics of the different OAuth2 grants, we should stop and discuss security, specifically the use of the `state` parameter. [Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery), or CSRF, and [Clickjacking](https://en.wikipedia.org/wiki/Clickjacking) are security vulnerabilities that must be addressed by individuals implementing OAuth. This is typically accomplished using the `state` parameter. `state` is sent in the authorization request and returned back in the response and should be a value that binds the user's request to their authenticated state. For example, `state` could be a hash of the user's session cookie, or some other nonce that can be linked to the user's session.

When a user begins an authorization flow on the client, a `state` is generated that is unique to that user's request. This value is stored somewhere only accessible to the client and the user, i.e. protected by the [same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy). When the user is redirected, the `state` parameter is returned. The client validates the request by checking that the `state` returned matches the stored value. If they match, it is a valid authorization request. If they do not match, it's possible that someone intercepted the request or otherwise falsely authorized themselves to another user's resources, and the request should be denied.

While Discord does not require the use of the `state` parameter, we support it and highly recommend that you implement it for the security of your own applications and data.

## Authorization Code Grant

The authorization code grant is what most developers will recognize as "standard OAuth2" and involves retrieving an access code and exchanging it for a user's access token. It allows the authorization server to act as an intermediary between the client and the resource owner, so the resource owner's credentials are never shared directly with the client.

###### Authorization URL Example

```
https://discord.com/api/oauth2/authorize?response_type=code&client_id=157730590492196864&scope=identify%20guilds.join&state=15773059ghq9183habn&redirect_uri=https%3A%2F%2Fnicememe.website&prompt=consent
```

`client_id` is your application's `client_id`. `scope` is a list of [OAuth2 scopes](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) separated by url encoded spaces (`%20`). `redirect_uri` is whatever URL you registered when creating your application, url-encoded. `state` is the unique string mentioned in [State and Security](#DOCS_TOPICS_OAUTH2/state-and-security).

When someone navigates to this URL, they will be prompted to authorize your application for the requested scopes. On acceptance, they will be redirected to your `redirect_uri`, which will contain an additional querystring parameter, `code`. `state` will also be returned if previously sent, and should be validated at this point.

`prompt` controls how the authorization flow handles existing authorizations. If a user has previously authorized your application with the requested scopes and prompt is set to `consent`, it will request them to reapprove their authorization. If set to `none`, it will skip the authorization screen and redirect them back to your redirect URI without requesting their authorization. For passthrough scopes, like `bot` and `webhook.incoming`, authorization is always required.

###### Redirect URL Example

```
https://nicememe.website/?code=NhhvTDYsFcdgNLnnLijcl7Ku7bEEeee&state=15773059ghq9183habn
```

`code` is now exchanged for the user's access token by making a `POST` request to the [token URL](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-urls) with the following parameters:

- `client_id` - your application's client id
- `client_secret` - your application's client secret
- `grant_type` - must be set to `authorization_code`
- `code` - the code from the querystring
- `redirect_uri` - your `redirect_uri`

###### Access Token Exchange Example

```python
import requests

API_ENDPOINT = 'https://discord.com/api/v8'
CLIENT_ID = '332269999912132097'
CLIENT_SECRET = '937it3ow87i4ery69876wqire'
REDIRECT_URI = 'https://nicememe.website'

def exchange_code(code):
  data = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': REDIRECT_URI
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers)
  r.raise_for_status()
  return r.json()
```

You can also pass your `client_id` and `client_secret` as basic authentication with `client_id` as the username and `client_secret` as the password. In response, you will receive:

###### Access Token Response

```json
{
  "access_token": "6qrZcUqja7812RVdnEKjpzOL4CvHBFG",
  "token_type": "Bearer",
  "expires_in": 604800,
  "refresh_token": "D43f5y0ahjqew82jZ4NViEr2YafMKhue",
  "scope": "identify"
}
```

Having the user's access token allows your application to make certain requests to the API on their behalf, restricted to whatever scopes were requested. `expires_in` is how long, in seconds, until the returned access token expires, allowing you to anticipate the expiration and refresh the token. To refresh, make another `POST` request to the [token URL](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-urls) with the following parameters:

- `client_id` - your application's client id
- `client_secret` - your application's client secret
- `grant_type` - must be set to `refresh_token`
- `refresh_token` - the user's refresh token

###### Refresh Token Exchange Example

```python
import requests

API_ENDPOINT = 'https://discord.com/api/v8'
CLIENT_ID = '332269999912132097'
CLIENT_SECRET = '937it3ow87i4ery69876wqire'
REDIRECT_URI = 'https://nicememe.website'

def refresh_token(refresh_token):
  data = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers)
  r.raise_for_status()
  return r.json()
```

Boom; fresh [access token response](#DOCS_TOPICS_OAUTH2/authorization-code-grant-access-token-response)!

## Implicit Grant

The implicit OAuth2 grant is a simplified flow optimized for in-browser clients. Instead of issuing the client an authorization code to be exchanged for an access token, the client is directly issued an access token. The URL is formatted as follows:

###### Authorization URL Example

```
https://discord.com/api/oauth2/authorize?response_type=token&client_id=290926444748734499&state=15773059ghq9183habn&scope=identify
```

On redirect, your redirect URI will contain additional **URI fragments**: `access_token`, `token_type`, `expires_in`, `scope`, and [`state`](#DOCS_TOPICS_OAUTH2/state-and-security)(if specified). **These are not querystring parameters.** Be mindful of the "#" character:

###### Redirect URL Example

```
https://findingfakeurlsisprettyhard.tv/#access_token=RTfP0OK99U3kbRtHOoKLmJbOn45PjL&token_type=Bearer&expires_in=604800&scope=identify&state=15773059ghq9183habn
```

There are tradeoffs in using the implicit grant flow. It is both quicker and easier to implement, but rather than exchanging a code and getting a token returned in a secure HTTP body, the access token is returned in the URI fragment, which makes it possibly exposed to unauthorized parties. **You also are not returned a refresh token, so the user must explicitly re-authorize once their token expires.**

## Client Credentials Grant

The client credential flow is a quick and easy way for bot developers to get their own bearer tokens for testing purposes. By making a `POST` request to the [token URL](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-urls) with a grant type of `client_credentials`, using Basic authentication with your client id as the username and your client secret as the password, you will be returned an access token for the bot owner. Therefore, always be super-extra-very-we-are-not-kidding-like-really-be-secure-make-sure-your-info-is-not-in-your-source-code careful with your `client_id` and `client_secret`. We don't take kindly to imposters around these parts.

You can specify scopes with the `scope` parameter, which is a list of [OAuth2 scopes](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) separated by spaces:

> info
> Team applications are limited to the `identify` and `applications.commands.update` scope, because teams are not bound to a specific user.

###### Client Credentials Token Request Example

```python
import base64
import requests

API_ENDPOINT = 'https://discord.com/api/v8'
CLIENT_ID = '332269999912132097'
CLIENT_SECRET = '937it3ow87i4ery69876wqire'

def get_token():
  data = {
    'grant_type': 'client_credentials',
    'scope': 'identify connections'
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers, auth=(CLIENT_ID, CLIENT_SECRET))
  r.raise_for_status()
  return r.json()
```

In return, you will receive an access token (without a refresh token):

###### Client Credentials Access Token Response

```json
{
  "access_token": "6qrZcUqja7812RVdnEKjpzOL4CvHBFG",
  "token_type": "Bearer",
  "expires_in": 604800,
  "scope": "identify connections"
}
```

## Bots

So, what are bot accounts?

### Bot vs User Accounts

Discord's API provides a separate type of user account dedicated to automation, called a bot account. Bot accounts can be created through the [applications page](#APPLICATIONS), and are authenticated using a token (rather than a username and password). Unlike the normal OAuth2 flow, bot accounts have full access to all API routes without using bearer tokens, and can connect to the [Real Time Gateway](#DOCS_TOPICS_GATEWAY/gateways). Automating normal user accounts (generally called "self-bots") outside of the OAuth2/bot API is forbidden, and can result in account termination if found.

Bot accounts have a few differences in comparison to normal user accounts, namely:

1. Bots are added to guilds through the OAuth2 API, and cannot accept normal invites.
2. Bots cannot have friends, nor be added to or join Group DMs.
3. Verified bots do not have a maximum number of Guilds.
4. Bots have an entirely separate set of [Rate Limits](#DOCS_TOPICS_RATE_LIMITS/rate-limits).

### Bot Authorization Flow

Bot authorization is a special server-less and callback-less OAuth2 flow that makes it easy for users to add bots to guilds. The URL you create looks similar to what we use for full stack implementation:

###### Bot Auth Parameters

| name                 | description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| client_id            | your app's client id                                                  |
| scope                | needs to include `bot` for the bot flow                               |
| permissions          | the [permissions](#DOCS_TOPICS_PERMISSIONS/) you're requesting        |
| guild_id             | pre-fills the dropdown picker with a guild for the user               |
| disable_guild_select | `true` or `false`—disallows the user from changing the guild dropdown |

###### URL Example

```
https://discord.com/api/oauth2/authorize?client_id=157730590492196864&scope=bot&permissions=1
```

In the case of bots, the `scope` parameter should be set to `bot`. There's also a new parameter, `permissions`, which is an integer corresponding to the [permission calculations](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) for the bot. You'll also notice the absence of `response_type` and `redirect_uri`. Bot authorization does not require these parameters because there is no need to retrieve the user's access token.

Additionally, if your bot provides [Application Commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS), you can add `applications.commands` to the URL's scopes, so that commands will be available in the guild.

When the user navigates to this page, they'll be prompted to add the bot to a guild in which they have proper permissions. On acceptance, the bot will be added. Super easy!

If you happen to already know the ID of the guild the user will add your bot to, you can provide this ID in the URL as a `guild_id=GUILD_ID` parameter.
When the authorization page loads, that guild will be preselected in the dialog if that user has permission to add the bot to that guild. You can use this in conjunction with the parameter `disable_guild_select=true` to disallow the user from picking a different guild.

If your bot is super specific to your private clubhouse, or you just don't like sharing, you can leave the `Public Bot` option unchecked in your application's settings. If unchecked, only you can add the bot to guilds. If marked as public, anyone with your bot's URL can add it to guilds in which they have proper permissions.

### Advanced Bot Authorization

Devs can extend the bot authorization functionality. You can request additional scopes outside of `bot` and `applications.commands`, which will prompt a continuation into a complete [authorization code grant flow](#DOCS_TOPICS_OAUTH2/authorization-code-grant) and add the ability to request the user's access token. If you request any scopes outside of `bot` and `applications.commands`, `response_type` is again mandatory; we will also automatically redirect the user to the first URI in your application's registered list unless `redirect_uri` is specified.

When receiving the access code on redirect, there will be additional querystring parameters of `guild_id` and `permissions`. The `guild_id` parameter should only be used as a hint as to the relationship between your bot and a guild. To be sure of the relationship between your bot and the guild, consider requiring the Oauth2 code grant in your bot's settings. Enabling it requires anyone adding your bot to a server to go through a full OAuth2 [authorization code grant flow](#DOCS_TOPICS_OAUTH2/authorization-code-grant). When you retrieve the user's access token, you'll also receive information about the guild to which your bot was added:

###### Extended Bot Authorization Access Token Example

```json
{
  "token_type": "Bearer",
  "guild": {
    "mfa_level": 0,
    "emojis": [],
    "application_id": null,
    "name": "SomeTest",
    "roles": [
      {
        "hoist": false,
        "name": "@everyone",
        "mentionable": false,
        "color": 0,
        "position": 0,
        "id": "290926798626357250",
        "managed": false,
        "permissions": 49794241,
        "permissions_new": "49794241"
      }
    ],
    "afk_timeout": 300,
    "system_channel_id": null,
    "widget_channel_id": null,
    "region": "us-east",
    "default_message_notifications": 1,
    "explicit_content_filter": 0,
    "splash": null,
    "features": [],
    "afk_channel_id": null,
    "widget_enabled": false,
    "verification_level": 0,
    "owner_id": "53908232999183680",
    "id": "2909267986347357250",
    "icon": null,
    "description": null,
    "public_updates_channel_id": null,
    "rules_channel_id": null,
    "max_members": 100000,
    "vanity_url_code": null,
    "premium_subscription_count": 0,
    "premium_tier": 0,
    "preferred_locale": "en-US",
    "system_channel_flags": 0,
    "banner": null,
    "max_presences": null,
    "discovery_splash": null,
    "max_video_channel_users": 25
  },
  "access_token": "zMndOe7jFLXGawdlxMOdNvXjjOce5X",
  "scope": "bot",
  "expires_in": 604800,
  "refresh_token": "mgp8qnvBwJcmadwgCYKyYD5CAzGAX4"
}
```

### Two-Factor Authentication Requirement

For bots with [elevated permissions](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) (permissions with a `*` next to them), we enforce two-factor authentication on the owner's account when added to guilds that have server-wide 2FA enabled.

## Webhooks

Discord's webhook flow is a specialized version of an [authorization code](#DOCS_TOPICS_OAUTH2/authorization-code-grant) implementation. In this case, the `scope` querystring parameter needs to be set to `webhook.incoming`:

###### URL Example

```
https://discord.com/api/oauth2/authorize?response_type=code&client_id=157730590492196864&scope=webhook.incoming&state=15773059ghq9183habn&redirect_uri=https%3A%2F%2Fnicememe.website
```

When the user navigates to this URL, they will be prompted to select a channel in which to allow the webhook. When the webhook is [executed](#DOCS_RESOURCES_WEBHOOK/execute-webhook), it will post its message into this channel. On acceptance, the user will be redirected to your `redirect_uri`. The URL will contain the `code` querystring parameter which should be [exchanged for an access token](#DOCS_TOPICS_OAUTH2/authorization-code-grant-access-token-exchange-example). In return, you will receive a slightly modified token response:

###### Webhook Token Response Example

```json
{
  "token_type": "Bearer",
  "access_token": "GNaVzEtATqdh173tNHEXY9ZYAuhiYxvy",
  "scope": "webhook.incoming",
  "expires_in": 604800,
  "refresh_token": "PvPL7ELyMDc1836457XCDh1Y8jPbRm",
  "webhook": {
    "application_id": "310954232226357250",
    "name": "testwebhook",
    "url": "https://discord.com/api/webhooks/347114750880120863/kKDdjXa1g9tKNs0-_yOwLyALC9gydEWP6gr9sHabuK1vuofjhQDDnlOclJeRIvYK-pj_",
    "channel_id": "345626669224982402",
    "token": "kKDdjXa1g9tKNs0-_yOwLyALC9gydEWP6gr9sHabuK1vuofjhQDDnlOclJeRIvYK-pj_",
    "type": 1,
    "avatar": null,
    "guild_id": "290926792226357250",
    "id": "347114750880120863"
  }
}
```

From this object, you should store the `webhook.token` and `webhook.id`. See the [execute webhook](#DOCS_RESOURCES_WEBHOOK/execute-webhook) documentation for how to send messages with the webhook.

Any user that wishes to add your webhook to their channel will need to go through the full OAuth2 flow. A new webhook is created each time, so you will need to save the token and id. If you wish to send a message to all your webhooks, you'll need to iterate over each stored id:token combination and make `POST` requests to each one. Be mindful of our [Rate Limits](#DOCS_TOPICS_RATE_LIMITS/rate-limits)!

## Get Current Bot Application Information % GET /oauth2/applications/@me

Returns the bot's [application](#DOCS_RESOURCES_APPLICATION/application-object) object.

## Get Current Authorization Information % GET /oauth2/@me

Returns info about the current authorization. Requires authentication with a bearer token.

###### Response Structure

| Field       | Type                                                                         | Description                                                                       |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| application | partial [application](#DOCS_RESOURCES_APPLICATION/application-object) object | the current application                                                           |
| scopes      | array of strings                                                             | the scopes the user has authorized the application for                            |
| expires     | ISO8601 timestamp                                                            | when the access token expires                                                     |
| user?       | [user](#DOCS_RESOURCES_USER/user-object) object                              | the user who has authorized, if the user has authorized with the `identify` scope |

###### Example Authorization Information

```json
{
    "application": {
        "id": "159799960412356608",
        "name": "AIRHORN SOLUTIONS",
        "icon": "f03590d3eb764081d154a66340ea7d6d",
        "description": "",
        "summary": "",
        "hook": true,
        "bot_public": true,
        "bot_require_code_grant": false,
        "verify_key": "c8cde6a3c8c6e49d86af3191287b3ce255872be1fff6dc285bdb420c06a2c3c8"
    },
    "scopes": [
        "guilds.join",
        "identify"
    ],
    "expires": "2021-01-23T02:33:17.017000+00:00",
    "user": {
        "id": "268473310986240001",
        "username": "Discord",
        "avatar": "f749bb0cbeeb26ef21eca719337d20f1",
        "discriminator": "0001",
        "public_flags": 131072
    }
}
```
