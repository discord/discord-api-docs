# Change Log

## Slash Command Permissions

#### April 5, 2021

Need to keep some of your Slash Commands safe from prying eyes, or only available to the right people? Slash Commands now support [command permissions](#DOCS_INTERACTIONS_SLASH_COMMANDS/permissions)!

You can enable or disable a command (guild or global) for a specific user or role in a guild. For now, users will still be able to see the commands, but won't be able to use them.

New routes have been added to support this functionality:

- [`GET Guild Application Command Permissions`](#DOCS_INTERACTIONS_SLASH_COMMANDS/getguildapplicationcommandpermissions)
- [`GET Application Command Permissions`](#DOCS_INTERACTIONS_SLASH_COMMANDS/getapplicationcommandpermissions)
- [`PUT Application Command Permissions`](#DOCS_INTERACTIONS_SLASH_COMMANDS/putapplicationcommandpermissions)

A `default_permission` field has also been added to the [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand) model. This field allows you to disable commands for everyone in a guild by default, if you prefer to make some of your commands an opt-in experience.

## Large Bot Sharding Lowered to 150,000 Guilds 

#### March 15, 2021

There have been reports that sessions have higher frequency of errors when starting if a bot has joined too many guilds (the gateway connection times out). To account for this we have lowered the requirement for large bot sharding down to 150,000 guilds in order to improve reliability.

## Changes to Slash Command Response Types and Flags

#### March 5, 2021

Changes to interaction response types have been made to support better designs for Slash Commands:

- Type `2` `Acknowledge` has been deprecated
- Type `3` `ChannelMessage` has been deprecated
- Type `5` `AcknowledgeWithSource` has been renamed to `DeferredChannelMessageWithSource`

These deprecated types will be removed and break on **April 9, 2021**.

Additionally, `flags` has been documented on [InteractionApplicationCommandCallbackData](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-response-interactionapplicationcommandcallbackdata). Setting `flags` to `64` will make the interaction response ephemeral.

## Slash Commands in DMs

#### February 9, 2021

Slash Commands are now supported in DMs with bots. Due to this change, some of the fields on the [Interaction object](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction) have been made optional. Newly optional fields don't reflect any behavior changes in Slash Commands within guilds; they are to support commands in the context of a DM only.

## Change to Permission Checking when Creating Channels

#### January 22, 2021

Permission overwrites in the guild channel creation endpoint are now validated against the permissions your bot has in the guild. Permission overwrites specified in the request body when creating guild channels will now require your bot to also have the permissions being applied. Setting `MANAGE_ROLES` permission in channel overwrites is only possible for guild administrators or users with `MANAGE_ROLES` as a permission overwrite in the channel.

## Slash Commands and Interactions

#### December 15, 2020

Slash Commands are here! There's a _lot_ to cover, so go check out specific documentation under [Slash Commands](#DOCS_INTERACTIONS_SLASH_COMMANDS/).

Slash Commands include some new features for webhooks as well:

- Webhooks can now update previously-sent messages from the same webhook using [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message) and [Delete Webhook Message](#DOCS_RESOURCES_WEBHOOK/delete-webhook-message)

This PR also documents the `application` field on the `READY` gateway event, which is a partial [application object](#DOCS_TOPICS_OAUTH2/application-object) containing `id` and `flags`.

## Inline Replies

#### November 16, 2020

Inline Replies have been added to our documentation. They behave differently in v6 and v8, so be cautious in your implementation:

- Inline replies are type `19` in v8, but remain type `0` in v6
- You can now add a `message_reference` on message create to create a reply
- A new field `referenced_message` has been added to the [Message Object](#DOCS_RESOURCES_CHANNEL/message-object)
- A new field `replied_user` has been added to the [Allowed Mentions Object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)
- [Message Create](#DOCS_TOPICS_GATEWAY/message-create) gateway event is guaranteed to have a `referenced_message` if the message created is a reply. Otherwise, that field is not guaranteed.

## Stickers

#### November 13, 2020

Stickers are now documented as part of the [message](#DOCS_RESOURCES_CHANNEL/message-object) object. 

## Gateway v6 Intent Restrictions

#### October 27, 2020

The v6 gateway now applies the restrictions for gateway intents. This means the new chunking limitations are now in effect, regardless of intents being used. See [Request Guild Members](#DOCS_TOPICS_GATEWAY/request-guild-members) for further details.
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
- Bots no longer receive [Channel Create Gateway Event](#DOCS_TOPICS_GATEWAY/channel-create) for DMs
- `delete-message-days` is no longer available. Use `delete_message_days`.
- Removed `roles`, `premium_since`, and `nick` from [Presence Update Gateway Event](#DOCS_TOPICS_GATEWAY/presence-update)
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

The [Guild Members Chunk](#DOCS_TOPICS_GATEWAY/guild-members-chunk) gateway event now contains two properties: `chunk_index` and `chunk_count`. These values can be used to keep track of how many events you have left to receive in response to a [Request Guild Members](#DOCS_TOPICS_GATEWAY/request-guild-members) command.

## New Allowed Mentions Object

#### March 3, 2020

We've added a way to specify mentions in a more granular form. This change also begins the start of a 60 day deprecation cycle on legacy mention behavior. Read more:

- [Allowed mentions object](#DOCS_RESOURCES_CHANNEL/allowed-mentions-object)

## New Invite Events and Reactions Endpoint

We've added a new endpoint for deleting all reactions of a specific emoji from a message, as well as some new invite and reaction gateway events. Read more:

- [Delete All Reactions for Emoji](#DOCS_RESOURCES_CHANNEL/delete-all-reactions-for-emoji)
- [Invite Create](#DOCS_TOPICS_GATEWAY/invite-create)
- [Invite Delete](#DOCS_TOPICS_GATEWAY/invite-delete)
- [Message Reaction Remove Emoji](#DOCS_TOPICS_GATEWAY/message-reaction-remove-emoji)

## Rich Presence Spectate Approval

#### February 26, 2020

The [Spectate](#DOCS_GAME_SDK_ACTIVITIES/onactivityspectate) functionality of Rich Presence no longer requires whitelisting or approval.

## Gateway Intents

#### February 14, 2020

We've added documentation around a brand new feature: [Gateway Intents!](#DOCS_TOPICS_GATEWAY/gateway-intents) Gateway Intents are a great way to specify which events you want to receive from our gateway. Go on, save yourself some bandwidth and CPU usage.

Using Intents will change the behavior of some existing events and commands, so please refer to:

- [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create)
- [Request Guild Members](#DOCS_TOPICS_GATEWAY/request-guild-members)
- [Guild Member Add](#DOCS_TOPICS_GATEWAY/guild-member-add)
- [Guild Member Remove](#DOCS_TOPICS_GATEWAY/guild-member-remove)
- [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update)
- [Presence Update](#DOCS_TOPICS_GATEWAY/presence-update)
- [List Guild Members](#DOCS_RESOURCES_GUILD/list-guild-members)

## IP Discovery Updates

#### December 6, 2019

Updated our [IP discovery message](#DOCS_TOPICS_VOICE_CONNECTIONS/ip-discovery). The old message is deprecated and will be removed in the future.

## GameSDK Version 2.5.6

#### November 27, 2019

Fixed a bug from the 2.5.5 release that caused network handshakes to fail, resulting in no networking data being sent. The networking manager and integrated lobby networking should be full operational again after updating.

## GameSDK Version 2.5.5

#### November 14, 2019

We've shipped some updates to the GameSDK, including support for Linux as well as the IL2CPP backend system for Unity. These changes also fixed a bug in the [`SetUserAchievement()`](#DOCS_GAME_SDK_ACHIEVEMENTS/set-user-achievement) method.

Get the latest at the top of the [Getting Started](#DOCS_GAME_SDK_SDK_STARTER_GUIDE/step-1-get-the-thing) documentation. If you're looking for help interacting with the GameSDK or want to report a bug, join us on the [official Discord](https://discord.gg/discord-developers).

## Changes to Special Channels

#### August 22, 2019

News Channels are now changed to [Announcement Channels](#DOCS_GAME_AND_SERVER_MANAGEMENT_SPECIAL_CHANNELS/announcement-channels). Developer License owners will continue to get access to them (both existing and new). Underlying channel type (GUILD_NEWS = 5) remains the same.

## More Precise Rate Limits

#### August 12, 2019

You can now get more precise rate limit reset times, via a new request header. Check out the [rate limits](#DOCS_TOPICS_RATE_LIMITS/more-precise-rate-limit-resets) documentation for more information.

## Bot Tokens for Achievements

#### July 18, 2019

You can now use Bot tokens for authorization headers against the HTTP API for [Achievements](#DOCS_GAME_SDK_ACHIEVEMENTS/the-api-way).

## Additional Team Information

#### June 19, 2019

Additional information around Teams has been added to both the API and the documentation. The [Teams](#DOCS_TOPICS_TEAMS/api-stuff) page now includes information about the team and team member objects. Additionally, the [Get Current Application Information](#DOCS_TOPICS_OAUTH2/get-current-application-information) endpoint now returns a `team` object if that application belongs to a team. That documentation has also been updated to includes fields that were missing for applications that are games sold on Discord.

## Added Info Around Nitro Boosting Experiment

#### May 29, 2019

Additional information has been documented to support [Server Nitro Boosting](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting). This includes the addition of a few [message types](#DOCS_RESOURCES_CHANNEL/message-object-message-types), as well as some [new fields on guilds](#DOCS_RESOURCES_GUILD/guild-object-premium-tier). Please note that this feature is currently under experimentation, and these fields may be subject to change.

## Deprecation of Discord-RPC Rich Presence SDK

#### April 29, 2019

The [Discord-RPC](https://github.com/discord/discord-rpc) implementation of Rich Presence has been deprecated in favor of Discord's new GameSDK. If you're interested in using Rich Presence, please read our [SDK Starter Guide](#DOCS_GAME_SDK_SDK_STARTER_GUIDE/) and check out the relevant functions in the [Activity Manager](#DOCS_GAME_SDK_ACTIVITIES/).

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

The documentation has been updated to correctly note that the `private_channels` field in the [Ready](#DOCS_TOPICS_GATEWAY/ready) should be an empty array, as well as the response from `/users/@me/channels` for a bot user. This change has been in effect for a long time, but the documentation was not updated.

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

The [Accept Invite](#DOCS_RESOURCES_INVITE/accept-invite) endpoint is deprecated starting today, and will be discontinued on March 23, 2018. The [Add Guild Member](#DOCS_RESOURCES_GUILD/add-guild-member) endpoint should be used in its place.

## Semi-Breaking Change: Very Large Bot Sharding

#### January 3, 2018

Additional sharding requirements and information for bots in over 100,000 guilds has been added. This requires a small change in numbers of shards for affected bots. See the [documentation](#DOCS_TOPICS_GATEWAY/sharding-for-very-large-bots) for more information.

## New Feature: Rich Presence

#### November 9, 2017

Rich Presence is now live and available for all developers! Rich Presence allows developers to closely integrate with Discord in a number of new, cool ways like:

- Showing more information about a user's current game in their profile
- Allowing users to post invitations to join their party or spectate their game in chat
- Displaying "Spectate" and "Ask to Join" buttons on users' profiles

For more information, check out our [Rich Presence site](https://discord.com/rich-presence). To get started on development, [read the docs](#DOCS_RICH_PRESENCE_HOW_TO/)!

## Breaking Change: API & Gateway Below v6 Discontinued

#### October 16, 2017

[API](#DOCS_REFERENCE/api-versioning) and [Gateway](#DOCS_TOPICS_GATEWAY/gateway-protocol-versions) versions below v6 are now discontinued after being previously deprecated. Version 6 is now the default API and Gateway version. Attempting to use a version below 6 will result in an error.

## New Feature: Channel Categories

#### September 20, 2017

Changes have been made throughout the documentation to reflect the addition of channel categories to Discord. These includes an additional field—`parent_id`—to the base [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object and a new [channel category example](#DOCS_RESOURCES_CHANNEL/channel-object-example-channel-category).

## New Feature: Emoji Endpoints

#### September 10, 2017

[Emoji endpoints](#DOCS_RESOURCES_EMOJI/emoji-resource) have been added to the API. Bots can now manage guild emojis to their robo-hearts' content!

## Breaking Change: Presence Activity Objects

#### August 16, 2017

The `type` field in the [activity object](#DOCS_TOPICS_GATEWAY/activity-object) for [Gateway Status Update](#DOCS_TOPICS_GATEWAY/update-status) and [Presence Update](#DOCS_TOPICS_GATEWAY/presence-update) payloads is no longer optional when the activity object is not null.

## Breaking Change: Default Channels

#### August 3, 2017

After today, we are changing how default channels function. The "default" channel for a given user is now the channel with the highest position that their permissions allow them to see. New guilds will no longer have a default channel with the same id as the guild. Existing guilds will not have their #general channel id changed. It is possible, if permissions are set in such a way, that a user will not have a default channel in a guild.

We saw a use case in many servers where the previously-default #general channel was being repurposed as an announcement-only, non-writable channel for new members by using bots to clear the entire message history. Now, that channel can simply be deleted and re-created with the desired permissions. This change also allows dynamic default channels for users based on permissions.

We are also rolling out a change in conjunction that will allow Discord to remember your last-visited channel in a guild across sessions. Newly-joined users will be directed to the guild's default channel on first join; existing members will return to whichever channel they last visited.

## New Feature: Audit Logs

#### July 24, 2017

Audit logs are here! Well, they've been here all along, but now we've got [documentation](#DOCS_AUDIT_LOG/audit-logs) about them. Check it out, but remember: with great power comes great responsibility.

## Breaking Change: Version 6

#### July 19, 2017

- [Channel](#DOCS_RESOURCES_CHANNEL/channel-object) Object
  - `is_private` removed
  - [`type`](#DOCS_RESOURCES_CHANNEL/channel-object-channel-types) is now an integer
  - `recipient` is now `recipients`, an array of [user](#DOCS_RESOURCES_USER/user-object) objects
- [Message](#DOCS_RESOURCES_CHANNEL/message-object) Object
  - [`type`](#DOCS_RESOURCES_CHANNEL/message-object-message-types) added to support system messages
- [Status Update](#DOCS_TOPICS_GATEWAY/update-status-gateway-status-update-structure) Object
  - `idle_since` renamed to `since`
