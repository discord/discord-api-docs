# Getting started with Discord app development

Discord apps let you customize your servers with interactions and automation. This guide is meant to walk through building and running your first Discord app using JavaScript. At the end of this guide, you’ll have an app that uses slash commands, sends messages, and uses message components.

While this guide is beginner-focused, it assumes a basic understanding of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics)).

> info
> When developing apps, you should build and test in a server that isn’t actively used by others. If you don’t have your own server already, you can [create one for free](https://discord.com/developers/teams).

### Contents of this guide
- [Overview](#overview)
- [Creating an app](#creating-an-app)
- [Running your app](#running-your-app)
- [Handling interactivity](#handling-interactivity)
- [Adding message components](#adding-message-components)
- [Next steps](#next-steps)

---

## Overview

In this guide, we’ll be building a Discord app that lets server members play a slightly-enhanced version of rock paper scissors (with 7 choices instead of 3).

### Resources used in this guide
- **[Github repository](https://github.com/shaydewael/discord-getting-started)** where the code from this guide lives along with additional feature-specific examples.
- **[discord-interactions](https://github.com/discord/discord-interactions-js)**, an NPM package which provides types and helper functions for Discord apps.
- **[Glitch](https://glitch.com/)**, an online development environment to build and host apps. You could also develop locally with a tool like **[ngrok](https://ngrok.com/)**.

Here’s what it’ll look like:

![Demo of example app](getting-started-demo.gif)

To make the user flow a bit more explicit:
1. User 1 initiates a new game and picks their object using the app’s `/challenge` slash command
2. A message is sent to channel with an invitation to accept the challenge
3. User 2 accepts the challenge and selects their object
4. The result of the match is posted back into channel for all to see

## Creating an app

The first thing we’ll need to do is create an app. Navigate to [the developer dashboard](https://discord.com/developers/applications), then click **New Application** in the upper right corner.

![App creation modal](app-create-modal.png)

Enter a name for your app, then click **Create**.

Once you create an app, you'll land on the **General Overview** page of the app's settings. Here you can view and configure basic information about the app, like its description and icon. You’ll also see an **Application ID** and **Interactions Endpoint URL**, which we’ll use a bit later in the guide.

### Configuring a bot

Next we'll add a bot user to your app, which allows it to appear in Discord similar to other members. On the left hand sidebar click **Bot**, then the **Add Bot** button.

Once you create a bot, you’ll have an option to update its icon and username. Under that, there’s a **Token** section with a **Reset Token** button.

![Bot tab in app setings](app-add-bot.png)

Bot tokens are used to authorize API requests and carry all of your bot user’s permissions, making them *highly sensitive*. Make sure to never share your token or check it into any kind of version control.

Go ahead and click **Reset Token**, and save the token somewhere safe.

> warn
> You won’t be able to view your token again unless you regenerate it, so make sure to keep it somewhere safe, like in a password manager. 

### Adding permissions

Apps need approval to perform actions inside of Discord (like installing a slash command or adding emojis). So before installing your app, let's add some permissions. Click on **OAuth2** in the left sidebar, then **URL generator**.

> info
> The URL generator is helpful to create an authorization link with the permissions your app needs to function. You can use the link to install your app onto your server, or share with others so they can install it on their own.

For now, we’ll just add a couple of permissions:
- `applications.commands` lets your app create commands in guilds its installed
- `bot` is to enable your bot user. After you click bot, you can also add individual permissions. For now, check **Send Messages** and **Use Slash Commands**.

![URL generator screenshot](url-generator.png)

Once you add the permissions, you should see a URL you can copy to install your app.

### Installing your app

Copy the URL from above, and paste it into your browser. You’ll be guided through the installation flow, where you should make sure you’re installing the app on a server you can use to develop and test your app.

When you install the app, you should be able to head over to your server and see that it joined ✨

With your app configured and installed, let’s start developing it.

## Running your app
All of the code for the example app can be found in [the Github repository](https://github.com/shaydewael/discord-getting-started).

To make development a bit simpler, the app uses [discord-interactions](https://github.com/discord/discord-interactions-js), which provides types and helper functions. If you prefer to use other languages or libraries, there’s [a page with community-built resources](#DOCS_TOPICS_COMMUNITY_RESOURCES) you can browse through.

### Remix the project
This guide uses Glitch, which allows you to quickly clone and develop an app within your browser (only recommended for development). There are also instructions on developing locally using ngrok [in the README](https://github.com/shaydewael/discord-getting-started#running-app-locally) if you prefer.

To start, remix (or clone) the Glitch project:

[![Glitch logo](glitch-logo.png)](https://glitch.com/edit/#!/remix/getting-started-discord)

When you remix the project, you'll see a new Glitch project with a unique name similar to this:

![Glitch project overview](glitch-project.png)

#### Project structure

All of the files for the project should be on the left-hand side. Here's a glimpse at what is what:

```
├── examples    -> short, feature-specific sample apps
│   ├── app.js
│   ├── button.js
│   ├── command.js
│   ├── modal.js
│   ├── selectMenu.js
├── .env        -> credentials
├── app.js      -> main entrypoint for app
├── commands.js -> slash command payloads + helpers
├── game.js     -> logic specific to RPS
├── utils.js    -> utility functions and enums
├── package.json
├── README.md
└── .gitignore
```

### Adding credentials

Right now there is some basic code but before it will run, you’ll need your app’s token and ID so you can make requests.

First, copy your bot user’s token from earlier and paste it in your `.env` file as `DISCORD_TOKEN`.

Then navigate to your app in the developer portal and copy the app ID and public key from the General Overview tab. Paste it in your `.env` as `APP_ID` and `PUBLIC_KEY` respectively.

Finally, fetch your server’s ID by navigating to the server where your app is installed, then copying the first number in the URL after `channels/`(for example, in `https://discord.com/channels/12345/678910` the server ID would be `12345`). Save this in a `GUILD_ID` variable in your project’s `.env`.

### Installing slash commands
If you look in the `listen` callback, you’ll see the code calling `HasGuildCommands` which is a utility function to check whether slash commands are installed—and if they aren’t, installing them.

The method is pulling the command payloads from `commands.js` and (imperfectly) matching on name. To install guild slash commands, apps can call [`​​/applications/<APP_ID>/guilds/<GUILD_ID>/commands`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS#CREATE_GUILD_APPLICATION_COMMAND).

> info
> The test project is only installing guild-scoped commands, which are predictably only installed on specific guilds. To install a command in all servers your app is in, you can create a [global command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS#CREATE_GLOBAL_APPLICATION_COMMAND).

If you go back to your guild and refresh it, you should see the slash command appear. But if you try to run it, nothing will happen because we aren’t handling the request coming from Discord.

Let’s go ahead and set up a handler.

## Handling interactivity

To enable interactivity in your app, Discord needs somewhere to send HTTP requests when your app’s slash commands, message components, or modals are used.

### Adding interaction endpoint URL
Discord needs a public URL to send interactive requests (like slash commands or button presses) to your app. Glitch has a public URL for your project exposed by default, which you can copy by clicking **Share**, then copying the live project link at the bottom:

![Glitch share modal](glitch-project-share.png)

With that link copied (in this example `https://vast-thorn-plant.glitch.me/interactions`), go to your app settings from the developer portal.

On your app’s **General Information** page, there’s an **Interactive Endpoint URL** option, where you can paste your app’s URL and append `/interactions` to it.

![Interactions endpoint URL in app settings](interactions-url.png)

Click **Save Changes** and ensure your endpoint is successfully verified.

> 🔐 Verification requires your app to verify signature headers as well as respond to ping events (events with a type of `1`). You can read more about preparing to receive interactions in [the documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING#RECEIVING_AN_INTERACTION).

The sample app is setup to handle verification by default:
- Uses the `PUBLIC_KEY` and [discord-interactions package](https://github.com/discord/discord-interactions-js#usage) with a wrapper function in `utils.js` to make it conform to [Express’s `verify` interface](http://expressjs.com/en/5x/api.html#express.json). This is run on every incoming request to your app
- Responds to incoming `PING` requests

### Handling slash command requests

With the endpoint verified, go back to your code you’ll see a commented out block required for handling slash commands:

```javascript
// "test" guild command
if (name === "test") {
        // Send a message into the channel where command was triggered from
    return res.send({
        "type": InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        "data": {
            // Fetches a random emoji to send from a helper function
            "content": "hello world " + getRandomEmoji()
        }
    });
}
```

Go ahead and uncomment that, which is responding to the interaction with a message in the channel it originated from. You can see all of the different possible response types, like responding with a modal, in [the documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING#INTERACTION_RESPONSE_OBJECT_INTERACTION_CALLBACK_TYPE).

> info
> `InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE` is an enum [exported from `discord-interactions`](https://github.com/discord/discord-interactions-js/blob/main/src/index.ts#L33)

Go to the server that matches your configured `GUILD_ID` and make sure your app’s `/test` slash command works. When you trigger it, it should send “hello world” with a random emoji.

If you don’t want to add any additional interactivity, you could skip to [next steps](#NEXT_STEPS). But in the following section, we’ll add an additional command that uses slash command options, buttons, and select menus to build the 2-person rock-paper-scissors game.

## Adding message components
With a basic command under our belts, let’s add a `/challenge` command with a bit more interactivity using message components.

The `/challenge` command will be how our rock-paper-scissors-style game is initiated, and message components sent to channel will allow users to complete the game.

### Adding a command with options

The “challenge” command, exported as `CHALLENGE_COMMAND` in `commands.js`, has an array of `options` that are defined when creating the command. You can read more about command options [in the documentation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS#APPLICATION_COMMAND_OBJECT_APPLICATION_COMMAND_OPTION_STRUCTURE).

For our app these are just the different objects that a user can select for our extended version of Rock-Paper-Scissors, being generated from using keys of `RPSChoices` in `game.js`. 

To handle the “challenge” command, add the following code after the `if name === “test”` if block:

```javascript
// "challenge" guild command
if (name === "challenge" && id) {
    let userId = req.body.member.user.id;
    // User's object choice
    let objectName = req.body.data.options[0].value;

    // Create active game using message ID as the game ID
    activeGames[id] = {
        "id": userId,
        "objectName": objectName
    };

    return res.send({
        "type": InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        "data": {
            // Fetches a random emoji to send from a helper function
            "content": `Rock papers scissors challenge from <@${userId}>`,
            "components": [{
                "type": ComponentType.ACTION,
                "components": [{
                    "type": ComponentType.BUTTON,
                    // Append the game ID to use later on
                    "custom_id": `accept_button_${req.body.id}`,
                    "label": "Accept",
                    "style": ButtonStyle.PRIMARY
                }]
            }]
        }
    });
}
```

> If you aren’t sure where to paste the code, you can see the full code in `examples/app.js` in the Glitch project or the root `app.js` [on Github](https://github.com/shaydewael/discord-getting-started/blob/main/app.js).

This code is doing a few things:
1. Parsing the request body to pull out the ID of the user who triggered the slash command, and the option (object choice) the user selected.
2. Adding a new game to the `activeGames` object using the ID of the slash command interaction (this would be a DB in the real world). In the active game, it records the user who initiated the game, and the object they chose.
3. Sending a message back to the channel with a button with a `custom_id` of `accept_button_<SOME_ID>`.

When sending a message with [message components](DOCS_INTERACTIONS_MESSAGE_COMPONENTS#WHAT_IS_A_COMPONENT), like select menus or buttons, you add their respective payloads within a `components` array. Actionable components need to be inside of a [parent action row](DOCS_INTERACTIONS_MESSAGE_COMPONENTS_ACTION_ROWS), which you can see in the code sample.

When sending a component, note the unique `custom_id`, which is used to handle requests corresponding to that specific component.

When you run the `/challenge` command and pick an option, you should be presented with a button your app sends labeled **Accept**, though we haven’t set up code to handle it yet so nothing will happen when you click it.

// TODO

### Handling buttons

All message component requests will have an [interaction type](DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING_INTERACTION_OBJECT_INTERACTION_TYPE) of `3`, or `MESSAGE_COMPONENT` when using the exported value from discord-interactions.

To set up a handler for the button, we’ll check the `type` of interaction, followed by matching the `custom_id`. Paste the following code under the type handler for `APPLICATION_COMMAND`s:

```javascript
if (type === InteractionType.MESSAGE_COMPONENT){
    // custom_id set in payload when sending message component
    let componentId = data.custom_id;

    if (componentId.startsWith('accept_button_')) {
        // get the associated game ID
        let gameId = componentId.replace('accept_button_', '');
        // Delete message with token in request body
        let url = DiscordAPI(`/webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`);
        client({ url, method: 'delete' }).catch(e => console.error(`Error deleting message: ${e}`));

        return res.send({
            "type": InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            "data": {
                // Fetches a random emoji to send from a helper function
                "content": "What's your object of choice?",
                // Indicates it'll be an ephemeral message
                "flags": 64,
                "components": [{
                    "type": ComponentType.ACTION,
                    "components": [{
                        "type": ComponentType.SELECT,
                        // Append game ID
                        "custom_id": `select_choice_${gameId}`,
                        "options": getShuffledOptions()
                    }]
                }]
            }
        });
    }
}
```

To briefly go over what this code is doing:
1. Checks for a `custom_id` that starts with `accept_button_` (which is what we sent in the previous payload). The custom ID also has the active game ID appended, so it’s stores that game ID in the `gameID` variable.
2. [Deletes the original message](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING#DELETE_ORIGINAL_INTERACTION_RESPONSE) with a webhook using the `token` in the request body and the `axios` client that’s configured at the top of the file using your app’s bot token. This is being done so that other users can’t click the button, and so the channel stays relatively clean.
3. Responds with a message that contains a select menu with the options for our rock-paper-scissors game. The payload should look fairly similar to the one that had the button with the exception of `flags`: `64`, [which indicates that the message is ephemeral](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING#DELETE_ORIGINAL_INTERACTION_RESPONSE), and the `options` array.

The `options` array is populated using the `getShuffledOptions()` method in `game.js`, which just manipulates the `RPSChoices` values to conform to the shape of message component options, which you can read more about [in the documentation](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS#SELECT_MENU_OBJECT_SELECT_OPTION_STRUCTURE).

### Handling select menus

The last thing we want to do is handle the request that’s sent when the select menu is interacted with, and send the game result to channel.

Handling the select menu interaction is similar to other message components like the button. Modify the code above to include a handler for the select menu at the end:

```javascript
if (type === InteractionType.MESSAGE_COMPONENT){
    // custom_id set in payload when sending message component
    let componentId = data.custom_id;

    if (componentId.startsWith('accept_button_')) {
        // get the associated game ID
        let gameId = componentId.replace('accept_button_', '');
        // Delete message with token in request body
        let url = DiscordAPI(`/webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`);
        client({ url, method: 'delete' }).catch(e => console.error(`Error deleting message: ${e}`));

        return res.send({
            "type": InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            "data": {
                // Fetches a random emoji to send from a helper function
                "content": "What's your object of choice?",
                // Indicates it'll be an ephemeral message
                "flags": 64,
                "components": [{
                    "type": ComponentType.ACTION,
                    "components": [{
                        "type": ComponentType.SELECT,
                        // Append game ID
                        "custom_id": `select_choice_${gameId}`,
                        "options": getShuffledOptions()
                    }]
                }]
            }
        });
    } else if (componentId.startsWith('select_choice_')) {
        // get the associated game ID
        let gameId = componentId.replace('select_choice_', '');

        if (activeGames[gameId]) {
            // Get user ID and object choice for responding user
            let userId = req.body.member.user.id;
            let objectName = data.values[0];
            // Calculate result from helper function
            let resultStr = getResult(activeGames[gameId], {id: userId, objectName});

            // Remove game from storage
            delete activeGames[gameId];
            // Update message with token in request body
            let url = DiscordAPI(`/webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`);
            client({ url, method: 'patch', data: {
                "content": `Nice choice ${getRandomEmoji()}`,
                "components": []
            }}).catch(e => console.error(`Error deleting message: ${e}`));

            // Send results
            return res.send({
                "type": InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                "data": { "content": resultStr }
            });
        }
    }
}
```

Similar to previous code, we’re pulling the user ID and the user’s selection from the interaction request.

Those values, along with the values stored in the `activeGames` object, are passed into a `getResult()` function which just checks which object wins the rock-papper-scissors game, and builds a readable string to send back into channel. 

We’re also calling a webhook to update the ephemeral message for the user with an acknowledgement, then sending the results as a message into channel (using the `CHANNEL_MESSAGE_WITH_SOURCE` interaction response type.

Go ahead and test your app and make sure everything works. 

## Next steps
And with that…congrats on building your first Discord app! 🤖

Hopefully you learned a bit about Discord apps, how to configure them, and how to make them interactive. From here, you can continue building out your app or explore what else is possible:
- Read **[the documentation](#DOCS_INTRO)** for in-depth information about API features
- Browse the `examples/` folder in this project for smaller, feature-specific code examples
- Join the **[Discord Developers server](https://discord.gg/discord-developers)** to ask questions about the API, attend events hosted by the Discord API team, and interact with other devs
- Check out **[community resources](#DOCS_TOPICS_COMMUNITY_RESOURCES)** for language-specific tools maintained by community members
