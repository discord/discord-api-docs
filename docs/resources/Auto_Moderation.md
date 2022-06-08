# Auto Moderation

Auto Moderation is a per [guild](#DOCS_RESOURCES_GUILD/) feature which allows the configuration of a set of rules
to trigger based on some criteria, e.g. a message contains a specific keyword. Certain actions, such as blocking a message,
can be setup to automatically execute whenever a rule is triggered.

### Auto Moderation Rule Object

###### Auto Moderation Rule Structure

| Field            | Type                                                                                     | Description                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------|
| id               | snowflake                                                                                | the id of this rule                                                                                    |
| guild_id         | snowflake                                                                                | the guild which this rule belongs to                                                                   |
| name             | string                                                                                   | the rule name                                                                                          |
| creator_id       | snowflake                                                                                | the user which first created this rule                                                                 |
| event_type       | integer                                                                                  | the rule [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)         |
| trigger_type     | integer                                                                                  | the rule [trigger type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)     |
| trigger_metadata | object                                                                                   | the rule [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) |
| actions          | array of [action](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) objects | the actions which will execute when the rule is triggered                                              |
| enabled          | boolean                                                                                  | whether the rule is enabled                                                                            |
| exempt_roles     | array of snowflakes                                                                      | the role ids that should not be affected by the rule (Maximum of 20)                                   |
| exempt_channels  | array of snowflakes                                                                      | the channel ids that should not be affected by the rule (Maximum of 50)                                |

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

| Type                 | Value   | Description                                                          |
| -------------------- | ------- | -------------------------------------------------------------------- |
| KEYWORD              | 1       | check if content contains words from a user defined list of keywords |
| HARMFUL_LINK         | 2       | check if content contains any harmful links                          |
| SPAM                 | 3       | check if content represents generic spam                             |
| KEYWORD_PRESET       | 4       | check if content contains words from internal pre-defined wordsets   |

###### Trigger Metadata

Additional data used to determine whether a rule should be triggered. Different fields are relevant based on the
value of [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types).

| Field          | Type                                                                                                              | Associated Trigger Types | Description                                                               | 
| -------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| keyword_filter | array of strings                                                                                                  | KEYWORD                  | substrings which will be searched for in content                          |
| presets        | array of [keyword preset types](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-keyword-preset-types) | KEYWORD_PRESET           | the internally pre-defined wordsets which will be searched for in content |


###### Keyword Preset Types

| Type             | Value | Description                                                  |
| ---------------- | ----- | ------------------------------------------------------------ |
| PROFANITY        | 1     | Words that may be considered forms of swearing or cursing    |
| SEXUAL_CONTENT   | 2     | Words that refer to sexually explicit behavior or activity   |
| SLURS            | 3     | Personal insults or words that may be considered hate speech |


###### Event Types

Indicates in what event context a rule should be checked.

| Type             | Value   | Description                              |
| ---------------- | ------- | ---------------------------------------- |
| MESSAGE_SEND     | 1       | when a member sends a message on a guild |


### Auto Moderation Action Object

An action which will execute whenever a rule is triggered.

###### Auto Moderation Action Structure

| Field       | Type                                                                                             | Description                                                               |
| ----------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| type        | [action type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-types)        | the type of action                                                        |
| metadata? * | [action metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-metadata) | additional metadata needed during execution for this specific action type |

\* Can be omitted based on `type`. See the `Associated Action Types` column in [action metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-metadata) to understand which `type` values require `metadata` to be set.

###### Action Types

| Type                  | Value   | Description                                           |
| --------------------- | ------- | ----------------------------------------------------- |
| BLOCK_MESSAGE         | 1       | blocks the content of a message according to the rule |
| SEND_ALERT_MESSAGE    | 2       | logs user content to a specified channel              |
| TIMEOUT               | 3       | timeout user for specified duration                   |


###### Action Metadata

Additional data used when an action is executed. Different fields are relevant based on
value of [action type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-types).

| Field            | Type       | Associated Action Types | Description                                    | 
| ---------------- | ---------- | ----------------------- | ---------------------------------------------- |
| channel_id       | snowflake  | SEND_ALERT_MESSAGE      | channel to which user content should be logged |
| duration_seconds | integer    | TIMEOUT                 | timeout duration in seconds *                  |

\* Maximum of 2419200 seconds (4 weeks)


>info
>Only trigger type 1 is permitted to use `duration_seconds` in metadata

### Auto Moderation Permission Requirements

Users are required to have the `MANAGE_GUILD` permission to access all Auto Moderation resources.

### Auto Moderation Limits Per Trigger Type

Number of rules allowed per trigger type in each guild.

| Type           | Max Per Guild |
| -------------- | ------------- |
| KEYWORD        | 3             |
| HARMFUL_LINK   | 1             |
| SPAM           | 1             |
| KEYWORD_PRESET | 1             |

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

| Field               | Type                                                                                     | Description                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| name                | string                                                                                   | the rule name                                                                                     |
| event_type          | integer                                                                                  | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)         |
| trigger_type        | integer                                                                                  | the [trigger type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)     |
| trigger_metadata? * | object                                                                                   | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) |
| actions             | array of [action](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) objects | the actions which will execute when the rule is triggered                                         |
| enabled?            | boolean                                                                                  | whether the rule is enabled (False by default)                                                    |
| exempt_roles?       | array of snowflakes                                                                      | the role ids that should not be affected by the rule (Maximum of 20)                              |
| exempt_channels?    | array of snowflakes                                                                      | the channel ids that should not be affected by the rule (Maximum of 50)                           |

\* Can be omitted based on `trigger_type`. See the `Associated Trigger Types` column in [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) to understand which `trigger_type` values require `trigger_metadata` to be set.

> info
> See [Auto Moderation Limits Per Trigger Type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-limits-per-trigger-type) for limits on how many rules of each trigger type can be created per guild.


## Modify Auto Moderation Rule % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Modify an existing rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) on success.

> info
> Requires `MANAGE_GUILD` [permissions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

> info
> All parameters for this endpoint are optional.

###### JSON Params

| Field               | Type                                                                                     | Description                                                                                       |
| ----------------    | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| name                | string                                                                                   | the rule name                                                                                     |
| event_type          | integer                                                                                  | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)         |
| trigger_metadata? * | object                                                                                   | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) |
| actions             | array of [action](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) objects | the actions which will execute when the rule is triggered                                         |
| enabled             | boolean                                                                                  | whether the rule is enabled                                                                       |
| exempt_roles        | array of snowflakes                                                                      | the role ids that should not be affected by the rule (Maximum of 20)                              |
| exempt_channels     | array of snowflakes                                                                      | the channel ids that should not be affected by the rule (Maximum of 50)                           |

\* Can be omitted based on `trigger_type`. See the `Associated Trigger Types` column in [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) to understand which `trigger_type` values require `trigger_metadata` to be set.

## Delete Auto Moderation Rule % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Delete a rule. Returns a `204` on success.

> info
> Requires `MANAGE_GUILD` [permissions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements)


