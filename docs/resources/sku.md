---
sidebar_label: SKU
---

# SKU Resource

SKUs (stock-keeping units) in Discord represent premium offerings that can be made available to your application's users or guilds.

### SKU Object

###### SKU Structure

| Field          | Type      | Description                                                                                                             |
|----------------|-----------|-------------------------------------------------------------------------------------------------------------------------|
| id             | snowflake | ID of SKU                                                                                                               |
| type           | integer   | [Type of SKU](#DOCS_RESOURCES_SKU/sku-object-sku-types)                                                                 |
| application_id | snowflake | ID of the parent application                                                                                            |
| name           | string    | Customer-facing name of your premium offering                                                                           |
| slug           | string    | System-generated URL slug based on the SKU's name                                                                       |
| flags          | integer   | [SKU flags](#DOCS_RESOURCES_SKU/sku-object-sku-flags) combined as a [bitfield](https://en.wikipedia.org/wiki/Bit_field) |

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

| Type               | Value | Description                                              |
|--------------------|-------|----------------------------------------------------------|
| DURABLE            | 2     | Durable one-time purchase                                |
| CONSUMABLE         | 3     | Consumable one-time purchase                             |
| SUBSCRIPTION       | 5     | Represents a recurring subscription                      |
| SUBSCRIPTION_GROUP | 6     | System-generated group for each SUBSCRIPTION SKU created |

###### SKU Flags

For subscriptions, there are two types of access levels you can offer to users:

- **Guild Subscriptions**: A subscription purchased by a user and applied to a single server. Everyone in that server gets your premium benefits.
- **User Subscriptions**: A subscription purchased by a user for themselves. They get access to your premium benefits in every server.

The `flags` field can be used to differentiate user and server subscriptions with a bitwise `&` operator.

| Type               | Value    | Description                                                                                                               |
|--------------------|----------|---------------------------------------------------------------------------------------------------------------------------|
| AVAILABLE          | `1 << 2` | SKU is available for purchase                                                                                             |
| GUILD_SUBSCRIPTION | `1 << 7` | Recurring SKU that can be purchased by a user and applied to a single server. Grants access to every user in that server. |
| USER_SUBSCRIPTION  | `1 << 8` | Recurring SKU purchased by a user for themselves. Grants access to the purchasing user in every server.                   |

## List SKUs % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/skus

Returns all SKUs for a given application. 

> info
> Because of how our SKU and subscription systems work, you will see two SKUs for your subscription offering. For integration and testing entitlements for Subscriptions, you should use the SKU with `type: 5`.

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
