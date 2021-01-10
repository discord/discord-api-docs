# Users

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

This manager helps retrieve basic user information for any user on Discord.

## Data Models

###### User Struct

| name          | type   | description                   |
| ------------- | ------ | ----------------------------- |
| Id            | Int64  | the user's id                 |
| Username      | string | their name                    |
| Discriminator | string | the user's unique discriminator     |
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

> info
> Before calling this function, you'll need to wait for the [OnCurrentUserUpdate](#DOCS_GAME_SDK_USERS/on-current-user-update) callback to fire after instantiating the User manager.

Fetch information about the currently connected user account. If you're interested in getting more detailed information about a user—for example, their email—check out our [GetCurrentUser](#DOCS_RESROUCES_USER/get-current-user) API endpoint. You'll want to call this with an authorization header of `Bearer <token>`, where `<token>` is the token retrieved from a standard [OAuth2 Authorization Code Grant](#DOCS_TOPICS_OAUTH2/authorization-code-grant) flow.

Returns a `Discord.User`.

###### Parameters

None

###### Example

```cs
var user = userManager.GetCurrentUser();
Console.WriteLine("Connected to user {0}", user.Id);
```

## GetUser

Get user information for a given id.

Returns a `Discord.Result` and `ref Discord.User` via callback.

###### Parameters

| name   | type  | description                 |
| ------ | ----- | --------------------------- |
| userId | Int64 | the id of the user to fetch |

###### Example

```cs
userManager.GetUser(userId, (Discord.Result result, ref Discord.User user) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("User {0} is {1}", user.Id, user.Username);
  }
});
```

## GetCurrentUserPremiumType

Get the [PremiumType](#DOCS_GAME_SDK_USER/data-models-premiumtype-enum) for the currently connected user.

Returns `Discord.PremiumType`.

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
if (userManager.CurrentUserHasFlag(Discord.UserFlag.HypeSquadHouse1))
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

###### Example

```cs
var userManager = discord.GetUserManager();
// GetCurrentUser will error until this fires once.
userManager.OnCurrentUserUpdate += () => {
  var currentUser = userManager.GetCurrentUser();

  Console.WriteLine(currentUser.Username);
  Console.WriteLine(currentUser.Id);
  Console.WriteLine(currentUser.Discriminator);
  Console.WriteLine(currentUser.Avatar);
};
```

## Example: Fetching Data About a Discord User

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

var userManager = discord.GetUserManager();
userManager.GetUser(450795363658366976, (Discord.Result result, ref Discord.User user) =>
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
