# Store

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

If your game has DLC or offers in-app purchases, this manager is for you! The StoreManager allows you to fetch a user's entitlements, as well as being notified when a user is granted an entitlement.

## Data Models

######

###### EntitlementType Enum

| name                | value | description                                                        |
| ------------------- | ----- | ------------------------------------------------------------------ |
| Purchase            | 1     | the user has purchased this entitlement                            |
| PremiumSubscription | 2     | the user has this entitlement for being a Discord Nitro subscriber |
| DeveloperGift       | 3     | the user has this entitlement because it was gifted by a developer |

###### SkuType Enum

| name        | value | description                                    |
| ----------- | ----- | ---------------------------------------------- |
| Application | 1     | SKU is a game                                  |
| DLC         | 2     | SKU is a DLC                                   |
| Consumable  | 3     | SKU is a consumable (in-app purchase)          |
| Bundle      | 4     | SKU is a bundle (comprising the other 3 types) |

## FetchSkus

Fetches the list of SKUs for the connected application.

Returns `Discord.Result` via callback.

###### Parameters

None

###### Example

```cs
storeManager.FetchSkus((result) =>
{
  if (result == Discord.Result.OK)
  {
    Console.WriteLine("Got skus!");
  }
});
```

## CountSkus

Get the number of SKUs returned by `FetchSkus()`.

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

Gets a SKU by it's ID.

Returns `Discord.Sku`.

###### Parameters

| name  | type  | description              |
| ----- | ----- | ------------------------ |
| skuId | Int64 | the ID of the SKU to get |

###### Example

```cs
var sku = storeManager.GetSku(276467180839763999);
Console.WriteLine("Sku is {0}", sku.Name);
```

## GetSkuAt

Gets a SKU by index when iterating over SKUs.

Returns `Discord.Sku`.

###### Parameters

| name  | type  | description               |
| ----- | ----- | ------------------------- |
| index | Int32 | the index at which to get |

###### Example

```cs
for (int i = 0; i < storeManager.CountSkus(); i++)
{
  var sku = storeManager.GetSkuAt(i);
  Console.WriteLine("Sku is {0}", sku.Name);
}
```

## FetchEntitlements

Fetches a list of entitlements to which the user is entitled. Applications, DLC, and Bundles will always be returned. Consumables will be returned until they are consumed by the application via the endpoint.

Returns `Discord.Result` via callback.

###### Parameters

None

###### Example

```cs
storeManager.FetchEntitlements((result) =>
{
  if (result == Discord.Result.OK)
  {
    Console.WriteLine("Got entitlements!");
  }
});
```

## CountEntitlements

Get the number of entitlements returned by `FetchEntitlements()`.

Returns `Int32`.

###### Parameters

None

###### Example

```cs
for (int i = 0; i < storeManager.CountEntitlements(); i++)
{
  var entitlement = storeManager.GetEntitlementAt(i);
  Console.WriteLine("Entitlement is {0}", entitlement.Name);
}
```

## GetEntitlement

Gets an entitlement by it's ID.

Returns `Discord.Entitlement`.

###### Parameters

| name          | type  | description                      |
| ------------- | ----- | -------------------------------- |
| entitlementId | Int64 | the ID of the entitlement to get |

###### Example

```cs
var entitlement = storeManager.GetEntitlement(276467180839763999);
Console.WriteLine("Entitlement is {0}", entitlement.Name);
```

## GetEntitlementAt

Gets an entitlement by index when iterating over a user's entitlements.

Returns `Discord.Entitlement`.

###### Parameters

| name  | type  | description               |
| ----- | ----- | ------------------------- |
| index | Int32 | the index at which to get |

###### Example

```cs
for (int i = 0; i < storeManager.CountEntitlements(); i++)
{
  var entitlement = storeManager.GetEntitlementAt(i);
  Console.WriteLine("Entitlement is {0}", entitlement.Name);
}
```

## HasSkuEntitlement

Returns whether or not the user is entitled to the given SKU ID.

Returns `bool`.

###### Parameters

| name  | type  | description                |
| ----- | ----- | -------------------------- |
| skuId | Int64 | the ID of the SKU to check |

###### Example

```cs
if (storeManager.HasSkuEntitlement(276467180839763999))
{
  Console.WriteLine("User has entitlement to this SKU");
}
else
{
  Console.WriteLine("How are you even running this right now...");
}
```

## StartPurchase

Opens the overlay to begin the in-app purchase dialogue for the given SKU ID. The user must have the overlay enabled, which you can check first with `overlayManager.IsEnabled()`.

Returns `Discord.Result` via callback.

###### Parameters

| name  | type  | description                           |
| ----- | ----- | ------------------------------------- |
| skuId | Int64 | the ID of the SKU to begin purchasing |

###### Example

```cs
if (overlayManager.IsEnabled())
{
  storeManager.StartPurchase(276467180839763999, (result) =>
  {
    if (result == Discord.Result.OK)
    {
      Console.WriteLine("Overlay is open and user is in the flow!");
    }
  });
}
else
{
  Console.WriteLine("Please enable the Discord overlay to complete this transaction.");
}
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

## Consume SKU % POST /store/applications/{application.id#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up}/entitlements/{entitlement.id#DOCS_GAME_SDK_STORE/data-models-entitlement-struct}/consume

> warn
> This is an HTTP request, and should be handled by your game server, rather than a client.

Marks a given entitlement for the user as consumed, meaning it will no longer be returned in an entitlements check.

###### JSON Body Parameters

| name | type | description |
| ---- | ---- | ----------- |


## Checking DLC Entitlements

If your game has DLC, and a user has purchased that DLC, you may want to check what they should have access to when the game launches. DLC entitlements will always be returned in a `FetchEntitlements()` call, so your game can check on each startup whether or not a user should have access to a certain new zone, raid, map, etc. based on their entitlements for DLC.

Entitlements to DLCs are intended to be for SKUs that will download additional data onto a user's hard drive, like an expansion pack for a game.

## Checking Consumable Entitlements

The `Discord.SkuType.Consumable` type is used for entitlements that may be "consumed" by a game's own server infrastructure. That is to say that if you have in-app purchases like gem bundles, skins, etc., they will be a `Consumable` SKU type.

What that means is that your game is expected to consume these entitlements and then tell Discord that they've been consumed. Your game should handle these granted consumable entitlements in whatever manner is appropriate: incrementing the coins a player has, flipping the flag for a certain skin, etc.

Entitlements to consumable SKUs are intended to be for SKUs that do not download additional content to a user's machine; rather, they signal to your game's server/service/database that the user should get something new and should be incremented as such.
