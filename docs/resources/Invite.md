# Invite Resource

### Invite Object

Represents a code that when used, adds a user to a guild or group DM channel.

###### Invite Structure

| Field                       | Type                                                                         | Description                                                                                                        |
|-----------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| code                        | string                                                                       | the invite code (unique ID)                                                                                        |
| guild?                      | partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object                   | the guild this invite is for                                                                                       |
| channel                     | partial [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object             | the channel this invite is for                                                                                     |
| inviter?                    | [user](#DOCS_RESOURCES_USER/user-object) object                              | the user who created the invite                                                                                    |
| target_type?                | integer                                                                      | the [type of target](#DOCS_RESOURCES_INVITE/invite-object-invite-target-types) for this voice channel invite       |
| target_user?                | [user](#DOCS_RESOURCES_USER/user-object) object                              | the user whose stream to display for this voice channel stream invite                                              |
| target_application?         | partial [application](#DOCS_RESOURCES_APPLICATION/application-object) object | the embedded application to open for this voice channel embedded application invite                                |
| approximate_presence_count? | integer                                                                      | approximate count of online members, returned from the `GET /invites/<code>` endpoint when `with_counts` is `true` |
| approximate_member_count?   | integer                                                                      | approximate count of total members, returned from the `GET /invites/<code>` endpoint when `with_counts` is `true`  |
| expires_at?                 | ?ISO8601 timestamp                                                           | the expiration date of this invite, returned from the `GET /invites/<code>` endpoint when `with_expiration` is `true`  |

###### Invite Target Types

| Type                 | Value |
|----------------------|-------|
| STREAM               | 1     |
| EMBEDDED_APPLICATION | 2     |

###### Example Invite Object

```json
{
  "code": "0vCdhLbwjZZTWZLD",
  "guild": {
    "id": "165176875973476352",
    "name": "CS:GO Fraggers Only",
    "splash": null,
    "banner": null,
    "description": "Very good description",
    "icon": null,
    "features": ["NEWS", "DISCOVERABLE"],
    "verification_level": 2,
    "vanity_url_code": null
  },
  "channel": {
    "id": "165176875973476352",
    "name": "illuminati",
    "type": 0
  },
  "inviter": {
    "id": "115590097100865541",
    "username": "speed",
    "avatar": "deadbeef",
    "discriminator": "7653",
    "public_flags": 131328
  },
  "target_type": 1,
  "target_user": {
    "id": "165176875973476352",
    "username": "bob",
    "avatar": "deadbeef",
    "discriminator": "1234",
    "public_flags": 64
  }
}
```

### Invite Metadata Object

Extra information about an invite, will extend the [invite](#DOCS_RESOURCES_INVITE/invite-object) object.

###### Invite Metadata Structure

| Field      | Type                                            | Description                                          |
| ---------- | ----------------------------------------------- | ---------------------------------------------------- |
| uses       | integer                                         | number of times this invite has been used            |
| max_uses   | integer                                         | max number of times this invite can be used          |
| max_age    | integer                                         | duration (in seconds) after which the invite expires |
| temporary  | boolean                                         | whether this invite only grants temporary membership |
| created_at | ISO8601 timestamp                               | when this invite was created                         |

###### Example Invite Metadata

```json
{
  "uses": 0,
  "max_uses": 0,
  "max_age": 0,
  "temporary": false,
  "created_at": "2016-03-31T19:15:39.954000+00:00"
}
```

## Get Invite % GET /invites/{invite.code#DOCS_RESOURCES_INVITE/invite-object}

Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object for the given code.

###### Query String Params

| Field            | Type    | Description                                                 |
| ---------------- | ------- | ----------------------------------------------------------- |
| with_counts?     | boolean | whether the invite should contain approximate member counts |
| with_expiration? | boolean | whether the invite should contain the expiration date       |

## Delete Invite % DELETE /invites/{invite.code#DOCS_RESOURCES_INVITE/invite-object}

Delete an invite. Requires the `MANAGE_CHANNELS` permission on the channel this invite belongs to, or `MANAGE_GUILD` to remove any invite across the guild. Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object on success. Fires a [Invite Delete](#DOCS_TOPICS_GATEWAY/invite-delete) Gateway event.
