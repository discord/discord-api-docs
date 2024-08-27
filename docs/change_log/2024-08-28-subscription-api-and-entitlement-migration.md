---
title: "Premium Apps: Entitlement Migration and New Subscription API"
date: "2024-08-28"
topics:
- "Premium Apps"
breaking: true
---

We are migrating our entitlement system to a new behavior where entitlements will not end until explicitly cancelled, representing a breaking change for subscription management. We are introducing a [Subscription API](#DOCS_RESOURCES_SUBSCRIPTION) and [Subscription Events](#DOCS_TOPICS_GATEWAY_EVENTS/subscriptions) to allow handling subscription-related events.

> warn
> This change will be rolled out to all existing applications that have entitlements for user and guild subscription SKUs, starting on October 1, 2024.

#### Entitlement Migration Details
- `ENTITLEMENT_CREATE` events will now be triggered with a null `ends_at` value for all ongoing subscriptions, indicating an indefinite entitlement.
- `ENTITLEMENT_UPDATE` events will occur only when a subscription is canceled, with the `ends_at` value indicating the end date.
- Discord-managed Subscription entitlements will have an `type` value of `1 (PURCHASE)` instead of `8 (APPLICATION_SUBSCRIPTION)`.

### Introducing a new Subscription API
With the new system, entitlements for subscription SKUs will no longer emit events at the start of a new subscription period. Instead, subscription lifecycle management can be handled through the newly introduced Subscription API.
Developers should refer to the [Subscription resource](#DOCS_RESOURCES_SUBSCRIPTION) for information on calling the Subscription API and responding to Subscription events. For a more in-depth implementation, see our [Implementing App Subscriptions](#DOCS_MONETIZATION_IMPLEMENTING_APP_SUBSCRIPTIONS) guide.

### Migration Plan & Guide:
As of October 1, 2024, all existing entitlements that grant access to user-subscription and guild-subscription SKUs, will automatically transfer to the new system on their renewal date. This means we will have a month-long migration window to allow all of your entitlements to migrate to the new system upon renewal.

Developers are advised to update their systems to handle the new `ENTITLEMENT_CREATE` and `ENTITLEMENT_UPDATE` events according to the [migration guide](#DOCS_CHANGE_LOG/subscription-entitlement-migration-guide) before the rollout date to avoid disruptions in service.

### Monetization Documentation Updates
As part of these changes, we've updated the documentation for Premium Apps. 
- Created a new [Enabling Monetization](#DOCS_MONETIZATION_ENABLING_MONETIZATION) page to cover setting up your team, managing payouts and enabling monetization for your apps
- Created a new [Managing SKUs](#DOCS_MONETIZATION_MANAGING_SKUS) page to document how to create, update, publish, and promote your SKUs
- Moved and added [Entitlement](#DOCS_RESOURCES_ENTITLEMENT), [SKU](#DOCS_RESOURCES_SKU) and [Subscription](#DOCS_RESOURCES_SUBSCRIPTION) resources to the **Resources** section
- Updated guides for [Implementing App Subscriptions](#DOCS_MONETIZATION_IMPLEMENTING_APP_SUBSCRIPTIONS) and [Implementing One-Time Purchases](#DOCS_MONETIZATION_IMPLEMENTING_ONE-TIME_PURCHASES)
- Added an [Entitlement Migration Guide](#DOCS_CHANGE_LOG/subscription-entitlement-migration-guide) for updating your Premium App to handle the upcoming migration