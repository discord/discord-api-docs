# OAuth2

OAuth2 enables application developers to build applications that utilize authentication and data from the Discord API. Within the Discord platform, there are two types of oauth2 authentication, "full stack" or "application" auth and bot auth. The former is what is most people will recognize as generic OAuth2, and allows the developer to authenticate and make certain requests on behalf of a user. The latter enables bot creators to have an easy, callback/server-free flow for giving users the ability to add their bot to servers they own.

## Bot vs User Accounts

Bots within the Discord API are a separate type of users that are owned by applications (which are owned by users), and authenticate to the system using a token rather than a username and password. Anybody wishing to create a public bot **must** use a bot account and the OAuth2 API. Accounts violating this and using normal user accounts for public bots will be suspended and forced to use a bot account for their bot. Bot accounts have some differences and limitations to normal accounts, namely:

1. Bots cannot utilize the friends list feature.
2. Bots cannot accept invites.
3. Bots are not limited to a maximum of 100 guilds.
4. Bots have a per-channel and a global rate limit.

## Implementing OAuth2

### Registering Applications

The first step in implementing OAuth2 is [registering a developer application](#MY_APPLICATIONS/top), and retrieving your client ID and client secret. Most people who will be implementing OAuth2 will want to find and utilize a library in the language of their choice. For those implementing OAuth2 from scratch, please see [RFC 6749](https://tools.ietf.org/html/rfc6749) for details. In the Discord OAuth2 API, it's technically valid to _not_ have a redirect URI for your application, this enables one-sided authentication flows which allow for server-less bot-adding. The URLs for OAuth2 are as follows:

###### OAuth2 Application URLs

| URL | Description |
|-----|-------------|
| https://discordapp.com/api/oauth2/authorize | Base authorization URL |
| https://discordapp.com/api/oauth2/token | Token URL |
| https://discordapp.com/api/oauth2/token/revoke | Revocation URL |


>info
> Discord also implements refresh tokens, which can be passed to the token URL for valid authentication tokens.

### Scopes

Scopes provide access to certain resources of a user's account. Your API client or service should only request scopes it requires for operation.

###### OAuth2 Scopes

| Name | Description |
|------|-------------|
| bot | for oauth2 bots, this puts the bot in the user's selected guild by default |
| connections | allows [/users/@me/connections](#DOCS_USER/get-user-connections) to return linked Twitch and YouTube accounts |
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

##### A note on `guilds.join`

`guilds.join` requires you to have a bot account linked to the application, unlike the rest of the scopes. Additionally, you may only join users to servers your bot is in.

## Bots

Bots within the Discord API are a form of user account that is authenticated _without_ a username or password, and has similar properties and abilities to normal user accounts. Bot accounts enable developers to have a simple portal that allows authenticated users to add third-party bots to servers they own or manage.

### Registering Bots

Bots can be registered by clicking the "add bot" button when editing or creating an [OAuth2 application](#MY_APPLICATIONS/top).

### Two-Factor Authentication Requirement

For bots with [elevated permissions](#DOCS_PERMISSIONS/bitwise-permission-flags) (permissions with a * next to them), we enforce two-factor authentication for the owner's account when used on guilds that have server-wide 2FA enabled.

### Adding Bots to Guilds

A URL can be generated that redirects authenticated users to the add-bot flow, by using the following format (this utilizes the OAuth2 authentication flow, without a callback URL):

```
https://discordapp.com/api/oauth2/authorize?client_id=157730590492196864&scope=bot&permissions=0
```

`client_id` is your _bot_ application's ID and permissions is an integer following the [permissions](#DOCS_PERMISSIONS/bitwise-permission-flags) format.

### Adding Webhooks to Channels

A URL can be generated that redirects authenticated users to the add-webhook flow, by using the following format (this utilizes the OAuth2 authentication authorization code flow, which requires a server-side application):

```
https://discordapp.com/api/oauth2/authorize?client_id=157730590492196864&scope=webhook.incoming&redirect_uri=https%3A%2F%2Fnicememe.website&response_type=code
```

`client_id` is your application's ID and `redirect_uri` is one of your application's URL-encoded redirect URIs.

When a user is directed to this URL, they are prompted to select a channel for the webhook to be placed in. Your application will receive an authorization code back in the querystring (as usual with the authorization code grant). 

When you exchange the authorization code for an access token, the token response will contain the [webhook object](#DOCS_WEBHOOK/webhook-object):

```json
{
	"token_type": "Bearer",
	"access_token": "7r70pJOvarwv1fkPqacZqFOCv39tX2",
	"scope": "webhook.incoming",
	"expires_in": 604800,
	"refresh_token": "TY0U8LP8joJURIhqREL4AuQXcj5DlO",
	"webhook": {
		"name": "test",
		"channel_id": "199737254929760256",
		"token": "DuAt6zzLQpPhaAq0IcnCrDUWWpY9Y07dqkB5ulLkhwpA00ZK7IjLve5AE4ACUZqCUTY8",
		"avatar": "eaa0292a003ceb15264a838a8eff961a",
		"guild_id": "199737254929760256",
		"id": "236380988341485568"
	}
}
```

### Get Current Application Information % GET /oauth2/applications/@me

Returns the bot's OAuth2 application info.

###### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | the id of the app |
| name | string | the name of the app |
| icon | string? | the icon hash of the app |
| description | string? | the description of the app |
| rpc_origins? | array | an array of rpc origin url strings, if rpc is enabled |
| bot_public | boolean | when false only app owner can join the app's bot to guilds |
| bot_require_code_grant | boolean | when true the app's bot will only join upon completion of the full oauth2 code grant flow |
| owner | [User](#DOCS_USER/user-object) | partial user object containing info on the owner of the application |

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
