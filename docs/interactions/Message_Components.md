# Message Components

Message components--we'll call them "components" moving forward--are a framework for adding interactive elements to the messages your app or bot sends. They're accessible, customizable, and easy to use.

There are several different types of components; this documentation will outline the basics of this new framework and each example.

## What are Components

Components are a new field on the [message object](#DOCS_RESOURCES_CHANNEL/message-object), so you can use them whether you're sending messages or responding to a [slash command](#DOCS_INTERACTIONS_SLASH_COMMANDS/) or other interaction.

The top-level `components` field is an array of `ActionRow` components.

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

## Component Object

| Field       | Type                                                                                  | Description                                                                         | Valid For                                                      |
| ----------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| type        | int                                                                                   | [component type](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-types)             | all types                                                      |
| style?      | int                                                                                   | one of [button styles](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons-button-styles) | [Buttons](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons)       |
| label?      | string                                                                                | text that appears on the button, max 80 characters                                  | [Buttons](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons)       |
| emoji?      | partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object)                                   | `name`, `id`, and `animated`                                                        | [Buttons](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons)       |
| custom_id?  | string                                                                                | a developer-defined identifier for the button, max 100 characters                   | [Buttons](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons)       |
| url?        | string                                                                                | a url for link-style buttons                                                        | [Buttons](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons)       |
| disabled?   | bool                                                                                  | whether the button is disabled, default `false`                                     | [Buttons](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons)       |
| components? | Array of [message components](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/component-object) | a list of child components                                                          | [Action Rows](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/actionrow) |

## Component Types

| Type | Name      | Description                      |
| ---- | --------- | -------------------------------- |
| 1    | ActionRow | A container for other components |
| 2    | Button    | A clickable button               |

## ActionRow

An `ActionRow` is a non-interactive container component for other types of components. It has a `type: 1` and a sub-array of `components` of other types.

- You can have up to 5 `ActionRows` per message
- An `ActionRow` cannot contain another `ActionRow`


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

Responding to a user interacting with a component is the same as other interaction types, like slash commands. You can simply ACK the request, send a followup message, or edit the original message to something new. Check out [Responding to An Interaction](#DOCS_INTERACTIONS_SLASH_COMMANDS/responding-to-an-interaction) and [interaction response](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-response-object-interaction-response-structure) for more.

> danger
> Your application should take care to validate data sent in message component interactions. For example, ensuring that the `custom_id` originates from the received message. In the future this information will be validated by the API.

## Custom Id

Message components, aside from `ActionRows`, have a mandatory `custom_id` field. This field is defined by the developer when sending the component payload, and is returned in the interaction payload sent when a user interacts with the component. For example, if you set `custom_id: click_me` on a button, you'll receive an interaction containing `custom_id: click_me` when a user clicks that button.

`custom_id` is unique per component; one button can have a different `custom_id` than another button on the same message. This field is a string of max 100 characters, and can be used flexibly to maintain state or pass through other important data.

## Buttons

Buttons are interactive components that render on messages. They can be clicked by users, and send an [interaction](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-interaction-structure) to your app when clicked.

- Buttons must be sent inside an `ActionRow`
- An `ActionRow` can contain up to 5 buttons

###### Button Object

| Field      | Type                                                | Description                                                                         |
| ---------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| type       | int                                                 | `2` for a button                                                                    |
| style      | int                                                 | one of [button styles](#DOCS_INTERACTIONS_MESSAGE_COMPONENTS/buttons-button-styles) |
| label?     | string                                              | text that appears on the button, max 80 characters                                   |
| emoji?     | partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) | `name`, `id`, and `animated`                                                        |
| custom_id? | string                                              | a developer-defined identifier for the button, max 100 characters                   |
| url?       | string                                              | a url for link-style buttons                                                        |
| disabled?  | bool                                                | whether the button is disabled, default `false`                                     |

Buttons come in a variety of styles to convey different types of actions. These styles also define what fields are valid for a button.

- Non-link buttons **must** have a `custom_id`, and cannot have a `url`
- Link buttons **must** have a `url`, and cannot have a `custom_id`
- Link buttons do not send an [interaction](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-object-interaction-structure) to your app when clicked

###### Button Styles

| Name      | Value | Color                    | Required Field |
| --------- | ----- | ------------------------ | -------------- |
| Primary   | 1     | blurple                  | `custom_id`    |
| Secondary | 2     | grey                     | `custom_id`    |
| Success   | 3     | green                    | `custom_id`    |
| Danger    | 4     | red                      | `custom_id`    |
| Link      | 5     | grey, navigates to a URL | `url`          |

![An image showing the different button styles](button-styles.png)

When a user clicks on a button, your app will receive an [interaction](#DOCS_INTERACTIONS_SLASH_COMMANDS/interactions) including the message the button was on:

###### Button Interaction

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
