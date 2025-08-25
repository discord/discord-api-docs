---
title: "Introducing New Modal Components!"
date: "2025-08-25"
topics:
- "Interactions"
- "Components"
---

You asked for them, and now they're here! Modals are getting new components!!

#### What's New

We're introducing a new top-level [Label](/docs/components/reference#label) component for modals that have a `label`, `description`, and can contain a Text Input or a String Select! You heard right, String Selects now work in modals!

- String Selects now work in modals when placed inside a Label component
- Text Inputs can also be used inside a Label component
- When a Text Input is used in a Label component the `label` field on the Text Input is not allowed in favor of `label` on the Label component
- ActionRow + TextInput is now deprecated in favor of the new Label component for better accessibility
- The `required` field is now available on String Selects (defaults to true in modals, ignored in messages)
- The `disabled` field on String Selects is not currently allowed in modals, and will trigger an error if used

We've also documented [modal interaction responses](/docs/interactions/receiving-and-responding#interaction-object-component-interaction-response-structures) and resolved objects for interactive components in each component's Examples section.

#### New Layout Component

- [**Label**](/docs/components/reference#label) - A new top-level component that lets you add a title and description to your modal components!

#### Updates to Modal Components

- [**Text Input**](/docs/components/reference#text-input) - Text Input can now be used in a [Label](/docs/components/reference#label) 
- [**String Select**](/docs/components/reference#string-select) - String Selects can be used in modals! Place them in a [Label](/docs/components/reference#label)

#### Getting Started

- [Using Modal Components](/docs/components/using-modal-components) - Dive into creating a modal

#### Developer Resources

Check out our [Component Reference](/docs/components/reference) for details on all available components.
