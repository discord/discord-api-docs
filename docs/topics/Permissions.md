# Permissions

Permissions in Discord are a way to limit and grant certain abilities to users. A set of base permissions can be configured at the guild level for different roles. When these roles are attached to users, they grant or revoke specific privileges within the guild. Along with the guild-level permissions, Discord also supports permission overwrites that can be assigned to individual guild roles or guild members on a per-channel basis.

Permissions are stored within a variable-length integer serialized into a string, and are calculated using bitwise operations. For example, the permission value `123` will be serialized as `"123"`. For long-term stability, we recommend deserializing the permissions using your languages' Big Integer libraries. The total permissions integer can be determined by ORing together each individual value, and flags can be checked using AND operations.

In API v8, all permissions—including `allow` and `deny` fields in overwrites—are serialized as strings. There are also no longer `_new` permission fields; all new permissions are rolled back into the base field.

In API v6, the `permissions`, `allow`, and `deny` fields in roles and overwrites are still serialized as a number; however, these numbers shall not grow beyond 31 bits. During the remaining lifetime of API v6, all new permission bits will only be introduced in `permissions_new`, `allow_new`, and `deny_new`. These `_new` fields are just for response serialization; requests with these fields should continue to use the original `permissions`, `allow`, and `deny` fields, which accept both string or number values.

```python
# Permissions value that can Send Messages (0x800) and Add Reactions (0x40):
permissions = 0x40 | 0x800 # 2112

# Checking for flags that are set:
(permissions & 0x40) == 0x40   # True
(permissions & 0x800) == 0x800 # True

# Kick Members (0x2) was not set:
(permissions & 0x2) == 0x2 # False
```

Additional logic is required when permission overwrites are involved; this is further explained below. For more information about bitwise operations and flags, see [this page](https://en.wikipedia.org/wiki/Bit_field).

Below is a table of all current permissions, their integer values in hexadecimal, brief descriptions of the privileges that they grant, and the channel type they apply to, if applicable.

###### Bitwise Permission Flags

| Permission                    | Value                            | Description                                                                                                                                         | Channel Type |
| ----------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| CREATE_INSTANT_INVITE         | `0x0000000000000001` `(1 << 0)`  | Allows creation of instant invites                                                                                                                  | T, V, S      |
| KICK_MEMBERS \*               | `0x0000000000000002` `(1 << 1)`  | Allows kicking members                                                                                                                              |              |
| BAN_MEMBERS \*                | `0x0000000000000004` `(1 << 2)`  | Allows banning members                                                                                                                              |              |
| ADMINISTRATOR \*              | `0x0000000000000008` `(1 << 3)`  | Allows all permissions and bypasses channel permission overwrites                                                                                   |              |
| MANAGE_CHANNELS \*            | `0x0000000000000010` `(1 << 4)`  | Allows management and editing of channels                                                                                                           | T, V, S      |
| MANAGE_GUILD \*               | `0x0000000000000020` `(1 << 5)`  | Allows management and editing of the guild                                                                                                          |              |
| ADD_REACTIONS                 | `0x0000000000000040` `(1 << 6)`  | Allows for the addition of reactions to messages                                                                                                    | T            |
| VIEW_AUDIT_LOG                | `0x0000000000000080` `(1 << 7)`  | Allows for viewing of audit logs                                                                                                                    |              |
| PRIORITY_SPEAKER              | `0x0000000000000100` `(1 << 8)`  | Allows for using priority speaker in a voice channel                                                                                                | V            |
| STREAM                        | `0x0000000000000200` `(1 << 9)`  | Allows the user to go live                                                                                                                          | V            |
| VIEW_CHANNEL                  | `0x0000000000000400` `(1 << 10)` | Allows guild members to view a channel, which includes reading messages in text channels and joining voice channels                                 | T, V, S      |
| SEND_MESSAGES                 | `0x0000000000000800` `(1 << 11)` | Allows for sending messages in a channel (does not allow sending messages in threads)                                                               | T            |
| SEND_TTS_MESSAGES             | `0x0000000000001000` `(1 << 12)` | Allows for sending of `/tts` messages                                                                                                               | T            |
| MANAGE_MESSAGES \*            | `0x0000000000002000` `(1 << 13)` | Allows for deletion of other users messages                                                                                                         | T            |
| EMBED_LINKS                   | `0x0000000000004000` `(1 << 14)` | Links sent by users with this permission will be auto-embedded                                                                                      | T            |
| ATTACH_FILES                  | `0x0000000000008000` `(1 << 15)` | Allows for uploading images and files                                                                                                               | T            |
| READ_MESSAGE_HISTORY          | `0x0000000000010000` `(1 << 16)` | Allows for reading of message history                                                                                                               | T            |
| MENTION_EVERYONE              | `0x0000000000020000` `(1 << 17)` | Allows for using the `@everyone` tag to notify all users in a channel, and the `@here` tag to notify all online users in a channel                  | T            |
| USE_EXTERNAL_EMOJIS           | `0x0000000000040000` `(1 << 18)` | Allows the usage of custom emojis from other servers                                                                                                | T            |
| VIEW_GUILD_INSIGHTS           | `0x0000000000080000` `(1 << 19)` | Allows for viewing guild insights                                                                                                                   |              |
| CONNECT                       | `0x0000000000100000` `(1 << 20)` | Allows for joining of a voice channel                                                                                                               | V, S         |
| SPEAK                         | `0x0000000000200000` `(1 << 21)` | Allows for speaking in a voice channel                                                                                                              | V            |
| MUTE_MEMBERS                  | `0x0000000000400000` `(1 << 22)` | Allows for muting members in a voice channel                                                                                                        | V, S         |
| DEAFEN_MEMBERS                | `0x0000000000800000` `(1 << 23)` | Allows for deafening of members in a voice channel                                                                                                  | V, S         |
| MOVE_MEMBERS                  | `0x0000000001000000` `(1 << 24)` | Allows for moving of members between voice channels                                                                                                 | V, S         |
| USE_VAD                       | `0x0000000002000000` `(1 << 25)` | Allows for using voice-activity-detection in a voice channel                                                                                        | V            |
| CHANGE_NICKNAME               | `0x0000000004000000` `(1 << 26)` | Allows for modification of own nickname                                                                                                             |              |
| MANAGE_NICKNAMES              | `0x0000000008000000` `(1 << 27)` | Allows for modification of other users nicknames                                                                                                    |              |
| MANAGE_ROLES \*               | `0x0000000010000000` `(1 << 28)` | Allows management and editing of roles                                                                                                              | T, V, S      |
| MANAGE_WEBHOOKS \*            | `0x0000000020000000` `(1 << 29)` | Allows management and editing of webhooks                                                                                                           | T            |
| MANAGE_EMOJIS_AND_STICKERS \* | `0x0000000040000000` `(1 << 30)` | Allows management and editing of emojis and stickers                                                                                                |              |
| USE_APPLICATION_COMMANDS      | `0x0000000080000000` `(1 << 31)` | Allows members to use application commands, including slash commands and context menu commands.                                                     | T            |
| REQUEST_TO_SPEAK              | `0x0000000100000000` `(1 << 32)` | Allows for requesting to speak in stage channels. (_This permission is under active development and may be changed or removed._)                    | S            |
| MANAGE_EVENTS                 | `0x0000000200000000` `(1 << 33)` | Allows for creating, editing, and deleting scheduled events                                                                                         | V, S         |
| MANAGE_THREADS \*             | `0x0000000400000000` `(1 << 34)` | Allows for deleting and archiving threads, and viewing all private threads                                                                          | T            |
| CREATE_PUBLIC_THREADS         | `0x0000000800000000` `(1 << 35)` | Allows for creating public and announcement threads                                                                                                 | T            |
| CREATE_PRIVATE_THREADS        | `0x0000001000000000` `(1 << 36)` | Allows for creating private threads                                                                                                                 | T            |
| USE_EXTERNAL_STICKERS         | `0x0000002000000000` `(1 << 37)` | Allows the usage of custom stickers from other servers                                                                                              | T            |
| SEND_MESSAGES_IN_THREADS      | `0x0000004000000000` `(1 << 38)` | Allows for sending messages in threads                                                                                                              | T            |
| USE_EMBEDDED_ACTIVITIES       | `0x0000008000000000` `(1 << 39)` | Allows for using Activities (applications with the `EMBEDDED` flag) in a voice channel                                                              | V            |
| MODERATE_MEMBERS \*\*         | `0x0000010000000000` `(1 << 40)` | Allows for timing out users to prevent them from sending or reacting to messages in chat and threads, and from speaking in voice and stage channels |              |

**\* These permissions require the owner account to use [two-factor authentication](#DOCS_TOPICS_OAUTH2/twofactor-authentication-requirement) when used on a guild that has server-wide 2FA enabled.**

**\*\* See [Permissions for Timed Out Members](#DOCS_TOPICS_PERMISSIONS/permissions-for-timed-out-members) to understand how permissions are temporarily modified for timed out users.**

Note that these internal permission names may be referred to differently by the Discord client. For example, "Manage Permissions" refers to MANAGE_ROLES, "Use Voice Activity" refers to USE_VAD, and "Timeout Members" refers to MODERATE_MEMBERS.

## Permission Hierarchy

How permissions apply may at first seem intuitive, but there are some hidden restrictions that prevent bots from performing certain inappropriate actions based on a bot's highest role compared to its target's highest role. A bot's or user's highest role is its role that has the greatest position value in the guild, with the default @everyone role starting at 0. Permissions follow a hierarchy with the following rules:

- A bot can grant roles to other users that are of a lower position than its own highest role.
- A bot can edit roles of a lower position than its highest role, but it can only grant permissions it has to those roles.
- A bot can only sort roles lower than its highest role.
- A bot can only kick, ban, and edit nicknames for users whose highest role is lower than the bot's highest role.

Otherwise, permissions do not obey the role hierarchy. For example, a user has two roles: A and B. A denies the `VIEW_CHANNEL` permission on a #coolstuff channel. B allows the `VIEW_CHANNEL` permission on the same #coolstuff channel. The user would ultimately be able to view the #coolstuff channel, regardless of the role positions.

## Permission Overwrites

Certain permissions can be applied to roles or directly to members on a channel-level by using permission overwrites. Applicable permissions are indicated by a **T** for text channels, **V** for voice channels, or **S** for stage channels in the table above.

When using overwrites, there are cases where permission collisions could occur for a user; that is to say, the user may have certain overwrites with permissions that contradict each other or their guild-level role permissions. With this in mind, permissions are applied to users in the following hierarchy:

1. Base permissions given to @everyone are applied at a guild level
2. Permissions allowed to a user by their roles are applied at a guild level
3. Overwrites that deny permissions for @everyone are applied at a channel level
4. Overwrites that allow permissions for @everyone are applied at a channel level
5. Overwrites that deny permissions for specific roles are applied at a channel level
6. Overwrites that allow permissions for specific roles are applied at a channel level
7. Member-specific overwrites that deny permissions are applied at a channel level
8. Member-specific overwrites that allow permissions are applied at a channel level

The following pseudocode demonstrates this process programmatically:

```python
def compute_base_permissions(member, guild):
    if guild.is_owner(member):
        return ALL

    role_everyone = guild.get_role(guild.id)  # get @everyone role
    permissions = role_everyone.permissions

    for role in member.roles:
        permissions |= role.permissions

    if permissions & ADMINISTRATOR == ADMINISTRATOR:
        return ALL

    return permissions

def compute_overwrites(base_permissions, member, channel):
    # ADMINISTRATOR overrides any potential permission overwrites, so there is nothing to do here.
    if base_permissions & ADMINISTRATOR == ADMINISTRATOR:
        return ALL

    permissions = base_permissions
    overwrite_everyone = overwrites.get(channel.guild_id)  # Find (@everyone) role overwrite and apply it.
    if overwrite_everyone:
        permissions &= ~overwrite_everyone.deny
        permissions |= overwrite_everyone.allow

    # Apply role specific overwrites.
    overwrites = channel.permission_overwrites
    allow = NONE
    deny = NONE
    for role_id in member.roles:
        overwrite_role = overwrites.get(role_id)
        if overwrite_role:
            allow |= overwrite_role.allow
            deny |= overwrite_role.deny

    permissions &= ~deny
    permissions |= allow

    # Apply member specific overwrite if it exist.
    overwrite_member = overwrites.get(member.user_id)
    if overwrite_member:
        permissions &= ~overwrite_member.deny
        permissions |= overwrite_member.allow

    return permissions

def compute_permissions(member, channel):
    base_permissions = compute_base_permissions(member, channel.guild)
    return compute_overwrites(base_permissions, member, channel)
```

## Implicit Permissions

Permissions in Discord are sometimes implicitly denied or allowed based on logical use. The two main cases are `VIEW_CHANNEL` and `SEND_MESSAGES` for text channels. Denying a user or a role `VIEW_CHANNEL` on a channel implicitly denies other permissions on the channel. Though permissions like `SEND_MESSAGES` are not explicitly denied for the user, they are ignored because the user cannot read messages in the channel.

Denying `SEND_MESSAGES` implicitly denies `MENTION_EVERYONE`, `SEND_TTS_MESSAGES`, `ATTACH_FILES`, and `EMBED_LINKS`. Again, they are not explicitly denied when doing permissions calculations, but they are ignored because the user cannot do the base action of sending messages.

For voice and stage channels, denying the `CONNECT` permission also implicitly denies other permissions such as `MANAGE_CHANNEL`.

There may be other cases in which certain permissions implicitly deny or allow other permissions. In all cases, it is based on logical conclusions about how a user with certain permissions should or should not interact with Discord.

## Inherited Permissions (Threads)

Threads inherit permissions from the parent channel (the channel they were created in), with one exception: The `SEND_MESSAGES` permission is not inherited; users must have `SEND_MESSAGES_IN_THREADS` to send a message in a thread, which allows for users to participate in threads in places like announcement channels.

Users must have the `VIEW_CHANNEL` permission to view _any_ threads in the channel, even if they are directly mentioned or added to the thread.

## Permission Syncing

Permissions with regards to categories and channels within categories are a bit tricky. Rather than inheritance, permissions are calculated by means of what we call Permission Syncing. If a child channel has the same permissions and overwrites (or lack thereof) as its parent category, the channel is considered "synced" to the category. Any further changes to a **parent category** will be reflected in its synced child channels. Any further changes to a **child channel** will cause it to become de-synced from its parent category, and its permissions will no longer change with changes to its parent category.

### Role Object

Roles represent a set of permissions attached to a group of users. Roles have names, colors, and can be "pinned" to the side bar, causing their members to be listed separately. Roles can have separate permission profiles for the global context (guild) and channel context. The `@everyone` role has the same ID as the guild it belongs to.

###### Role Structure

| Field          | Type                                                                         | Description                                       |
| -------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- |
| id             | snowflake                                                                    | role id                                           |
| name           | string                                                                       | role name                                         |
| color          | integer                                                                      | integer representation of hexadecimal color code  |
| hoist          | boolean                                                                      | if this role is pinned in the user listing        |
| icon?          | ?string                                                                      | role [icon hash](#DOCS_REFERENCE/image-formatting)|
| unicode_emoji? | ?string                                                                      | role unicode emoji                                |
| position       | integer                                                                      | position of this role                             |
| permissions    | string                                                                       | permission bit set                                |
| managed        | boolean                                                                      | whether this role is managed by an integration    |
| mentionable    | boolean                                                                      | whether this role is mentionable                  |
| tags?          | [role tags](#DOCS_TOPICS_PERMISSIONS/role-object-role-tags-structure) object | the tags this role has                            |

Roles without colors (`color == 0`) do not count towards the final computed color in the user list.

###### Role Tags Structure

| Field               | Type      | Description                                         |
| ------------------- | --------- | --------------------------------------------------- |
| bot_id?             | snowflake | the id of the bot this role belongs to              |
| integration_id?     | snowflake | the id of the integration this role belongs to      |
| premium_subscriber? | null      | whether this is the guild's premium subscriber role |

###### Example Role

```json
{
  "id": "41771983423143936",
  "name": "WE DEM BOYZZ!!!!!!",
  "color": 3447003,
  "hoist": true,
  "icon": "cf3ced8600b777c9486c6d8d84fb4327",
  "unicode_emoji": null,
  "position": 1,
  "permissions": "66321471",
  "managed": false,
  "mentionable": false
}
```

## Permissions For Timed Out Members

Timed out members will temporarily lose all permissions except `VIEW_CHANNEL` and `READ_MESSAGE_HISTORY`. Owners and admin users with `ADMINISTRATOR` permissions are exempt.
