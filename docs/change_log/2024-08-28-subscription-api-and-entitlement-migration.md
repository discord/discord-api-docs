---
title: "Premium Apps: Entitlement Migration and New Subscription API"
date: "2024-08-28"
topics:
- "Premium Apps"
breaking: true
---

We are migrating our entitlement system to a new behavior where entitlements will not end until explicitly canceled, representing a breaking change for subscription management. We are introducing a [Subscription API](#DOCS_RESOURCES_SUBSCRIPTION) and [Subscription Events](#DOCS_TOPICS_GATEWAY_EVENTS/subscriptions) to allow handling subscription-related events.

> warn
> This change will be rolled out to all existing applications that have entitlements for user and guild subscription SKUs, starting on October 1, 2024.

#### Entitlement Migration Details
- `ENTITLEMENT_CREATE` events will now be triggered with a null `ends_at` value for all ongoing subscriptions, indicating an indefinite entitlement.
- `ENTITLEMENT_UPDATE` events will occur only when a subscription is canceled, with the `ends_at` value indicating the end date.
- Discord-managed Subscription entitlements will have an `type` value of `PURCHASE` (type `1`) instead of `APPLICATION_SUBSCRIPTION` (type `8`).

### Migration Plan & Guide:
As of **October 1, 2024**, all existing entitlements that grant access to user-subscription and guild-subscription SKUs, will automatically transfer to the new system on their renewal date. This means we will have a month-long migration window to allow all of your entitlements to migrate to the new system upon renewal.

Developers are advised to update their systems to handle the new `ENTITLEMENT_CREATE` and `ENTITLEMENT_UPDATE` events according to the following migration guide before the rollout date to avoid service disruptions.

### Introducing a New Subscription API
With the new entitlement behavior, entitlements for subscription SKUs will no longer emit events at the start of a new subscription billing period. Instead, subscription lifecycle management can be handled through the new [Subscription API](#DOCS_MONETIZATION_IMPLEMENTING_APP_SUBSCRIPTIONS/using-the-subscription-api).
Developers should refer to the [Subscription resource](#DOCS_RESOURCES_SUBSCRIPTION) for information on calling the Subscription API and responding to Subscription events. For in-depth implementation details, see our [Implementing App Subscriptions](#DOCS_MONETIZATION_IMPLEMENTING_APP_SUBSCRIPTIONS/using-the-subscription-api) guide. You can start using this API now.

### Monetization Documentation Updates
As part of these changes, we've updated the documentation for Premium Apps. 
- Created a new [Enabling Monetization](#DOCS_MONETIZATION_ENABLING_MONETIZATION) page to cover setting up your team, managing payouts, and enabling monetization for your apps
- Created a new [Managing SKUs](#DOCS_MONETIZATION_MANAGING_SKUS/creating-a-sku) page to document how to create, update, publish, and promote your SKUs
- Moved and added [Entitlement](#DOCS_RESOURCES_ENTITLEMENT), [SKU](#DOCS_RESOURCES_SKU) and [Subscription](#DOCS_RESOURCES_SUBSCRIPTION) resources to the **Resources** section
- Updated guides for [Implementing App Subscriptions](#DOCS_MONETIZATION_IMPLEMENTING_APP_SUBSCRIPTIONS) and [Implementing One-Time Purchases](#DOCS_MONETIZATION_IMPLEMENTING_ONE-TIME_PURCHASES)

### Subscription Entitlement Migration Guide

Starting on **October 1, 2024**, we will be migrating our existing entitlement system to a new behavior where **entitlements do not expire until explicitly canceled**. This migration guide outlines the changes and impacts of this migration on developers and guides how to manage these changes effectively.

> warn
> With this update, entitlements for subscription SKUs will no longer emit events when a new subscription billing period begins. If you need to know when a subscription has been renewed, use the new [Subscription API](#DOCS_RESOURCES_SUBSCRIPTION) and related [Subscription Gateway Events](#DOCS_TOPICS_GATEWAY_EVENTS/subscriptions).

### Current System

Currently, entitlements for Subscription SKUs purchased through Discord have:
- An `ends_at` date that corresponds to the subscription interval. This date is updated at each billing cycle.
- A entitlement `type` value of `APPLICATION_SUBSCRIPTION` (type `8`).
- An `ENTITLEMENT_UPDATE` event is triggered at the start of each new subscription period.

### New System

Post-migration, entitlements for Subscription SKUs purchased through Discord will:
-  No longer have an end date (`ends_at` will be `null`) until the user decides to cancel the subscription.
-  Now have an entitlement `type` value of `PURCHASE` (type `1`).
-  No `ENTITLEMENT_UPDATE` events will be triggered until the subscription is canceled.

### Migration Timeline

- **Migration Start Date:** October 1, 2024
- **Migration End Date:** October 31, 2024

### Migration Impacts

### 1) Existing Entitlements Scheduled to Renew

- **During Migration Window:**
    - These will automatically transfer to the new system.
    - A new `ENTITLEMENT_CREATE` event will be triggered to indicate the migration. This does not indicate a net new entitlement.
    - No further events will be generated until cancellation, which will then trigger an `ENTITLEMENT_UPDATE` event.

### 2) Existing Entitlements Set to End

- **During Migration Window:**
    - These entitlements will naturally expire and not renew under the new system.
    - No new entitlement events will be generated for these cases.

### Developer Actions
- **Pre-Migration:**
    - Review and understand the new entitlement event structure.
    - Adjust your system to handle `ends_at` being null, which now indicates an indefinite entitlement.
    - Adjust your system not to expect type `APPLICATION_SUBSCRIPTION` (type `8`) for Discord-managed subscription entitlements.
- **Post-Migration:**
    - Monitor for `ENTITLEMENT_CREATE` and `ENTITLEMENT_UPDATE` events.
    - Update your handling of `ends_at` timestamps to manage cancellations effectively.

<Collapsible title="Entitlement Migration Example Scenario" description="Step-by-step example of an entitlement upgrading to the new entitlement system" icon="view" open>
- The Entitlement Migration begins on October 1, 2024
- You have an existing user subscription that has an existing `ends_at` timestamp for October 10, 2024.
- If the subscription renews successfully, you will receive an `ENTITLEMENT_UPDATE` event on October 10, 2024, with an `ends_at` value of null
- If you receive an `ENTITLEMENT_UPDATE` event with an `ends_at` timestamp, the entitlement for this subscription is expected to end at the timestamp value unless you receive subsequent `ENTITLEMENT_UPDATE` events between the cancellation and the `ends_at` value.
</Collapsible>