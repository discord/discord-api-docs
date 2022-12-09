# Configuring App Metadata for Linked Roles

Linked roles are a type of role in Discord that requires a user to connect to 3rd-party services and meet defined criteria. A role's criteria could just include the user connecting to that service, but it's often more narrow—like having a verified account, having certain stats, or having more than a certain number of followers.

Apps can define their own [role connection metadata](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA), which admins can use to configure linked roles in servers where that app is installed. Apps must also set up an [OAuth2 flow](#DOCS_TOPICS_OAUTH2) to allow users to authenticate and grant the required `role_connections.write` scope.

This tutorial walks through building a Discord app in JavaScript with linked roles support.

> info
> All of the sample code used in this tutorial can be found in the [`linked-roles-sample` Github repo](https://github.com/discord/linked-roles-sample)

---

## Creating an app

The first thing we’ll do is create an app through the [developer dashboard](https://discord.com/developers/applications). If you already have an app created, you can jump right to the [Running your app](#DOCS_TUTORIALS_CONFIGURING_APP_METADATA_FOR_LINKED_ROLES/running-your-app) section.

> info
> Basic steps to create an app are outlined below, but a more detailed walkthrough is in the [Getting Started guide](#DOCS_GETTING_STARTED). 

- Navigate to the [developer dashboard](https://discord.com/developers/applications)
- Click **New Application** in the upper right corner, then select a name and create your app
- Click on the `Bot` tab on the left sidebar, then the **Add Bot** button
- After the bot is created, click **Reset Token** and store the token somewhere safe (like in a password manager)

> warn
> Bot tokens are used to authorize API requests and carry your bot's permissions, making them highly sensitive. Never share your token or check it into any kind of version control.

### Adding scopes

Apps need approval from installing users to perform actions inside of Discord. So before installing your app, let's add some scopes to request during installation.

- Click on `OAuth2` in the left sidebar, then `URL generator`
- Check the `bot` scope
- After the scope is selected, you should see a **Generated URL** which can be used to install your app
 
> info
> See a list of all [OAuth2 scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes), or read more on [user permissions](https://discord.com/developers/docs/topics/permissions) in the documentation.

### Installing your app

Copy the **Generated URL** from above, and paste it into your browser. You’ll be guided through the installation flow, where you should make sure you’re installing the app on a server where you can develop and test.

After installing your app, you can head over to your server and see that it has joined ✨

## Running your app

All of the code used in the example app can be found in the [Github repository](https://github.com/discord/linked-roles-sample).

### Remix the project

This guide uses Glitch, which allows you to quickly clone and develop an app from within your browser. There are also instructions on developing locally using ngrok in the README if you'd prefer.

> While Glitch is great for development and testing, [it has technical limitations](https://help.glitch.com/kb/article/17-technical-restrictions/) so other hosting providers should be considered for production apps.

To start, [remix (or clone) the Glitch project 🎏](https://glitch.com/edit/#!/remix/linked-role-discord-bot)

When you remix the project, you'll see a new Glitch project with a unique name similar to this:

![Glitch Remix](linked-roles-glitch.png)

#### Project structure

All of the files for the project are on the left-hand side. Here's a quick glimpse at the structure:

```
├── assets     -> images used in this tutorial
├── src
│  ├── config.js  -> Parsing of local configuration
│  ├── discord.js -> Discord specific auth & API wrapper
│  ├── register.js -> Tool to register the metadata schema
│  ├── server.js  -> Main entry point for the application
│  ├── storage.js -> Provider for storing OAuth2 tokens
├── .env -> your credentials and IDs
├── .gitignore
├── package.json
└── README.md
```

### Configure your app

There's already some code in your `server.js` file, but you’ll need your app’s token and ID to make requests. All of your credentials can be stored directly in the `.env` file.

> It bears repeating that you should never check any credentials or secrets into source control. The getting started project's `.gitignore` comes pre-loaded with `.env` to prevent it.

First, copy your bot user’s token from earlier and paste it in the `DISCORD_TOKEN` variable in your `.env` file.

Next, navigate to your app settings in the developer portal, and navigate to OAuth2 -> General. Copy the Client ID and Client Secret for your application, and paste the values as `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` in your `.env`. 

![Configure OAuth2](linked-roles-oauth-config.png)

Now, we need to set the Redirect URL that will be used for our OAuth2 flow. Go back to Glitch, and click the `Share` button for your project. Copy the public live URL for your app:

![Glitch Share](linked-roles-glitch-share-url.png)

Go back to the OAuth2 -> General tab in the Discord developer portal, and add a new redirect for your app using the Glitch URL and the `/discord-oauth-callback` route. Copy this URL, then paste it as `DISCORD_REDIRECT_URI` in your `.env`. 

Go to the General Information tab in the developer portal, and scroll down to the `Linked Roles Verification Url` field. Paste the base URL to your Glitch app, add the `/linked-role` route, then save.

> info
> For the Glitch project used in the screenshots, the verification URL would be `https://adjoining-crawling-yamamomo.glitch.me/linked-role`

![Verify endpoint](linked-roles-verify-endpoint.png)

Finally, to generate a unique cookie secret, go back to Glitch, and click on the `Terminal` tab. Run the following commands:

```
$ node
crypto.randomUUID()
```

Copy the randomly generated UUID, and paste it into your `.env` as `COOKIE_SECRET`. Your `.env` should look something like this:

```
DISCORD_CLIENT_ID: <your OAuth2 client Id>
DISCORD_CLIENT_SECRET: <your OAuth2 client secret>
DISCORD_TOKEN: <your bot token>
DISCORD_REDIRECT_URI: https://<your-project-name>.glitch.me/discord-oauth-callback
COOKIE_SECRET: <random generated UUID>
```

## Registering your metadata schema

As a one-time step, you must tell Discord which metadata fields you are going to allow admins to use for linked roles associated with your app.

To configure connection metadata for your app, you'll call the [PUT /users/@me/applications/<application_id>/role-connection](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/update-application-role-connection-metadata-records) method with [application connection role metadata](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/application-role-connection-metadata-object). In the sample app, this is handled in [`src/register.js`](https://github.com/discord/linked-roles-sample/blob/main/src/register.js), and can be run via the command line.

Go back to Glitch, click the **terminal** tab, and run the following command:

```
$ node src/register.js
```

![Register Metadata Schema](linked-roles-register.png)

## Trying it out

Now that you've built your app, let's give it a try both from the server owner and the user's perspective.

### Creating the linked role

To try out the app, we'll create a linked role in a server where you have admin permissions. Open up the **Server Settings**, select **Roles**, and click on `Create Role`.

Give the role a name, save it, then click on `Links`. Click the `Add requirement` button, and you should see your bot in the list of available Apps. Click on it, and you will see a setup screen where you can configure specific criteria for your role.

![Verification Setup](linked-roles-verification-setup.png)

### Acquiring the role

To acquire your newly created role, click the server name in the upper left corner of the screen, and select `Linked Roles`. Click on your role, and it will present the opportunity to connect your account.

> info
> When you connect your account, one of the scopes requested in the OAuth flow is `role_connections.write`, which is required for an app to update a user's role connection information.

![Connect accounts](linked-roles-connect-account.png)

Click on the linked role criteria. This should lead to the Discord OAuth2 consent screen. Click `Authorize`, and then return to Discord. 

![Consent Dialog](linked-roles-consent-dialog.png)

After returning to Discord, you should see your account granted the linked role.

![Connected](linked-roles-connected.png)

Finally, create a new private channel, and add the new linked role.

## Tips & Tricks

### Token storage

This app largely relies on Discord's [OAuth2](https://discord.com/developers/docs/topics/oauth2) implementation to obtain access tokens. This model of user based authentication relies on storing refresh tokens, and using them to acquire access tokens. The example code in [`src/storage.js`](https://github.com/discord/linked-roles-sample/blob/main/src/storage.js) uses in-memory storage to manage these tokens, but for any production deployment a database with persistent storage should be used. 

### Advanced examples

For a more complex example using the Fitbit API, see https://github.com/JustinBeckwith/fitbit-discord-bot/.