# Changelog

## API Version 6

* **Reference**
  * [API versions](#DOCS_REFERENCE/api-versions) below v6 are now deprecated and will be discontinued on **October 16, 2017**
  * API v6 will become default on **October 16, 2017**
* **Channels**
  * Updated [guild channel](#DOCS_CHANNEL/guild-channel-structure) object
    * Removed `is_private` boolean
    * Added `type`
  * Updated [DM channel](#DOCS_CHANNEL/dm-channel-structure) object
    * Removed `is_private` boolean
    * Added `type`, `last_message_id`, `name`, `icon`, and `owner_id`
    * Updated `recipient` to `recipients`, an array of [user](#DOCS_USER/user-object) objects
  * Updated [message](#DOCS_CHANNEL/message-object) object
    * Added `type`
* **Invites**
  * Updated [invite channel](#DOCS_INVITE/invite-channel-structure) object
    * Added `type`
* **Gateway**
  *  [Gateway versions below v6](#DOCS_GATEWAY/gateway-protocol-versions) are now deprecated and will be discontinued on **October 16, 2017**.
  * Updated [status update](#DOCS_GATEWAY/gateway-status-update-structure) object
    * Renamed `idle_since` to `since`
    * Added `status` and `afk`
