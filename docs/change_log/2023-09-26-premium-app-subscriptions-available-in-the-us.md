---
title: "Premium App Subscriptions Available in the US"
date: "2023-09-26"
topics:
- "Premium Apps"
---

Starting today, eligible US-based developers can monetize their verified apps with App Subscriptions. [App Subscriptions](#DOCS_MONETIZATION_OVERVIEW) let you to charge your users for premium functionality with a recurring, monthly subscription.

* Manage subscription SKUs in the Developer Portal
* View monetization analytics in the Developer Portal
* Team owners can setup and manage payouts in Developer Portal
* New endpoints for working with [SKUs](#DOCS_RESOURCES_SKU) and [Entitlements](#DOCS_RESOURCES_ENTITLEMENT):
  * [List SKUs](#DOCS_RESOURCES_SKU/list-skus) `GET /applications/<application.id>/skus`
  * [List Entitlements](#DOCS_RESOURCES_ENTITLEMENT/list-entitlements) `GET /applications/<application.id>/entitlements`
  * [Create Test Entitlement](#DOCS_RESOURCES_ENTITLEMENT/create-test-entitlement) `POST /applications/<application.id>/entitlements`
  * [Delete Test Entitlement](#DOCS_RESOURCES_ENTITLEMENT/delete-test-entitlement)  `DELETE /applications/<application.id>/entitlements/<entitlement.id>`
* [Gateway Events](#DOCS_TOPICS_GATEWAY_EVENTS/entitlements) for working with entitlements: `ENTITLEMENT_CREATE`, `ENTITLEMENT_UPDATE`, `ENTITLEMENT_DELETE`
* New [`PREMIUM_REQUIRED (10)` interaction response type](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type) is available to prompt users to upgrade
* New `entitlements` field, which is an array of [entitlement](#DOCS_RESOURCES_ENTITLEMENT/) objects, available in interaction data payloads when [receiving and responding to interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure)

To learn more about eligibility details and how to enable monetization for your app, check out the [Monetization Overview](#DOCS_MONETIZATION_OVERVIEW).
