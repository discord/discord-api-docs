# Application Resource

### Application Object

###### Application Structure

| Field                              | Type                                                                       | Description                                                                                                                                                           |
|------------------------------------|----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                                 | snowflake                                                                  | ID of the app                                                                                                                                                         |
| name                               | string                                                                     | Name of the app                                                                                                                                                       |
| icon                               | ?string                                                                    | [Icon hash](#DOCS_REFERENCE/image-formatting) of the app                                                                                                              |
| description                        | string                                                                     | Description of the app                                                                                                                                                |
| rpc_origins?                       | array of strings                                                           | List of RPC origin URLs, if RPC is enabled                                                                                                                            |
| bot_public                         | boolean                                                                    | When `false`, only the app owner can add the app to guilds                                                                                                            |
| bot_require_code_grant             | boolean                                                                    | When `true`, the app's bot will only join upon completion of the full OAuth2 code grant flow                                                                          |
| bot?                               | partial [user](#DOCS_RESOURCES_USER/user-object) object                    | Partial user object for the bot user associated with the app                                                                                                          |
| terms_of_service_url?              | string                                                                     | URL of the app's Terms of Service                                                                                                                                     |
| privacy_policy_url?                | string                                                                     | URL of the app's Privacy Policy                                                                                                                                       |
| owner?                             | partial [user](#DOCS_RESOURCES_USER/user-object) object                    | Partial user object for the owner of the app                                                                                                                          |
| summary *(deprecated)*             | string                                                                     | **deprecated and will be removed in v11.** An empty string.                                                                                                           |
| verify_key                         | string                                                                     | Hex encoded key for verification in interactions and the GameSDK's [GetTicket](#DOCS_GAME_SDK_APPLICATIONS/getticket)                                                 |
| team                               | ?[team](#DOCS_TOPICS_TEAMS/data-models-team-object) object                 | If the app belongs to a team, this will be a list of the members of that team                                                                                         |
| guild_id?                          | snowflake                                                                  | Guild associated with the app. For example, a developer support server.                                                                                               |
| guild?                             | partial [guild](#DOCS_RESOURCES_GUILD/guild-object) object                 | Partial object of the associated guild                                                                                                                                |
| primary_sku_id?                    | snowflake                                                                  | If this app is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists                                                         |
| slug?                              | string                                                                     | If this app is a game sold on Discord, this field will be the URL slug that links to the store page                                                                   |
| cover_image?                       | string                                                                     | App's default rich presence invite [cover image hash](#DOCS_REFERENCE/image-formatting)                                                                               |
| flags?                             | integer                                                                    | App's public [flags](#DOCS_RESOURCES_APPLICATION/application-object-application-flags)                                                                                |
| approximate_guild_count?           | integer                                                                    | Approximate count of guilds the app has been added to                                                                                                                 |
| redirect_uris?                     | array of strings                                                           | Array of redirect URIs for the app                                                                                                                                    |
| interactions_endpoint_url?         | string                                                                     | [Interactions endpoint URL](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) for the app                                                         |
| role_connections_verification_url? | ?string                                                                    | Role connection verification URL for the app                                                                                                                          |
| tags?                              | array of strings                                                           | List of tags describing the content and functionality of the app. Max of 5 tags.                                                                                      |
| install_params?                    | [install params](#DOCS_RESOURCES_APPLICATION/install-params-object) object | Settings for the app's default in-app authorization link, if enabled                                                                                                  |
| custom_install_url?                | string                                                                     | Default custom authorization URL for the app, if enabled                                                                                                              |
| discoverability_state?             | integer                                                                    | [Directory discoverability state](#DOCS_RESOURCES_APPLICATION/application-object-application-discoverability-state) of the application                                |
| discovery_eligibility_flags?       | integer                                                                    | [Directory eligibility flags](#DOCS_RESOURCES_APPLICATION/application-object-application-discovery-eligibility-flags) for the application                             |
| explicit_content_filter?           | integer                                                                    | [Explicit content filter level](#DOCS_RESOURCES_APPLICATION/application-object-explicit-content-filter-level) for uploaded media content used in application commands |
| hook                               | boolean                                                                    | Whether the bot is allowed to hook into the application's game directly                                                                                               |
| interactions_event_types? \*       | array of strings                                                           | [Gateway events](#DOCS_TOPICS_GATEWAY_EVENTS) to send to the interaction endpoint                                                                                     |
| interactions_version?              | integer                                                                    | [Interactions version](#DOCS_RESOURCES_APPLICATION/application-object-application-interactions-version) of the application                                            |
| is_monetized                       | boolean                                                                    | Whether the application has [premium subscription](#DOCS_MONETIZATION_OVERVIEW) set up                                                                                |
| monetization_eligibility_flags?    | integer                                                                    | [Monetization eligibility flags](#DOCS_RESOURCES_APPLICATION/application-object-application-monetization-eligibility-flags) for the application                       |
| monetization_state?                | integer                                                                    | [Monetization state](#DOCS_RESOURCES_APPLICATION/application-object-application-monetization-state) of the application                                                |
| rpc_application_state?             | integer                                                                    | [RPC application state](#DOCS_RESOURCES_APPLICATION/application-object-rpc-application-state) of the application                                                      |
| store_application_state?           | integer                                                                    | [Store application state](#DOCS_RESOURCES_APPLICATION/application-object-store-application-state) of the commerce application                                         |
| verification_state?                | integer                                                                    | [Verification state](#DOCS_RESOURCES_APPLICATION/application-object-application-verification-state) of the application                                                |

\* The sending of gateway events over the interaction endpoint requires [interactions version 2](#DOCS_RESOURCES_APPLICATION/application-object-application-interactions-version).

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

###### Application Monetization State

| Value | State   | Description                                  |
|-------|---------|----------------------------------------------|
| 1     | NONE    | Application has no monetization set up       |
| 2     | ENABLED | Application has monetization set up          |
| 3     | BLOCKED | Application has been blocked from monetizing |

###### Application Discoverability State

| Value | State            | Description                                                              |
|-------|------------------|--------------------------------------------------------------------------|
| 1     | INELIGIBLE       | Application is ineligible for the application directory                  |
| 2     | NOT_DISCOVERABLE | Application is not listed in the application directory                   |
| 3     | DISCOVERABLE     | Application is listed in the application directory                       |
| 4     | FEATUREABLE      | Application is featureable in the application directory                  |
| 5     | BLOCKED          | Application has been blocked from appearing in the application directory |

###### Application Discovery Eligibility Flags

| Value   | Flag                    | Description                                                                                                                                                                |
|---------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 << 0  | VERIFIED                | Application is verified                                                                                                                                                    |
| 1 << 1  | TAG                     | Application has at least one tag set                                                                                                                                       |
| 1 << 2  | DESCRIPTION             | Application has a description                                                                                                                                              |
| 1 << 3  | TERMS_OF_SERVICE        | Application has terms of service set                                                                                                                                       |
| 1 << 4  | PRIVACY_POLICY          | Application has a privacy policy set                                                                                                                                       |
| 1 << 5  | INSTALL_PARAMS          | Application has a custom install URL or install parameters                                                                                                                 |
| 1 << 6  | SAFE_NAME               | Application's name is safe for work                                                                                                                                        |
| 1 << 7  | SAFE_DESCRIPTION        | Application's description is safe for work                                                                                                                                 |
| 1 << 8  | APPROVED_COMMANDS       | Application has the [message content intent](#DOCS_TOPICS_GATEWAY/message-content-intent) approved or uses [application commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS) |
| 1 << 9  | SUPPORT_GUILD           | Application has a support guild set                                                                                                                                        |
| 1 << 10 | SAFE_COMMANDS           | Application's commands are safe for work                                                                                                                                   |
| 1 << 11 | MFA                     | Application's owner has MFA enabled                                                                                                                                        |
| 1 << 12 | SAFE_DIRECTORY_OVERVIEW | Application's directory long description is safe for work                                                                                                                  |
| 1 << 13 | SUPPORTED_LOCALES       | Application has at least one supported locale set                                                                                                                          |
| 1 << 14 | SAFE_SHORT_DESCRIPTION  | Application's directory short description is safe for work                                                                                                                 |
| 1 << 15 | SAFE_ROLE_CONNECTIONS   | Application's role connections metadata is safe for work                                                                                                                   |
| 1 << 16 | ELIGIBLE                | Application is eligible for discovery                                                                                                                                      |

###### Explicit Content Filter Level

| Value | Level    | Description                        |
|-------|----------|------------------------------------|
| 0     | DISABLED | Media content will not be filtered |
| 1     | ENABLED  | Media content will be filtered     |

###### Application Interactions Version

| Value | Version   | Description                                                                                                       |
|-------|-----------|-------------------------------------------------------------------------------------------------------------------|
| 1     | VERSION_1 | Only [Interaction Create](#DOCS_TOPICS_GATEWAY_EVENTS/interaction-create) events are sent as documented (default) |
| 2     | VERSION_2 | A selection of chosen events are sent                                                                             |

###### Application Monetization Eligibility Flags

| Value   | Flag                        | Description                                                                                                                                                                |
|---------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 << 0  | VERIFIED                    | Application is verified                                                                                                                                                    |
| 1 << 1  | HAS_TEAM                    | Application is owned by a team                                                                                                                                             |
| 1 << 2  | APPROVED_COMMANDS           | Application has the [message content intent](#DOCS_TOPICS_GATEWAY/message-content-intent) approved or uses [application commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS) |
| 1 << 3  | TERMS_OF_SERVICE            | Application has terms of service set                                                                                                                                       |
| 1 << 4  | PRIVACY_POLICY              | Application has a privacy policy set                                                                                                                                       |
| 1 << 5  | SAFE_NAME                   | Application's name is safe for work                                                                                                                                        |
| 1 << 6  | SAFE_DESCRIPTION            | Application's description is safe for work                                                                                                                                 |
| 1 << 7  | SAFE_ROLE_CONNECTIONS       | Application's role connections metadata is safe for work                                                                                                                   |
| 1 << 9  | NOT_QUARANTINED             | Application is not quarantined                                                                                                                                             |
| 1 << 15 | TEAM_MEMBERS_EMAIL_VERIFIED | Application's team members all have verified emails                                                                                                                        |
| 1 << 16 | TEAM_MEMBERS_MFA_ENABLED    | Application's team members all have MFA enabled                                                                                                                            |
| 1 << 17 | NO_BLOCKING_ISSUES          | Application has no issues blocking monetization                                                                                                                            |
| 1 << 18 | VALID_PAYOUT_STATUS         | Application's team has a valid payout status                                                                                                                               |

###### RPC Application State

| Value | State       | Description                                         |
|-------|-------------|-----------------------------------------------------|
| 0     | DISABLED    | Application does not have access to RPC             |
| 1     | UNSUBMITTED | Application has not yet been applied for RPC access |
| 2     | SUBMITTED   | Application has submitted a RPC access request      |
| 3     | APPROVED    | Application has been approved for RPC access        |
| 4     | REJECTED    | Application has been rejected from RPC access       |

###### Store Application State

| Value | State     | Description                                                                           |
|-------|-----------|---------------------------------------------------------------------------------------|
| 1     | NONE      | Application does not have a commerce license                                          |
| 2     | PAID      | Application has a commerce license but has not yet submitted a store approval request |
| 3     | SUBMITTED | Application has submitted a store approval request                                    |
| 4     | APPROVED  | Application has been approved for the store                                           |
| 5     | REJECTED  | Application has been rejected from the store                                          |

###### Application Verification State

| Value | State       | Description                                           |
|-------|-------------|-------------------------------------------------------|
| 1     | INELIGIBLE  | Application is ineligible for verification            |
| 2     | UNSUBMITTED | Application has not yet been applied for verification |
| 3     | SUBMITTED   | Application has submitted a verification request      |
| 4     | SUCCEEDED   | Application has been verified                         |

\* Applications of these types cannot be used through most of the regular application endpoints.

### Install Params Object

###### Install Params Structure

| Field       | Type             | Description                                                                                            |
|-------------|------------------|--------------------------------------------------------------------------------------------------------|
| scopes      | array of strings | [Scopes](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) to add the application to the server with |
| permissions | string           | [Permissions](#DOCS_TOPICS_PERMISSIONS) to request for the bot role                                    |

## Get Current Application % GET /applications/@me

Returns the [application](#DOCS_RESOURCES_APPLICATION/application-object) object associated with the requesting bot user.

## Edit Current Application % PATCH /applications/@me

Edit properties of the app associated with the requesting bot user. Only properties that are passed will be updated. Returns the updated [application](#DOCS_RESOURCES_APPLICATION/application-object) object on success. 

> info 
> All parameters to this endpoint are optional

###### JSON Params

| Field                             | Type                                                                       | Description                                                                                                     |
|-----------------------------------|----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| custom_install_url                | string                                                                     | Default custom authorization URL for the app, if enabled                                                        |
| description                       | string                                                                     | Description of the app                                                                                          |
| role_connections_verification_url | string                                                                     | Role connection verification URL for the app                                                                    |
| install_params                    | [install params](#DOCS_RESOURCES_APPLICATION/install-params-object) object | Settings for the app's default in-app authorization link, if enabled                                            |
| flags \*                          | integer                                                                    | App's public [flags](#DOCS_RESOURCES_APPLICATION/application-object-application-flags)                          |
| icon                              | ?[image data](#DOCS_REFERENCE/image-data)                                  | Icon for the app                                                                                                |
| cover_image                       | ?[image data](#DOCS_REFERENCE/image-data)                                  | Default rich presence invite cover image for the app                                                            |
| interactions_endpoint_url \*\*    | string                                                                     | [Interactions endpoint URL](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) for the app   |
| tags                              | array of strings                                                           | List of tags describing the content and functionality of the app (max of 20 characters per tag). Max of 5 tags. |

\* Only limited intent flags (`GATEWAY_PRESENCE_LIMITED`, `GATEWAY_GUILD_MEMBERS_LIMITED`, and `GATEWAY_MESSAGE_CONTENT_LIMITED`) can be updated via the API.

\*\* To update an Interactions endpoint URL via the API, the URL must be valid according to the [Receiving an Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/receiving-an-interaction) documentation.