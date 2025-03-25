---
title: "Entitlement Migration Completed"
date: "2024-11-05"
topics:
- "Premium Apps"
---

The [entitlement migration](#DOCS_CHANGE_LOG/premium-apps-entitlement-migration-and-new-subscription-api) which began on **October 1, 2024**, has been successfully completed as of **November 1, 2024**.

### What's Changed

- The documentation has been updated to reflect the new entitlement system as the standard behavior.
- `ENTITLEMENT_UPDATE` event for subscription-related entitlements now only occur when the subscription ends.
- The `ends_at` value on the [entitlement object](#DOCS_RESOURCES_ENTITLEMENT/entitlement-object) is now set when the subscription ends.
- To determine when a subscription was canceled, listen for `SUBSCRIPTION_UPDATE` events or use the [Subscription API](#DOCS_RESOURCES_SUBSCRIPTION) to retrieve the subscription's `status` and `canceled_at` timestamp.

For more details about the migration process, please refer to the [migration guide](#DOCS_CHANGE_LOG/updates-to-entitlement-migration-guide).