# Applications

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

Many games run their own backend servers for things like user authentication. If one of those many games is yours, then we've got something for you! This manager gives you access to a bearer token for the currently connected Discord user, which you can send off to your server to do user authentication.

This token is also useful for retrieving information about the connected user's account. Check out our [OAuth2 documentation](https://discord.com/developers/docs/topics/oauth2) for more information.

These bearer tokens are good for seven days, after which they will expire. When a user reconnects to your game, and is online and connected to the internet, they'll receive a new token that you can grab.

This manager also includes a couple of useful helper functions, like getting the locale in which the user has chosen to use their Discord client and knowing which game branch the game is running on—more about branches in the Dispatch CLI tool section of the documentation.

## Data Models

###### OAuth2Token Struct

| name        | type   | description                                                                                     |
| ----------- | ------ | ----------------------------------------------------------------------------------------------- |
| AccessToken | string | a bearer token for the current user                                                             |
| Scopes      | string | a list of oauth2 scopes as a single string, delineated by spaces like `"identify rpc gdm.join"` |
| Expires     | Int64  | the timestamp at which the token expires                                                        |

###### SignedAppTicket Struct

| name           | type                                                                                                                     | description                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| application_id | Int64                                                                                                                    | the application id for the ticket                        |
| user           | [User](#DOCS_GAME_SDK_USER/data-models-user-struct)                                                                      | the user for the ticket                                  |
| entitlements   | list of partial [Entitlements](#DOCS_GAME_SDK_STORE/data-models-entitlement-struct) structs that contain just the SKU id | the list of the user's entitlements for this application |
| timestamp      | string                                                                                                                   | the ISO 8601 timestamp for the ticket                    |

## GetCurrentLocale

> info
> Value from environment variable `DISCORD_CURRENT_LOCALE`

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

> info
> Value from environment variable `DISCORD_CURRENT_BRANCH`

Get the name of the pushed branch on which the game is running. These are branches that you created and pushed using Dispatch.

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

> info
> value from environment variable `DISCORD_ACCESS_TOKEN`

> warn
> Ensure that you have `http://127.0.0.1` set as a valid redirect URI for your application in the Developer Portal, or this method will always return an error.

Retrieve an oauth2 bearer token for the current user. If your game was launched from Discord and you call this function, you will automatically receive the token. If the game was _not_ launched from Discord, and this method is called, Discord will focus itself and prompt the user for authorization.

Returns a `Discord.Result` and a `ref Discord.OAuth2Token` via callback.

###### Parameters

None

###### Example

```cs
applicationManager.GetOAuth2Token((Discord.Result result, ref Discord.OAuth2Token token) =>
{
  if (result == Discord.Result.Ok)
  {
    Console.WriteLine("Token for the user: {0}. Expires in {1}", token.AccessToken, token.Expires);
    // You may now use this token against Discord's HTTP API
  }
});
```

## ValidateOrExit

Checks if the current user has the entitlement to run this game.

Returns a `Discord.Result` via callback.

###### Parameters

None

###### Example

```cs
applicationManager.ValidateOrExit((result) =>
{
  if (result == Discord.Result.Ok)
  {
    // Game keeps running
  }
  else
  {
    Console.WriteLine("Oops! Something went wrong, closing game...");
  }
});
```

## GetTicket

###### Current Version

| version | status  |
| ------- | ------- |
| 2       | current |

Get the signed app ticket for the current user. The structure of the ticket is: `version.signature.base64encodedjson`, so you should split the string by the `.` character. Ensure that the `version` matches the current version. The `signature` is used to verify the ticket using the libsodium library of your choice, and the `base64encodedjson` is what you can transform after verification. It contains:

- the application id tied to the ticket
- the user's user-id
- a timestamp for the ticket
- the list of the user's [entitlements](#DOCS_GAME_SDK_STORE/data-models-entitlement-struct) for the application id

These values can be accessed by transforming the string into a [SignedAppTicket](#DOCS_GAME_SDK_APPLICATIONS/data-models-signedappticket-struct) with your application's private key. The ticket is signed using [libsodium](https://github.com/jedisct1/libsodium), which should be available for any programming language. Here's a [list of available libraries](https://download.libsodium.org/doc/bindings_for_other_languages).

Note that both the public key you receive from Discord and the signature within the app ticket from the SDK are both in hex and will need to be converted to `byte[]` before use with libsodium.

Returns a `Discord.Result` and `ref string` via callback.

###### Parameters

None

###### Example

```cs
// Handle serialization, however, works best for you
// This is just an easy example
[Serializable]
public class SignedAppTicket
{
  public long application_id;
  public Discord.User user;
  public List<Discord.Entitlement> entitlements;
  public string timestamp;
}

public void DoTheThing()
{
  // This example is using the libsodium-net library
  // https://github.com/adamcaudill/libsodium-net
  var appManager = discord.GetApplicationManager();
  var MY_PUBLIC_KEY = "460cab5f2237b71e3c2c06bzze217f4f68d55db16dae672bdfb6618235589999";
  var MY_SKU_ID = "492432195219099999";

  // Get the ticket
  appManager.GetTicket((Discord.Result res, ref string ticket) =>
  {
    // Split the ticket into its parts
    var parts = ticket.Split('.');

    // Ensure the version matches
    if(parts[0] == "2")
    {
      // Verify the signature
      // Your public key will be given to you by Discord
      if (Sodium.PublicKeyAuth.VerifyDetached(HexToByte(parts[1]), System.Text.Encoding.UTF8.GetBytes(parts[2]), HexToByte(MY_PUBLIC_KEY)))
      {
        // If valid, decode the string
        var byteData = Convert.FromBase64String(parts[2]);
        var json = System.Text.Encoding.UTF8.GetString(byteData);

        // Deserialize it into the ticket object
        var myTicket = Newtonsoft.Json.JsonConvert.DeserializeObject<SignedAppTicket>(json);

        // Check for entitlement to the SKU!
        if (myTicket.entitlements.Any(x => x.SkuId == MY_SKU_ID))
        {
          Console.WriteLine("User has entitlement to your game");
        }
        else
        {
          Console.WriteLine("Not entitled");
        }
      }
    }
  });
}

public byte[] HexToByte(string hex)
{
  byte[] data = new byte[hex.Length / 2];
  for (int i = 0; i < hex.Length; i +=2)
  {
    data[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
  }
  return data;
}
```

## Example: Get OAuth2 Token

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var appManager = discord.GetApplicationManager();

// Retrieve the token
appManager.GetOAuth2Token((Discord.Result result, ref Discord.OAuth2Token token) =>
{
  Console.WriteLine(token.AccessToken);

  // Now send that token off to your server to do your own validation!
})
```
