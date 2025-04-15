---
title: "Deprecating Guild Creation by Apps"
date: "2025-04-15"
topics:
  - "HTTP API"
---

### Breaking Change

To address security concerns, we are deprecating the ability for applications to create guilds using the `Create Guild`
endpoint.

#### What's Changing

- The Create Guild endpoint (`POST /guilds`) will be restricted for applications starting July 15, 2025
- Existing Guilds owned by bots will have their ownership transferred to a real user
- After the deprecation date, the endpoint will no longer be available

#### Timeline

- **April 15, 2025**: Deprecation announcement
- **June 15, 2025**: System DM/Email notifications sent to affected app owners and designated guild members
- **July 15, 2025**: `Create Guild` endpoint will no longer be available

If your app is affected, you will receive a migration plan via Discord System DM.

We understand this change may affect some legitimate use cases. If you have questions or believe your application
requires continued access to guild creation functionality, please contact us through
the [Developer Support portal](https://support-dev.discord.com/hc).