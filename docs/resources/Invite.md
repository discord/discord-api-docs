# Invite Resource

## Invite Object

Represents a code that when used, adds a user to a guild.

###### Invite Structure

| Field | Type | Description |
|-------|------|-------------|
| code | string | the invite code (unique ID) |
| guild | a [invite guild](#DOCS_INVITE/invite-guild-object) object | the guild this invite is for |
| channel | a [invite channel](#DOCS_INVITE/invite-channel-object) object | the channel this invite is for |

###### Invite Object

```json
{
	"code": "0vCdhLbwjZZTWZLD",
	"guild": {},
	"channel": {}
}
```

## Invite Metadata Object

###### Invite Metadata Structure

| Field | Type | Description |
|-------|------|-------------|
| inviter | a [user](#DOCS_USER/user-object) object | user who created the invite |
| uses | integer | number of times this invite has been used |
| max_uses | integer | max number of times this invite can be used |
| max_age | integer | duration (in seconds) after which the invite expires |
| temporary | bool | whether this invite only grants temporary membership |
| created_at | datetime | when this invite was created |
| revoked | bool | whether this invite is revoked |

###### Example Invite Metadata

```json
{
	"inviter": {},
	"uses": 0,
	"max_uses": 0,
	"max_age": 0,
	"temporary": false,
	"created_at": "2016-03-31T19:15:39.954000+00:00",
	"revoked": false
}
```

## Invite Guild Object

Represents the parent guild of an invite.

###### Invite Guild Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | id of the guild |
| name | string | name of the guild |
| splash | string | hash of the guild splash (or null) |
| icon | string | hash of the guild icon (or null) |

###### Invite Guild Object

```json
{
	"id": "165176875973476352",
	"name": "CS:GO Fraggers Only",
	"splash": null,
	"icon": null
}
```

## Invite Channel Object

Represents the channel an invite is for.

###### Invite Channel Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | id of the channel |
| name | string | name of the channel |
| type | string | 'text' or 'voice' |

###### Invite Channel Object

```json
{
	"id": "165176875973476352",
	"name": "illuminati",
	"type": "text"
}
```

## Get Invite % GET /invites/{invite.code#DOCS_INVITE/invite-object}

Returns an [invite object](#DOCS_INVITE/invite-object) for the given code.

## Delete Invite % DELETE /invites/{invite.code#DOCS_INVITE/invite-object}

Delete an invite. Requires the `MANAGE_CHANNELS` permission. Returns an [invite object](#DOCS_INVITE/invite-object) on success.

## Accept Invite % POST /invites/{invite.code#DOCS_INVITE/invite-object}

Accept an invite. This is not available to bot accounts, and requires the `guilds.join` OAuth2 scope to accept on behalf of normal users. Returns an [invite object](#DOCS_INVITE/invite-object) on success.
