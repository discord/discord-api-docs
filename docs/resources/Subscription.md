---
sidebar_label: Subscription
---

# Subscription Resource

Subscriptions in Discord represent a user making recurring payments for at least one SKU over an ongoing period. Successful payments grant the user access to entitlements associated with the SKU.

## Subscription Object

| Field                | Type                | Description                                                                                                                                    |
|----------------------|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| id                   | snowflake           | The ID of the subscription                                                                                                                     |
| user_id              | snowflake           | The ID of the user who is subscribed                                                                                                           |
| sku_ids              | array of snowflakes | List of SKUs subscribed to                                                                                                                     |
| entitlement_ids      | array of snowflakes | List of entitlements granted for this subscription                                                                                             |
| current_period_start | ISO8601 timestamp   | The start of the current subscription period                                                                                                   |
| current_period_end   | ISO8601 timestamp   | The end of the current subscription period                                                                                                     |
| status               | SubscriptionStatus  | The current status of the subscription                                                                                                         |
| canceled_at          | ISO8601 timestamp?  | When the subscription was canceled                                                                                                             |
| country?             | string              | The ISO3166-1 alpha-2 country code of the payment source used to purchase the subscription. Missing unless queried with a private OAuth scope. |

The start of a subscription is determined by its ID. When the subscription renews, its current period is updated.

If the user cancels the subscription, the `canceled_at` timestamp reflects when they did so. The subscription will enter the `ENDING` status.

### Subscription Example

> danger
> TODO: Finish this

```json
TODO
```

### Subscription Statuses

| Type     | Value | Description                                         |
|----------|-------|-----------------------------------------------------|
| ACTIVE   | 1     | The subscription is active and scheduled to renew.  |
| ENDING   | 2     | The subscription is active but will not renew.      |
| INACTIVE | 3     | The subscription is inactive and not being charged. |

> info
> Subscription status should not be used to grant perks. Use [entitlements](#DOCS_RESOURCES_ENTITLEMENT/entitlement-object) as an indication of whether a user should have access to a specific SKU. See our guide on [Implementing App Subscriptions](#DOCS_MONETIZATION_IMPLEMENTING_APP_SUBSCRIPTIONS) for more information.

Subscriptions can start at and change between any of these statuses at any time.

Status is *not* related to the current period. A subscription could be `ACTIVE` outside its current period or `INACTIVE` within its current period. 

## List SKU Subscriptions % GET /skus/{sku.id#DOCS_RESOURCES_SKU/sku-object}/subscriptions

Returns all subscriptions containing the SKU, filtered by user. Returns a list of [subscription](#DOCS_RESOURCES_SUBSCRIPTION/subscription-object) objects.

### Query String Params

| Field    | Type      | Description                                                                   | Default |
|----------|-----------|-------------------------------------------------------------------------------|---------|
| before?  | snowflake | List subscriptions before this ID                                             | absent  |
| after?   | snowflake | List subscriptions after this ID                                              | absent  |
| limit?   | integer   | The number of results to return (1-100)                                       | 50      |
| user_id? | snowflake | User ID for which to return subscriptions. Required except for OAuth queries. | absent  |

## Get SKU Subscription % GET /skus/{sku.id#DOCS_RESOURCES_SKU/sku-object}/subscriptions/{subscription.id#DOCS_MONETIZATION_SUBSCRIPTIONS/subscription-object}

Get a subscription by its ID. Returns a [subscription](#DOCS_RESOURCES_SUBSCRIPTION/subscription-object) object.