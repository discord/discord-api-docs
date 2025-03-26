---
title: "User-Installed Apps General Availability"
date: "2024-06-27"
breaking: true
---

Back in March, we announced [the beta for user-installed apps](#DOCS_CHANGE_LOG/userinstallable-apps-preview). After listening and making updates based on feedback from developers and modmins, we're excited to announce that user-installed apps are now considered generally available and can be used in all servers (regardless of size).

With this update, there are a few API and behavioral updates for user-installed apps.

###### API Updates

* `user_id` has been removed from the `interaction_metadata` field on messages. Instead, you can use the `id` field in the nested `user` object. See the [Message Interaction Metadata Object](#DOCS_RESOURCES_MESSAGE/message-interaction-metadata-object) for details.
* User-installed apps are now limited to creating a maximum of 5 [follow-ups](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/followup-messages) when responding to interactions. This only affects the [Create Followup Message endpoint](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/create-followup-message), and apps installed to the server are unaffected.
* On [Interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure), the value of `authorizing_integration_owners` is now correctly serialized as a string. Previously, the `"0"` value was incorrectly serialized as a number.
* `app_permissions` on [Interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure) now correctly represents the permissions for user-installed apps. Previously, the value was incorrect for user-installed apps.
* Updating a message can result in a `400` response if the content of the message was blocked by AutoMod, which may be particularly important for [deferred messages](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/responding-to-an-interaction).
* Interaction responses are no longer forced to be ephemeral for servers with over 25 members.

###### New `Use External Apps` Permission

A new [`USE_EXTERNAL_APPS` (`1 << 50`) permission](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) was added, and is enabled for servers by default. The new permission lets modmins control whether user-installed apps can post public replies in a server. If `Use External Apps` is disabled and your app is *not* installed to the server, your app’s responses will be ephemeral for the end user.

Read more in the [Moderating Apps on Discord Help Center article](https://support.discord.com/hc/en-us/articles/23957313048343-Moderating-Apps-on-Discord#h_01HZQQQEADYVN2CM4AX4EZGKHM).

###### Updated Defaults for New Apps

* Newly-created apps now default to having both "User Install" *and* "Guild Install" [installation contexts](#DOCS_RESOURCES_APPLICATION/installation-context) enabled. This can be updated in the **Installation** tab in an [app's settings](https://discord.com/developers/applications).
* Newly-created apps now default to using the "Discord Provided Link" [install link](#DOCS_RESOURCES_APPLICATION/install-links). This can be updated in the **Installation** tab in an [app's settings](https://discord.com/developers/applications).
* If Discord Provided Link is selected as the install link type, `application.commands` scope is added to both installation contexts.
