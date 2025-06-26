---
title: "Premium Apps: Entitlement Migration and New Subscription API"
date: "2024-08-28"
topics:
- "Premium Apps"
breaking: true
---

:::info
Updates to this Change Log entry was published on **October 7, 2024** to reflect up-to-date information. See the [new Change Log entry](/docs/change-log#updates-to-entitlement-migration-guide) for details on updates.
:::

We are migrating our entitlement system to a new behavior where entitlements will not end until explicitly canceled, representing a breaking change for subscription management. We are introducing a [Subscription API](/docs/resources/subscription) and [Subscription Events](/docs/events/gateway-events#subscriptions) to allow handling subscription-related events.

:::warn
This change will be rolled out to all existing applications that have entitlements for user and guild subscription SKUs, starting on October 1, 2024.
:::

#### Entitlement Migration Details

- `ENTITLEMENT_CREATE` events will now be triggered with a null `ends_at` value for all ongoing subscriptions, indicating an indefinite entitlement.
- `ENTITLEMENT_UPDATE` events will occur only when a subscription ends, with the `ends_at` value indicating the end date.
- Discord-managed Subscription entitlements will have an `type` value of `PURCHASE` (type `1`) instead of `APPLICATION_SUBSCRIPTION` (type `8`).

### Migration Plan & Guide:

As of **October 1, 2024**, all existing entitlements that grant access to user-subscription and guild-subscription SKUs will automatically transfer to the new system on their renewal date. This means we will have a month-long migration window to allow all of your entitlements to migrate to the new system upon renewal.

Developers are advised to update their systems to handle the new `ENTITLEMENT_CREATE` and `ENTITLEMENT_UPDATE` events according to the following migration guide before the rollout date to avoid service disruptions.

### Introducing a New Subscription API

With the new entitlement behavior, entitlements for subscription SKUs will no longer emit events at the start of a new subscription billing period. Instead, subscription lifecycle management can be handled through the new [Subscription API](/docs/monetization/implementing-app-subscriptions#using-the-subscription-api).
Developers should refer to the [Subscription resource](/docs/resources/subscription) for information on calling the Subscription API and responding to Subscription events. For in-depth implementation details, see our [Implementing App Subscriptions](/docs/monetization/implementing-app-subscriptions#using-the-subscription-api) guide. You can start using this API now.

### Monetization Documentation Updates

As part of these changes, we've updated the documentation for Premium Apps.

- Created a new [Enabling Monetization](/docs/monetization/enabling-monetization) page to cover setting up your team, managing payouts, and enabling monetization for your apps
- Created a new [Managing SKUs](/docs/monetization/managing-skus#creating-a-sku) page to document how to create, update, publish, and promote your SKUs
- Moved and added [Entitlement](/docs/resources/entitlement), [SKU](/docs/resources/sku) and [Subscription](/docs/resources/subscription) resources to the **Resources** section
- Updated guides for [Implementing App Subscriptions](/docs/monetization/implementing-app-subscriptions) and [Implementing One-Time Purchases](/docs/monetization/implementing-one-time-purchases)

### Subscription Entitlement Migration Guide

Starting on **October 1, 2024**, we will be migrating our existing entitlement system to a new behavior where **entitlements do not expire until explicitly canceled**. This migration guide outlines the changes and impacts of this migration on developers and guides how to manage these changes effectively.

:::warn
With this update, entitlements for subscription SKUs will no longer emit events when a new subscription billing period begins. If you need to know when a subscription has been renewed, use the new [Subscription API](/docs/resources/subscription) and related [Subscription Gateway Events](/docs/events/gateway-events#subscriptions).
:::

### Current System

Currently, entitlements for Subscription SKUs purchased through Discord have:

- An `ends_at` date that corresponds to the subscription interval. This date is updated at each billing cycle.
- A entitlement `type` value of `APPLICATION_SUBSCRIPTION` (type `8`).
- An `ENTITLEMENT_UPDATE` event is triggered at the start of each new subscription period.

### New System

Post-migration, entitlements for Subscription SKUs purchased through Discord will:

- No longer have an end date (`ends_at` will be `null`) until the user decides to cancel the subscription.
- Now have an entitlement `type` value of `PURCHASE` (type `1`).
- No `ENTITLEMENT_UPDATE` events will be triggered until the subscription is canceled.

### Migration Timeline

- **Migration Start Date:** October 1, 2024
- **Migration End Date:** November 1, 2024

### Migration Impacts

### 1) Existing Entitlements Scheduled to Renew

- **During Migration Window:**
    - These will automatically transfer to the new system.
    - A new `ENTITLEMENT_CREATE` event will be triggered to indicate the migration. This does not indicate a net new entitlement.
    - No further events will be generated until the entitlement ends, which will then trigger an `ENTITLEMENT_UPDATE` event.
    - The `ends_at` value in the `ENTITLEMENT_UPDATE` event and in the Entitlement API will indicate the timestamp when the entitlement ends.

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
    - Monitor for `ENTITLEMENT_CREATE`, `ENTITLEMENT_UPDATE`, `SUBSCRIPTION_CREATE`, and `SUBSCRIPTION_UPDATE` events.
    - Update any references to an entitlement `ends_at` timestamps, which now indicate the ending of an entitlement. If you need to know when a subscription's period ends, use the [Subscription API](/docs/resources/subscription) and related [Subscription Gateway Events](/docs/events/gateway-events#subscriptions).

<Collapsible title="Entitlement Migration Example Scenario" description="Step-by-step example of an entitlement upgrading to the new entitlement system" icon="view" open>
- The Entitlement Migration begins on October 1, 2024
- You have an existing user subscription that has an existing `ends_at` timestamp for October 10, 2024.
- If the subscription renews successfully, you will receive an `ENTITLEMENT_CREATE` event on October 10, 2024, with an `ends_at` value of null
- ~~If you receive an `ENTITLEMENT_UPDATE` event with an `ends_at` timestamp, the entitlement for this subscription is expected to end at the timestamp value unless you receive subsequent `ENTITLEMENT_UPDATE` events between the cancellation and the `ends_at` value.~~
</Collapsible>
