---
title: "Auto Moderation Spam and Mention Spam Trigger Types"
date: "2022-09-21T07:00:00.000Z"
breaking: false
---

Two new [trigger types](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) were added to Auto Moderation:

* `MENTION_SPAM` blocks messages that mention more than a set number of unique server members or roles. Apps can define the number (up to 50) using the `mention_total_limit` field in the [trigger metadata object](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-metadata) when creating or updating an Auto Moderation rule.
* `SPAM` blocks links and messages that are identified as spam.

More information can be found in the [Auto Moderation documentation](#DOCS_RESOURCES_AUTO_MODERATION).
