---
title: "Add Auto Moderation Allow List for Keyword Rules and Increase Max Keyword Rules Per Guild Limit"
date: "2022-11-22"
---

* Auto Moderation rules with [trigger\_type](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types) `KEYWORD` now support an `allow_list` field in its [trigger\_metadata](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-metadata). Any message content that matches an `allow_list` keyword will be ignored by the Auto Moderation `KEYWORD` rule. Each `allow_list` keyword can be a multi-word phrase and can contain [wildcard symbols](/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-matching-strategies).
* Increase maximum number of rules with `KEYWORD` [trigger\_type](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types) per guild from 3 to 5
* Increase maximum length for each regex pattern in the `regex_patterns` [trigger\_metadata](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-metadata) field from 75 to 260.
