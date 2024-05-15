# Managing Your Store

Developers now have the ability to set up a Store page in the Developer Portal. To set up your Premium App's Store view take the following steps:

- Create a SKU 
- Add a SKU image and benefits
- Implement the SKU into your app 
- Publish a SKU to your store view with the click of a button.

## Adding SKUs to your Store

Once you've created SKUs for an [App Subscription](#DOCS_MONETIZATION_APP_SUBSCRIPTIONS) or [One-Time Purchase](#DOCS_MONETIZATION_ONE-TIME_PURCHASES), you can add those SKUs to your Store to make them available for purchase by your users.

### Manage SKUs
While creating and editing SKUs in your [app's settings](https://discord.com/developers/applications) on the `Monetization -> Manage SKUs` tab, you have a few options for managing your SKUs visibility and publishing to your users:

- **Add to store**: Will add a published SKU to your Store
- **Remove from store**: Will remove a published SKU from your Store, keeping it published to the API
- **Publish SKU**: Will let you publish a new SKU and make it **Available via Store & API** or **Available via API Only**.
- **Unpublish SKU**: Will unpublish the SKU from both the Store and the API. Users who already have this SKU will still be entitled to the SKU even if it becomes unpublished. You can republish a SKU at any time.

> preview
> We will have more updates on publishing SKUs to the API vs the Store as we release more monetization features.

### Manage Store
Under the `Monetization -> Manage Store` tab, you can organize your SKUs for both subscriptions and items. You can add new or existing SKUs or update the order your SKUs appear to your users in the Store.

> info
> Currently you can only have one Subscription published on your app and in your Store.

## User Access for Your Store

Users can now access an App's store page from the Bot User's profile in a server. This allows users to view an available subscription and one-time purchases, select a subscription to view its perks, benefits and details, and make a purchase directly from an App's Store page.

![Accessing the store as a user](botuser-profile.png)

### Viewing Subscriptions in Your Store

Currently, you can only have one active App Subscription SKU for your app. If your app has either a user or guild subscription, you can add it to your Store for users to purchase.

> preview
> Support for multiple subscription SKUs is coming soon.

![Subscriptions in your Store View](premium-subscriptions.png)

### Viewing Items in Your Store

As you build out your One-Time Purchase SKUs, you can add as many durable and consumable items to your Store as needed by your app.

![Items in your Store View](premium-items.png)