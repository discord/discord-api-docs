---
title: "Application Command Permissions"
date: "2021-04-05"
---

Need to keep some of your commands safe from prying eyes, or only available to the right people? Commands now support [command permissions](/docs/interactions/application-commands#permissions)!

You can enable or disable a command (guild or global) for a specific user or role in a guild. For now, users will still be able to see the commands, but won't be able to use them.

New routes have been added to support this functionality:

* [`GET Guild Application Command Permissions`](/docs/interactions/application-commands#get-guild-application-command-permissions)
* [`GET Application Command Permissions`](/docs/interactions/application-commands#get-application-command-permissions)
* [`PUT Application Command Permissions`](/docs/interactions/application-commands#batch-edit-application-command-permissions)

A `default_permission` field has also been added to the [ApplicationCommand](/docs/interactions/application-commands#application-command-object-application-command-structure) model. This field allows you to disable commands for everyone in a guild by default, if you prefer to make some of your commands an opt-in experience.
