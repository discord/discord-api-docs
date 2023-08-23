# Premium Apps

## Getting Started with Premium Apps

Premium Apps are a new set of monetization features for developers on Discord. Using Premium Apps, you can:

-   Sell monthly recurring subscriptions to your app directly on Discord
-   Highlight your premium benefits on the App Directory
-   Offer native product tie-ins and upsells on the App Directory, app profiles, and in chat

![Premium App screenshot](premium-example.png)

Currently, there are two types of subscriptions you can offer to users:

-   **User Subscriptions**: A subscription purchased by a user for themselves. They get access to your premium benefits in every server
-   **Guild Subscriptions**: A subscription purchased by a user and applied to a single server. Everyone in that server gets your premium benefits

Adding monetization to your app is a three-step process:

1. Getting your application and team set up to offer subscriptions
2. Creating and customizing a SKU for your subscription
3. Adding support for SKUs and Entitlements to your app

# Application and Team Setup

## Eligibility Checklist

Before you can start creating SKUs and offering subscriptions to your app, we need to make sure your app and team are set up correctly to accept payments.

The onboarding flow involves a series of steps and checks that the team owner will ensure are completed. Onboarding checks will be made to ensure the following criteria are met:

-   App must be verified
-   App belongs to a Developer Team
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

![Eligibility Checklist](monetization.png)

### Setting up Your App with a Team

You'll need:

-   A team in the developer portal. If you don't have one, [create one here](https://discord.com/developers/teams)
-   A verified application _owned by that team_
-   A test application _owned by that team_

If your application is verified, but not owned by a team, you can request owner transfership via Discord's Developer Support by:

-   Going to [https://dis.gd/contact](https://dis.gd/contact)
-   Selecting "Developer Support" from the list of options
-   Selecting "Teams and Ownership"
-   Completing the transfer process

---

## Setting Up Payouts

In the meantime, you can begin setting up your payout information, so you can get paid! Discord does all payout processing through Stripe.

**IF YOU ARE A DEVELOPER BASED IN THE UNITED STATES**

-   Go to your team in the Developer Portal
-   Select "Payout Settings"
    -   If you do not see "Payout Settings", you are not the owner of the team. Only the owner of the team can enable Payout Settings
-   Complete the onboarding flow through Stripe

**IF YOU ARE A DEVELOPER BASED OUTSIDE OF THE UNITED STATES**

-   Premium Apps is not yet available outside of the United States. These features will be made available to more regions soon.