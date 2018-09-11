# Users Resource

Users in Discord are generally considered the base entity. Users can spawn across the entire platform, be members of
guilds, participate in text and voice chat, and much more. Users are separated by a distinction of "bot" vs "normal." Although they are similar, bot users are automated users that are "owned" by another user. Unlike normal users, bot users do
_not_ have a limitation on the number of Guilds they can be a part of.

## Avatar Data

Avatar data is a [Data URI scheme](https://en.wikipedia.org/wiki/Data_URI_scheme) that supports JPG, GIF, and PNG formats. An example Data URI format is:

```
data:image/jpeg;base64,BASE64_ENCODED_JPEG_IMAGE_DATA
```

Ensure you use the proper header type (`image/jpeg`, `image/png`, `image/gif`) that matches the image data being provided.

## Usernames and Nicknames

Discord enforces the following restrictions for usernames and nicknames:

1.  Names can contain most valid unicode characters. We limit some zero-width and non-rendering characters.
2.  Names must be between 2 and 32 characters long.
3.  Names are sanitized and trimmed of leading, trailing, and excessive internal whitespace.

The following restrictions are additionally enforced for usernames:

1.  Names cannot contain the following substrings: '@', '#', ':', '\```'.
2.  Names cannot be: 'discordtag', 'everyone', 'here'.

There are other rules and restrictions not shared here for the sake of spam and abuse mitigation, but the majority of users won't encounter them. It's important to properly handle all error messages returned by Discord when editing or updating names.

### User Object

###### User Structure

| Field         | Type      | Description                                                | Required OAuth2 Scope |
| ------------- | --------- | ---------------------------------------------------------- | --------------------- |
| id            | snowflake | the user's id                                              | identify              |
| username      | string    | the user's username, not unique across the platform        | identify              |
| discriminator | string    | the user's 4-digit discord-tag                             | identify              |
| avatar        | ?string   | the user's [avatar hash](#DOCS_REFERENCE/image-formatting) | identify              |
| bot?          | bool      | whether the user belongs to an OAuth2 application          | identify              |
| mfa_enabled?  | bool      | whether the user has two factor enabled on their account   | identify              |
| locale?       | string    | the user's chosen language option                          | identify              |
| verified?     | bool      | whether the email on this account has been verified        | email                 |
| email?        | string    | the user's email                                           | email                 |

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

### Connection Object

The connection object that the user has attached.

###### Connection Structure

| Field        | Type   | Description                                                                         |
| ------------ | ------ | ----------------------------------------------------------------------------------- |
| id           | string | id of the connection account                                                        |
| name         | string | the username of the connection account                                              |
| type         | string | the service of the connection (twitch, youtube)                                     |
| revoked      | bool   | whether the connection is revoked                                                   |
| integrations | array  | an array of partial [server integrations](#DOCS_RESOURCES_GUILD/integration-object) |

## Get Current User % GET /users/@me

Returns the [user](#DOCS_RESOURCES_USER/user-object) object of the requester's account. For OAuth2, this requires the `identify` scope, which will return the object _without_ an email, and optionally the `email` scope, which returns the object _with_ an email.

## Get User % GET /users/{user.id#DOCS_RESOURCES_USER/user-object}

Returns a [user](#DOCS_RESOURCES_USER/user-object) object for a given user ID.

## Modify Current User % PATCH /users/@me

Modify the requester's user account settings. Returns a [user](#DOCS_RESOURCES_USER/user-object) object on success.

###### JSON Params

| Field    | Type                                            | Description                                                                    |
| -------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| username | string                                          | users username, if changed may cause the users discriminator to be randomized. |
| avatar   | [avatar data](#DOCS_RESOURCES_USER/avatar-data) | if passed, modifies the user's avatar                                          |

## Get Current User Guilds % GET /users/@me/guilds

Returns a list of partial [guild](#DOCS_RESOURCES_GUILD/guild-object) objects the current user is a member of. Requires the `guilds` OAuth2 scope.

###### Example Partial Guild

```json
{
  "id": "80351110224678912",
  "name": "1337 Krew",
  "icon": "8342729096ea3675442027381ff50dfe",
  "owner": true,
  "permissions": 36953089
}
```

> info
> This endpoint returns 100 guilds by default, which is the maximum number of guilds a non-bot user can join. Therefore, pagination is **not needed** for integrations that need to get a list of users' guilds.

###### Query String Params

| Field  | Type      | Description                            | Required | Default |
| ------ | --------- | -------------------------------------- | -------- | ------- |
| before | snowflake | get guilds before this guild ID        | false    | absent  |
| after  | snowflake | get guilds after this guild ID         | false    | absent  |
| limit  | integer   | max number of guilds to return (1-100) | false    | 100     |

## Leave Guild % DELETE /users/@me/guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}

Leave a guild. Returns a 204 empty response on success.

## Get User DMs % GET /users/@me/channels

Returns a list of [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects. For bots, this is no longer a supported method of getting recent DMs, and will return an empty array.

## Create DM % POST /users/@me/channels

Create a new DM channel with a user. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.

###### JSON Params

| Field        | Type      | Description                             |
| ------------ | --------- | --------------------------------------- |
| recipient_id | snowflake | the recipient to open a DM channel with |

## Create Group DM % POST /users/@me/channels

Create a new group DM channel with multiple users. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.

> warn
> This endpoint is limited to 10 active group DMs.

###### JSON Params

| Field         | Type             | Description                                                            |
| ------------- | ---------------- | ---------------------------------------------------------------------- |
| access_tokens | array of strings | access tokens of users that have granted your app the `gdm.join` scope |
| nicks         | dict             | a dictionary of user ids to their respective nicknames                 |

## Get User Connections % GET /users/@me/connections

Returns a list of [connection](#DOCS_RESOURCES_USER/connection-object) objects. Requires the `connections` OAuth2 scope.
