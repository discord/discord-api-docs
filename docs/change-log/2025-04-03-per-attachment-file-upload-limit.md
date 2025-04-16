---
title: "Per-Attachment File Upload Behavior for Apps"
date: "2025-04-03"
breaking: false
topics:
- "HTTP API"
- "Interactions"
---

Starting today, file upload limits for apps are checked per-attachment rather than per-message. This change makes the app attachment behavior the same as when a user uploads multiple attachments on a single message.

- File size limits now apply to each individual attachment
- Previously, limits were applied to the combined size of all attachments in a message
- This aligns app attachment handling with user attachment behavior

The interaction payload will also include a new `attachment_size_limit` key that specifies the maximum allowed attachment size. This limit may be higher than the default attachment size limit, depending on the guild's boost status or the invoking user's Nitro status.

For more information, check out [our documentation on file uploads](/docs/reference#uploading-files).