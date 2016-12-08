# GameBridge

## Private Beta FYI

For now GameBridge is in private beta. If you're interested in trying out Discord to power your game please [sign up over here](https://discordapp.com/gamebridge).

## About the GameBridge SDK

GameBridge is offered as an SDK to embed within your game. This way you can offer features to all your users regardless of whether they have Discord running on their computer or not. For users who have Discord installed, GameBridge will detect this and use their real Discord account. For users who do not have Discord installed, GameBridge will create a guest account as part of its silent initialization.

The GameBridge SDK is a headless, optimized version of [Discord's RPC](#DOCS_RPC) available to your game inside of a DLL. Once you start the SDK it will spin up an RPC server and tell you what port to connect to.

## Using GameBridge

The GameBridge SDK is still baking. If you've signed up for the private beta, we will reach out to you with some beta goodness. In the meantime, if you've requested access you can develop against a Discord client's [RPC server](#DOCS_RPC) to start building your integration now.
