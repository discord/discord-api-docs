---
title: "Guild Audit Log Events"
date: "2023-01-18"
---

At long last, a new [`GUILD_AUDIT_LOG_ENTRY_CREATE`](#DOCS_TOPICS_GATEWAY_EVENTS/guild-audit-log-entry-create) event has been added to the gateway, allowing your application to react to moderation actions in guilds. The `VIEW_AUDIT_LOG` permission is required in order to receive these events, and the [`GUILD_MODERATION` intent](#DOCS_TOPICS_GATEWAY/gateway-intents) needs to be set when connecting to the gateway.
