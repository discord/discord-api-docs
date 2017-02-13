# Index

## Objects

- [Attachment](#DOCS_CHANNEL/attachment-object)
- [Connection](#DOCS_USER/connection-object)
- [DM Channel](#DOCS_CHANNEL/dm-channel-object)
- [Embed](#DOCS_CHANNEL/embed-object)
- [Emoji](#DOCS_GUILD/emoji-object)
- [Game](#DOCS_GATEWAY/game-object)
- [Guild](#DOCS_GUILD/guild-object)
- [Guild Channel](#DOCS_CHANNEL/guild-channel-object)
- [Guild Embed](#DOCS_GUILD/guild-embed-object)
- [Guild Member](#DOCS_GUILD/guild-member-object)
- [Integration](#DOCS_GUILD/integration-object)
- [Integration Account](#DOCS_GUILD/integration-account-object)
- [Invite](#DOCS_INVITE/invite-object)
- [Invite Channel](#DOCS_INVITE/invite-channel-object)
- [Invite Guild](#DOCS_INVITE/invite-guild-object)
- [Invite Metadata](#DOCS_INVITE/invite-metadata-object)
- [Message](#DOCS_CHANNEL/message-object)
- [Overwrite](#DOCS_CHANNEL/overwrite-object)
- [Reaction](#DOCS_CHANNEL/reaction-object)
- [Role](#DOCS_PERMISSIONS/role-object)
- [Unavailable Guild](#DOCS_GUILD/unavailable-guild-object)
- [User](#DOCS_USER/user-object)
- [User Guild](#DOCS_USER/user-guild-object)
- [Voice State](#DOCS_VOICE/voice-state-object)
- [Webhook](#DOCS_WEBHOOK/webhook-object)

## HTTP Endpoints

| Name                                | Method    | Route                                                                   
| ------------------------------------|-----------|--------------------------------------------------------------------------|
| Accept Invite                       | POST      | /invites/{invite.code}                                                   |
| Add Guild Member                    | PUT       | /guilds/{guild.id}/members/{user.id}                                     |
| Add Guild Member Role               | PUT       | /guilds/{guild.id}/members/{user.id}/roles/{role.id}                     |
| Add Pinned Channel Message          | PUT       | /channels/{channel.id}/pins/{message.id}                                 |
| Begin Guild Prune                   | POST      | /guilds/{guild.id}/prune                                                 |
| Bulk Delete Messages                | POST      | /channels/{channel.id}/messages/bulk-delete                              |
| Bulk Delete Messages (deprecated)   | POST      | /channels/{channel.id}/messages/bulk_delete                              |
| Create Channel Invite               | POST      | /channels/{channel.id}/invites                                           |
| Create DM                           | POST      | /users/@me/channels                                                      |
| Create Group DM                     | POST      | /users/@me/channels                                                      |
| Create Guild                        | POST      | /guilds                                                                  |
| Create Guild Ban                    | PUT       | /guilds/{guild.id}/bans/{user.id}                                        |
| Create Guild Channel                | POST      | /guilds/{guild.id}/channels                                              |
| Create Guild Integration            | POST      | /guilds/{guild.id}/integrations                                          |
| Create Guild Role                   | POST      | /guilds/{guild.id}/roles                                                 |
| Create Message                      | POST      | /channels/{channel.id}/messages                                          |
| Create Reaction                     | PUT       | /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me       |
| Create Webhook                      | POST      | /channels/{channel.id}/webhooks                                          |
| Delete All Reactions                | DELETE    | /channels/{channel.id}/messages/{message.id}/reactions                   |
| Delete Channel Permission           | DELETE    | /channels/{channel.id}/permissions/{overwrite.id}                        |
| Delete Guild                        | DELETE    | /guilds/{guild.id}                                                       |
| Delete Guild Integration            | DELETE    | /guilds/{guild.id}/integrations/{integration.id}                         |
| Delete Guild Role                   | DELETE    | /guilds/{guild.id}/roles/{role.id}                                       |
| Delete Invite                       | DELETE    | /invites/{invite.code}                                                   |
| Delete Message                      | DELETE    | /channels/{channel.id}/messages/{message.id}                             |
| Delete Own Reaction                 | DELETE    | /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me       |
| Delete Pinned Channel Message       | DELETE    | /channels/{channel.id}/pins/{message.id}                                 |
| Delete User Reaction                | DELETE    | /channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id} |
| Delete Webhook                      | DELETE    | /webhooks/{webhook.id}                                                   |
| Delete Webhook with Token           | DELETE    | /webhooks/{webhook.id}/{webhook.token}                                   |
| Delete/Close Channel                | DELETE    | /channels/{channel.id}                                                   |
| Edit Channel Permissions            | PUT       | /channels/{channel.id}/permissions/{overwrite.id}                        |
| Edit Message                        | PATCH     | /channels/{channel.id}/messages/{message.id}                             |
| Execute GitHub-Compatible Webhook   | POST      | /webhooks/{webhook.id}/{webhook.token}/github                            |
| Execute Slack-Compatible Webhook    | POST      | /webhooks/{webhook.id}/{webhook.token}/slack                             |
| Execute Webhook                     | POST      | /webhooks/{webhook.id}/{webhook.token}                                   |
| Get Channel                         | GET       | /channels/{channel.id}                                                   |
| Get Channel Invites                 | GET       | /channels/{channel.id}/invites                                           |
| Get Channel Message                 | GET       | /channels/{channel.id}/messages/{message.id}                             |
| Get Channel Messages                | GET       | /channels/{channel.id}/messages                                          |
| Get Channel Webhooks                | GET       | /channels/{channel.id}/webhooks                                          |
| Get Current Application Information | GET       | /oauth2/applications/@me                                                 |
| Get Current User                    | GET       | /users/@me                                                               |
| Get Current User Guilds             | GET       | /users/@me/guilds                                                        |
| Get Gateway                         | GET       | /gateway                                                                 |
| Get Gateway Bot                     | GET       | /gateway/bot                                                             |
| Get Guild                           | GET       | /guilds/{guild.id}                                                       |
| Get Guild Bans                      | GET       | /guilds/{guild.id}/bans                                                  |
| Get Guild Channels                  | GET       | /guilds/{guild.id}/channels                                              |
| Get Guild Embed                     | GET       | /guilds/{guild.id}/embed                                                 |
| Get Guild Integrations              | GET       | /guilds/{guild.id}/integrations                                          |
| Get Guild Invites                   | GET       | /guilds/{guild.id}/invites                                               |
| Get Guild Member                    | GET       | /guilds/{guild.id}/members/{user.id}                                     |
| Get Guild Prune Count               | GET       | /guilds/{guild.id}/prune                                                 |
| Get Guild Roles                     | GET       | /guilds/{guild.id}/roles                                                 |
| Get Guild Voice Regions             | GET       | /guilds/{guild.id}/regions                                               |
| Get Guild Webhooks                  | GET       | /guilds/{guild.id}/webhooks                                              |
| Get Invite                          | GET       | /invites/{invite.code}                                                   |
| Get Pinned Messages                 | GET       | /channels/{channel.id}/pins                                              |
| Get Reactions                       | GET       | /channels/{channel.id}/messages/{message.id}/reactions/{emoji}           |
| Get User                            | GET       | /users/{user.id}                                                         |
| Get User DMs                        | GET       | /users/@me/channels                                                      |
| Get Users Connections               | GET       | /users/@me/connections                                                   |
| Get Webhook                         | GET       | /webhooks/{webhook.id}                                                   |
| Get Webhook with Token              | GET       | /webhooks/{webhook.id}/{webhook.token}                                   |
| Group DM Add Recipient              | PUT       | /channels/{channel.id}/recipients/{user.id}                              |
| Group DM Remove Recipient           | DELETE    | /channels/{channel.id}/recipients/{user.id}                              |
| Leave Guild                         | DELETE    | /users/@me/guilds/{guild.id}                                             |
| List Guild Members                  | GET       | /guilds/{guild.id}/members                                               |
| List Voice Regions                  | GET       | /voice/regions                                                           |
| Modify Channel                      | PUT/PATCH | /channels/{channel.id}                                                   |
| Modify Current User                 | PATCH     | /users/@me                                                               |
| Modify Current User's Nick          | PATCH     | /guilds/{guild.id}/members/@me/nick                                      |
| Modify Guild                        | PATCH     | /guilds/{guild.id}                                                       |
| Modify Guild Channel Positions      | PATCH     | /guilds/{guild.id}/channels                                              |
| Modify Guild Embed                  | PATCH     | /guilds/{guild.id}/embed                                                 |
| Modify Guild Integration            | PATCH     | /guilds/{guild.id}/integrations/{integration.id}                         |
| Modify Guild Member                 | PATCH     | /guilds/{guild.id}/members/{user.id}                                     |
| Modify Guild Role                   | PATCH     | /guilds/{guild.id}/roles/{role.id}                                       |
| Modify Guild Role Positions         | PATCH     | /guilds/{guild.id}/roles                                                 |
| Modify Webhook                      | PATCH     | /webhooks/{webhook.id}                                                   |
| Modify Webhook with Token           | PATCH     | /webhooks/{webhook.id}/{webhook.token}                                   |
| Remove Guild Ban                    | DELETE    | /guilds/{guild.id}/bans/{user.id}                                        |
| Remove Guild Member                 | DELETE    | /guilds/{guild.id}/members/{user.id}                                     |
| Remove Guild Member Role            | DELETE    | /guilds/{guild.id}/members/{user.id}/roles/{role.id}                     |
| Sync Guild Integration              | POST      | /guilds/{guild.id}/integrations/{integration.id}/sync                    |
| Trigger Typing Indicator            | POST      | /channels/{channel.id}/typing                                            |
