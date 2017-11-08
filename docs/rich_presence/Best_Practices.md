# Rich Presence Best Practices

Rich Presence is a new feature from Discord that allows you to surface unique, interesting, and actionable data inside a Discord user’s profile when they play your game! This guide is intended to show some best practices on how to make that data the best it can be. It will include images and code samples; for full technical documentation, see our developer documentation.

If you take away one thing from this guide, let it be this:

>warn
>Rich Presence data should give others a clear understanding of what someone is doing so they can decide if they want to play together or not.

## Who should use Rich Presence?

Rich Presence is a powerful way to integrate your game with Discord. To do it most effectively, you should think about its purpose and how well (or not) it matches with your game and your implementation. Rich Presence is designed for these three things:

1. Show interesting, unique, actionable data in a user’s profile
2. Allow friends to spectate each other’s games
3. Join a friend’s in-game party or server directly from Discord

We certainly don’t want to stifle creativity, especially for games that can use Rich Presence in an interesting way. However, keep in mind that this sort of gameplay is what it was designed for, and how players will normally interact with it.

If you want to do something creative, wacky, funky, or otherwise out-there with Rich Presence for your players and aren’t sure if you can, feel free to drop us a line at [gamedevs@discordapp.com](mailto:gamedevs@discordapp.com). We’re always happy to help!

## How should you think about the data you show?

The data in your players’ profiles is the first thing that others on Discord will see about your game, both those familiar with it and those who have never played. It should answer two questions: can I play with my friend right now, and if not, when can I? Show data like:

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

| Bad | Good |
|:-----:|:----: |
| ![](rp-long-strings.png) | ![](rp-short-strings.png) |
| The data wraps onto multiple lines. It’s repetitive, slower to read, and messy. | The data all fits on one line per string. Clean! |

### Make it Actionable!

- Always keep party size data up to date.
- Keep accurate track of party state: In Queue, In Game, In Menus, etc.
- Include game modes, ranked vs. unranked, etc. so others can clearly see.

###### Examples

| Bad | Good |
|:-----:|:----: |
| ![](rp-non-actionable.png) | ![](rp-actionable.png) |
| While Rank 9999 is impressive, it doesn’t present any actionable data for their friends. | This player is in queue for something I want to play. Let's ask to join that open spot! |

### Use ALL of the fields (where applicable)!

- Make use of all the fields that are applicable to you.
- Save space by putting map and character names in the tooltips.
- Try not to repeat information.

###### Examples

| Bad | Good |
|:-----:|:----: |
| ![](rp-not-all-fields.png) | ![](rp-all-fields.png) |
| The map name takes up space and makes the player's status harder to read at a glance. | Moving the name of the map to the tooltip makes the data cleaner and frees up space for the score. |

### Have interesting, expressive art!

- The large image should be consistent for all players in a party.
- The small image is where you can customize on a per-player basis.
- Use high resolution artwork so your art looks great on fancy, high DPI screens.
- We strongly recommend image sizes of 1024x1024.

###### Examples

| Bad | Good |
|:-----:|:----: |
| ![](rp-bad-art.png) | ![](rp-good-art.png)|
| The image is dark and unfocused. Highly-detailed images can be hard to see. | This image is bright and matches the details. Let's help! |
