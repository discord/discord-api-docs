---
title: "Per-Attachment File Upload Limit for Apps"
date: "2025-04-03"
breaking: false
topics:
- "HTTP API"
- "Interactions"
---

Starting today, file upload limits for apps are checked per-attachment rather than per-message. This change makes the attachment behavior for apps the same as when a user uploads multiple attachments on a single message.

- File size limits now apply to each individual attachment
- Previously, limits were applied to the combined size of all attachments in a message
- This aligns app attachment handling with user attachment behavior

Additionally, the interaction payload will include a new `attachment_size_limit` key that specifies the maximum allowed attachment size, which may exceed the default attachment size limit in boosted guilds.

For more information, check out [our documentation on file uploads](#DOCS_REFERENCE/uploading-files).