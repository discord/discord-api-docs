# Discovery Resource

### Discovery Metadata Object

Used to represent a guild's Discovery settings.

###### Discovery Metadata Structure

| Field                         | Type                                                                                   | Description                                                                                        |
|-------------------------------|----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| guild_id                      | snowflake                                                                              | the guild id                                                                                       |
| primary_category_id           | [discovery category](#DOCS_RESOURCES_DISCOVERY/discovery-category-object) id           | the id of the primary discovery category set for this guild                                        |
| keywords                      | ?array of strings                                                                      | up to 10 discovery search keywords set for this guild                                              |
| emoji_discoverability_enabled | boolean                                                                                | whether guild info is shown when custom emojis and stickers from this guild are clicked            |
| partner_actioned_timestamp    | ?ISO8601 timestamp                                                                     | when the server's partner application was accepted or denied, for applications via Server Settings |
| partner_application_timestamp | ?ISO8601 timestamp                                                                     | when the server applied for partnership, if it has a pending application                           |
| category_ids                  | array of [discovery category](#DOCS_RESOURCES_DISCOVERY/discovery-category-object) ids | ids of up to 5 discovery subcategories set for this guild                                          |

###### Example Discovery Metadata

```json
{
  "guild_id": "197038439483310080",
  "primary_category_id": 5,
  "keywords": ["bug hunting"],
  "emoji_discoverability_enabled": true,
  "partner_actioned_timestamp": "2022-02-22T02:22:22.222222+00:00",
  "partner_application_timestamp": null,
  "category_ids": [22, 31, 39]
}
```

### Discovery Category Object

###### Discovery Category Structure

| Field      | Type    | Description                                                    |
|------------|---------|----------------------------------------------------------------|
| id         | integer | numeric id of the category                                     |
| name       | string  | the name of this category                                      |
| is_primary | boolean | whether this category can be set as a guild's primary category |

###### Example Discovery Category

```json
{
  "id": 1,
  "name": "Gaming",
  "is_primary": true
}
```

### Discovery Requirements Object

Includes a guild's status on meeting its requirements to be in Discovery.

###### Discovery Requirements Structure

| Field                           | Type                                                                                                                                                      | Description                                                              |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| guild_id?                       | snowflake                                                                                                                                                 | the guild id                                                             |
| safe_environment?               | boolean                                                                                                                                                   | whether the guild has not been flagged by Trust & Safety                 |
| healthy?                        | ?boolean                                                                                                                                                  | whether the guild meets the activity requirements                        |
| health_score_pending?           | boolean                                                                                                                                                   | whether the guild's activity metrics have not yet been calculated        |
| size?                           | boolean                                                                                                                                                   | whether the guild meets its minimum member count requirement             |
| nsfw_properties?                | [discovery requirements NSFW properties](#DOCS_RESOURCES_DISCOVERY/discovery-requirements-object-discovery-requirements-nsfw-properties-structure) object | banned terms found in the guild's name, description, and channel names   |
| protected?                      | boolean                                                                                                                                                   | whether the guild has the 2FA requirement for moderation enabled         |
| sufficient                      | ?boolean                                                                                                                                                  | whether the guild meets the requirements to be in Discovery              |
| sufficient_without_grace_period | boolean                                                                                                                                                   | whether the grace period can allow the guild to remain in Discovery      |
| valid_rules_channel?            | boolean                                                                                                                                                   | whether the guild has a rules channel set                                |
| retention_healthy?              | ?boolean                                                                                                                                                  | whether the guild meets the new member retention requirement             |
| engagement_healthy?             | ?boolean                                                                                                                                                  | whether the guild meets the weekly visitor and communicator requirements |
| age?                            | boolean                                                                                                                                                   | whether the guild meets its minimum age requirement                      |
| minimum_age?                    | integer                                                                                                                                                   | the guild's minimum age requirement, in days                             |
| health_score?                   | [discovery requirements health score](#DOCS_RESOURCES_DISCOVERY/discovery-requirements-object-discovery-requirements-health-score-structure) object       | the guild's activity metrics                                             |
| minimum_size?                   | integer                                                                                                                                                   | the guild's minimum member count requirement                             |
| grace_period_end_date?          | ISO8601 timestamp                                                                                                                                         | when the guild's grace period ends                                       |

###### Discovery Requirements NSFW Properties Structure

| Field                        | Type                                   | Description                                        |
|------------------------------|----------------------------------------|----------------------------------------------------|
| channels?                    | array of snowflakes                    | ids of channels with names containing banned terms |
| channel_banned_keywords?     | map of snowflakes to arrays of strings | the banned terms found in the channel names        |
| name?                        | string                                 | the guild name, if it contains banned terms        |
| name_banned_keywords?        | array of strings                       | the banned terms found in the guild name           |
| description?                 | string                                 | the guild description, if it contains banned terms |
| description_banned_keywords? | array of strings                       | the banned terms found in the guild description    |

###### Discovery Requirements Health Score Structure

| Field                    |         |                                                                                            |
|--------------------------|---------|--------------------------------------------------------------------------------------------|
| avg_nonnew_communicators | ?string | average weekly number of users who talk in the guild and have been on Discord for 8 weeks+ |
| avg_nonnew_participators | ?string | average weekly number of users who view the guild and have been on Discord for 8 weeks+    |
| num_intentful_joiners    | ?string | average number of users who join the guild per week                                        |
| perc_ret_w1_intentful    | ?double | average proportion of new members who remain in the guild for at least a week              |

> info
> Activity metrics are calculated as an 8-week rolling average.

###### Example Discovery Requirements

```json
{
  "guild_id": "268811439588900865",
  "safe_environment": true,
  "healthy": null,
  "health_score_pending": false,
  "size": true,
  "nsfw_properties": {
    "channels": [
      "697489244649816084"
    ],
    "channels_banned_keywords": {
      "697489244649816084": [
        "badword"
      ]
    },
    "name": "this server name has a badword",
    "name_banned_keywords": [
      "badword"
    ],
    "description": "this server description has a badword",
    "description_banned_keywords": [
      "badword"
    ]
  },
  "protected": true,
  "sufficient": false,
  "sufficient_without_grace_period": true,
  "valid_rules_channel": true,
  "retention_healthy": null,
  "engagement_healthy": true,
  "age": true,
  "minimum_age": 56,
  "health_score": {
    "avg_nonnew_participators": "50",
    "avg_nonnew_communicators": "200",
    "num_intentful_joiners": "250",
    "perc_ret_w1_intentful": 0.079278350515463915
  },
  "minimum_size": 1000,
  "grace_period_end_date": "2022-02-22T02:22:22.222222+00:00"
}

```

## List Discovery Categories % GET /discovery/categories

###### Query String Params

| Field        | Type    | Description                                                                   | Required | Default |
|--------------|---------|-------------------------------------------------------------------------------|----------|---------|
| locale       | string  | the [language](#DOCS_REFERENCE/locales) to return category names in           | false    | en-US   |
| primary_only | boolean | whether to filter to categories that can be set as a guild's primary category | false    | false   |

Returns an array of [discovery category](#DOCS_RESOURCES_DISCOVERY/discovery-category-object) objects.

## Validate Discovery Search Term % GET /discovery/valid-term

###### Query String Params

| Field | Type   | Description              | Required |
|-------|--------|--------------------------|----------|
| term  | string | the search term to check | true     |

Checks if a discovery search term is valid.

###### Response Body

| Field | Type    | Description                        |
|-------|---------|------------------------------------|
| valid | boolean | whether the provided term is valid |
