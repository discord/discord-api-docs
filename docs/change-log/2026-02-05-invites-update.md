---
title: "Community Invites Update"
date: "2026-02-05"
breaking: true
topics:
- "HTTP API"
---

We've updated the community invite endpoints with two changes due to a security concern:
- [Get Target Users](/docs/resources/invite#get-target-users) returns a standardized CSV file with a header `user_id` and each user ID on its own line. If you relied on the header you submitted or weren't reading it from the file you got back you'll need to update to expect only `user_id` as the header in the csv now.
- [Get Channel Invites](/docs/resources/channel#get-channel-invites) returns a partial for [roles](/docs/topics/permissions#role-object) instead of the full role object. This is a breaking change as it used to return the full role object and now only contains `id`, `name`, `position`, `color`, `colors`, `icon`, and `unicode_emoji`.
