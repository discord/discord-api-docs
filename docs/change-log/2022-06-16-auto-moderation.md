---
title: "Auto Moderation"
date: "2022-06-16"
---

Add new [Auto Moderation feature](/docs/resources/auto-moderation) which enables guilds to moderate message content based on keywords, harmful links, and unwanted spam. This change includes:

* New endpoints for [creating](/docs/resources/auto-moderation#create-auto-moderation-rule), [updating](/docs/resources/auto-moderation#modify-auto-moderation-rule), and [deleting](/docs/resources/auto-moderation#delete-auto-moderation-rule) Auto Moderation rules
* New gateway events emitted when Auto Moderation rules are [created](/docs/events/gateway-events#auto-moderation-rule-create) (`AUTO_MODERATION_RULE_CREATE`), [updated](/docs/events/gateway-events#auto-moderation-rule-update) (`AUTO_MODERATION_RULE_UPDATE `), and [deleted](/docs/events/gateway-events#auto-moderation-rule-delete) (`AUTO_MODERATION_RULE_DELETE `). Requires the `AUTO_MODERATION_CONFIGURATION` (`1 << 20`) intent
* New gateway event emitted when an [action is executed](/docs/events/gateway-events#auto-moderation-action-execution) (`AUTO_MODERATION_ACTION_EXECUTION`). Requires the `AUTO_MODERATION_EXECUTION` (`1 << 21`) intent
* New [audit log entries](/docs/resources/audit-log#audit-log-entry-object-audit-log-events) when rules are created (`AUTO_MODERATION_RULE_CREATE`), updated (`AUTO_MODERATION_RULE_UPDATE`), or deleted (`AUTO_MODERATION_RULE_DELETE`), or when Auto Moderation performs an action (`AUTO_MODERATION_BLOCK_MESSAGE`)
