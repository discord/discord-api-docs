# Premium Apps

Premium Apps is a set of monetization features for apps on Discord that allows developers to:

-   Sell monthly recurring [subscriptions](#DOCS_PREMIUM_APPS_APP_SUBSCRIPTIONS) for your app's premium functionality within Discord
-   Highlight your app's premium benefits on the App Directory
-   Offer native product tie-ins and upsells on the App Directory, app profiles, and in chat

![Premium App screenshot](premium-example.png)

## Eligibility Checklist

Before you can start creating SKUs and offering subscriptions for your app, your app and team must be eligible for monetization.

Only team owners can enable monetization for an app. When a team owner enables monetization, they'll be taken through a series of steps and checks to ensure the following criteria are met:

-   App must be verified
-   App belongs to a developer team
-   Team member(s) must be at least 18 years old
-   Team must have verified emails and 2FA set up
-   App uses slash commands, or has been approved for the Message Content privileged intent
-   App has a link to your Terms of Service
    -   This document is an agreement between you and users governing the use of your app.
-   App has a link to your Privacy Policy
    -   This document should clearly and accurately describe to users of your app the user data you collect and how you use and share such data with us and third parties, consistent with our Developer Terms of Service and Developer Policy.
-   App must not contain any harmful or bad language in the name, description, commands, or role connection metadata.
-   Payouts must be setup with a valid payment method
-   Agreement to the [Monetization Terms](https://support.discord.com/hc/en-us/articles/5330075836311) and [Discord App Subscriptions Policy](https://support-dev.discord.com/hc/en-us/articles/17442400631959).

## Setting Up Monetization

Adding monetization to your app is a three-step process:

1. Set up your app and developer team to offer subscriptions
2. Create and customize a SKU for your app subscription
3. Adding support for SKUs and Entitlements to your app

### Configuring Your App

Before monetization can be enabled, you will need:

-   A [team](#DOCS_TOPICS_TEAMS) in the developer portal. If you don't have one, you can [create one on the Teams page](https://discord.com/developers/teams)
-   A [verified app](https://support.discord.com/hc/en-us/articles/360040720412-Bot-Verification-and-Data-Allowlisting#h_46b3869c-6d50-43fc-b07c-9ed7569a1160) that is _owned by that team_
-   A test app _owned by that team_

If your app is verified, but not owned by a team, you can request an owner transfership by reaching out to [developer support](https://support-dev.discord.com/hc/en-us/requests/new?ticket_form_id=12094720423319) and under **What can we help you with?**, select "Teams and Ownership".

### Setting Up Team Payouts

In the meantime, you can begin setting up your payout information so you can get paid! Discord does all payout processing through Stripe, so part of setting up payouts will be going through Stripe's onboarding flow.

Only the owner of the team can enable payout settings for the team.

#### If You are Based in the United States

-   Click on [your team](https://discord.com/developers/teams) on the Teams page.
-   Select "Payout Settings"
    -   If you do not see "Payout Settings", you are not the owner of the team. Only the owner of the team can enable payout settings for the team.
-   Complete the onboarding flow through Stripe

#### If You are Based Outside of the United States

Premium Apps is not currently available outside of the United States. These features will be made available to more regions soon.