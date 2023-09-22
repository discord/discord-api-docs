# App Subscriptions

App Subscriptions are **TODO TODO TODO**. Before you can add an app subscription to your app, you must complete the [Monetization Eligibility Checklist](#DOCS_PREMIUM_APPS_OVERVIEW/eligibility-checklist)

Once you've confirmed eligibility for your app and team, you will be able to set up a [SKU](#DOCS_PREMIUM_APPS_SKUS) to represent your app's premium offering.

## Types of Subscriptions

When creating subscriptions, you will need to choose between user or guild subscriptions:

-   **User Subscriptions**: Offers premium features to an individual user across any server where your app installed.
-   **Guild Subscriptions**: Provides premium benefits to all members within a specific server.

Currently, you can only have one published subscription SKU for your app, so you cannot offer both types of subscriptions.

## Requiring a Subscription for Specific Application Commands

Let's pretend we have an app called RSSNelly.

The users of RSSNelly have been wanting the ability to subscribe to RSS feeds. This feels like a great premium feature for your app. Delivering this type of feature to your users will require you to build a backend to handle RSS feeds and deliver them to the appropriate guild or user.

We'll start by registering a new `/subscribe` subcommand within our existing `/rssnelly` command:

```javascript
{
    "name": "rssnelly",
    "description": "RSS feed monitor",
    "options": [
        {
            "name": "subscribe",
            "description": "Subscribe to an RSS feed",
            "type": 1
        }
    ]
}
```

Once registered, users without a subscription can be prompted to upgrade when they attempt to use this command.

```javascript
     case "subscribe":
        return new JsonResponse({
            type: 10,
            data: {},
        });
```

### Checking Subscription Status with Entitlements

If someone is already subscribed, this command will show the upgrade prompt with a disabled upgrade button. In order to avoid this, your interaction handler should check to see if the user or guild has an active entitlement for your SKU.

You can do this by looking at the interaction payload. Each interaction payload now includes `entitlement_sku_ids` as an array of SKU Ids that the user or guild has access to as well as `entitlements`, as an array of their full entitlement objects.

You can use these fields to determine if the user or guild has access to your premium offering.
We know the id for our subscription SKU is `1088510058284990888` so we can now check if it is included in the interaction's `entitlement_sku_ids` field.

```javascript
case "subscribe":
    if (!interaction.entitlement_sku_ids.includes("1088510058284990888")) {
        return new JsonResponse({
            type: 10, // PREMIUM_REQUIRED interaction response type
            data: {},
        });
    }

    // PERFORM THE REST OF YOUR ACTION HERE
    performSubscribeCommand();
```

With the `/rssnelly subscribe` command set up, you can now test it in your server.

## Keeping Track of Entitlements

### Gateway Events for Entitlements

Upon a user's purchase of a sku, you'll receive an [`ENTITLEMENT_CREATE`](#DOCS_PREMIUM_APPS_ENTITLEMENTS/new-entitlement) event via the gateway. A successful renewal triggers an [`ENTITLEMENT_UPDATE`](#DOCS_PREMIUM_APPS_ENTITLEMENTS/updated-entitlement) event.

> info
> **Note**: An [`ENTITLEMENT_DELETE`](#DOCS_PREMIUM_APPS_ENTITLEMENTS/deleted-entitlement) event only occurs when Discord refunds a subscription or removes an entitlement, not when an entitlement expires or is canceled.

### HTTP Endpoint for Entitlements

For apps requiring background processing or not solely reliant on interactions, keeping track of entitlements is essential. You can utilize the [List Entitlements](#DOCS_PREMIUM_APPS_ENTITLEMENTS/list-entitlements) endpoint to list active and expired entitlements. Your app can filter entitlements by a specific user or guild by using the `?user_id=XYZ` or `?guild_Id=XYZ` query params.

For our theoretical RSS app, we would keep track of our entitlements in a database and check a user's subscription status before publishing an update from an RSS feed to Discord.
