# Rich Presence Launch Checklist

Ready to launch a Rich Presence integration for your game? Did you read our [Best Practices](#DOCS_BEST_PRACTICES/) guide? If so, we recommend looking over this checklist one last time to ensure that your integration is as great as it can be!

>warn
>Our precompiled libraries depend on the [Visual C++ Redistributable for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48145). If you distribute your game on Steam, make sure to check that box in your common redistributable settings.

#### Profile Strings

- Have you made use of all available fields where appropriate?
- Do your strings fit on their own lines without line wrapping?
  - Did you check on the smaller profile pop out?
- Do they clearly communicate:
  - What the player is currently doing?
  - If the player is in a group or playing alone?
  - If the player is in a state where they can party up?

#### Artwork

- Is your artwork high resolution?
- Are your image sizes at least 1024x1024?
- Is it clean, interesting, and descriptive without being too highly detailed?
- Do you have artwork for every different state? Don't forget your default state/main menu!
- Did you make use of tooltips and the small image where appropriate?

#### Joining

>warn
>If you want the Ask to Join button on users' profiles, check out [Getting Aproved](#DOCS_GETTING_APPROVED/) for more information!

- Have you successfully implemented join invites for your game if applicable?
- Does the state of the invite properly represent the party/group in-game with regards to:
  - Size?
  - Open slots?
  - Discord _and_ non-Discord users in the party?
- Are you able to post invites to Discord without any additional in-game setup or configuration?
- Are you properly removing data from the presence payload when someone can no longer send invites?
  - A `joinSecret` should not be sent if the player can't invite anyone!

#### Spectating

>warn
>If you want the Spectate button on users' profiles, check out [Getting Approved](#DOCS_GETTING_APPROVED/) for more information!

- Have you successfully implemented spectate invites for your game if applicable?
- Is your game's spectate mode true spectating?
  - We do _not_ allow using the Spectate button as a pseudo-Join button.
- Are you properly removing data from the presence payload when someone can no longer spectate?
  - A `spectateSecret` should not be sent if the player can't be spectated!
