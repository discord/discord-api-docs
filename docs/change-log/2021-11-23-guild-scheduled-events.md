---
title: "Guild Scheduled Events"
date: "2021-11-23"
---

* Add official support for `guild_scheduled_events` field on `Guild` resource sent with `GUILD_CREATE` event

#### Nov 18, 2021

* Breaking change for return type for `GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}/users`
* Add `with_user_count` query param for `GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}`
* Return additional `creator` field by default in response for `GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}`
* More details and clarification for the guild scheduled events feature.
* Document support for `before` and `after` query params for `GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}/users`

#### Nov 15, 2021

Add new documentation for the recently released Guild Scheduled Events feature.
