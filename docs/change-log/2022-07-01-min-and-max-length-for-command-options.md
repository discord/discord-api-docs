---
title: "Min and Max Length for Command Options"
date: "2022-07-01"
---

Application [command options](/docs/interactions/application-commands#application-command-object-application-command-option-structure) of type `STRING` now includes optional `min_length` and `max_length` fields to control the length of text a user can input.

The value of `min_length` must be greater or equal to `0`, and the value of `max_length` must be greater or equal to `1`.
