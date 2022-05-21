# Auto Moderation

Auto Moderation is a per [guild](#DOCS_RESOURCES_GUILD/) feature which allows the configuration of a set of rules
to trigger based on some criteria, e.g. a message contains a specific keyword. Certain actions, such as blocking a message,
can be setup to automatically execute whenever a rule is triggered.

### Auto Moderation Rule Object

###### Auto Moderation Rule Structure

| Field            | Type                | Description                                                                                                            |
| ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| id               | snowflake           | the id of this rule                                                                                                    |
| guild_id         | snowflake           | the guild which the rule belongs to                                                                                    |
| name             | string              | the name                                                                                                               |
| creator_id       | snowflake           | the user which first created this rule                                                                                 |
| event_type       | integer             | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)                              |
| trigger_type     | integer             | the [trigger type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)                          |
| trigger_metadata | object              | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)                      |
| actions          | array               | the [actions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) which will execute when rule is triggered |
| enabled          | boolean             | whether the rule is enabled                                                                                            |
| exempt_roles     | array of snowflakes | the role ids that should not be affected by the rule (Maximum of 20)                                                   |
| exempt_channels  | array of snowflakes | the channel ids that should not be affected by the rule (Maximum of 50)                                                |

###### Example Auto Moderation Rule

```json
{
  "id": "969707018069872670",
  "guild_id": "613425648685547541",
  "name": "Keyword Filter 1",
  "creator_id": "423457898095789043",
  "trigger_type": 1,
  "event_type": 1,
  "actions": [
    {
      "type": 1,
      "metadata": {}
    },
    {
      "type": 2,
      "metadata": { "channel_id": "123456789123456789" }
    }
  ],
  "trigger_metadata": {
    "keyword_filter": ["cat*", "*cat", "*ana*"]
  },
  "enabled": true,
  "exempt_roles": ["323456789123456789", "423456789123456789"],
  "exempt_channels": ["523456789123456789"],
}
```

###### Trigger Types

Characterizes what type of information will be checked to determine whether a rule is triggered.

| Type                 | Value   | Description                                                                     |
| -------------------- | ------- | ------------------------------------------------------------------------------- |
| KEYWORDS             | 1       | check if any words from a user defined list of keywords exist in content        |
| HARMFUL_LINKS        | 2       | check if any known harmful links exist in content                               |
| SPAM                 | 3       | check if content represents generic spam                                        |
| DEFAULT_KEYWORD_LIST | 4       | check if any words from built in pre-determined lists of words exist in content |

###### Trigger Metadata

Additional data needed to figure out whether a rule should be triggered. Different fields are relevant based on the
value of [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types).

**TODO**

###### Event Types

Indicates in what event context a rule should be checked.

| Type             | Value   | Description                              |
| ---------------- | ------- | ---------------------------------------- |
| MESSAGE_SEND     | 1       | when a member sends a message on a guild |


### Auto Moderation Action Object

An action which will execute whenever a rule is triggered.

###### Auto Moderation Action Structure

| Field                     | Type                                                                                      | Description                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| type                      | [action type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-types) | the type of action                                                        |
| metadata                  | **TODO**                                                                                  | additional metadata needed during execution for this specific action type |


###### Action Types

| Type               | Value   | Description                                                     |
| ------------------ | ------- | --------------------------------------------------------------- |
| BLOCK_MESSAGE      | 1       | blocks the content of a message according to the rule           |
| LOG_TO_CHANNEL     | 2       | records original message in a specified channel                 |


### Auto Moderation Permission Requirements

Users are required to have the `MANAGE_GUILD` permission to access all Auto Moderation resources.

### Auto Moderation Limits Per Trigger Type

Users are required to have the `MANAGE_GUILD` permission to access all Auto Moderation resources.

| Type                 | Max Per Guild |
| -------------------- | ------------- |
| KEYWORDS             | 3             |
| HARMFUL_LINKS        | 1             |
| SPAM                 | 1             |
| DEFAULT_KEYWORD_LIST | 1             |

## List Auto Moderation Rules for Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules

Get a list of all rules currently configured for guild. Returns a list of [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) objects for the given guild.

> info
> Requires `MANAGE_GUILD` [permissions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements)

## Get Auto Moderation Rule % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Get a single rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) object.

> info
> Requires `MANAGE_GUILD` [permissions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements)

## Create Auto Moderation Rule % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules

Create a new rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) on success.

> info
> Requires `MANAGE_GUILD` [permissions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements)

###### JSON Params

| Field            | Type                | Description                                                                                                            |
| ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| name             | string              | the name                                                                                                               |
| event_type       | integer             | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)                              |
| trigger_type     | integer             | the [trigger type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)                          |
| trigger_metadata | object              | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)                      |
| actions          | array               | the [actions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) which will execute when rule is triggered |
| enabled?         | boolean             | whether the rule is enabled (False by default)                                                                         |
| exempt_roles?    | array of snowflakes | the role ids that should not be affected by the rule (Maximum of 20)                                                   |
| exempt_channels? | array of snowflakes | the channel ids that should not be affected by the rule (Maximum of 50)                                                |

> info
> See [Auto Moderation Limits Per Trigger Type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-limits-per-trigger-type) for limits on how many rules of each trigger type can be created per guild.


## Modify Auto Moderation Rule % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Modify an existing rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) on success.

> info
> Requires `MANAGE_GUILD` [permissions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

> info
> All parameters for this endpoint are optional.

###### JSON Params

| Field            | Type                | Description                                                                                                            |
| ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| name             | string              | the name                                                                                                               |
| event_type       | integer             | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)                              |
| trigger_metadata | object              | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)                      |
| actions          | array               | the [actions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) which will execute when rule is triggered |
| enabled          | boolean             | whether the rule is enabled                                                                                            |
| exempt_roles     | array of snowflakes | the role ids that should not be affected by the rule (Maximum of 20)                                                   |
| exempt_channels  | array of snowflakes | the channel ids that should not be affected by the rule (Maximum of 50)                                                |


## Delete Auto Moderation Rule % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Delete a rule. Returns a `204` on success.

> info
> Requires `MANAGE_GUILD` [permissions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements)


