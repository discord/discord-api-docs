---
title: "Updated Command Permissions"
date: "2022-04-27"
breaking: true
---

Application command permissions have been updated to add more granular control and access to commands in Discord. You can read the major changes below, and [the updated documentation](/docs/interactions/application-commands#permissions) for details.

#### Breaking changes

* Bearer tokens are now required to edit command permissions. Bearer tokens are tokens tied to an authenticating user's permissions, and can be [retrieved using OAuth](/docs/topics/oauth2). The user must have permission to manage the guild and roles.
* [`applications.commands.permissions.update`](/docs/topics/oauth2#shared-resources-oauth2-scopes) scope was added as a requirement to edit command permissions.
* Disabled the batch editing endpoint ([`PUT /applications/{application.id}/guilds/{guild.id}/commands/permissions`](/docs/interactions/application-commands#batch-edit-application-command-permissions)).

#### Other changes

* Created a [`CHANNEL` command permission type](/docs/interactions/application-commands#application-command-permissions-object-application-command-permission-type)
* Increase permission limit from `10` to `100`
* [constant (`guild_id - 1`)](/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-constants) to represent all channels in command permissions
* Added `default_member_permissions` field, which is a bitwise OR-ed set of [permissions](/docs/topics/permissions#permissions-bitwise-permission-flags), expressed as a string. This replaces the `default_permission` field, which will soon be deprecated.
* Added `dm_permission`, which is a boolean flag used to indicate whether a command is available in DMs (only for global application commands). If no value is passed, the global command will be visible in DMs.
* Added `APPLICATION_COMMAND_PERMISSIONS_UPDATE` [gateway](/docs/events/gateway-events#application-command-permissions-update) event and `APPLICATION_COMMAND_PERMISSION_UPDATE` [audit log](/docs/resources/audit-log) event.
