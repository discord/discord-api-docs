---
title: "Introducing New Components for Messages!"
date: "2025-04-22"
topics:
- "User Apps"
- "Interactions"
- "Components"
---

We're bringing new components to messages that you can use in your apps. They allow you to have full control over the layout of your messages.

#### Why We Built Components V2

Our previous components system, while functional, had limitations:

- Content, attachments, embeds, and components had to follow fixed vertical positioning rules
- Visual styling options were limited
- It was difficult to make visually cohesive experiences that combined the various functionalities of messages given they were expressed in a non-unified system

Our new component system addresses these challenges with fully composable components that can be arranged and laid out in any order, allowing for a more flexible and visually appealing design.

#### What's New

[Components V2](/docs/components/overview) introduces several new component types that can be used in messages:

#### New Layout Components

- [**Section**](/docs/components/reference#section) - Combine text with an accessory component for contextually linked elements
- [**Container**](/docs/components/reference#container) - Create visually distinct groupings with a customizable accent color
- [**Separator**](/docs/components/reference#separator) - Add visual spacing and dividers between components

#### New Content Components

- [**Text Display**](/docs/components/reference#text-display) - Add rich markdown-formatted text anywhere in your messages
- [**Thumbnail**](/docs/components/reference#thumbnail) - An image used in a [section](/docs/components/reference#section)
- [**Media Gallery**](/docs/components/reference#media-gallery) - Present collections of images and videos in an organized grid
- [**File**](/docs/components/reference#file) - Embed file attachments as part of your message layout

#### Getting Started

To use the new components, you'll need to send the message flag `1 << 15` (`IS_COMPONENTS_V2`) which activates the components system on a per-message basis. 

We've created guides to help you implement these new features:

- [Using Message Components](/docs/components/using-message-components) - Learn how to build rich message layouts with components
- [Using Modal Components](/docs/components/using-modal-components) - Create interactive forms and dialogs

#### Compatibility Notes

[Legacy component behavior](/docs/components/reference#legacy-message-component-behavior) will continue to work as before, so your existing integrations won't break. However, when using the Components V2 flag, you'll need to adapt to a few changes:

- The `content` and `embeds` fields will no longer work but you'll be able to use [Text Display](/docs/components/reference#text-display) and [Container](/docs/components/reference#container) as replacements
- Attachments need to be exposed through components to be visible. You can use a [Media Gallery](/docs/components/reference#media-gallery), [Thumbnail](/docs/components/reference#thumbnail), or [File](/docs/components/reference#file) component to display them
- The `poll` and `stickers` fields are disabled
- A max of 10 top-level components and 30 total components in a message

#### Developer Resources

Check out our [Component Reference](/docs/components/reference) for detailed specifications on all available components.

We can't wait to see what you build!