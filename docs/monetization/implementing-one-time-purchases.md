# Implementing One-Time Purchases

One-time purchases enable you to charge your users for premium functionality with in-app items. 

- Before you can add one-time purchases to your app, you must [Enable Monetization](/docs/monetization/enabling-monetization) for your app.
- Once you've confirmed eligibility for your app and team, you will be able to set up a [SKU](/docs/resources/sku) (stock-keeping unit) to represent your one-time purchases.

---

## Types of One-Time Purchases

When creating items for one-time purchase, you can choose between durable and consumable items:

- **Durable Items**: A one-time purchase that is permanent and is not subject to either renewal or consumption, such as lifetime access to an app's premium features.
- **Consumable Items**: A one-time, non-renewable purchase that provides access, such as a temporary power-up or boost in a game.

---

## How One-Time Purchases Work

#### For Durable SKUs
- When a user purchases your durable SKU, Discord creates an [Entitlement](/docs/resources/entitlement) for the purchasing user and that specific [SKU](/docs/resources/sku). 
- You will receive an `ENTITLEMENT_CREATE` event via the Gateway.
- This entitlement is now available via the `LIST Entitlements` API endpoint.
- This entitlement will be available on `Interaction Payloads` initiated from the entitled user.

#### For Consumable SKUs
- When a user purchases your consumable SKU, Discord creates an [Entitlement](/docs/resources/entitlement) for the purchasing user and that specific SKU. 
- You will receive an `ENTITLEMENT_CREATE` event via the Gateway.
- This entitlement is now available via the `LIST Entitlements` API endpoint.
- This entitlement will be available on `Interaction Payloads` initiated from the entitled user or users in a guild (for guild subscriptions).
- Users cannot repurchase this SKU until you consume the entitlement using the [Consume Entitlement API](/docs/resources/entitlement#consume-an-entitlement) endpoint.
  - In [Test Mode](/docs/monetization/implementing-one-time-purchases#using-application-test-mode), repeated purchases are permitted without consumption for developer convenience.
- When you receive an `ENTITLEMENT_CREATE` event for a consumable SKU, you should process the item purchase in your app and consume the entitlement as soon as possible.

---

## Working with Entitlements

When a user purchases a one-time purchase SKU, an entitlement is created. [Entitlements](/docs/resources/entitlement) represent the user's access to your consumable or durable item.

Depending on your app's features, you can use a combination of [Gateway events](/docs/events/gateway-events#entitlements), the [Entitlement HTTP API](/docs/resources/entitlement), and [interaction payloads](/docs/interactions/receiving-and-responding) to keep track of entitlements to users who have purchased items in your app.

### Accessing Entitlements with Gateway Events

When a user purchases a SKU, Discord will emit an [`ENTITLEMENT_CREATE`](/docs/events/gateway-events#entitlements) event. This event will contain the entitlement object that represents the user's access to the SKU. You can use this event to keep track of the user's entitlements in near-time. For One-Time Purchases, you may also receive an `ENTITLEMENT_DELETE` event if the user's entitlement is revoked.

### Accessing Entitlements with the HTTP API

Entitlements are available via the [List Entitlements](/docs/resources/entitlement#list-entitlements) endpoint. You can filter entitlements by a specific user or set of SKUs by using the `?user_id=XYZ` or `?sku_ids=XYZ` query parameters.

### Accessing Entitlements on Interaction Payloads

Entitlements are also available on the `Interaction Payload` when a user interacts with your app. You can find the entitlements on the `entitlements` field of the `Interaction Payload` when [receiving and responding to interactions](/docs/interactions/receiving-and-responding).

### Accessing Entitlements with the Embedded App SDK

When using the [Embedded App SDK](/docs/developer-tools/embedded-app-sdk) to build an [Activity](/docs/activities/overview), you can also [access a user's entitlements](/docs/developer-tools/embedded-app-sdk#getentitlements). Check out the [Implementing In-App Purchases for Activities](/docs/monetization/implementing-iap-for-activities) guide to learn more about monetization with the Embedded App SDK.

Depending on your app's needs, you can use a combination of these methods to keep track of user entitlements.

---

## One-Time Purchase Considerations

When implementing one-time purchases, you should consider the following:

### For Durable One-Time Purchases

When offering durable items, users will have access to the SKU indefinitely. Durable items can't be consumed, so you don't need to worry about the user losing access to the item except in the case of a refund.

### For Consumable One-Time Purchases
When offering consumable items, users can only have one unconsumed entitlement at a time. To handle consumable items in your app or game, you should process and store the consumable item in your app and then make a call to the [Consume Entitlement](/docs/resources/entitlement#consume-an-entitlement) endpoint so that the user can purchase more of this item in the future.

Consuming the entitlement will update the entitlement to return a true value in the entitlement's `consumed` field. You will need to think through how your app keeps track of consumable items to decide on the best strategy for when to consume these entitlements and store the state of the consumable item and quantity in your app.

---

## Prompting Users to Purchase an Item

### Responding with a Premium Button

[Responding with a premium button](/docs/monetization/managing-skus#responding-with-a-premium-button) gives you the ability to prompt users to subscribe to your app when they attempt to use a premium feature without a subscription.

You can do this by sending a message with a [button](/docs/components/reference#button) with a [premium style](/docs/components/reference#button-button-styles) and a `sku_id` that allows the user to upgrade to your premium offering.  

### Starting a Purchase from an Activity

If you are using the [Embedded App SDK](/docs/developer-tools/embedded-app-sdk) to build an [Activity](/docs/activities/overview), you can also launch the purchase flow for a specific SKU using the SDK. Check out the [Implementing In-App Purchases for Activities](/docs/monetization/implementing-iap-for-activities) guide to learn more about monetization with the Embedded App SDK.

---

## Testing Your One-Time Purchase Implementation

:::warn
The method of testing purchases for One-Time Purchases differs from the method for App Subscriptions. **Do NOT use Test Entitlements for One-Time Purchases.**
:::

### Using Application Test Mode

While in Application Test Mode, you can freely make "purchases" of One-Time Purchase SKUs tied to your application. That means you can test buying your consumable and durable items by going through the In-App Purchase flow without any credit card charges.

:::info
You still need to have a valid payment method on file to "purchase" SKUs in Application Test Mode. It just won't be charged at checkout.
:::

To enable it, first, make sure you have a payment method on file in `User Settings -> Billing` and then:

1. Open up the Discord app
2. Click on the Settings cog in the bottom left corner
3. Go to the `Advanced` page under App Settings
4. Toggle "Developer Mode" **on** and "Application Test Mode" **on**, and enter your application ID. You can leave the other settings as-is.
5. Exit user settings

Once you enabled Application Test Mode successfully, you should see an orange bar across the top of your screen with the name of your app.

You can now navigate to your Store page and purchase your one-time purchase items without being charged.

The entitlements tied to items purchased in Application Test Mode can be identified by entitlements with a `type` value of 4 to represent `TEST_MODE_PURCHASE`.

:::warn
The "Go To SKU" button does not currently work. To purchase your SKU in test mode, go to your Store page.
:::

