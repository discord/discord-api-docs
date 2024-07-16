# Change Log

## Message Forwarding rollout

#### July 15, 2024

We are slowly rolling out the message forwarding feature to users. This feature allows callers to create a message using `message_reference.type = FORWARD` and have the API generate a `message_snapshot` for the sent message. The feature has [some limitations](#DOCS_RESOURCES_CHANNEL/message-reference-types) and the snapshot is a minimal version of a standard `MessageObject`, but does capture the core parts of a message.

The resulting message will look something like:
```json
{
  "id": "1255957733279273083",
  "message_reference": {
    "type": 1, // Forward
    ...
  }
  "message_snapshots": [
    {
      "message": {
        "content": "original message",
        "embeds": [...],
        "attachments": [...],
        ...
      }
    }
  ],
  ...
}
```

We have applied stricter rate limits for this feature based on the following:
- number of forwards sent by the user
- total attachment size

###### API Updates since preview

This was [previously announced](https://discord.com/channels/613425648685547541/697138785317814292/1233463756160503859) but note that the final API has a few changes since the API was first previewed:
- [`message snapshot`](#DOCS_RESOURCES_CHANNEL/message-snapshot-object) objects don't include a `guild` field anymore since the `message_reference` already provides that information
- forwarded messages have a distinctive `message_reference` type of `FORWARD` now

## User-Installed Apps General Availability

#### June 27, 2024

> danger
> This entry includes breaking changes

Back in March, we announced [the beta for user-installed apps](#DOCS_CHANGE_LOG/userinstallable-apps-preview). After listening and making updates based on feedback from developers and modmins, we're excited to announce that user-installed apps are now considered generally available and can be used in all servers (regardless of size).

With this update, there are a few API and behavioral updates for user-installed apps.

###### API Updates

- `user_id` has been removed from the `interaction_metadata` field on messages. Instead, you can use the `id` field in the nested `user` object. See the [Message Interaction Metadata Object](#DOCS_RESOURCES_CHANNEL/message-interaction-metadata-object) for details.
- User-installed apps are now limited to creating a maximum of 5 [follow-ups](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/followup-messages) when responding to interactions. This only affects the [Create Followup Message endpoint](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/create-followup-message), and apps installed to the server are unaffected.
- On [Interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure), the value of `authorizing_integration_owners` is now correctly serialized as a string. Previously, the `"0"` value was incorrectly serialized as a number.
- `app_permissions` on [Interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure) now correctly represents the permissions for user-installed apps. Previously, the value was incorrect for user-installed apps.
- Updating a message can result in a `400` response if the content of the message was blocked by AutoMod, which may be particularly important for [deferred messages](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/responding-to-an-interaction).
- Interaction responses are no longer forced to be ephemeral for servers with over 25 members.

###### New `Use External Apps` Permission

A new [`USE_EXTERNAL_APPS` (`1 << 50`) permission](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) was added, and is enabled for servers by default. The new permission lets modmins control whether user-installed apps can post public replies in a server. If `Use External Apps` is disabled and your app is *not* installed to the server, your app’s responses will be ephemeral for the end user.

Read more in the [Moderating Apps on Discord Help Center article](https://support.discord.com/hc/en-us/articles/23957313048343-Moderating-Apps-on-Discord#h_01HZQQQEADYVN2CM4AX4EZGKHM).

###### Updated Defaults for New Apps

- Newly-created apps now default to having both "User Install" *and* "Guild Install" [installation contexts](#DOCS_RESOURCES_APPLICATION/installation-context) enabled. This can be updated in the **Installation** tab in an [app's settings](https://discord.com/developers/applications).
- Newly-created apps now default to using the "Discord Provided Link" [install link](#DOCS_RESOURCES_APPLICATION/install-links). This can be updated in the **Installation** tab in an [app's settings](https://discord.com/developers/applications).
- If Discord Provided Link is selected as the install link type, `application.commands` scope is added to both installation contexts.

## Premium Apps: New Premium Button Style & Deep Linking URL Schemes

#### June 17, 2024

**New Premium Button Style**

Introduces a new `premium` [button style](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/button-object-button-styles) to be used with a `sku_id` which points to an active [SKU](#DOCS_MONETIZATION_SKUS/sku-object). This allows developers to customize their premium experience by returning specific subscription or one-time purchase products.

Learn more about using [button components with interactions](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons).

> warn
> This change deprecates Interaction Response Type 10

The `PREMIUM_REQUIRED (10)` interaction response type is now deprecated in favor of using custom premium buttons. This will continue to function but may be eventually unsupported. It is recommended to migrate your bots to use the more flexible [premium button component](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/button-object-button-styles).

Learn more about [gating features with premium interactions](#DOCS_MONETIZATION_APP_SUBSCRIPTIONS/gating-premium-interactions).

**Deep Linking URL Schemes for SKUs and Store**

Introduces two new url schemes for linking directly to the Application Directory. When these links are used in chat, they are rendered as rich embeds that users can interact with to launch an app's store or open a SKU detail modal.

- New [Store URL Scheme](#DOCS_MONETIZATION_MANAGING_YOUR_STORE/linking-to-your-store): `https://discord.com/application-directory/:appID/store`
- New [SKU URL Scheme](#DOCS_MONETIZATION_SKUS/linking-to-your-skus): `https://discord.com/application-directory/:appID/store/:skuID`

## Auto Moderation Member Profile Rule

#### May 31, 2024

- Add Auto Moderation `MEMBER_PROFILE` rule [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types). This rule type will check if a member's profile contains disallowed keywords.
- Add Auto Moderation `BLOCK_MEMBER_INTERACTION` [action type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-types) currently available for the `MEMBER_PROFILE` rule [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types). This action will "quarantine" the member to some extent and prevent them from performing most interactions within a specific server.

## Premium Apps: One-Time Purchases and Store

#### April 24, 2024

Two new features are now available for Premium Apps: One-Time Purchases and Stores.

**One-Time Purchases**

- **Durable Items**: A one-time purchase that is permanent and is not subject to either renewal or consumption, such as lifetime access to an app's premium features.
- **Consumable Items**: A one-time, non-renewable purchase that provides access, such as a temporary power-up or boost in a game.

Learn more about implementing [One-Time Purchases](#DOCS_MONETIZATION_ONE-TIME_PURCHASES).

**A Store for Your Premium App**

We have also introduced a Store for your Premium App to showcase your app subscriptions and one-time purchase items. You can now create a unique Store page within the developer portal and add your published subscription SKUs or one-time purchase SKUs to your store view, allowing your users to buy these items from your App Directory or Bot User Profile.

To explore these features, eligibility details, and how to enable monetization for your app, check out the [Monetization Overview](#DOCS_MONETIZATION_OVERVIEW).

**API Documentation Updates**

The following were added to our public Monetization documentation with this update:

- New [SKU Object Types](#DOCS_MONETIZATION_SKUS/sku-object-sku-types)
- New [Entitlement Object Types](#DOCS_MONETIZATION_ENTITLEMENTS/entitlement-object-entitlement-types)
- [Consume an Entitlement](#DOCS_MONETIZATION_ENTITLEMENTS/consume-an-entitlement) API endpoint
- `consumed` field on the [Entitlement](#DOCS_MONETIZATION_ENTITLEMENTS) resource

## Modify Guild Member flags field permissions

#### April 23, 2024
Update permissions necessary to modify the `flags` field when calling the [Modify Guild Member](#DOCS_RESOURCES_GUILD/modify-guild-member) endpoint.

## CSV Export for Premium App Analytics

#### April 2, 2024

For apps with [Monetization](#DOCS_MONETIZATION_OVERVIEW) enabled, we have released the ability to export your SKU analytics to CSV. These exports allow you to use your preferred data tools to report on your premium offerings.

You can find the export at the bottom of the `Monetization → Analytics` tab of your app to export data points such as `sales_count`, `sales_amount`, `sales_currencies`, `cancellation_count`, `refund_amount`, and `refund_count`, aggregated by each of your offerings for the selected month.

## User-Installable Apps Preview

#### March 18, 2024

Apps can now be installed to users—making them easier to install, discover, and access across Discord. User-installed apps can be used across all of a user's servers, within their (G)DMs, and in DMs with the app's bot user.

When creating or updating your app, you can choose which installation types your app supports on the **Installation** page in your [app's settings](https://discord.com/developers/applications). To quickly get started, you can follow the new [Developing a User-Installable App tutorial](#DOCS_TUTORIALS_DEVELOPING_A_USER_INSTALLABLE_APP) or read details about the new changes below.

This change introduces new concepts and fields across the API that apps will now encounter—

###### API Changes

**Concepts:**
- [Installation context](#DOCS_RESOURCES_APPLICATION/installation-context) defines how an app was installed: to a user, a guild (server), or both. Currently, apps will default to only support the guild installation context, but the default may change in the future.
- Commands can also support one or both installation contexts, with the default being the same as the app's supported installation context(s) at the time of command creation.
- [Interaction context](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/interaction-contexts) defines where a command can be used in Discord—within guilds, DM with your app's bot user, and/or within group DMs and DMs other than with your app's bot user.
- The installation flow for apps have been updated so users can select whether they want to install an app to their account or to a server.

**API Fields:**
- New `integration_types_config` field for [Applications](#DOCS_RESOURCES_APPLICATION/application-object) include the default scopes and permissions for app's supported installation contexts
- New `integration_types` and `contexts` fields for [Commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-structure) are the supported [installation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/installation-context) and [interaction](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/interaction-contexts) contexts (respectively) for the command. Read [command contexts](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/contexts) documentation for details.
- New `context` field for [Interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure) indicates the [interaction context](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/interaction-contexts) where an interaction was triggered from.
- New `authorizing_integration_owners` field for [Interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure) includes a mapping of installation contexts that the interaction was authorized for, to related snowflakes for that context. Read [Authorizing Integration Owners Object](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-authorizing-integration-owners-object) for details.
- `app_permissions` is now always serialized for interactions to indicate what [permissions](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) your app has access to in the context its' responding. For (G)DMs with other users, it will include the `ATTACH_FILES | EMBED_LINKS | MENTION_EVERYONE`, and for DMs with the app's bot user it will also contain `USE_EXTERNAL_EMOJIS` for the bot’s DM
- New `interaction_metadata` on [Messages](#DOCS_RESOURCES_CHANNEL/message-object) that are created as part of an interaction response (either a response or follow-up). See [Message Interaction Metadata Object](#DOCS_RESOURCES_CHANNEL/message-interaction-metadata-object) for details.
- `dm_permission` field for [Commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-structure) is deprecated. Apps should use `contexts` instead.
- `interaction` field for [Messages](#DOCS_RESOURCES_CHANNEL/message-object) is deprecated. Apps should use `interaction_metadata` instead.

###### Limitations and Known Issues

- During the preview, interaction responses for the user installation context will be forced to be ephemeral in servers with over 25  members. Forced ephemerality is enforced at the client-level, so your app does not need to manually pay attention to server size, and will not receive errors via the API.
- All [follow-up messages](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/followup-messages) are currently forced to be ephemeral in DMs
- Follow-up messages have a bug where they will not correctly respect user permissions

## Discord Activities: Developer Preview of the Embedded App SDK

#### March 18, 2024

Discord Developers can now build Activities!

Activities are interactive, multiplayer experiences that run in an iframe in Discord. In order to make the communication between your experience and Discord, we've introduced the Embedded App SDK to assist in communicating between your app and the Discord client.

- New [Discord Activities](#DOCS_ACTIVITIES_OVERVIEW) developer docs with a tutorial, code samples, development guides, and design principles.
- The Embedded App SDK is now available via [npm](https://npmjs.com/package/@discord/embedded-app-sdk) and [GitHub](http://github.com/discord/embedded-app-sdk).
- The [Embedded App SDK Reference](#DOCS_DEVELOPER_TOOLS_EMBEDDED_APP_SDK) is now available.

To learn more about how to get started building your own Activity, check out the [Activities Overview](#DOCS_ACTIVITIES_OVERVIEW).

## Guild Prune Requiring `MANAGE_GUILD`

#### March 15, 2024

> danger
> This entry includes breaking changes

The [Get Guild Prune Count](#DOCS_RESOURCES_GUILD/get-guild-prune-count) and [Begin Guild Prune](#DOCS_RESOURCES_GUILD/begin-guild-prune)
endpoints now require the `MANAGE_GUILD` permission alongside the existing `KICK_MEMBERS` requirement ₍^ >ヮ<^₎ .ᐟ.ᐟ

## Enforced Nonces on Create Message Endpoint

#### February 12, 2024

The [Create message](#DOCS_RESOURCES_CHANNEL/create-message) endpoint now supports an `enforce_nonce` parameter. When set to true, the message will be deduped for the same sender within a few minutes. If a message was created with the same nonce, no new message will be created and the previous message will be returned instead. This behavior will become the default for this endpoint in a future API version.

## Limit Number of Fields in Embeds

#### December 19, 2023

[Embed objects](#DOCS_RESOURCES_CHANNEL/embed-object) are now limited more explicitly to 25 [embed fields](#DOCS_RESOURCES_CHANNEL/embed-object-embed-field-structure). If you pass more than 25 fields within the an embed's `fields` property, an error will be returned.

Previously, only the first 25 embed fields would be displayed within the embed but no error was returned.

## Clarification on Permission Splits for Expressions and Events

#### December 15, 2023

> info
> The existing behavior for `MANAGE_GUILD_EXPRESSIONS` and `MANAGE_EVENTS` will **not be changing**. These permissions will continue to allow your bot users to create, update and delete expressions/events. No action will be needed if you plan to continue using these permissions.

To support added controls for expressions and events, new [permissions](#DOCS_TOPICS_PERMISSIONS/permissions) were added for users and roles in July 2023:

- `CREATE_GUILD_EXPRESSIONS`: `1 << 43`
- `CREATE_EVENTS`: `1 << 44`

These allow for creating new expressions and events, as well as editing and deleting those created by the current user.

> warn
> These were rolled out in July 2023 to users and roles and have been added to our developer documentation but **are not yet available to app developers**. We will share an update here when these new permissions are available in your apps.

## Experimenting with End-to-End Encryption for Voice & Video
#### Dec 1, 2023

#### What’s Happening?

As outlined in [a blog post earlier this year](https://discord.com/blog/encryption-for-voice-and-video-on-discord), we are experimenting with end-to-end encryption (e2ee) for voice and video channels.

End-to-end encryption is designed to only allow the participants in a call to decipher its contents. One of the protocols we’re experimenting with is called Messaging Layer Security, which we believe would allow us to deliver end-to-end encryption at scale. Intermediaries, including platforms like Discord, are unable to access the content of communications encrypted with end-to-end encryption.

#### How do I prepare for the changes?

During this testing phase, there is nothing developers need to do to support end-to-end encryption. Voice channels will automatically downgrade to documented, non-e2ee protocols when a bot user joins the channel. This is transparent to the connecting client but may result in a slight delay between establishing a connection and receiving audio.

#### What is planned for the future?

We will be continuing our testing and will share updates along with developer documentation and sample code once it is available.

Once this information is published, we will provide developers with a substantial timeframe to implement end-to-end encryption when interacting with voice and video.

## Premium App Subscriptions: New Ways for Testing App Subscriptions
#### Nov 29, 2023

Following feedback on Premium App Subscriptions, we've made it easier for developers to test their app subscriptions. The goal is to provide you with flexibility during testing and prevent you from having to use live payment methods.

- Team members will automatically receive a 100% discount on a subscription for your app, allowing you to test the end-to-end payment flow
- Developers can create and delete [test entitlements](#DOCS_MONETIZATION_ENTITLEMENTS/create-test-entitlement) to toggle access to an application's premium features

Read more about [Testing your App Subscriptions Implementation](#DOCS_MONETIZATION_APP_SUBSCRIPTIONS/testing-your-implementation) for details.

## Fix Message Edit Interaction Response Permissions
#### Nov 1, 2023

Behavior for message edit interaction response actions like [updating interaction responses](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/edit-original-interaction-response) and [sending follow-up messages](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/followup-messages) have been updated to follow a bot user's permissions.

Previously, some message edit interaction response actions would use the default permissions rather than a bot user's permissions.

## Premium App Subscriptions Now Available in the EU and UK
#### Oct 19, 2023

Starting today, eligible developers based in EU and UK can now monetize their verified apps with App Subscriptions. [App Subscriptions](#DOCS_MONETIZATION_OVERVIEW) let you to charge your users for premium functionality with a recurring, monthly subscription.

> info
> New features for Premium App Subscriptions are documented in the [App Subscriptions overview](#DOCS_MONETIZATION_OVERVIEW) and in [the changelog for the previous App Subscriptions release](#DOCS_CHANGE_LOG/premium-app-subscriptions-available-in-the-us).

To learn more about eligibility details and how to enable monetization for your app, check out the [Monetization Overview](#DOCS_MONETIZATION_OVERVIEW).

## Global Rate Limit added to discordapp.com/*
#### Oct 17, 2023

We have added a global rate limit for API requests made to `discordapp.com/*` and may further restrict requests in the future.

To limit impact on your app, please make sure you are making calls to `discord.com/*`.

This does **not** apply for `cdn.discordapp.com`.

Refer to the [API Reference](https://discord.com/developers/docs/reference) for more info on which url(s) to use when building on the REST API

- [February 14, 2022 Change Log](https://discord.com/developers/docs/change-log#feb-14-2022): Requests to v10 and higher will no longer be supported on `discordapp.com` (this does not affect `cdn.discordapp.com`)
- [May 4, 2020 #api-announcements](https://discord.com/channels/613425648685547541/697138785317814292/706944540971630662)

## Premium App Subscriptions Available in the US
#### Sep 26, 2023

Starting today, eligible US-based developers can monetize their verified apps with App Subscriptions. [App Subscriptions](#DOCS_MONETIZATION_OVERVIEW) let you to charge your users for premium functionality with a recurring, monthly subscription.

- Manage subscription SKUs in the Developer Portal
- View monetization analytics in the Developer Portal
- Team owners can setup and manage payouts in Developer Portal
- New endpoints for working with [SKUs](#DOCS_MONETIZATION_SKUS) and [Entitlements](#DOCS_MONETIZATION_ENTITLEMENTS):
  - [List SKUs](#DOCS_MONETIZATION_SKUS/list-skus) `GET /applications/<application.id>/skus`
  - [List Entitlements](#DOCS_MONETIZATION_ENTITLEMENTS/list-entitlements) `GET /applications/<application.id>/entitlements`
  - [Create Test Entitlement](#DOCS_MONETIZATION_ENTITLEMENTS/create-test-entitlement) `POST /applications/<application.id>/entitlements`
  - [Delete Test Entitlement](#DOCS_MONETIZATION_ENTITLEMENTS/delete-test-entitlement)  `DELETE /applications/<application.id>/entitlements/<entitlement.id>`
- [Gateway Events](#DOCS_MONETIZATION_ENTITLEMENTS/gateway-events) for working with entitlements: `ENTITLEMENT_CREATE`, `ENTITLEMENT_UPDATE`, `ENTITLEMENT_DELETE`
- New [`PREMIUM_REQUIRED (10)` interaction response type](#DOCS_MONETIZATION_ENTITLEMENTS/premiumrequired-interaction-response) is available to prompt users to upgrade
- New `entitlements` field, which is an array of [entitlement](#DOCS_MONETIZATION_ENTITLEMENTS/) objects, available in interaction data payloads when [receiving and responding to interactions](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure)

To learn more about eligibility details and how to enable monetization for your app, check out the [Monetization Overview](#DOCS_MONETIZATION_OVERVIEW).

## Default Value in Auto-populated Select Menus

#### Sep 22, 2023

A new `default_values` field was added for user (`5`), role (`6`), mentionable (`7`), and channel (`8`) [select menu components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menus). `default_values` is a list of [default value objects](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object-select-default-value-structure), which each include an `id` (the snowflake value for the resource), as well as a corresponding `type` (either `"user"`, `"role"`, or `"channel"`).

## Team Member Roles

#### Aug 23, 2023

You can now select roles other than admin when inviting users or configuring members of a team. There are four [role types](#DOCS_TOPICS_TEAMS/team-member-roles-team-member-role-types) that a team member can be assigned: owner, admin, developer, or read-only. The team member object now has an additional [`role` field](#DOCS_TOPICS_TEAMS/data-models-team-member-object), which is a string representing the member's current role.

Details about team member roles are in the updated [Teams documentation](#DOCS_TOPICS_TEAMS/team-member-roles).

## Embed Debugger

#### Aug 10, 2023

We've released a new [Embed Debugger tool](https://discord.com/developers/embeds) that shows you how a URL's metadata will be parsed and rendered as a link embed within the Discord client. Use it to preview your site's embed, or debug why your site's link embed isn't working as expected.

## Activity State for Bot Users

#### Aug 8, 2023

The `state` field in [activity objects](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object) can now be set when [updating presence](#DOCS_TOPICS_GATEWAY_EVENTS/update-presence) for a bot user. The value of `state` will appear as a custom status for the bot user when an [activity's `type`](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object-activity-types) is set to `4`, or as additional data under an activity's name for other activity types.

## Public Preview of OpenAPI 3.1 Specification

#### Aug 2, 2023

We're introducing an [OpenAPI 3.1 spec](https://github.com/discord/discord-api-spec) in public preview to make it easier and more reliable to develop with the HTTP API. While our current developer documentation requires manual reviews and updates, the OpenAPI spec is generated from the source code which means it better reflects the nooks, crannies, and nuances of the Discord API.

> warn
> The public preview of the OpenAPI spec is subject to breaking changes without advance notice, and should not be used within production environments. If you see something that looks incorrect or can be improved, you can [open an issue](https://github.com/discord/discord-api-spec/issues).

The public spec can be found in the new [`discord-api-spec` repository on GitHub](https://github.com/discord/discord-api-spec).

## New GUILD_MEDIA channel type

#### Aug 1, 2023

- Add the [`GUILD_MEDIA` (16) channel type](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types). `GUILD_MEDIA` channels only support threads, similar to `GUILD_FORUM` channels.

Read the [media channel topic](#DOCS_TOPICS_THREADS/media-channels) for more information on the relevant APIs and technical details, or the [media channel Help Center Article](https://creator-support.discord.com/hc/en-us/articles/14346342766743) for more about the feature.

## Add Join Raid and Mention Raid fields

#### May 05, 2023

- Add Auto Moderation `mention_raid_protection_enabled` [trigger_metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) field for the `MENTION_SPAM` [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types). If this field and its parent `MENTION_SPAM` rule are enabled, Auto Moderation provides baseline detection against sudden spikes in mention activity that are normally indicative of mention raids.
- Add `safety_alerts_channel_id` [guild](#DOCS_RESOURCES_GUILD/guild-object) field and [`RAID_ALERTS_DISABLED` guild feature flag](#DOCS_RESOURCES_GUILD/guild-object-guild-features) which are associated with join raid protection

## Unique usernames on Discord

#### May 3, 2023

> warn
> Bot users will stay on the legacy username system for now. More details can be found on the [Developer Help Center article](https://dis.gd/app-usernames).

Discord’s username system is changing. Discriminators are being removed and new, unique usernames and display names are being introduced. You can read more details about how changes to the username system affects non-bot users in the [general Help Center article](https://dis.gd/usernames). To learn how it impacts bot users specifically, you can read the [Developer Help Center article](https://dis.gd/app-usernames).

This changelog focuses only on the technical changes to be aware of to update your app's code.

### Identifying migrated users

The new username system will rollout to users over time rather than all at once. The value of a single zero (`"0"`) in the [`discriminator` field](#DOCS_RESOURCES_USER/user-object-user-structure) on a user will indicate that the user has been migrated to the new username system. Note that the discriminator for migrated users will *not* be 4-digits like a standard discriminator (it is `"0"`, not `"0000"`). The value of the `username` field will become the migrated user's unique username.

After migration of all users is complete, the `discriminator` field may be removed.

#### Example migrated user

```json
{
  "id": "80351110224678912",
  "username": "nelly",
  "discriminator": "0",
  "global_name": "Nelly",
  "avatar": "8342729096ea3675442027381ff50dfe",
  "verified": true,
  "email": "nelly@discord.com",
  "flags": 64,
  "banner": "06c16474723fe537c283b8efa61a30c8",
  "accent_color": 16711680,
  "premium_type": 1,
  "public_flags": 64
}
```

### Display names

As part of the new username system, standard Discord users can define a non-unique display name. This value will be a new `global_name` field with a max length of 32 characters. If the user has not set a display name, `global_name` will be null.

### Default avatars

For users with migrated accounts, default avatar URLs will be based on the user ID instead of the discriminator. The URL can now be calculated using `(user_id >> 22) % 6`. Users on the legacy username system will continue using `discriminator % 5`.

## Bot users added to all new apps

#### April 14, 2023

Starting today, [bot users](#DOCS_TOPICS_OAUTH2/bot-vs-user-accounts) will be added to all newly-created apps. Settings and configuration options for bot users remain the same, and can still be accessed on the **Bot** page within your [app's settings](https://discord.com/developers/applications).

If your app doesn't need or want a bot user associated with it, you can refrain from adding the [`bot` scope](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) when installing your app.

## Interaction Channel Data

#### April 6, 2023

Interactions now contain a `channel` field which is a partial channel object and guaranteed to contain `id` and `type`. We recommend that you begin using this channel field to identify the source channel of the interaction, and may deprecate the existing `channel_id` field in the future. See the [interaction documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object) for more details.

## Add Auto Moderation custom_message Action Metadata Field

#### Feb 24, 2023

Add new `custom_message` [action metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-metadata) for the `BLOCK_MESSAGE` [action type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-types)). You can now specify a custom string for every Auto Moderation rule that will be shown to members whenever the rule blocks their message. This can be used as an additional explanation for why a message was blocked and as a chance to help members understand your server's rules and guidelines.

## Update to Locked Threads

#### Feb 10, 2023

### Upcoming Changes

Currently, threads in Discord (including forum posts) can either be archived or both locked and archived. Starting on **March 6, 2023**, threads will be able to be locked *without* being archived, which will slightly change the meaning of the [`locked` field](#DOCS_RESOURCES_CHANNEL/thread-metadata-object-thread-metadata-structure).

`locked` currently indicates that a thread cannot be reopened by a user without the [`MANAGE_THREADS` (`1 << 34`) permission](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags), but it doesn't restrict user activity within active (meaning non-archived) threads. After this change, users (including bot users) without the `MANAGE_THREADS` permission will be more restricted in locked threads. Users won't be able to create or update messages in locked threads, or update properties like its title or tags. Additionally, some user activity like deleting messages and adding or removing reactions will *only* be allowed in locked threads if that thread is also active (or un-archived).

If a user or bot user has the `MANAGE_THREADS` permission, they will still be able to make changes to the thread and messages. The upcoming change does not affect the meaning of the [`archived` field](#DOCS_RESOURCES_CHANNEL/thread-metadata-object-thread-metadata-structure) or the behavior of a thread that is both locked and archived.

### How do I prepare for this change?

If your app is interacting with threads (including forum posts), it should check the state of the `locked` and/or `archived` field for the thread to understand which actions it can or cannot perform. It should also be prepared to handle any errors that it may receive when a thread is locked.

## Increase Auto Moderation Keyword Limits

#### Feb 8, 2023

- Increase maximum number of rules with `KEYWORD` [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) per guild from 5 to 6
- Increase maximum length for each keyword in the `keyword_filter` and `allow_list` [trigger_metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) fields from 30 to 60.

## Guild Audit Log Events

#### Jan 18, 2023

At long last, a new [`GUILD_AUDIT_LOG_ENTRY_CREATE`](#DOCS_TOPICS_GATEWAY_EVENTS/guild-audit-log-entry-create) event has been added to the gateway, allowing your application to react to moderation actions in guilds. The `VIEW_AUDIT_LOG` permission is required in order to receive these events, and the [`GUILD_MODERATION` intent](#DOCS_TOPICS_GATEWAY/gateway-intents) needs to be set when connecting to the gateway.

## Thread Member Details and Pagination

> danger
> This entry includes breaking changes

#### Jan 09, 2023

A new `member` field was added to the [thread member object](#DOCS_RESOURCES_CHANNEL/thread-member-object). `member` is a [guild member object](#DOCS_RESOURCES_GUILD/guild-member-object) that will be included within returned thread member objects when the new `with_member` field is set to `true` in the [List Thread Members](#DOCS_RESOURCES_CHANNEL/list-thread-members) (`GET /channels/<channel_id>/thread-members`) and [Get Thread Member](#DOCS_RESOURCES_CHANNEL/get-thread-member) (`GET /channels/<channel_id>/thread-members/<user_id>`) endpoints.

Setting `with_member` to `true` will also enable pagination for the [List Thread Members](#DOCS_RESOURCES_CHANNEL/list-thread-members) endpoint. When the results are paginated, you can use the new `after` and `limit` fields to fetch additional thread members and limit the number of thread members returned. By default, `limit` is 100.

#### Upcoming Changes

Starting in API v11, [List Thread Members](#DOCS_RESOURCES_CHANNEL/list-thread-members) (`GET /channels/<channel_id>/thread-members`) will *always* return paginated results, regardless of whether `with_member` is passed or not.

## Add Default Layout setting for Forum channels

#### Dec 13, 2022

`default_forum_layout` is an optional field in the [channel object](#DOCS_RESOURCES_CHANNEL) that indicates the default layout for posts in a [forum channel](#DOCS_TOPICS_THREADS/forums). A value of 1 (`LIST_VIEW`) indicates that posts will be displayed as a chronological list, and 2 (`GALLERY_VIEW`) indicates they will be displayed as a collection of tiles. If `default_forum_layout` hasn't been set, the value will be `0`.

Setting `default_forum_layout` requires the `MANAGE_CHANNELS` permission.

## Add Application Connections Metadata and Linked Roles

#### Dec 12, 2022

Introducing [linked roles](https://discord.com/blog/connected-accounts-functionality-boost-linked-roles) as well as the ability for all developers to set up their own linked roles with an application. This includes:
- New [`role_connections_verification_url`](#DOCS_RESOURCES_APPLICATION/application-object) that can be set in the developer portal in order for the application to render as potential verification option for linked roles.
- [Application metadata](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/application-role-connection-metadata-object) to specify more detailed linked role requirements.
- New endpoints to [retrieve](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/get-application-role-connection-metadata-records) (`GET /applications/<application.id>/role-connections/metadata`) and [update](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/update-application-role-connection-metadata-records) (`PUT /applications/<application.id>/role-connections/metadata`) application connection metadata.
- New [`role_connections.write`](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) OAuth2 scope required to authenticate the below requests.
- Endpoints to [retrieve](#DOCS_RESOURCES_USER/get-current-user-application-role-connection) (`GET /users/@me/applications/{application.id}/role-connection`) and [update](#DOCS_RESOURCES_USER/update-current-user-application-role-connection) (`PUT /users/@me/applications/{application.id}/role-connection`) a user's role connections, both of which return an [application role connection](#DOCS_RESOURCES_USER/application-role-connection-object) object.

> info
> For a quick rundown on how to get started using linked roles, refer to the [tutorial](#DOCS_TUTORIALS_CONFIGURING_APP_METADATA_FOR_LINKED_ROLES).

## Add Auto Moderation Allow List for Keyword Rules and Increase Max Keyword Rules Per Guild Limit

#### Nov 22, 2022

- Auto Moderation rules with [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) `KEYWORD` now support an `allow_list` field in its [trigger_metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata). Any message content that matches an `allow_list` keyword will be ignored by the Auto Moderation `KEYWORD` rule. Each `allow_list` keyword can be a multi-word phrase and can contain [wildcard symbols](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-keyword-matching-strategies).
- Increase maximum number of rules with `KEYWORD` [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) per guild from 3 to 5
- Increase maximum length for each regex pattern in the `regex_patterns` [trigger_metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) field from 75 to 260.

## Upcoming Application Command Permission Changes

#### Nov 17, 2022

> danger
> This entry includes breaking changes

Based on feedback, we’re updating permissions for [application commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS) to simplify permission management and to make command permissions more closely resemble other permissions systems in Discord.

Server admins can begin to opt-in to the command permission changes outlined here on a per-server basis **starting on December 16, 2022**. However, changes will not be applied to all servers **until late January or early February**.

> info
> Current permissions behavior is documented in [the application commands documentation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/permissions) and in [the changelog for the previous permissions update](#DOCS_CHANGE_LOG/updated-command-permissions)

These changes are focused on how configured permissions are used by Discord clients, so most apps will be unaffected. However, if your app uses the [Update Permissions endpoint](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/edit-application-command-permissions) (`PUT /applications/<application_id>/guilds/<guild_id>/commands/<command_id>/permissions`), you may need to make updates and should read these changes carefully.

#### Types of command permission configurations

> info
> The following information isn’t changing, but it’s helpful context to understand the changes.

Discord’s clients determine whether a user can see or invoke a command based on three different permission configurations:

- **Command-level permissions** are set up by an admin for a specific *command* in their server. These permissions affect only a specific command.
- **App-level permissions** are set up by an admin for a specific *app* in their server. These permissions affect all commands for an app.
- **`default_member_permissions`** are set up by an app when creating or updating a command. `default_member_permissions` apply to that command in *all* servers (unless an override exists). More information about `default_member_permissions` is [in the documentation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-using-default-permissions).

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
- If any command-level permissions are configured, all app-level permissions and `default_member_permissions` are ignored for that command.
- If any app-level permissions are configured, `default_member_permissions` is ignored for *all* of that app’s commands.

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

![Flowchart with an overview of the new permissions configurations logic](new-permissions-flowchart.svg)

#### 2. `APPLICATION_COMMAND_PERMISSIONS_V2` Guild Feature

We added a new [`APPLICATION_COMMAND_PERMISSIONS_V2` feature flag](#DOCS_RESOURCES_GUILD/guild-object-guild-features) which indicates whether that server is using **the current permissions logic**.

- If the flag *is* present, that server is using the old command permissions behavior.
- If the flag *is not* present, that server has migrated from the old command permissions behavior to the new behavior.

### Am I affected?

Your app will only be affected if it uses the [`PUT /applications/<application_id>/guilds/<guild_id>/commands/<command_id>/permissions`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/edit-application-command-permissions) endpoint. This is a pretty restricted endpoint used to manage and update application command permissions on behalf of admins, meaning that it requires the `applications.commands.permissions.update` scope.

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

> info
> If you don’t have access to guild features already through Gateway events, you can fetch that information using the [`GET /guilds/<guild_id>` endpoint](#DOCS_RESOURCES_GUILD/get-guild).

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

## GameSDK Feature Deprecation

#### Nov 9, 2022

> danger
> This entry includes breaking changes

To help keep us focused on the features, improvements, and gaming-related experiences that Discord users love, we are deprecating the following pieces of the GameSDK **starting today**, and decommissioning them on **Tuesday, May 2, 2023**:

- [Achievements](#DOCS_GAME_SDK_ACHIEVEMENTS/)
- [Applications](#DOCS_GAME_SDK_APPLICATIONS/)
- [Voice](#DOCS_GAME_SDK_DISCORD_VOICE/)
- [Images](#DOCS_GAME_SDK_IMAGES/)
- [Lobbies](#DOCS_GAME_SDK_LOBBIES/)
- [Networking](#DOCS_GAME_SDK_NETWORKING/)
- [Storage](#DOCS_GAME_SDK_STORAGE/)
- [Store](#DOCS_GAME_SDK_STORE/) [purchases and discounts]

This deprecation period will last until **Tuesday May 2, 2023**, after which these pieces will be decommissioned and no longer work. The other pieces of the GameSDK will continue to be supported.

We know that Discord is an important place for people to find belonging, and that using your Discord identity in games is a crucial part of that sense of belonging. You’ll still be able to use the GameSDK to integrate Rich Presence, relationships, entitlements, basic user information, and the overlay.

## Add Auto Moderation Regex Support

#### Nov 4, 2022

Auto Moderation rules with [trigger_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) `KEYWORD` now support
a `regex_patterns` field in its [trigger_metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types).
Regex patterns are a powerful way to describe many keywords all at once using one expression. Only Rust flavored regex is supported, which can be tested in online editors such as [Rustexp](https://rustexp.lpil.uk/).

## Delete Ephemeral Messages

#### Oct 20, 2022

Ephemeral interaction responses and follow-ups can now be deleted with a valid interaction token using the following endpoints:
- [`DELETE /webhooks/<application_id>/<interaction_token>/messages/@original`](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/delete-original-interaction-response)
- [`DELETE /webhooks/<application_id>/<interaction_token>/messages/<message_id>`](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/delete-followup-message)


As a reminder, interaction tokens stay valid for up to 15 minutes after the interaction occurs. Details can be found in the [interaction documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING).

## New Select Menu Components

#### Oct 13, 2022

Four new select menu [component types](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object-component-types) have been added to make it easier to populate selects with common resources in Discord:
- User select (type `5`)
- Role select (type `6`)
- Mentionable (user *and* role) select (type `7`)
- Channel select (type `8`)

The new select menu components are defined similarly to the existing string select menu—with the exception of not including the `options` field and, within channel select menus, having the option to include a `channel_types` field. The [select menu interaction](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object-select-menu-interaction) apps receive also contain a [`resolved` field](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object-select-menu-resolved-object) for the new components.

More details can be found in the updated [select menu documentation](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menus).

## Default Sort Order for Forum Channels

#### Sep 22, 2022

`default_sort_order` is an optional field in the [channel object](#DOCS_RESOURCES_CHANNEL) that indicates how the threads in a [forum channel](#DOCS_TOPICS_THREADS/forums) will be sorted for users by default. Setting `default_sort_order` requires the `MANAGE_CHANNELS` permission.

If `default_sort_order` hasn't been set, its value will be `null`.

## Auto Moderation Spam and Mention Spam Trigger Types

#### Sep 21, 2022

Two new [trigger types](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) were added to Auto Moderation:

- `MENTION_SPAM` blocks messages that mention more than a set number of unique server members or roles. Apps can define the number (up to 50) using the `mention_total_limit` field in the [trigger metadata object](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) when creating or updating an Auto Moderation rule.
- `SPAM` blocks links and messages that are identified as spam.

More information can be found in the [Auto Moderation documentation](#DOCS_RESOURCES_AUTO_MODERATION).

## Forum Channels Release

#### Sep 14, 2022

Forum channels ([`GUILD_FORUM` or `15`](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types)) have been released to all community servers. `GUILD_FORUM` channels are a new channel type that only supports threads, which display differently than in text (`GUILD_TEXT`) channels.

Check out the [forums topic](#DOCS_TOPICS_THREADS/forums) for more information on the relevant APIs and technical details, and the [Forums FAQ](https://support.discord.com/hc/en-us/articles/6208479917079-Forum-Channels-FAQ#h_01G69FJQWTWN88HFEHK7Z6X79N) for more about the feature.

## Message Content is a Privileged Intent

#### Sep 1, 2022

> danger
> This entry includes breaking changes

As of today, [message content](#DOCS_TOPICS_GATEWAY/message-content-intent) is a privileged intent for all verified apps *and* apps eligible for verification. More details about why it's becoming a privileged intent and how to apply for it is in the [Help Center FAQ](https://support-dev.discord.com/hc/articles/4404772028055-Message-Content-Privileged-Intent-FAQ).

Any app that does not have the message content intent configured in its app's settings within the Developer Portal will receive empty values in fields that expose message content across Discord's APIs (including the `content`, `embeds`, `attachments`, and `components` fields). These restrictions do not apply for messages that a bot or app sends, in DMs that it receives, or in messages in which it is mentioned.

#### If your app is verified

Verified apps and verification-eligible apps must be approved for the message content intent to receive message content. If your verified app isn’t approved, or doesn’t account for the new message content restrictions, it will break for users.

##### Temporary Message Content Intent

Verified apps or apps that have submitted for verification can temporarily opt-in to a grace period which will allow your app to continue receiving message content until October 1.  However, if you opt-in to the grace period, your app will be prevented from joining any additional servers until you opt-out. More details are in the [Help Center article](https://support-dev.discord.com/hc/en-us/articles/8561391080471).

#### If your app is unverified
Unverified apps must still must enable the intent in your app’s settings within the Developer Portal.

Existing unverified apps will automatically have the message content intent toggled on in their settings. New unverified apps will have to manually toggle the intent in the Developer Portal.

## Slash Command Mentions

#### Aug 22, 2022

This week, [Slash Command mentions](#DOCS_REFERENCE/message-formatting) are rolling out across all Discord clients (for Android, mentions are limited to the [React Native client](https://discord.com/blog/android-react-native-framework-update)). Clicking a Slash Command mention will auto-populate the command in the user's message input.

Slash Command mentions use the following format: `</NAME:COMMAND_ID>`. You can also use `</NAME SUBCOMMAND:ID>` and `</NAME SUBCOMMAND_GROUP SUBCOMMAND:ID>` for subcommands and subcommand groups.

## Session-specific Gateway Resume URLs

#### Aug 9, 2022

> warn
> Starting on **September 12, 2022**, apps that aren’t using the new `resume_gateway_url` field to resume gateway sessions will be disconnected significantly faster than normal.

A new `resume_gateway_url` field has been added to the [Ready](#DOCS_TOPICS_GATEWAY_EVENTS/ready) gateway event to support session-specific gateway connections. The value of `resume_gateway_url` is a session-specific URL that should be used when resuming the gateway session after a disconnect. Previously, `wss://gateway.discord.gg` was used to connect *and* resume sessions, but should now only be used during the connection.

At the moment, the value of `resume_gateway_url` will always be `wss://gateway.discord.gg` to give developers more time to adopt the new field. In the near future, the value will change to the session-specific URLs.

## Upcoming Permissions Change to Webhook Routes

#### July 13, 2022

On August 8th, 2022 we will begin requiring the `VIEW_CHANNEL (1 << 10)` permission for webhook routes which require `MANAGE_WEBHOOKS (1 << 29)`, to align with our documented behavior. We don't expect that many applications will be affected by this, but in case you are, please ensure you have updated permissions needed for accessing the following routes:

- [`GET /webhooks/{webhook.id}`](#DOCS_RESOURCES_WEBHOOK/get-webhook)
- [`DELETE /webhooks/{webhook.id}`](#DOCS_RESOURCES_WEBHOOK/delete-webhook)
- [`PATCH /webhooks/{webhook.id}`](#DOCS_RESOURCES_WEBHOOK/modify-webhook)
- [`GET /channels/{channel.id}/webhooks`](#DOCS_RESOURCES_WEBHOOK/get-channel-webhooks)
- [`POST /channels/{channel.id}/webhooks`](#DOCS_RESOURCES_WEBHOOK/create-webhook)

## Min and Max Length for Command Options

#### July 1, 2022

Application [command options](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-structure) of type `STRING` now includes optional `min_length` and `max_length` fields to control the length of text a user can input.

The value of `min_length` must be greater or equal to `0`, and the value of `max_length` must be greater or equal to `1`.

## Add Subcommand Groups and Subcommands to Message Interaction Objects

> danger
> This entry includes breaking changes

#### July 1, 2022

While this is a breaking change, most apps only rely on interaction responses (`INTERACTION_CREATE`), *not* message interaction objects (`MESSAGE_CREATE`). [Interaction responses](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/message-interaction-object/interaction-object-interaction-data) are unaffected by this change.

#### Upcoming Changes

Starting **July 18, 2022**, the `name` field for [message interaction objects](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/message-interaction-object) will now include subcommands and subcommand groups in the value (along with the existing top-level command). In the future, we recommend not relying on this message interaction field.

The format of the value will be the different command levels (if they exist), separated by spaces:
`<command name> <subcommand group name> <subcommand name>`

The `name` field is only seen on messages that are a response to an interaction without an existing message, so interaction objects for message components don’t include this field.

#### Updating your app

Most apps only rely on interaction responses, not message interaction objects.

We don't recommend that your app relies on the `name` field for message interactions objects, but if it does you should update your app to handle subcommands and subcommand groups that your app may encounter.

As an example of the change, pretend your app had a command `/role` with subcommands `add` and `remove`. Currently, the `name` field in the original interaction payload would contain `role`. If you responded to that interaction with a message then fetched its contents, the `name` field for that message interaction object would contain `role` as well.

After this change, the `name` field for the original interaction payload will still contain `role`. However, now if you responded to that interaction with a message then fetched its contents, the `name` field for that message interaction object would contain `role add` or `role remove`.

## Changes to Bot Permissions for Interactions and Webhooks

> danger
> This entry includes breaking changes

#### Jun 29, 2022

#### Upcoming Changes

> warn
> `MENTION_EVERYONE`, `SEND_TTS_MESSAGES` and `USE_EXTERNAL_EMOJIS` are the only permissions that will be affected by this change. In a previous version of this changelog, it was indicated that `ATTACH_FILES` and `EMBED_LINKS` would be affected but this is no longer the case.

Starting **August 3, 2022**, the way some of a bot's `MENTION_EVERYONE`, `SEND_TTS_MESSAGES` and `USE_EXTERNAL_EMOJIS` [permissions](#DOCS_TOPICS_PERMISSIONS/permissions) are calculated is changing in two cases:
- When **responding to an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING)** (like application commands or message components)
- When **executing a [webhook](#DOCS_RESOURCES_WEBHOOK) that the bot created**

Going forward, in the above cases, a bot’s `MENTION_EVERYONE`, `SEND_TTS_MESSAGES` and `USE_EXTERNAL_EMOJIS` permissions will be calculated based on the permissions its granted, *including* any [overwrites](#DOCS_TOPICS_PERMISSIONS/permission-overwrites). Previously, a bot’s permissions in these cases relied only on those granted to `@everyone`.

This change *only* applies to bots. The permissions for an app without a bot user (or without the `bot` scope) will still depend on `@everyone`.

#### Updating Your App

If your bot wants to use the `MENTION_EVERYONE`, `SEND_TTS_MESSAGES` or `USE_EXTERNAL_EMOJIS` permissions when responding to interactions or executing a webhook, **ensure that the bot was installed (or explicitly granted) with them**.

Note that even if your bot is installed with certain permissions, they can be changed using overwrites. For interactions, you can use the [`app_permissions` field](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure) to determine your app or bot's contextual permissions before replying.

## Calculated Permissions in Interaction Payloads

#### Jun 29, 2022

Interaction payloads now contain an `app_permissions` field whose value is the computed [permissions](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags) for a bot or app in the context of a specific interaction (including any channel overwrites). Similar to other permission fields, the value of `app_permissions` is a bitwise OR-ed set of permissions expressed as a string. Read details in the [interactions documentation](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object).

For apps without a bot user (or without the `bot` scope), the value of `app_permissions` will be the same as the permissions for `@everyone`, but limited to the permissions that can be used in interaction responses (currently `ATTACH_FILES`, `EMBED_LINKS`, `MENTION_EVERYONE`, and `USE_EXTERNAL_EMOJIS`).


## Message Content in Auto Moderation events

#### Jun 21, 2022

#### Breaking Changes

In API v10, the `MESSAGE_CONTENT` (`1 << 15`) intent is now required to receive non-empty values for the `content` and `matched_content` fields in [`AUTO_MODERATION_ACTION_EXECUTION`](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-action-execution) gateway events. This matches the intended behavior for message content across the API.

## Updated Connection Property Field Names

#### Jun 17, 2022

The `$` prefix in [identify connection properties](#DOCS_TOPICS_GATEWAY_EVENTS/identify-identify-connection-properties) are deprecated. The new field names are `os`, `browser`, and `device`. When passed, the `$`-prefixed names will resolve to the new ones.

In API v11, support for the previous field names (`$os`, `$browser`, and `$device`) will be removed.

## Auto Moderation

#### Jun 16, 2022

Add new [Auto Moderation feature](#DOCS_RESOURCES_AUTO_MODERATION) which enables guilds to moderate message content based on keywords, harmful links, and unwanted spam. This change includes:
- New endpoints for [creating](#DOCS_RESOURCES_AUTO_MODERATION/create-auto-moderation-rule), [updating](#DOCS_RESOURCES_AUTO_MODERATION/modify-auto-moderation-rule), and [deleting](#DOCS_RESOURCES_AUTO_MODERATION/delete-auto-moderation-rule) Auto Moderation rules
- New gateway events emitted when Auto Moderation rules are [created](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-rule-create) (`AUTO_MODERATION_RULE_CREATE`), [updated](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-rule-update) (`AUTO_MODERATION_RULE_UPDATE `), and [deleted](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-rule-delete) (`AUTO_MODERATION_RULE_DELETE `). Requires the `AUTO_MODERATION_CONFIGURATION` (`1 << 20`) intent
- New gateway event emitted when an [action is executed](#DOCS_TOPICS_GATEWAY_EVENTS/auto-moderation-action-execution) (`AUTO_MODERATION_ACTION_EXECUTION`). Requires the `AUTO_MODERATION_EXECUTION` (`1 << 21`) intent
- New [audit log entries](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-audit-log-events) when rules are created (`AUTO_MODERATION_RULE_CREATE`), updated (`AUTO_MODERATION_RULE_UPDATE`), or deleted (`AUTO_MODERATION_RULE_DELETE`), or when Auto Moderation performs an action (`AUTO_MODERATION_BLOCK_MESSAGE`)

## Updated Command Permissions

#### Apr 27, 2022

Application command permissions have been updated to add more granular control and access to commands in Discord. You can read the major changes below, and [the updated documentation](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/permissions) for details.

#### Breaking changes

- Bearer tokens are now required to edit command permissions. Bearer tokens are tokens tied to an authenticating user's permissions, and can be [retrieved using OAuth](#DOCS_TOPICS_OAUTH2). The user must have permission to manage the guild and roles.
- [`applications.commands.permissions.update`](#DOCS_TOPICS_OAUTH2/shared-resources-oauth2-scopes) scope was added as a requirement to edit command permissions.
- Disabled the batch editing endpoint ([`PUT /applications/{application.id}/guilds/{guild.id}/commands/permissions`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/batch-edit-application-command-permissions)).

#### Other changes

- Created a [`CHANNEL` command permission type](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permission-type)
- Increase permission limit from `10` to `100`
-  [constant (`guild_id - 1`)](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-permissions-object-application-command-permissions-constants) to represent all channels in command permissions
- Added `default_member_permissions` field, which is a bitwise OR-ed set of [permissions](#DOCS_TOPICS_PERMISSIONS/permissions-bitwise-permission-flags), expressed as a string. This replaces the `default_permission` field, which will soon be deprecated.
- Added `dm_permission`, which is a boolean flag used to indicate whether a command is available in DMs (only for global application commands). If no value is passed, the global command will be visible in DMs.
- Added `APPLICATION_COMMAND_PERMISSIONS_UPDATE` [gateway](#DOCS_TOPICS_GATEWAY_EVENTS/application-command-permissions-update) event and `APPLICATION_COMMAND_PERMISSION_UPDATE` [audit log](#DOCS_RESOURCES_AUDIT_LOG) event.

## Forum Channels

#### Apr 06, 2022

Added new channel type, `GUILD_FORUM` (15). A `GUILD_FORUM` channel is an unreleased feature that is very similar (from an API perspective) to a `GUILD_TEXT` channel, except only threads can be created in that channel; messages cannot be sent directly in that channel. Check out the [forums topic](#DOCS_TOPICS_THREADS/forums) for more information.

## Guild Bans Pagination

#### Mar 31, 2022

The `GET /guilds/{guild.id}/bans` endpoint has been migrated to require pagination to improve reliability and stability. Check out the [endpoint docs](#DOCS_RESOURCES_GUILD/get-guild-bans) for more information.

## API v10

#### Feb 14, 2022

- API v8 is now deprecated.
- `GET /channels/{channel.id}/threads/active` is decommissioned in favor of [`GET /guilds/{guild.id}/threads/active`](#DOCS_RESOURCES_GUILD/list-active-guild-threads).
- Starting in v10, you must specify the message content intent (`1 << 15`) to receive content-related fields in message dispatches. Read more in the [Gateway Intents documentation](#DOCS_TOPICS_GATEWAY/gateway-intents).
- To specify a reason for an administrative action in audit logs, apps must now pass the `X-Audit-Log-Reason` header rather than the `reason` parameter for all endpoints. Read more in the [Audit Logs documentation](#DOCS_RESOURCES_AUDIT_LOG).
- Message routes (like [`POST /channels/{channel.id}/messages`](#DOCS_RESOURCES_CHANNEL/create-message)) now use the `embeds` field (an array of embed objects) instead of `embed`.
- The `summary` field for [applications](#DOCS_RESOURCES_APPLICATION) now returns an empty string for all API versions.
- The `name` and `description` fields for [Achievements](#DOCS_GAME_SDK_ACHIEVEMENTS/data-models-achievement-struct) are now strings, and localization info is now passed in new `name_localizations` and `description_localizations` dictionaries. This change standardizes localization to match [Application Commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/localization). Read details in the [Achievements documentation](#DOCS_GAME_SDK_ACHIEVEMENTS/data-models-achievement-struct).
- Existing attachments must be specified when [`PATCH`ing messages with new attachments](#DOCS_REFERENCE/editing-message-attachments). Any attachments not specified will be removed and replaced with the specified list
- Requests to v10 and higher will no longer be supported on `discordapp.com` (this does **not** affect `cdn.discordapp.com`)

#### Upcoming changes

- API v6 and v7 will be decommissioned **in early 2023**
- `MESSAGE_CONTENT` is becoming a privileged intent for verified bots in 75+ servers **on August 31, 2022**. Read details in [the FAQ](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Privileged-Intent-FAQ) or follow [the guide](#DOCS_TUTORIALS_UPGRADING_TO_APPLICATION_COMMANDS) on updating your app.
- The `summary` field for applications will be removed in the next API version (v11)

## Interaction Modals and Application Command Attachment Option Type

#### Feb 8, 2022

Interaction modals are now available, allowing applications to prompt users for further detailed input. Check out [the modal docs](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-modal) for more information.

Application Commands can now add an attachment option type. See [the option type table](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-option-type) for more information.

## Guild Member Timeouts

#### Dec 20, 2021

Add new documentation for the recently released guild member timeout feature.

## Guild Scheduled Events

#### Nov 23, 2021

- Add official support for `guild_scheduled_events` field on `Guild` resource sent with `GUILD_CREATE` event

#### Nov 18, 2021

- Breaking change for return type for `GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}/users`
- Add `with_user_count` query param for `GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}`
- Return additional `creator` field by default in response for `GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}`
- More details and clarification for the guild scheduled events feature.
- Document support for `before` and `after` query params for `GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}/users`

#### Nov 15, 2021

Add new documentation for the recently released Guild Scheduled Events feature.

## Application Command Autocomplete Interactions

#### October 27, 2021

Autocomplete interactions are now available, allowing application commands to provide server completed options. Check out [the autocomplete interaction docs](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/autocomplete) for more information.

## Updated Thread Permissions

#### September 16, 2021

Thread permissions have been updated and simplified:

- "Use Public Threads" is now "Create Public Threads", which allows users to create public threads and announcement threads in a channel, even if they cannot send messages in that channel.
- "Use Private Threads" is now "Create Private Threads", which allows users to create private threads in a channel, even if they cannot send messages in that channel.

A new permission has also been added:

- "Send Messages in Threads", which allows users to send a message in a thread. The "Send Messages" permission has no effect in threads: users **must** have "Send Messages in Threads" to send a message in a thread. This allows for setups where a user can participate in a thread but cannot send a message in the parent channel (like a thread on an announcement post).

## User and Message Commands

#### August 10, 2021

[User commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/user-commands) and [message commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/message-commands) are now live! These commands appear on context menus for users and messages, with more to come in the future.

Context menu commands are a type of application command. The "Slash Commands" documentation page has been renamed to "Application Commands" and split out by type to show this.

## Select Menu Components

#### June 30, 2021

Select Menus are now part of the components API! They're the greatest thing since the invention of buttons yesterday. Select menus allow you to offer users a choice of one or many options in a friendly UI-based way.

Select menus can be used like other [message components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/). Learn all the specifics in the [documentation](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menus).

## Support for Multiple Embeds in Message Routes

#### June 10, 2021

Message routes now accept an embeds array in addition to the existing embed field. Bots can now send up to 10 embeds per message, to be consistent with webhook behavior. The existing embed field is considered deprecated and will be removed in the next API version.

## Buttons and Message Components

#### May 26, 2021

Message components are now available with our first two components: a layout-based `ActionRow` and...buttons!

You can now include buttons on messages sent by your app, whether they're bot messages or responses to interactions. [Learn more about message components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/).

The addition of message components means new fields and response types:

- An optional `components` field has been added to the [message object](#DOCS_RESOURCES_CHANNEL/message-object)
- New response types `6` and `7` have been added for [interaction responses](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type), valid only for component-based interactions

## API v9

#### April 28, 2021

API v9 is now available.

API v9 includes support for [threads](#DOCS_TOPICS_THREADS), an upcoming feature.  Older API versions will not receive any Gateway Events for threads, so it is important to update soon!  We've prepared a [migration guide](#DOCS_TOPICS_THREADS) to help make the upgrade process very straightforward.

This documentation is being published early so bots can have at least two months to upgrade before threads launch.

Additionally, API v9 also removes the `/channels/:id/messages/:id/suppress-embeds` route.


## Application Command Permissions

#### April 5, 2021

Need to keep some of your commands safe from prying eyes, or only available to the right people? Commands now support [command permissions](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/permissions)!

You can enable or disable a command (guild or global) for a specific user or role in a guild. For now, users will still be able to see the commands, but won't be able to use them.

New routes have been added to support this functionality:

- [`GET Guild Application Command Permissions`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/get-guild-application-command-permissions)
- [`GET Application Command Permissions`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/get-application-command-permissions)
- [`PUT Application Command Permissions`](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/batch-edit-application-command-permissions)

A `default_permission` field has also been added to the [ApplicationCommand](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/application-command-object-application-command-structure) model. This field allows you to disable commands for everyone in a guild by default, if you prefer to make some of your commands an opt-in experience.

## Large Bot Sharding Lowered to 150,000 Guilds

#### March 15, 2021

There have been reports that sessions have higher frequency of errors when starting if a bot has joined too many guilds (the gateway connection times out). To account for this we have lowered the requirement for large bot sharding down to 150,000 guilds in order to improve reliability.

## Changes to Slash Command Response Types and Flags

#### March 5, 2021

Changes to interaction response types have been made to support better designs for application commands:

- Type `2` `Acknowledge` has been deprecated
- Type `3` `ChannelMessage` has been deprecated
- Type `5` `AcknowledgeWithSource` has been renamed to `DeferredChannelMessageWithSource`

These deprecated types will be removed and break on **April 9, 2021**.

Additionally, `flags` has been documented on [InteractionApplicationCommandCallbackData](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-data-structure). Setting `flags` to `64` will make the interaction response ephemeral.

## Slash Commands in DMs

#### February 9, 2021

Slash Commands are now supported in DMs with bots. Due to this change, some of the fields on the [Interaction object](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure) have been made optional. Newly optional fields don't reflect any behavior changes in Slash Commands within guilds; they are to support commands in the context of a DM only.

## Change to Permission Checking when Creating Channels

#### January 22, 2021

Permission overwrites in the guild channel creation endpoint are now validated against the permissions your bot has in the guild. Permission overwrites specified in the request body when creating guild channels will now require your bot to also have the permissions being applied. Setting `MANAGE_ROLES` permission in channel overwrites is only possible for guild administrators or users with `MANAGE_ROLES` as a permission overwrite in the channel.

## Slash Commands and Interactions

#### December 15, 2020

Slash Commands are here! There's a _lot_ to cover, so go check out specific documentation under [Slash Commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/).

Slash Commands include some new features for webhooks as well:

- Webhooks can now update previously-sent messages from the same webhook using [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message) and [Delete Webhook Message](#DOCS_RESOURCES_WEBHOOK/delete-webhook-message)

This PR also documents the `application` field on the `READY` gateway event, which is a partial [application object](#DOCS_RESOURCES_APPLICATION/application-object) containing `id` and `flags`.

## Inline Replies

#### November 16, 2020

Inline Replies have been added to our documentation. They behave differently in v6 and v8, so be cautious in your implementation:

- Inline replies are type `19` in v8, but remain type `0` in v6
- You can now add a `message_reference` on message create to create a reply
- A new field `referenced_message` has been added to the [Message Object](#DOCS_RESOURCES_CHANNEL/message-object)
- A new field `replied_user` has been added to the [Allowed Mentions Object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)
- [Message Create](#DOCS_TOPICS_GATEWAY_EVENTS/message-create) gateway event is guaranteed to have a `referenced_message` if the message created is a reply. Otherwise, that field is not guaranteed.

## Stickers

#### November 13, 2020

Stickers are now documented as part of the [message](#DOCS_RESOURCES_CHANNEL/message-object) object.

## Gateway v6 Intent Restrictions

#### October 27, 2020

The v6 gateway now applies the restrictions for gateway intents. This means the new chunking limitations are now in effect, regardless of intents being used. See [Request Guild Members](#DOCS_TOPICS_GATEWAY_EVENTS/request-guild-members) for further details.
Additionally, if privileged intents are not enabled in the application dashboard the bot will not receive the events for those intents.

All other intents are always enabled by default unless specified otherwise by the identify payload. We have made a support article to explain some of the changes and resulting issues with more details: [Gateway Update FAQ](https://dis.gd/gwupdate)

## API and Gateway V8

#### September 24, 2020

We've introduced API and Gateway v8! Changes are noted throughout the documentation, and you can also read [this commit in our docs repo](https://github.com/discord/discord-api-docs/commit/545ff4a7883e5eee7ee91d19a5e5d760a0730033) for a full diff.

The changes are:

- API and Gateway v8 are now available. v6 is still the default for the time being.
- [Gateway Intents](#DOCS_TOPICS_GATEWAY/gateway-intents) are now required
- Removed `guild_subscriptions` in identify in favor of [Gateway Intents](#DOCS_TOPICS_GATEWAY/gateway-intents).
- All permissions have been converted to strings-serialized numbers. As such, `permissions_new`, `allow_new`, and `deny_new` have been removed
- The `game` field has been removed. If you need a direct replacement, you can instead reference the first element of `activities`
- Channel Permission Overwrite `type`s are now numbers (0 and 1) instead of strings ("role" and "member"). However due to a current technical constraint, they are string-serialized numbers in audit log `options`.
- `embed_enabled` and `embed_channel_id` have been removed. Use `widget_enabled` and `widget_channel_id` instead.
- Form body errors have been improved to include more helpful messaging on validation. [See more here](#DOCS_REFERENCE/error-messages)
- The `Retry-After` header value and `retry_after` body value is now based in seconds instead of milliseconds (e.g. `123` means 123 seconds)
- The `X-RateLimit-Precision` header is no longer respected. `X-RateLimit-Reset` and `X-RateLimit-Reset-After` are always returned at millisecond precision (e.g. `123.456` instead of `124`)
- Bots no longer receive [Channel Create Gateway Event](#DOCS_TOPICS_GATEWAY_EVENTS/channel-create) for DMs
- `delete-message-days` is no longer available. Use `delete_message_days`.
- Removed `roles`, `premium_since`, and `nick` from [Presence Update Gateway Event](#DOCS_TOPICS_GATEWAY_EVENTS/presence-update)
- Removed some [integration object](#DOCS_RESOURCES_GUILD/integration-object) fields for Discord application integrations
- Removed `include_applications` from [Get Guild Integrations](#DOCS_RESOURCES_GUILD/get-guild-integrations). Application integrations are always included.
- The following deprecated routes have been removed for better naming conventions:

Removed in favor of `/guilds/<guild_id>/widget`:

- `/guilds/<guild_id>/embed`

Removed in favor of `/guilds/<guild_id>/widget.json`:

- `/servers/<guild_id>/embed.json`
- `/servers/<guild_id>/widget.json`
- `/guilds/<guild_id>/embed.json`

Removed in favor of `/guilds/<guild_id>/widget.png`:

- `/guilds/<guild_id>/embed.png`

Removed in favor of `/channels/<channel_id>/messages/bulk-delete`:

- `/channels/<channel_id>/messages/bulk_delete/`

Removed in favor of `/invites/<code>/`:

- `/invite/<code>/`

## New Permission Fields

#### July 28, 2020

Documented `permissions_new`, `allow_new`, and `deny_new` as string-serialized permission bitfields.

## Legacy Mention Behavior Deprecation

#### May 11, 2020

The legacy mention behavior for bots is now removed, and granular control of mentions should use the [Allowed Mentions](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object) API moving forwards.

## New Properties on Guild Members Chunk Event

#### April 24, 2020

The [Guild Members Chunk](#DOCS_TOPICS_GATEWAY_EVENTS/guild-members-chunk) gateway event now contains two properties: `chunk_index` and `chunk_count`. These values can be used to keep track of how many events you have left to receive in response to a [Request Guild Members](#DOCS_TOPICS_GATEWAY_EVENTS/request-guild-members) command.

## New Allowed Mentions Object

#### March 3, 2020

We've added a way to specify mentions in a more granular form. This change also begins the start of a 60 day deprecation cycle on legacy mention behavior. Read more:

- [Allowed mentions object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)

## New Invite Events and Reactions Endpoint

We've added a new endpoint for deleting all reactions of a specific emoji from a message, as well as some new invite and reaction gateway events. Read more:

- [Delete All Reactions for Emoji](#DOCS_RESOURCES_CHANNEL/delete-all-reactions-for-emoji)
- [Invite Create](#DOCS_TOPICS_GATEWAY_EVENTS/invite-create)
- [Invite Delete](#DOCS_TOPICS_GATEWAY_EVENTS/invite-delete)
- [Message Reaction Remove Emoji](#DOCS_TOPICS_GATEWAY_EVENTS/message-reaction-remove-emoji)

## Rich Presence Spectate Approval

#### February 26, 2020

The [Spectate](#DOCS_GAME_SDK_ACTIVITIES/onactivityspectate) functionality of Rich Presence no longer requires whitelisting or approval.

## Gateway Intents

#### February 14, 2020

We've added documentation around a brand new feature: [Gateway Intents!](#DOCS_TOPICS_GATEWAY/gateway-intents) Gateway Intents are a great way to specify which events you want to receive from our gateway. Go on, save yourself some bandwidth and CPU usage.

Using Intents will change the behavior of some existing events and commands, so please refer to:

- [Guild Create](#DOCS_TOPICS_GATEWAY_EVENTS/guild-create)
- [Request Guild Members](#DOCS_TOPICS_GATEWAY_EVENTS/request-guild-members)
- [Guild Member Add](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-add)
- [Guild Member Remove](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-remove)
- [Guild Member Update](#DOCS_TOPICS_GATEWAY_EVENTS/guild-member-update)
- [Presence Update](#DOCS_TOPICS_GATEWAY_EVENTS/presence-update)
- [List Guild Members](#DOCS_RESOURCES_GUILD/list-guild-members)

## IP Discovery Updates

#### December 6, 2019

Updated our [IP discovery message](#DOCS_TOPICS_VOICE_CONNECTIONS/ip-discovery). The old message is deprecated and will be removed in the future.

## GameSDK Version 2.5.6

#### November 27, 2019

Fixed a bug from the 2.5.5 release that caused network handshakes to fail, resulting in no networking data being sent. The networking manager and integrated lobby networking should be full operational again after updating.

## GameSDK Version 2.5.5

#### November 14, 2019

We've shipped some updates to the GameSDK, including support for Linux as well as the IL2CPP backend system for Unity. These changes also fixed a bug in the [`SetUserAchievement()`](#DOCS_GAME_SDK_ACHIEVEMENTS/setuserachievement) method.

Get the latest at the top of the [Getting Started](#DOCS_GAME_SDK_GETTING_STARTED/step-1-get-the-thing) documentation. If you're looking for help interacting with the GameSDK or want to report a bug, join us on the [official Discord](https://discord.gg/discord-developers).

## Changes to Special Channels

#### August 22, 2019

News Channels are now changed to Announcement Channels. Developer License owners will continue to get access to them (both existing and new). Underlying channel type (GUILD_NEWS = 5) remains the same.

## More Precise Rate Limits

#### August 12, 2019

You can now get more precise rate limit reset times, via a new request header. Check out the [rate limits](#DOCS_TOPICS_RATE_LIMITS/) documentation for more information.

## Bot Tokens for Achievements

#### July 18, 2019

You can now use Bot tokens for authorization headers against the HTTP API for [Achievements](#DOCS_GAME_SDK_ACHIEVEMENTS/the-api-way).

## Additional Team Information

#### June 19, 2019

Additional information around Teams has been added to both the API and the documentation. The [Teams](#DOCS_TOPICS_TEAMS/teams) page now includes information about the team and team member objects. Additionally, the [Get Current Application Information](#DOCS_TOPICS_OAUTH2/get-current-bot-application-information) endpoint now returns a `team` object if that application belongs to a team. That documentation has also been updated to includes fields that were missing for applications that are games sold on Discord.

## Added Info Around Nitro Boosting Experiment

#### May 29, 2019

Additional information has been documented to support [Server Nitro Boosting](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting). This includes the addition of a few [message types](#DOCS_RESOURCES_CHANNEL/message-object-message-types), as well as some [new fields on guilds](#DOCS_RESOURCES_GUILD/guild-object-premium-tier). Please note that this feature is currently under experimentation, and these fields may be subject to change.

## Deprecation of Discord-RPC Rich Presence SDK

#### April 29, 2019

The [Discord-RPC](https://github.com/discord/discord-rpc) implementation of Rich Presence has been deprecated in favor of Discord's new GameSDK. If you're interested in using Rich Presence, please read our [SDK Starter Guide](#DOCS_GAME_SDK_GETTING_STARTED/) and check out the relevant functions in the [Activity Manager](#DOCS_GAME_SDK_ACTIVITIES/).

## New Invite Object Fields

#### April 18, 2019

The [Invite Object](#DOCS_RESOURCES_INVITE/invite-object) now includes two additional fields, `target_user` and `target_user_type`.

## Ask to Join & Rich Presence SDK

#### January 14, 2019

Ask to Join no longer requires approval or whitelisting to use. You are welcome to create in-game UI, but all Ask to Join requests are also now handled by the Discord overlay.

There have also been some small additions to the Rich Presence SDK. The previously undocumented `UpdateHandlers()` function is now documented.

## Documentation: Dispatch Store Listings

#### December 11, 2018

Dispatch documentation around store listings has been removed. Store pages for the Discord Store are now managed entirely within the [Developer Portal](https://discord.com/developers).

## Enhancement: User Object

#### November 30, 2018

The [User object](#DOCS_RESOURCES_USER/user-object) now includes two new additional fields, `premium_type` and `flags`. These can be used to know the Nitro status of a user, or determine which HypeSquad house a user is in.

## Documentation Fix: List of Open DMS in Certain Payloads

#### June 19, 2018

The documentation has been updated to correctly note that the `private_channels` field in the [Ready](#DOCS_TOPICS_GATEWAY_EVENTS/ready) should be an empty array, as well as the response from `/users/@me/channels` for a bot user. This change has been in effect for a long time, but the documentation was not updated.

## Deprecation: RPC online member count and members list

#### June 11, 2018

We released server changes that allow guilds to represent an incomplete state of the member list in our clients, which results in inaccurate member lists and online counts over RPC. These fields are now deprecated and will now return an empty members array and an online count of 0 moving forward.

## Enhancement: New Message Properties

#### February 5, 2018

Additional `activity` and `application` fields—as well as corresponding object documentation—have been added to the [Message](#DOCS_RESOURCES_CHANNEL/message-object) object in support of our newly-released [Spotify integration](https://support.discord.com/hc/en-us/articles/360000167212-Discord-Spotify-Connection) and previous Rich Presence enhancements.

## Enhancement: Get Guild Emoji Endpoint

#### January 30, 2018

The [Get Guild Emoji](#DOCS_RESOURCES_EMOJI/get-guild-emoji) response now also includes a user object if the emoji was added by a user.

## Deprecation: Accept Invite Endpoint

#### January 23, 2018

The [Accept Invite](#DOCS_RESOURCES_INVITE/) endpoint is deprecated starting today, and will be discontinued on March 23, 2018. The [Add Guild Member](#DOCS_RESOURCES_GUILD/add-guild-member) endpoint should be used in its place.

## Semi-Breaking Change: Very Large Bot Sharding

#### January 3, 2018

Additional sharding requirements and information for bots in over 100,000 guilds has been added. This requires a small change in numbers of shards for affected bots. See the [documentation](#DOCS_TOPICS_GATEWAY/sharding-for-large-bots) for more information.

## New Feature: Rich Presence

#### November 9, 2017

Rich Presence is now live and available for all developers! Rich Presence allows developers to closely integrate with Discord in a number of new, cool ways like:

- Showing more information about a user's current game in their profile
- Allowing users to post invitations to join their party or spectate their game in chat
- Displaying "Spectate" and "Ask to Join" buttons on users' profiles

For more information, check out our [Rich Presence site](https://discord.com/rich-presence). To get started on development, [read the docs](#DOCS_RICH_PRESENCE_HOW_TO/)!

## Breaking Change: API & Gateway Below v6 Discontinued

#### October 16, 2017

[API](#DOCS_REFERENCE/api-versioning) and Gateway versions below v6 are now discontinued after being previously deprecated. Version 6 is now the default API and Gateway version. Attempting to use a version below 6 will result in an error.

## New Feature: Channel Categories

#### September 20, 2017

Changes have been made throughout the documentation to reflect the addition of channel categories to Discord. These includes an additional field—`parent_id`—to the base [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object and a new [channel category example](#DOCS_RESOURCES_CHANNEL/channel-object-example-channel-category).

## New Feature: Emoji Endpoints

#### September 10, 2017

[Emoji endpoints](#DOCS_RESOURCES_EMOJI/emoji-resource) have been added to the API. Bots can now manage guild emojis to their robo-hearts' content!

## Breaking Change: Presence Activity Objects

#### August 16, 2017

The `type` field in the [activity object](#DOCS_TOPICS_GATEWAY_EVENTS/activity-object) for [Gateway Status Update](#DOCS_TOPICS_GATEWAY_EVENTS/update-presence) and [Presence Update](#DOCS_TOPICS_GATEWAY_EVENTS/presence-update) payloads is no longer optional when the activity object is not null.

## Breaking Change: Default Channels

#### August 3, 2017

After today, we are changing how default channels function. The "default" channel for a given user is now the channel with the highest position that their permissions allow them to see. New guilds will no longer have a default channel with the same id as the guild. Existing guilds will not have their #general channel id changed. It is possible, if permissions are set in such a way, that a user will not have a default channel in a guild.

We saw a use case in many servers where the previously-default #general channel was being repurposed as an announcement-only, non-writable channel for new members by using bots to clear the entire message history. Now, that channel can simply be deleted and re-created with the desired permissions. This change also allows dynamic default channels for users based on permissions.

We are also rolling out a change in conjunction that will allow Discord to remember your last-visited channel in a guild across sessions. Newly-joined users will be directed to the guild's default channel on first join; existing members will return to whichever channel they last visited.

## New Feature: Audit Logs

#### July 24, 2017

Audit logs are here! Well, they've been here all along, but now we've got [documentation](#DOCS_RESOURCES_AUDIT_LOG/) about them. Check it out, but remember: with great power comes great responsibility.

## Breaking Change: Version 6

#### July 19, 2017

- [Channel](#DOCS_RESOURCES_CHANNEL/channel-object) Object
  - `is_private` removed
  - [`type`](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) is now an integer
  - `recipient` is now `recipients`, an array of [user](#DOCS_RESOURCES_USER/user-object) objects
- [Message](#DOCS_RESOURCES_CHANNEL/message-object) Object
  - [`type`](#DOCS_RESOURCES_CHANNEL/message-object-message-types) added to support system messages
- [Status Update](#DOCS_TOPICS_GATEWAY_EVENTS/update-presence-gateway-presence-update-structure) Object
  - `idle_since` renamed to `since`
