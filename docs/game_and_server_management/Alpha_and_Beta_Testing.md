# Alpha and Beta Testing

Alphas and betas are a critical part of a game's development lifecycle. We understand the value of getting feedback early and often and involving your community early on. That's why we've built some awesome alpha and beta testing functionality for you!

## Beta Entitlements

As you develop your game, you'll constantly be making improvements. You want real-time feedback from players, and there's no better place for that than Discord. In the past, players would need to dig through menus to find out how to unlock test branches, as well as remembering secret passwords _and_ typing them in correctly. Was that an `I` or an `l`? `O` or `0`?

One of the cool features of [Store Channels](#DOCS_GAME_AND_SERVER_MANAGEMENT_SPECIAL_CHANNELS/store-channels) is their ability to grant a Beta Entitlement for your game. That means that while you keep your master branch safe and sound, users can test on `beta-branch-please-ignore-bugs` in an isolated test environment.

> info
> To learn more about creating branches, start with [Dispatch and You](#DOCS_DISPATCH_DISPATCH_AND_YOU/).

When you create a store channel in your server, you'll be prompted with a choice to make it a Beta channel. That will allow you to grant users entitlement to the non-master branch of your game when visiting the store page. When your beta period is over and your game is ready for release and purchase, you can brick/delete these branches if you choose, and prompt users to get the full game by putting up a new store channel that's not Beta.

> warn
> Beta branches cannot be sold. If a user has access to a store channel for a beta entitlement, they will be able to claim it for free.

## Role-Based Entitlement

So, you've started getting a bunch of fans into your server. Hundreds, thousands, millions! Uh, if you hit millions, let us know. Within your hordes of adoring fans lies your Trusted Testing Group (tm), the best of the best when it comes to feedback. Maybe you want to give them access to a special `insider-only-private-beta` branch of your game. You can, with role-based entitlement!

Store channels in Discord are just like any other channel in that they can have a set of permissions applied to them. What is special about them is that if they are set as a Beta branch, entitlement to that branch is tied to having permissions to view the channel. So, all your testers with a `Beta Tester` role, for example, will be able to get entitlement to the `insider-only-private-beta` branch. And, if they are later removed from that role, entitlement from that branch will be removed.

A scenario might look like this: you create a Beta store channel. Only users with role `Awesome Tester` can view it. Player A is an `Awesome Tester`. They can view the channel and get entitlement to the beta branch. Player A becomes inactive; you remove them from the `Awesome Tester` role. Player A loses entitlement to `insider-only-private-beta`

Role-based entitlements help keep your beta community active and interactive, while also providing a way to reward your biggest fans with secret access to special things.
