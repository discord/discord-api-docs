---
title: "Message Forwarding rollout"
date: "2024-07-15"
---

We are slowly rolling out the message forwarding feature to users. This feature allows callers to create a message using `message_reference.type = FORWARD` and have the API generate a `message_snapshot` for the sent message. The feature has [some limitations](/docs/resources/message#message-reference-types) and the snapshot is a minimal version of a standard `MessageObject`, but does capture the core parts of a message.

The resulting message will look something like:

```json
{
  "id": "1255957733279273083",
  "message_reference": {
    "type": 1, // Forward
    ...
  }
  "message_snapshots": [
    {
      "message": {
        "content": "original message",
        "embeds": [...],
        "attachments": [...],
        ...
      }
    }
  ],
  ...
}
```

We have applied stricter rate limits for this feature based on the following:

* number of forwards sent by the user
* total attachment size

###### API Updates since preview

This was [previously announced](https://discord.com/channels/613425648685547541/697138785317814292/1233463756160503859) but note that the final API has a few changes since the API was first previewed:

* [`message snapshot`](/docs/resources/message#message-snapshot-object) objects don't include a `guild` field anymore since the `message_reference` already provides that information
* forwarded messages have a distinctive `message_reference` type of `FORWARD` now
