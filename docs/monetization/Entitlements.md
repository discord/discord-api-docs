## Entitlement Resource

Entitlements in Discord represent that a user or guild has access to a premium offering in your application.

### Entitlement Object

###### Entitlement Structure

| Field          | Type              | Description                                                                                 |
|----------------|-------------------|---------------------------------------------------------------------------------------------|
| id             | snowflake         | ID of the entitlement                                                                       |
| sku_id         | snowflake         | ID of the SKU                                                                               |
| user_id?       | snowflake         | ID of the user that is granted access to the entitlement's sku                              |
| guild_id?      | snowflake         | ID of the guild that is granted access to the entitlement's sku                             |
| application_id | snowflake         | ID of the parent application                                                                |
| type           | integer           | [Type of entitlement](#DOCS_MONETIZATION_ENTITLEMENTS/entitlement-object-entitlement-types) |
| consumed       | boolean           | Not applicable for App Subscriptions. Subscriptions are not consumed and will be `false`    |
| starts_at?     | ISO8601 timestamp | Start date at which the entitlement is valid. Not present when using test entitlements.     |
| ends_at?       | ISO8601 timestamp | Date at which the entitlement is no longer valid. Not present when using test entitlements. |

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

| Type                     | ID | Description                                      |
|--------------------------|----|--------------------------------------------------|
| APPLICATION_SUBSCRIPTION | 8  | Entitlement was purchased as an app subscription |

## List Entitlements % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/entitlements

Returns all entitlements for a given app, active and expired.

###### Query Params

| param          | type                              | description                                          |
|----------------|-----------------------------------|------------------------------------------------------|
| user_id?       | snowflake                         | User ID to look up entitlements for                  |
| sku_ids?       | comma-delimited set of snowflakes | Optional list of SKU IDs to check entitlements for   |
| before?        | snowflake                         | Retrieve entitlements before this time               |
| after?         | snowflake                         | Retrieve entitlements after this time                |
| limit?         | integer                           | Number of entitlements to return, 1-100, default 100 |
| guild_id?      | snowflake                         | Guild ID to look up entitlements for                 |
| exclude_ended? | boolean                           | Whether entitlements should be omitted               |

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

## Delete Test Entitlement % DELETE /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/entitlements/{entitlement.id#DOCS_MONETIZATION_ENTITLEMENTS/entitlement-object}

Deletes a currently-active test entitlement. Discord will act as though that user or guild _no longer has_ entitlement to your premium offering.

Returns `204 No Content` on success.

---

## Gateway Events

### New Entitlement

`ENTITLEMENT_CREATE`

Fires when a user subscribes to a SKU. Contains an entitlement object.

```json
{
    "id": "1083167266843000832",
    "sku_id": "1083142056391606272",
    "application_id": "1083108937882013696",
    "user_id": "1072239583707664384",
    "promotion_id": null,
    "type": 8,
    "deleted": false,
    "gift_code_flags": 0,
    "consumed": false,
    "starts_at": "2023-03-08T23:19:58.010876+00:00",
    "ends_at": "2023-04-08T23:19:58.010876+00:00",
    "subscription_id": "1083167255652597760"
}
```

### Updated Entitlement

`ENTITLEMENT_UPDATE`

Fires when a user's subscription renews for the next billing period. The `ends_at` field will have an updated value with the new expiration date.

If a user's subscription is cancelled, you will _not_ receive an `ENTITLEMENT_DELETE` event. Instead, you will simply not receive an `UPDATE` event with a new `ends_at` date at the end of the billing period.

### Deleted Entitlement

`ENTITLEMENT_DELETE`

Fires when a user's entitlement is deleted. Entitlement deletions are infrequent, and occur when:

-   Discord issues a refund for a subscription
-   Discord removes an entitlement from a user via internal tooling

Entitlements are _not_ deleted when they expire.

---

## Using Entitlements in Interactions

### PREMIUM_REQUIRED Interaction Response

If your app has monetization enabled, it will have access to a new [`PREMIUM_REQUIRED` interaction response (`type: 10`)](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type). This can be sent in response to any kind of interaction. It does not allow a `content` field.

This response will create an ephemeral message shown to the user that ran the interaction, instructing them that whatever they tried to do requires the premium benefits of your app. It also contains an "Upgrade" button to subscribe. The response message is static, but will be automatically updated with the name of your premium SKU.

![Interaction Response](monetization-interaction-response.png)

```js
return res.send({
    type: InteractionResponseType.PREMIUM_REQUIRED, // This has a value of 10
    data: {},
});
```

---

### Checking Entitlements in Interactions

To check what the current guild or user has entitlements to, your app can inspect the `entitlements` field. `entitlements` is an array of [entitlement objects](#DOCS_MONETIZATION_ENTITLEMENTS/entitlement-object) for the current guild and user.

You can reference `entitlements` during interactions to handle subscription status, rather than fetching entitlements from the API or your database.
