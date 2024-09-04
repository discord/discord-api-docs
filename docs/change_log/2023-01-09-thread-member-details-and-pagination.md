---
title: "Thread Member Details and Pagination"
date: "2023-01-09"
breaking: true
---

A new `member` field was added to the [thread member object](#DOCS_RESOURCES_CHANNEL/thread-member-object). `member` is a [guild member object](#DOCS_RESOURCES_GUILD/guild-member-object) that will be included within returned thread member objects when the new `with_member` field is set to `true` in the [List Thread Members](#DOCS_RESOURCES_CHANNEL/list-thread-members) (`GET /channels/<channel_id>/thread-members`) and [Get Thread Member](#DOCS_RESOURCES_CHANNEL/get-thread-member) (`GET /channels/<channel_id>/thread-members/<user_id>`) endpoints.

Setting `with_member` to `true` will also enable pagination for the [List Thread Members](#DOCS_RESOURCES_CHANNEL/list-thread-members) endpoint. When the results are paginated, you can use the new `after` and `limit` fields to fetch additional thread members and limit the number of thread members returned. By default, `limit` is 100.

#### Upcoming Changes

Starting in API v11, [List Thread Members](#DOCS_RESOURCES_CHANNEL/list-thread-members) (`GET /channels/<channel_id>/thread-members`) will *always* return paginated results, regardless of whether `with_member` is passed or not.
