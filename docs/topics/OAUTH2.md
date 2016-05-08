# OAuth2

OAuth2 enables application developers to build applications that utilize authentication and data from the Discord API. Within the Discord platform, there are two types of oauth2 authentication, "full stack" or "application" auth and bot auth. The former is what is most people will recognize as generic OAuth2, and allows the developer to authenticate and make certain requests on behalf of a user. The latter enables bot creators to have an easy, callback/server-free flow for giving users the ability to add their bot to servers they own.

## Bot vs User Accounts

Bots within the Discord API are a separate type of users that are owned by applications (which are owned by users), and authenticate to the system using a token rather than a username and password. Anybody wishing to create a public bot **must** use a bot account and the OAuth2 API. Accounts violating this and using normal user accounts for public bots will be suspended and forced to use a bot account for their bot. Bot accounts have some differences and limitations to normal accounts, namely:

1. Bots cannot utilize the friends list feature.
2. Bots cannot accept invites.
3. Bots are not limited to a maximum of 100 guilds.
4. Bots have a per-server rather than global rate limit.

## Implementing OAuth2

### Registering Applications

The first step in implementing OAuth2 is [registering a developer application](#MY_APPLICATIONS/top), and retrieving your client ID and client secret. Most people who will be implementing OAuth2 will want to find and utilize a library in the language of their choice. For those implementing OAuth2 from scratch, please see [RFC 6749](https://tools.ietf.org/html/rfc6749) for details. In the Discord OAuth2 API, it's technically valid to _not_ have a redirect URI for your application, this enables one-sided authentication flows which allow for server-less bot-adding. The URLs for OAuth2 are as follows:

###### OAuth2 Application URLs

| URL | Description |
|-----|-------------|
| https://discordapp.com/api/oauth2/authorize | Base authorization URL |
| https://discordapp.com/api/oauth2/token | Token URL |

>info
> Discord also implements refresh tokens, which can be passed to the token URL for valid authentication tokens.

### Scopes

Scopes provide access to certain resources of a users account. Your API client or service should only request scopes it requires for operation.

###### OAuth2 Scopes

| Name | Description |
|------|-------------|
| identify | allows [/users/@me](#DOCS_USER/get-current-user) without `email` |
| email | enables [/users/@me](#DOCS_USER/get-current-user) to return an `email` |
| connections | allows [/users/@me/connections](#DOCS_USER/get-user-connections) to return linked Twitch and Youtube accounts. |
| guilds | allows [/users/@me/guilds](#DOCS_USER/get-current-user-guilds) to return basic information about all of a users guilds |
| guilds.join | allows [/invites/{invite.id}](#DOCS_INVITE/accept-invite) to be used for joining a users guild |
| bot | for oauth2 bots, this puts the bot in the users selected guild by default |

## Bots

Bots within the Discord API are a form of user account that is authenticated _without_ a username or password, and has similar properties and abilities to normal user accounts. Bot accounts enable developers to have a simple portal that allows authenticated users to add third-party bots to servers they own or manage.

### Registering Bots

Bots can be registered by clicking the "add bot" button when editing or creating an [OAuth2 application](#MY_APPLICATIONS/top).

### Adding Bots to Guilds

A URL can be generated that redirects authenticated users to the add-bot flow, by using the following format (this utilizes the OAuth2 authentication flow, without a callback URL):

```
https://discordapp.com/oauth2/authorize?client_id=157730590492196864&scope=bot&permissions=0
```

Where `client_id` is your _bot_ applications ID, and permissions is an integer following the [permissions](#DOCS_PERMISSIONS/bitwise-permission-flags) format.
