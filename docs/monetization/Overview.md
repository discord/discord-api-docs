# Monetizing Your Discord App

Premium Apps is a set of monetization features for apps on Discord that allows developers to:

-   Sell monthly recurring [subscriptions](#DOCS_MONETIZATION_APP_SUBSCRIPTIONS) for your app's premium functionality within Discord
-   Sell [one-time purchases](#DOCS_MONETIZATION_ONE-TIME_PURCHASES) for both durable and consumable items or functionality within your app
-   Highlight your app's premium benefits on the App Directory and on your own [Store](#DOCS_MONETIZATION_MANAGING_YOUR_STORE) page
-   Offer native product tie-ins and upsells on the App Directory, app profiles, and in chat

![Premium App screenshot](premium-example.png)

## Eligibility Checklist

Before you can start creating SKUs and offering subscriptions for your app, your app and team must be eligible for monetization.

Only team owners can enable monetization for an app. When a team owner enables monetization, they'll be taken through a series of steps and checks to ensure the following criteria are met:

-   App must be verified
-   App belongs to a developer team
-   Team owner must be at least 18 years old
-   Team must have verified emails and 2FA set up
-   App uses slash commands, or has been approved for the privileged `Message Content` intent
-   App has a link to your Terms of Service
    -   This document is an agreement between you and users governing the use of your app.
-   App has a link to your Privacy Policy
    -   This document should clearly and accurately describe to users of your app the user data you collect and how you use and share such data with us and third parties, consistent with our Developer Terms of Service and Developer Policy.
-   App must not contain any harmful or bad language in the name, description, commands, or role connection metadata.
-   Payouts must be setup with a valid payment method
-   Agreement to the [Monetization Terms](https://support.discord.com/hc/articles/5330075836311) and [Discord App Subscriptions Policy](https://support-dev.discord.com/hc/articles/17442400631959).

## Setting Up Monetization

Adding monetization to your app is a three-step process:

1. Set up your app and developer team to offer subscriptions and one-time purchases
2. Create and customize a SKU for your app subscription or one-time purchase
3. Adding support for SKUs and Entitlements to your app

### Configuring Your App

Before monetization can be enabled, you will need:

-   A [team](#DOCS_TOPICS_TEAMS) in the developer portal. If you don't have one, you can [create one on the Teams page](https://discord.com/developers/teams)
-   A [verified app](https://support.discord.com/hc/en-us/articles/360040720412-Bot-Verification-and-Data-Allowlisting#h_46b3869c-6d50-43fc-b07c-9ed7569a1160) that is _owned by that team_

### Setting Up Team Payouts

In the meantime, you can begin setting up your payout information so you can get paid! Discord does all payout processing through Stripe, so part of setting up payouts will be going through Stripe's onboarding flow.

Only the owner of the team can enable payout settings for the team.

#### If You are Based in the United States, European Union, or United Kingdom

-   Click on [your team](https://discord.com/developers/teams) on the Teams page.
-   Select "Payout Settings"
    -   If you do not see "Payout Settings", you are not the owner of the team. Only the owner of the team can enable payout settings for the team.
-   Complete the onboarding flow through Stripe

#### If You are Based Outside of the United States, European Union, or United Kingdom

Premium Apps is not currently available outside of these regions. These features will be made available to more regions soon.

### Implementing Your Premium Features

Once your team and app are all set up for monetization, you are ready to [customize your subscription](#DOCS_MONETIZATION_SKUS/customizing-your-skus) and [implement your premium features](#DOCS_MONETIZATION_APP_SUBSCRIPTIONS) in your app!
