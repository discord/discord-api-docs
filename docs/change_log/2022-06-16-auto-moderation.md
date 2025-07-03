---
title: "Auto Moderation"
date: "2022-06-16"
---

Add new [Auto Moderation feature](#DOCS_RESOURCES_AUTO_MODERATION) which enables guilds to moderate message content based on keywords, harmful links, and unwanted spam. This change includes:

* New endpoints for [creating](#DOCS_RESOURCES_AUTO_MODERATION/create-auto-moderation-rule), [updating](#DOCS_RESOURCES_AUTO_MODERATION/modify-auto-moderation-rule), and [deleting](#DOCS_RESOURCES_AUTO_MODERATION/delete-auto-moderation-rule) Auto Moderation rules
* New gateway events emitted when Auto Moderation rules are [created](#DOCS_EVENTS_GATEWAY_EVENTS/auto-moderation-rule-create) (`AUTO_MODERATION_RULE_CREATE`), [updated](#DOCS_EVENTS_GATEWAY_EVENTS/auto-moderation-rule-update) (`AUTO_MODERATION_RULE_UPDATE `), and [deleted](#DOCS_EVENTS_GATEWAY_EVENTS/auto-moderation-rule-delete) (`AUTO_MODERATION_RULE_DELETE `). Requires the `AUTO_MODERATION_CONFIGURATION` (`1 << 20`) intent
* New gateway event emitted when an [action is executed](#DOCS_EVENTS_GATEWAY_EVENTS/auto-moderation-action-execution) (`AUTO_MODERATION_ACTION_EXECUTION`). Requires the `AUTO_MODERATION_EXECUTION` (`1 << 21`) intent
* New [audit log entries](#DOCS_RESOURCES_AUDIT_LOG/audit-log-entry-object-audit-log-events) when rules are created (`AUTO_MODERATION_RULE_CREATE`), updated (`AUTO_MODERATION_RULE_UPDATE`), or deleted (`AUTO_MODERATION_RULE_DELETE`), or when Auto Moderation performs an action (`AUTO_MODERATION_BLOCK_MESSAGE`)
