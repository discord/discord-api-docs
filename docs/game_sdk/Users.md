# Users

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

This manager helps retrieve basic user information for any user on Discord.

### Data Models

```cs
struct User
{
  Int64 Id;
  string Username;
  string Discriminator;
  string Avatar;
  bool Bot;
};
```

### Methods

```cs
User GetCurrentUser();
// Returns information about the currently connected user account

void Fetch(Int64 userId, (Discord.Result result, User user) =>
{
  // Returns information about a user given their id
});
```

### Callbacks

````cs
OnCurrentUserUpdate =+ User user =>
{
  // Fires when the User object of the currently connected user changes
}

### Example: Fetching Data About a Discord User

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
````
