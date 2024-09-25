---
title: "Activities General Availability"
date: "2024-09-26"
topics:
- "Activities"
- "Embedded App SDK"
- "Premium Apps"
---

Following up on [the rollout of the App Launcher](https://discord.com/blog/discover-more-ways-to-play-with-apps-now-anywhere-on-discord), we’re excited to announce that [Activities](#DOCS_ACTIVITIES_OVERVIEW) are now generally available for developers. In addition to API stability, general availability means that apps with Activities can now be [verified](https://support-dev.discord.com/hc/en-us/articles/23926564536471-How-Do-I-Get-My-App-Verified), [discoverable](#DOCS_DISCOVERY_ENABLING_DISCOVERY) in the App Directory, and [implement monetization](#DOCS_MONETIZATION_OVERVIEW).

### Recent API Updates

Since the developer preview was announced, there have been a few important API updates:

- Activities can now enable and implement monetization features, and [`getEntitlements`](#DOCS_DEVELOPER_TOOLS_EMBEDDED_APP_SDK/getentitlements),[`getSkus`](#DOCS_DEVELOPER_TOOLS_EMBEDDED_APP_SDK/getskus), and [`startPurchase`](#DOCS_DEVELOPER_TOOLS_EMBEDDED_APP_SDK/startpurchase) are generally available in the Embedded App SDK.
- New [Get Application Activity Instance](#DOCS_RESOURCES_APPLICATION/get-application-activity-instance) endpoint to make [managing Activity instances](#DOCS_ACTIVITIES_DEVELOPMENT_GUIDES/activity-instance-management) easier.
- Apps with Activities can create an [Entry Point command (type `4`)](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/entry-point-commands), which are the primary entry point for Activities in the App Launcher. When new apps enable Activities, a [default Entry Point command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/default-entry-point-command) will be created for the app. Read the [original change log](#DOCS_CHANGE_LOG/entry-point-commands) and the [Entry Point command guide](#DOCS_ACTIVITIES_DEVELOPMENT_GUIDES/setting-up-an-entry-point-command) for details.
- Activities can now be launched in response to interactions using the `LAUNCH_ACTIVITY` (type `12`) [interaction callback type](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type) for `APPLICATION_COMMAND`, `MESSAGE_COMPONENT`, and `MODAL_SUBMIT` [interaction types](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-type).
- Apps can now be installed to users (in addition to servers). After [setting up your installation contexts](#DOCS_RESOURCES_APPLICATION/setting-supported-installation-contexts), make sure to request the `application.commands` scope when authorizing with users to make sure your Activity is available for them across their Discord servers, DMs, and Group DMs.
- In August, there were updates to the Content Security Policy (CSP) for Activities that limits how you can make requests to external resources when building Activities. Read [the change log](#DOCS_CHANGE_LOG/activities-proxy-csp-update) and the guide on [using external resources](#DOCS_ACTIVITIES_DEVELOPMENT_GUIDES/using-external-resources) for details.

### Documentation Updates

We’ve also added and improved the documentation for Activities and the Embedded App SDK to make it easier to build:

- New reference documentation for [Monetization](#DOCS_MONETIZATION_OVERVIEW) SDK commands: [`getEntitlements`](#DOCS_DEVELOPER_TOOLS_EMBEDDED_APP_SDK/getentitlements),[`getSkus`](#DOCS_DEVELOPER_TOOLS_EMBEDDED_APP_SDK/getskus), and [`startPurchase`](#DOCS_DEVELOPER_TOOLS_EMBEDDED_APP_SDK/startpurchase)
- Updated [Embedded App SDK Reference](#DOCS_DEVELOPER_TOOLS_EMBEDDED_APP_SDK) documentation that adds signatures and arguments
- Updated development guides for [Activity Instance Management](#DOCS_ACTIVITIES_DEVELOPMENT_GUIDES/activity-instance-management) and [Activity Proxy Considerations](#DOCS_ACTIVITIES_DEVELOPMENT_GUIDES/activity-proxy-considerations) when using external resources
- New guide on implementing [In-App Purchases (IAP) for Activities](#DOCS_MONETIZATION_IMPLEMENTING_IAP_FOR_ACTIVITIES)
- New guides for [Verification and Discovery Surfaces](#DOCS_DISCOVERY_OVERVIEW)
- New guide on [Using Rich Presence with the Embedded App SDK](#DOCS_RICH_PRESENCE_USING_WITH_THE_EMBEDDED_APP_SDK)