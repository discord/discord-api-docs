---
title: "New Invite Endpoints"
date: "2026-01-13"
---

We've added new endpoints and functionality allowing invites to grant roles and to only be accepted by specified users. These are perfect for communities that want to manage access more granularly or reward members with special roles when they join a server.

[Create Channel Invite](/docs/resources/channel#create-channel-invite) has been updated to support `target_users_file` and `role_ids` parameters.

- `target_users_file`: A CSV file with user IDs to specify who can accept the invite
- `role_ids`: Role IDs for roles to assign to users when they accept the invite

Invite endpoints:
- [Get Target Users](/docs/resources/invite#get-target-users): Gets the users allowed to see and accept an invite
- [Update Target Users](/docs/resources/invite#update-target-users): Updates the users allowed to see and accept an invite
- [Get Target Users Job Status](/docs/resources/invite#get-target-users-job-status): Checks the status of the job that processes the target users for an invite from file upload
