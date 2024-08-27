---
title: "Subscription Entitlement Migration Guide"
date: "2024-08-28"
topics:
- "Premium Apps"
breaking: true
---

### Overview

Starting on October 1, 2024, we will be migrating our existing entitlement system to a new behavior where entitlements do not expire until explicitly cancelled. This migration guide outlines the changes and impacts of this migration on developers and provides guidance on how to manage these changes effectively.

> info
> With this update, entitlements for subscription SKUs will no longer emit events when a new subscription billing period begins. If you need to know when a subscription has renewed, we have introduced a [Subscription API](#DOCS_RESOURCES_SUBSCRIPTION) and related [Subscription Gateway Events](#DOCS_TOPICS_GATEWAY_EVENTS/subscriptions).

### Current System

Currently, entitlements for Subscription SKUs purchased through Discord have:
- An `ends_at` date that corresponds to the subscription interval. This date is updated at each billing cycle.
- A entitlement `type` value of `APPLICATION_SUBSCRIPTION` (type `8`).
- An `ENTITLEMENT_UPDATE` event triggered at the start of each new subscription period.

### New System

Post-migration, entitlements for Subscription SKUs purchased through Discord will:
-  No longer have an end date (`ends_at` will be null) until the user decides to cancel the subscription.
-  Now have an entitlement `type` value of `PURCHASE` (type `1`).
-  No `ENTITLEMENT_UPDATE` events will be triggered until the subscription is cancelled.

### Migration Timeline

- **Migration Start Date:** October 1, 2024
- **Migration End Date:** October 31, 2024

### Migration Impacts

### 1) Existing Entitlements Scheduled to Renew

- **During Migration Window:**
    - These will automatically transfer to the new system.
    - A new `ENTITLEMENT_CREATE` event will be triggered to indicate the migration. This does not indicate a net-new entitlement.
    - No further events will be generated until cancellation, which will then trigger an `ENTITLEMENT_UPDATE` event.

### 2) Existing Entitlements Set to End

- **During Migration Window:**
    - These entitlements will naturally expire and not renew under the new system.
    - No new entitlement events will be generated for these cases.

### Developer Actions
- **Pre-Migration:**
    - Review and understand the new entitlement event structure.
    - Adjust your system to handle `ends_at` being null, which now indicates an indefinite entitlement.
    - Adjust your system to not expect type `APPLICATION_SUBSCRIPTION` (type `8`) for Discord-managed subscription entitlements.
- **Post-Migration:**
    - Monitor for `ENTITLEMENT_CREATE` and `ENTITLEMENT_UPDATE` events.
    - Update your handling of `ends_at` timestamps to manage cancellations effectively.

<Collapsible title="Entitlement Migration Example Scenario" description="Step-by-step example of an entitlement upgrading to the new entitlement system" icon="view" open>
- The Entitlement Migration begins on October 1, 2024
- You have an existing user subscription that has an existing `ends_at` timestamp for October 10, 2024.
- If the subscription renews successfully, you will receive an `ENTITLEMENT_UPDATE` event on October 10, 2024 with an `ends_at` value of null
- If you receive an `ENTITLEMENT_UPDATE` event with an `ends_at` timestamp, the entitlement for this subscription is expected to end at the timestamp value unless you receive subsequent `ENTITLEMENT_UPDATE` events between the cancellation and the `ends_at` value.
</Collapsible>