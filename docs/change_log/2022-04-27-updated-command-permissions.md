---
title: "Updated Command Permissions"
date: "2022-04-27T07:00:00.000Z"
breaking: true
---

Application command permissions have been updated to add more granular control and access to commands in Discord. You can read the major changes below, and [the updated documentation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/permissions) for details.

#### Breaking changes

* Bearer tokens are now required to edit command permissions. Bearer tokens are tokens tied to an authenticating user's permissions, and can be [retrieved using OAuth](#DOCS_TOPICS_OAUTH2). The user must have permission to manage the guild and roles.
* [`applications.commands.permissions.update`](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) scope was added as a requirement to edit command permissions.
* Disabled the batch editing endpoint ([`PUT /applications/{application.id}/guilds/{guild.id}/commands/permissions`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/batch-edit-application-command-permissions)).

#### Other changes

* Created a [`CHANNEL` command permission type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permission-type)
* Increase permission limit from `10` to `100`
* [constant (`guild_id - 1`)](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permissions-constants) to represent all channels in command permissions
* Added `default_member_permissions` field, which is a bitwise OR-ed set of [permissions](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags), expressed as a string. This replaces the `default_permission` field, which will soon be deprecated.
* Added `dm_permission`, which is a boolean flag used to indicate whether a command is available in DMs (only for global application commands). If no value is passed, the global command will be visible in DMs.
* Added `APPLICATION_COMMAND_PERMISSIONS_UPDATE` [gateway](#DOCS_TOPICS_GATEWAY_EVENTS/application-command-permissions-update) event and `APPLICATION_COMMAND_PERMISSION_UPDATE` [audit log](#DOCS_RESOURCES_AUDIT_LOG) event.
