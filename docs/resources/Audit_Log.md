# Audit Logs Resource

## Audit Logs

When an administrative action is performed in a guild, an entry is added to its audit log. Viewing audit logs requires the `VIEW_AUDIT_LOG` permission and can be fetched by apps using the [`GET /guilds/{guild.id}/audit-logs` endpoint](#DOCS_RESOURCES_AUDIT_LOG/get-guild-audit-log), or seen by users in the guild's **Server Settings**. All audit log entries are stored for 45 days.

When an app is performing an eligible action using the APIs, it can pass an `X-Audit-Log-Reason` header to indicate why the action was taken. More information is in the [audit log entry](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object) section.

### Audit Log Object

###### Audit Log Structure

| Field                  | Type                                                                                                         | Description                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| audit_log_entries      | array of [audit log entry](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object) objects                         | List of audit log entries, sorted from most to least recent |
| guild_scheduled_events | array of [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) objects | List of guild scheduled events found in the audit log       |
| integrations           | array of partial [integration](#DOCS_RESOURCES_GUILD/integration-object) objects                             | List of partial integration objects                         |
| threads                | array of thread-specific [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects                           | List of threads found in the audit log\*                    |
| users                  | array of [user](#DOCS_RESOURCES_USER/user-object) objects                                                    | List of users found in the audit log                        |
| webhooks               | array of [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects                                           | List of webhooks found in the audit log                     |

\* Threads referenced in `THREAD_CREATE` and `THREAD_UPDATE` events are included in the threads map since archived threads might not be kept in memory by clients.

###### Example Partial Integration Object

```json
{
  "id": "33590653072239123",
  "name": "A Name",
  "type": "twitch",
  "account": {
    "name": "twitchusername",
    "id": "1234567"
  },
  "application_id": "94651234501213162"
}
```

### Audit Log Entry Object

Each audit log entry represents a single administrative action (or [event](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-audit-log-events)), indicated by `action_type`. Each entry contains one to many changes in the `changes` array that affected an entity in Discord—whether that's a user, channel, guild, emoji, or something else.

The information (and structure) of an entry's changes will be different depending on its type. For example, in `MEMBER_ROLE_UPDATE` events there is only one change: a member is either added or removed from a specific role. However, in `CHANNEL_CREATE` events there are many changes, including but not limited to the channel's name, type, and permission overwrites added. More details are in the [change object](#DOCS_RESOURCES_AUDIT_LOG/audit-log-change-object) section.

Apps can specify why an administrative action is being taken by passing an `X-Audit-Log-Reason` request header, which will be stored as the audit log entry's `reason` field. The `X-Audit-Log-Reason` header supports 1-512 URL-encoded UTF-8 characters. The entry's reason is visible to users in the client and when fetching audit log entries with the API.

###### Audit Log Entry Structure

| Field       | Type                                                                                                    | Description                                           |
| ----------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| target_id   | ?string                                                                                                 | ID of the affected entity (webhook, user, role, etc.) |
| changes?    | array of [audit log change](#DOCS_RESOURCES_AUDIT_LOG/audit-log-change-object) objects                  | Changes made to the target_id                         |
| user_id     | ?snowflake                                                                                              | User or app that made the changes                     |
| id          | snowflake                                                                                               | ID of the entry                                       |
| action_type | [audit log event](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-audit-log-events)                    | Type of action that occurred                          |
| options?    | [optional audit entry info](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-optional-audit-entry-info) | Additional info for certain action types              |
| reason?     | string                                                                                                  | Reason for the change (1-512 characters)              |

> warn
> For `APPLICATION_COMMAND_PERMISSION_UPDATE` events, the `target_id` is the app ID since the `changes` array may contain several permission changes for different individual entities

###### Audit Log Events

The table below documents audit log events, and their corresponding `action_type` values, that your app may receive.

The **Object Changed** column corresponds with that object that's changed. Though there are exceptions, the possible keys in the `changes` array usually correspond to the object's fields, which can be found in its linked documentation.

If no object is noted, it means that there isn't a `changes` array in the entry, though other fields like the `target_id` still exist and many have fields in the [`options` array](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-optional-audit-entry-info).


| Event                                 | Value | Description                                               | Object Changed                                                                                                                                   |
| ------------------------------------- | ----- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| GUILD_UPDATE                          | 1     | Server settings were updated                              | [Guild](#DOCS_RESOURCES_GUILD/guild-object)                                                                                                      |
| CHANNEL_CREATE                        | 10    | Channel was created                                       | [Channel](#DOCS_RESOURCES_CHANNEL/channel-object)                                                                                                |
| CHANNEL_UPDATE                        | 11    | Channel settings were updated                             | [Channel](#DOCS_RESOURCES_CHANNEL/channel-object)                                                                                                |
| CHANNEL_DELETE                        | 12    | Channel was deleted                                       | [Channel](#DOCS_RESOURCES_CHANNEL/channel-object)                                                                                                |
| CHANNEL_OVERWRITE_CREATE              | 13    | Permission overwrite was added to a channel               | [Channel Overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object)                                                                                    |
| CHANNEL_OVERWRITE_UPDATE              | 14    | Permission overwrite was updated for a channel            | [Channel Overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object)                                                                                    |
| CHANNEL_OVERWRITE_DELETE              | 15    | Permission overwrite was deleted from a channel           | [Channel Overwrite](#DOCS_RESOURCES_CHANNEL/overwrite-object)                                                                                    |
| MEMBER_KICK                           | 20    | Member was removed from server                            |                                                                                                                                                  |
| MEMBER_PRUNE                          | 21    | Members were pruned from server                           |                                                                                                                                                  |
| MEMBER_BAN_ADD                        | 22    | Member was banned from server                             |                                                                                                                                                  |
| MEMBER_BAN_REMOVE                     | 23    | Server ban was lifted for a member                        |                                                                                                                                                  |
| MEMBER_UPDATE                         | 24    | Member was updated in server                              | [Member](#DOCS_RESOURCES_GUILD/guild-member-object)                                                                                              |
| MEMBER_ROLE_UPDATE                    | 25    | Member was added or removed from a role                   | [Partial Role](#DOCS_TOPICS_PERMISSIONS/role-object)\*                                                                                           |
| MEMBER_MOVE                           | 26    | Member was moved to a different voice channel             |                                                                                                                                                  |
| MEMBER_DISCONNECT                     | 27    | Member was disconnected from a voice channel              |                                                                                                                                                  |
| BOT_ADD                               | 28    | Bot user was added to server                              |                                                                                                                                                  |
| ROLE_CREATE                           | 30    | Role was created                                          | [Role](#DOCS_TOPICS_PERMISSIONS/role-object)                                                                                                     |
| ROLE_UPDATE                           | 31    | Role was edited                                           | [Role](#DOCS_TOPICS_PERMISSIONS/role-object)                                                                                                     |
| ROLE_DELETE                           | 32    | Role was deleted                                          | [Role](#DOCS_TOPICS_PERMISSIONS/role-object)                                                                                                     |
| INVITE_CREATE                         | 40    | Server invite was created                                 | [Invite](#DOCS_RESOURCES_INVITE/invite-object) and [Invite Metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)*                             |
| INVITE_UPDATE                         | 41    | Server invite was updated                                 | [Invite](#DOCS_RESOURCES_INVITE/invite-object) and [Invite Metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)*                             |
| INVITE_DELETE                         | 42    | Server invite was deleted                                 | [Invite](#DOCS_RESOURCES_INVITE/invite-object) and [Invite Metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)*                             |
| WEBHOOK_CREATE                        | 50    | Webhook was created                                       | [Webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object)\*                                                                                              |
| WEBHOOK_UPDATE                        | 51    | Webhook properties or channel were updated                | [Webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object)\*                                                                                              |
| WEBHOOK_DELETE                        | 52    | Webhook was deleted                                       | [Webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object)\*                                                                                              |
| EMOJI_CREATE                          | 60    | Emoji was created                                         | [Emoji](#DOCS_RESOURCES_EMOJI/emoji-object)                                                                                                      |
| EMOJI_UPDATE                          | 61    | Emoji name was updated                                    | [Emoji](#DOCS_RESOURCES_EMOJI/emoji-object)                                                                                                      |
| EMOJI_DELETE                          | 62    | Emoji was deleted                                         | [Emoji](#DOCS_RESOURCES_EMOJI/emoji-object)                                                                                                      |
| MESSAGE_DELETE                        | 72    | Single message was deleted                                |                                                                                                                                                  |
| MESSAGE_BULK_DELETE                   | 73    | Multiple messages were deleted                            |                                                                                                                                                  |
| MESSAGE_PIN                           | 74    | Messaged was pinned to a channel                          |                                                                                                                                                  |
| MESSAGE_UNPIN                         | 75    | Message was unpinned from a channel                       |                                                                                                                                                  |
| INTEGRATION_CREATE                    | 80    | App was added to server                                   | [Integration](#DOCS_RESOURCES_GUILD/integration-object)                                                                                          |
| INTEGRATION_UPDATE                    | 81    | App was updated (as an example, its scopes were updated)  | [Integration](#DOCS_RESOURCES_GUILD/integration-object)                                                                                          |
| INTEGRATION_DELETE                    | 82    | App was removed from server                               | [Integration](#DOCS_RESOURCES_GUILD/integration-object)                                                                                          |
| STAGE_INSTANCE_CREATE                 | 83    | Stage instance was created (stage channel becomes live)   | [Stage Instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object)                                                                           |
| STAGE_INSTANCE_UPDATE                 | 84    | Stage instace details were updated                        | [Stage Instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object)                                                                           |
| STAGE_INSTANCE_DELETE                 | 85    | Stage instance was deleted (stage channel no longer live) | [Stage Instance](#DOCS_RESOURCES_STAGE_INSTANCE/stage-instance-object)                                                                           |
| STICKER_CREATE                        | 90    | Sticker was created                                       | [Sticker](#DOCS_RESOURCES_STICKER/sticker-object)                                                                                                |
| STICKER_UPDATE                        | 91    | Sticker details were updated                              | [Sticker](#DOCS_RESOURCES_STICKER/sticker-object)                                                                                                |
| STICKER_DELETE                        | 92    | Sticker was deleted                                       | [Sticker](#DOCS_RESOURCES_STICKER/sticker-object)                                                                                                |
| GUILD_SCHEDULED_EVENT_CREATE          | 100   | Event was created                                         | [Guild Scheduled Event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object)                                                      |
| GUILD_SCHEDULED_EVENT_UPDATE          | 101   | Event was updated                                         | [Guild Scheduled Event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object)                                                      |
| GUILD_SCHEDULED_EVENT_DELETE          | 102   | Event was cancelled                                       | [Guild Scheduled Event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object)                                                      |
| THREAD_CREATE                         | 110   | Thread was created in a channel                           | [Thread](#DOCS_RESOURCES_CHANNEL/thread-metadata-object)                                                                                         |
| THREAD_UPDATE                         | 111   | Thread was updated                                        | [Thread](#DOCS_RESOURCES_CHANNEL/thread-metadata-object)                                                                                         |
| THREAD_DELETE                         | 112   | Thread was deleted                                        | [Thread](#DOCS_RESOURCES_CHANNEL/thread-metadata-object)                                                                                         |
| APPLICATION_COMMAND_PERMISSION_UPDATE | 121   | Permissions were updated for a command                    | [Command Permission](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permissions-structure)\* |

\* Object has an exception to available keys. See the [exceptions](#DOCS_RESOURCES_AUDIT_LOG/audit-log-change-object-audit-log-change-key-exceptions) section below for details.

###### Optional Audit Entry Info

| Field              | Type      | Description                                                      | Event Type                                                                                                                         |
| ------------------ | --------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| application_id     | snowflake | ID of the app whose permissions were targeted                    | APPLICATION_COMMAND_PERMISSION_UPDATE                                                                                              |
| channel_id         | snowflake | Channel in which the entities were targeted                      | MEMBER_MOVE & MESSAGE_PIN & MESSAGE_UNPIN & MESSAGE_DELETE & STAGE_INSTANCE_CREATE & STAGE_INSTANCE_UPDATE & STAGE_INSTANCE_DELETE |
| count              | string    | Number of entities that were targeted                            | MESSAGE_DELETE & MESSAGE_BULK_DELETE & MEMBER_DISCONNECT & MEMBER_MOVE                                                             |
| delete_member_days | string    | Number of days after which inactive members were kicked          | MEMBER_PRUNE                                                                                                                       |
| id                 | snowflake | ID of the overwritten entity                                     | CHANNEL_OVERWRITE_CREATE & CHANNEL_OVERWRITE_UPDATE & CHANNEL_OVERWRITE_DELETE                                                     |
| members_removed    | string    | Number of members removed by the prune                           | MEMBER_PRUNE                                                                                                                       |
| message_id         | snowflake | ID of the message that was targeted                              | MESSAGE_PIN & MESSAGE_UNPIN                                                                                                        |
| role_name          | string    | Name of the role if type is `"0"` (not present if type is `"1"`) | CHANNEL_OVERWRITE_CREATE & CHANNEL_OVERWRITE_UPDATE & CHANNEL_OVERWRITE_DELETE                                                     |
| type               | string    | Type of overwritten entity - role (`"0"`) or member (`"1"`)      | CHANNEL_OVERWRITE_CREATE & CHANNEL_OVERWRITE_UPDATE & CHANNEL_OVERWRITE_DELETE                                                     |

### Audit Log Change Object

Many audit log events include a `changes` array in their [entry object](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-audit-log-entry-structure). The structure for the individual changes varies based on the event type and its changed objects, so apps shouldn't depend on a single pattern of handling audit log events.

###### Audit Log Change Structure

> warn
> `APPLICATION_COMMAND_PERMISSIONS_UPDATE` and `MEMBER_ROLE_UPDATE` events don't follow the same pattern as other audit log events. Details can be found in the [change key](#DOCS_RESOURCES_AUDIT_LOG/audit-log-change-object-audit-log-change-key-exceptions) section.

> info
> If `new_value` is not present in the change object while `old_value` is, it indicates that the changed property has been reset or set to `null`.

| Field      | Type                                                                            | Description                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| new_value? | [mixed](#DOCS_RESOURCES_AUDIT_LOG/audit-log-change-object-audit-log-change-key) | New value of the key                                                                                                          |
| old_value? | [mixed](#DOCS_RESOURCES_AUDIT_LOG/audit-log-change-object-audit-log-change-key) | Old value of the key                                                                                                          |
| key        | string                                                                          | Name of the changed entity |

###### Audit Log Change Key Exceptions

For most objects, the change keys can be any field included on the object, and the types and descriptions can be found in the respective documentation. The following table details possible exceptions to this pattern for select objects. 

> info
> IDs that aren't in the object's payload refer to nested IDs. For example, the `channel_id` change key for invite objects corresponds to its `channel` object's `id` field.

| Object Changed                                                                                                                                   | Change Key Exceptions                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| [Command Permission](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permissions-structure)\* | only snowflake                           |
| [Invite](#DOCS_RESOURCES_INVITE/invite-object) and [Invite Metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)                              | `channel_id` instead of a channel object |
| [Partial Role](#DOCS_TOPICS_PERMISSIONS/role-object)\*\*                                                                                         | onlu `$add` and `$remove`                |
| [Webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object)                                                                                                | `avatar_hash`                            |

\* `APPLICATION_COMMAND_PERMISSIONS_UPDATE` events use a snowflake as the change key. The `changes` array contains objects with a `key` field representing the entity whose command was affected (role, channel, or user ID), a previous permissions object (with an `old_value` key), and an updated permissions object (with a `new_value` key).

\*\* `MEMBER_ROLE_UPDATE` events use `$add` and `$remove` as the change keys. `new_value` is an array of objects that contain the role `id` and `name`.

## Get Guild Audit Log % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/audit-logs

Returns an [audit log](#DOCS_RESOURCES_AUDIT_LOG/audit-log-object) object for the guild. Requires the [`VIEW_AUDIT_LOG`](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) permission.

###### Query String Params

The following parameters can be used to filter which and how many audit log entries are returned.

| Field       | Type      | Description                                                                                                 |
| ----------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| user_id     | snowflake | Entries from a specific user ID                                                                             |
| action_type | integer   | Entries for a specific [audit log event](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-audit-log-events) |
| before      | snowflake | Entries that preceded a specific audit log entry ID                                                         |
| limit       | integer   | Maximum number of entries (between 1-100) to return, defaults to 50                                         |
