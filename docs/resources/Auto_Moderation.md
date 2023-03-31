# Auto Moderation

Auto Moderation is a feature which allows each [guild](#DOCS_RESOURCES_GUILD/) to set up rules that trigger based on some criteria. For example, a rule can trigger whenever a message contains a specific keyword.

Rules can be configured to automatically execute actions whenever they trigger. For example, if a user tries to send a message which contains a certain keyword, a rule can trigger and block the message before it is sent.

### Auto Moderation Rule Object

###### Auto Moderation Rule Structure

| Field            | Type                                                                                     | Description                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| id               | snowflake                                                                                | the id of this rule                                                                                       |
| guild_id         | snowflake                                                                                | the id of the guild which this rule belongs to                                                            |
| name             | string                                                                                   | the rule name                                                                                             |
| creator_id       | snowflake                                                                                | the user which first created this rule                                                                    |
| event_type       | integer                                                                                  | the rule [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)            |
| trigger_type     | integer                                                                                  | the rule [trigger type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)        |
| trigger_metadata | object                                                                                   | the rule [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) |
| actions          | array of [action](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) objects | the actions which will execute when the rule is triggered                                                 |
| enabled          | boolean                                                                                  | whether the rule is enabled                                                                               |
| exempt_roles     | array of snowflakes                                                                      | the role ids that should not be affected by the rule (Maximum of 20)                                      |
| exempt_channels  | array of snowflakes                                                                      | the channel ids that should not be affected by the rule (Maximum of 50)                                   |

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
      "metadata": { "custom_message": "Please keep financial discussions limited to the #finance channel" }
    },
    {
      "type": 2,
      "metadata": { "channel_id": "123456789123456789" }
    },
    {
      "type": 3,
      "metadata": { "duration_seconds": 60 }
    }
  ],
  "trigger_metadata": {
    "keyword_filter": ["cat*", "*dog", "*ana*", "i like c++"],
    "regex_patterns": ["(b|c)at", "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$"]
  },
  "enabled": true,
  "exempt_roles": ["323456789123456789", "423456789123456789"],
  "exempt_channels": ["523456789123456789"]
}
```

###### Trigger Types
Characterizes the type of content which can trigger the rule.

| Trigger Type   | Value | Description                                                          | Max per Guild |
| -------------- | ----- | -------------------------------------------------------------------- | ------------- |
| KEYWORD        | 1     | check if content contains words from a user defined list of keywords | 6             |
| SPAM           | 3     | check if content represents generic spam                             | 1             |
| KEYWORD_PRESET | 4     | check if content contains words from internal pre-defined wordsets   | 1             |
| MENTION_SPAM   | 5     | check if content contains more unique mentions than allowed          | 1             |

###### Trigger Metadata

Additional data used to determine whether a rule should be triggered. Different fields are relevant based on the
value of [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types).

| Field               | Type                                                                                                              | Associated Trigger Types | Description                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| keyword_filter      | array of strings *                                                                                                | KEYWORD                  | substrings which will be searched for in content (Maximum of 1000)                               |
| regex_patterns      | array of strings **                                                                                               | KEYWORD                  | regular expression patterns which will be matched against content (Maximum of 10)                |
| presets             | array of [keyword preset types](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-keyword-preset-types) | KEYWORD_PRESET           | the internally pre-defined wordsets which will be searched for in content                        |
| allow_list          | array of strings ***                                                                                              | KEYWORD, KEYWORD_PRESET  | substrings which should not trigger the rule (Maximum of 100 or 1000)                            |
| mention_total_limit | integer                                                                                                           | MENTION_SPAM             | total number of unique role and user mentions allowed per message (Maximum of 50)                |

\* A keyword can be a phrase which contains multiple words. [Wildcard symbols](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-keyword-matching-strategies) can be used to customize how each keyword will be matched. Each keyword must be 60 characters or less.

\** Only Rust flavored regex is currently supported, which can be tested in online editors such as [Rustexp](https://rustexp.lpil.uk/). Each regex pattern must be 260 characters or less.

\*** Each `allow_list` keyword can be a phrase which contains multiple words. [Wildcard symbols](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-keyword-matching-strategies) can be used to customize how each keyword will be matched. Rules with `KEYWORD` [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) accept a maximum of 100 keywords. Rules with `KEYWORD_PRESET` [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) accept a maximum of 1000 keywords.

###### Trigger Metadata Field Limits

| Field               | Trigger Type   | MAX ARRAY LENGTH | MAX CHARACTERS PER STRING |
| ------------------- | -------------- | ---------------- | ------------------------- |
| keyword_filter      | KEYWORD        | 1000             | 60                        |
| regex_patterns      | KEYWORD        | 10               | 260                       |
| allow_list          | KEYWORD        | 100              | 60                        |
| allow_list          | KEYWORD_PRESET | 1000             | 60                        |


###### Keyword Preset Types

| Preset Type    | Value | Description                                                  |
| -------------- | ----- | ------------------------------------------------------------ |
| PROFANITY      | 1     | words that may be considered forms of swearing or cursing    |
| SEXUAL_CONTENT | 2     | words that refer to sexually explicit behavior or activity   |
| SLURS          | 3     | personal insults or words that may be considered hate speech |


###### Event Types

Indicates in what event context a rule should be checked.

| Event Type   | Value | Description                                         |
| ------------ | ----- | --------------------------------------------------- |
| MESSAGE_SEND | 1     | when a member sends or edits a message in the guild |


###### Keyword Matching Strategies

Use the wildcard symbol (`*`) at the beginning or end of a keyword to define how it should be matched. All keywords are case insensitive.

**Prefix** - word must start with the keyword

| Keyword   | Matches                               |
| --------- | ------------------------------------- |
| cat\*     | **cat**ch, **Cat**apult, **CAt**tLE   |
| tra\*     | **tra**in, **tra**de, **TRA**ditional |
| the mat\* | **the mat**rix                        |


**Suffix** - word must end with the keyword

| Keyword   | Matches                             |
| --------- | ----------------------------------- |
| \*cat     | wild**cat**, copy**Cat**            |
| \*tra     | ex**tra**, ul**tra**, orches**TRA** |
| \*the mat | brea**the mat**                     |


**Anywhere** - keyword can appear anywhere in the content

| Keyword     | Matches                     |
| ----------- | --------------------------- |
| \*cat\*     | lo**cat**ion, edu**Cat**ion |
| \*tra\*     | abs**tra**cted, ou**tra**ge |
| \*the mat\* | brea**the mat**ter          |


**Whole Word** - keyword is a full word or phrase and must be surrounded by whitespace

| Keyword | Matches     |
| ------- | ----------- |
| cat     | **cat**     |
| train   | **train**   |
| the mat | **the mat** |


### Auto Moderation Action Object

An action which will execute whenever a rule is triggered.

###### Auto Moderation Action Structure

| Field       | Type                                                                                             | Description                                                               |
| ----------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| type        | [action type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-types)        | the type of action                                                        |
| metadata? * | [action metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-metadata) | additional metadata needed during execution for this specific action type |

\* Can be omitted based on `type`. See the `Associated Action Types` column in [action metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-metadata) to understand which `type` values require `metadata` to be set.

###### Action Types

| Action Type        | Value | Description                                                                                                                                                |
| ------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BLOCK_MESSAGE      | 1     | blocks a member's message and prevents it from being posted. A custom explanation can be specified and shown to members whenever their message is blocked. |
| SEND_ALERT_MESSAGE | 2     | logs user content to a specified channel                                                                                                                   |
| TIMEOUT            | 3     | timeout user for a specified duration *                                                                                                                    |

\* A `TIMEOUT` action can only be set up for `KEYWORD` and `MENTION_SPAM` rules. The `MODERATE_MEMBERS` permission is required to use the `TIMEOUT` action type.


###### Action Metadata

Additional data used when an action is executed. Different fields are relevant based on the
value of [action type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-types).

| Field            | Type      | Associated Action Types | Description                                                                            | Constraints                          |
| ---------------- | --------- | ----------------------- | -------------------------------------------------------------------------------------- | ------------------------------------ |
| channel_id       | snowflake | SEND_ALERT_MESSAGE      | channel to which user content should be logged                                         | existing channel                     |
| duration_seconds | integer   | TIMEOUT                 | timeout duration in seconds                                                            | maximum of 2419200 seconds (4 weeks) |
| custom_message?  | string    | BLOCK_MESSAGE           | additional explanation that will be shown to members whenever their message is blocked | maximum of 150 characters            |


### Auto Moderation Permission Requirements

Users are required to have the `MANAGE_GUILD` permission to access all Auto Moderation resources.
Some [action types](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-types) require additional permissions, e.g. the `TIMEOUT` action type requires an additional `MODERATE_MEMBERS` permission.

## List Auto Moderation Rules for Guild % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules

Get a list of all rules currently configured for the guild. Returns a list of [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) objects for the given guild.

> info
> This endpoint requires the `MANAGE_GUILD` [permission](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

## Get Auto Moderation Rule % GET /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Get a single rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) object.

> info
> This endpoint requires the `MANAGE_GUILD` [permission](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

## Create Auto Moderation Rule % POST /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules

Create a new rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) on success. Fires an [Auto Moderation Rule Create](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-rule-create) Gateway event.

> info
> This endpoint requires the `MANAGE_GUILD` [permission](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field               | Type                                                                                     | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| name                | string                                                                                   | the rule name                                                                                        |
| event_type          | integer                                                                                  | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)            |
| trigger_type        | integer                                                                                  | the [trigger type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)        |
| trigger_metadata? * | object                                                                                   | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) |
| actions             | array of [action](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) objects | the actions which will execute when the rule is triggered                                            |
| enabled?            | boolean                                                                                  | whether the rule is enabled (False by default)                                                       |
| exempt_roles?       | array of snowflakes                                                                      | the role ids that should not be affected by the rule (Maximum of 20)                                 |
| exempt_channels?    | array of snowflakes                                                                      | the channel ids that should not be affected by the rule (Maximum of 50)                              |

\* Can be omitted based on `trigger_type`. See the `Associated Trigger Types` column in [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) to understand which `trigger_type` values require `trigger_metadata` to be set.

> info
> See [Trigger Types](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) for limits on how many rules of each trigger type can be created per guild.


## Modify Auto Moderation Rule % PATCH /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Modify an existing rule. Returns an [auto moderation rule](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object) on success. Fires an [Auto Moderation Rule Update](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-rule-update) Gateway event.

> info
> Requires `MANAGE_GUILD` [permissions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

> info
> All parameters for this endpoint are optional.

> info
> This endpoint supports the `X-Audit-Log-Reason` header.

###### JSON Params

| Field               | Type                                                                                     | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| name                | string                                                                                   | the rule name                                                                                        |
| event_type          | integer                                                                                  | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)            |
| trigger_metadata? * | object                                                                                   | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) |
| actions             | array of [action](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) objects | the actions which will execute when the rule is triggered                                            |
| enabled             | boolean                                                                                  | whether the rule is enabled                                                                          |
| exempt_roles        | array of snowflakes                                                                      | the role ids that should not be affected by the rule (Maximum of 20)                                 |
| exempt_channels     | array of snowflakes                                                                      | the channel ids that should not be affected by the rule (Maximum of 50)                              |

\* Can be omitted based on `trigger_type`. See the `Associated Trigger Types` column in [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) to understand which `trigger_type` values require `trigger_metadata` to be set.

## Delete Auto Moderation Rule % DELETE /guilds/{guild.id#DOCS_RESOURCES_GUILD/guild-object}/auto-moderation/rules/{auto_moderation_rule.id#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object}

Delete a rule. Returns a `204` on success. Fires an [Auto Moderation Rule Delete](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-rule-delete) Gateway event.

> info
> This endpoint requires the `MANAGE_GUILD` [permission](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-permission-requirements).

> info
> This endpoint supports the `X-Audit-Log-Reason` header.
