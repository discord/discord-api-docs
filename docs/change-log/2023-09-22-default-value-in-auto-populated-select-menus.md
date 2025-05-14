---
title: "Default Value in Auto-populated Select Menus"
date: "2023-09-22"
---

A new `default_values` field was added for user (`5`), role (`6`), mentionable (`7`), and channel (`8`) [select menu components](/docs/components/reference). `default_values` is a list of [default value objects](/docs/components/reference#user-select-select-default-value-structure), which each include an `id` (the snowflake value for the resource), as well as a corresponding `type` (either `"user"`, `"role"`, or `"channel"`).
