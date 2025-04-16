---
title: "Add Join Raid and Mention Raid fields"
date: "2023-05-05"
---

* Add Auto Moderation `mention_raid_protection_enabled` [trigger\_metadata](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-metadata) field for the `MENTION_SPAM` [trigger\_type](/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types). If this field and its parent `MENTION_SPAM` rule are enabled, Auto Moderation provides baseline detection against sudden spikes in mention activity that are normally indicative of mention raids.
* Add `safety_alerts_channel_id` [guild](/docs/resources/guild#guild-object) field and [`RAID_ALERTS_DISABLED` guild feature flag](/docs/resources/guild#guild-object-guild-features) which are associated with join raid protection
