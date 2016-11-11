# Permissions

Permissions in Discord are a way to limit and grant certain abilities to users. A set of base permissions can be configured at the guild level for different roles, when these roles are attached to users they grant or revoke specific privileges within the guild. Along with the global guild-level permissions, Discord also supports role overwrites which can be set at the channel level allowing customization of permissions on a per-role, per-channel basis.

Permissions in Discord are stored within a 53-bit integer and are calculated using bitwise operations. Permissions for a user in a given channel can be calculated by ORing together their guild-level role permission integers, and their channel-level role permission integers. For more information about bitwise operations and flags, see [this page](https://en.wikipedia.org/wiki/Bit_field).

###### Bitwise Permission Flags

| Permission | Value | Description |
|------------|-------|-----------|
| CREATE\_INSTANT\_INVITE | `0x00000001` | Allows creation of instant invites |
| KICK\_MEMBERS * | `0x00000002` | Allows kicking members |
| BAN\_MEMBERS * | `0x00000004` | Allows banning members |
| ADMINISTRATOR * | `0x00000008` | Allows all permissions and bypasses channel permission overwrites |
| MANAGE\_CHANNELS * | `0x00000010` | Allows management and editing of channels |
| MANAGE\_GUILD * | `0x00000020` | Allows management and editing of the guild |
| ADD\_REACTIONS | `0x00000040` | Allows for the addition of reactions to messages |
| READ\_MESSAGES | `0x00000400` | Allows reading messages in a channel. The channel will not appear for users without this permission |
| SEND\_MESSAGES | `0x00000800` | Allows for sending messages in a channel. |
| SEND\_TTS\_MESSAGES | `0x00001000` | Allows for sending of `/tts` messages |
| MANAGE\_MESSAGES *  | `0x00002000` | Allows for deletion of other users messages |
| EMBED\_LINKS | `0x00004000` | Links sent by this user will be auto-embedded |
| ATTACH\_FILES | `0x00008000` | Allows for uploading images and files |
| READ\_MESSAGE\_HISTORY | `0x00010000` | Allows for reading of message history |
| MENTION\_EVERYONE | `0x00020000` | Allows for using the `@everyone` tag to notify all users in a channel, and the `@here` tag to notify all online users in a channel |
| USE\_EXTERNAL\_EMOJIS | `0x00040000` | Allows the usage of custom emojis from other servers |
| CONNECT | `0x00100000` | Allows for joining of a voice channel |
| SPEAK | `0x00200000` | Allows for speaking in a voice channel |
| MUTE\_MEMBERS | `0x00400000` | Allows for muting members in a voice channel |
| DEAFEN\_MEMBERS | `0x00800000` | Allows for deafening of members in a voice channel |
| MOVE\_MEMBERS | `0x01000000` | Allows for moving of members between voice channels |
| USE\_VAD | `0x02000000` | Allows for using voice-activity-detection in a voice channel |
| CHANGE\_NICKNAME | `0x04000000` | Allows for modification of own nickname |
| MANAGE\_NICKNAMES | `0x08000000` | Allows for modification of other users nicknames |
| MANAGE\_ROLES * | `0x10000000` | Allows management and editing of roles |
| MANAGE\_WEBHOOKS * | `0x20000000` | Allows management and editing of webhooks |
| MANAGE\_EMOJIS * | `0x40000000` | Allows management and editing of emojis |

**\* These permissions require the owner account to use [two-factor authentication](#DOCS_OAUTH2/twofactor-authentication-requirement) when used on a guild that has server-wide 2FA enabled.**

## Permission Hierarchy

Permissions follow a hierarchy with the following roles:

* A bot can grant roles to other users that are of a lower position than their highest role.
* A bot can edit roles of a lower position than their highest role, but they can only grant permissions they have to those roles.
* Bots can only sort roles lower than their highest role.
* Bots can only kick/ban users of with a lower highest role than themselves.


## Role Object

Roles represent a set of permissions attached to a group of users. Roles have unique names, colors, and can be "pinned" to the side bar, causing their members to be listed separately. Roles are unique per guild, and can have separate permission profiles for the global context (guild) and channel context.

###### Role Structure

| Field | Type | Description |
|-------|------|-------------|
| id | snowflake | role id |
| name | string | role name |
| color | integer | integer representation of hexadecimal color code |
| hoist | bool | if this role is pinned in the user listing |
| position | integer | position of this role |
| permissions | integer | permission bit set |
| managed | bool | whether this role is managed by an integration |
| mentionable | bool | whether this role is mentionable |

Roles without colors (`color == 0`) do not count towards the final computed color in the user list.

###### Example Role

```json
{
	"id": "41771983423143936",
	"name": "WE DEM BOYZZ!!!!!!",
	"color": 3447003,
	"hoist": true,
	"position": 1,
	"permissions": 66321471,
	"managed": false,
	"mentionable": false
}
```
