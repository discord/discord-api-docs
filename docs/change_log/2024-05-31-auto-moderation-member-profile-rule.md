---
title: "Auto Moderation Member Profile Rule"
date: "2024-05-31T07:00:00.000Z"
breaking: false
---

* Add Auto Moderation `MEMBER_PROFILE` rule [trigger\_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types). This rule type will check if a member's profile contains disallowed keywords.
* Add Auto Moderation `BLOCK_MEMBER_INTERACTION` [action type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-action-object-action-types) currently available for the `MEMBER_PROFILE` rule [trigger\_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types). This action will "quarantine" the member to some extent and prevent them from performing most interactions within a specific server.
