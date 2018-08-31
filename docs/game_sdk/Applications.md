# Applications

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Many games run their own backend servers for things like user authentication. If one of those many games is yours, then we've got something for you! This manager gives you access to a bearer token for the currently connected Discord user, which you can send off to your server to do user authentication.

This token is also useful for retrieving information about the connected user's account. Check out our [OAuth2 documentation](https://discordapp.com/developers/docs/topics/oauth2) for more information.

These bearer tokens are good for seven days, after which they will expire. When a user reconnects to your game, and is online and connected to the internet, they'll receive a new token that you can grab.

This manager also includes a couple useful helper functions, like getting the locale in which the user has chosen to use their Discord client, and knowing which game branch the game is running on. More about branches in the Dispatch CLI tool section of the documentation.

## Data Models

###### OAuth2Token Struct

| name        | type   | description                                                                                     |
| ----------- | ------ | ----------------------------------------------------------------------------------------------- |
| AccessToken | string | a bearer token for the current user                                                             |
| Scopes      | string | a list of oauth2 scopes as a single string, delineated by spaces like `"identify rpc gdm.join"` |
| Expires     | Int64  | the timestamp at which the token expires                                                        |

## GetCurrentLocale

Get's the locale the current user has Discord set to.

Returns a `string`.

###### Parameters

None

###### Example

```cs
var locale = applicationManager.GetCurrentLocale();
Console.WriteLine("This user's language is {0}", locale);
```

## GetCurrentBranch

Get the name of pushed branch on which the game is running. These are branches that you created and pushed using Dispatch.

###### Parameters

None

###### Example

```cs
var branch = applicationManager.GetCurrentBranch();
if (branch != MyBranches.Stable)
{
  Console.WriteLine("You are on a beta branch; expect bugs!");
}
```

## GetOAuth2Token

Retrieve an oauth2 beare token for the current user. If your game was launched from Discord and you call this function, you will automatically receive the token. If the game was _not_ launched from Discord and this method is called, Discord will focus itself and prompt the user for authorization.

Returns a `Discord.Result` and an `OAuth2Token` via callback.

###### Parameters

None

###### Example

```cs
applicationManager.GetOAuth2Token((result, token) =>
{
  if (result == Discord.Result.OK)
  {
    Console.WriteLine("Token for the user: {0}. Expires in {1}", token.AccessToken, token.Expires);
    // You may now use this token against Discord's HTTP API
  }
});
```

## ValidateOrExit

Checks if the current user has the entitlement to run this game.

Returns `void`.

###### Parameters

None

###### Example

```cs
applicationManager.ValidateOrExit((result) =>
{
  if (result == Discord.Result.OK)
  {
    // Game keeps running
  }
  else
  {
    Console.WriteLine("Oops! Something went wrong, closing game...");
  }
});
```

## Example: Get OAuth2 Token

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var appManager = discord.GetApplicationManager();

// Retrieve the token
appManager.GetOAuth2Token((token) =>
{
  Console.WriteLine(token.AccessToken);

  // Now send that token off to your server to do your own validation!
})
```
