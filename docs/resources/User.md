# Users Resource

Users in Discord are generally considered the base entity. Users can spawn across the entire platform, be members of
guilds, participate and text and voice chat, and much more. Users are separated by a distinction of "bot" vs "normal",
although similar, bot users are automated users that are "owned" by other users. Unlike normal users, bot users do
*not* have a limitation on the number of Guilds they can be a part of.

## Avatar Data

Avatars are base64 encoded jpeg images, in the following format:

```
data:image/jpeg;base64,MY_BASE64_IMAGE_DATA_HERE
```

## User Object

###### User Structure

| Field | Type | Description | Required OAuth2 Scope |
|-------|------|-------------|----|
| id | snowflake | the user's id | identify |
| username | string | the user's username, not unique across the platform | identify |
| discriminator | string | the user's 4-digit discord-tag | identify |
| avatar | string | the user's avatar hash | identify |
| bot | bool | whether the user belongs to an OAuth2 application | identify |
| mfa_enabled | bool | whether the user has two factor enabled on their account | identify |
| verified | bool | whether the email on this account has been verified | email |
|  email | string | the user's email | email |

###### Example User

```json
{
	"id": "80351110224678912",
	"username": "Nelly",
	"discriminator": "1337",
	"avatar": "8342729096ea3675442027381ff50dfe",
	"verified": true,
	"email": "nelly@discordapp.com"
}
```

## User Guild Object

A brief version of a [guild](#DOCS_GUILD/guild-object) object

###### User Guild Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | guild.id |
| name | string | guild.name |
| icon | string | guild.icon |
| owner | bool | true if the user is an owner of the guild |
| permissions | integer | bitwise of the user's enabled/disabled permissions |

###### Example User Guild

```json
{
	"id": "80351110224678912",
	"name": "1337 Krew",
	"icon": "8342729096ea3675442027381ff50dfe",
	"owner": true,
	"permissions": 36953089
}
```

## Connection Object

The connection object that the user has attached.

###### Connection Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | id of the connection account |
| name | string | the username of the connection account |
| type | string | the service of the connection (twitch, youtube) |
| revoked | bool | whether the connection is revoked |
| integrations | array | an array of partial [server integrations](#DOCS_GUILD/integration-object) |

## Relationship Object

The relationship between two user accounts.

###### Relationship Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | id of the other user |
| type | number | the type of relationship |
| user | [user](#DOCS_USER/user-object) object | the other user in the relationship |

###### Example Relationship

```json
{
	"id": "18239283748958109",
	"type": 1,
	"user": {}
}
```

## User Profile Object

The profile information for a user account.

###### User Profile Structure

| Field | Type | Description |
|-------|------|-------------|
| premium | bool | whether the account is a premium account |
| user | [user](#DOCS_USER/user-object) object | the user whose profile you are viewing |
| mutual_guilds | array of [mutual guild](#DOCS_USER/mutual-guild-structure) objects | the guilds that the user shares with you |
| connected_accounts | array of [connection](#DOCS_USER/connection-object) objects | accounts the user has connected to their discord |

###### Mutual Guild Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | the id of the guild |
| nick | string | the nickname of the user in that guilds |

###### Example Mutual Guild

```json
{
	"id": "1892837467912094",
	"nick": "Head Ratelimiter"
}
```

## Get Current User % GET /users/{@me#DOCS_USER/user-object}

Returns the [user](#DOCS_USER/user-object) object of the requester's account. For OAuth2, this requires the `identify` scope, which will return the object _without_ an email, and optionally the `email` scope, which returns the object _with_ an email.

## Get User % GET /users/{user.id#DOCS_USER/user-object}

Returns a [user](#DOCS_USER/user-object) for a given user ID.

## Modify Current User % PATCH /users/{@me#DOCS_USER/user-object}

Modify the requestors user account settings. Returns a [user](#DOCS_USER/user-object) object on success.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| username | string | users username, if changed may cause the users discriminator to be randomized. |
| avatar | [avatar data](#DOCS_USER/avatar-data) | if passed, modifies the user's avatar |

## Get Current User Guilds % GET /users/{@me#DOCS_USER/user-object}/guilds

Returns a list of [user guild](#DOCS_USER/user-guild-object) objects the current user is a member of. Requires the `guilds` OAuth2 scope.

## Leave Guild % DELETE /users/{@me#DOCS_USER/user-object}/guilds/{guild.id#DOCS_GUILD/guild-object}

Leave a guild. Returns a 204 empty response on success.

## Get User DMs % GET /users/{@me#DOCS_USER/user-object}/channels

Returns a list of [DM](#DOCS_CHANNEL/dm-channel-object) channel objects.

## Create DM % POST /users/{@me#DOCS_USER/user-object}/channels

Create a new DM channel with a user. Returns a [DM channel](#DOCS_CHANNEL/dm-channel-object) object.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| recipient_id | snowflake | the recipient to open a DM channel with |

## Create Group DM % POST /users/{@me#DOCS_USER/user-object}/channels

Create a new group DM channel with multiple users. Returns a [DM channel](#DOCS_CHANNEL/dm-channel-object) object.

>warn
> This endpoint is only available for whitelisted bots. If you believe you have a legitimate use case for
> automating group dm creation, please contact us at support@discordapp.com and we'll look into whitelisting you.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| access_tokens | array of strings | access tokens of users that have granted your app the `gdm.join` scope |
| nicks | dict | a dictionary of user ids to their respective nicknames |

## Get Users Connections % GET /users/{@me#DOCS_USER/user-object}/connections

Returns a list of [connection](#DOCS_USER/connection-object) objects. Requires the `connections` OAuth2 scope.

## Get Users Relationships % GET /users/{@me#DOCS_USER/user-object}/relationships

Returns an array of [relationship](#DOCS_USER/relationship-object) objects, this is not available to bots.

## Create User Relationship from Username % POST /users/{@me#DOCS_USER/user-object}/relationships

Creates a relationship with the given user, this is not available to bots.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| username | string | the username of the user |
| discriminator | string | the discriminator of the user |

## Create User Relationship from ID % PUT /users/{@me#DOCS_USER/user-object}/relationships/{user.id#DOCS_USER/user-object}

Creates a relationship with the user with the given ID, this is not available to bots. Returns a 204 empty response on success.

###### JSON Params

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| type | number | the type of relationship being created | 4 |

## Remove User Relationship % DELETE /users/{@me#DOCS_USER/user-object}/relationships/{user.id#DOCS_USER/user-object}

Removes the relationship between you and the user, this is not available to bots. Returns a 204 empty response on success.

## Get User Profile % GET /users/{user.id#DOCS_USER/user-object}/profile

Returns a [user profile](#DOCS_USER/user-profile-object) for a given user ID.

>warn
> Bots and Webhooks do not have profiles.

## Set User Note % PUT /users/{@me#DOCS_USER/user-object}/notes/{user.id#DOCS_USER/user-object}

Change the local note for the user with the given ID, this is not available to bots. Returns a 204 empty response on success.

###### JSON Params
| Field | Type | Description |
|-------|------|-------------|
| note | string | the new note for the user |
