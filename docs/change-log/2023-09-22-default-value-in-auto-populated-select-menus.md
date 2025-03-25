---
title: "Default Value in Auto-populated Select Menus"
date: "2023-09-22"
---

A new `default_values` field was added for user (`5`), role (`6`), mentionable (`7`), and channel (`8`) [select menu components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menus). `default_values` is a list of [default value objects](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object-select-default-value-structure), which each include an `id` (the snowflake value for the resource), as well as a corresponding `type` (either `"user"`, `"role"`, or `"channel"`).
