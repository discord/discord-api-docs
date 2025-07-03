---
sidebar_label: Application
---

# Application Resource

[Applications](#DOCS_QUICK_START_OVERVIEW_OF_APPS) (or "apps") are containers for developer platform features, and can be installed to Discord servers and/or user accounts.

### Application Object

###### Application Structure

| Field                              | Type                                                                                                                                  | Description                                                                                                                                                                                                                                |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                                 | snowflake                                                                                                                             | ID of the app                                                                                                                                                                                                                              |
| name                               | string                                                                                                                                | Name of the app                                                                                                                                                                                                                            |
| icon                               | ?string                                                                                                                               | [Icon hash](#DOCS_REFERENCE/image-formatting) of the app                                                                                                                                                                                   |
| description                        | string                                                                                                                                | Description of the app                                                                                                                                                                                                                     |
| rpc_origins?                       | array of strings                                                                                                                      | List of RPC origin URLs, if RPC is enabled                                                                                                                                                                                                 |
| bot_public                         | boolean                                                                                                                               | When `false`, only the app owner can add the app to guilds                                                                                                                                                                                 |
| bot_require_code_grant             | boolean                                                                                                                               | When `true`, the app's bot will only join upon completion of the full OAuth2 code grant flow                                                                                                                                               |
| bot?                               | partial [user](#DOCS_RESOURCES_USER/user-object) object                                                                               | Partial user object for the bot user associated with the app                                                                                                                                                                               |
| terms_of_service_url?              | string                                                                                                                                | URL of the app's Terms of Service                                                                                                                                                                                                          |
| privacy_policy_url?                | string                                                                                                                                | URL of the app's Privacy Policy                                                                                                                                                                                                            |
| owner?                             | partial [user](#DOCS_RESOURCES_USER/user-object) object                                                                               | Partial user object for the owner of the app                                                                                                                                                                                               |
| verify_key                         | string                                                                                                                                | Hex encoded key for verification in interactions and the GameSDK's [GetTicket](https://github.com/discord/discord-api-docs/blob/legacy-gamesdk/docs/game_sdk/Applications.md#getticket)                                                    |
| team                               | ?[team](#DOCS_TOPICS_TEAMS/data-models-team-object) object                                                                            | If the app belongs to a team, this will be a list of the members of that team                                                                                                                                                              |
| guild_id?                          | snowflake                                                                                                                             | Guild associated with the app. For example, a developer support server.                                                                                                                                                                    |
| guild?                             | partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object                                                                            | Partial object of the associated guild                                                                                                                                                                                                     |
| primary_sku_id?                    | snowflake                                                                                                                             | If this app is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists                                                                                                                              |
| slug?                              | string                                                                                                                                | If this app is a game sold on Discord, this field will be the URL slug that links to the store page                                                                                                                                        |
| cover_image?                       | string                                                                                                                                | App's default rich presence invite [cover image hash](#DOCS_REFERENCE/image-formatting)                                                                                                                                                    |
| flags?                             | integer                                                                                                                               | App's public [flags](#DOCS_RESOURCES_APPLICATION/application-object-application-flags)                                                                                                                                                     |
| approximate_guild_count?           | integer                                                                                                                               | Approximate count of guilds the app has been added to                                                                                                                                                                                      |
| approximate_user_install_count?    | integer                                                                                                                               | Approximate count of users that have installed the app                                                                                                                                                                                     |
| redirect_uris?                     | array of strings                                                                                                                      | Array of redirect URIs for the app                                                                                                                                                                                                         |
| interactions_endpoint_url?         | ?string                                                                                                                               | [Interactions endpoint URL](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) for the app                                                                                                                              |
| role_connections_verification_url? | ?string                                                                                                                               | Role connection verification URL for the app                                                                                                                                                                                               |
| event_webhooks_url?                | ?string                                                                                                                               | [Event webhooks URL](#DOCS_EVENTS_WEBHOOK_EVENTS/preparing-for-events) for the app to receive webhook events                                                                                                                               |
| event_webhooks_status              | [application event webhook status](#DOCS_RESOURCES_APPLICATION/application-object-application-event-webhook-status)                   | If [webhook events](#DOCS_EVENTS_WEBHOOK_EVENTS) are enabled for the app. `1` (default) means disabled, `2` means enabled, and `3` means disabled by Discord                                                                               |
| event_webhooks_types?              | array of strings                                                                                                                      | List of [Webhook event types](#DOCS_EVENTS_WEBHOOK_EVENTS/event-types) the app subscribes to                                                                                                                                               |
| tags?                              | array of strings                                                                                                                      | List of tags describing the content and functionality of the app. Max of 5 tags.                                                                                                                                                           |
| install_params?                    | [install params](#DOCS_RESOURCES_APPLICATION/install-params-object) object                                                            | Settings for the app's default in-app authorization link, if enabled                                                                                                                                                                       |
| integration_types_config?          | dictionary with keys of [application integration types](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-types) | Default scopes and permissions for each supported installation context. Value for each key is an [integration type configuration object](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-type-configuration-object) |
| custom_install_url?                | string                                                                                                                                | Default custom authorization URL for the app, if enabled                                                                                                                                                                                   |

###### Example Application Object

```json
{
  "bot_public": true,
  "bot_require_code_grant": false,
  "cover_image": "31deabb7e45b6c8ecfef77d2f99c81a5",
  "description": "Test",
  "guild_id": "290926798626357260",
  "icon": null,
  "id": "172150183260323840",
  "integration_types_config": {
    "0": {
      "oauth2_install_params": {
        "scopes": [
          "applications.commands",
          "bot"
        ],
        "permissions": "2048"
      }
    },
    "1": {
      "oauth2_install_params": {
        "scopes": [
          "applications.commands"
        ],
        "permissions": "0"
      }
    }
  },
  "name": "Baba O-Riley",
  "interactions_endpoint_url": null,
  "role_connections_verification_url": null,
  "event_webhooks_url": null,
  "event_webhooks_status": 1,
  "owner": {
    "avatar": null,
    "discriminator": "1738",
    "flags": 1024,
    "id": "172150183260323840",
    "username": "i own a bot"
  },
  "primary_sku_id": "172150183260323840",
  "slug": "test",
  "team": {
    "icon": "dd9b7dcfdf5351b9c3de0fe167bacbe1",
    "id": "531992624043786253",
    "members": [
      {
        "membership_state": 2,
        "permissions": ["*"],
        "team_id": "531992624043786253",
        "user": {
          "avatar": "d9e261cd35999608eb7e3de1fae3688b",
          "discriminator": "0001",
          "id": "511972282709709995",
          "username": "Mr Owner"
        }
      }
    ]
  },
  "verify_key": "1e0a356058d627ca38a5c8c9648818061d49e49bd9da9e3ab17d98ad4d6bg2u8"
}
```

###### Application Integration Types

Where an app can be installed, also called its supported [installation contexts](#DOCS_RESOURCES_APPLICATION/installation-context).

| Type            | ID | Description                   |
|-----------------|----|-------------------------------|
| `GUILD_INSTALL` | 0  | App is installable to servers |
| `USER_INSTALL`  | 1  | App is installable to users   |

###### Application Integration Type Configuration Object

| Field                  | Type                                                                       | Description                                                                      |
|------------------------|----------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| oauth2_install_params? | [install params object](#DOCS_RESOURCES_APPLICATION/install-params-object) | Install params for each installation context's default in-app authorization link |

###### Application Event Webhook Status

Status indicating whether event webhooks are enabled or disabled for an application.

| Name                  | Value | Description                                                      |
|-----------------------|-------|------------------------------------------------------------------|
| `DISABLED`            | `1`   | Webhook events are disabled by developer                         |
| `ENABLED`             | `2`   | Webhook events are enabled by developer                          |
| `DISABLED_BY_DISCORD` | `3`   | Webhook events are disabled by Discord, usually do to inactivity |

###### Application Flags

| Value     | Name                                          | Description                                                                                                                                                                                                                                                   |
|-----------|-----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `1 << 6`  | APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE | Indicates if an app uses the [Auto Moderation API](#DOCS_RESOURCES_AUTO_MODERATION)                                                                                                                                                                           |
| `1 << 12` | GATEWAY_PRESENCE                              | Intent required for bots in **100 or more servers** to receive [`presence_update` events](#DOCS_EVENTS_GATEWAY_EVENTS/presence-update)                                                                                                                        |
| `1 << 13` | GATEWAY_PRESENCE_LIMITED                      | Intent required for bots in under 100 servers to receive [`presence_update` events](#DOCS_EVENTS_GATEWAY_EVENTS/presence-update), found on the **Bot** page in your app's settings                                                                            |
| `1 << 14` | GATEWAY_GUILD_MEMBERS                         | Intent required for bots in **100 or more servers** to receive member-related events like `guild_member_add`. See the list of member-related events [under `GUILD_MEMBERS`](#DOCS_EVENTS_GATEWAY/list-of-intents)                                             |
| `1 << 15` | GATEWAY_GUILD_MEMBERS_LIMITED                 | Intent required for bots in under 100 servers to receive member-related events like `guild_member_add`, found on the **Bot** page in your app's settings. See the list of member-related events [under `GUILD_MEMBERS`](#DOCS_EVENTS_GATEWAY/list-of-intents) |
| `1 << 16` | VERIFICATION_PENDING_GUILD_LIMIT              | Indicates unusual growth of an app that prevents verification                                                                                                                                                                                                 |
| `1 << 17` | EMBEDDED                                      | Indicates if an app is embedded within the Discord client (currently unavailable publicly)                                                                                                                                                                    |
| `1 << 18` | GATEWAY_MESSAGE_CONTENT                       | Intent required for bots in **100 or more servers** to receive [message content](https://support-dev.discord.com/hc/en-us/articles/4404772028055)                                                                                                             |
| `1 << 19` | GATEWAY_MESSAGE_CONTENT_LIMITED               | Intent required for bots in under 100 servers to receive [message content](https://support-dev.discord.com/hc/en-us/articles/4404772028055), found on the **Bot** page in your app's settings                                                                 |
| `1 << 23` | APPLICATION_COMMAND_BADGE                     | Indicates if an app has registered global [application commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS)                                                                                                                                                     |

### Install Params Object

###### Install Params Structure

| Field       | Type             | Description                                                                                            |
|-------------|------------------|--------------------------------------------------------------------------------------------------------|
| scopes      | array of strings | [Scopes](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) to add the application to the server with |
| permissions | string           | [Permissions](#DOCS_TOPICS_PERMISSIONS) to request for the bot role                                    |

## Installation Context

An app's installation context defines how it's installed: to a server, to a user, or both.

The installation context affects how your app can be seen and used within Discord. For example, apps installed only to a user can't take actions in a server, and apps installed only to a server can't be accessed within a user's DMs.

#### Server Context

Apps installed in a server context (server-installed apps) must be authorized by a server member with the [`MANAGE_GUILD`](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) permission. Server-installed apps are *visible* to all members of the server, but other factors (like [command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/permissions)) determine where and when specific members can interact with the app.

During installation, server-installed apps are authorized with a specific set of [OAuth2 scopes](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) and [bot user permissions](#DOCS_TOPICS_PERMISSIONS) that determine what resources and data the app can access in that server.

#### User Context

Apps installed in a user context (user-installed apps) are visible *only* to the authorizing user, and therefore don't require any server-specific permissions.

Apps that support the user installation context are visible across all of an authorizing user's servers, DMs, and GDMs, but are forced to respect the user's permissions in the surface where the app is being used. For example, if a user invokes a command for a user-installed app from a server's channel where they don't have permission to send messages, the app won't be able to [respond to an interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type) with a non-ephemeral message. Details about how the installation context of a command affects interactions is in the [interaction context](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/interaction-contexts) documentation.

### Setting Supported Installation Contexts

By default, newly-created apps only support installation to guilds.

You can update which installation contexts your app supports in your [app's settings](https://discord.com/developers/applications). On the **Installation** page under the **Installation Contexts** section, you can select the installation contexts your app supports.

> info
> If you update your app to support a new installation context, you will need to update your existing [commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/contexts) if you want them to be supported in the new context. Details are in the [Application Command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/contexts) documentation.

## Install Links

Install links provide an easy way for users to install your app in Discord. If you have an install link configured, an "Add App" button will appear in your app's profile and App Directory page which will guide the user through your app's installation flow.

### Types of Install Links

There are three options when configuring an install link for your app: "Discord Provided Link", "Custom URL", and "None". If you don't configure an install link (by selecting "None"), the "Add App" button will not appear for your app, and your app will not be eligible for the App Directory.

> info
> Note that install links are distinct from OAuth2 flows like the [authorization code grant](#DOCS_TOPICS_OAUTH2/authorization-code-grant), which may additionally be required if you need to request user-specific [scopes](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) like `identify` or `role_connections.write`.

#### Discord Provided Link

The default Discord Provided Link is a short link that guides users through the installation flow with your app's [configured installation contexts](#DOCS_RESOURCES_APPLICATION/setting-supported-installation-contexts). If your app has both **User Install** and **Guild Install** enabled, the user can choose which way to install your app.

Discord Provided Links don't have scopes or bot user permissions defined in the URL. For example:

```
https://discord.com/oauth2/authorize?client_id=1234567895647001626
```

Instead, these links will prompt the user for the scopes and bot user permissions configured in your Default Install Settings.

> info
> Discord Provided Links are limited to the `application.commands` and `bot` scopes

#### Custom URL

A Custom URL is an alternative to the Discord Provided Link that gives you more control of where users are directed when they click "Add App" on your app's profile or App Directory page.

A Custom URL doesn't have strict limitations, but is commonly an [OAuth2 `/authorize` URL](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-urls) that has defined scopes, permissions, and an installation context (`integration_type`).

### Configuring an Install Link and Default Install Settings

You can configure your app's install link in your [app's settings](https://discord.com/developers/applications). On the **Installation** page, go to the **Install Link** section, and select which type of install link you want for your app. For most apps, we recommend the Discord Provided Link.

The Default Install Settings will appear on the **Installation** page when you have "Discord Provided Link" selected as your install link type.

## Get Current Application % GET /applications/@me

Returns the [application](#DOCS_RESOURCES_APPLICATION/application-object) object associated with the requesting bot user.

## Edit Current Application % PATCH /applications/@me

Edit properties of the app associated with the requesting bot user. Only properties that are passed will be updated. Returns the updated [application](#DOCS_RESOURCES_APPLICATION/application-object) object on success.

> info
> All parameters to this endpoint are optional

###### JSON Params

| Field                             | Type                                                                                                                                  | Description                                                                                                                                                                                                                                |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| custom_install_url                | string                                                                                                                                | Default custom authorization URL for the app, if enabled                                                                                                                                                                                   |
| description                       | string                                                                                                                                | Description of the app                                                                                                                                                                                                                     |
| role_connections_verification_url | string                                                                                                                                | Role connection verification URL for the app                                                                                                                                                                                               |
| install_params                    | [install params](#DOCS_RESOURCES_APPLICATION/install-params-object) object                                                            | Settings for the app's default in-app authorization link, if enabled                                                                                                                                                                       |
| integration_types_config          | dictionary with keys of [application integration types](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-types) | Default scopes and permissions for each supported installation context. Value for each key is an [integration type configuration object](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-type-configuration-object) |
| flags \*                          | integer                                                                                                                               | App's public [flags](#DOCS_RESOURCES_APPLICATION/application-object-application-flags)                                                                                                                                                     |
| icon                              | ?[image data](#DOCS_REFERENCE/image-data)                                                                                             | Icon for the app                                                                                                                                                                                                                           |
| cover_image                       | ?[image data](#DOCS_REFERENCE/image-data)                                                                                             | Default rich presence invite cover image for the app                                                                                                                                                                                       |
| interactions_endpoint_url \*\*    | string                                                                                                                                | [Interactions endpoint URL](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) for the app                                                                                                                              |
| tags                              | array of strings                                                                                                                      | List of tags describing the content and functionality of the app (max of 20 characters per tag). Max of 5 tags.                                                                                                                            |
| event_webhooks_url                | string                                                                                                                                | [Event webhooks URL](#DOCS_EVENTS_WEBHOOK_EVENTS/preparing-for-events) for the app to receive webhook events                                                                                                                               |
| event_webhooks_status             | [application event webhook status](#DOCS_RESOURCES_APPLICATION/application-object-application-event-webhook-status)                   | If [webhook events](#DOCS_EVENTS_WEBHOOK_EVENTS) are enabled for the app. `1` to disable, and `2` to enable                                                                                                                                |
| event_webhooks_types              | array of strings                                                                                                                      | List of [Webhook event types](#DOCS_EVENTS_WEBHOOK_EVENTS/event-types) to subscribe to                                                                                                                                                     |

\* Only limited intent flags (`GATEWAY_PRESENCE_LIMITED`, `GATEWAY_GUILD_MEMBERS_LIMITED`, and `GATEWAY_MESSAGE_CONTENT_LIMITED`) can be updated via the API.

\*\* To update an Interactions endpoint URL via the API, the URL must be valid according to the [Receiving an Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) documentation.

## Get Application Activity Instance % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/activity-instances/{instance_id}

Returns a serialized activity instance, if it exists. Useful for [preventing unwanted activity sessions](#DOCS_ACTIVITIES_DEVELOPMENT_GUIDES/preventing-unwanted-activity-sessions).


###### Example Activity Instance

```json
{
  "application_id": "1215413995645968394",
  "instance_id": "i-1276580072400224306-gc-912952092627435520-912954213460484116",
  "launch_id": "1276580072400224306",
  "location": {
    "id": "gc-912952092627435520-912954213460484116",
    "kind": "gc",
    "channel_id": "912954213460484116",
    "guild_id": "912952092627435520"
  },
  "users": ["205519959982473217"],
}
```

###### Activity Instance Object

| Field          | Type                                                                                                        | Description                                                                              |
|----------------|-------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| application_id | snowflake                                                                                                   | [Application](#DOCS_RESOURCES_APPLICATION/application-object) ID                         |
| instance_id    | string                                                                                                      | Activity [Instance](#DOCS_ACTIVITIES_DEVELOPMENT_GUIDES/activity-instance-management) ID |
| launch_id      | snowflake                                                                                                   | Unique identifier for the launch                                                         |
| location       | [Activity Location](#DOCS_RESOURCES_APPLICATION/get-application-activity-instance-activity-location-object) | Location the instance is runnning in                                                     |
| users          | array of snowflakes, [user](#DOCS_RESOURCES_USER/user-object) IDs                                           | IDs of the Users currently connected to the instance                                     |



###### Activity Location Object

The Activity Location is an object that describes the location in which an activity instance is running.

| Field      | Type                                                                                                                     | Description                                                 |
|------------|--------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|
| id         | string                                                                                                                   | Unique identifier for the location                          |
| kind       | [Activity Location Kind Enum](#DOCS_RESOURCES_APPLICATION/get-application-activity-instance-activity-location-kind-enum) | Enum describing kind of location                            |
| channel_id | snowflake                                                                                                                | ID of the [Channel](#DOCS_RESOURCES_CHANNEL/channel-object) |
| guild_id?  | ?snowflake                                                                                                               | ID of the [Guild](#DOCS_RESOURCES_GUILD/guild-object)       |

###### Activity Location Kind Enum

| Enum | Description                                        |
|------|----------------------------------------------------|
| 'gc' | Location is a Guild Channel                        |
| 'pc' | Location is a Private Channel, such as a DM or GDM |