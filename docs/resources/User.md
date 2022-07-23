# Users Resource

Users in Discord are generally considered the base entity. Users can spawn across the entire platform, be members of
guilds, participate in text and voice chat, and much more. Users are separated by a distinction of "bot" vs "normal." Although they are similar, bot users are automated users that are "owned" by another user. Unlike normal users, bot users do
_not_ have a limitation on the number of Guilds they can be a part of.

## Usernames and Nicknames

Discord enforces the following restrictions for usernames and nicknames:

1.  Names can contain most valid unicode characters. We limit some zero-width and non-rendering characters.
2.  Usernames must be between 2 and 32 characters long.
3.  Nicknames must be between 1 and 32 characters long.
4.  Names are sanitized and trimmed of leading, trailing, and excessive internal whitespace.

The following restrictions are additionally enforced for usernames:

1.  Usernames cannot contain the following substrings: `@`, `#`, `:`, ` ``` `, `discord`
2.  Usernames cannot be: `everyone`, `here`

There are other rules and restrictions not shared here for the sake of spam and abuse mitigation, but the majority of users won't encounter them. It's important to properly handle all error messages returned by Discord when editing or updating names.

### User Object

###### User Structure

| Field         | Type      | Description                                                                                          | Required OAuth2 Scope |
| ------------- | --------- | ---------------------------------------------------------------------------------------------------- | --------------------- |
| id            | snowflake | the user's id                                                                                        | identify              |
| username      | string    | the user's username, not unique across the platform                                                  | identify              |
| discriminator | string    | the user's 4-digit discord-tag                                                                       | identify              |
| avatar        | ?string   | the user's [avatar hash](#DOCS_REFERENCE/image-formatting)                                           | identify              |
| bot?          | boolean   | whether the user belongs to an OAuth2 application                                                    | identify              |
| system?       | boolean   | whether the user is an Official Discord System user (part of the urgent message system)              | identify              |
| mfa_enabled?  | boolean   | whether the user has two factor enabled on their account                                             | identify              |
| banner?       | ?string   | the user's [banner hash](#DOCS_REFERENCE/image-formatting)                                           | identify              |
| accent_color? | ?integer  | the user's banner color encoded as an integer representation of hexadecimal color code               | identify              |
| locale?       | string    | the user's chosen [language option](#DOCS_REFERENCE/locales)                                         | identify              |
| verified?     | boolean   | whether the email on this account has been verified                                                  | email                 |
| email?        | ?string   | the user's email                                                                                     | email                 |
| flags?        | integer   | the [flags](#DOCS_RESOURCES_USER/user-object-user-flags) on a user's account                         | identify              |
| premium_type? | integer   | the [type of Nitro subscription](#DOCS_RESOURCES_USER/user-object-premium-types) on a user's account | identify              |
| public_flags? | integer   | the public [flags](#DOCS_RESOURCES_USER/user-object-user-flags) on a user's account                  | identify              |

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
  "public_flags": 64
}
```

###### User Flags

| Name                     | Value   | Description                                                                                                                                    |
| ------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| STAFF                    | 1 << 0  | Discord Employee                                                                                                                               |
| PARTNER                  | 1 << 1  | Partnered Server Owner                                                                                                                         |
| HYPESQUAD                | 1 << 2  | HypeSquad Events Member                                                                                                                        |
| BUG_HUNTER_LEVEL_1       | 1 << 3  | Bug Hunter Level 1                                                                                                                             |
| HYPESQUAD_ONLINE_HOUSE_1 | 1 << 6  | House Bravery Member                                                                                                                           |
| HYPESQUAD_ONLINE_HOUSE_2 | 1 << 7  | House Brilliance Member                                                                                                                        |
| HYPESQUAD_ONLINE_HOUSE_3 | 1 << 8  | House Balance Member                                                                                                                           |
| PREMIUM_EARLY_SUPPORTER  | 1 << 9  | Early Nitro Supporter                                                                                                                          |
| TEAM_PSEUDO_USER         | 1 << 10 | User is a [team](#DOCS_TOPICS_TEAMS/)                                                                                                          |
| BUG_HUNTER_LEVEL_2       | 1 << 14 | Bug Hunter Level 2                                                                                                                             |
| VERIFIED_BOT             | 1 << 16 | Verified Bot                                                                                                                                   |
| VERIFIED_DEVELOPER       | 1 << 17 | Early Verified Bot Developer                                                                                                                   |
| CERTIFIED_MODERATOR      | 1 << 18 | Discord Certified Moderator                                                                                                                    |
| BOT_HTTP_INTERACTIONS    | 1 << 19 | Bot uses only [HTTP interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) and is shown in the online member list |

###### Premium Types

Premium types denote the level of premium a user has. Visit the [Nitro](https://discord.com/nitro) page to learn more about the premium plans we currently offer.

| Name          | Value |
| ------------- | ----- |
| None          | 0     |
| Nitro Classic | 1     |
| Nitro         | 2     |

### Connection Object

The connection object that the user has attached.

###### Connection Structure

| Field         | Type    | Description                                                                              |
| ------------- | ------- | ---------------------------------------------------------------------------------------- |
| id            | string  | id of the connection account                                                             |
| name          | string  | the username of the connection account                                                   |
| type          | string  | the [service](#DOCS_RESOURCES_USER/connection-object-services) of this connection        |
| revoked?      | boolean | whether the connection is revoked                                                        |
| integrations? | array   | an array of partial [server integrations](#DOCS_RESOURCES_GUILD/integration-object)      |
| verified      | boolean | whether the connection is verified                                                       |
| friend_sync   | boolean | whether friend sync is enabled for this connection                                       |
| show_activity | boolean | whether activities related to this connection will be shown in presence updates          |
| visibility    | integer | [visibility](#DOCS_RESOURCES_USER/connection-object-visibility-types) of this connection |

###### Services

| Name                | Value              |
| ------------------- | ------------------ |
| Battle.net          | battlenet          |
| Epic Games          | epicgames          |
| Facebook            | facebook           |
| GitHub              | github             |
| League of Legends   | leagueoflegends *  |
| PlayStation Network | playstation        |
| Reddit              | reddit             |
| Samsung Galaxy      | samsunggalaxy *    |
| Spotify             | spotify            |
| Skype               | skype *            |
| Steam               | steam              |
| Twitch              | twitch             |
| Twitter             | twitter            |
| Xbox                | xbox               |
| YouTube             | youtube            |

\* Service can no longer be added by users

###### Visibility Types

| Name     | Value | Description                                      |
| -------- | ----- | ------------------------------------------------ |
| None     | 0     | invisible to everyone except the user themselves |
| Everyone | 1     | visible to everyone                              |

## Get Current User % GET /users/@me

Returns the [user](#DOCS_RESOURCES_USER/user-object) object of the requester's account. For OAuth2, this requires the `identify` scope, which will return the object _without_ an email, and optionally the `email` scope, which returns the object _with_ an email.

## Get User % GET /users/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [user](#DOCS_RESOURCES_USER/user-object) object for a given user ID.

## Modify Current User % PATCH /users/@me

Modify the requester's user account settings. Returns a [user](#DOCS_RESOURCES_USER/user-object) object on success.

> info
> All parameters to this endpoint are optional.

###### JSON Params

| Field     | Type                                      | Description                                                                      |
| --------- | ----------------------------------------- | -------------------------------------------------------------------------------- |
| username? | string                                    | user's username, if changed may cause the user's discriminator to be randomized. |
| avatar?   | ?[image data](#DOCS_REFERENCE/image-data) | if passed, modifies the user's avatar                                            |

## Get Current User Guilds % GET /users/@me/guilds

Returns a list of partial [guild](#DOCS_RESOURCES_GUILD/guild-object) objects the current user is a member of. Requires the `guilds` OAuth2 scope.

###### Example Partial Guild

```json
{
  "id": "80351110224678912",
  "name": "1337 Krew",
  "icon": "8342729096ea3675442027381ff50dfe",
  "owner": true,
  "permissions": "36953089",
  "features": ["COMMUNITY", "NEWS"]
}
```

> info
> This endpoint returns 200 guilds by default, which is the maximum number of guilds a non-bot user can join. Therefore, pagination is **not needed** for integrations that need to get a list of the users' guilds.

###### Query String Params

| Field   | Type      | Description                            | Default |
| ------- | --------- | -------------------------------------- | ------- |
| before? | snowflake | get guilds before this guild ID        |         |
| after?  | snowflake | get guilds after this guild ID         |         |
| limit?  | integer   | max number of guilds to return (1-200) | 200     |

## Get Current User Guild Member % GET /users/@me/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/member

Returns a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object for the current user. Requires the `guilds.members.read` OAuth2 scope.

## Leave Guild % DELETE /users/@me/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Leave a guild. Returns a 204 empty response on success.

## Create DM % POST /users/@me/channels

Create a new DM channel with a user. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.

> warn
> You should not use this endpoint to DM everyone in a server about something. DMs should generally be initiated by a user action. If you open a significant amount of DMs too quickly, your bot may be rate limited or blocked from opening new ones.

###### JSON Params

| Field        | Type      | Description                             |
| ------------ | --------- | --------------------------------------- |
| recipient_id | snowflake | the recipient to open a DM channel with |

## Create Group DM % POST /users/@me/channels

Create a new group DM channel with multiple users. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object. This endpoint was intended to be used with the now-deprecated GameBridge SDK. DMs created with this endpoint will not be shown in the Discord client

> warn
> This endpoint is limited to 10 active group DMs.

###### JSON Params

| Field         | Type             | Description                                                            |
| ------------- | ---------------- | ---------------------------------------------------------------------- |
| access_tokens | array of strings | access tokens of users that have granted your app the `gdm.join` scope |
| nicks         | dict             | a dictionary of user ids to their respective nicknames                 |

## Get User Connections % GET /users/@me/connections

Returns a list of [connection](#DOCS_RESOURCES_USER/connection-object) objects. Requires the `connections` OAuth2 scope.
