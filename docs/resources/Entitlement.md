---
sidebar_label: Entitlement
---

# Entitlements Resource

Entitlements in Discord represent that a user or guild has access to a premium offering in your application. 

Refer to the [Monetization Overview](#DOCS_MONETIZATION_OVERVIEW) for more information on how to use Entitlements in your app.

### Entitlement Object

###### Entitlement Structure

| Field          | Type               | Description                                                                             |
|----------------|--------------------|-----------------------------------------------------------------------------------------|
| id             | snowflake          | ID of the entitlement                                                                   |
| sku_id         | snowflake          | ID of the SKU                                                                           |
| application_id | snowflake          | ID of the parent application                                                            |
| user_id?       | snowflake          | ID of the user that is granted access to the entitlement's sku                          |
| type           | integer            | [Type of entitlement](#DOCS_RESOURCES_ENTITLEMENT/entitlement-object-entitlement-types) |
| deleted        | boolean            | Entitlement was deleted                                                                 |
| starts_at      | ?ISO8601 timestamp | Start date at which the entitlement is valid.                                           |
| ends_at        | ?ISO8601 timestamp | Date at which the entitlement is no longer valid.                                       |
| guild_id?      | snowflake          | ID of the guild that is granted access to the entitlement's sku                         |
| consumed?      | boolean            | For consumable items, whether or not the entitlement has been consumed                  |

###### Entitlement Example

```json
{
  "id": "1019653849998299136",
  "sku_id": "1019475255913222144",
  "application_id": "1019370614521200640",
  "user_id": "771129655544643584",
  "promotion_id": null,
  "type": 8,
  "deleted": false,
  "gift_code_flags": 0,
  "consumed": false,
  "starts_at": "2022-09-14T17:00:18.704163+00:00",
  "ends_at": "2022-10-14T17:00:18.704163+00:00",
  "guild_id": "1015034326372454400",
  "subscription_id": "1019653835926409216"
}
```

###### Entitlement Types

| Type                     | Value | Description                                                    |
|--------------------------|-------|----------------------------------------------------------------|
| PURCHASE                 | 1     | Entitlement was purchased by user                              |
| PREMIUM_SUBSCRIPTION     | 2     | Entitlement for Discord Nitro subscription                     |
| DEVELOPER_GIFT           | 3     | Entitlement was gifted by developer                            |
| TEST_MODE_PURCHASE       | 4     | Entitlement was purchased by a dev in application test mode    |
| FREE_PURCHASE            | 5     | Entitlement was granted when the SKU was free                  |
| USER_GIFT                | 6     | Entitlement was gifted by another user                         |
| PREMIUM_PURCHASE         | 7     | Entitlement was claimed by user for free as a Nitro Subscriber |
| APPLICATION_SUBSCRIPTION | 8     | Entitlement was purchased as an app subscription               |

## List Entitlements % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/entitlements

Returns all entitlements for a given app, active and expired.

###### Query String Params

| param            | type                                             | description                                                                                                                |
|------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| user_id?         | snowflake                                        | User ID to look up entitlements for                                                                                        |
| sku_ids?         | comma-delimited set of snowflakes                | Optional list of SKU IDs to check entitlements for                                                                         |
| before?          | snowflake                                        | Retrieve entitlements before this entitlement ID                                                                           |
| after?           | snowflake                                        | Retrieve entitlements after this entitlement ID                                                                            |
| limit?           | integer                                          | Number of entitlements to return, 1-100, default 100                                                                       |
| guild_id?        | snowflake                                        | Guild ID to look up entitlements for                                                                                       |
| exclude_ended?   | [boolean](#DOCS_REFERENCE/boolean-query-strings) | Whether or not ended entitlements should be omitted. Defaults to false, ended entitlements are included by default.        |
| exclude_deleted? | [boolean](#DOCS_REFERENCE/boolean-query-strings) | Whether or not deleted entitlements should be omitted. Defaults to true, deleted entitlements are not included by default. |

```json
[
  {
    "id": "1019653849998299136",
    "sku_id": "1019475255913222144",
    "application_id": "1019370614521200640",
    "user_id": "771129655544643584",
    "promotion_id": null,
    "type": 8,
    "deleted": false,
    "gift_code_flags": 0,
    "consumed": false,
    "starts_at": "2022-09-14T17:00:18.704163+00:00",
    "ends_at": "2022-10-14T17:00:18.704163+00:00",
    "guild_id": "1015034326372454400",
    "subscription_id": "1019653835926409216"
  }
]
```

## Get Entitlement % GET /applications/{application.id#DOS_RESOURCES_APPLICATION/application-object}/entitlements/{entitlement.id#DOCS_RESOURCES_ENTITLEMENT/entitlement-object}

Returns an entitlement.

```json
{
  "id": "1019653849998299136",
  "sku_id": "1019475255913222144",
  "application_id": "1019370614521200640",
  "user_id": "771129655544643584",
  "promotion_id": null,
  "type": 8,
  "deleted": false,
  "gift_code_flags": 0,
  "consumed": false,
  "starts_at": "2022-09-14T17:00:18.704163+00:00",
  "ends_at": "2022-10-14T17:00:18.704163+00:00",
  "guild_id": "1015034326372454400",
  "subscription_id": "1019653835926409216"
}
```

## Consume an Entitlement % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/entitlements/{entitlement.id#DOCS_RESOURCES_ENTITLEMENT/entitlement-object}/consume

For One-Time Purchase consumable SKUs, marks a given entitlement for the user as consumed. The entitlement will have `consumed: true` when using [List Entitlements](#DOCS_RESOURCES_ENTITLEMENT/list-entitlements).

Returns a `204 No Content` on success.

## Create Test Entitlement % POST /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/entitlements

Creates a test entitlement to a given SKU for a given guild or user. Discord will act as though that user or guild has entitlement to your premium offering.

This endpoint returns a partial entitlement object. It will **not** contain `subscription_id`, `starts_at`, or `ends_at`, as it's valid in perpetuity.

After creating a test entitlement, you'll need to reload your Discord client. After doing so, you'll see that your server or user now has premium access.

###### JSON Params

| param      | type    | description                                               |
|------------|---------|-----------------------------------------------------------|
| sku_id     | string  | ID of the SKU to grant the entitlement to                 |
| owner_id   | string  | ID of the guild or user to grant the entitlement to       |
| owner_type | integer | `1` for a guild subscription, `2` for a user subscription |

```json
{
  "sku_id": "999184799365857331",
  "owner_id": "847184799365857999",
  "owner_type": 1
}
```

## Delete Test Entitlement % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/entitlements/{entitlement.id#DOCS_RESOURCES_ENTITLEMENT/entitlement-object}

Deletes a currently-active test entitlement. Discord will act as though that user or guild _no longer has_ entitlement to your premium offering.

Returns `204 No Content` on success.
