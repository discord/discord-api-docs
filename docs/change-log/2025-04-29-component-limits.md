---
title: "Raised Component Limits"
date: "2025-04-29"
topics:
- "User Apps"
- "Interactions"
- "Components"
---

We're removing the top level component limit and raising the limit on number of components in a message to 40 when using the [`IS_COMPONENTS_V2` message flag](/docs/resources/message#message-object-message-flags)! We're also removing the limit on the number of components in a [Container Component](/docs/components/reference#container). Legacy messages have not changed and continue to allow up to 5 action rows.

#### What's New

- **Total components**: The limit for total components in a message has been increased to 40.
- **Top-level components**: There is no longer a limit on top level components in a message (previously it was 10).
- **[Container Component](/docs/components/reference#container)**: There is no longer a limit on the number of components in a Container Component (previously it was 10).

#### Developer Resources

- Check out our [Component Reference](/docs/components/reference) for detailed specifications on all available components.
- Learn how to build rich message layouts with components with [Using Message Components](/docs/components/using-message-components).
