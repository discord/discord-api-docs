# RPC

All Discord clients have an RPC server running on localhost that allows control over local Discord clients. Most games will want to use our [GameBridge](#DOCS_GAMEBRIDGE) in combination, since it offers the power of Discord to players who don't have Discord yet installed.

## Private Beta FYI

For now RPC is in private beta, which means that only apps that have signed up can access the RPC. If you're interested in trying out Discord to power your game please [sign up over here](https://discordapp.com/gamebridge).

## Sample Code

In addition to the documentation below we have put together a sample project that shows the basics of using the RPC within a game. Check it out if you'd like to see how all of these concepts come together. [Click this link and you'll find it](https://github.com/hammerandchisel/sample-game-integration).

## Connecting to the RPC Server

The local RPC server runs only on localhost (`127.0.0.1`) and can be accessed over TLS with our `discordapp.io` domain.

The RPC Server is setup to process WebSocket connections and proxy API requests.

For WebSocket connections, the connection is always

```
wss://discordapp.io:PORT/?v=VERSION&client_id=CLIENT_ID&encoding=ENCODING
```

* `CLIENT_ID` is the client ID of the application accessing the RPC Server. 
* `VERSION` is the version of the RPC Server. 
* `PORT` is the port of the RPC Server.
* `ENCODING` is the type of encoding for this connection to use. `json` and `etf` are supported.

You'll need to create an app on Discord's platform. To do that head to [your apps](https://discordapp.com/developers/applications/me) and click the giant plus button. When you create an app on our Developers site, you must specify an "RPC Origin" and "Redirect URI" to permit connections and authorizations from. **The origin you send when connecting and the redirect uri you send when exchanging an authorization code for an access token must match one of the ones entered on the Developers site.**

When establishing a WebSocket connection, we verify the Origin header on connection to prevent client ID spoofing, so you will be instantly disconnected if the Origin does not match.

If you're connecting to the RPC server from within a browser, RPC origins are usually in the form `SCHEME://HOST[:PORT]`, where `SCHEME` is typically https or http, `HOST` is your domain or ip, and `PORT` is the port of the webserver where the user will be connecting from (omitted for ports 80 and 443). For example, `https://discordapp.com` would be used if the user is connecting from `https://discordapp.com/some/page/url`.

If you're connecting to the RPC server from within a non-browser application (like a game), you just need to make sure that the origin is sent with the upgrade request when connecting to the WebSocket. For local testing, we recommend testing with an origin like `https://localhost`. For production apps, we recommend setting the origin to your company/game's domain, for example `https://discordapp.com`.

## Proxied API Requests

If you request the `rpc.api` scope when authorizing your app to the client, your app is able to call the Discord API on behalf of the user with your access token.

For proxied API requests, the schema, host, and path to the API endpoint is always

```
https://discordapp.io:PORT/
```

* `PORT` is the port of the RPC Server.

Proxied API requests accept your OAuth2 Bearer token in the Authorization header, and respond exactly as our API normally would. The only difference between proxied and non-proxied API requests are that proxied requests are executed with the user's token instead of the OAuth2 Bearer token, which provides access to modify most of what the client has access to (we do block certain endpoints which are deemed unsafe, like most authentication-related endpoints and user management endpoints).

###### Example RPC Proxy Call

```
curl -H 'Authorization: Bearer CZhtkLDpNYXgPH9Ml6shqh2OwykChw' https://discordapp.io:6463/users/@me/guilds

[{
    "owner": true,
    "permissions": 2146958399,
    "icon": "2d68b25aa5d1eead693432a5f0077dff",
    "id": "199737254929760256",
    "name": "test"
}]
```

Proxied API requests are not applicable to the rest of the RPC Server docs, so check out the [rest of our API docs](https://discordapp.com/developers/docs/reference) to learn how to interface with our OAuth2 API.

## Restrictions

For connections to the RPC server, a [whitelist](#DOCS_RPC/authorize) is used to restrict access while you're still developing. You can invite up to 50 people to your whitelist.

For applications/games not approved, we limit you to 10 guilds and 10 channels your app can create. This limit is raised to virtually unlimited after approval.

## RPC Server Versions

Out of Service versions are versions whose subset of changes compared to the most recent version have been completely removed from the RPC Server. When connecting with these versions, the RPC Server may reject your connection entirely.

| Version | Out of Service |
|------------|----------------|
| 1 | no |

## RPC Server Ports

The port range for Discord's local RPC server is [6463, 6472]. Since the RPC server runs locally, there's a chance it might not be able to obtain its preferred port when it tries to bind to one. For this reason, the local RPC server will pick one port out of a range of these 10 ports, trying sequentially until it can bind to one. When implementing your client, you should perform the same sequential checking to find the correct port to connect to.

## RPC Server Payloads

###### Payload Structure

| Field | Type | Description | Present |
|-------|------|-------------|-------------|
| cmd | enum | payload command | Always |
| nonce | string | unique string used once for replies from the server | In responses to commands (not subscribed events) |
| evt | enum | subscription event | In subscribed events, errors, and (un)subscribing events |
| data | object | event data | In responses from the server |
| args | object | command arguments | In commands sent to the server |

###### RPC Commands

| Name | Description |
|--------|-----------------|
| [DISPATCH](#DOCS_RPC/events) | event dispatch |
| [AUTHORIZE](#DOCS_RPC/authorize) | used to authorize a new client with your app |
| [AUTHENTICATE](#DOCS_RPC/authenticate) | used to authenticate an existing client with your app |
| [GET_GUILD](#DOCS_RPC/getguild) | used to retrieve guild information from the client |
| [GET_GUILDS](#DOCS_RPC/getguilds) | used to retrieve a list of guilds from the client |
| [GET_CHANNEL](#DOCS_RPC/getchannel) | used to retrieve channel information from the client |
| [GET_CHANNELS](#DOCS_RPC/getchannels) | used to retrieve a list of channels for a guild from the client |
| [SUBSCRIBE](#DOCS_RPC/subscribe) | used to subscribe to an RPC event |
| [UNSUBSCRIBE](#DOCS_RPC/unsubscribe) | used to unsubscribe from an RPC event |
| [SET_USER_VOICE_SETTINGS](#DOCS_RPC/setuservoicesettings) | used to change voice settings of users in voice channels |
| [SELECT_VOICE_CHANNEL](#DOCS_RPC/selectvoicechannel) | used to join or leave a voice channel, group dm, or dm |
| [GET_SELECTED_VOICE_CHANNEL](#DOCS_RPC/getselectedvoicechannel) | used to get the current voice channel the client is in |
| [SELECT_TEXT_CHANNEL](#DOCS_RPC/selecttextchannel) | used to join or leave a text channel, group dm, or dm |
| [GET_VOICE_SETTINGS](#DOCS_RPC/getvoicesettings) | used to retrieve the client's voice settings |
| [SET_VOICE_SETTINGS](#DOCS_RPC/setvoicesettings) | used to set the client's voice settings |
| [CAPTURE_SHORTCUT](#DOCS_RPC/captureshortcut) | used to capture a keyboard shortcut entered by the user |

###### RPC Events

| Name | Description |
|--------|-----------------|
| [READY](#DOCS_RPC/ready) | non-subscription event sent immediately after connecting, contains server information |
| [ERROR](#DOCS_RPC/error) | non-subscription event sent when there is an error, including command responses |
| [GUILD_STATUS](#DOCS_RPC/guildstatus) | sent when a subscribed server's state changes |
| [GUILD_CREATE](#DOCS_RPC/guildcreate) | sent when a guild is created/joined on the client |
| [CHANNEL_CREATE](#DOCS_RPC/channelcreate) | sent when a channel is created/joined on the client |
| [VOICE_CHANNEL_SELECT](#DOCS_RPC/voicechannelselect) | sent when the client joins a voice channel |
| [VOICE_STATE_CREATE](#DOCS_RPC/voicestatecreatevoicestateupdatevoicestatedelete) | sent when a user joins a subscribed voice channel |
| [VOICE_STATE_UPDATE](#DOCS_RPC/voicestatecreatevoicestateupdatevoicestatedelete) | sent when a user's voice state changes in a subscribed voice channel (mute, volume, etc.) |
| [VOICE_STATE_DELETE](#DOCS_RPC/voicestatecreatevoicestateupdatevoicestatedelete) | sent when a user parts a subscribed voice channel |
| [VOICE_SETTINGS_UPDATE](#DOCS_RPC/voicesettingsupdate) | sent when the client's voice settings update |
| [VOICE_CONNECTION_STATUS](#DOCS_RPC/voiceconnectionstatus) | sent when the client's voice connection status changes |
| [SPEAKING_START](#DOCS_RPC/speakingstartspeakingstop) | sent when a user in a subscribed voice channel speaks |
| [SPEAKING_STOP](#DOCS_RPC/speakingstartspeakingstop) | sent when a user in a subscribed voice channel stops speaking |
| [MESSAGE_CREATE](#DOCS_RPC/messagecreatemessageupdatemessagedelete) | sent when a message is created in a subscribed text channel |
| [MESSAGE_UPDATE](#DOCS_RPC/messagecreatemessageupdatemessagedelete) | sent when a message is updated in a subscribed text channel |
| [MESSAGE_DELETE](#DOCS_RPC/messagecreatemessageupdatemessagedelete) | sent when a message is deleted in a subscribed text channel |
| [NOTIFICATION_CREATE](#DOCS_RPC/notificationcreate) | sent when the client receives a notification (mention or new message in eligible channels) |
| [CAPTURE_SHORTCUT_CHANGE](#DOCS_RPC/captureshortcutchange) | sent when the user presses a key during [shortcut capturing](#DOCS_RPC/captureshortcut) |

###### RPC Errors

| Code | Name | Description |
|--------|----------|-----------------|
| 1000 | Unknown Error | sent when an unknown error occurred |
| 4000 | Invalid Payload | sent when an invalid payload is received |
| 4002 | Invalid Command | sent when the command name specified is invalid |
| 4003 | Invalid Guild | sent when the guild id specified is invalid |
| 4004 | Invalid Event | sent when the event name specified is invalid |
| 4005 | Invalid Channel | sent when the channel id specified is invalid |
| 4006 | Invalid Permissions | sent when the user doesn't have the permission required to access the requested resource |
| 4007 | Invalid Client ID | sent when an invalid OAuth2 application ID is used to authorize or authenticate with |
| 4008 | Invalid Origin | sent when an invalid OAuth2 application origin is used to authorize or authenticate with |
| 4009 | Invalid Token | sent when an invalid OAuth2 token is used to authorize or authenticate with |
| 4010 | Invalid User | sent when the user id specified is invalid |
| 5000 | OAuth2 Error | sent when a standard OAuth2 error occurred; check the data object for the OAuth 2 error information |
| 5001 | Select Channel Timed Out | sent when an asyncronous SELECT_TEXT_CHANNEL/SELECT_VOICE_CHANNEL command times out |
| 5002 | Get Guild Timed Out | sent when an asyncronous GET_GUILD command times out |
| 5003 | Select Voice Force Required | sent when you try to join a user to a voice channel but the user is already in one |
| 5004 | Capture Shortcut Already Listening | sent when you try to capture a shortcut key when already capturing one |

###### RPC Close Codes

| Code | Name | Description |
|--------|----------|-----------------|
| 4000 | Invalid Client ID | sent when you connect to the RPC server with an invalid client ID |
| 4001 | Invalid Origin | sent when you connect to the RPC server with an invalid origin |
| 4002 | Ratelimited | sent when the RPC Server rejects your connection to a ratelimit |
| 4003 | Token Revoke | sent when the OAuth2 token associated with a connection is revoked |
| 4004 | Invalid Version | sent when the RPC Server version specified in the connection string is not valid |
| 4005 | Invalid Encoding | sent when the encoding specified in the connection string is not valid |

## Authenticating over RPC

In order to call any commands over RPC, you must be authenticated or you will receive a code `4006` error response. 

We have implemented the OAuth2 flow over RPC. To authenticate, you will need to get an access token.

You would first call the [AUTHORIZE](#DOCS_RPC/authorize) command, and then the user would be prompted to authorize your app to access RPC on Discord.

The AUTHORIZE command returns a `code` that you can exchange with a POST to `https://discordapp.com/api/oauth2/token` containing the [standard OAuth2 body parameters](https://tools.ietf.org/html/rfc6749#section-4.1.3) for the token exchange.

The token endpoint on our API will return an `access_token` that can be sent with the [AUTHENTICATE](#DOCS_RPC/authenticate) command over RPC.

After authentication you are then able to call commands over RPC.

## Commands

### AUTHENTICATE

Used to authenticate an existing client with your app.

###### Authenticate Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| access_token | string | OAuth2 access token |

###### Authenticate Response Structure

| Field | Type | Description |
|-------|------|-------------|
| user | User | partial user object |
| scopes | Array | array of authorized [OAuth2 scopes](#DOCS_OAUTH2/scopes) |
| expires | Date | expiration date of OAuth2 token |
| application | Application | OAuth2 application object |

###### Authenticate Example Command Payload

```json
{
    "nonce": "5bb10a43-1fdc-4391-9512-0c8f4aa203d4",
    "args": {
        "access_token": "CZhtkLDpNYXgPH9Ml6shqh2OwykChw"
    },
    "cmd": "AUTHENTICATE"
}
```

###### Authenticate Example Response Payload

```json
{
    "cmd": "AUTHENTICATE",
    "data": {
        "application": {
            "description": "test app description",
            "icon": "d6b51c21c48482d5b64aa4832d92fe14",
            "id": "192741864418312192",
            "rpc_origins": ["http://localhost:3344"],
            "name": "test app"
        },
        "expires": "2017-06-29T19:09:52.361000+00:00",
        "user": {
            "username": "test user",
            "discriminator": "7479",
            "id": "190320984123768832",
            "avatar": "b004ec1740a63ca06ae2e14c5cee11f3"
        },
        "scopes": ["rpc.api", "rpc", "identify"]
    },
    "nonce": "5bb10a43-1fdc-4391-9512-0c8f4aa203d4"
}
```

### AUTHORIZE

Used to authenticate a new client with your app. By default this pops up a modal in-app that asks the user to authorize access to your app.

**We currently do not allow access to RPC for unapproved games without an entry on a game's whitelist.** We grant 50 whitelist spots, which should be ample for development and testing. After approval, this restriction is removed and the whitelist is no longer needed.

We also have an RPC token system to bypass the user authorization modal. This is usable by approved games as well as by users on a game's whitelist, and also disallows use of the `messages.read` scope. If you have been granted access, you can send a POST request to `https://discordapp.com/api/oauth2/token/rpc` with your application's `client_id` and `client_secret` in the body (sent as a url-encoded body, **not JSON**). You can then pass the returned `rpc_token` value to the `rpc_token` field in your RPC authorize request (documented below).

###### Authorize Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| scopes | Array | array of OAuth2 scopes to authorize |
| client_id | String | OAuth2 application id |
| rpc_token | String | one-time use RPC token |
| username | String | username to create a guest account with if the user does not have Discord (only in GameBridge SDK) |

###### Authorize Response Structure

| Field | Type | Description |
|-------|------|-------------|
| code | String | OAuth2 authorization code |

###### Authorize Example Command Payload

```json
{
    "nonce": "f48f6176-4afb-4c03-b1b8-d960861f5216",
    "args": {
        "client_id": "192741864418312192",
        "scopes": ["rpc.api", "rpc", "identify"]
    },
    "cmd": "AUTHORIZE"
}
```

###### Authorize Example Response Payload

```json
{
    "cmd": "AUTHORIZE",
    "data": {
        "code": "O62Q9JzFe8BEOUzIfsAndOjNd2V4sJ"
    },
    "nonce": "f48f6176-4afb-4c03-b1b8-d960861f5216"
}
```

### GET_GUILDS

Used to get a list of guilds the client is in.

###### Get Guilds Response Structure

| Field | Type | Description |
|-------|------|-------------|
| guilds | Array | array of partial guild objects |

###### Get Guilds Example Command Payload

```json
{
    "nonce": "e16fcbed-8bfa-4fd4-ba09-73b72e809833",
    "args": {},
    "cmd": "GET_GUILDS"
}
```

###### Get Guilds Example Response Payload

```json
{
    "cmd": "GET_GUILDS",
    "data": {
        "guilds": [{
            "id": "199737254929760256",
            "name": "test"
        }]
    },
    "nonce": "e16fcbed-8bfa-4fd4-ba09-73b72e809833"
}
```

### GET_GUILD

Used to get a guild the client is in.

###### Get Guild Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| guild_id | String | id of the guild to get |
| timeout | Number | asyncronously get guild with time to wait before timing out |

###### Get Guild Response Structure

| Field | Type | Description |
|-------|------|-------------|
| id | String | guild id |
| name | String | guild name |
| icon_url | String | guild icon url |
| members | Array | array of guild members |

###### Get Guild Example Command Payload

```json
{
    "nonce": "9524922c-3d32-413a-bdaa-0804f4332588",
    "args": {
        "guild_id": "199737254929760256"
    },
    "cmd": "GET_GUILD"
}
```

###### Get Guild Example Response Payload

```json
{
    "cmd": "GET_GUILD",
    "data": {
        "id": "199737254929760256",
        "name": "test",
        "icon_url": null,
        "members": [{
            "user": {
                "id": "190320984123768832",
                "username": "test 2",
                "discriminator": "7479",
                "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
                "bot": false
            },
            "status": "online",
            "activity": null
        }, {
            "user": {
                "id": "192731515703001088",
                "username": "test",
                "discriminator": "5844",
                "avatar": null,
                "bot": false
            },
            "status": "idle",
            "activity": null
        }]
    },
    "nonce": "9524922c-3d32-413a-bdaa-0804f4332588"
}
```

### GET_CHANNEL

Used to get a channel the client is in.

###### Get Channel Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| channel_id | String | id of the channel to get |

###### Get Channel Response Structure

| Field | Type | Description |
|-------|------|-------------|
| id | String | channel id |
| guild_id | String | channel's guild id |
| name | String | channel name |
| type | Number | channel type (guild text: 0, guild voice: 2, dm: 1, group dm: 3) |
| topic | String | (text) channel topic |
| bitrate | Int | (voice) bitrate of voice channel |
| user_limit | Int | (voice) user limit of voice channel (0 for none) |
| position | Int | position of channel in channel list |
| voice_states | Array | (voice) array of channel voice states |
| messages | Array | (text) array of channel text messages |

###### Get Channel Example Command Payload

```json
{
    "nonce": "f682697e-d257-4a17-ac0a-7e4b84e66663",
    "args": {
        "channel_id": "199737254929760257"
    },
    "cmd": "GET_CHANNEL"
}
```

###### Get Channel Example Response Payload

```json
{
    "cmd": "GET_CHANNEL",
    "data": {
        "id": "199737254929760257",
        "name": "General",
        "type": 2,
        "bitrate": 64000,
        "user_limit": 0,
        "guild_id": "199737254929760256",
        "position": 0,
        "voice_states": [{
            "voice_state": {
                "mute": false,
                "deaf": false,
                "self_mute": false,
                "self_deaf": false,
                "suppress": false
            },
            "user": {
                "id": "190320984123768832",
                "username": "test 2",
                "discriminator": "7479",
                "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
                "bot": false
            },
            "nick": "test user 2",
            "volume": 110,
            "mute": false,
            "pan": {
                "left": 1.0,
                "right": 1.0
            }
        }]
    },
    "nonce": "f682697e-d257-4a17-ac0a-7e4b84e66663"
}
```

### GET_CHANNELS

Used to get a guild's channels the client is in.

###### Get Channels Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| guild_id | String | id of the guild to get channels for |

###### Get Channels Response Structure

| Field | Type | Description |
|-------|------|-------------|
| channels | Array | array of partial channels |

###### Get Channels Example Command Payload

```json
{
    "nonce": "0dee7bd4-8f62-4ecc-9e0f-1b1839a4fa93",
    "args": {
        "guild_id": "199737254929760256"
    },
    "cmd": "GET_CHANNELS"
}
```

###### Get Channels Example Response Payload

```json
{
    "cmd": "GET_CHANNELS",
    "data": {
        "channels": [{
            "id": "199737254929760256",
            "name": "general",
            "type": 0
        }, {
            "id": "199737254929760257",
            "name": "General",
            "type": 2
        }]
    },
    "nonce": "0dee7bd4-8f62-4ecc-9e0f-1b1839a4fa93"
}
```

### SET_USER_VOICE_SETTINGS

Used to change voice settings of users in voice channels

###### Set User Voice Settings Argument and Response Structure

| Field | Type | Description |
|-------|------|-------------|
| user_id | String | user id |
| pan | Pan Object | (optional) set the pan of the user |
| volume | Number | (optional) set the volume of user (defaults to 100, min 0, max 200)|
| mute | Boolean | (optional) set the mute state of the user |

>info
> In the current release, we only support a single modifier of voice settings at a time over RPC. 
> If an app changes voice settings, it will lock voice settings so that other apps connected simultaneously 
> lose the ability to change voice settings. Settings reset to what they were before being changed after the 
> controlling app disconnects. When an app that has previously set voice settings connects, the client will swap 
> to that app's configured voice settings and lock voice settings again. This is a temporary situation that will 
> be changed in the future.

###### Pan Object

| Field | Type | Description |
|-------|------|-------------|
| left | Float | left pan of user (min: 0.0, max: 1.0) |
| right | Float | right pan of user (min: 0.0, max: 1.0) |

###### Set User Voice Settings Example Command Payload

```json
{
    "nonce": "eafc8152-2248-4478-9827-8457b7900cb4",
    "args": {
        "user_id": "192731515703001088",
        "pan": {
            "left": 1.0,
            "right": 1.0
        },
        "volume": 120,
        "mute": false
    },
    "cmd": "SET_USER_VOICE_SETTINGS"
}
```

###### Set User Voice Settings Example Response Payload

```json
{
    "cmd": "SET_USER_VOICE_SETTINGS",
    "data": {
        "user_id": "192731515703001088",
        "pan": {
            "left": 1.0,
            "right": 1.0
        },
        "volume": 120,
        "mute": false
    },
    "nonce": "eafc8152-2248-4478-9827-8457b7900cb4"
}
```

### SELECT_VOICE_CHANNEL

Used to join and leave voice channels, group dms, or dms

###### Select Voice Channel Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| channel_id | String | channel id to join (or `null` to leave) |
| timeout | Number | asyncronously join channel with time to wait before timing out |
| force | Boolean | forces a user to join a voice channel |

>warn
> When trying to join the user to a voice channel, you will receive a `5003` error coded response if the user is already in a voice channel. The `force` parameter should only be specified in response to the case where a user is already in a voice channel and they have **approved** to be moved by your app to a new voice channel.

###### Select Voice Channel Response Structure

Returns the Get Channel response, `null` if none.

###### Select Voice Channel Example Command Payload

```json
{
    "nonce": "5d9df76d-6408-46a1-9368-33dca74fa423",
    "args": {
        "channel_id": "199737254929760257"
    },
    "cmd": "SELECT_VOICE_CHANNEL"
}
```

###### Select Voice Channel Example Response Payload

```json
{
    "cmd": "SELECT_VOICE_CHANNEL",
    "data": {
        "id": "199737254929760257",
        "name": "General",
        "type": 2,
        "bitrate": 64000,
        "user_limit": 0,
        "guild_id": "199737254929760256",
        "position": 0,
        "voice_states": [{
            "voice_state": {
                "mute": false,
                "deaf": false,
                "self_mute": false,
                "self_deaf": false,
                "suppress": false
            },
            "user": {
                "id": "190320984123768832",
                "username": "test 2",
                "discriminator": "7479",
                "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
                "bot": false
            },
            "nick": "test user 2",
            "mute": false,
            "volume": 110,
            "pan": {
                "left": 1.0,
                "right": 1.0
            }
        }]
    },
    "nonce": "5d9df76d-6408-46a1-9368-33dca74fa423"
}
```

### GET_SELECTED_VOICE_CHANNEL

Used to get the client's current voice channel

###### Get Selected Voice Channel Argument Structure

There are no arguments for this command

###### Get Selected Voice Channel Response Structure

Returns the Get Channel response, `null` if none.

###### Get Selected Voice Channel Example Command Payload

```json
{
    "nonce": "fe3508b2-5819-42f2-be56-d77b507acb60",
    "cmd": "GET_SELECTED_VOICE_CHANNEL"
}
```

###### Get Selected Voice Channel Example Response Payload

```json
{
    "cmd": "GET_SELECTED_VOICE_CHANNEL",
    "data": {
        "id": "199737254929760257",
        "name": "General",
        "type": 2,
        "bitrate": 64000,
        "user_limit": 0,
        "guild_id": "199737254929760256",
        "position": 0,
        "voice_states": [{
            "voice_state": {
                "mute": false,
                "deaf": false,
                "self_mute": false,
                "self_deaf": false,
                "suppress": false
            },
            "user": {
                "id": "190320984123768832",
                "username": "test 2",
                "discriminator": "7479",
                "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
                "bot": false
            },
            "nick": "test user 2",
            "mute": false,
            "volume": 110,
            "pan": {
                "left": 1.0,
                "right": 1.0
            }
        }]
    },
    "nonce": "fe3508b2-5819-42f2-be56-d77b507acb60"
}
```

### SELECT_TEXT_CHANNEL

Used to join and leave text channels, group dms, or dms

###### Select Text Channel Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| channel_id | String | channel id to join (or `null` to leave) |
| timeout | Number | asyncronously join channel with time to wait before timing out |

###### Select Text Channel Response Structure

Returns the Get Channel response, `null` if none.

###### Select Text Channel Example Command Payload

```json
{
    "nonce": "2683deb0-acb1-4e84-beca-ab4c6e1b16a3",
    "args": {
        "channel_id": "199737254929760257"
    },
    "cmd": "SELECT_TEXT_CHANNEL"
}
```

###### Select Text Channel Example Response Payload

```json
{
    "cmd": "SELECT_TEXT_CHANNEL",
    "data": {
        "id": "199737254929760257",
        "name": "General",
        "type": 0,
        "topic": "test topic",
        "guild_id": "199737254929760256",
        "position": 0,
        "messages": [{
            "id": "219370467260104407",
            "blocked": false,
            "bot": false,
            "content": "test content",
            "content_parsed": [{
                "content": "test content",
                "type": "text"
            }],
            "nick": null,
            "author_color": "#206694",
            "edited_timestamp": null,
            "timestamp": "2016-08-28T08:19:55.101Z",
            "tts": false,
            "mentions": [],
            "mention_roles": [],
            "mention_everyone": false,
            "embeds": [],
            "attachments": [],
            "author": {
                "id": "180169777707352560",
                "username": "test",
                "discriminator": "1234",
                "avatar": null,
                "bot": false
            },
            "pinned": false,
            "type": 0
        }]
    },
    "nonce": "2683deb0-acb1-4e84-beca-ab4c6e1b16a3"
}
```

### GET_VOICE_SETTINGS

###### Get Voice Settings Response Structure

| Field | Type | Description |
|-------|------|-------------|
| input | VoiceSettingsInput | voice settings input object |
| output | VoiceSettingsOuput | voice settings output object |
| mode | VoiceSettingsMode | voice settings mode object |
| automatic_gain_control | Boolean | state of automatic gain control |
| echo_cancellation | Boolean | state of echo cancellation |
| noise_suppression | Boolean | state of noise suppression |
| qos | Boolean | state of voice quality of service |
| silence_warning | Boolean | state of silence warning notice |
| deaf | Boolean | state of self-deafen |
| mute | Boolean | state of self-mute |

###### VoiceSettingsInput Structure

| Field | Type | Description |
|-------|------|-------------|
| device_id | String | device id |
| volume | Float | input voice level (min: 0, max: 100) |
| available_devices | Array | array of *read-only* device objects containing `id` and `name` string keys |

###### VoiceSettingsOutput Structure

| Field | Type | Description |
|-------|------|-------------|
| device_id | String | device id |
| volume | Float | output voice level (min: 0, max: 200) |
| available_devices | Array | array of *read-only* device objects containing `id` and `name` string keys |

###### VoiceSettingsMode Structure

| Field | Type | Description |
|-------|------|-------------|
| type | Enum | voice setting mode type (can be `PUSH_TO_TALK` or `VOICE_ACTIVITY` |
| auto_threshold | Boolean | voice activity threshold automatically sets its threshold |
| threshold | Float | threshold for voice activity (in dB) (min: -100, max: 0) |
| shortcut | ShortcutKeyCombo | shortcut key combo array for PTT |
| delay | Float | the PTT release delay (in ms) (min: 0, max: 2000) |

###### ShortcutKeyCombo Structure

| Field | Type | Description |
|-------|------|-------------|
| type | Int | key type. `0`: keyboard key, `1`: mouse button, `2`: keyboard modifier key, `3`: gamepad button |
| code | Int | key code |
| name | String | key name |

###### Get Voice Settings Example Response Payload

```json
{
    "cmd": "GET_VOICE_SETTINGS",
    "data": {
        "input": {
            "available_devices": [{
                "id": "default",
                "name": "Default"
            }, {
                "id": "Built-in Microphone",
                "name": "Built-in Microphone"
            }],
            "device_id": "default",
            "volume": 49.803921580314636
        },
        "output": {
            "available_devices": [{
                "id": "default",
                "name": "Default"
            }, {
                "id": "Built-in Output",
                "name": "Built-in Output"
            }],
            "device_id": "default",
            "volume": 93.00000071525574
        },
        "mode": {
            "type": "VOICE_ACTIVITY",
            "auto_threshold": true,
            "threshold": -46.92622950819673,
            "shortcut": [{"type":0,"code":12,"name":"i"}],
            "delay": 98.36065573770492
        },
        "automatic_gain_control": false,
        "echo_cancellation": false,
        "noise_suppression": false,
        "qos": false,
        "silence_warning": false,
        "deaf": false,
        "mute": false
    },
    "nonce": "fa07c532-bb03-4f75-8b9a-397f5109afb6"
}
```

### SET_VOICE_SETTINGS

###### Set Voice Settings Argument and Response Structure

When setting voice settings, all fields are optional. Only passed fields are updated.

>info
> In the current release, we only support a single modifier of voice settings at a time over RPC. 
> If an app changes voice settings, it will lock voice settings so that other apps connected simultaneously 
> lose the ability to change voice settings. Settings reset to what they were before being changed after the 
> controlling app disconnects. When an app that has previously set voice settings connects, the client will swap 
> to that app's configured voice settings and lock voice settings again. This is a temporary situation that will 
> be changed in the future.

| Field | Type | Description |
|-------|------|-------------|
| input | VoiceSettingsInput | voice settings input object |
| output | VoiceSettingsOuput | voice settings output object |
| mode | VoiceSettingsMode | voice settings mode object |
| automatic_gain_control | Boolean | state of automatic gain control |
| echo_cancellation | Boolean | state of echo cancellation |
| noise_suppression | Boolean | state of noise suppression |
| qos | Boolean | state of voice quality of service |
| silence_warning | Boolean | state of silence warning notice |
| deaf | Boolean | state of self-deafen |
| mute | Boolean | state of self-mute |

###### VoiceSettingsInput Structure

| Field | Type | Description |
|-------|------|-------------|
| device_id | String | device id |
| volume | Float | input voice level (min: 0, max: 100) |
| available_devices | Array | array of *read-only* device objects containing `id` and `name` string keys |

###### VoiceSettingsOutput Structure

| Field | Type | Description |
|-------|------|-------------|
| device_id | String | device id |
| volume | Float | output voice level (min: 0, max: 200) |
| available_devices | Array | array of *read-only* device objects containing `id` and `name` string keys |

###### VoiceSettingsMode Structure

| Field | Type | Description |
|-------|------|-------------|
| type | Enum | voice setting mode type (can be `PUSH_TO_TALK` or `VOICE_ACTIVITY` |
| auto_threshold | Boolean | voice activity threshold automatically sets its threshold |
| threshold | Float | threshold for voice activity (in dB) (min: -100, max: 0) |
| shortcut | ShortcutKeyCombo | shortcut key combo array for PTT |
| delay | Float | the PTT release delay (in ms) (min: 0, max: 2000) |

###### ShortcutKeyCombo Structure

| Field | Type | Description |
|-------|------|-------------|
| type | Int | key type. `0`: keyboard key, `1`: mouse button, `2`: keyboard modifier key, `3`: gamepad button |
| code | Int | key code |
| name | String | key name |

###### Set Voice Settings Example Command Payload

```json
{
    "nonce": "3d64ed55-ef6e-4bd5-99c9-677533babc22",
    "args": {
        "input": {
            "volume": 90.5
        }
    },
    "cmd": "SET_VOICE_SETTINGS"
}
```

###### Set Voice Settings Example Response Payload

```json
{
    "cmd": "SET_VOICE_SETTINGS",
    "data": {
        "input": {
            "available_devices": [{
                "id": "default",
                "name": "Default"
            }, {
                "id": "Built-in Microphone",
                "name": "Built-in Microphone"
            }],
            "device_id": "default",
            "volume": 90.5
        },
        "output": {
            "available_devices": [{
                "id": "default",
                "name": "Default"
            }, {
                "id": "Built-in Output",
                "name": "Built-in Output"
            }],
            "device_id": "default",
            "volume": 93.00000071525574
        },
        "mode": {
            "type": "VOICE_ACTIVITY",
            "auto_threshold": true,
            "threshold": -46.92622950819673,
            "shortcut": [{"type":0,"code":12,"name":"i"}],
            "delay": 98.36065573770492
        },
        "automatic_gain_control": false,
        "echo_cancellation": false,
        "noise_suppression": false,
        "qos": false,
        "silence_warning": false,
        "deaf": false,
        "mute": false
    },
    "nonce": "3d64ed55-ef6e-4bd5-99c9-677533babc22"
}
```

### SUBSCRIBE

Used to subscribe to events

###### Subscribe Argument Structure

`evt` of the payload should be set to the event being subscribed to.
`args` of the payload should be set to the args needed for the event.

###### Subscribe Response Structure

| Field | Type | Description |
|-------|------|-------------|
| evt | String | event name now subscribed to |

###### Subscribe Example Command Payload

```json
{
    "nonce": "be9a6de3-31d0-4767-a8e9-4818c5690015",
    "args": {
        "guild_id": "199737254929760256"
    },
    "evt": "GUILD_STATUS",
    "cmd": "SUBSCRIBE"
}
```

###### Subscribe Example Response Payload

```json
{
    "cmd": "SUBSCRIBE",
    "data": {
        "evt": "GUILD_STATUS"
    },
    "nonce": "be9a6de3-31d0-4767-a8e9-4818c5690015"
}
```

### UNSUBSCRIBE

Used to unsubscribe from events

###### Unsubscribe Argument Structure

`evt` of the payload should be set to the event that was subscribed to.
`args` of the payload should be set to the args needed for the previously subscribed event.

###### Unsubscribe Response Structure

| Field | Type | Description |
|-------|------|-------------|
| evt | String | event name now unsubscribed from |

###### Unsubscribe Example Command Payload

```json
{
    "nonce": "647d814a-4cf8-4fbb-948f-898aad24f55b",
    "args": {
        "guild_id": "199737254929760256"
    },
    "evt": "GUILD_STATUS",
    "cmd": "UNSUBSCRIBE"
}
```

###### Unsubscribe Example Response Payload

```json
{
    "cmd": "UNSUBSCRIBE",
    "data": {
        "evt": "GUILD_STATUS"
    },
    "nonce": "647d814a-4cf8-4fbb-948f-898aad24f55b"
}
```

### CAPTURE_SHORTCUT

Used to capture a keyboard shortcut entered by the user

###### Capture Shortcut Argument Structure

This command is asynchronously returned. You capture a shortcut by first sending the `START` action. Then, the user is free to press keys while we log the shortcut key codes for you. As they press keys, we will emit a [CAPTURE_SHORTCUT_CHANGE](#DOCS_RPC/captureshortcutchange) event with the updated key codes. **When the user finishes, you then need to finish capturing by sending the `STOP` action.**

Note: The `START` call will return the captured shortcut in its `data` object, while the `STOP` call will have no `data`.

| Field | Type | Description |
|-------|------|-------------|
| action | string | capture action; `START` or `STOP` |

###### Capture Shortcut Response Structure

Returns the shortcut captured, and `null` for the `STOP` action.

| Field | Type | Description |
|-------|------|-------------|
| shortcut | [ShortcutKeyCombo](#DOCS_RPC/shortcutkeycombo-structure) | the captured shortcut key combo array |

###### Capture Shortcut Example Command Payload

```json
{
    "nonce": "9b4e9711-97f3-4f35-b047-32c82a51978e",
    "args": {
        "action": "START"
    },
    "cmd": "CAPTURE_SHORTCUT"
}
```

###### Capture Shortcut Example Response Payload

```json
{
    "cmd": "CAPTURE_SHORTCUT",
    "data": {
        "shortcut": [{"type":0,"code":12,"name":"i"}]
    },
    "nonce": "9b4e9711-97f3-4f35-b047-32c82a51978e"
}
```

## Events

### READY

###### Ready Dispatch Data Structure

| Field | Type | Description |
|-------|------|-------------|
| v | Int | RPC version |
| config | Object | RPC server configuration object |

###### Ready Dispatch Example Payload

```json
{
    "cmd": "DISPATCH",
    "data": {
        "v": 1,
        "config": {
            "cdn_host": "cdn.discordapp.com",
            "api_endpoint": "//discordapp.com/api",
            "environment": "production"
        }
    },
    "evt": "READY"
}
```

### ERROR

###### Error Data Structure

| Field | Type | Description |
|-------|------|-------------|
| code | Int | RPC Error Code |
| message | String | Error description |

###### Error Example Payload

```json
{
    "cmd": "AUTHORIZE",
    "data": {
        "code": 4007,
        "message": "No client id provided"
    },
    "evt": "ERROR",
    "nonce": "5102b6f0-c769-4f37-8cca-25fb0ab22628"
}
```

### GUILD_STATUS

###### Guild Status Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| guild_id | String | id of guild to listen to updates of |

###### Guild Status Dispatch Data Structure

| Field | Type | Description |
|-------|------|-------------|
| guild | Guild | guild partial with id, name, and iconUrl |
| online | Int | number of online users in guild |

###### Guild Status Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "data": {
        "guild": {
            "id": "199737254929760256",
            "name": "test",
            "icon_url": null
        },
        "online": 2
    },
    "evt": "GUILD_STATUS"
}
```

### GUILD_CREATE

###### Guild Create Argument Structure

No arguments

###### Guild Create Dispatch Data Structure

| Field | Type | Description |
|-------|------|-------------|
| id | String | guild id |
| name | String | name of the guild |

###### Guild Create Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "data": {
        "id": "199737254929767562",
        "name": "Test Server"
    },
    "evt": "GUILD_CREATE"
}
```

### CHANNEL_CREATE

###### Channel Create Argument Structure

No arguments

###### Channel Create Dispatch Data Structure

| Field | Type | Description |
|-------|------|-------------|
| id | String | channel id |
| name | String | name of the channel |
| type | Number | channel type (guild text: 0, guild voice: 2, dm: 1, group dm: 3) |

###### Channel Create Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "data": {
        "id": "199737254929760257",
        "name": "General",
        "type": 0
    },
    "evt": "CHANNEL_CREATE"
}
```

### VOICE_CHANNEL_SELECT

###### Voice Channel Select Argument Structure

No arguments

###### Voice Channel Select Dispatch Data Structure

| Field | Type | Description |
|-------|------|-------------|
| channel_id | String | id of channel (`null` if none) |
| guild_id | String | id of guild (`null` if none) |

###### Voice Channel Select Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "data": {
        "channel_id": "199737254929760257",
        "guild_id": "199737254929760256"
    },
    "evt": "VOICE_CHANNEL_SELECT"
}
```

### VOICE_SETTINGS_UPDATE

###### Voice Settings Argument Structure

No arguments

###### Voice Settings Dispatch Data Structure

Dispatches the voice settings object (see the GET_VOICE_SETTINGS response).

###### Voice Settings Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "data": {
        "input": {
            "available_devices": [{
                "id": "default",
                "name": "Default"
            }, {
                "id": "Built-in Microphone",
                "name": "Built-in Microphone"
            }],
            "device_id": "default",
            "volume": 49.803921580314636
        },
        "output": {
            "available_devices": [{
                "id": "default",
                "name": "Default"
            }, {
                "id": "Built-in Output",
                "name": "Built-in Output"
            }],
            "device_id": "default",
            "volume": 93.00000071525574
        },
        "mode": {
            "type": "VOICE_ACTIVITY",
            "auto_threshold": true,
            "threshold": -46.92622950819673,
            "shortcut": [{"type":0,"code":12,"name":"i"}],
            "delay": 98.36065573770492
        },
        "automatic_gain_control": false,
        "echo_cancellation": false,
        "noise_suppression": false,
        "qos": false,
        "silence_warning": false
    },
    "evt": "VOICE_SETTINGS_UPDATE"
}
```

### VOICE_STATE_CREATE/VOICE_STATE_UPDATE/VOICE_STATE_DELETE

###### Voice State Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| channel_id | String | id of channel to listen to updates of |

###### Voice State Dispatch Data Structure

Dispatches channel voice state objects

###### Voice State Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "evt": "VOICE_STATE_CREATE",
    "data": {
        "voice_state": {
            "mute": false,
            "deaf": false,
            "self_mute": false,
            "self_deaf": false,
            "suppress": false
        },
        "user": {
            "id": "190320984123768832",
            "username": "test 2",
            "discriminator": "7479",
            "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
            "bot": false
        },
        "nick": "test user 2",
        "volume": 110,
        "mute": false,
        "pan": {
            "left": 1.0,
            "right": 1.0
        }
    }
}
```

### VOICE_CONNECTION_STATUS

###### Voice Connection Status Argument Structure

No arguments

###### Voice Connection Status Dispatch Data Structure

| Field | Type | Description |
|-------|------|-------------|
| state | String | one of the voice connection states listed below |
| hostname | String | hostname of the connected voice server |
| pings | Array of Numbers | last 20 pings (in ms) |
| average_ping | Number | average ping (in ms) |
| last_ping | Number | last ping (in ms) |

###### Voice Connection States

| Field | Description |
|-------|-------------|
| DISCONNECTED | TCP disconnected |
| AWAITING_ENDPOINT | Waiting for voice endpoint |
| AUTHENTICATING | TCP authenticating |
| CONNECTING | TCP connecting |
| CONNECTED | TCP connected |
| VOICE_DISCONNECTED | TCP connected, Voice disconnected |
| VOICE_CONNECTING | TCP connected, Voice connecting |
| VOICE_CONNECTED | TCP connected, Voice connected |
| NO_ROUTE | No route to host |
| ICE_CHECKING | WebRTC ice checking |

###### Voice Connection Status Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "evt": "VOICE_CONNECTION_STATUS",
    "data": {
        "state": "VOICE_CONNECTED",
        "hostname": "some-server.discord.gg",
        "pings": [20, 13.37],
        "average_ping": 13.37,
        "last_ping": 20
    }
}
```

### MESSAGE_CREATE/MESSAGE_UPDATE/MESSAGE_DELETE

###### Message Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| channel_id | String | id of channel to listen to updates of |

###### Message Dispatch Data Structure

Dispatches message objects, with the exception of deletions, which only contains the id in the message object.

###### Message Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "data": {
        "channel_id": "199737254929760256",
        "message": {
            "id": "199743874640379904",
            "blocked": false,
            "content": "test",
            "content_parsed": [{
                "content": "test",
                "type": "text"
            }],
            "author_color": "#ffffff",
            "edited_timestamp": null,
            "timestamp": "2016-07-05T04:30:50.776Z",
            "tts": false,
            "mentions": [],
            "mention_roles": [],
            "mention_everyone": false,
            "embeds": [],
            "attachments": [],
            "type": 0,
            "pinned": false,
            "author": {
                "id": "190320984123768832",
                "username": "test user 2",
                "discriminator": "7479",
                "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
                "bot": false
            }
        }
    },
    "evt": "MESSAGE_CREATE"
}
```

### SPEAKING_START/SPEAKING_STOP

###### Speaking Argument Structure

| Field | Type | Description |
|-------|------|-------------|
| channel_id | String | id of channel to listen to updates of |

###### Speaking Dispatch Data Structure

| Field | Type | Description |
|-------|------|-------------|
| user_id | String | id of user who started/stopped speaking |

###### Speaking Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "data": {
        "user_id": "190320984123768832"
    },
    "evt": "SPEAKING_STOP"
}
```

### NOTIFICATION_CREATE

###### Notification Create Required OAuth2 Scope

This event requires the `rpc.notifications.read` OAuth2 scope.

###### Notification Create Argument Structure

No arguments

###### Notification Create Dispatch Data Structure

| Field | Type | Description |
|-------|------|-------------|
| channel_id | String | id of channel where notification occurred |
| message | Message | message object that generated this notification |
| icon_url | String | icon url of the notification |
| title | String | title of the notification |
| body | String | body of the notification |

###### Notification Create Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "data": {
        "channel_id": "199737254929760256",
        "message": {
            "id": "199743874640379904",
            "blocked": false,
            "content": "test",
            "content_parsed": [{
                "content": "test",
                "type": "text"
            }],
            "author_color": "#ffffff",
            "edited_timestamp": null,
            "timestamp": "2016-07-05T04:30:50.776Z",
            "tts": false,
            "mentions": [],
            "mention_roles": [],
            "mention_everyone": false,
            "embeds": [],
            "attachments": [],
            "type": 0,
            "pinned": false,
            "author": {
                "id": "190320984123768832",
                "username": "test user 2",
                "discriminator": "7479",
                "avatar": "b004ec1740a63ca06ae2e14c5cee11f3",
                "bot": false
            }
        },
        "icon_url": "https://cdn.discordapp.com/avatars/155607406007681024/8ab559b8286e48270c04471ae382cd9d.jpg",
        "title": "test_user (#general)",
        "body": "test message"
    },
    "evt": "NOTIFICATION_CREATE"
}
```

### CAPTURE_SHORTCUT_CHANGE

###### Capture Shortcut Change Argument Structure

No arguments

###### Capture Shortcut Change Dispatch Data Structure

| Field | Type | Description |
|-------|------|-------------|
| shortcut | [ShortcutKeyCombo](#DOCS_RPC/shortcutkeycombo-structure) | the captured shortcut key combo array |

###### Capture Shortcut Change Example Dispatch Payload

```json
{
    "cmd": "DISPATCH",
    "evt": "CAPTURE_SHORTCUT_CHANGE",
    "data": {
        "shortcut": [{"type":0,"code":12,"name":"i"}]
    }
}
```
