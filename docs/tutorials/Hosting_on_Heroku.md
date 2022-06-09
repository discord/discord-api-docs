# Hosting on Heroku

Running your app locally can be helpful for development but once it's is ready for production, you should consider using a hosting provider. This tutorial guides you through deploying, managing, and monitoring a Discord app on [Heroku](https://www.heroku.com/).

The app we're building bakes bread (with varying degrees of success) through a Discord app. The source code for the app can be found [on Github](https://github.com/discord/heroku-sample-app).

![Discord app for tutorial](heroku-baking.gif)

### Features and technologies used

- [Slash commands](https://discord.com/developers/docs/interactions/application-commands)
- [Interactive buttons](https://discord.com/developers/docs/interactions/message-components#buttons)
- [Discord.JS v13](https://discord.js.org/#/)
- [Heroku](https://www.heroku.com/)

---

### Project structure

```
├── commands        -> sample commands
│   ├── breads.js
│   ├── cakes.js
│   ├── cookies.js
│   ├── pies.js
│   ├── createRoles.js
│   ├── setup.js
├── .env            -> sample .env file
├── index.js        -> main entrypoint for app
├── src    
│   ├── startup.js  -> slash command payload
│   ├── img
│   ├── handlers    -> utility functions
│   │   ├── rng.js
│   │   ├── cache.js
│   │   ├── oven.js
├── Procfile        -> heroku start
├── package.json
├── README.md
└── .gitignore
```

## Cloning and configuring baker bot

If you have your own application to deploy, you can skip the `baker-bot` setup. However, you'll still need to add a `Procfile`, which specifies which commands are run when your Heroku app starts up. You can read about `Procfile`s in [Heroku's documentation](https://devcenter.heroku.com/articles/procfile).

### Prepping required components

> INFO
> If you don't have git configured, you can read [the Git reference](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)

To configure your app locally, first clone the repository and install the dependencies.

```bash
# Clone the respository
git clone heroku-sample-app

# Enter into the directory
cd heroku-sample-app

# Install the dependencies
npm install
```

After your dependencies are installed, you'll create your app and configure Heroku.

### Creating your app and fetching credentials

Before creating your app, rename `.sample.env` to `.env` in in the `heroku-baker` directory. Your `.env` should include the following for this bot to operate properly:

```
TOKEN=
GUILD_ID=
CLIENT_ID=
```

> info
> Enabling Developer Mode in your Discord client will let you right-click fetch the IDs for your guild (`GUILD_ID`) and bot application (`CLIENT_ID`).

To create your Discord app, go to the [app configuration](https://discord.com/developers/applications) and click **New Application** in the upper-right corner.

Then click on the **Bot** tab and create a bot. Generate and copy the bot token into your `.env` file.

![Discord bot token](heroku-token.png)

After your bot is created, go to **OAuth2** on the sidebar and copy the **Client ID** into your `.env` file.

Then click **URL Generator**. Add the `applications.commands` and `bot` scopes.

![OAuth2 URL Generator](cloudflare-url-generator.png)

To install your app, copy and paste the URL in your browser and follow the installation flow. Make sure to install the app into a server where you can test and develop. Once your app is installed copy the **Guild ID** for the server where you installed your app.

## Setting up Heroku

The first thing you should do is set up an account for Heroku.

Head over to https://id.heroku.com/login and log in to your account, or [set up a new account](https://signup.heroku.com/) if you don’t have one.

![Heroku login](heroku-login.png)

After logging in, at the top right corner of your account dashboard, click New > Create new app. You can then name it whatever you want.

### Adding a Procfile

For your app to work with Heroku, you'll need to add a `Procfile`. **Create a new file called `Procfile`** where you will add a short script that Heroku will run when starting up your app.

> info
> For folks following the tutorial and using the [sample repo](https://github.com/discord/heroku-sample-app), the `Procfile` will already be configured appropriately. Otherwise, the script in your `Procfile` will vary depending on what language you're coding in.

```bash
# Procfile contents for bakerbot (startup)
worker node index.js
```

You now have an empty application for Heroku that's ready to be linked to your repository.

## Connecting Heroku to GitHub

In this tutorial, we'll use a Github repository as the source for the Heroku app. Before you can deploy, you should [push your project to Github](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).

> INFO
> If you prefer to deploy from your local app, you can [use the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

After you have your GitHub repo and Heroku application set up, you will be met with some options in the **Deploy** tab. From here, you have several deployment method options to choose from

![Heroku dashboard](heroku-connectGH.png)

Click **Connect this app to GitHub**.
 
> INFO
> that you can only connect Heroku apps to a single GitHub repository. 

From there, you will be able to manage the app's deployment method:

![Heroku deployment](heroku-deploy.png)

Selecting a branch and enabling **Automatic Deploys** for your app will deploy a new version of this app every time a push occurs. **Manual Deploys** would require you to select a specific branch before updates go live for your bot. 

> INFO
> If you want to do this with the Heroku CLI, there are [separate steps in the dashboard](https://devcenter.heroku.com/articles/heroku-cli) you can follow to accomplish this.

## Configuring app in Heroku

Before your app can go online, you'll have to configure your Heroku environment with your Discord bot's credentials.

### Adding app credentials

> INFO
> If you're developing your app locally, you can store your credentials in a `.env` file (see `.sample.env` for an example)

With that said, in the **Settings** tab, add your bot’s `TOKEN`, `GUILD_ID`, `CLIENT_ID`, and any other tokens or API keys it may require to operate properly to the list of config vars.

![Configuring variables in Heroku](heroku-configVars.png)

You'll notice that there isn't anything you have to change in your source code. Amazin'

### Adding a buildpack and configuring a dyno

The next step is to **add a buildpack to your app**. The buildpack is responsible for compiling your deployed code and installing any dependencies, meaning the one you select will also depend on how you built your bot. Since Heroku-Baker is a node app, we'll need to add the nodeJS buildpack.

![Adding a buildpack](heroku-buildpack.png)

Once you successfully connect your app to your bot's repo, you'll notice a new window in the dashboard called **Dyno formation**.

A **Dyno** is a virtualized Linux container that executes the code in `Procfile` - think of it as a mini computer dedicated to running your bot. By default, Heroku gives 550 free dyno hours per application per month. [This is just enough to keep your bot online 24/7] If your app will need additional hours, you can look at Heroku's [pricing page](https://www.heroku.com/pricing).

Congratulations, your bot is now ready to go live! 😄

In the **Overview** tab, click **Configure Dynos** then the **Edit dyno formation** button to toggle the dyno on. The script in Procfile (`node index.js`) will then run on start.

![Dyno configuration](heroku-dynos.png)

You can go in the guild you installed your app in and run any of its slash commands.

## Maintenance and how to monitor

![View logs](heroku-logs.png)

Status and updates for the dyno, any deploys as well as specific logs from your bot will be available in the **View Logs** tab. if a shard ever goes off or your bot crashes, the app will automatically restart. These events will also be [logged](https://devcenter.heroku.com/articles/logging).

## Next steps

> If you need to reference any of the code, you can find the repo [on GitHub](https://github.com/discord/heroku-sample-app)
With your app deployed on Heroku, you can start customizing it to be your own:

- Use [message components](https://discord.com/developers/docs/interactions/message-components) in your app to add more interactivity (like buttons and select menus).
- Take a look at different [public APIs](https://github.com/public-apis/public-apis) on GitHub.
- Join the [Discord Developers server](https://discord.gg/discord-developers) to ask questions about the API, attend events hosted by the Discord API team, and interact with other developers.