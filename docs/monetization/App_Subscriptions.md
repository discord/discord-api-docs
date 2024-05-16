# App Subscriptions

App Subscriptions enable you to charge your users for premium app functionality with a recurring subscription. Before you can add an app subscription to your app, you must complete the [Monetization Eligibility Checklist](#DOCS_MONETIZATION_OVERVIEW/eligibility-checklist).

Once you've confirmed eligibility for your app and team, you will be able to set up a [SKU](#DOCS_MONETIZATION_SKUS) (stock-keeping unit) to represent your app's premium offering.

## Types of Subscriptions

When creating subscriptions, you will need to choose between user or guild subscriptions:

-   **User Subscriptions**: Offers premium features to an individual user across any server where your app installed.
-   **Guild Subscriptions**: Provides premium benefits to all members within a specific server.

Currently, you can only have one published subscription SKU for your app, so you cannot offer both types of subscriptions.

## Configuring App Subscriptions

Once you have an idea what type of subscription you want to offer for your app, you can create and [customize your SKU](#DOCS_MONETIZATION_SKUS/customizing-your-skus) to reflect the premium features that you are adding to your app. This is a good place to outline the benefits your users will receive from having an app subscription.

Once an app has a published SKU, there are 4 ways users will be able to subscribe:

-   Server admins can use the **Integrations** tab within a server's settings menu
-   Bot user profiles include an Upgrade button
-   App Directory profiles offer a Premium tab containing subscription details and an Upgrade option
-   Attempting to run a premium command will display the Upgrade button in the response

If you don't have any premium commands, your users will still be able to upgrade to your premium app via the Integrations settings menu, bot user profiles and App Directory profiles.

## Implementing App Subscriptions

When a user subscribes to your app, there are a few things you will need to implement in your code to check for subscription status and access.

-   Gating your App with Premium Interactions
-   Working with Entitlements
-   Handling Gateway Events for Entitlements

### Gating Premium Interactions

Interactions like [commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS) commonly respond to users with a message or modal response. If you'd like to make a command only available to users with a subscription, you can reply with a `PREMIUM_REQUIRED` interaction response `type: 10`. Users without a subscription will be prompted to upgrade when they attempt to use these commands.

```javascript
return new JsonResponse({
    type: 10, // PREMIUM_REQUIRED interaction response type
    data: {},
});
```

![Interaction Response](monetization-interaction-response.png)

If someone is already subscribed, this command will show the upgrade prompt with a disabled upgrade button. In order to avoid this, your interaction handler should check to see if the user or guild has an active entitlement for your SKU.

Each interaction payload includes an `entitlements` field containing an array of full [entitlement objects](#DOCS_MONETIZATION_ENTITLEMENTS/entitlement-object).

You can use this field to determine if the user or guild is subscribed to your app.

### Keeping Track of Entitlements

When a user purchases a subscription, an entitlement is created. [Entitlements](#DOCS_MONETIZATION_ENTITLEMENTS) represent the user's access to your premium offering. You can keep track of entitlements using Gateway Events and the HTTP API.

#### Entitlement Gateway Events

When users subscribe or renew a subscription with your app, Discord will emit [entitlement gateway events](#DOCS_MONETIZATION_ENTITLEMENTS/gateway-events).

Upon a user's purchase of a SKU, you'll receive an [`ENTITLEMENT_CREATE`](#DOCS_MONETIZATION_ENTITLEMENTS/new-entitlement) event. A successful renewal triggers an [`ENTITLEMENT_UPDATE`](#DOCS_MONETIZATION_ENTITLEMENTS/updated-entitlement) event.

> info
> An [`ENTITLEMENT_DELETE`](#DOCS_MONETIZATION_ENTITLEMENTS/deleted-entitlement) event only occurs when Discord refunds a subscription or removes an entitlement, not when an entitlement expires or is canceled.

#### Entitlement HTTP Endpoints

For apps requiring background processing or not solely reliant on interactions, keeping track of entitlements is essential. You can utilize the [List Entitlements](#DOCS_MONETIZATION_ENTITLEMENTS/list-entitlements) endpoint to list active and expired entitlements. Your app can filter entitlements by a specific user or guild by using the `?user_id=XYZ` or `?guild_Id=XYZ` query params.

For example, you might keep track of our entitlements in a database and check a user's subscription status before performing a cron job or other task.

## Testing Your Implementation

### Using Test Entitlements

You can test your implementation by [creating](#DOCS_MONETIZATION_ENTITLEMENTS/create-test-entitlement) and [deleting](#DOCS_MONETIZATION_ENTITLEMENTS/delete-test-entitlement) test entitlements. These entitlements will allow you to test your premium offering in both a subscribed and unsubscribed state as a user or guild. 

> info
> Test Entitlements do not have a `starts_at` or `ends_at` field as they are valid until they are deleted.

### Testing Payment Flow with Live Entitlements

If you'd like to test the full payment flow for your app, you can do so by interacting with the `Upgrade` button. Any team members associated with your app will automatically see a 100% discount on the price of the subscription, allowing you to purchase without the use of live payment method. 

After checkout, you will have a live subscription that includes a `starts_at` and `ends_at` value. If you cancel this subscription, it will remain an active entitlement until the `ends_at` timestamp. This subscription will renew until cancelled and can be used in testing subscription renewals in your app.

> info
> You can only delete entitlements created using the [create test entitlement](#DOCS_MONETIZATION_ENTITLEMENTS/create-test-entitlement) endpoint. If you need to toggle access to your premium features during your development process, it is best to use test entitlements.

## Receiving Payouts

Once an app has made its first $100 it will become eligible for payout. A review will be conducted and if everything looks good, your team will begin to receive payouts.

For more information, read the [Premium Apps Payouts](https://support-dev.discord.com/hc/articles/17299902720919) Help Center article.