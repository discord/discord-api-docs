# Getting started with Discord app development

Discord apps let you customize your servers with interactions and automation. This guide is meant to walk through building and running your first Discord app using JavaScript. At the end of this guide, you’ll have an app that uses slash commands, sends messages, and uses message components.

While this guide is beginner-focused, it assumes a basic understanding of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics).

> info
> When developing apps, you should build and test in a server that isn’t actively used by others. If you don’t have your own server already, you can [create one for free](https://discord.com/developers/teams).

### Guide contents
- [Overview](#DOCS_GETTING_STARTED/overview)
- [Creating an app](#DOCS_GETTING_STARTED/creating-an-app)
- [Running your app](#DOCS_GETTING_STARTED/running-your-app)
- [Handling interactivity](#DOCS_GETTING_STARTED/handling-interactivity)
- [Adding message components](#DOCS_GETTING_STARTED/adding-message-components)
- [Next steps](#DOCS_GETTING_STARTED/next-steps)

---

## Overview

In this guide, we’ll be building a Discord app that lets server members play a *slightly*-enhanced version of rock paper scissors (with 7 choices instead of 3).

### Resources used in this guide
- **[Github repository](https://github.com/shaydewael/discord-getting-started)** where the code from this guide lives along with additional feature-specific examples.
- **[discord-interactions](https://github.com/discord/discord-interactions-js)**, an NPM package which provides types and helper functions for Discord apps.
- **[Glitch](https://glitch.com/)**, an online development environment to build and host apps. You could also develop locally with a tool like **[ngrok](https://ngrok.com/)**.

And here's what the finished app will look like:

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

All of the code used in the example app can be found in [the Github repository](https://github.com/shaydewael/discord-getting-started).

To make development a bit simpler, the app uses [discord-interactions](https://github.com/discord/discord-interactions-js), which provides types and helper functions. If you prefer to use other languages or libraries, there’s [a page with community-built resources](#DOCS_TOPICS_COMMUNITY_RESOURCES) you can browse through.

### Remix the project

This guide uses Glitch, which allows you to quickly clone and develop an app within your browser (only recommended for development). There are also instructions on developing locally using ngrok [in the README](https://github.com/shaydewael/discord-getting-started#running-app-locally) if you prefer.

To start, **[remix (or clone) the Glitch project 🎏](https://glitch.com/edit/#!/remix/getting-started-discord)**

When you remix the project, you'll see a new Glitch project with a unique name similar to this:

![Glitch project overview](glitch-project.png)

#### Project structure

All of the files for the project are on the left-hand side. Here's a quick glimpse at the structure:

```
├── examples    -> short, feature-specific sample apps
│   ├── app.js  -> completed app.js code
│   ├── button.js
│   ├── command.js
│   ├── modal.js
│   ├── selectMenu.js
├── .env        -> your credentials and IDs
├── app.js      -> main entrypoint for app
├── commands.js -> slash command payloads + helpers
├── game.js     -> logic specific to RPS
├── utils.js    -> utility functions and enums
├── package.json
├── README.md
└── .gitignore
```

### Adding credentials

In the project, there's already the skeleton of an app, but you’ll need your app’s token and ID to make requests. All of your project's credentials can be stored directly in the `.env` file.

First, copy your bot user’s token from earlier and paste it in the `DISCORD_TOKEN` variable in your `.env` file.

Next, navigate to your app settings in the developer portal and copy the **App ID** and **Public Key** from the **General Overview** page. Paste the values in your `.env` file as `APP_ID` and `PUBLIC_KEY`.

Finally, fetch your server’s ID by navigating to the server where you installed your app. Copy the first number in the URL after `channels/` (for example, in the URL `https://discord.com/channels/12345/678910`, the server ID would be `12345`). Save this value as `GUILD_ID` in your `.env` file.

With all your credentials configured, let's install and handle slash commands.

### Installing slash commands

If you look in the `listen` callback at the bottom of `app.js`, you’ll see that a `HasGuildCommands()` is called. This is a utility function that checks whether specific slash commands are installed—and if they aren't, installs them. The code for `HasGuildCommands()` is inside of the top-level `commands.js` file.

To install guild slash commands, apps can call the [`​​/applications/<APP_ID>/guilds/<GUILD_ID>/commands`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/create-guild-application-command) endpoint (which is what `HasGuildCommands()` does). An example of just installing and handling slash commands can be found within the `examples/` folder, in `examples/command.js`.

> info
> To install slash commands, the app is using the [`axios` client](https://axios-http.com/docs/intro) that's instantiated at the top of `app.js`. More information about the HTTP API can be found in [the API reference](#DOCS_REFERENCE).

If you go back to your guild and refresh it, you should see the slash command appear. But if you try to run it, nothing will happen because the request coming from Discord isn't being handled.

## Handling interactivity

To enable your app to receive slash command requests or other interactions, Discord needs a public URL to send them. This URL can be configured in your app settings as **Interaction Endpoint URL**.

### Adding interaction endpoint URL
Glitch has a public URL for your project exposed by default, which you can copy by clicking **Share**, then copying the live project link at the bottom (in the following example, the link would be `https://vast-thorn-plant.glitch.me`):

![Glitch share modal](glitch-project-share.png)

With that link copied, go to your app settings from the developer portal.

On your app’s **General Information** page, there’s an **Interactive Endpoint URL** option, where you can paste your app’s URL and append `/interactions` to it, which is where the Express app is configured to listen for requests.

![Interactions endpoint URL in app settings](interactions-url.png)

Click **Save Changes** and ensure your endpoint is successfully verified.

> info
> Verification requires your app to verify signature headers as well as respond to ping events (events with a type of `1`). You can read more about preparing to receive interactions in [the documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction).

The sample app handles verification in two ways:
- It uses the `PUBLIC_KEY` and [discord-interactions package](https://github.com/discord/discord-interactions-js#usage) with a wrapper function in `utils.js` to make it conform to [Express’s `verify` interface](http://expressjs.com/en/5x/api.html#express.json). This is run on every incoming request to your app.
- It responds to incoming `PING` requests.

### Handling slash command requests

With the endpoint verified, go back to your code (in `app.js`) and look for the code block that handles the `/test` command:

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

This code is responding to the interaction with a message in the channel it originated from. You can see all of the different possible response types, like responding with a modal, [in the documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type).

> info
> `InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE` is an enum [exported from `discord-interactions`](https://github.com/discord/discord-interactions-js/blob/main/src/index.ts#L33)

Go to the server that matches your configured `GUILD_ID` and make sure your app’s `/test` slash command works. When you trigger it, it should send “hello world” with a random emoji.

If you don’t want to add any additional interactivity, you could skip to [next steps](#DOCS_GETTING_STARTED/next-steps). But in the following section, we’ll add an additional command that uses slash command options, buttons, and select menus to build the rock-paper-scissors-style game.

## Adding message components

The `/challenge` command will be how our rock-paper-scissors-style game is initiated. When the command is triggered, the app will send message components to channel, which will guide the users to complete the game.

### Adding a command with options

The `/challenge` command, exported as `CHALLENGE_COMMAND` in `commands.js`, has an array of `options`. For this app, the options are the different objects a user can select for our game, which is generated using keys of `RPSChoices` in `game.js`.

You can read more about command options [in the documentation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS#APPLICATION_COMMAND_OBJECT_APPLICATION_COMMAND_OPTION_STRUCTURE).

> info
> While this guide won't touch much on the `game.js` file, feel free to poke around and change commands or the options in the commands.

To handle the `/challenge` command, add the following code after the `if name === “test”` if block:

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

> info
> If you aren’t sure where to paste the code, you can see the full code in `examples/app.js` in the Glitch project or the root `app.js` [on Github](https://github.com/shaydewael/discord-getting-started/blob/main/app.js).

This code is doing a few things:
1. Parses the request body to pull out the ID of the member (`userId`) who triggered the slash command, and the option (object choice) they selected (`objectName`).
2. Adds a new game to the `activeGames` object using the interaction ID. The active game records the `userId` and `objectName`.
3. Sends a message back to the channel with a button with a `custom_id` of `accept_button_<SOME_ID>`.

> warn
> The sample code uses an object as in-memory storage, but for production apps it's recommended to use a database.

When sending a message with [message components](DOCS_INTERACTIONS_MESSAGE_COMPONENTS/what-is-a-component), the components' payloads are added to a `components` array. Actionable components (like buttons) need to be inside of an [action row](DOCS_INTERACTIONS_MESSAGE_COMPONENTS/action-rows), which you can see in the code sample.

Note the unique `custom_id` sent with message components, in this case `accept_button_` with the active game's ID appended to it. A `custom_id` can be used to handle requests that Discord sends you when someone interacts with the component, which you'll see in a moment.

Now when you run the `/challenge` command and pick an option, your app will send a message with an **Accept** button, though we still need to add the code to handle it.

### Handling buttons

When users interact with one of your app's message components, Discord will send a request with an [interaction type](DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-type) of `3` (or the  `MESSAGE_COMPONENT` value when using `discord-interactions`).

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
1. Checks for a `custom_id` that matches what we sent (in this case, it starts with `accept_button_`). The custom ID also has the active game ID appended, so we store that in the `gameID` variable.
2. [Deletes the original message](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/delete-original-interaction-response) with a webhook using the unique interaction `token` in the request body and the `axios` client. This is done to clean up the channel, and so other users can’t click the button.
3. Responds to the request by sending a message which contains a select menu with the options for the rock-paper-scissors game. The payload should look fairly similar to the one that had the button with the exception of the `options` array and `flags: 64`, [which indicates that the message is ephemeral](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/create-followup-message).

The `options` array is populated using the `getShuffledOptions()` method in `game.js`, which manipulates the `RPSChoices` values to conform to the shape of message component options, which you can read more about [in the documentation](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object-select-option-structure).

### Handling select menus

The last thing to do is handle the request sent when the select menu is interacted with, and send the result to channel.

The code to handle the select menu interaction is similar to the button. Modify the code above to include a handler for the select menu at the end:

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

Those values, along with the original user's ID and selection stored in the `activeGames` object, are passed to the `getResult()` function. `getResult()` determines the winner, then builds a readable string to send back into channel.

We’re also calling another webhook, this time to [update the follow-up ephemeral message](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/edit-followup-message).

Finally, the results are sent in a message using the `CHANNEL_MESSAGE_WITH_SOURCE` interaction response type.

....and that's it 🎊 Go ahead and test your app and make sure everything works.

## Next steps

Congrats on building your first Discord app! 🤖

Hopefully you learned a bit about Discord apps, how to configure them, and how to make them interactive. From here, you can continue building out your app or explore what else is possible:
- Read **[the documentation](#DOCS_INTRO)** for in-depth information about API features
- Browse the `examples/` folder in this project for smaller, feature-specific code examples
- Join the **[Discord Developers server](https://discord.gg/discord-developers)** to ask questions about the API, attend events hosted by the Discord API team, and interact with other devs
- Check out **[community resources](#DOCS_TOPICS_COMMUNITY_RESOURCES)** for language-specific tools maintained by community members
