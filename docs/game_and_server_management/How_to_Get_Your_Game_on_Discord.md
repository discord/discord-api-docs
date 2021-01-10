# How to Get Your Game on Discord

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

Welcome, adventurer! If you're here, you want to find out how to get your game up and running on Discord and learn about our awesome Server Commerce features. You've come to the right place, so let's get started.

## Get the Band Back Together

First things first: it's time to make a Team. Your dream team of artists, writers, engineers, designers, all working on the beautiful creation of Your Game. Build your dream team with these steps:

1. Create a new Team at [https://discord.com/developers/teams](https://discord.com/developers/teams)
2. Invite people!

You've now passed the first test with flying colors!

## Apps and Games

Throughout this process, we'll reference your "app". An app, or application, is an entity on Discord that represents something you've built: a bot, an OAuth2 app, or in this case, your game. We need to make an app for your game:

1. Create a new app at [https://discord.com/developers/applications](https://discord.com/developers/applications)
2. When doing so, make sure you select your team from the `Team` dropdown

> info
> All apps on Discord for games must be owned by a team. If you accidentally made a personal app, you can transfer it to a team at any time by hitting the `Transfer App to Team` button within the app.

You're now looking at a blank slate of creativity. Give your game a pretty icon and exciting description here. Next, click on `Server Commerce Checklist` in the sidebar, and we'll get to the good stuff.

## Join the Club

From here on forward, we'll be managing settings that tie directly to your game and its presence on Discord. We want to make sure that we're laser-focused on making the best experience possible for game developers, so we ask that you pay our Application License Fee in order to get access to our store tools, which let you:

- make store pages for your game directly in your server
- run alpha and beta tests for your game, using the magic of channel permissions to create role-based page access
- apply for approval, letting you start making money (if you want to)

Now that we've weeded out the trolls - let's get your server up and running with some fancy new features!

## Your Server - Your Kingdom

You're now looking at a checklist with a bunch of items and a prompt to select a server. Your Application License Fee entitles you to the following features in your server:

- store channel creation
- alpha and beta testing

Select the server that you wish to grant these features, confirm to be double-extra-super-sure, and poof! You can now create channels for both news and store pages in your server. To learn more about store page channels, read [Store Channels](#DOCS_GAME_AND_SERVER_MANAGEMENT_SPECIAL_CHANNELS/store-channels). To learn more about Announcement Channels, read [Announcement Channels](#DOCS_GAME_AND_SERVER_MANAGEMENT_SPECIAL_CHANNELS/announcement-channels). To learn about alpha and beta testing, read [Alpha and Beta Testing](#DOCS_GAME_AND_SERVER_MANAGEMENT_ALPHA_AND_BETA_TESTING/)
(you get the gist).

Now, what do you do next? You start building! Build your community, make your game, invite testers into your server to get hype! Now is a great time to get familiar with all the tools at your disposal like:

- [Discord's Developer Portal](https://discord.com/developers/applications), your one-stop-game-management-shop
- [The Discord Game SDK](#DOCS_GAME_SDK_SDK_STARTER_GUIDE/), a spellbook full of useful game dev incantations, including Discord's crystal-clear voice chat
- [Dispatch](#DOCS_DISPATCH_DISPATCH_AND_YOU/), Discord's game patcher and downloader that's so fast, you'll swear it's magic

To guide you through this process to success, you can follow that handy checklist. It'll tell you the steps you need to complete, show you where and how to do them, and give you a blissful sense of satisfaction as the green check marks pile up.

The next and final step in your onboarding journey is getting approved. Once approved, you'll be able to start making money (or karma), and you'll unlock a ton of cool server customization features to make your kingdom cozy for your players.

## Testing Your Game

As you go through the process of building your game and getting it ready for release on Discord, you'll want to be able to test it! One way to do so is to utilize Beta Store channels, which you can learn more about here: [Alpha and Beta Testing](#DOCS_GAME_AND_SERVER_MANAGEMENT_ALPHA_AND_BETA_TESTING/).

If you are on the Team that owns the game, you can also use another special system for testing that we call Application Test Mode. Test Mode allows you to purchase unavailable, unlisted SKUs for free, making it helpful for testing IAP flows. It also automatically makes every branch of your game show up in your Library when Test Mode is turned on. You can read more here: [Application Test Mode](#DOCS_GAME_SDK_STORE/application-test-mode).

## Getting Approved

Your game looks wonderful. You've got a beautiful store page, an awesome game, and an eager community. It's time to get approved and plant your flag. Note that if your game is in an alpha or beta state, or you're interesting in Early Access, you are welcome to apply for approval whenever you are ready. Your game doesn't need to be the finished 1.0 version; give us something you'd feel comfortable giving to your players.

Once you've completed all the items on your checklist, the `Get Approved` button will unlock. Once you submit for approval, Discord will take a look at the following things:

- your game, to ensure that it runs properly and follows our [Game Submission Guidelines](https://support-dev.discord.com/hc/en-us/articles/360025028592-Game-Submission-Guidelines)
- your store pages, to provide helpful guidance in putting your best foot forward
- your server, to make sure you're abiding by our [Community Guidelines](https://discord.com/guidelines)

If we need to see some changes, you'll receive an email directing you on your steps to success. Otherwise, you'll get **APPROVED!!!!!!!!!!** What's that mean? It means you can start charging for your game and making money! Don't spend it all in one place. Or do. Treat yourself. Or maybe you want your game to be **free!** Live your best life. We support you!

## Available vs. Store Page Published

Now that you've been approved, there are a couple of new toggles to flip in the Developer Portal: `Available` and `Store Page Published`.

![Screenshot of the SKU information page with the "available" and "store page published" switches highlighted](available-published.png)

`Available` means that your game is now available for normal purchase/distribution; your non-beta store channel will no longer say `Coming soon!` when this is toggled, and users will be able to get your game.

> danger
> Toggling your SKU as `Available` will make it available for purchase; make sure your price is set properly!

If you no longer wish to make your SKU available for sale, you can again mark it unavailable. This will not remove it from users' libraries; it just stops new users from purchasing it.

`Store Page Published` will do...well, what it says! Though your store page is always visible from within the channel in your server, there are other things that require you to explicitly mark your page viewable from outside that context, like gift code embeds for your game or from in-game storefronts!

TL;DR - When you're ready to distribute your game after getting approved, turn those two toggles on.

## Getting Verified and Discovered

Apart from being approved, you can also get your server Verified. Getting verified means your server will get that oh-so-exclusive checkmark to let people know you're the legit home for your game. 

To get verified, head on over to our [Verification page](https://discord.com/verification) and fill out the form at the bottom.

## Make Good Decisions

Your game is off and running, and we couldn't be more proud. As it flourishes and your player base grows, keep an eye on your analytics, which you can find within your app. They'll give you important insight like revenue data, acquisitions funnels, and player retention to help you make an informed decision about your game's lifecycle. Check out our [Analytics Help Article](https://support-dev.discord.com/hc/en-us/articles/360024852152) to learn more about how to read all those charts and how to do things like [Conversion Tracking with UTM Links](https://support-dev.discord.com/hc/en-us/articles/360025153051-How-to-track-conversions-with-UTM-links).

## What Comes Next

Your game's success is in your own hands now. Continue to build your community and keep them informed with updates. Consider integrating more deeply with Discord to deliver cool features to your players; we recommend [Rich Presence Game Invites](#DOCS_GAME_SDK_ACTIVITIES/). They feel like magic. Drop new content by creating DLC and IAP for your game, run fun tournaments based on [HypeSquad Membership](#DOCS_GAME_SDK_USERS/current-user-has-flag), give something cool to [Discord Nitro Subscribers](#DOCS_GAME_SDK_USERS/get-current-user-premium-status) because they're awesome. Or maybe, just maybe, think about your next upcoming game?

We'd love to help you with that one, too.

-- Discord <3
