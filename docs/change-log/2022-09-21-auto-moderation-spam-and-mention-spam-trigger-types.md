---
title: "Auto Moderation Spam and Mention Spam Trigger Types"
date: "2022-09-21"
---

Two new [trigger types](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types) were added to Auto Moderation:

* `MENTION_SPAM` blocks messages that mention more than a set number of unique server members or roles. Apps can define the number (up to 50) using the `mention_total_limit` field in the [trigger metadata object](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-metadata) when creating or updating an Auto Moderation rule.
* `SPAM` blocks links and messages that are identified as spam.

More information can be found in the [Auto Moderation documentation](/docs/resources/auto-moderation).
