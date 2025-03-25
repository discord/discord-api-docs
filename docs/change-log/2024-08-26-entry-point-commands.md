---
title: "Entry Point Commands"
date: "2024-08-26"
topics:
- "Activities"
- "Interactions"
---

Apps with [Activities](#DOCS_ACTIVITIES_OVERVIEW) enabled can now create [Entry Point commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/entry-point-commands) using the `PRIMARY_ENTRY_POINT` (type `4`) [command type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-types). Apps are limited to one globally-scoped Entry Point command, which appears in the App Launcher.

When creating or updating an Entry Point command, an [Entry Point handler](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-entry-point-command-handler-types) can be defined using the [`handler` field](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-structure). The `handler` field determines whether your app wants to manually handle responding to the interaction:
- If the value is `DISCORD_LAUNCH_ACTIVITY` (`2`), Discord will automatically handle the interaction and send a follow-up message to the channel where the Entry Point command was invoked from.
- If the value is `APP_HANDLER` (`1`), your app will receive an interaction token and will be responsible for responding to the interaction. In this case, you can launch your Activity using the `LAUNCH_ACTIVITY` (type `12`) [interaction callback](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type).

More details about Entry Point commands can be found in the [Application Commands documentation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/entry-point-commands) and in the [Activity development guide](#DOCS_ACTIVITIES_DEVELOPMENT_GUIDES/setting-up-an-entry-point-command).

### Default Entry Point Commands

Starting today, when you enable Activities in your [app's settings](http://discord.com/developers/applications), a [default Entry Point command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/default-entry-point-command) called "Launch" will automatically be created for your app. This can be customized or deleted like other commands if you want to update the name or handler type.