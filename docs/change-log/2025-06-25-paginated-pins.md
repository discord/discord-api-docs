---
title: "Paginated Pin Endpoints"
date: "2025-06-25"
topics:
- "HTTP API"
---

We've added new endpoints to manage paginated pins in channels. The Get Channel Pins endpoint allows you to retrieve and manage pinned messages in a more efficient way, especially for channels with a large number of pinned messages. Both Pin and Unpin endpoints remain the same with a new route. As part of this change we have deprecated the old endpoints for pinned messages. Switching to the new endpoints should be straightforward, as they maintain similar functionality but with improved pagination support. 

#### New Endpoints

**[Get Channel Pins](/docs/resources/message#get-channel-pins)**: Retrieve a list of pinned messages in a channel with pagination support:  
<Route method="GET">/channels/[\{channel.id\}](/docs/resources/channel#channel-object)/messages/pins</Route>

**[Pin Message](/docs/resources/message#pin-message)**: Pin a message in a channel:  
<Route method="PUT">/channels/[\{channel.id\}](/docs/resources/channel#channel-object)/messages/pins/[\{message.id\}](/docs/resources/message#message-object)</Route>

**[Unpin Message](/docs/resources/message#unpin-message)**: Unpin a message in a channel:  
<Route method="DELETE">/channels/[\{channel.id\}](/docs/resources/channel#channel-object)/messages/pins/[\{message.id\}](/docs/resources/message#message-object)</Route>

#### Deprecated Endpoints

**[Get Pinned Messages](/docs/resources/message#get-pinned-messages-deprecated)**:  
<Route method="GET">/channels/[\{channel.id\}](/docs/resources/channel#channel-object)/pins</Route>

**[Pin Message](/docs/resources/message#pin-message-deprecated)**:  
<Route method="PUT">/channels/[\{channel.id\}](/docs/resources/channel#channel-object)/pins/[\{message.id\}](/docs/resources/message#message-object)</Route>

**[Unpin Message](/docs/resources/message#unpin-message-deprecated)**:  
<Route method="DELETE">/channels/[\{channel.id\}](/docs/resources/channel#channel-object)/pins/[\{message.id\}](/docs/resources/message#message-object)</Route>
