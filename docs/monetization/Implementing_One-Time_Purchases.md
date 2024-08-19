# Implementing One-Time Purchases

One-time purchases enable you to charge your users for premium functionality with in-app items. Before you can add one-time purchases to your app, you must complete the [Monetization Eligibility Checklist](#DOCS_MONETIZATION_OVERVIEW/eligibility-checklist) in your [app's settings](https://discord.com/developers/applications).

Once you've confirmed eligibility for your app and team, you will be able to set up a [SKU](#DOCS_RESOURCES_SKU) (stock-keeping unit) to represent your app's premium offering via subscriptions or items.

---

## Types of One-Time Purchases

When creating items for one-time purchase, you can choose between durable and consumable items:

- **Durable Items**: A one-time purchase that is permanent and is not subject to either renewal or consumption, such as lifetime access to an app's premium features.
- **Consumable Items**: A one-time, non-renewable purchase that provides access, such as a temporary power-up or boost in a game.

---

## How One-Time Purchases Work

#### For Durable SKUs
- When a user purchases your durable SKU, Discord creates an [Entitlement](#DOCS_RESOURCES_ENTITLEMENT) for the purchasing user and that specific [SKU](#DOCS_RESOURCES_SKU). 
- You will receive an `ENTITLEMENT_CREATE` event via the Gateway.
- This entitlement is now available via the `LIST Entitlements` API endpoint.
- This entitlement will be available on `Interaction Payloads` initiated from the entitled user.

#### For Consumable SKUs
- When a user purchases your consumable SKU, Discord creates an [Entitlement](#DOCS_RESOURCES_ENTITLEMENT) for the purchasing user and that specific SKU. 
- You will receive an `ENTITLEMENT_CREATE` event via the Gateway.
- This entitlement is now available via the `LIST Entitlements` API endpoint.
- This entitlement will be available on `Interaction Payloads` initiated from the entitled user or users in a guild (for guild subscriptions).
- The purchasing user is unable to make another purchase of this specific SKU until you consume the entitlement using the Consume Entitlement API endpoint.
- When you receive an `ENTITLEMENT_CREATE` event for a consumable SKU, you should process the item purchase and consume the entitlement as soon as possible.

---

## Implementing One-Time Purchases in Your App

- Working with Entitlements
- Handling Gateway Events for Entitlements
- Handling Entitlements for Consumable SKUs

### Keeping Track of Entitlements

When a user purchases a one-time purchase SKU, an entitlement is created. [Entitlements](#DOCS_RESOURCES_ENTITLEMENT) represent the user's access to your consumable or durable item. You can keep track of entitlements using  Gateway Events and the HTTP API.

#### Entitlement Gateway Events

When users subscribe or renew a subscription with your app, Discord will emit [entitlement gateway events](#DOCS_RESOURCES_ENTITLEMENT/gateway-events).

Upon a user's purchase of a SKU, you'll receive an [`ENTITLEMENT_CREATE`](#DOCS_RESOURCES_ENTITLEMENT/new-entitlement) event.

#### Entitlement HTTP Endpoints

For apps requiring background processing, keeping track of entitlements is essential. You can utilize the [List Entitlements](#DOCS_RESOURCES_ENTITLEMENT/list-entitlements) endpoint to list entitlements. Your app can filter entitlements by a specific user or set of SKUs by using the `?user_id=XYZ` or `?sku_ids=XYZ` query params.

### Handling Durable One-Time Purchases
> danger
> todo: Add a note about how to handle durable one-time purchases

### Handling Consumable One-Time Purchases

When offering consumable items, users can only have one unconsumed entitlement at a time. In order to handle consumable items in your app or game, you should process and store the consumable item in your app and then make a call to the [Consume Entitlement](#DOCS_RESOURCES_ENTITLEMENT/consume-an-entitlement) endpoint so that the user can purchase more of this item in the future.

Consuming the entitlement will update the entitlement to return a true value in the entitlement's `consumed` field. You will need to think through how your app uses consumable items to decide on the best strategy for when to consume these entitlements.

---

## Testing Your One-Time Purchase Implementation

> preview
> We are working on new and improved methods for you to effectively test your monetization features.

> warn
> The method of testing purchases for One-Time Purchases differs from the method for App Subscriptions. **Do NOT use Test Entitlements for One-Time Purchases.**

### Using Application Test Mode

While in Application Test Mode, you can freely make "purchases" of One-Time Purchase SKUs tied to your application. That means you can test buying your consumable and durable items by going through the In-App Purchase flow without any credit card charges.

> info
> You still need to have a valid payment method on file to "purchase" SKUs in Application Test Mode. It just won't be charged at checkout.

To enable it, first make sure you have a payment method on file in User Settings -> Billing and then:

1. Open up the Discord app
2. Click on the Settings cog in the bottom left corner
3. Go to the `Advanced` page under App Settings
4. Toggle "Developer Mode" **on** and "Application Test Mode" **on**, and enter your application ID. You can leave the other settings as-is.
5. Exit user settings

Once you enabled Application Test Mode successfully, you should now see an orange bar across the top of your screen with the name of your app.

You can now navigate to your [Store](#DOCS_MONETIZATION_MANAGING_YOUR_STORE) page and purchase your one-time purchase items without being charged.

The entitlements tied to items that are purchased in Application Test Mode can be identified by entitlements with a `type` value of 4 to represent `TEST_MODE_PURCHASE`.

> warn
> The "Go To SKU" button does not currently work. There will be an update there soon. To purchase your SKU in test mode, go to your Store page.

