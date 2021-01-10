# Store

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

If your game has DLC or offers in-app purchases, this manager is for you! The Store Manager allows you to fetch a users' entitlements, as well as being notified when a user is granted an entitlement from a purchase flow for your game.

## Application Test Mode

With this new Store Manager comes a new fun toggle in the Discord app itself: Application Test Mode! While in Application Test Mode, you can freely make "purchases" of SKUs tied to your application. That means you can test buying your game, buying DLC, or going through an IAP flow without any credit card charges.

> info
> You still need to have a valid payment method on file to "purchase" SKUs in Application Test Mode; it just won't be charged at checkout.

To enable it, first make sure you have a payment method on file in User Settings -> Billing. Then:

1.  Open up the Discord app
2.  Click on the settings cog in the bottom left corner
3.  Go to Appearance -> allll the way at the bottom
4.  Toggle "Developer Mode" **on** and "Application Test Mode" **on**, and enter your application ID
5.  Exit user settings

You should now see an orange bar across the top of your screen; this means it worked! The dropdown in the orange bar will show you all the available SKUs for that application; you can select one of them to go to its store page. You can also view your Library and see all the branches of your game automagically there waiting for you!

If for some reason the "Install" button is greyed out, please check the following:

1.  Do you have a `LIVE_BUILD_ID` on that branch for this SKU? Check with `dispatch branch list <application_id>`.
2.  Do you have a price tier set for this SKU? If not, pick one!

Once those two conditions are met, you should be good to go! Entitlements "purchased" with this mode enabled can be revoked with the `DELETE /entitlements` HTTP endpoint, documented below.

## Checking DLC Entitlements

If your game has DLC, and a user has purchased that DLC, you may want to check what they should have access to when the game launches. DLC entitlements will always be returned in a `FetchEntitlements()` call, so your game can check on each startup whether or not a user should have access to a certain new zone, raid, map, etc. based on their entitlements for DLC.

## Checking Consumable Entitlements

The `Discord.SkuType.Consumable` type is used for entitlements that may be "consumed" by a game's own server infrastructure. That is to say that if you have in-app purchases like gem bundles, skins, etc., they will be a `Consumable` SKU type.

What that means is that your game is expected to "consume" these entitlements by doing something on your game server—giving the player a level, more coins, a skin, etc.—and then telling Discord that's been done by calling the `POST /entitlements/<id>/consume`, documented below. Then, Discord will mark that entitlement as `consumed` (the `consumed` field in the returned object will be set to `true`).

Entitlements to consumable SKUs are intended to signal your game's server/service/database that the user should get something in-game and that the entitlement should be invalidated afterward.

The same consumable SKU _can_ be purchased multiple times, but we have some safeguards in place to protect against possible abuse. If you purchase a consumable SKU, you cannot purchase a second one until the first one has been consumed; in the context of normal IAP transactions, your game will be auto-consuming entitlements as soon as they're created. If some malicious folks are somehow able to generate entitlements to your SKUs, they will not be able to consume them without your token, so you'll be safe!

Non-consumable SKUs can only be purchased once.

## Data Models

###### SKU Struct

| name  | type     | description              |
| ----- | -------- | ------------------------ |
| Id    | Int64    | the unique ID of the SKU |
| Type  | SkuType  | what sort of SKU it is   |
| Name  | string   | the name of the SKU      |
| Price | SkuPrice | the price of the SKU     |

###### SkuType Enum

| name        | value | description                                    |
| ----------- | ----- | ---------------------------------------------- |
| Application | 1     | SKU is a game                                  |
| DLC         | 2     | SKU is a DLC                                   |
| Consumable  | 3     | SKU is a consumable (in-app purchase)          |
| Bundle      | 4     | SKU is a bundle (comprising the other three types) |

###### SkuPrice Struct

| name     | type   | description                       |
| -------- | ------ | --------------------------------- |
| Amount   | UInt32 | the amount of money the SKU costs |
| Currency | string | the currency the amount is in     |

###### Entitlement Struct

| name  | type            | description                                     |
| ----- | --------------- | ----------------------------------------------- |
| Id    | Int64           | the unique ID of the entitlement                |
| Type  | EntitlementType | the kind of entitlement it is                   |
| SkuId | Int64           | the ID of the SKU to which the user is entitled |

###### EntitlementType Enum

| name                | value | description                                                    |
| ------------------- | ----- | -------------------------------------------------------------- |
| Purchase            | 1     | entitlement was purchased                                      |
| PremiumSubscription | 2     | entitlement for a Discord Nitro subscription                   |
| DeveloperGift       | 3     | entitlement was gifted by a developer                          |
| TestModePurchase    | 4     | entitlement was purchased by a dev in application test mode    |
| FreePurchase        | 5     | entitlement was granted when the SKU was free                  |
| UserGift            | 6     | entitlement was gifted by another user                         |
| PremiumPurchase     | 7     | entitlement was claimed by the user for free as a Nitro Subscriber |

## FetchSkus

Fetches the list of SKUs for the connected application, readying them for iteration.

> warn
> Only SKUs that have a price set will be fetched. If you aren't seeing any SKUs being returned, make sure they have a price set!

Returns `Discord.Result` via callback.

###### Parameters

None

###### Example

```cs
storeManager.FetchSkus((result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Got skus! Now I can iterate over them!");
  }
});
```

## CountSkus

Get the number of SKUs readied by `FetchSkus()`.

Returns `Int32`.

###### Parameters

None

###### Example

```cs
for (int i = 0; i < storeManager.CountSkus(); i++)
{
  var sku = storeManager.GetSkuAt(i);
  Console.WriteLine("Sku is {0}", sku.Name);
}
```

## GetSku

Gets an SKU by its ID. You must call `FetchSkus()` first before being able to access SKUs in this way.

Returns `Discord.Sku`.

###### Parameters

| name  | type  | description              |
| ----- | ----- | ------------------------ |
| skuId | Int64 | the ID of the SKU to get |

###### Example

```cs
storeManager.FetchSkus((_) => {});
var sku = storeManager.GetSku(276467180839763999);
Console.WriteLine("Sku is {0}", sku.Name);
```

## GetSkuAt

Gets an SKU by index when iterating over SKUs. You must call `FetchSkus()` first before being able to access SKUs in this way.

Returns `Discord.Sku`.

###### Parameters

| name  | type  | description               |
| ----- | ----- | ------------------------- |
| index | Int32 | the index at which to get |

###### Example

```cs
storeManager.FetchSkus((result) =>
{
  for (int i = 0; i < storeManager.CountSkus(); i++)
  {
    var sku = storeManager.GetSkuAt(i);
    Console.WriteLine("Sku is {0}", sku.Name);
}
});
```

## FetchEntitlements

Fetches a list of entitlements to which the user is entitled. Applications, DLC, and Bundles will always be returned. Consumables will be returned until they are consumed by the application via the HTTP endpoint.

Returns `Discord.Result` via callback.

###### Parameters

None

###### Example

```cs
storeManager.FetchEntitlements((result) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Got entitlements!");
  }
});
```

## CountEntitlements

Get the number of entitlements readied by `FetchEntitlements()`. You must call `FetchEntitlements()` first before being able to access SKUs in this way.

Returns `Int32`.

###### Parameters

None

###### Example

```cs
storeManager.FetchEntitlements((result) =>
{
  for (int i = 0; i < storeManager.CountEntitlements(); i++)
  {
    var entitlement = storeManager.GetEntitlementAt(i);
    Console.WriteLine("Entitlement is {0}", entitlement.Name);
  }
});
```

## GetEntitlement

Gets an entitlement by its id. You must call `FetchEntitlements()` first before being able to access SKUs in this way.

Returns `Discord.Entitlement`.

###### Parameters

| name          | type  | description                      |
| ------------- | ----- | -------------------------------- |
| entitlementId | Int64 | the ID of the entitlement to get |

###### Example

```cs
storeManager.FetchEntitlements((result) =>
{
  var entitlement = storeManager.GetEntitlement(276467180839763999);
  Console.WriteLine("Entitlement is {0}", entitlement.Name);
});
```

## GetEntitlementAt

Gets an entitlement by index when iterating over a user's entitlements. You must call `FetchEntitlements()` first before being able to access SKUs in this way.

Returns `Discord.Entitlement`.

###### Parameters

| name  | type  | description               |
| ----- | ----- | ------------------------- |
| index | Int32 | the index at which to get |

###### Example

```cs
storeManager.FetchEntitlements((result) =>
{
  for (int i = 0; i < storeManager.CountEntitlements(); i++)
  {
    var entitlement = storeManager.GetEntitlementAt(i);
    Console.WriteLine("Entitlement is {0}", entitlement.Name);
  }
});
```

## HasSkuEntitlement

Returns whether or not the user is entitled to the given SKU ID. You must call `FetchEntitlements()` first before being able to access SKUs in this way.

Returns `bool`.

###### Parameters

| name  | type  | description                |
| ----- | ----- | -------------------------- |
| skuId | Int64 | the ID of the SKU to check |

###### Example

```cs
storeManager.FetchEntitlements((result) =>
{
  if (storeManager.HasSkuEntitlement(276467180839763999))
  {
    Console.WriteLine("User has entitlement to this SKU");
  }
  else
  {
    Console.WriteLine("How are you even running this right now...");
  }
});
```

## StartPurchase

Opens the overlay to begin the in-app purchase dialogue for the given SKU ID. You must call `FetchSkus()` first before being able to access SKUs in this way. If the user has enabled the overlay for your game, a purchase modal will appear in the overlay. Otherwise, the Discord client will be auto-focused with a purchase modal.

Returns `Discord.Result` via callback.

###### Parameters

| name  | type  | description                           |
| ----- | ----- | ------------------------------------- |
| skuId | Int64 | the ID of the SKU to begin purchasing |

###### Example

```cs
storeManager.FetchSkus((result) =>
{
  storeManager.StartPurchase(276467180839763999, (result) =>
  {
    if (result == Discord.Result.Ok)
    {
      Console.WriteLine("User is in the flow!");
    }
  });
});
```

## OnEntitlementCreate

Fires when the connected user receives a new entitlement, either through purchase or through a developer grant.

###### Parameters

| name        | type                | description                               |
| ----------- | ------------------- | ----------------------------------------- |
| entitlement | Discord.Entitlement | the entitlement the user has been granted |

## OnEntitlementDelete

Fires when the connected user loses an entitlement, either by expiration, revocation, or consumption in the case of consumable entitlements.

###### Parameters

| name        | type                | description                       |
| ----------- | ------------------- | --------------------------------- |
| entitlement | Discord.Entitlement | the entitlement the user has lost |

## HTTP APIs

The following are HTTP requests and should be handled by your game server rather than a client. They require a token for an authorization header. This token should be the "Bot token" of your application. To get this token, go to your application in the Dev Portal. In the left sidebar, click the `Bot` navigation item. You should then click the `Add Bot` button.

After that, you can copy the token on this page and use it in your HTTP requests. The format for the authorization header should be `Authorization: Bot <token>`.

Note that parameters with a `?` after the name denote optional fields. Parameters with a `?` before their type denote nullable fields.

## HTTP-Specific Data Models

###### Limited Payment Data Object

| name          | type   | description                          |
| ------------- | ------ | ------------------------------------ |
| id            | string | unique ID of the payment             |
| currency      | string | the currency the payment was made in |
| amount        | int    | the amount paid                      |
| tax           | int    | the amount of tax                    |
| tax_inclusive | bool   | whether the amount is tax-inclusive  |

## Get Entitlements % GET /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/entitlements

Gets entitlements for a given user. You can use this on your game backend to check the entitlements of an arbitrary user, or perhaps in an administrative panel for your support team.

> danger
> The previous behavior on this endpoint was that not specifying a user_id or limit would return an unlimited amount of entitlements. That behavior is now deprecated and will be removed on March 1, 2019.

###### Query Parameters

| name           | type                              | description                                                                                                                    |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| user_id?       | snowflake                         | the user id to look up entitlements for                                                                                        |
| sku_ids?       | comma-delimited set of snowflakes | (optional) the list SKU ids to check entitlements for                                                                          |
| with_payments? | bool                              | returns [limited payment data](#DOCS_GAME_SDK_STORE/httpspecific-data-models-limited-payment-data-object) for each entitlement |
| before?        | snowflake                         | retrieve entitlements before this time                                                                                         |
| after?         | snowflake                         | retrieve entitlements after this time                                                                                          |
| limit?         | int                               | number of entitlements to return, 1-100, default 100                                                                           |

###### Example

```
curl https://discord.com/api/v6/applications/461618159171141643/entitlements?user_id=53908232506183680&sku_ids=53908232599983680&with_payments=true&limit=1 \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns

{
  [
    {
      "user_id": "53908232506183680",
      "sku_id": "53908232599983680",
      "application_id": "461618159171141643",
      "id": "53908232506183999",
      "type": 1,
      "payment": {
        "id": "538491076055400999",
        "currency": "usd",
        "amount": 999,
        "tax": 0,
        "tax_inclusive": false
      }
    }
  ]
}
```

## Get Entitlement % GET /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/entitlements/{entitlement.id#DOCS_GAME_SDK_STORE/data-models-entitlement-struct}

Fetch an entitlement by its ID. This may be useful in confirming that a user has a given entitlement that another call or the SDK says they do.

###### Query Parameters

| name          | type | description                                                                                                                    |
| ------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------ |
| with_payment? | bool | returns [limited payment data](#DOCS_GAME_SDK_STORE/httpspecific-data-models-limited-payment-data-object) for each entitlement |

###### Example

```
curl https://discord.com/api/v6/applications/461618159171141643/entitlements/53908232506183999?with_payment=true \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns

{
  "user_id": "53908232506183680",
  "sku_id": "53908232599983680",
  "application_id": "461618159171141643",
  "id": "53908232506183999",
  "type": 3,
  "payment": {
    "id": "538491076055400999",
    "currency": "usd",
    "amount": 999,
    "tax": 0,
    "tax_inclusive": false
  }
}
```

## Get SKUs % GET /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/skus

Get all SKUs for an application.

###### Example

```
curl https://discord.com/api/v6/applications/461618159171141643/skus \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns

{
  [
    {
      "id": "53908232599983680",
      "type": 1,
      "dependent_sku_id": null,
      "application_id": "461618159171141643",
      "manifest_labels": ["461618159171111111"],
      "name": "My Awesome Test Game",
      "access_type": 1,
      "features": [1, 2, 3],
      "system_requirements": {},
      "content_ratings": {},
      "release_date": "1999-01-01",
      "legal_notice": {},
      "price_tier": 1099,
      "price": {},
      "premium": false,
      "locales": ["en-US"],
      "bundled_skus": null
    }
  ]
}
```

## Consume SKU % POST /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/entitlements/{entitlement.id#DOCS_GAME_SDK_STORE/data-models-entitlement-struct}/consume

Marks a given entitlement for the user as consumed, meaning it will no longer be returned in an entitlements check. **Ensure the user was granted whatever items the entitlement was for before consuming it!**

###### Example

```
curl -X POST https://discord.com/api/v6/applications/461618159171141643/entitlements/53908232506183999/consume \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns 204 No Content
```

## Delete Test Entitlement % DELETE /applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/entitlements/{entitlement.id#DOCS_GAME_SDK_STORE/data-models-entitlement-struct}

Deletes a test entitlement for an application. You can only delete entitlements that were "purchased" in developer test mode; these are entitlements of `type == TestModePurchase`. You cannot use this route to delete arbitrary entitlements that users actually purchased.

###### Example

```
curl -X DELETE https://discord.com/api/v6/applications/461618159171141643/entitlements/53908232506183999 \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns 204 No Content
```

## Create Purchase Discount % PUT /store/skus/{sku.id#DOCS_GAME_SDK_STORE/data-models-sku-struct}/discounts/{user.id#DOCS_RESOURCES_USER/user-object}

Creates a discount for the given user on their next purchase of the given SKU. You should call this endpoint from your backend server just before calling [StartPurchase](#DOCS_GAME_SDK_STORE/start-purchase) for the SKU you wish to discount. The user will then see a discounted price for that SKU at the time of payment. The discount is automatically consumed after a successful purchase or if the TTL expires.

###### Parameters

| name        | type | description                                                                            |
| ----------- | ---- | -------------------------------------------------------------------------------------- |
| percent_off | int  | the percentage to discount - max of 100, min of 1                                      |
| ttl?        | int  | the time to live for the discount, in seconds - max of 3600, min of 60, default of 600 |

###### Example

```
curl -X PUT https://discord.com/api/v6/store/skus/461618229171141643/discounts/53908232522183999 \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json" \
-H "Content-type: application/json" \
-d '{"percent_off": 10, "ttl": 600}'

// Returns 204 No Content
```

## Delete Purchase Discount % DELETE /store/skus/{sku.id#DOCS_GAME_SDK_STORE/data-models-sku-struct}/discounts/{user.id#DOCS_RESOURCES_USER/user-object}

Deletes the currently active discount on the given SKU for the given user. You **do not need** to call this after a user has made a discounted purchase; successful discounted purchases will automatically remove the discount for that user for subsequent purchases.

###### Example

```
curl -X DELETE https://discord.com/api/v6/store/skus/461618229171141643/discounts/53908232522183999 \
-H "Authorization: Bearer <token>" \
-H "Accept: application/json"

// Returns 204 No Content
```
