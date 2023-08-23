## SKU Resource

SKUs in Discord represent premium offerings that can be made available to your application's users or guilds.

### SKU Object

###### SKU Structure

| Field          | Type      | Description                                                                          |
| -------------- | --------- | ------------------------------------------------------------------------------------ |
| id             | todo      | unique ID of sku                                                                     |
| type           | integer   | [type of sku](#DOCS_PREMIUM_APPS_SKUS/sku-object-sku-types)                          |
| application_id | snowflake | ID of the parent application                                                         |
| access_type    | integer   | [type of access the sku grants](#DOCS_PREMIUM_APPS_SKUS/sku-object-sku-access-types) |
| name           | string    | the customer-facing name of your premium offering                                    |
| slug           | string    | system generated URL slug, based on the sku’s name                                   |

###### SKU Example

```json
{
    "id": "1088510058284990888",
    "type": 5,
    "dependent_sku_id": null,
    "application_id": "788708323867885999",
    "manifest_labels": null,
    "access_type": 1,
    "name": "Test Premium",
    "features": [],
    "release_date": null,
    "premium": false,
    "slug": "test-premium",
    "flags": 128,
    "show_age_gate": false
}
```

###### SKU Types

For subscriptions, SKUs will have a type of either `SUBSCRIPTION` represented by `type: 5` or `SUBSCRIPTION_GROUP` represented by `type:6`. For any current implementations, you will want to use the SKU defined by `type: 5`. A `SUBSCRIPTION_GROUP` is automatically created for each `SUBSCRIPTION` SKU and are not used at this time.

| Type               | ID  | Description                                              |
| ------------------ | --- | -------------------------------------------------------- |
| SUBSCRIPTION       | 5   | represents a recurring subscription                      |
| SUBSCRIPTION_GROUP | 6   | system-generated group for each SUBSCRIPTION sku created |

For subscriptions, there are two types of access levels you can offer to users, which are represented by the `access_type` field on a SKU record.

-   **Guild Subscriptions**: A subscription purchased by a user and applied to a single server. Everyone in that server gets your premium benefits
-   **User Subscriptions**: A subscription purchased by a user for themselves. They get access to your premium benefits in every server

###### SKU Access Types

| Type               | ID  | Description                            |
| ------------------ | --- | -------------------------------------- |
| GUILD_SUBSCRIPTION | 1   | sku provides premium access to a guild |
| USER_SUBSCRIPTION  | 2   | sku provides premium access to a user  |

## Customizing Your SKUs

In the developer portal, you're able to customize several things for your premium offering:

-   A name for your premium SKU, max 80 characters.
-   A description for your premium SKU, max 160 characters
-   An icon for your premium SKU

![Example SKU customization](sku-customization.png)

You're also able to customize a list of benefits. These are displayed on the App Directory, and during the purchase and cancellation flows to explain to users the benefits of your premium offering. These benefits can have:

-   Up to 6 benefits
-   An emoji, standard or custom
-   A name, max 80 characters
-   A description, max 160 characters

![Example of SKU benefits](sku-benefits.png)

## Publishing Your SKUs

When you're ready to launch, you can go the Developer Portal and change your SKU to "Published", and your premium offering will be live and available for purchase by users.

From then on, we'll send you daily dashboard emails containing information about purchases, cancellations, and other premium information.

Congratulations on going live! 🥳

## List SKUs % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/skus

Returns all SKUs for a given application. Because of how our SKU and subscription systems work, you will see two SKUs for your premium offering. You'll want to use the SKU with `type: 5` for integration and testing entitlements.

The `flags` field can be used to differentiate user and server subscriptions with a bitwise `&&` operator.

-   Server Subscriptions: `1 << 7`
-   User Subscriptions: `1 << 8`

```json
[
    {
        "id": "1088510053843210999",
        "type": 6,
        "dependent_sku_id": null,
        "application_id": "788708323867885999",
        "manifest_labels": null,
        "access_type": 1,
        "name": "Test Premium",
        "features": [],
        "release_date": null,
        "premium": false,
        "slug": "test-premium",
        "flags": 128,
        "show_age_gate": false
    },
    {
        "id": "1088510058284990888",
        "type": 5,
        "dependent_sku_id": null,
        "application_id": "788708323867885999",
        "manifest_labels": null,
        "access_type": 1,
        "name": "Test Premium",
        "features": [],
        "release_date": null,
        "premium": false,
        "slug": "test-premium",
        "flags": 128,
        "show_age_gate": false
    }
]
```
