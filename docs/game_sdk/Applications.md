# Applications

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Many games run their own backend servers for things like user authentication. If one of those many games is yours, then we've got something for you! This manager gives you access to a bearer token for the currently connected Discord user, which you can send off to your server to do user authentication.

This token is also useful for retrieving information about the connected user's account. Check out our [OAuth2 documentation](https://discordapp.com/developers/docs/topics/oauth2) for more information.

These bearer tokens are good for seven days, after which they will expire. When a user reconnects to your game, and is online and connected to the internet, they'll receive a new token that you can grab.

This manager also includes a couple useful helper functions, like getting the locale in which the user has chosen to use their Discord client, and knowing which game branch the game is running on. More about branches in the Dispatch CLI tool section of the documentation.

### Models

```cs
struct OAuth2Token
{
  string AccessToken;
  string Scopes;
  Int64 Expires;
}
```

### Methods

```cs
string GetCurrentLocale();
// Returns the locale the user chose in Discord as a string
// See our Dispatch documentation for a list of valid values

string GetCurrentBranch();
// Returns the name as a string of your pushed branch the game is running on

void GetOAuth2Token((Discord.Result result, OAuth2Token token) =>
{
  // Returns the access token for the current user
  // If call this function, and the game did was _not_ launched from Discord
  // Discord will focus itself and pop an authorization modal for your application, and then return the token on accept
  // If the game was launched from Discord, it will bypass the modal and return the token
});

void ValidateOrExit((Discord.Result result) =>
{
  // Entitlements check - does the user have the entitlement for this application?
  // If so, good to go. If not, exit game
});
```

### Example: Get OAuth2 Token

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var appManager = new discord.CreateApplicationsManager();

// Retrieve the token
appManager.GetOAuth2Token((OAuth2Token token) =>
{
  Console.WriteLine(token.AccessToken);

  // Now send that token off to your server to do your own validation!
})
```
