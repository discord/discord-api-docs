# Voice Resource

## List Voice Regions % GET /voice/regions

Return an array of [voice region](#DOCS_VOICE/voice-region-object) objects that can be used when creating servers.

###### Voice Region Object

| Field | Type | Description |
|-------|------|-------------|
| id | string | unique ID for the region |
| name | string | name of the region |
| sample_hostname | string | an example hostname for the region |
| sample_port | integer | an example port for the region |
| vip | bool | true if this is a vip-only server |
| optimal | bool | true for a single server that is closest to the current users client |