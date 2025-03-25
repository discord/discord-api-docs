---
title: "Application Command Permissions"
date: "2021-04-05"
---

Need to keep some of your commands safe from prying eyes, or only available to the right people? Commands now support [command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/permissions)!

You can enable or disable a command (guild or global) for a specific user or role in a guild. For now, users will still be able to see the commands, but won't be able to use them.

New routes have been added to support this functionality:

* [`GET Guild Application Command Permissions`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/get-guild-application-command-permissions)
* [`GET Application Command Permissions`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/get-application-command-permissions)
* [`PUT Application Command Permissions`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/batch-edit-application-command-permissions)

A `default_permission` field has also been added to the [ApplicationCommand](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-structure) model. This field allows you to disable commands for everyone in a guild by default, if you prefer to make some of your commands an opt-in experience.
