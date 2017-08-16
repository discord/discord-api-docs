# OAuth2

OAuth2 enables application developers to build applications that utilize authentication and data from the Discord API. Within Discord, there are multiple types of OAuth2 authentication. We support the authorization code grant, the implicit grant, client credentials, and some modified special-for-Discord flows for Bots and Webhooks. We've broken it down into sections:

1. [Full Stack](#DOCS_OAUTH2/full-stack)
  a. [Authorization Code](#DOCS_OAUTH2/full-stack-authorization-code)
  b. [Implicit](#DOCS_OAUTH2/full-stack-implicit)
  c. [Client Credentials](#DOCS_OAUTH2/full-stack-client-credentials)
2. [Bots](#DOCS_OAUTH2/bots)
3. [Webhooks](#DOCS_OAUTH2/webhooks)

Let's start with the shared resources between the flows.

## Shared Resources

The first step in implementing OAuth2 is [registering a developer application](#MY_APPLICATIONS/top), and retrieving your client ID and client secret. Most people who will be implementing OAuth2 will want to find and utilize a library in the language of their choice. For those implementing OAuth2 from scratch, please see [RFC 6749](https://tools.ietf.org/html/rfc6749) for details.

###### OAuth2 URLs

| URL | Description |
|-----|-------------|
| https://discordapp.com/api/oauth2/authorize | Base authorization URL |
| https://discordapp.com/api/oauth2/token | Token URL |
| https://discordapp.com/api/oauth2/token/revoke | Revocation URL |

>warn
>In accordance with [RFC 6749](https://tools.ietf.org/html/rfc6749), the [token URL](#DOCS_OAUTH2/shared-resources-oauth2-urls) **only** accepts a content type of `x-www-form-urlencoded`. JSON content is not permitted and will return an error.

###### OAuth2 Scopes

| Name | Description |
|------|-------------|
| bot | for oauth2 bots, this puts the bot in the user's selected guild by default |
| connections | allows [/users/@me/connections](#DOCS_USER/get-user-connections) to return linked third-party accounts |
| email | enables [/users/@me](#DOCS_USER/get-current-user) to return an `email` |
| identify | allows [/users/@me](#DOCS_USER/get-current-user) without `email` |
| guilds | allows [/users/@me/guilds](#DOCS_USER/get-current-user-guilds) to return basic information about all of a user's guilds |
| guilds.join | allows [/invites/{invite.id}](#DOCS_INVITE/accept-invite) to be used for joining users to a guild |
| gdm.join | allows your app to [join users to a group dm](#DOCS_CHANNEL/group-dm-add-recipient) |
| messages.read | for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates) |
| rpc | for local rpc server access, this allows you to control a user's local Discord client |
| rpc.api | for local rpc server api access, this allows you to access the API as the local user |
| rpc.notifications.read | for local rpc server api access, this allows you to receive notifications pushed out to the user |
| webhook.incoming | this generates a webhook that is returned in the oauth token response for authorization code grants |

>info
>Unlike the rest of the scopes, `guilds.join` requires you to have a bot account linked to your application and can only be used to join users to guilds which your bot services.

## Full Stack

After you create your application with Discord, make sure that you have your `client_id` and `client_secret` handy. The next step is to figure out which OAuth2 flow is right for your purposes:

### Authorization Code

The authorization code grant is the "fullest" and most secure of the OAuth2 flavors. It allows the authorization server to act as an intermediary between the client and the resource owner, so the resource owner's credentials are never shared directly with the client. This is what most developers will recognize as "standard OAuth2" and involves retrieving an access code and exchanging it for a user's access token.

###### Authorization Code URL Example

```
https://discordapp.com/oauth2/authorize?response_type=code&client_id=A&scope=B&redirect_uri=C
```

`client_id` is your application's `client_id`. `scope` is a list of [OAuth2 scopes](#DOCS_OAUTH2/shared-resources-oauth2-scopes) separated by '+'. `redirect_uri` is whatever URL you registered when creating your application, url-encoded. In practice, the entire URL will look something like this:

```
https://discordapp.com/oauth2/authorize?response_type=code&client_id=157730590492196864&scope=identify+guilds.join&redirect_uri=https%3A%2F%2Fnicememe.website
```

When someone navigates to this URL, they will be prompted to authorize your application for the requested scopes. On acceptance, they will be redirected to your `redirect_uri`, which will contain an additional querystring parameter, `code`. This should be exchanged for the user's access token by making a `POST` request to the [token URL](#DOCS_OAUTH2/shared-resources-oauth2-urls) with the following parameters:

- `client_id` - your application's client id
- `client_secret` - your application's client secret
- `grant_type` - must be set to `authorization_code`
- `code` - the code from the querystring
- `redirect_uri` - your `redirect_uri`

###### Access Token Exchange Example

```python
def exchangeCode(code):
  data = {
    'client_id': '332269999912132097',
    'client_secret': '456265548123452097',
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': 'https://nicememe.website'
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return requests.post('https://discordapp.com/api/oauth2/token', data, headers).json()
```

You can also pass your `client_id` and `client_secret` as an authentication header of type `Basic` and a value of the base64 encoded string formatted as "client\_id:client_secret":

###### Access Token Exchange Authentication Header Example

```python
import base64
def exchangeCode(code):
  data = {
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': 'https://nicememe.website'
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    'Authorization': 'Basic ' + base64.b64encode(b'332269999912132097:456265548123452097')
  }
  return requests.post('https://discordapp.com/api/oauth2/token', data, headers).json()
```

You will receive the following response:

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

Having the user's access token allows your application to make certain requests to the API on their behalf, restricted to whatever scopes were requested. `expires_in` is how long, in seconds, until the returned access token expires, allowing you to anticipate the expiration and refresh the token. To refresh, make another `POST` request to the [token URL](#DOCS_OAUTH2/shared-resources-oauth2-urls) with the following parameters:

- `client_id` - your application's client id
- `client_secret` - your application's client secret
- `grant_type` - must be set to `refresh_token`
- `refresh_token` - the user's refresh token
- `redirect_uri` - your `redirect_uri`

###### Refresh Token Exchange Example

```python
def refreshToken(refreshToken):
  data = {
    'client_id': '332269999912132097',
    'client_secret': '456265548123452097',
    'grant_type': 'refresh_token',
    'refresh_token': refreshToken,
    'redirect_uri': 'https://nicememe.website'
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return requests.post('https://discordapp.com/api/oauth2/token', data, headers).json()
```

You will receive a fresh [access token response](#DOCS_OAUTH2/full-stack-access-token-response) in response!

### Implicit

The implicit OAuth2 grant is a simplified flow optimized for in-browser clients. Instead of issuing the client an authorization code to be exchanged for an access token, the client is directly issued an access token. The URL is formatted as follows:

###### Implicit URL Example

```
https://discordapp.com/oauth2/authorize?response_type=token&client_id=A&scope=B
```

On redirect, your redirect URI will contain additional querystring parameters of `access_token`, `token_type`, `expires_in`, and `scope`. You will not receive a refresh token:

###### Implicit Redirect URL Example

```
https://myredirect.com/#access_token=A&token_type=Bearer&expires_in=B&scope=C
```

Be mindful of the "#" character before the `access_token` parameter when parsing the querystring.

There are tradeoffs in using the implicit grant flow. It is both quicker and easier to implement, but rather than exchanging a code and getting a token returned in a secure HTTP body, the access token is returned in the URI fragment, which makes it possibly exposed to unauthorized parties. If you choose to implement the implicit grant, we highly recommend using the `state` parameter to help protect against cross-site request forgery. You also are not returned a refresh token, so the user must explicitly re-authorize once their token expires.

### Client Credentials

The client credential flow is a quick and easy way for bot developers to get their own bearer tokens for testing purposes. By making a `POST` request to the [token URL](#DOCS_OAUTH2/shared-resources-oauth2-urls) with a grant type of `client_credentials`, you will be returned an access token for the currently logged in user. You can specify scopes with the option `scope` parameter, which is a list of [OAuth2 scopes](#DOCS_OAUTH2/shared-resources-oauth2-scopes) separated by spaces:

###### Client Credentials Token Request Example

```python
import base64
def getToken():
  data = {
    'grant_type': 'client_credentials',
    'scope': 'identify connections'
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    'Authorization': 'Basic ' + base64.b64encode(b'332269999912132097:456265548123452097')
  }
  return requests.post('https://discordapp.com/api/oauth2/token', data, headers).json()
```

In return, you will receive an access token without a refresh token:

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

Discord's API provides a seperate type of user account dedicated to automation, called a bot account. Bot accounts can be created through the [applications page](#MY_APPLICATIONS/top), and are authenticated using a token (rather than a username and password). Unlike the normal OAuth2 flow, bot accounts have full access to all API routes without using bearer tokens, and can connect to the [Real Time Gateway](#DOCS_GATEWAY/gateways). Automating normal user accounts (generally called "self-bots") outside of the OAuth2/bot API is forbidden, and can result in an account termination if found.

Bot accounts have a few differences in comparison to normal user accounts, namely:

1. Bots are added to servers through the OAuth2 API, and cannot accept normal invites.
2. Bots cannot have friends, nor be added to or join Group DMs.
3. Bots do not have a maximum number of Guilds (unlike user accounts, which are limited to 100).
4. Bots have an entirely separate set of [Rate Limits](#DOCS_RATE_LIMITS/rate-limits).

### Bot Auth Flow

Bot auth is a special server-less and callback-less OAuth2 flow that makes it easy for users to add bots to servers. The URL you create looks similar to what we use for full stack implementation:

```
https://discordapp.com/oauth2/authorize?client_id=157730590492196864&scope=bot&permissions=1
```

In the case of bots, the `scope` parameter should be set to `bot`. There's also a new parameter, `permissions`, which is an integer corresponding to the [permission calculations](#DOCS_PERMISSIONS/permissions-bitwise-permission-flags) for the bot. You'll also notice the absence of `response_type` and `redirect_uri`. Bot auth does not require these parameters because there is no need to retrieve the user's access token.

When the user navigates to this page, they'll be prompted to add the bot to a server in which they have proper permissions. On acceptance, the bot will be added. Super easy!

### Advanced Bot Auth

Enterprising devs can add some complexity to bot auth. You can request additional scopes outside of "bot", which will prompt a continuation into the [full stack](#DOCS_OAUTH2/full-stack) flow and add the ability to request the user's access token. If you continue into the full stack flow while including "bot" in your scopes, you'll get some additional querystring parameters on redirection: `guild_id`, the id of the guild to which the bot was added, and `permissions`, the permission integer from the original URL.

>info
>If you request any scopes outside of `bot`, the `response_type` and `redirect_uri` parameters are again mandatory.

## Wehbooks

Discord's webhook flow is a specialized version of a [full stack](#DOCS_OAUTH2/full-stack) implementation. In this case, the `scope` querystring parameter needs to be set to `webhook.incoming`:

```
https://discordapp.com/oauth2/authorize?response_type=code&client_id=157730590492196864&scope=webhook.incoming&redirect_uri=https%3A%2F%2Fnicememe.website
```

When the user navigates to this URL, they will be prompted to select a channel in which to allow the webhook. When the webhook is [executed](#DOCS_WEBHOOK/execute-webhook), it will post it's message into this channel. On acceptance, the user will be redirected to your `redirect_uri`. Much like the full stack flow, the URL will contain the `code` querystring parameter which should be [exchanged for an access token](#DOCS_OAUTH2/full-stack-access-token-exchange-example). In return, you will receive a slightly modified token response:

###### Webhook Token Response Example

```json
{
    "token_type": "Bearer",
    "access_token": "GNaVzEtATqdh173tNHEXY9ZYAuhiYxvy",
    "scope": "webhook.incoming",
    "expires_in": 604800,
    "refresh_token": "PvPL7ELyMDc1836457XCDh1Y8jPbRm",
    "webhook": {
        "name": "testwebhook",
        "url": "https://discordapp.com/api/webhooks/347114750880120863/kKDdjXa1g9tKNs0-_yOwLyALC9gydEWP6gr9sHabuK1vuofjhQDDnlOclJeRIvYK-pj_",
        "channel_id": "345626669224982402",
        "token": "kKDdjXa1g9tKNs0-_yOwLyALC9gydEWP6gr9sHabuK1vuofjhQDDnlOclJeRIvYK-pj_",
        "avatar": null,
        "guild_id": "290926792226357250",
        "id": "347114750880120863"
    }
}
```

You can ignore everything that is not the `webhook` object. Inside this object, what we really care about is `webhook.url`. This is the URL to which you will make POST requests in order to [execute your webhook](#DOCS_WEBHOOK/execute-webhook). Any user that wishes to add your webhook to their channel will need to go through the full OAuth flow, but it's not necessary to save the webhook information each time—it will be identical. Now, whenever you execute your webhook, everyone who's added it will see the message!

### Get Current Application Information % GET /oauth2/applications/@me

Returns the bot's OAuth2 application info.

###### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | the id of the app |
| name | string | the name of the app |
| icon? | string | the icon hash of the app |
| description? | string | the description of the app |
| rpc_origins? | array | an array of rpc origin url strings, if rpc is enabled |
| bot_public | bool | when false only app owner can join the app's bot to guilds |
| bot_require_code_grant | bool | when true the app's bot will only join upon completion of the full oauth2 code grant flow |
| owner | [user](#DOCS_USER/user-object) object | partial user object containing info on the owner of the application |

###### Example Application Information

```json
{
	"description": "Test",
	"icon": null,
	"id": "172150183260323840",
	"name": "Baba O-Riley",
	"bot_public": true,
	"bot_require_code_grant": false,
	"owner": {
		"username": "i own a bot",
		"discriminator": "1738",
		"id": "172150183260323840",
		"avatar": null
	}
}
```