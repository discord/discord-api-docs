# Community Resources

Discord has the best online community. At least, we like to think so, and this is our website, so our word is law, deal with it. Therefore it's a fact that our community is the best, and they make really awesome things that we want to share with developers to make their lives easier. From permissions calculators to embed visualizers to full libraries to interface with our API, there are so many great things that have come out of our community.

## Libraries

The Discord team curates the following list of officially vetted libraries that conform to our APIs standards around authentication and rate limiting. Using custom implementations or non-compliant libraries that abuse the API or cause excessive rate limits may result in a **permanent** ban.

Many of these libraries are represented in the [unofficial, community-driven Discord server for developers](https://discord.gg/discord-api). There you'll find community members who can help answer questions about our API, community libraries, bot creation, and other development questions.

###### Discord Libraries

| Name                                                         | Language   |
| ------------------------------------------------------------ | ---------- |
| [discljord](https://github.com/igjoshua/discljord)           | Clojure    |
| [aegis.cpp](https://github.com/zeroxs/aegis.cpp)             | C++        |
| [discordcr](https://github.com/discordcr/discordcr)          | Crystal    |
| [Discord.Net](https://github.com/RogueException/Discord.Net) | C#         |
| [DSharpPlus](https://github.com/DSharpPlus/DSharpPlus)       | C#         |
| [dscord](https://github.com/b1naryth1ef/dscord)              | D          |
| [DiscordGo](https://github.com/bwmarrin/discordgo)           | Go         |
| [DisGord](https://github.com/andersfylling/disgord)          | Go         |
| [catnip](https://github.com/mewna/catnip)                    | Java       |
| [Discord4J](https://discord4j.com/)                          | Java       |
| [Javacord](https://github.com/Javacord/Javacord)             | Java       |
| [JDA](https://github.com/DV8FromTheWorld/JDA)                | Java       |
| [discord.js](https://github.com/discordjs/discord.js)        | JavaScript |
| [Eris](https://github.com/abalabahaha/eris)                  | JavaScript |
| [Discord.jl](https://github.com/Xh4H/Discord.jl)             | Julia      |
| [Discordia](https://github.com/SinisterRectus/Discordia)     | Lua        |
| [discordnim](https://github.com/Krognol/discordnim)          | Nim        |
| [RestCord](https://www.restcord.com/)                        | PHP        |
| [discord.py](https://github.com/Rapptz/discord.py)           | Python     |
| [disco](https://github.com/b1naryth1ef/disco)                | Python     |
| [discordrb](https://github.com/discordrb/discordrb)          | Ruby       |
| [discord-rs](https://github.com/SpaceManiac/discord-rs)      | Rust       |
| [Serenity](https://github.com/serenity-rs/serenity)          | Rust       |
| [AckCord](https://github.com/Katrix/AckCord)                 | Scala      |
| [Sword](https://github.com/Azoy/Sword)                       | Swift      |
| [Discordeno](https://github.com/Skillz4Killz/Discordeno)     | TypeScript |

## Game SDK Tools

Discord Game SDK's lobby and networking layer shares similarities with other gaming platforms (i.e. Valve's Steamworks SDK). The following open source library provides developers a uniform interface for these shared features and can simplify developing for multiple platforms. Note: this library is tailored for Unity3D development.

- [HouraiNetworking](https://github.com/HouraiTeahouse/HouraiNetworking)

## Dispatch Tools

Using Discord's [Dispatch](#DOCS_DISPATCH_DISPATCH_AND_YOU) tool for game developers publishing on Discord can sometimes involve using the same long commands multiple times. The following open-source tool helps shorten these commands for you. It will also provide webhook support for when you're pushing an update.

- [JohnyTheCarrot's Dispatch CLI](https://github.com/JohnyTheCarrot/droops-dispatch)

## Permission Calculators

[Permissions](#DOCS_TOPICS_PERMISSIONS/permissions) in Discord are tricky. Luckily, we've got really smart people who love us and have made some great permissions calculators. If you're making a bot for others, and you're not sure how to properly calculate permissions or generate your [authorization URL](#DOCS_TOPICS_OAUTH2/bot-authorization-flow), these are great tools:

- [FiniteReality's Permissions Calculator](https://finitereality.github.io/permissions-calculator/?v=0)
- [abalabahaha's Permissions Calculator](https://discordapi.com/permissions.html#0)

## Intent Calculators

[Gateway Intents](#DOCS_TOPICS_GATEWAY/gateway-intents) are pretty confusing at first. If you're not sure what to send in your [identify payload](#DOCS_TOPICS_GATEWAY/identify), then this tool may be of help:

- [ziad87's Intent Calculator](https://ziad87.net/intents/)

## Embed Visualizer

Webhooks and embeds might seem like black magic. That's because they are, but let us help you demystify them a bit. This sweet embed visualizer lets you play around with JSON data and see exactly how it will look embedded in Discord. It even includes a webhook mode!

- [LeoV's Embed Visualizer](https://leovoel.github.io/embed-visualizer/)
