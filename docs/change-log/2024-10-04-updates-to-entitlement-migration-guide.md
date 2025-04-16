---
title: "Updates to Entitlement Migration Guide"
date: "2024-10-07"
topics:
- "Premium Apps"
---

The entitlement migration started on **October 1, 2024** and will continue through 11:59PM PST on **November 1, 2024**.

We updated our previous entitlement migration guide to provide more up-to-date information on impacts of developer impacts. Here's a summary of the changes we made:

- The migration will run through November 1, 2024 to ensure that any entitlements that are set to renew in October will be properly migrated to the new entitlement system upon renewal.
- `ENTITLEMENT_UPDATE` events will only occur when a subscription ends. 
- The value of the `ends_at` in `ENTITLEMENT_UPDATE` events indicate the timestamp for **when the entitlement is no longer valid**.
- The `ends_at` value on the [entitlement object](/docs/resources/entitlement#entitlement-object) is set when the subscription ends.
- To receive the value of when a subscription was canceled, you should listen for the `SUBSCRIPTION_UPDATE` events or use the [Subscription API](/docs/resources/subscription).

View the [updated migration guide](/docs/change-log#premium-apps-entitlement-migration-and-new-subscription-api).

To see a full diff of the changes, refer to this pull request: [Entitlement Migration Guide Updates](https://github.com/discord/discord-api-docs/pull/7201).