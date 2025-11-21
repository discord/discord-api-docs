---
title: "Remove .proxy/ from Discord Activity proxy path"
date: "2025-07-30"
topics:
- "Activities"
- "Embedded App SDK"
---

We've updated the Content Security Policy (CSP) for Discord Activities to remove the `.proxy/` path requirement when making requests through the discordsays.com proxy. This change simplifies the developer experience while maintaining full backwards compatibility. This was made possible by resolving the underlying privacy considerations that originally required the `.proxy/` path restriction.

#### Before

Activities were required to make proxy requests through paths prefixed with `/.proxy/`:

```
https://&lt;app_id&gt;.discordsays.com/.proxy/api/endpoint
```

#### After

Activities can now make proxy requests directly without the `/.proxy/` prefix:

```
https://&lt;app_id&gt;.discordsays.com/api/endpoint
```

#### Technical Details

- **CSP Update**: The Content Security Policy now allows requests to `https://<app_id>.discordsays.com/*` instead of the more restrictive `https://<app_id>.discordsays.com/.proxy/*`
- **Proxy Behavior**: Both URL patterns work identically - your existing proxy mappings (e.g., `/api -> example.com`) will function the same way regardless of whether you use `/.proxy/api` or `/api`
- **Performance**: No performance differences between the two approaches

#### Developer Tooling Updates

The `patchUrlMappings` utility will be updated in an upcoming Embedded App SDK release to generate the simplified URLs by default, though it will continue to support the `.proxy/` format for backward compatibility.

#### Backward Compatibility

**All existing code will continue to work without changes.** The `/.proxy/` path prefix is still fully supported and will be maintained indefinitely. You can:

- Continue using existing `/.proxy/` URLs
- Switch to the new, simplified URLs
- Use both patterns simultaneously in the same application

**No migration is required.** This is a purely additive change that expands what's possible rather than breaking existing functionality.
