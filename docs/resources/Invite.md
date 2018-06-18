# Invite Resource

### Invite Object

Represents a code that when used, adds a user to a guild or group DM channel.

###### Invite Structure

| Field | Type | Description |
|-------|------|-------------|
| code | string | the invite code (unique ID) |
| guild? | partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object | the guild this invite is for |
| channel | partial [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object | the channel this invite is for |
| approximate_presence_count? | int | approximate count of online members |
| approximate_member_count? | int | approximate count of total members |

###### Example Invite Object

```json
{
	"code": "0vCdhLbwjZZTWZLD",
	"guild": {
		"id": "165176875973476352",
		"name": "CS:GO Fraggers Only",
		"splash": null,
		"icon": null
	},
	"channel": {
		"id": "165176875973476352",
		"name": "illuminati",
		"type": 0
	}
}
```

### Invite Metadata Object

###### Invite Metadata Structure

| Field | Type | Description |
|-------|------|-------------|
| inviter | a [user](#DOCS_RESOURCES_USER/user-object) object | user who created the invite |
| uses | integer | number of times this invite has been used |
| max_uses | integer | max number of times this invite can be used |
| max_age | integer | duration (in seconds) after which the invite expires |
| temporary | bool | whether this invite only grants temporary membership |
| created_at | ISO8601 timestamp | when this invite was created |
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

## Get Invite % GET /invites/{invite.code#DOCS_RESOURCES_INVITE/invite-object}

Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object for the given code.

###### Get Invite URL Parameters

| Field | Type | Description |
|-----------|------|-------------|
| with_counts? | boolean | whether the invite should contain approximate member counts |

## Delete Invite % DELETE /invites/{invite.code#DOCS_RESOURCES_INVITE/invite-object}

Delete an invite. Requires the `MANAGE_CHANNELS` permission. Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object on success.
