---
title: "Limit Number of Fields in Embeds"
date: "2023-12-19"
---

[Embed objects](#DOCS_RESOURCES_MESSAGE/embed-object) are now limited more explicitly to 25 [embed fields](#DOCS_RESOURCES_MESSAGE/embed-object-embed-field-structure). If you pass more than 25 fields within the an embed's `fields` property, an error will be returned.

Previously, only the first 25 embed fields would be displayed within the embed but no error was returned.
