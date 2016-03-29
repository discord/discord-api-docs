# Voice

Voice connections operate in a similar fashion to the [Gateway](#DOCS_GATEWAY/gateways) connection, however they operate on a different set of payloads, and utilize a separate UDP-based connection for voice data transmission. Because UDP is utilized for both the receiving and transmitting of voice, your client _must_ be able to receive UDP packets, even through a firewall or NAT (see [UDP Hole Punching](https://en.wikipedia.org/wiki/UDP_hole_punching) for more information). The Discord Voice servers implement functionality (see [IP Discovery](#DOCS_VOICE_CONNECTIONS/ip-discovery)) for discovering the local machines remote UDP IP/Port, which can assist in some network configurations.

## Voice Packets and Events

###### Voice Packet Structure

The voice packet is a 70 byte payload that begins with a 4 byte big-endian packed unsigned integer, which represents the clients 'ssrc'. The rest of the bytes in the payload are Opus audio data.

###### Voice Events

| Code | Name | Description |
|--------|----------|-----------------|
| 0 | Identify | used to begin a voice websocket connection |
| 1 | Select Protocol | used to select the voice protocol |
| 2 | Ready | used to complete the websocket handshake |
| 3 | Heartbeat | used to keep the websocket connection alive |
| 4 | Session Description | used to describe the session |
| 5 | Speaking | used to indicate which users are speaking |

## Connecting to Voice

### Retrieving Voice Server Information

The first step in connecting to a voice server (and in turn, a guilds voice channel) is formulating a request that can be sent to the [Gateway](#DOCS_GATEWAY/gateways), which will return information about the voice server we will connect to. Because Discord's voice platform is widely distributed, users **should never** cache or save the results of this call. To inform the gateway of our intent to establish voice connectivity, we first send a [Voice State Update](#DOCS_GATEWAY/voice-state-update) with a guild_id, channel_id, and our current mute/deaf settings.

###### Example Voice State Update Payload

```json
{
	"guild_id": "41771983423143937",
	"channel_id": "127121515262115840",
	"self_mute": false,
	"self_deaf": false
}
```

If our request succeeded, the gateway will respond with _two_ events (meaning your library must properly wait for both events before continuing), another [Voice State Update](#DOCS_GATEWAY/voice-state-update) payload, and a [Voice Server Update](#DOCS_GATEWAY/voice-server-update) payload. The first will contain a new key, `session_id` and the second will provide voice server information we can use to establish a new voice connection. With this information, we can move on to [Establishing a Voice Websocket Connection](#DOCS_VOICE_CONNECTIONS/establishing-a-voice-websocket-connection).

###### Example Response Voice State Update Payload

```json
{
	"user_id": "104694319306248192",
	"session_id": "..."
}
```

###### Example Voice Server Update Payload

```json
{
	"token": "...",
	"guild_id": "41771983423143937",
	"endpoint": "smart.loyal.discord.gg"
}
```

### Establishing a Voice Websocket Connection

Once we retrieve a session_id, token, and endpoint information, we can connect and handshake with the voice server over another secure websocket. Unlike the gateway endpoint we receive in a HTTP [get gateway](#DOCS_GATEWAY/get-gateway) request, the endpoint received from our [Voice Server Update](#DOCS_GATEWAY/voice-server-update) payload does not contain a URL protocol, so some libraries may require manually prepending it (`wss://`) before connecting. Once connected to the voice websocket endpoint, we can send a OP0 Identify with our server id, user id, session id, and token.

###### Example Voice Identify Payload

```json
{
	"server_id": "41771983423143937",
	"user_id": "104694319306248192",
	"session_id": "...",
	"token": "..."
}
```

The voice server should respond with an OP2 Ready payload, which informs us of our `ssrc`, the UDP port, encryption modes supported and heartbeat_interval the voice server expects. Using this information, we can finally move on to [Establishing a Voice UDP Connection](#DOCS_VOICE_CONNECTIONS/establishing-a-voice-udp-connection).

###### Example Voice Ready Payload

```json
{
	"ssrc": 1,
	"port": 1234,
	"modes": ["plan", "xsalsa20_poly1305"],
	"heartbeat_interval": 1
}
```

### Establishing a Voice UDP Connection

Once we receive the properties of a UDP voice server from our OP2 ready payload, we can proceed to the final step of voice connections, which entails establishing and handshaking a UDP connection for voice data. First, we open a UDP connection to the same endpoint we originally received in the [Voice Server Update](#DOCS_GATEWAY/voice-server-update) payload, combined with the port we received in the Voice Ready payload. If required, we can now perform an [IP Discovery](#DOCS_VOICE_CONNECTIONS/ip-discovery) using this connection.

#### IP Discovery