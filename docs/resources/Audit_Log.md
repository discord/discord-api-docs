# Audit Logs Resource

## Audit Logs

Whenever an admin action is performed on the API, an entry is added to the respective guild's audit log. You can specify the reason by attaching the `X-Audit-Log-Reason` request header. This header supports url encoded utf8 characters.

### Audit Log Object

###### Audit Log Structure

| Field                  | Type                                                                                                         | Description                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| audit_log_entries      | array of [audit log entry](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object) objects                         | list of audit log entries                             |
| guild_scheduled_events | array of [guild scheduled event](#DOCS_RESOURCES_GUILD_SCHEDULED_EVENT/guild-scheduled-event-object) objects | list of guild scheduled events found in the audit log |
| integrations           | array of partial [integration](#DOCS_RESOURCES_GUILD/integration-object) objects                             | list of partial integration objects                   |
| threads                | array of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects                                           | list of threads found in the audit log\*              |
| users                  | array of [user](#DOCS_RESOURCES_USER/user-object) objects                                                    | list of users found in the audit log                  |
| webhooks               | array of [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects                                           | list of webhooks found in the audit log               |

\* Threads referenced in THREAD_CREATE and THREAD_UPDATE events are included in the threads map, since archived threads might not be kept in memory by clients.

###### Example Partial Integration Object

```json
{
  "id": "33590653072239123",
  "name": "A Name",
  "type": "twitch",
  "account": {
    "name": "twitchusername",
    "id": "1234567"
  }
}
```

### Audit Log Entry Object

###### Audit Log Entry Structure

| Field       | Type                                                                                                    | Description                                           |
| ----------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| target_id   | ?string                                                                                                 | id of the affected entity (webhook, user, role, etc.) |
| changes?    | array of [audit log change](#DOCS_RESOURCES_AUDIT_LOG/audit-log-change-object) objects                  | changes made to the target_id                         |
| user_id     | ?snowflake                                                                                              | the user who made the changes                         |
| id          | snowflake                                                                                               | id of the entry                                       |
| action_type | [audit log event](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-audit-log-events)                    | type of action that occurred                          |
| options?    | [optional audit entry info](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-optional-audit-entry-info) | additional info for certain action types              |
| reason?     | string                                                                                                  | the reason for the change (0-512 characters)          |

###### Audit Log Events

| Event                                 | Value |
| ------------------------------------- | ----- |
| GUILD_UPDATE                          | 1     |
| CHANNEL_CREATE                        | 10    |
| CHANNEL_UPDATE                        | 11    |
| CHANNEL_DELETE                        | 12    |
| CHANNEL_OVERWRITE_CREATE              | 13    |
| CHANNEL_OVERWRITE_UPDATE              | 14    |
| CHANNEL_OVERWRITE_DELETE              | 15    |
| MEMBER_KICK                           | 20    |
| MEMBER_PRUNE                          | 21    |
| MEMBER_BAN_ADD                        | 22    |
| MEMBER_BAN_REMOVE                     | 23    |
| MEMBER_UPDATE                         | 24    |
| MEMBER_ROLE_UPDATE                    | 25    |
| MEMBER_MOVE                           | 26    |
| MEMBER_DISCONNECT                     | 27    |
| BOT_ADD                               | 28    |
| ROLE_CREATE                           | 30    |
| ROLE_UPDATE                           | 31    |
| ROLE_DELETE                           | 32    |
| INVITE_CREATE                         | 40    |
| INVITE_UPDATE                         | 41    |
| INVITE_DELETE                         | 42    |
| WEBHOOK_CREATE                        | 50    |
| WEBHOOK_UPDATE                        | 51    |
| WEBHOOK_DELETE                        | 52    |
| EMOJI_CREATE                          | 60    |
| EMOJI_UPDATE                          | 61    |
| EMOJI_DELETE                          | 62    |
| MESSAGE_DELETE                        | 72    |
| MESSAGE_BULK_DELETE                   | 73    |
| MESSAGE_PIN                           | 74    |
| MESSAGE_UNPIN                         | 75    |
| INTEGRATION_CREATE                    | 80    |
| INTEGRATION_UPDATE                    | 81    |
| INTEGRATION_DELETE                    | 82    |
| STAGE_INSTANCE_CREATE                 | 83    |
| STAGE_INSTANCE_UPDATE                 | 84    |
| STAGE_INSTANCE_DELETE                 | 85    |
| STICKER_CREATE                        | 90    |
| STICKER_UPDATE                        | 91    |
| STICKER_DELETE                        | 92    |
| GUILD_SCHEDULED_EVENT_CREATE          | 100   |
| GUILD_SCHEDULED_EVENT_UPDATE          | 101   |
| GUILD_SCHEDULED_EVENT_DELETE          | 102   |
| THREAD_CREATE                         | 110   |
| THREAD_UPDATE                         | 111   |
| THREAD_DELETE                         | 112   |
| APPLICATION_COMMAND_PERMISSION_UPDATE | 121   |

###### Optional Audit Entry Info

| Field              | Type      | Description                                                     | Action Type                                                                                                                        |
| ------------------ | --------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| channel_id         | snowflake | channel in which the entities were targeted                     | MEMBER_MOVE & MESSAGE_PIN & MESSAGE_UNPIN & MESSAGE_DELETE & STAGE_INSTANCE_CREATE & STAGE_INSTANCE_UPDATE & STAGE_INSTANCE_DELETE |
| count              | string    | number of entities that were targeted                           | MESSAGE_DELETE & MESSAGE_BULK_DELETE & MEMBER_DISCONNECT & MEMBER_MOVE                                                             |
| delete_member_days | string    | number of days after which inactive members were kicked         | MEMBER_PRUNE                                                                                                                       |
| id                 | snowflake | id of the overwritten entity                                    | CHANNEL_OVERWRITE_CREATE & CHANNEL_OVERWRITE_UPDATE & CHANNEL_OVERWRITE_DELETE                                                     |
| members_removed    | string    | number of members removed by the prune                          | MEMBER_PRUNE                                                                                                                       |
| message_id         | snowflake | id of the message that was targeted                             | MESSAGE_PIN & MESSAGE_UNPIN                                                                                                        |
| role_name          | string    | name of the role if type is "0" (not present if type is "1")    | CHANNEL_OVERWRITE_CREATE & CHANNEL_OVERWRITE_UPDATE & CHANNEL_OVERWRITE_DELETE                                                     |
| type               | string    | type of overwritten entity - "0" for "role" or "1" for "member" | CHANNEL_OVERWRITE_CREATE & CHANNEL_OVERWRITE_UPDATE & CHANNEL_OVERWRITE_DELETE                                                     |

### Audit Log Change Object

###### Audit Log Change Structure

> info
> If `new_value` is not present in the change object, while `old_value` is, that means the property that was changed has been reset, or set to `null`

| Field      | Type   | Description                                         |
| ---------- | ------ | --------------------------------------------------- |
| new_value? | mixed  | new value of the key                                |
| old_value? | mixed  | old value of the key                                |
| key        | string | name of an entity in the target which was changed\* |

\* `key` may also be `$add` or `$remove` for guild changes in cases when roles were added or removed. The value will be an array of partial role objects.

###### Example Partial Role Object

```json
{
  "name": "I am a role",
  "id": 584120723283509258
}
```

## Get Guild Audit Log % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/audit-logs

Returns an [audit log](#DOCS_RESOURCES_AUDIT_LOG/audit-log-object) object for the guild. Requires the `VIEW_AUDIT_LOG` permission.

###### Query String Params

| Field       | Type      | Description                                                                                      |
| ----------- | --------- | ------------------------------------------------------------------------------------------------ |
| user_id     | snowflake | filter the log for actions made by a user                                                        |
| action_type | integer   | the type of [audit log event](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-audit-log-events) |
| before      | snowflake | filter the log before a certain entry id                                                         |
| limit       | integer   | how many entries are returned (default 50, minimum 1, maximum 100)                               |
