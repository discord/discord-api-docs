---
title: "Auto Moderation Member Profile Rule"
date: "2024-05-31"
---

* Add Auto Moderation `MEMBER_PROFILE` rule [trigger\_type](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types). This rule type will check if a member's profile contains disallowed keywords.
* Add Auto Moderation `BLOCK_MEMBER_INTERACTION` [action type](/docs/resources/auto-moderation#auto-moderation-action-object-action-types) currently available for the `MEMBER_PROFILE` rule [trigger\_type](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types). This action will "quarantine" the member to some extent and prevent them from performing most interactions within a specific server.
