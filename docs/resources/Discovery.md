# Discovery Resource

### Discovery Metadata Object

Used to represent a guild's Discovery settings.

###### Discovery Metadata Structure

| Field                         | Type                                                                                   | Description                                                                                        |
|-------------------------------|----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| guild_id                      | snowflake                                                                              | the guild id                                                                                       |
| primary_category_id           | [discovery category](#DOCS_RESOURCES_DISCOVERY/discovery-category-object) id           | the id of the primary discovery category set for this guild                                        |
| keywords                      | ?array of strings                                                                      | up to 10 discovery search keywords set for this guild                                              |
| emoji_discoverability_enabled | boolean                                                                                | whether guild info is shown when custom emojis from this guild are clicked                         |
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
  "category_ids": [22, 31, 39]
}
```

### Discovery Category Object

###### Discovery Category Structure

| Field      | Type                                                                                           | Description                                                    |
|------------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| id         | integer                                                                                        | numeric id of the category                                     |
| name       | [discovery category name](#DOCS_RESOURCES_DISCOVERY/discovery-category-name-structure) object  | the name of this category, in multiple languages               |
| is_primary | boolean                                                                                        | whether this category can be set as a guild's primary category |

###### Discovery Category Name Structure

| Field          | Type   | Description                 |
|----------------|--------|-----------------------------|
| default        | string | the name in English         |
| localizations? | object | the name in other languages |

###### Example Discovery Category

```json
{
  "id": 1,
  "name": {
    "default": "Gaming",
    "localizations": {
      "de": "Gaming",
      "fr": "Gaming",
      "ru": "Игры"
    }
  },
  "is_primary": true
}
```

## List Discovery Categories % GET /discovery/categories

Returns an array of [discovery category](#DOCS_RESOURCES_DISCOVERY/discovery-category-object) objects that can be used when editing guilds.

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
