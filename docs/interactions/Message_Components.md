# Message Components

Message components—we'll call them "components" moving forward—are a framework for adding interactive elements to the messages your app or bot sends. They're accessible, customizable, and easy to use.

There are several different types of components; this documentation will outline the basics of this new framework and each example.

## What is a Component

Components are a new field on the [message object](#DOCS_RESOURCES_CHANNEL/message-object), so you can use them whether you're sending messages or responding to a [slash command](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/) or other interaction.

The top-level `components` field is an array of [Action Row](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/action-rows) components.

### Component Object

###### Component Types

| Type | Name        | Description                            |
| ---- | ----------- | -------------------------------------- |
| 1    | Action Row  | A container for other components       |
| 2    | Button      | A button object                        |
| 3    | Select Menu | A select menu for picking from choices |
| 4    | Text Input  | A text input object                    |

The structure of each component type is described in detail below.

###### Example Component

```json
{
    "content": "This is a message with components",
    "components": [
        {
            "type": 1,
            "components": []
        }
    ]
}
```

## Action Rows

An Action Row is a non-interactive container component for other types of components. It has a `type: 1` and a sub-array of `components` of other types.

- You can have up to 5 Action Rows per message
- An Action Row cannot contain another Action Row

```json
{
    "content": "This is a message with components",
    "components": [
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Click me!",
                    "style": 1,
                    "custom_id": "click_one"
                }
            ]

        }
    ]
}
```

## Responding to a Component Interaction

Responding to a user interacting with a component is the same as other interaction types, like application commands. You can simply ACK the request, send a followup message, or edit the original message to something new. Check out [Responding to An Interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/responding-to-an-interaction) and [interaction response](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-response-object) for more.

## Custom ID

Components, aside from Action Rows, must have a `custom_id` field. This field is defined by the developer when sending the component payload, and is returned in the interaction payload sent when a user interacts with the component. For example, if you set `custom_id: click_me` on a button, you'll receive an interaction containing `custom_id: click_me` when a user clicks that button.

`custom_id` must be unique per component; multiple buttons on the same message must not share the same `custom_id`. This field is a string of max 100 characters, and can be used flexibly to maintain state or pass through other important data.

## Buttons

Buttons are interactive components that render on messages. They can be clicked by users, and send an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object) to your app when clicked.

- Buttons must be sent inside an Action Row
- An Action Row can contain up to 5 buttons
- An Action Row containing buttons cannot also contain a select menu

### Button Object

###### Button Structure

| Field      | Type                                                | Description                                                                               |
| ---------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| type       | integer                                             | `2` for a button                                                                          |
| style      | integer                                             | one of [button styles](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/button-object-button-styles) |
| label?     | string                                              | text that appears on the button, max 80 characters                                        |
| emoji?     | partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) | `name`, `id`, and `animated`                                                              |
| custom_id? | string                                              | a developer-defined identifier for the button, max 100 characters                         |
| url?       | string                                              | a url for link-style buttons                                                              |
| disabled?  | boolean                                             | whether the button is disabled (default `false`)                                          |

Buttons come in a variety of styles to convey different types of actions. These styles also define what fields are valid for a button.

- Non-link buttons **must** have a `custom_id`, and cannot have a `url`
- Link buttons **must** have a `url`, and cannot have a `custom_id`
- Link buttons do not send an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object) to your app when clicked

###### Button Styles

| Name      | Value | Color                    | Required Field |
| --------- | ----- | ------------------------ | -------------- |
| Primary   | 1     | blurple                  | `custom_id`    |
| Secondary | 2     | grey                     | `custom_id`    |
| Success   | 3     | green                    | `custom_id`    |
| Danger    | 4     | red                      | `custom_id`    |
| Link      | 5     | grey, navigates to a URL | `url`          |

![An image showing the different button styles](button-styles.png)

When a user clicks on a button, your app will receive an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object) including the message the button was on:

### Component Interaction Object

###### Sample Component Interaction

```json
{
    "version": 1,
    "type": 3,
    "token": "unique_interaction_token",
    "message": {
        "type": 0,
        "tts": false,
        "timestamp": "2021-05-19T02:12:51.710000+00:00",
        "pinned": false,
        "mentions": [],
        "mention_roles": [],
        "mention_everyone": false,
        "id": "844397162624450620",
        "flags": 0,
        "embeds": [],
        "edited_timestamp": null,
        "content": "This is a message with components.",
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Click me!",
                        "style": 1,
                        "custom_id": "click_one"
                    }
                ]
            }
        ],
        "channel_id": "345626669114982402",
        "author": {
            "username": "Mason",
            "public_flags": 131141,
            "id": "53908232506183680",
            "discriminator": "1337",
            "avatar": "a_d5efa99b3eeaa7dd43acca82f5692432"
        },
        "attachments": []
    },
    "member": {
        "user": {
            "username": "Mason",
            "public_flags": 131141,
            "id": "53908232506183680",
            "discriminator": "1337",
            "avatar": "a_d5efa99b3eeaa7dd43acca82f5692432"
        },
        "roles": [
            "290926798626357999"
        ],
        "premium_since": null,
        "permissions": "17179869183",
        "pending": false,
        "nick": null,
        "mute": false,
        "joined_at": "2017-03-13T19:19:14.040000+00:00",
        "is_pending": false,
        "deaf": false,
        "avatar": null
    },
    "id": "846462639134605312",
    "guild_id": "290926798626357999",
    "data": {
        "custom_id": "click_one",
        "component_type": 2
    },
    "channel_id": "345626669114982999",
    "application_id": "290926444748734465"
}
```

## Select Menus

Select menus are another interactive component that renders on messages. On desktop, clicking on a select menu opens a dropdown-style UI; on mobile, tapping a select menu opens up a half-sheet with the options.

![A select menu open on desktop](desktop-select.png)

Select menus support single-select and multi-select behavior, meaning you can prompt a user to choose just one item from a list, or multiple. When a user finishes making their choice by clicking out of the dropdown or closing the half-sheet, your app will receive an [interaction](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-object-interaction-structure).

- Select menus must be sent inside an Action Row
- An Action Row can contain only one select menu
- An Action Row containing a select menu cannot also contain buttons

###### Select Menu Example

```json
// This is a message
{
    "content": "Mason is looking for new arena partners. What classes do you play?",
    "components": [
        {
            "type": 1,
            "components": [
                {
                    "type": 3,
                    "custom_id": "class_select_1",
                    "options":[
                        {
                            "label": "Rogue",
                            "value": "rogue",
                            "description": "Sneak n stab",
                            "emoji": {
                                "name": "rogue",
                                "id": "625891304148303894"
                            }
                        },
                        {
                            "label": "Mage",
                            "value": "mage",
                            "description": "Turn 'em into a sheep",
                            "emoji": {
                                "name": "mage",
                                "id": "625891304081063986"
                            }
                        },
                        {
                            "label": "Priest",
                            "value": "priest",
                            "description": "You get heals when I'm done doing damage",
                            "emoji": {
                                "name": "priest",
                                "id": "625891303795982337"
                            }
                        }
                    ],
                    "placeholder": "Choose a class",
                    "min_values": 1,
                    "max_values": 3
                }
            ]
        }
    ]
}
```

### Select Menu Object

###### Select Menu Structure

| Field        | Type                                                                                                        | Description                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| type         | integer                                                                                                     | `3` for a select menu                                                     |
| custom_id    | string                                                                                                      | a developer-defined identifier for the select menu, max 100 characters    |
| options      | array of [select options](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/select-menu-object-select-option-structure) | the choices in the select, max 25                                         |
| placeholder? | string                                                                                                      | custom placeholder text if nothing is selected, max 150 characters        |
| min_values?  | integer                                                                                                     | the minimum number of items that must be chosen; default 1, min 0, max 25 |
| max_values?  | integer                                                                                                     | the maximum number of items that can be chosen; default 1, max 25         |
| disabled?    | boolean                                                                                                     | disable the select, default false                                         |

###### Select Option Structure

| Field        | Type                                                       | Description                                                 |
| ------------ | ---------------------------------------------------------- | ----------------------------------------------------------- |
| label        | string                                                     | the user-facing name of the option, max 100 characters      |
| value        | string                                                     | the dev-define value of the option, max 100 characters      |
| description? | string                                                     | an additional description of the option, max 100 characters |
| emoji?       | partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object | `id`, `name`, and `animated`                                |
| default?     | boolean                                                    | will render this option as selected by default              |

###### Select Menu Interaction

```json
{
    "application_id": "845027738276462632",
    "channel_id": "772908445358620702",
    "data": {
        "component_type":3,
        "custom_id": "class_select_1",
        "values": [
            "mage",
            "rogue"
        ]
    },
    "guild_id": "772904309264089089",
    "id": "847587388497854464",
    "member": {
        "avatar": null,
        "deaf": false,
        "is_pending": false,
        "joined_at": "2020-11-02T19:25:47.248000+00:00",
        "mute": false,
        "nick": "Bot Man",
        "pending": false,
        "permissions": "17179869183",
        "premium_since": null,
        "roles": [
            "785609923542777878"
        ],
        "user":{
            "avatar": "a_d5efa99b3eeaa7dd43acca82f5692432",
            "discriminator": "1337",
            "id": "53908232506183680",
            "public_flags": 131141,
            "username": "Mason"
        }
    },
    "message":{
        "application_id": "845027738276462632",
        "attachments": [],
        "author": {
            "avatar": null,
            "bot": true,
            "discriminator": "5284",
            "id": "845027738276462632",
            "public_flags": 0,
            "username": "Interactions Test"
        },
        "channel_id": "772908445358620702",
        "components": [
            {
                "components": [
                    {
                        "custom_id": "class_select_1",
                        "max_values": 1,
                        "min_values": 1,
                        "options": [
                            {
                                "description": "Sneak n stab",
                                "emoji":{
                                    "id": "625891304148303894",
                                    "name": "rogue"
                                },
                                "label": "Rogue",
                                "value": "rogue"
                            },
                            {
                                "description": "Turn 'em into a sheep",
                                "emoji":{
                                    "id": "625891304081063986",
                                    "name": "mage"
                                },
                                "label": "Mage",
                                "value": "mage"
                            },
                            {
                                "description": "You get heals when I'm done doing damage",
                                "emoji":{
                                    "id": "625891303795982337",
                                    "name": "priest"
                                },
                                "label": "Priest",
                                "value": "priest"
                            }
                        ],
                        "placeholder": "Choose a class",
                        "type": 3
                    }
                ],
                "type": 1
            }
        ],
        "content": "Mason is looking for new arena partners. What classes do you play?",
        "edited_timestamp": null,
        "embeds": [],
        "flags": 0,
        "id": "847587334500646933",
        "interaction": {
            "id": "847587333942935632",
            "name": "dropdown",
            "type": 2,
            "user": {
                "avatar": "a_d5efa99b3eeaa7dd43acca82f5692432",
                "discriminator": "1337",
                "id": "53908232506183680",
                "public_flags": 131141,
                "username": "Mason"
            }
        },
        "mention_everyone": false,
        "mention_roles":[],
        "mentions":[],
        "pinned": false,
        "timestamp": "2021-05-27T21:29:27.956000+00:00",
        "tts": false,
        "type": 20,
        "webhook_id": "845027738276462632"
    },
    "token": "UNIQUE_TOKEN",
    "type": 3,
    "version": 1
}
```

## Text Inputs

Text inputs are an interactive component that render on modals. They can be used to collect short-form or long-form text.

###### Text Input Example

```json
// this is a modal
{
  "title": "My Cool Modal",
  "custom_id": "cool_modal",
  "components": [{
    "type": 1,
    "components": [{
      "type": 4,
      "custom_id": "name",
      "label": "Name",
      "style": 1,
      "min_length": 1,
      "max_length": 4000,
      "placeholder": "John",
      "required": true
    }]
  }]
}
```

###### Text Input Structure

| Field        | Type    | Description                                                                                 |
| ------------ | ------- | ------------------------------------------------------------------------------------------- |
| type         | integer | `4` for a text input                                                                        |
| custom_id    | string  | a developer-defined identifier for the input, max 100 characters                            |
| style        | integer | the [Text Input Style](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/text-inputs-text-input-styles) |
| label        | string  | the label for this component                                                                |
| min_length?  | integer | the minimum input length for a text input, min 0, max 4000                                  |
| max_length?  | integer | the maximum input length for a text input, min 1, max 4000                                  |
| required?    | boolean | whether this component is required to be filled, default true                               |
| value?       | string  | a pre-filled value for this component, max 4000 characters                                  |
| placeholder? | string  | custom placeholder text if the input is empty, max 100 characters                           |

###### Text Input Styles

| Name      | Value | Description         |
| --------- | ----- | ------------------- |
| Short     | 1     | A single-line input |
| Paragraph | 2     | A multi-line input  |
