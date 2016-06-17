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
| id | snowflake | the users id | identify |
| username | string | the users username, not unique across the platform | identify |
| discriminator | string | the users 4-digit discord-tag | identify |
| avatar | string | the users avatar hash | identify |
| mfa_enabled | bool | whether the user has two factor enabled on their account | identify |
| verified | bool | whether the email on this account has been verified | email |
|  email | string | the users email | email |

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

## Query Users % GET /users

Returns a list of [user](#DOCS_USER/user-object) objects for a given query. Only returns users that share a mutual guild with the requestor.

###### HTTP Params

| Field | Type | Description |
|-------|------|-------------|
| q | string | username query |
| limit | integer | maximum number of users to return (default 25) |

## Get Current User % GET /users/{@me#DOCS_USER/user-object}

Returns the [user](#DOCS_USER/user-object) object of the requestors account. For OAuth2, this requires the `identify` scope, which will return the object _without_ an email, and optionally the `email` scope, which returns the object _with_ an email.

## Get User % GET /users/{user.id#DOCS_USER/user-object}

Returns a [user](#DOCS_USER/user-object) for a given user ID.

## Modify Current User % PATCH /users/{@me#DOCS_USER/user-object}

Modify the requestors user account settings. Returns a [user](#DOCS_USER/user-object) object on success.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| username | string | users username, if changed will randomize the users discriminator |
| avatar | [avatar data](#DOCS_USER/avatar-data) | if passed, modifies the users avatar |

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

## Get Users Connections % GET /users/{@me#DOCS_USER/user-object}/connections

Returns a list of [connection](#DOCS_USER/connection-object) objects. Requires the `connections` OAuth2 scope.
