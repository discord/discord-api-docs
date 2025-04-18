---
title: "Add Default Layout setting for Forum channels"
date: "2022-12-13"
---

`default_forum_layout` is an optional field in the [channel object](/docs/resources/channel) that indicates the default layout for posts in a [forum channel](/docs/topics/threads#forums). A value of 1 (`LIST_VIEW`) indicates that posts will be displayed as a chronological list, and 2 (`GALLERY_VIEW`) indicates they will be displayed as a collection of tiles. If `default_forum_layout` hasn't been set, the value will be `0`.

Setting `default_forum_layout` requires the `MANAGE_CHANNELS` permission.
