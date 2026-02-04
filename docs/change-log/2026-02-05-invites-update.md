---
title: "New Invite Endpoints"
date: "2026-01-13"
breaking: true
topics:
- "HTTP API"
---

We've updated the community invite endpoints with two changes:
- [Get Target Users](/docs/resources/invite#get-target-users) returns a standardized CSV file with a header `user_id` and each user ID on its own line.
- [Get Channel Invites](/docs/resources/channel#get-channel-invites) returns a partial for [roles](/docs/topics/permissions#role-object) instead of the full role object.
