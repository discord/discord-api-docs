# Guild Resource

Guilds in Discord represent a collection of users and channels into an isolated "server".

### Guild Object

###### Guild Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | guild id |
| name | string | guild name (2-100 characters) |
| icon | string | icon hash |
| splash | string | splash hash |
| owner\_id | snowflake | id of owner |
| region | string | {voice\_region.id} |
| afk\_channel\_id | snowflake | id of afk channel |
| afk\_timeout | integer | afk timeout in seconds |
| embed\_enabled | bool | is this guild embeddable (e.g. widget) |
| embed\_channel\_id | snowflake | id of embedded channel |
| verification\_level | integer | level of verification |
| default\_message\_notifications | integer | default message notifications level |
| roles | array | array of [role](#DOCS_PERMISSIONS/role-object) objects |
| emojis | array | array of [emoji](#DOCS_GUILD/emoji-object) objects |
| features | array | array of guild features |
| mfa\_level | integer | required MFA level for the guild |
| joined\_at \* | datetime | date this guild was joined at |
| large \* | bool | whether this is considered a large guild |
| unavailable \* | bool | is this guild unavailable |
| member\_count \* | integer | total number of members in this guild |
| voice\_states \* | array | array of [voice state](#DOCS_VOICE/voice-state-object) objects (without the `guild_id` key) |
| members \* | array | array of [guild member](#DOCS_GUILD/guild-member-object) objects |
| channels \* | array | array of [channel](#DOCS_CHANNEL/guild-channel-object) objects |
| presences \* | array | array of simple presence objects, which share the same fields as [Presence Update event](#DOCS_GATEWAY/presence-update) sans a roles or guild_id key |

** \* These fields are only sent within the [GUILD_CREATE](#DOCS_GATEWAY/guild-create) event **

###### Example Guild

```json
{
	"id": "41771983423143937",
	"name": "Discord Developers",
	"icon": "SEkgTU9NIElUUyBBTkRSRUkhISEhISEh",
	"splash": null,
	"owner_id": "80351110224678912",
	"region": "us-east",
	"afk_channel_id": "42072017402331136",
	"afk_timeout": 300,
	"embed_enabled": true,
	"embed_channel_id": "41771983444115456",
	"verification_level": 1,
	"roles": [],
	"emojis": [],
	"features": ["INVITE_SPLASH"],
	"unavailable": false
}
```

### Unavailable Guild Object

Represents an Offline Guild, or a Guild whose information has not been provided through [Guild Create](#DOCS_GATEWAY/guild-create) events during the Gateway connect.

###### Unavailable Guild Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | guild id |
| unavailable | bool | should always be true |

###### Example Unavailable Guild

```json
{
	"id": "41771983423143937",
	"unavailable": true
}
```

### Guild Embed Object

###### Guild Embed Structure

| Field | Type | Description |
|-------|------|-------------|
| enabled | bool | if the embed is enabled |
| channel_id | snowflake | the embed channel id |

###### Example Guild Embed

```json
{
	"enabled": true,
	"channel_id": "41771983444115456"
}
```

### Guild Member Object

###### Guild Member Structure

| Field | Type | Description |
|-------|------|-------------|
| user | object | [user](#DOCS_USER/user-object) object |
| nick | string? | this users guild nickname (if one is set) |
| roles | array | array of [role](#DOCS_PERMISSIONS/role-object) object id's |
| joined_at | datetime | date the user joined the guild |
| deaf | bool | if the user is deafened |
| mute | bool | if the user is muted |

###### Example Guild Member

```json
{
	"user": {},
	"nick": "NOT API SUPPORT",
	"roles": [],
	"joined_at": "2015-04-26T06:26:56.936000+00:00",
	"deaf": false,
	"mute": false
}
```

### Integration Object

###### Integration Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | integration id |
| name | string | integration name |
| type | string | integration type (twitch, youtube, etc) |
| enabled | bool | is this integration enabled |
| syncing | bool | is this integration syncing |
| role_id | snowflake | id that this integration uses for "subscribers" |
| expire_behavior | integer | the behavior of expiring subscribers |
| expire_grace_period | integer | the grace period before expiring subscribers |
| user | [user](#DOCS_USER/user-object) object | user for this integration |
| account | [account](#DOCS_GUILD/integration-account-object) object | integration account information |
| synced_at | timestamp | when this integration was last synced |

### Integration Account Object

###### Integration Account Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | id of the account |
| name | string | name of the account |

### Emoji Object

###### Emoji Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | emoji id |
| name | string | emoji name |
| roles | array of [role object](#DOCS_PERMISSIONS/role-object) ids | roles this emoji is active for |
| require_colons | bool | whether this emoji must be wrapped in colons |
| managed | bool | whether this emoji is managed |

## Create Guild % POST /guilds

Create a new guild. Returns a [guild](#DOCS_GUILD/guild-object) object on success. Fires a [Guild Create](#DOCS_GATEWAY/guild-create) Gateway event.

>warn
> By default this endpoint is limited to 10 active guilds. These limits are raised for whitelisted [GameBridge](#DOCS_GAMEBRDIGE) applications.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| name | string | name of the guild (2-100 characters) |
| region | string | {voice_region.id} for voice |
| icon | string | base64 128x128 jpeg image for the guild icon |
| verification_level | integer | guild verification level |
| default\_message\_notifications | integer | default message notifications setting |
| roles | array of [role](#DOCS_PERMISSIONS/role-object) objects | new guild roles
| channels | array of [create guild channel](#DOCS_CHANNEL/create-guild-channel) body objects | new guild's channels

>info
> If roles are specified, the required `id` field within each role object is an integer placeholder, and will be replaced by the API upon consumption. Its purpose is to allow you to [overwrite](#DOCS_CHANNEL/overwrite-object) a role's permissions in a channel when also passing in channels with the channels array.

## Get Guild % GET /guilds/{guild.id#DOCS_GUILD/guild-object}

Returns the new [guild](#DOCS_GUILD/guild-object) object for the given id.

## Modify Guild % PATCH /guilds/{guild.id#DOCS_GUILD/guild-object}

Modify a guild's settings. Returns the updated [guild](#DOCS_GUILD/guild-object) object on success. Fires a [Guild Update](#DOCS_GATEWAY/guild-update) Gateway event.

>info
> All parameters to this endpoint are optional

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| name | string | guild name |
| region | string | guild {voice_region.id} |
| verification_level | integer | guild verification level |
| default\_message\_notifications | integer | default message notifications setting |
| afk\_channel\_id | snowflake | id for afk channel |
| afk_timeout | integer | afk timeout in seconds |
| icon | string | base64 128x128 jpeg image for the guild icon |
| owner_id | snowflake | user id to transfer guild ownership to (must be owner) |
| splash | string | base64 128x128 jpeg image for the guild splash (VIP only) |

## Delete Guild % DELETE /guilds/{guild.id#DOCS_GUILD/guild-object}

Delete a guild permanently. User must be owner. Returns the [guild](#DOCS_GUILD/guild-object) object on success. Fires a [Guild Delete](#DOCS_GATEWAY/guild-delete) Gateway event.

## Get Guild Channels % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/channels

Returns a list of guild [channel](#DOCS_CHANNEL/guild-channel-object) objects.

## Create Guild Channel % POST /guilds/{guild.id#DOCS_GUILD/guild-object}/channels

Create a new [channel](#DOCS_CHANNEL/guild-channel-object) object for the guild. Requires the 'MANAGE_CHANNELS' permission. Returns the new [channel](#DOCS_CHANNEL/guild-channel-object) object on success. Fires a [Channel Create](#DOCS_GATEWAY/channel-create) Gateway event.

>info
> All parameters for this endpoint are optional excluding 'name'

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| name | string | channel name (2-100 characters) |
| type | string | "voice" or "text" |
| bitrate | integer | the bitrate (in bits) of the voice channel (voice only) |
| user_limit | integer | the user limit of the voice channel (voice only) |
| permission_overwrites | an array of [overwrite](#DOCS_CHANNEL/overwrite-object) objects | the channel's permission overwrites |

## Modify Guild Channel Positions % PATCH /guilds/{guild.id#DOCS_GUILD/guild-object}/channels

Modify the positions of a set of [channel](#DOCS_CHANNEL/guild-channel-object) objects for the guild. Requires 'MANAGE_CHANNELS' permission. Returns a list of all of the guild's [channel](#DOCS_CHANNEL/guild-channel-object) objects on success. Fires multiple [Channel Update](#DOCS_GATEWAY/channel-update) Gateway events.

>info
> Only channels to be modified are required, with the minimum being a swap between at least two channels.

This endpoint takes a JSON array of parameters in the following format:

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | channel id |
| position | integer | sorting position of the channel |

## Get Guild Member % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/members/{user.id#DOCS_USER/user-object}

Returns a [guild member](#DOCS_GUILD/guild-member-object) object for the specified user.

## List Guild Members % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/members

Returns a list of [guild member](#GUILD/guild-member-object) objects that are members of the guild.

>info
> All parameters to this endpoint are optional

###### Query String Params

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| limit | integer | max number of members to return (1-1000) | 1 |
| after | integer | the highest user id in the previous page | 0 |

## Add Guild Member % PUT /guilds/{guild.id#DOCS_GUILD/guild-object}/members/{user.id#DOCS_USER/user-object}

Adds a user to the guild, provided you have a valid oauth2 access token for the user with the `guilds.join` scope. Returns a 201 Created with the [guild member](#DOCS_GUILD/guild-member-object) as the body. Fires a [Guild Member Add](#DOCS_GATEWAY/guild-member-add) Gateway event. Requires the bot to have the `CREATE_INSTANT_INVITE` permission. 

>info
> All parameters to this endpoint except for `access_token` are optional.

###### JSON Params

| Field | Type | Description | Permission |
|-------|------|-------------|------------|
| access_token | string | an oauth2 access token granted with the `guilds.join` to the bot's application for the user you want to add to the guild | |
| nick | string | value to set users nickname to | MANAGE_NICKNAMES |
| roles | array | array of roles the member is assigned | MANAGE_ROLES |
| mute | bool | if the user is muted | MUTE_MEMBERS |
| deaf | bool | if the user is deafened | DEAFEN_MEMBERS |

## Modify Guild Member % PATCH /guilds/{guild.id#DOCS_GUILD/guild-object}/members/{user.id#DOCS_USER/user-object}

Modify attributes of a [guild member](#DOCS_GUILD/guild-member-object). Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_GATEWAY/guild-member-update) Gateway event.

>info
> All parameters to this endpoint are optional. When moving members to channels, the API user
> _must_ have permissions to both connect to the channel and have the MOVE_MEMBERS permission.

###### JSON Params

| Field | Type | Description | Permission |
|-------|------|-------------|------------|
| nick | string | value to set users nickname to | MANAGE_NICKNAMES |
| roles | array | array of roles the member is assigned | MANAGE_ROLES |
| mute | bool | if the user is muted | MUTE_MEMBERS |
| deaf | bool | if the user is deafened | DEAFEN_MEMBERS |
| channel_id | snowflake | id of channel to move user to (if they are connected to voice) | MOVE_MEMBERS |

## Modify Current User's Nick % PATCH /guilds/{guild.id#DOCS_GUILD/guild-object}/members/@me/nick

Modifies the nickname of the current user in a guild. Returns a 200 with the nickname on success. Fires a [Guild Member Update](#DOCS_GATEWAY/guild-member-update) Gateway event.

###### JSON Params

| Field | Type | Description | Permission |
|-------|------|-------------|------------|
| nick | string | value to set users nickname to | CHANGE_NICKNAME |

## Add Guild Member Role % PUT /guilds/{guild.id#DOCS_GUILD/guild-object}/members/{user.id#DOCS_USER/user-object}/roles/{role.id#DOCS_PERMISSIONS/role-object}

Adds a role to a [guild member](#DOCS_GUILD/guild-member-object). Requires the 'MANAGE_ROLES' permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_GATEWAY/guild-member-update) Gateway event.

## Remove Guild Member Role % DELETE /guilds/{guild.id#DOCS_GUILD/guild-object}/members/{user.id#DOCS_USER/user-object}/roles/{role.id#DOCS_PERMISSIONS/role-object}

Removes a role from a [guild member](#DOCS_GUILD/guild-member-object). Requires the 'MANAGE_ROLES' permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_GATEWAY/guild-member-update) Gateway event.

## Remove Guild Member % DELETE /guilds/{guild.id#DOCS_GUILD/guild-object}/members/{user.id#DOCS_USER/user-object}

Remove a member from a guild. Requires 'KICK_MEMBERS' permission. Returns a 204 empty response on success. Fires a [Guild Member Remove](#DOCS_GATEWAY/guild-member-remove) Gateway event.

## Get Guild Bans % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/bans

Returns a list of [user](#DOCS_USER/user-object) objects that are banned from this guild. Requires the 'BAN_MEMBERS' permission.

## Create Guild Ban % PUT /guilds/{guild.id#DOCS_GUILD/guild-object}/bans/{user.id#DOCS_USER/user-object}

Create a guild ban, and optionally delete previous messages sent by the banned user. Requires the 'BAN_MEMBERS' permission. Returns a 204 empty response on success. Fires a [Guild Ban Add](#DOCS_GATEWAY/guild-ban-add) Gateway event.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| delete-message-days | integer | number of days to delete messages for (0-7) |

## Remove Guild Ban % DELETE /guilds/{guild.id#DOCS_GUILD/guild-object}/bans/{user.id#DOCS_USER/user-object}

Remove the ban for a user. Requires the 'BAN_MEMBERS' permissions. Returns a 204 empty response on success. Fires a [Guild Ban Remove](#DOCS_GATEWAY/guild-ban-remove) Gateway event.

## Get Guild Roles % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/roles

Returns a list of [role](#DOCS_PERMISSIONS/role-object) objects for the guild. Requires the 'MANAGE_ROLES' permission.

## Create Guild Role % POST /guilds/{guild.id#DOCS_GUILD/guild-object}/roles

Create a new [role](#DOCS_PERMISSIONS/role-object) for the guild. Requires the 'MANAGE_ROLES' permission. Returns the new [role](#DOCS_PERMISSIONS/role-object) object on success. Fires a [Guild Role Create](#DOCS_GATEWAY/guild-role-create) Gateway event. All JSON params are optional.

###### JSON Params

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| name | string | name of the role | "new role" |
| permissions | integer | bitwise of the enabled/disabled permissions | @everyone permissions in guild |
| color | integer | RGB color value | 0 |
| hoist | bool | whether the role should be displayed separately in the sidebar | false |
| mentionable | bool | whether the role should be mentionable | false |

## Modify Guild Role Positions % PATCH /guilds/{guild.id#DOCS_GUILD/guild-object}/roles

Modify the positions of a set of [role](#DOCS_PERMISSIONS/role-object) objects for the guild. Requires the 'MANAGE_ROLES' permission. Returns a list of all of the guild's [role](#DOCS_PERMISSIONS/role-object) objects on success. Fires multiple [Guild Role Update](#DOCS_GATEWAY/guild-role-update) Gateway events.

This endpoint takes a JSON array of parameters in the following format:

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | role |
| position | integer | sorting position of the role |

## Modify Guild Role % PATCH /guilds/{guild.id#DOCS_GUILD/guild-object}/roles/{role.id#DOCS_PERMISSIONS/role-object}

Modify a guild role. Requires the 'MANAGE_ROLES' permission. Returns the updated [role](#DOCS_PERMISSIONS/role-object) on success. Fires a [Guild Role Update](#DOCS_GATEWAY/guild-role-update) Gateway event.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| name | string | name of the role |
| permissions | integer | bitwise of the enabled/disabled permissions |
| color | integer | RGB color value |
| hoist | bool | whether the role should be displayed separately in the sidebar |
| mentionable | bool | whether the role should be mentionable |

## Delete Guild Role % DELETE /guilds/{guild.id#DOCS_GUILD/guild-object}/roles/{role.id#DOCS_PERMISSIONS/role-object}

Delete a guild role. Requires the 'MANAGE_ROLES' permission. Returns a 204 empty response on success. Fires a [Guild Role Delete](#DOCS_GATEWAY/guild-role-delete) Gateway event.

## Get Guild Prune Count % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/prune

Returns an object with one 'pruned' key indicating the number of members that would be removed in a prune operation. Requires the 'KICK_MEMBERS' permission.

###### Query String Params

| Field | Type | Description |
|-------|------|-------------|
| days | integer | number of days to count prune for (1 or more) |

## Begin Guild Prune % POST /guilds/{guild.id#DOCS_GUILD/guild-object}/prune

Begin a prune operation. Requires the 'KICK_MEMBERS' permission. Returns an object with one 'pruned' key indicating the number of members that were removed in the prune operation. Fires multiple [Guild Member Remove](#DOCS_GATEWAY/guild-member-remove) Gateway events.

###### Query String Params

| Field | Type | Description |
|-------|------|-------------|
| days | integer | number of days to prune (1 or more) |

## Get Guild Voice Regions % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/regions

Returns a list of [voice region](#DOCS_VOICE/voice-region-object) objects for the guild. Unlike the similar `/voice` route, this returns VIP servers when the guild is VIP-enabled.

## Get Guild Invites % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/invites

Returns a list of [invite](#DOCS_INVITE/invite-object) objects (with [invite metadata](#DOCS_INVITE/invite-metadata-object)) for the guild. Requires the 'MANAGE_GUILD' permission.

## Get Guild Integrations % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/integrations

Returns a list of [integration](#DOCS_GUILD/integration-object) objects for the guild. Requires the 'MANAGE_GUILD' permission.

## Create Guild Integration % POST /guilds/{guild.id#DOCS_GUILD/guild-object}/integrations

Attach an [integration](#DOCS_GUILD/integration-object) object from the current user to the guild. Requires the 'MANAGE_GUILD' permission. Returns a 204 empty response on success. Fires a [Guild Integrations Update](#DOCS_GATEWAY/guild-integrations-update) Gateway event.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| type | string | the integration type |
| id | snowflake | the integration id |

## Modify Guild Integration % PATCH /guilds/{guild.id#DOCS_GUILD/guild-object}/integrations/{integration.id#DOCS_GUILD/integration-object}

Modify the behavior and settings of a [integration](#DOCS_GUILD/integration-object) object for the guild. Requires the 'MANAGE_GUILD' permission. Returns a 204 empty response on success. Fires a [Guild Integrations Update](#DOCS_GATEWAY/guild-integrations-update) Gateway event.

###### JSON Params

| Field | Type | Description |
|-------|------|-------------|
| expire_behavior | integer | the behavior when an integration subscription lapses (see the [integration](#DOCS_GUILD/integration-object) object documentation) |
| expire\_grace\_period | integer | period (in seconds) where the integration will ignore lapsed subscriptions |
| enable_emoticons | bool | whether emoticons should be synced for this integration (twitch only currently) |

## Delete Guild Integration % DELETE /guilds/{guild.id#DOCS_GUILD/guild-object}/integrations/{integration.id#DOCS_GUILD/integration-object}

Delete the attached [integration](#DOCS_GUILD/integration-object) object for the guild. Requires the 'MANAGE_GUILD' permission. Returns a 204 empty response on success. Fires a [Guild Integrations Update](#DOCS_GATEWAY/guild-integrations-update) Gateway event.

## Sync Guild Integration % POST /guilds/{guild.id#DOCS_GUILD/guild-object}/integrations/{integration.id#DOCS_GUILD/integration-object}/sync

Sync an integration. Requires the 'MANAGE_GUILD' permission. Returns a 204 empty response on success.

## Get Guild Embed % GET /guilds/{guild.id#DOCS_GUILD/guild-object}/embed

Returns the [guild embed](#DOCS_GUILD/guild-embed-object) object. Requires the 'MANAGE_GUILD' permission.

## Modify Guild Embed % PATCH /guilds/{guild.id#DOCS_GUILD/guild-object}/embed

Modify a [guild embed](#DOCS_GUILD/guild-embed-object) object for the guild. All attributes may be passed in with JSON and modified. Requires the 'MANAGE_GUILD' permission. Returns the updated [guild embed](#DOCS_GUILD/guild-embed-object) object.
