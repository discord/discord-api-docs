---
title: "Interaction Callback Response"
date: "2024-08-19"
topics:
- "HTTP API"
- "Interactions"
---

The [Create Interaction Response](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/create-interaction-response) is now capable of returning a [interaction callback response](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/interaction-callback-response-object), instead of `204 No Content`.

* [Create Interaction Response](#DOCS_INTERACTIONS_RECEIVING_AND_RESPONDING/create-interaction-response) can now return the callback response.
* To opt-in into this behavior, add the query parameter `with_response=true` to the route.
* This behavior will be default in API v11.
