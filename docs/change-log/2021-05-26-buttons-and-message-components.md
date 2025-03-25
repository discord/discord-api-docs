---
title: "Buttons and Message Components"
date: "2021-05-26"
---

Message components are now available with our first two components: a layout-based `ActionRow` and...buttons!

You can now include buttons on messages sent by your app, whether they're bot messages or responses to interactions. [Learn more about message components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/).

The addition of message components means new fields and response types:

* An optional `components` field has been added to the [message object](#DOCS_RESOURCES_MESSAGE/message-object)
* New response types `6` and `7` have been added for [interaction responses](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object-interaction-callback-type), valid only for component-based interactions
