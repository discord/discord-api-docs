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
