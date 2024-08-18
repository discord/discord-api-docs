---
title: "User-Installable Apps Preview"
date: "2024-03-18T07:00:00.000Z"
breaking: false
topics:
- "User Apps"
---

Apps can now be installed to users—making them easier to install, discover, and access across Discord. User-installed apps can be used across all of a user's servers, within their (G)DMs, and in DMs with the app's bot user.

When creating or updating your app, you can choose which installation types your app supports on the **Installation** page in your [app's settings](https://discord.com/developers/applications). To quickly get started, you can follow the new [Developing a User-Installable App tutorial](#DOCS_TUTORIALS_DEVELOPING_A_USER_INSTALLABLE_APP) or read details about the new changes below.

This change introduces new concepts and fields across the API that apps will now encounter—

###### API Changes

**Concepts:**

* [Installation context](#DOCS_RESOURCES_APPLICATION/installation-context) defines how an app was installed: to a user, a guild (server), or both. Currently, apps will default to only support the guild installation context, but the default may change in the future.
* Commands can also support one or both installation contexts, with the default being the same as the app's supported installation context(s) at the time of command creation.
* [Interaction context](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/interaction-contexts) defines where a command can be used in Discord—within guilds, DM with your app's bot user, and/or within group DMs and DMs other than with your app's bot user.
* The installation flow for apps have been updated so users can select whether they want to install an app to their account or to a server.

**API Fields:**

* New `integration_types_config` field for [Applications](#DOCS_RESOURCES_APPLICATION/application-object) include the default scopes and permissions for app's supported installation contexts
* New `integration_types` and `contexts` fields for [Commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-structure) are the supported [installation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/installation-context) and [interaction](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/interaction-contexts) contexts (respectively) for the command. Read [command contexts](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/contexts) documentation for details.
* New `context` field for [Interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure) indicates the [interaction context](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/interaction-contexts) where an interaction was triggered from.
* New `authorizing_integration_owners` field for [Interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure) includes a mapping of installation contexts that the interaction was authorized for, to related snowflakes for that context. Read [Authorizing Integration Owners Object](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-authorizing-integration-owners-object) for details.
* `app_permissions` is now always serialized for interactions to indicate what [permissions](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) your app has access to in the context its' responding. For (G)DMs with other users, it will include the `ATTACH_FILES | EMBED_LINKS | MENTION_EVERYONE`, and for DMs with the app's bot user it will also contain `USE_EXTERNAL_EMOJIS` for the bot’s DM
* New `interaction_metadata` on [Messages](#DOCS_RESOURCES_MESSAGE/message-object) that are created as part of an interaction response (either a response or follow-up). See [Message Interaction Metadata Object](#DOCS_RESOURCES_MESSAGE/message-interaction-metadata-object) for details.
* `dm_permission` field for [Commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-structure) is deprecated. Apps should use `contexts` instead.
* `interaction` field for [Messages](#DOCS_RESOURCES_MESSAGE/message-object) is deprecated. Apps should use `interaction_metadata` instead.

###### Limitations and Known Issues

* During the preview, interaction responses for the user installation context will be forced to be ephemeral in servers with over 25  members. Forced ephemerality is enforced at the client-level, so your app does not need to manually pay attention to server size, and will not receive errors via the API.
* All [follow-up messages](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/followup-messages) are currently forced to be ephemeral in DMs
* Follow-up messages have a bug where they will not correctly respect user permissions
