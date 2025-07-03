---
title: "New Select Menu Components"
date: "2022-10-13"
---

Four new select menu [component types](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object-component-types) have been added to make it easier to populate selects with common resources in Discord:

* User select (type `5`)
* Role select (type `6`)
* Mentionable (user *and* role) select (type `7`)
* Channel select (type `8`)

The new select menu components are defined similarly to the existing string select menu—with the exception of not including the `options` field and, within channel select menus, having the option to include a `channel_types` field. The [select menu interaction](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object-select-menu-interaction) apps receive also contain a [`resolved` field](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object-select-menu-resolved-object) for the new components.

More details can be found in the updated [select menu documentation](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menus).
