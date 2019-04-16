# Users

This manager helps retrieve basic user information for any user on Discord.

## Data Models

###### User Struct

| name          | type   | description                   |
| ------------- | ------ | ----------------------------- |
| Id            | Int64  | the user's id                 |
| Username      | string | their name                    |
| Discriminator | string | the user's unique discrim     |
| Avatar        | string | the hash of the user's avatar |
| Bot           | bool   | if the user is a bot user     |

###### UserFlag Enum

| name            | value | description                  |
| --------------- | ----- | ---------------------------- |
| Partner         | 2     | Discord Partner              |
| HypeSquadEvents | 4     | HypeSquad Events participant |
| HypeSquadHouse1 | 64    | House Bravery                |
| HypeSquadHouse2 | 128   | House Brilliance             |
| HypeSquadHouse3 | 256   | House Balance                |

###### PremiumType Enum

| name  | value | description              |
| ----- | ----- | ------------------------ |
| None  | 0     | Not a Nitro subscriber   |
| Tier1 | 1     | Nitro Classic subscriber |
| Tier2 | 2     | Nitro subscriber         |

## GetCurrentUser

Fetch information about the currently connected user account. If you're interested in getting more detailed information about a user—for example, their HypeSquad house, or if they have Nitro—check out our [GetCurrentUser](#DOCS_RESROUCES_USER/get-current-user) API endpoint. You'll want to call this with an authorization header of `Bearer <token>`, where `<token>` is the token retreived from the SDK function [GetOAuth2Token](#DOCS_GAME_SDK_APPLICATIONS/getoauth2token).

Returns a `User`.

###### Parameters

None

###### Example

```cs
var user = userManager.GetCurrentUser();
Console.WriteLine("Connected to user {0}", user.Id);
```

## GetUser

Get user information for a given id.

Returns a `Discord.Result` and `User` via callback.

###### Parameters

| name   | type  | description                 |
| ------ | ----- | --------------------------- |
| userId | Int64 | the id of the user to fetch |

###### Example

```cs
userManager.GetUser(userId, (result, user) =>
{
  if (result == Discord.Result.OK)
  {
    Console.WriteLine("User {0} is {1}", user.Id, user.Username);
  }
});
```

## GetCurrentUserPremiumType

Get the [PremiumType](#DOCS_GAME_SDK_USER/data-models-premiumtype-enum) for the currently connected user.

Returns `PremiumType`.

###### Parameters

None

###### Example

```cs
var userManager = discord.GetUserManager();
var premiumType = userManager.GetCurrentUserPremiumType();
switch (premiumType)
{
  case PremiumType.None:
    Console.WriteLine("User is not a Nitro subscriber");

  case PremiumType.Tier1:
    Console.WriteLine("User has Nitro Classic");

  case PremiumType.Tier2:
    Console.WriteLine("User has Nitro");

  default:
    return;
}
```

## CurrentUserHasFlag

See whether or not the current user has a certain [UserFlag](#DOCS_GAME_SDK_USER/data-models-userflag-enum) on their account.

Returns `bool`.

###### Parameters

| name | type                                                      | description                             |
| ---- | --------------------------------------------------------- | --------------------------------------- |
| flag | [UserFlag](#DOCS_GAME_SDK_USER/data-models-userflag-enum) | the flag to check on the user's account |

###### Example

```cs
var userManager = discord.GetUserManager();
if (userManager.CurrentUserHasFlag(Discord.UserFlags.HypeSquadHouse1))
{
  Console.WriteLine("User is a member of House Bravery!");
}
```

## OnCurrentUserUpdate

Fires when the `User` struct of the currently connected user changes. They may have changed their avatar, username, or something else.

###### Parameters

| name | type | description                            |
| ---- | ---- | -------------------------------------- |
| user | User | a new User struct for the current user |

## Example: Fetching Data About a Discord User

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

var userManager = discord.GetUserManager();
userManager.GetUser(450795363658366976, (result, user) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("user fetched: {0}", user.Username);
  }
  else
  {
    Console.WriteLine("user fetch error: {0}", result);
  }
});
```
