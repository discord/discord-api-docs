---
title: "Upcoming Application Command Permission Changes"
date: "2022-11-17"
breaking: true
---

Based on feedback, we’re updating permissions for [application commands](/docs/interactions/application-commands) to simplify permission management and to make command permissions more closely resemble other permissions systems in Discord.

Server admins can begin to opt-in to the command permission changes outlined here on a per-server basis **starting on December 16, 2022**. However, changes will not be applied to all servers **until late January or early February**.

:::info
Current permissions behavior is documented in [the application commands documentation](/docs/interactions/application-commands#permissions) and in [the changelog for the previous permissions update](/docs/change-log#updated-command-permissions)
:::

These changes are focused on how configured permissions are used by Discord clients, so most apps will be unaffected. However, if your app uses the [Update Permissions endpoint](/docs/interactions/application-commands#edit-application-command-permissions) (`PUT /applications/<application_id>/guilds/<guild_id>/commands/<command_id>/permissions`), you may need to make updates and should read these changes carefully.

#### Types of command permission configurations

:::info
The following information isn’t changing, but it’s helpful context to understand the changes.
:::

Discord’s clients determine whether a user can see or invoke a command based on three different permission configurations:

* **Command-level permissions** are set up by an admin for a specific *command* in their server. These permissions affect only a specific command.
* **App-level permissions** are set up by an admin for a specific *app* in their server. These permissions affect all commands for an app.
* **`default_member_permissions`** are set up by an app when creating or updating a command. `default_member_permissions` apply to that command in *all* servers (unless an override exists). More information about `default_member_permissions` is [in the documentation](/docs/interactions/application-commands#application-command-permissions-object-using-default-permissions).

The concepts of these permission configurations are not changing. But then of course, the question becomes…

### What's changing?

There are two changes around command permissions:

1. The logic used to apply permission configurations to a user in a given context within Discord clients
2. New `APPLICATION_COMMAND_PERMISSIONS_V2` guild feature flag to indicate whether that guild is using the old permissions logic or the new (upcoming) logic.

Let's go deeper into both of these.

#### 1. How permission configurations are applied in Discord

##### Current behavior:

Currently, these systems are **mutually-exclusive**, meaning that only one type of permission configuration is used to determine whether a user can invoke a command.

With this current system, there is a clear hierarchy: command-level permission configurations take precedence (if present), then app-level permission configurations (if present), and finally `default_member_permissions` if neither are present.

The implication of the current permissions system means that:

* If any command-level permissions are configured, all app-level permissions and `default_member_permissions` are ignored for that command.
* If any app-level permissions are configured, `default_member_permissions` is ignored for *all* of that app’s commands.

This system leads to unintentional permission escalations, and can force moderators to manually re-define their app-level configurations to make small tweaks on the command-level.

##### Upcoming behavior:

The new system removes the mutual exclusion aspect, meaning that the different types of permission configurations work together rather than independently—specifically, more than one may be used to determine whether a user can invoke a command.

**`default_member_permissions` continues to act as a “default” that a developer can set when creating or updating a command.**

**App-level permission configurations now act as the "base" configuration.**

App-level configurations define who is allowed to use the app and where. These will work *together* with  `default_member_permissions`, meaning if a user is granted access via an app-level permission configuration, they will still be restricted to the `default_member_permissions` for each command (by default). No more accidentally granting `/ban` which requires `BAN_MEMBERS` to `@BotMemers` just because you gave them access to the app!

**Command-level permission configurations now act as an “override” of the app-level.**

Command-level configurations override what is present at the app-level *and* any restrictions set by `default_member_permissions`. This means that an admin can explicitly grant a user access to a specific command even if they are denied access on the app-level *or* if they don't have permissions that meet that command's `default_member_permissions`.

If a command-level configuration does not exist for the given context, the system will fall back to looking at the app-level configuration.

##### Flowchart for command permissions logic

Below is a simplified flowchart that illustrates how permissions will be applied by the Discord client after the new changes take effect.

![Flowchart with an overview of the new permissions configurations logic](images/new-permissions-flowchart.svg)

#### 2. `APPLICATION_COMMAND_PERMISSIONS_V2` Guild Feature

We added a new [`APPLICATION_COMMAND_PERMISSIONS_V2` feature flag](/docs/resources/guild#guild-object-guild-features) which indicates whether that server is using **the current permissions logic**.

* If the flag *is* present, that server is using the old command permissions behavior.
* If the flag *is not* present, that server has migrated from the old command permissions behavior to the new behavior.

### Am I affected?

Your app will only be affected if it uses the [`PUT /applications/<application_id>/guilds/<guild_id>/commands/<command_id>/permissions`](/docs/interactions/application-commands#edit-application-command-permissions) endpoint. This is a pretty restricted endpoint used to manage and update application command permissions on behalf of admins, meaning that it requires the `applications.commands.permissions.update` scope.

**If your app doesn’t use this endpoint, there’s nothing you need to prepare for these changes.**

If your app does use this endpoint, you should read the section on preparing for changes below.

### How do I prepare for the changes?

To prepare for these changes, you should take two steps:

**1. Use the  `APPLICATION_COMMAND_PERMISSIONS_V2` flag**

Use this flag to determine which permissions logic that server is using. While the transition from the old behavior to the new behavior is happening, you may need two code paths depending on if the flag is present or not.

```py
if 'APPLICATION_COMMAND_PERMISSIONS_V2' in guild.features:
     # Use current behaviors when interacting with endpoint
else:
     # Use new permissions behaviors when interacting with endpoint
```

:::info
If you don’t have access to guild features already through Gateway events, you can fetch that information using the [`GET /guilds/<guild_id>` endpoint](/docs/resources/guild#get-guild).
:::

**2. Modify the behavior based on your use case**

After you know what permissions behavior the server is using, you should update how you handle that server specifically.

To understand what changes you need to make, you should look at the assumptions users have when your app updates their server’s commands permissions. Do you have a web dashboard where admins update permissions? If so, analyze the logic of that dashboard and what your permission configurations are trying to do to map them to the new permissions behavior. Do you document what your app is doing in regards to certain command permissions you’re configuring on behalf of the admin? If so, map that documentation to the new behavior.

If you are unsure, you can communicate with your admin users to ask if your new logic meets their expectations.

#### What happens if I don’t update my app?

If your app is affected and you don’t update it, permissions behavior that your app configures may not match what you or the users of your app expect.

#### How long do I have to update my app?

The new `APPLICATION_COMMAND_PERMISSIONS_V2` flag is already live, and you should start seeing it in guilds’ feature flags.

The new permissions behavior will roll out **on December 16, 2022**. On this date, admins will begin to see a banner that allows them to *optionally* move their server to the new behavior.

In **late January or early February**, all servers will be migrated to the new behavior. We'll post another changelog at this point, at which time you can remove any logic around the old permissions behavior.
