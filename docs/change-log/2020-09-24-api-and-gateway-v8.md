---
title: "API and Gateway V8"
date: "2020-09-24"
---

We've introduced API and Gateway v8! Changes are noted throughout the documentation, and you can also read [this commit in our docs repo](https://github.com/discord/discord-api-docs/commit/545ff4a7883e5eee7ee91d19a5e5d760a0730033) for a full diff.

The changes are:

* API and Gateway v8 are now available. v6 is still the default for the time being.
* [Gateway Intents](/docs/events/gateway#gateway-intents) are now required
* Removed `guild_subscriptions` in identify in favor of [Gateway Intents](/docs/events/gateway#gateway-intents).
* All permissions have been converted to strings-serialized numbers. As such, `permissions_new`, `allow_new`, and `deny_new` have been removed
* The `game` field has been removed. If you need a direct replacement, you can instead reference the first element of `activities`
* Channel Permission Overwrite `type`s are now numbers (0 and 1) instead of strings ("role" and "member"). However due to a current technical constraint, they are string-serialized numbers in audit log `options`.
* `embed_enabled` and `embed_channel_id` have been removed. Use `widget_enabled` and `widget_channel_id` instead.
* Form body errors have been improved to include more helpful messaging on validation. [See more here](/docs/reference#error-messages)
* The `Retry-After` header value and `retry_after` body value is now based in seconds instead of milliseconds (e.g. `123` means 123 seconds)
* The `X-RateLimit-Precision` header is no longer respected. `X-RateLimit-Reset` and `X-RateLimit-Reset-After` are always returned at millisecond precision (e.g. `123.456` instead of `124`)
* Bots no longer receive [Channel Create Gateway Event](/docs/events/gateway-events#channel-create) for DMs
* `delete-message-days` is no longer available. Use `delete_message_days`.
* Removed `roles`, `premium_since`, and `nick` from [Presence Update Gateway Event](/docs/events/gateway-events#presence-update)
* Removed some [integration object](/docs/resources/guild#integration-object) fields for Discord application integrations
* Removed `include_applications` from [Get Guild Integrations](/docs/resources/guild#get-guild-integrations). Application integrations are always included.
* The following deprecated routes have been removed for better naming conventions:

Removed in favor of `/guilds/<guild_id>/widget`:

* `/guilds/<guild_id>/embed`

Removed in favor of `/guilds/<guild_id>/widget.json`:

* `/servers/<guild_id>/embed.json`
* `/servers/<guild_id>/widget.json`
* `/guilds/<guild_id>/embed.json`

Removed in favor of `/guilds/<guild_id>/widget.png`:

* `/guilds/<guild_id>/embed.png`

Removed in favor of `/channels/<channel_id>/messages/bulk-delete`:

* `/channels/<channel_id>/messages/bulk_delete/`

Removed in favor of `/invites/<code>/`:

* `/invite/<code>/`
