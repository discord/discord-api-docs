# Permissions

Permissions in Discord are a way to limit and grant certain abilities to users. A set of base permissions can be configured at the guild level for different roles, when these roles are attached to users they grant or revoke specific privileges within the guild. Along with the global guild-level permissions, Discord also supports role overwrites which can be set at the channel level allowing customization of permissions on a per-role, per-channel basis.

Permissions in Discord are stored within a 53-bit integer and are calculated using bitwise operations. Permissions for a user in a given channel can be calculated by ANDing together their guild-level role permission integers, and their channel-level role permission integers. For more information about bitwise operations and flags, see [this page](https://en.wikipedia.org/wiki/Bit_field).

###### Bitwise Permission Flags

| Permission | Value | Description |
|------------|-------|-----------|
| CREATE\_INSTANT\_INVITE | `0x0000001` | Allows creating of instant invites |
| KICK_MEMBERS | `0x0000002` | Allows kicking members |
| BAN_MEMBERS | `0x0000004` | Allows banning members |
| MANAGE_ROLES | `0x0000008` | Allows management and editing of roles |
| MANAGE_CHANNELS | `0x0000010` | Allows management and editing of channels |
| MANAGE_GUILD | `0x0000020` | Allows management and editing of the guild |
| READ_MESSAGES | `0x0000400` | Allows reading messages in a channel. The channel will not appear for users without this permission |
| SEND_MESSAGES | `0x0000800` | Allows for sending messages in a channel. |
| SEND\_TTS_MESSAGES | `0x0001000` | Allows for sending of `/tts` messages |
| MANAGE_MESSAGES  | `0x0002000` | Allows for deleting messages |
| EMBED_LINKS | `0x0004000` | Links sent by this user will be auto-embedded |
| ATTACH_FILES | `0x0008000` | Allows for uploading images and files |
| READ\_MESSAGE_HISTORY | `0x0010000` | Allows for reading messages history |
| MENTION_EVERYONE | `0x0020000` | Allows for using the `@everyone` tag to notify all users in a channel |
| CONNECT | `0x0100000` | Allows for joining of a voice channel |
| SPEAK | `0x0200000` | Allows for speaking in a voice channel |
| MUTE_MEMBERS | `0x0400000` | Allows for muting members in a voice channel |
| DEAFEN_MEMBERS | `0x0800000` | Allows for deafening of members in a voice channel |
| MOVE_MEMBERS | `0x1000000` | Allows for moving of members between voice channels |
| USE_VAD | `0x2000000` | Allows for using voice-activity-detection in a voice channel |


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

###### Example Role

```json
{
	"id": "41771983423143936",
	"name": "WE DEM BOYZZ!!!!!!",
	"color": 3447003,
	"hoist": true,
	"position": 1,
	"permissions": 66321471,
	"managed": false
}
```
