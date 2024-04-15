# Application Resource

[Applications](#DOCS_QUICK_START_OVERVIEW_OF_APPS) (or "apps") are containers for developer platform features, and can be installed to Discord servers and/or user accounts. 

### Application Object


###### Application Structure

| Field                              | Type                                                                                                                                  | Description                                                                                                                                                                                                                                                                                             |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                                 | snowflake                                                                                                                             | ID of the app                                                                                                                                                                                                                                                                                           |
| name                               | string                                                                                                                                | Name of the app                                                                                                                                                                                                                                                                                         |
| icon                               | ?string                                                                                                                               | [Icon hash](#DOCS_REFERENCE/image-formatting) of the app                                                                                                                                                                                                                                                |
| description                        | string                                                                                                                                | Description of the app                                                                                                                                                                                                                                                                                  |
| rpc_origins?                       | array of strings                                                                                                                      | List of RPC origin URLs, if RPC is enabled                                                                                                                                                                                                                                                              |
| bot_public                         | boolean                                                                                                                               | When `false`, only the app owner can add the app to guilds                                                                                                                                                                                                                                              |
| bot_require_code_grant             | boolean                                                                                                                               | When `true`, the app's bot will only join upon completion of the full OAuth2 code grant flow                                                                                                                                                                                                            |
| bot?                               | partial [user](#DOCS_RESOURCES_USER/user-object) object                                                                               | Partial user object for the bot user associated with the app                                                                                                                                                                                                                                            |
| terms_of_service_url?              | string                                                                                                                                | URL of the app's Terms of Service                                                                                                                                                                                                                                                                       |
| privacy_policy_url?                | string                                                                                                                                | URL of the app's Privacy Policy                                                                                                                                                                                                                                                                         |
| owner?                             | partial [user](#DOCS_RESOURCES_USER/user-object) object                                                                               | Partial user object for the owner of the app                                                                                                                                                                                                                                                            |
| summary *(deprecated)*             | string                                                                                                                                | **deprecated and will be removed in v11.** An empty string.                                                                                                                                                                                                                                             |
| verify_key                         | string                                                                                                                                | Hex encoded key for verification in interactions and the GameSDK's [GetTicket](#DOCS_GAME_SDK_APPLICATIONS/getticket)                                                                                                                                                                                   |
| team                               | ?[team](#DOCS_TOPICS_TEAMS/data-models-team-object) object                                                                            | If the app belongs to a team, this will be a list of the members of that team                                                                                                                                                                                                                           |
| guild_id?                          | snowflake                                                                                                                             | Guild associated with the app. For example, a developer support server.                                                                                                                                                                                                                                 |
| guild?                             | partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object                                                                            | Partial object of the associated guild                                                                                                                                                                                                                                                                  |
| primary_sku_id?                    | snowflake                                                                                                                             | If this app is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists                                                                                                                                                                                           |
| slug?                              | string                                                                                                                                | If this app is a game sold on Discord, this field will be the URL slug that links to the store page                                                                                                                                                                                                     |
| cover_image?                       | string                                                                                                                                | App's default rich presence invite [cover image hash](#DOCS_REFERENCE/image-formatting)                                                                                                                                                                                                                 |
| flags?                             | integer                                                                                                                               | App's public [flags](#DOCS_RESOURCES_APPLICATION/application-object-application-flags)                                                                                                                                                                                                                  |
| approximate_guild_count?           | integer                                                                                                                               | Approximate count of guilds the app has been added to                                                                                                                                                                                                                                                   |
| redirect_uris?                     | array of strings                                                                                                                      | Array of redirect URIs for the app                                                                                                                                                                                                                                                                      |
| interactions_endpoint_url?         | string                                                                                                                                | [Interactions endpoint URL](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) for the app                                                                                                                                                                                           |
| role_connections_verification_url? | string                                                                                                                                | Role connection verification URL for the app                                                                                                                                                                                                                                                            |
| tags?                              | array of strings                                                                                                                      | List of tags describing the content and functionality of the app. Max of 5 tags.                                                                                                                                                                                                                        |
| install_params?                    | [install params](#DOCS_RESOURCES_APPLICATION/install-params-object) object                                                            | Settings for the app's default in-app authorization link, if enabled                                                                                                                                                                                                                                    |
| integration_types_config?          | dictionary with keys of [application integration types](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-types) | [In preview](#DOCS_CHANGE_LOG/userinstallable-apps-preview). Default scopes and permissions for each supported installation context. Value for each key is an [integration type configuration object](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-type-configuration-object) |
| custom_install_url?                | string                                                                                                                                | Default custom authorization URL for the app, if enabled                                                                                                                                                                                                                                                |

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
  "integration_types": [0, 1],
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
  }
  "name": "Baba O-Riley",
  "owner": {
    "avatar": null,
    "discriminator": "1738",
    "flags": 1024,
    "id": "172150183260323840",
    "username": "i own a bot"
  },
  "primary_sku_id": "172150183260323840",
  "slug": "test",
  "summary": "",
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

###### Application Flags

| Value   | Name                                          | Description                                                                                                                                                                                                                                                   |
|---------|-----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 << 6  | APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE | Indicates if an app uses the [Auto Moderation API](#DOCS_RESOURCES_AUTO_MODERATION)                                                                                                                                                                           |
| 1 << 12 | GATEWAY_PRESENCE                              | Intent required for bots in **100 or more servers** to receive [`presence_update` events](#DOCS_TOPICS_GATEWAY_EVENTS/presence-update)                                                                                                                        |
| 1 << 13 | GATEWAY_PRESENCE_LIMITED                      | Intent required for bots in under 100 servers to receive [`presence_update` events](#DOCS_TOPICS_GATEWAY_EVENTS/presence-update), found on the **Bot** page in your app's settings                                                                            |
| 1 << 14 | GATEWAY_GUILD_MEMBERS                         | Intent required for bots in **100 or more servers** to receive member-related events like `guild_member_add`. See the list of member-related events [under `GUILD_MEMBERS`](#DOCS_TOPICS_GATEWAY/list-of-intents)                                             |
| 1 << 15 | GATEWAY_GUILD_MEMBERS_LIMITED                 | Intent required for bots in under 100 servers to receive member-related events like `guild_member_add`, found on the **Bot** page in your app's settings. See the list of member-related events [under `GUILD_MEMBERS`](#DOCS_TOPICS_GATEWAY/list-of-intents) |
| 1 << 16 | VERIFICATION_PENDING_GUILD_LIMIT              | Indicates unusual growth of an app that prevents verification                                                                                                                                                                                                 |
| 1 << 17 | EMBEDDED                                      | Indicates if an app is embedded within the Discord client (currently unavailable publicly)                                                                                                                                                                    |
| 1 << 18 | GATEWAY_MESSAGE_CONTENT                       | Intent required for bots in **100 or more servers** to receive [message content](https://support-dev.discord.com/hc/en-us/articles/4404772028055)                                                                                                             |
| 1 << 19 | GATEWAY_MESSAGE_CONTENT_LIMITED               | Intent required for bots in under 100 servers to receive [message content](https://support-dev.discord.com/hc/en-us/articles/4404772028055), found on the **Bot** page in your app's settings                                                                 |
| 1 << 23 | APPLICATION_COMMAND_BADGE                     | Indicates if an app has registered global [application commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS)                                                                                                                                                     |

### Install Params Object

###### Install Params Structure

| Field       | Type             | Description                                                                                            |
|-------------|------------------|--------------------------------------------------------------------------------------------------------|
| scopes      | array of strings | [Scopes](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) to add the application to the server with |
| permissions | string           | [Permissions](#DOCS_TOPICS_PERMISSIONS) to request for the bot role                                    |

## Installation Context

> preview
> The user installation context for apps is currently in a public preview and is subject to change. Read details and limitations about the public preview in the [change log](#DOCS_CHANGE_LOG/userinstallable-apps-preview).

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

You can update which installation contexts your app supports in your [app's settings](https://discord.com/developers/applications). On the **Installation** page under the **Authorization Methods** section, you can select the installation contexts your app supports.

> info
> If you update your app to support a new installation context, you will need to update your existing [commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/contexts) if you want them to be supported in the new context. Details are in the [Application Command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/contexts) documentation.

## Get Current Application % GET /applications/@me

Returns the [application](#DOCS_RESOURCES_APPLICATION/application-object) object associated with the requesting bot user.

## Edit Current Application % PATCH /applications/@me

Edit properties of the app associated with the requesting bot user. Only properties that are passed will be updated. Returns the updated [application](#DOCS_RESOURCES_APPLICATION/application-object) object on success. 

> info 
> All parameters to this endpoint are optional

###### JSON Params

| Field                             | Type                                                                                                                                  | Description                                                                                                                                                                                                                                                                                             |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| custom_install_url                | string                                                                                                                                | Default custom authorization URL for the app, if enabled                                                                                                                                                                                                                                                |
| description                       | string                                                                                                                                | Description of the app                                                                                                                                                                                                                                                                                  |
| role_connections_verification_url | string                                                                                                                                | Role connection verification URL for the app                                                                                                                                                                                                                                                            |
| install_params                    | [install params](#DOCS_RESOURCES_APPLICATION/install-params-object) object                                                            | Settings for the app's default in-app authorization link, if enabled                                                                                                                                                                                                                                    |
| integration_types_config          | dictionary with keys of [application integration types](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-types) | [In preview](#DOCS_CHANGE_LOG/userinstallable-apps-preview). Default scopes and permissions for each supported installation context. Value for each key is an [integration type configuration object](#DOCS_RESOURCES_APPLICATION/application-object-application-integration-type-configuration-object) |
| flags \*                          | integer                                                                                                                               | App's public [flags](#DOCS_RESOURCES_APPLICATION/application-object-application-flags)                                                                                                                                                                                                                  |
| icon                              | ?[image data](#DOCS_REFERENCE/image-data)                                                                                             | Icon for the app                                                                                                                                                                                                                                                                                        |
| cover_image                       | ?[image data](#DOCS_REFERENCE/image-data)                                                                                             | Default rich presence invite cover image for the app                                                                                                                                                                                                                                                    |
| interactions_endpoint_url \*\*    | string                                                                                                                                | [Interactions endpoint URL](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) for the app                                                                                                                                                                                           |
| tags                              | array of strings                                                                                                                      | List of tags describing the content and functionality of the app (max of 20 characters per tag). Max of 5 tags.                                                                                                                                                                                         |

\* Only limited intent flags (`GATEWAY_PRESENCE_LIMITED`, `GATEWAY_GUILD_MEMBERS_LIMITED`, and `GATEWAY_MESSAGE_CONTENT_LIMITED`) can be updated via the API.

\*\* To update an Interactions endpoint URL via the API, the URL must be valid according to the [Receiving an Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) documentation.