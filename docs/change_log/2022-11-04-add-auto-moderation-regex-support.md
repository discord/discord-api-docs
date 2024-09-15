---
title: "Add Auto Moderation Regex Support"
date: "2022-11-04"
---

Auto Moderation rules with [trigger\_type](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types) `KEYWORD` now support
a `regex_patterns` field in its [trigger\_metadata](#DOCS_RESOURCES_AUTO_MODERATION/auto-moderation-rule-object-trigger-types).
Regex patterns are a powerful way to describe many keywords all at once using one expression. Only Rust flavored regex is supported, which can be tested in online editors such as [Rustexp](https://rustexp.lpil.uk/).
