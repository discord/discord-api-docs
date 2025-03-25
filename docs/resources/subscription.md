---
sidebar_label: Subscription
---

# Subscription Resource

Subscriptions in Discord represent a user making recurring payments for at least one SKU over an ongoing period. Successful payments grant the user access to entitlements associated with the SKU.

## Subscription Object

| Field                | Type                 | Description                                                                                                                                |
|----------------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| id                   | snowflake            | ID of the subscription                                                                                                                     |
| user_id              | snowflake            | ID of the user who is subscribed                                                                                                           |
| sku_ids              | array of snowflakes  | List of SKUs subscribed to                                                                                                                 |
| entitlement_ids      | array of snowflakes  | List of entitlements granted for this subscription                                                                                         |
| renewal_sku_ids      | ?array of snowflakes | List of SKUs that this user will be subscribed to at renewal                                                                               |
| current_period_start | ISO8601 timestamp    | Start of the current subscription period                                                                                                   |
| current_period_end   | ISO8601 timestamp    | End of the current subscription period                                                                                                     |
| status               | SubscriptionStatus   | Current status of the subscription                                                                                                         |
| canceled_at          | ?ISO8601 timestamp   | When the subscription was canceled                                                                                                         |
| country?             | string               | ISO3166-1 alpha-2 country code of the payment source used to purchase the subscription. Missing unless queried with a private OAuth scope. |

The start of a subscription is determined by its ID. When the subscription renews, its current period is updated.

If the user cancels the subscription, the subscription will enter the `ENDING` status and the `canceled_at` timestamp will reflect the time of the cancellation.

### Subscription Example

```json
{
  "id": "1278078770116427839", 
  "user_id": "1088605110638227537", 
  "sku_ids": ["1158857122189168803"], 
  "entitlement_ids": [], 
  "renewal_sku_ids": null,
  "current_period_start": "2024-08-27T19:48:44.406602+00:00", 
  "current_period_end": "2024-09-27T19:48:44.406602+00:00", 
  "status": 0, 
  "canceled_at": null
}
```

### Subscription Statuses

| Type     | Value | Description                                     |
|----------|-------|-------------------------------------------------|
| ACTIVE   | 0     | Subscription is active and scheduled to renew.  |
| ENDING   | 1     | Subscription is active but will not renew.      |
| INACTIVE | 2     | Subscription is inactive and not being charged. |

> info
> Subscription status should not be used to grant perks. Use [entitlements](#DOCS_RESOURCES_ENTITLEMENT/entitlement-object) as an indication of whether a user should have access to a specific SKU. See our guide on [Implementing App Subscriptions](#DOCS_MONETIZATION_IMPLEMENTING_APP_SUBSCRIPTIONS) for more information.

Subscriptions can start and change between any of these statuses within the current period. A subscription can be `ACTIVE` outside its current period or `INACTIVE` within its current period. 

Some examples of this behavior include:
- While a failed payment is being retried, the subscription would remain `ACTIVE` until it succeeds or our system determines the payment is not recoverable.
- A refund or chargeback during the current period would make the subscription `INACTIVE`.

## List SKU Subscriptions % GET /skus/{sku.id#DOCS_RESOURCES_SKU/sku-object}/subscriptions

Returns all subscriptions containing the SKU, filtered by user. Returns a list of [subscription](#DOCS_RESOURCES_SUBSCRIPTION/subscription-object) objects.

### Query String Params

| Field    | Type      | Description                                                                   | Default |
|----------|-----------|-------------------------------------------------------------------------------|---------|
| before?  | snowflake | List subscriptions before this ID                                             | absent  |
| after?   | snowflake | List subscriptions after this ID                                              | absent  |
| limit?   | integer   | Number of results to return (1-100)                                           | 50      |
| user_id? | snowflake | User ID for which to return subscriptions. Required except for OAuth queries. | absent  |

## Get SKU Subscription % GET /skus/{sku.id#DOCS_RESOURCES_SKU/sku-object}/subscriptions/{subscription.id#DOCS_MONETIZATION_SUBSCRIPTIONS/subscription-object}

Get a subscription by its ID. Returns a [subscription](#DOCS_RESOURCES_SUBSCRIPTION/subscription-object) object.