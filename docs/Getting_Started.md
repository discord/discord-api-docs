# Building a Discord app

Discord apps let you customize your servers with interactions and automations. This guide is meant to walk you through building and running your first Discord app using JavaScript (and assumes a basic understanding of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics)).

At the end of this guide, you’ll have an app that sends messages and uses interactive features like slash commands and buttons.

Some resources used in this guide:
- **[Github repository](https://github.com/shaydewael/discord-getting-started)** where the code from this guide lives along with additional feature-specific examples.
- **[discord-interactions](https://github.com/discord/discord-interactions-js)**, an NPM package which provides types and helper functions for Discord apps.
- **[Glitch](https://glitch.com/)**, an online development environment to build and host apps. You could also develop locally with a tool like **[ngrok](https://ngrok.com/)**.

> info
> When developing apps, you should build and test in a server that isn’t actively used by others. If you don’t have your own server already, you can [create one for free](https://discord.com/developers/teams).

## Introduction

In this guide, we’ll be building an app that lets users play an expanded version of rock paper scissors. Here’s what it’ll look like:

![Demo of example app](../images/getting-started-demo.gif?raw=true)

The flow for the app can be simplified to the following:
1. User 1 initiates a new game and picks their object using the app’s `/challenge` slash command
2. A message is sent to channel with an invitation to accept the challenge
3. User 2 accepts the challenge and selects their object
4. The result of the match is posted back into channel for all to see

## Creating an app

The first thing we’ll need to do is create an app. Navigate to [the developer dashboard](https://discord.com/developers/applications), then click **New Application** in the upper right corner.

![App creation modal](../images/app-create-modal.png?raw=true)

Enter a name for your app, then click **Create**.

Once you create an app, you’ll land on its **General Overview** page. Here you can view and configure basic information about your app, like its description and icon. You’ll also see an **Application ID** and **Interactions Endpoint URL**, which we’ll use later in the guide.

### Configuring a bot

Let’s add a bot user to your app, which allows it to appear in Discord similar to other members. On the left hand sidebar click **Bot**, then the **Add Bot** button.

Once you create a bot, you’ll have an option to update its icon and username. Under that, there’s a **Token** section with a **Reset Token** button.

![Bot tab in app setings](../images/app-add-bot.png?raw=true)

Bot tokens carry all of your bot user’s permissions and are used to authorize API requests, making them *highly sensitive*. Make sure to never share your token or check it into any kind of version control.

Go ahead and click Reset Token, and copy the token.

> warn
> You won’t be able to view your token again unless you regenerate it, so make sure to keep it somewhere safe (like in a password manager). 

### Adding permissions

Before installing your app, you’ll need to grant it the proper permissions. Click on **OAuth2** on the left sidebar, then **URL generator**.

> info
> The URL generator is a tool to create an authorization link with the permissions your app needs to function. You can use the link to install your app onto your own server, or share with others so they can install it on their own.

For now, we’ll just add a couple of permissions:
- `applications.commands` lets your app create commands in guilds its installed
- `bot` is to add your bot user. After you click bot, you can also enable individual permissions for your bot user. For now, check **Send Messages** and **Use Slash Commands**.

![URL generator screenshot](../images/url-generator.png?raw=true)

Once you add the permissions, you should see a URL you can copy to install your app.

### Install your app

Go ahead and copy the URL, and paste it into your browser. You’ll be guided through the installation flow, where you should make sure you’re installing the app on a server you can use to develop and test your app.

When you install the app, you should be able to head over to your server and see that it joined ✨

With your app configured and installed, let’s start developing it.
