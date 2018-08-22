# Users

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

This manager helps retrieve basic user information for any user on Discord.

## Data Models

###### User Struct

| name          | type   | description                        |
| ------------- | ------ | ---------------------------------- |
| Id            | Int64  | unique Discord id                  |
| Username      | string | user's name                        |
| Discriminator | string | the four digits after the username |
| Avatar        | string | hash of user's avatar              |

## GetCurrentUser

Fetch information about the currently connected user account.

Returns a `User`.

###### Parameters

None

###### Example

```cs
var user = userManager.GetCurrentUser();
Console.WriteLine("Connected to user {0}", user.Id);
```

## Fetch

Fetch user information for a given id.

Returns a `Discord.Result` and `User` via callback.

###### Parameters

| name   | type  | description                 |
| ------ | ----- | --------------------------- |
| userId | Int64 | the id of the user to fetch |

###### Example

```cs
void Fetch(Int64 userId, (Discord.Result result, User user) =>
{
  if (result == Discord.Result.OK) {
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

var usersManager = discord.CreateUsersManager();
usersManager.Fetch(450795363658366976, (Discord.Result result, ref Discord.User user) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("user fetched: {0}", user.Username);

    // Request users's avatar data.
    // This can only be done after a user is successfully fetched.
    FetchAvatar(imagesManager, user.Id);
  }
  else
  {
    Console.WriteLine("user fetch error: {0}", result);
  }
});
```
