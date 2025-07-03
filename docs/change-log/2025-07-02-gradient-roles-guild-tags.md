---
title: "Gradient Roles and Guild Tags"
date: "2025-07-02"
topics:
- "HTTP API"
---

We've documented gradient role colors and guild tags in the API. Guild tags let users rep their favorite server with a 1-4 character badge next to their display name. They can be accessed using the `primary_guild` field on the user object. Servers can now give gradient colors to their roles instead of a single, solid color. Gradient colors use the new `colors` field on the role object. As part of this change, the `color` field on roles is now deprecated, but it will still work for backwards compatibility.

#### Gradient Role Colors

- The guild feature `ENHANCED_ROLE_COLORS` will let you know if a guild is able to set gradient colors to roles. 
- Guild roles now have `colors` as part of the [structure](/docs/topics/permissions#role-object-role-structure).
- `color` on guild roles is deprecated but will still be returned by the API and continues to work for backwards compatibility.
- [Role color structure](/docs/topics/permissions#role-object-role-colors-object)

#### Guild Tags

- Guild tags can be retrieved through the `primary_guild` field on the user object.
- [User Primary Guild](/docs/resources/user#user-object-user-primary-guild)
