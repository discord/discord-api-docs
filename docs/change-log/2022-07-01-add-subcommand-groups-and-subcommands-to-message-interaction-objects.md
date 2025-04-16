---
title: "Add Subcommand Groups and Subcommands to Message Interaction Objects"
date: "2022-07-01"
breaking: true
---

While this is a breaking change, most apps only rely on interaction responses (`INTERACTION_CREATE`), *not* message interaction objects (`MESSAGE_CREATE`). [Interaction responses](/docs/interactions/receiving-and-responding#interaction-object-interaction-data) are unaffected by this change.

#### Upcoming Changes

Starting **July 18, 2022**, the `name` field for [message interaction objects](/docs/interactions/receiving-and-responding#message-interaction-object) will now include subcommands and subcommand groups in the value (along with the existing top-level command). In the future, we recommend not relying on this message interaction field.

The format of the value will be the different command levels (if they exist), separated by spaces:
`<command name> <subcommand group name> <subcommand name>`

The `name` field is only seen on messages that are a response to an interaction without an existing message, so interaction objects for message components don’t include this field.

#### Updating your app

Most apps only rely on interaction responses, not message interaction objects.

We don't recommend that your app relies on the `name` field for message interactions objects, but if it does you should update your app to handle subcommands and subcommand groups that your app may encounter.

As an example of the change, pretend your app had a command `/role` with subcommands `add` and `remove`. Currently, the `name` field in the original interaction payload would contain `role`. If you responded to that interaction with a message then fetched its contents, the `name` field for that message interaction object would contain `role` as well.

After this change, the `name` field for the original interaction payload will still contain `role`. However, now if you responded to that interaction with a message then fetched its contents, the `name` field for that message interaction object would contain `role add` or `role remove`.
