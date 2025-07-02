---
title: "Premium Apps: Multiple Subscription Tiers"
date: "2024-12-12"
topics:
- "Premium Apps"
---

Developers with monetization enabled can now create and publish multiple subscription SKUs of the same type for their app. This allows developers to offer different subscription tiers with varying benefits and pricing. Users can upgrade and downgrade between published subscription SKUs.

### What's Changed

#### Developer Portal
- Under the `Monetization` tab, you can now publish multiple subscription SKUs of the same type for your app.

#### App's Store Page
- When multiple subscription SKUs are published: Users can now upgrade or downgrade between different published subscription SKUs.

#### User App Subscription Settings
- When multiple subscription SKUs are published: Users can now upgrade or downgrade between different published subscription SKUs.
- These settings are available under `User Settings → Subscriptions → App Subscriptions`.

#### Subscription Object
- New field `renewal_sku_ids` added to the [subscription object](/docs/resources/subscription#subscription-object) response for `SUBSCRIPTION_UPDATE` events and API endpoints. 
- `renewal_sku_ids` is a list of snowflakes that indicate the SKU(s) that the user will be subscribed to at renewal.

#### Updated Guide: Managing SKUs
- The [Managing SKUs](/docs/monetization/managing-skus#creating-a-sku) guide has been updated to include information about creating and managing multiple subscription SKUs.

#### Updated Guide: Implementing App Subscriptions
- The [Implementing App Subscriptions](/docs/monetization/implementing-app-subscriptions#supporting-upgrades-and-downgrades) guide has been updated to include information about supporting upgrades and downgrades between multiple subscription SKUs.