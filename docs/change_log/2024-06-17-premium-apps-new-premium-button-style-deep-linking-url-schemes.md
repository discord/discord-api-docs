---
title: "Premium Apps: New Premium Button Style & Deep Linking URL Schemes"
date: "2024-06-17"
---

**New Premium Button Style**

Introduces a new `premium` [button style](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/button-object-button-styles) to be used with a `sku_id` which points to an active [SKU](#DOCS_RESOURCES_SKU/sku-object). This allows developers to customize their premium experience by returning specific subscription or one-time purchase products.

Learn more about using [button components with interactions](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons).

> warn
> This change deprecates Interaction Response Type 10

The `PREMIUM_REQUIRED (10)` interaction response type is now deprecated in favor of using custom premium buttons. This will continue to function but may be eventually unsupported. It is recommended to migrate your bots to use the more flexible [premium button component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/button-object-button-styles).

Learn more about [gating features with premium interactions](#DOCS_MONETIZATION_IMPLEMENTING_APP_SUBSCRIPTIONS/prompting-users-to-subscribe).

**Deep Linking URL Schemes for SKUs and Store**

Introduces two new url schemes for linking directly to the Application Directory. When these links are used in chat, they are rendered as rich embeds that users can interact with to launch an app's store or open a SKU detail modal.

* New [Store URL Scheme](#DOCS_MONETIZATION_MANAGING_SKUS/linking-to-your-store): `https://discord.com/application-directory/:appID/store`
* New [SKU URL Scheme](#DOCS_MONETIZATION_MANAGING_SKUS/linking-to-a-specific-sku): `https://discord.com/application-directory/:appID/store/:skuID`
