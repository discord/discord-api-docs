# Discord for Developers Documentation

This repo contains the official Discord for Developers documentation, which can be viewed online [HERE](https://discord.com/developers/docs/intro). Before submitting pull-requests, please remember to _fully_ read the [Contributing](CONTRIBUTING.md) guidelines.

This repository reflects the Discord Developer Platform as it is meant to be accessed by third-party applications. It omits features and capabilities that are not generally available, or are not fully supported for third-party usage.

We welcome your contributions!

-   Issue tracker: [Discord API bugs](https://github.com/discord/discord-api-docs/issues)
-   Discussions: [Discord API feature and improvement requests](https://github.com/discord/discord-api-docs/discussions/categories/api-feature-requests-ideas)
-   Pull Requests: See [Contributing.md](https://github.com/discord/discord-api-docs/blob/main/CONTRIBUTING.md) for types of changes accepted and specific markdown syntax used in the documentation.

### Local Preview

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the `mintlify dev` in the `discord` directory to see your changes locally.

```
cd discord
mintlify dev
```

Your local browser should open automatically to the correct page, but if not, navigate to:

```
http://localhost:3000/developers/docs/intro
```

## Need some help?

Here are some Discord servers that can help you out with everything Discord API:

The [Official Discord Developers server](https://discord.gg/discord-developers) has plenty of help channels with knowledgeable people and Discord's developers to get you help with something you need, and get updates straight from the developers. However do keep in mind this is a purely on-topic server. If you are looking for a community, join the server below.

The [Unofficial Discord API server](https://discord.gg/discord-api) is a common hangout for library and bot developers alike. It's a great starting point for those looking to dive in and learn bot-creation with the Discord API.

## License

Except as otherwise noted, the Discord API Documentation and other content in this repository is licensed under the Creative Commons Attribution-ShareAlike 4.0 License (see [LICENSE](https://github.com/discord/discord-api-docs/blob/main/LICENSE)), and code samples in this repository are licensed under the MIT License (see [LICENSE-CODE](https://github.com/discord/discord-api-docs/blob/main/LICENSE-CODE)). These licenses do not grant you rights to use any of Discord’s trademarks or other brand features. Please see the [Discord Developer Terms of Service](https://support-dev.discord.com/hc/articles/8562894815383-Discord-Developer-Terms-of-Service) for more information about use of Discord’s brand features and APIs.
