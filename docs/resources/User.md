# Users Resource

Users in Discord are generally considered the base entity. Users can spawn across the entire platform, be members of
guilds, participate in text and voice chat, and much more. Users are separated by a distinction of "bot" vs "normal." Although they are similar, bot users are automated users that are "owned" by another user. Unlike normal users, bot users do
_not_ have a limitation on the number of Guilds they can be a part of.

## Usernames and Nicknames

Discord enforces the following restrictions for usernames and nicknames:

1. Names can contain most valid unicode characters. We limit some zero-width and non-rendering characters.
2. Usernames must be between 2 and 32 characters long.
3. Nicknames must be between 1 and 32 characters long.
4. Names are sanitized and trimmed of leading, trailing, and excessive internal whitespace.

The following restrictions are additionally enforced for usernames:

1. Usernames cannot contain the following substrings: `@`, `#`, `:`, ` ``` `, `discord`
2. Usernames cannot be: `everyone`, `here`

There are other rules and restrictions not shared here for the sake of spam and abuse mitigation, but the majority of users won't encounter them. It's important to properly handle all error messages returned by Discord when editing or updating names.

### User Object

###### User Structure

| Field                   | Type                                                                                 | Description                                                                                          | Required OAuth2 Scope |
|-------------------------|--------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|-----------------------|
| id                      | snowflake                                                                            | the user's id                                                                                        | identify              |
| username                | string                                                                               | the user's username, not unique across the platform                                                  | identify              |
| discriminator           | string                                                                               | the user's Discord-tag                                                                               | identify              |
| global_name             | ?string                                                                              | the user's display name, if it is set. For bots, this is the application name                        | identify              |
| avatar                  | ?string                                                                              | the user's [avatar hash](#DOCS_REFERENCE/image-formatting)                                           | identify              |
| bot?                    | boolean                                                                              | whether the user belongs to an OAuth2 application                                                    | identify              |
| system?                 | boolean                                                                              | whether the user is an Official Discord System user (part of the urgent message system)              | identify              |
| mfa_enabled?            | boolean                                                                              | whether the user has two factor enabled on their account                                             | identify              |
| banner?                 | ?string                                                                              | the user's [banner hash](#DOCS_REFERENCE/image-formatting)                                           | identify              |
| accent_color?           | ?integer                                                                             | the user's banner color encoded as an integer representation of hexadecimal color code               | identify              |
| locale?                 | string                                                                               | the user's chosen [language option](#DOCS_REFERENCE/locales)                                         | identify              |
| verified?               | boolean                                                                              | whether the email on this account has been verified                                                  | email                 |
| email?                  | ?string                                                                              | the user's email                                                                                     | email                 |
| flags?                  | integer                                                                              | the [flags](#DOCS_RESOURCES_USER/user-object-user-flags) on a user's account                         | identify              |
| premium_type?           | integer                                                                              | the [type of Nitro subscription](#DOCS_RESOURCES_USER/user-object-premium-types) on a user's account | identify              |
| public_flags?           | integer                                                                              | the public [flags](#DOCS_RESOURCES_USER/user-object-user-flags) on a user's account                  | identify              |
| avatar_decoration_data? | ?[avatar decoration data](#DOCS_RESOURCES_USER/avatar-decoration-data-object) object | data for the user's avatar decoration                                                                | identify              |

###### Example User

```json
{
  "id": "80351110224678912",
  "username": "Nelly",
  "discriminator": "1337",
  "avatar": "8342729096ea3675442027381ff50dfe",
  "verified": true,
  "email": "nelly@discord.com",
  "flags": 64,
  "banner": "06c16474723fe537c283b8efa61a30c8",
  "accent_color": 16711680,
  "premium_type": 1,
  "public_flags": 64,
  "avatar_decoration_data": {
    "sku_id": "1144058844004233369",
    "asset": "a_fed43ab12698df65902ba06727e20c0e"
  }
}
```

###### User Flags

| Value     | Name                     | Description                                                                                                                                    |
|-----------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `1 << 0`  | STAFF                    | Discord Employee                                                                                                                               |
| `1 << 1`  | PARTNER                  | Partnered Server Owner                                                                                                                         |
| `1 << 2`  | HYPESQUAD                | HypeSquad Events Member                                                                                                                        |
| `1 << 3`  | BUG_HUNTER_LEVEL_1       | Bug Hunter Level 1                                                                                                                             |
| `1 << 6`  | HYPESQUAD_ONLINE_HOUSE_1 | House Bravery Member                                                                                                                           |
| `1 << 7`  | HYPESQUAD_ONLINE_HOUSE_2 | House Brilliance Member                                                                                                                        |
| `1 << 8`  | HYPESQUAD_ONLINE_HOUSE_3 | House Balance Member                                                                                                                           |
| `1 << 9`  | PREMIUM_EARLY_SUPPORTER  | Early Nitro Supporter                                                                                                                          |
| `1 << 10` | TEAM_PSEUDO_USER         | User is a [team](#DOCS_TOPICS_TEAMS/)                                                                                                          |
| `1 << 14` | BUG_HUNTER_LEVEL_2       | Bug Hunter Level 2                                                                                                                             |
| `1 << 16` | VERIFIED_BOT             | Verified Bot                                                                                                                                   |
| `1 << 17` | VERIFIED_DEVELOPER       | Early Verified Bot Developer                                                                                                                   |
| `1 << 18` | CERTIFIED_MODERATOR      | Moderator Programs Alumni                                                                                                                      |
| `1 << 19` | BOT_HTTP_INTERACTIONS    | Bot uses only [HTTP interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) and is shown in the online member list |
| `1 << 22` | ACTIVE_DEVELOPER         | User is an [Active Developer](https://support-dev.discord.com/hc/articles/10113997751447)                                                      |

###### Premium Types

Premium types denote the level of premium a user has. Visit the [Nitro](https://discord.com/nitro) page to learn more about the premium plans we currently offer.

| Value | Name          |
|-------|---------------|
| 0     | None          |
| 1     | Nitro Classic |
| 2     | Nitro         |
| 3     | Nitro Basic   |

### Avatar Decoration Data Object

The data for the user's [avatar decoration](https://support.discord.com/hc/en-us/articles/13410113109911-Avatar-Decorations).

###### Avatar Decoration Data Structure

| Field  | Type      | Description                                                    |
|--------|-----------|----------------------------------------------------------------|
| asset  | string    | the [avatar decoration hash](#DOCS_REFERENCE/image-formatting) |
| sku_id | snowflake | id of the avatar decoration's SKU                              |

### Connection Object

The connection object that the user has attached.

###### Connection Structure

| Field         | Type    | Description                                                                              |
|---------------|---------|------------------------------------------------------------------------------------------|
| id            | string  | id of the connection account                                                             |
| name          | string  | the username of the connection account                                                   |
| type          | string  | the [service](#DOCS_RESOURCES_USER/connection-object-services) of this connection        |
| revoked?      | boolean | whether the connection is revoked                                                        |
| integrations? | array   | an array of partial [server integrations](#DOCS_RESOURCES_GUILD/integration-object)      |
| verified      | boolean | whether the connection is verified                                                       |
| friend_sync   | boolean | whether friend sync is enabled for this connection                                       |
| show_activity | boolean | whether activities related to this connection will be shown in presence updates          |
| two_way_link  | boolean | whether this connection has a corresponding third party OAuth2 token                     |
| visibility    | integer | [visibility](#DOCS_RESOURCES_USER/connection-object-visibility-types) of this connection |

###### Services

| Value           | Name                |
|-----------------|---------------------|
| battlenet       | Battle.net          |
| bungie          | Bungie.net          |
| domain          | Domain              |
| ebay            | eBay                |
| epicgames       | Epic Games          |
| facebook        | Facebook            |
| github          | GitHub              |
| instagram       | Instagram           |
| leagueoflegends | League of Legends   |
| paypal          | PayPal              |
| playstation     | PlayStation Network |
| reddit          | Reddit              |
| riotgames       | Riot Games          |
| roblox          | Roblox              |
| spotify         | Spotify             |
| skype *         | Skype               |
| steam           | Steam               |
| tiktok          | TikTok              |
| twitch          | Twitch              |
| twitter         | X (Twitter)         |
| xbox            | Xbox                |
| youtube         | YouTube             |

\* Service can no longer be added by users

###### Visibility Types

| Value | Name     | Description                                      |
|-------|----------|--------------------------------------------------|
| 0     | None     | invisible to everyone except the user themselves |
| 1     | Everyone | visible to everyone                              |

### Application Role Connection Object

The role connection object that an application has attached to a user.

###### Application Role Connection Structure

| Field             | Type    | Description                                                                                                                                                                                                                                                      |
|-------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| platform_name     | ?string | the vanity name of the platform a bot has connected (max 50 characters)                                                                                                                                                                                          |
| platform_username | ?string | the username on the platform a bot has connected (max 100 characters)                                                                                                                                                                                            |
| metadata          | object  | object mapping [application role connection metadata](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/application-role-connection-metadata-object) keys to their `string`-ified value (max 100 characters) for the user on the platform a bot has connected |

## Get Current User % GET /users/@me

Returns the [user](#DOCS_RESOURCES_USER/user-object) object of the requester's account. For OAuth2, this requires the `identify` scope, which will return the object _without_ an email, and optionally the `email` scope, which returns the object _with_ an email.

## Get User % GET /users/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [user](#DOCS_RESOURCES_USER/user-object) object for a given user ID.

## Modify Current User % PATCH /users/@me

Modify the requester's user account settings. Returns a [user](#DOCS_RESOURCES_USER/user-object) object on success. Fires a [User Update](#DOCS_TOPICS_GATEWAY_EVENTS/user-update) Gateway event.

> info
> All parameters to this endpoint are optional.

###### JSON Params

| Field    | Type                                      | Description                                                                      |
|----------|-------------------------------------------|----------------------------------------------------------------------------------|
| username | string                                    | user's username, if changed may cause the user's discriminator to be randomized. |
| avatar   | ?[image data](#DOCS_REFERENCE/image-data) | if passed, modifies the user's avatar                                            |
| banner   | ?[image data](#DOCS_REFERENCE/image-data) | if passed, modifies the user's banner                                            |

## Get Current User Guilds % GET /users/@me/guilds

Returns a list of partial [guild](#DOCS_RESOURCES_GUILD/guild-object) objects the current user is a member of. For OAuth2, requires the `guilds` scope.

###### Example Partial Guild

```json
{
  "id": "80351110224678912",
  "name": "1337 Krew",
  "icon": "8342729096ea3675442027381ff50dfe",
  "banner": "bb42bdc37653b7cf58c4c8cc622e76cb",
  "owner": true,
  "permissions": "36953089",
  "features": ["COMMUNITY", "NEWS", "ANIMATED_ICON", "INVITE_SPLASH", "BANNER", "ROLE_ICONS"],
  "approximate_member_count": 3268,
  "approximate_presence_count": 784
}
```

> info
> This endpoint returns 200 guilds by default, which is the maximum number of guilds a non-bot user can join. Therefore, pagination is **not needed** for integrations that need to get a list of the users' guilds.

###### Query String Params

| Field       | Type                                             | Description                                                | Required | Default |
|-------------|--------------------------------------------------|------------------------------------------------------------|----------|---------|
| before      | snowflake                                        | get guilds before this guild ID                            | false    | absent  |
| after       | snowflake                                        | get guilds after this guild ID                             | false    | absent  |
| limit       | integer                                          | max number of guilds to return (1-200)                     | false    | 200     |
| with_counts | [boolean](#DOCS_REFERENCE/boolean-query-strings) | include approximate member and presence counts in response | false    | false   |

## Get Current User Guild Member % GET /users/@me/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/member

Returns a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object for the current user. Requires the `guilds.members.read` OAuth2 scope.

## Leave Guild % DELETE /users/@me/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Leave a guild. Returns a 204 empty response on success. Fires a [Guild Delete](#DOCS_TOPICS_GATEWAY_EVENTS/guild-delete) Gateway event and a [Guild Member Remove](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-remove) Gateway event.

## Create DM % POST /users/@me/channels

Create a new DM channel with a user. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object (if one already exists, it will be returned instead).

> warn
> You should not use this endpoint to DM everyone in a server about something. DMs should generally be initiated by a user action. If you open a significant amount of DMs too quickly, your bot may be rate limited or blocked from opening new ones.

###### JSON Params

| Field        | Type      | Description                             |
|--------------|-----------|-----------------------------------------|
| recipient_id | snowflake | the recipient to open a DM channel with |

## Create Group DM % POST /users/@me/channels

Create a new group DM channel with multiple users. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object. This endpoint was intended to be used with the now-deprecated GameBridge SDK. Fires a [Channel Create](#DOCS_TOPICS_GATEWAY_EVENTS/channel-create) Gateway event.

> warn
> This endpoint is limited to 10 active group DMs.

###### JSON Params

| Field         | Type             | Description                                                            |
|---------------|------------------|------------------------------------------------------------------------|
| access_tokens | array of strings | access tokens of users that have granted your app the `gdm.join` scope |
| nicks         | dict             | a dictionary of user ids to their respective nicknames                 |

## Get Current User Connections % GET /users/@me/connections

Returns a list of [connection](#DOCS_RESOURCES_USER/connection-object) objects. Requires the `connections` OAuth2 scope.

## Get Current User Application Role Connection % GET /users/@me/applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/role-connection

Returns the [application role connection](#DOCS_RESOURCES_USER/application-role-connection-object) for the user. Requires an OAuth2 access token with `role_connections.write` scope for the application specified in the path.

## Update Current User Application Role Connection % PUT /users/@me/applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/role-connection

Updates and returns the [application role connection](#DOCS_RESOURCES_USER/application-role-connection-object) for the user. Requires an OAuth2 access token with `role_connections.write` scope for the application specified in the path.

###### JSON Params

| Field              | Type   | Description                                                                                                                                                                                                                                                      |
|--------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| platform_name?     | string | the vanity name of the platform a bot has connected (max 50 characters)                                                                                                                                                                                          |
| platform_username? | string | the username on the platform a bot has connected (max 100 characters)                                                                                                                                                                                            |
| metadata?          | object | object mapping [application role connection metadata](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/application-role-connection-metadata-object) keys to their `string`-ified value (max 100 characters) for the user on the platform a bot has connected |
