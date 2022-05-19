# Auto Moderation

Auto Moderation is a per [guild](#DOCS_RESOURCES_GUILD/) feature which allows the configuration of a set of rules
to trigger based on some criteria, e.g. a message contains a specific keyword. Certain actions, such as blocking a message,
can be setup to automatically execute whenever a rule is triggered.

### Auto Moderation Rule Object

###### Auto Moderation Rule Structure

| Field            | Type                | Description                                                                                                            |
| ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| name             | string              | the name                                                                                                               |
| event_type       | integer             | the [event type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-event-types)                              |
| trigger_type     | integer             | the [trigger type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)                          |
| trigger_metadata | object              | the [trigger metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types)                      |
| actions          | array               | the [actions](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object) which will execute when rule is triggered |
| enabled          | boolean             | whether the rule is enabled                                                                                            |
| exempt_roles     | array of snowflakes | the role ids that should not be affected by the rule                                                                   |
| exempt_channels  | array of snowflakes | the channel ids that should not be affected by the rule                                                                |

###### Example Auto Moderation Rule

```json
{
  "name": "Keyword Filter 1",
  "trigger_type": 1,
  "event_type": 1,
  "actions": [
    {
      "type": 1,
      "metadata": {}
    },
    {
      "type": 2,
      "metadata": { "channel_id": "123456789123456789"}
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


### Auto Moderation Permissions Requirements

Users are required to have the `MANAGE_GUILD` permission to access all Auto Moderation resources.
