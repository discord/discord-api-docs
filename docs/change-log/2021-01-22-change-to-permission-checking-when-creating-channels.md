---
title: "Change to Permission Checking when Creating Channels"
date: "2021-01-22"
---

Permission overwrites in the guild channel creation endpoint are now validated against the permissions your bot has in the guild. Permission overwrites specified in the request body when creating guild channels will now require your bot to also have the permissions being applied. Setting `MANAGE_ROLES` permission in channel overwrites is only possible for guild administrators or users with `MANAGE_ROLES` as a permission overwrite in the channel.
