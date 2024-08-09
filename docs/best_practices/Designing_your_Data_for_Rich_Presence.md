# Best Practices for Rich Presence

Rich Presence lets you display actionable data in a Discord user's profile about what they're up to in your game or app. This guide is intended to show some best practices on how to make that data the best it can be.

If you don't already know about Rich Presence, read [Rich Presence Overview](#DOCS_RICH_PRESENCE_OVERVIEW) first.

## How should you think about the data you show?

The data in your players’ profiles is the first thing that others on Discord will see about your game or app, both those familiar with it and those who have never seen it before. It should answer two questions: can I play with my friend right now, and if not, when can I? Show data like:

- What the player is currently doing
- How much time has elapsed or remains (if applicable)
- Their party state
- Your cool artwork!

For a great real world example, check out [Holodrive](https://store.steampowered.com/app/370770/Holodrive/) for free on Steam!

## Tips

### Keep it Short

- `details` and `state` should be snippets of data, not sentences.
- Make sure your strings stay on one line—especially on the small profile!

###### Examples

|                                             Bad                                              |                                                Good                                                 |
|:--------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------:|
| ![A rich presence string that is too long and does not fit on one line](rp-long-strings.png) | ![Screenshot of a good rich presence string that is concise and easy to read](rp-short-strings.png) |
|       The data wraps onto multiple lines. It’s repetitive, slower to read, and messy.        |                          The data all fits on one line per string. Clean!                           |

### Make it Actionable!

- Always keep party size data up to date.
- Keep accurate track of party state: In Queue, In Game, In Menus, etc.
- Include game modes, ranked vs. unranked, etc. so others can clearly see.

###### Examples

|                                           Bad                                            |                                                                     Good                                                                     |
|:----------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------:|
|    ![Screenshot of a rich presence string reading "Rank 9999"](rp-non-actionable.png)    | ![Screenshot of a good rich presence string shows a game mode of "Ranked: Control Point" and that the user is in a queue](rp-actionable.png) |
| While Rank 9999 is impressive, it doesn’t present any actionable data for their friends. |                           This player is in queue for something I want to play. Let's ask to join that open spot!                            |

### Use ALL of the fields (where applicable)!

- Make use of all the fields that are applicable to you.
- Save space by putting map and character names in the tooltips.
- Try not to repeat information.

###### Examples

|                                               Bad                                               |                                                              Good                                                               |
|:-----------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------:|
| ![Screenshot of a rich presence string that is hard to read at a glance](rp-not-all-fields.png) | ![Screenshot of a good rich presence that takes advantage of storing less important information in tooltips](rp-all-fields.png) |
|      The map name takes up space and makes the player's status harder to read at a glance.      |               Moving the name of the map to the tooltip makes the data cleaner and frees up space for the score.                |

### Have interesting, expressive art!

- The large image should be consistent for all players in a party.
- The small image is where you can customize on a per-player basis.
- Use high resolution artwork so your art looks great on fancy, high DPI screens.
- We strongly recommend image sizes of 1024x1024 pixels.

###### Examples

|                                          Bad                                          |                                       Good                                        |
|:-------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------:|
| ![Screenshot of a rich presence icon that is too dark to see clearly](rp-bad-art.png) | ![Screenshot of a rich presence icon that is clear and detailed](rp-good-art.png) |
|      The image is dark and unfocused. Highly-detailed images can be hard to see.      |             This image is bright and matches the details. Let's help!             |


## Launch Checklist

Ready to launch a Rich Presence integration for your game? If so, we recommend looking over this checklist one last time to ensure that your integration is as great as it can be!

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
- Are your images at least 1024x1024 pixels?
- Is it clean, interesting, and descriptive without being too highly detailed?
- Do you have artwork for every different state? Don't forget your default state/main menu!
- Did you make use of tooltips and the small image where appropriate?

#### Joining

- Have you successfully implemented join invites for your game if applicable?
- Does the state of the invite properly represent the party/group in-game with regards to:
  - Size?
  - Open slots?
  - Discord _and_ non-Discord users in the party?
- Are you able to post invites to Discord without any additional in-game setup or configuration?
- Are you properly removing data from the presence payload when someone can no longer send invites?
  - A Join secret should not be sent if the player can't invite anyone!

