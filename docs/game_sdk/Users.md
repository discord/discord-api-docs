# Users

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

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
