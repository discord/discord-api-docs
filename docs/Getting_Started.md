# Getting started with Discord App Development

Discord applications let you customize your servers with interactions and automation. This guide is meant to walk through building and running your first Discord app using JavaScript. At the end of this guide, you’ll have an app with a bot user that uses slash commands, sends messages, and interacts with message components.

While this guide is beginner-focused, it assumes you to have a basic understanding of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics).

> info
> When developing apps, you should build and test in a server that isn’t actively used by others. If you don’t have your own server already, you can [create one for free](https://support.discord.com/hc/en-us/articles/204849977-How-do-I-create-a-server-).

---

## Overview

In this guide, we’ll be building a Discord app that lets server members play a *slightly*-enhanced version of rock paper scissors (with 7 choices instead of the usual 3).

### Resources used in this guide
- **[Github repository](https://github.com/discord/discord-example-app)** where the code from this guide lives along with additional feature-specific examples.
- **[discord-interactions](https://github.com/discord/discord-interactions-js)**, an npm package which provides types and helper functions for Discord apps.
- **[Glitch](https://glitch.com/)**, an online environment that simplifies building and hosting apps during early prototyping and development. You can also develop locally with a tool like **[ngrok](https://ngrok.com/)**.

And here's what the finished app will look like:

![Demo of example app](getting-started-demo.gif)

To make the user flow a bit more explicit:
1. User 1 initiates a new game and picks their object using the app’s `/challenge` slash command.
2. A message is sent to channel with a button inviting others to accept the challenge.
3. User 2 presses the **Accept** button to accept the challenge.
4. User 2 is sent an ephemeral message where they select their object of choice.
5. The result of the game is posted back into the original channel for all to see.

## Creating an app

The first thing we’ll need to do is to create an app. Navigate to the [developer dashboard](https://discord.com/developers/applications), then click on the **New Application** Tab in the upper right corner.

![App creation modal](app-create-modal.png)

Enter a name for your application, then click **Create**.

Once you create an app, you'll land on the **General Overview** page of the app's settings. Here you can view and configure basic information about the app, like its description and icon. You’ll also see an **Application ID** and **Interactions Endpoint URL**, which we’ll use a bit later in the guide.

### Configuring a bot

Next we'll add a bot user to your app, which allows it to appear in Discord similar to other members. On the left hand sidebar click **Bot**, then the **Add Bot** button.

Once you create a bot, you’ll have an option to update its icon and username. Under that, there’s a **Token** section with a **Reset Token** button.

![Bot tab in app settings](app-add-bot.png)

Bot tokens are used to authorize API requests and carry all of your bot user’s permissions, making them *highly sensitive*. Make sure to *never* share your token, make it public or check it into any kind of version control.

Go ahead and click **Reset Token**, and store the token somewhere safe (like in a password manager).

> warn
> You won’t be able to view your token again unless you regenerate it, so make sure to keep it somewhere safe. 

### Adding scopes and permissions

Apps need approval from installing users to perform actions inside of their Discord server (like creating a slash command or adding emojis). So before installing your app, let's add some scopes and permissions to request during installation. Click on **OAuth2** in the left sidebar, then **URL Generator**.

> info
> The URL generator helps create an installation link with the scopes and permissions your app needs to function. You can use the link to install the app onto your server, or share it with others so they can install it on their own.

For now, we’ll just add two scopes:
- `applications.commands` lets your app create commands in guilds its installed
- `bot` is to enable your bot user. After you click bot, you can also add different user permissions to the bot. For now, just check **Send Messages**.

See a list of all [OAuth2 scopes](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes), or read more on [user permissions](#DOCS_TOPICS_PERMISSIONS) in the documentation.

![URL generator screenshot](url-generator.png)

Once you add scopes, you should see a URL that you can copy to install your app.

### Installing your app

Copy the URL from above, and paste it into your browser. You’ll be guided through the installation flow, where you should make sure you’re installing the app on a server where you can develop and test.

After installing your app, you can head over to your server and see that it has joined ✨

With your app configured and installed, let’s start developing it.

## Running your app

All of the code used in the example app can be found in [the Github repository](https://github.com/discord/discord-example-app).

To make development a bit simpler, the app uses [discord-interactions](https://github.com/discord/discord-interactions-js), which provides types and helper functions. If you prefer to use other languages or libraries, there’s [a page with community-built resources](#DOCS_TOPICS_COMMUNITY_RESOURCES) which you can browse through.

### Remix the project

This guide uses Glitch, which allows you to quickly clone and develop an app from within your browser. There are also instructions given on developing locally, using ngrok [in the README](https://github.com/discord/discord-example-app#running-app-locally) if you'd prefer.

> info
> While Glitch is great for development and testing, [it has technical limitations](https://help.glitch.com/kb/article/17-technical-restrictions/) so other hosting providers should be considered for production apps.

To start, **[remix (or clone) the Glitch project 🎏](https://glitch.com/edit/#!/remix/getting-started-discord)**

When you remix the project, you'll see a new Glitch project with a unique name similar to this:

![Glitch project overview](glitch-project.png)

#### Project Structure

All of the files for the project are on the left-hand side. Here's a quick glimpse at the structure of the project:

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

There's already some code in your `app.js` file, but you’ll need your app’s token and ID to make requests. All of your credentials can be stored directly in the `.env` file.

> warn
> It bears repeating that you should *never* check any credentials or secrets into source control. The getting started project's `.gitignore` comes pre-loaded with `.env` to prevent it.

First, copy your bot user’s token from earlier and paste it in the **`DISCORD_TOKEN`** variable in your `.env` file.

> info
> .env is such a file where all your sensitive crenditials and data stored, cannot be accessed by anyone even if it is public i.e. it remains safe within the user's environment.

Next, navigate to your app settings in the developer portal and copy the **App ID** and **Public Key** from the **General Overview** page. Paste the values in your `.env` file as **`APP_ID`** and **`PUBLIC_KEY`**.

Finally, fetch your guild ID by navigating to the server where you installed your app. Copy the first number in the URL after `channels/` (for example, in the URL `https://discord.com/channels/12345/678910`, the guild ID would be `12345`). Save this value as **`GUILD_ID`** in your `.env` file.

With your credentials configured, let's install and handle slash commands.

### Installing slash commands

> info
> To install slash commands, the app is using [`node-fetch`](https://github.com/node-fetch/node-fetch). You can see the implementation for the installation in `utils.js` within the `DiscordRequest()` function. More information about Discord's REST API can be found in [the API reference](#DOCS_REFERENCE).

If you look in the `listen` callback at the bottom of `app.js`, you’ll see that `HasGuildCommands()` is called. `HasGuildCommands()` is a utility function that checks whether specific slash commands are installed—and if they aren't, installs them. The code for `HasGuildCommands()` is inside of the top-level `commands.js` file.

To install guild-scoped slash commands, apps can call the [`​​/applications/<APP_ID>/guilds/<GUILD_ID>/commands`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/create-guild-application-command) endpoint (which is what `HasGuildCommands()` does). An example focused on installing and handling slash commands can be found within the `examples/` folder, in `examples/command.js`.

> info
> Commands can either be installed to a specific guild, or installed globally, though guild commands are recommended for development since they update faster. Read more about the differences [in the documentation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/registering-a-command).

If you go back to your guild and refresh it, you should see the slash command appear. But if you try to run it, nothing will happen because the request coming from Discord isn't being handled.

## Handling interactivity

To enable your app to receive slash command requests (and other interactions), Discord needs a public URL to send them. This URL can be configured in your app settings as **Interaction Endpoint URL**.

### Adding interaction endpoint URL
Glitch projects have a public URL exposed by default. Copy your project's URL by clicking **Share** in the top right, then copying the live project link at the bottom of the modal.

In the following example, the link would be `https://vast-thorn-plant.glitch.me`:

![Glitch share modal](glitch-project-share.png)

> info
> If you're developing locally, there are instructions for tunneling requests to your local environment [on the Github README](https://github.com/discord/discord-example-app#running-app-locally).

With that link copied, go to your app settings from [the developer portal](https://discord.com/developers/applications).

On your app’s **General Information** page, there’s an **Interactive Endpoint URL** option, where you can paste your app’s URL and append `/interactions` to it, which is where the Express app is configured to listen for requests.

![Interactions endpoint URL in app settings](interactions-url.png)

Click **Save Changes** and ensure your endpoint is successfully verified.

> info
> Verification requires your app to verify signature headers and respond to `PING` events. You can read more about preparing to receive interactions in [the interactions documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction).

The sample app handles verification in two ways:
- It uses the `PUBLIC_KEY` and [discord-interactions package](https://github.com/discord/discord-interactions-js#usage) with a wrapper function (imported from `utils.js`) that makes it conform to [Express’s `verify` interface](http://expressjs.com/en/5x/api.html#express.json). This is run on every incoming request to your app.
- It responds to incoming `PING` requests.

### Handling slash command requests

With the endpoint verified, go back to your code (in `app.js`) and look for the code block that handles the `/test` command:

```javascript
// "test" guild command
if (name === 'test') {
    // Send a message into the channel where command was triggered from
    return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        // Fetches a random emoji to send from a helper function
        content: 'hello world ' + getRandomEmoji(),
    },
    });
}
```

The above code is responding to the interaction with a message in the channel it originated from. You can see all of the different possible response types, like responding with a modal, [in the documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type).

> info
> `InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE` is a constant [exported from `discord-interactions`](https://github.com/discord/discord-interactions-js/blob/main/src/index.ts#L33)

Go to the server that matches your configured `GUILD_ID` and make sure your app’s `/test` slash command works. When you trigger it, your app should send “hello world” with a random emoji appended.

If you don’t want to add any additional interactivity, you could skip to [next steps](#DOCS_GETTING_STARTED/next-steps). But in the following section, we’ll add an additional command that uses slash command options, buttons, and select menus to build the rock-paper-scissors game.

## Adding message components

The `/challenge` command will be how our rock-paper-scissors-style game is initiated. When the command is triggered, the app will send message components to the channel, which will guide the users to complete the game.

### Adding a command with options

The `/challenge` command, exported as `CHALLENGE_COMMAND` in `commands.js`, has an array called `options`. For this app, the options are the different objects a user can select for our game, generated using keys of `RPSChoices` in `game.js`.

You can read more about command options and their structure [in the documentation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure).

> info
> While this guide won't touch much on the `game.js` file, feel free to poke around and change commands or the options in the commands.

To handle the `/challenge` command, add the following code after the `if name === “test”` if block:

```javascript
// "challenge" guild command
if (name === 'challenge' && id) {
    const userId = req.body.member.user.id;
    // User's object choice
    const objectName = req.body.data.options[0].value;

    // Create active game using message ID as the game ID
    activeGames[id] = {
        id: userId,
        objectName,
    };

    return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        // Fetches a random emoji to send from a helper function
        content: `Rock papers scissors challenge from <@${userId}>`,
        components: [
        {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
            {
                type: MessageComponentTypes.BUTTON,
                // Append the game ID to use later on
                custom_id: `accept_button_${req.body.id}`,
                label: 'Accept',
                style: ButtonStyleTypes.PRIMARY,
            },
            ],
        },
        ],
    },
    });
}
```

> info
> If you aren’t sure where to paste the code, you can see the full code in `examples/app.js` in the Glitch project or the root `app.js` [on Github](https://github.com/discord/discord-example-app/blob/main/app.js).

The above code is doing a few things:
1. Parses the request body to get the ID of the user who triggered the slash command (`userId`), and the option (object choice) they selected (`objectName`).
2. Adds a new game to the `activeGames` object using the interaction ID. The active game records the `userId` and `objectName`.
3. Sends a message back to the channel with a button with a `custom_id` of `accept_button_<SOME_ID>`.

> warn
> The sample code uses an object as in-memory storage, but for production apps you should use a database.

When sending a message with [message components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/what-is-a-component), the individual payloads are appended to a `components` array. Actionable components (like buttons) need to be inside of an [action row](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/action-rows), which you can see in the code sample.

Note the unique `custom_id` sent with message components, in this case `accept_button_` with the active game's ID appended to it. A `custom_id` can be used to handle requests that Discord sends you when someone interacts with the component, which you'll see in a moment.

Now when you run the `/challenge` command and pick an option, your app will send a message with an **Accept** button. Let's add code to handle the button press.

### Handling button interactions

When users interact with a message component, Discord will send a request with an [interaction type](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-type) of `3` (or the  `MESSAGE_COMPONENT` value when using `discord-interactions`).

To set up a handler for the button, we’ll check the `type` of interaction, followed by matching the `custom_id`. Paste the following code under the type handler for `APPLICATION_COMMAND`s:

```javascript
if (type === InteractionType.MESSAGE_COMPONENT) {
// custom_id set in payload when sending message component
const componentId = data.custom_id;

  if (componentId.startsWith('accept_button_')) {
    // get the associated game ID
    const gameId = componentId.replace('accept_button_', '');
    // Delete message with token in request body
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    try {
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'What is your object of choice?',
          // Indicates it'll be an ephemeral message
          flags: InteractionResponseFlags.EPHEMERAL,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  // Append game ID
                  custom_id: `select_choice_${gameId}`,
                  options: getShuffledOptions(),
                },
              ],
            },
          ],
        },
      });
      // Delete previous message
      await DiscordRequest(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }
}
```

To briefly go over what the above code is doing:
1. Checks for a `custom_id` that matches what we originally sent (in this case, it starts with `accept_button_`). The custom ID also has the active game ID appended, so we store that in `gameID`.
2. [Deletes the original message](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/delete-original-interaction-response) calling a webhook using `node-fetch` and passing the unique interaction `token` in the request body. This is done to clean up the channel, and so other users can’t click the button.
3. Responds to the request by sending a message that contains a select menu with the object choices for the game. The payload should look fairly similar to the previous one, with the exception of the `options` array and `flags: 64`, [which indicates that the message is ephemeral](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/create-followup-message).

The `options` array is populated using the `getShuffledOptions()` method in `game.js`, which manipulates the `RPSChoices` values to conform to the shape of [message component options](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object-select-option-structure).

### Handling select menu interactions

The last thing to add is code to handle select menu interactions and send the result of the game to channel.

Since select menus are just another message component, the code to handle interactions with them will be similar to buttons. Modify the code above to handle the select menu:

```javascript
if (type === InteractionType.MESSAGE_COMPONENT) {
// custom_id set in payload when sending message component
const componentId = data.custom_id;

  if (componentId.startsWith('accept_button_')) {
    // get the associated game ID
    const gameId = componentId.replace('accept_button_', '');
    // Delete message with token in request body
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    try {
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'What is your object of choice?',
          // Indicates it'll be an ephemeral message
          flags: InteractionResponseFlags.EPHEMERAL,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  // Append game ID
                  custom_id: `select_choice_${gameId}`,
                  options: getShuffledOptions(),
                },
              ],
            },
          ],
        },
      });
      // Delete previous message
      await DiscordRequest(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  } else if (componentId.startsWith('select_choice_')) {
    // get the associated game ID
    const gameId = componentId.replace('select_choice_', '');

    if (activeGames[gameId]) {
      // Get user ID and object choice for responding user
      const userId = req.body.member.user.id;
      const objectName = data.values[0];
      // Calculate result from helper function
      const resultStr = getResult(activeGames[gameId], {
        id: userId,
        objectName,
      });

      // Remove game from storage
      delete activeGames[gameId];
      // Update message with token in request body
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

      try {
        // Send results
        await res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: resultStr },
        });
        // Update ephemeral message
        await DiscordRequest(endpoint, {
          method: 'PATCH',
          body: {
            content: 'Nice choice ' + getRandomEmoji(),
            components: []
          }
        });
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  }
}
```

Similar to earlier code, the code above is getting the user ID and their object selection from the interaction request.

That information, along with the original user's ID and selection from the `activeGames` object, are passed to the `getResult()` function. `getResult()` determines the winner, then builds a readable string to send back to channel.

We’re also calling another webhook, this time to [update the follow-up ephemeral message](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/edit-followup-message) since it can't be deleted.

Finally, the results are sent in channel using the `CHANNEL_MESSAGE_WITH_SOURCE` interaction response type.

....and that's it 🎊 Go ahead and test your app and make sure everything works.

## Next steps

Congrats on building your first Discord app! 🤖

Hopefully you have learned a bit about Discord apps, how to configure them, and how to make them interactive. From here, you can continue building out your app or explore what else is possible:
- Read **[the documentation](#DOCS_INTRO)** for in-depth information about API features
- Browse the `examples/` folder in this project for smaller, feature-specific code examples
- Check out **[community resources](#DOCS_TOPICS_COMMUNITY_RESOURCES)** for language-specific tools maintained by community members
- Read our tutorial on [hosting Discord apps on Cloudflare Workers](#DOCS_TUTORIALS_HOSTING_ON_CLOUDFLARE_WORKERS)
- Join the **[Discord Developers server](https://discord.gg/discord-developers)** to ask questions about the API, attend events hosted by the Discord API team, and interact with other devs.
