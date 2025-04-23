---
title: "Activities General Availability"
date: "2024-09-26"
topics:
- "Activities"
- "Embedded App SDK"
- "Premium Apps"
---

Following up on [the rollout of the App Launcher](https://discord.com/blog/discover-more-ways-to-play-with-apps-now-anywhere-on-discord), we’re excited to announce that [Activities](/docs/activities/overview) are now generally available for developers. In addition to API stability, this means that apps with Activities can now be [verified](https://support-dev.discord.com/hc/en-us/articles/23926564536471-How-Do-I-Get-My-App-Verified), [discoverable](/docs/discovery/enabling-discovery) in the App Directory, and [implement monetization](/docs/monetization/overview).

### Recent API Updates

Since the developer preview was announced, there have been a few important API updates:

- Activities can now enable and implement monetization features, and [`getEntitlements`](/docs/developer-tools/embedded-app-sdk#getentitlements),[`getSkus`](/docs/developer-tools/embedded-app-sdk#getskus), and [`startPurchase`](/docs/developer-tools/embedded-app-sdk#startpurchase) are generally available in the Embedded App SDK.
- New [Get Application Activity Instance](/docs/resources/application#get-application-activity-instance) endpoint to make [managing Activity instances](/docs/activities/development-guides/multiplayer-experience#activity-instance-management) easier.
- Apps with Activities can create an [Entry Point command (type `4`)](/docs/interactions/application-commands#entry-point-commands), which are the primary entry point for Activities in the App Launcher. When new apps enable Activities, a [default Entry Point command](/docs/interactions/application-commands#default-entry-point-command) will be created for the app. Read the [original change log](/docs/change-log#entry-point-commands) and the [Entry Point command guide](/docs/activities/development-guides/user-actions#setting-up-an-entry-point-command) for details.
- Activities can now be launched in response to interactions using the `LAUNCH_ACTIVITY` (type `12`) [interaction callback type](/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type) for `APPLICATION_COMMAND`, `MESSAGE_COMPONENT`, and `MODAL_SUBMIT` [interaction types](/docs/interactions/receiving-and-responding#interaction-object-interaction-type).
- Apps can now be installed to users (in addition to servers). After [setting up your installation contexts](/docs/resources/application#setting-supported-installation-contexts), make sure to request the `application.commands` scope when authorizing with users to make sure your Activity is available for them across their Discord servers, DMs, and Group DMs.
- In August, there were updates to the Content Security Policy (CSP) for Activities that limits how you can make requests to external resources when building Activities. Read [the change log](/docs/change-log#activities-proxy-csp-update) and the guide on [using external resources](/docs/activities/development-guides/networking#using-external-resources) for details.

### Documentation Updates

We’ve also added and improved the documentation for Activities and the Embedded App SDK to make it easier to build:

- New reference documentation for [Monetization](/docs/monetization/overview) SDK commands: [`getEntitlements`](/docs/developer-tools/embedded-app-sdk#getentitlements),[`getSkus`](/docs/developer-tools/embedded-app-sdk#getskus), and [`startPurchase`](/docs/developer-tools/embedded-app-sdk#startpurchase)
- Updated [Embedded App SDK Reference](/docs/developer-tools/embedded-app-sdk) documentation that adds signatures and arguments
- Updated development guides for [Activity Instance Management](/docs/activities/development-guides/multiplayer-experience#activity-instance-management) and [Activity Proxy Considerations](/docs/activities/development-guides/networking#activity-proxy-considerations) when using external resources
- New guide on implementing [In-App Purchases (IAP) for Activities](/docs/monetization/implementing-iap-for-activities)
- New guides for [Verification and Discovery Surfaces](/docs/discovery/overview)
- New guide on [Using Rich Presence with the Embedded App SDK](/docs/rich-presence/using-with-the-embedded-app-sdk)
