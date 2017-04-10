# Voice

Voice connections operate in a similar fashion to the [Gateway](#DOCS_GATEWAY/gateways) connection, however they operate on a different set of payloads, and utilize a separate UDP-based connection for voice data transmission. Because UDP is utilized for both the receiving and transmitting of voice, your client _must_ be able to receive UDP packets, even through a firewall or NAT (see [UDP Hole Punching](https://en.wikipedia.org/wiki/UDP_hole_punching) for more information). The Discord Voice servers implement functionality (see [IP Discovery](#DOCS_VOICE_CONNECTIONS/ip-discovery)) for discovering the local machines remote UDP IP/Port, which can assist in some network configurations.

## Voice OP Codes/Payloads

###### Voice Events

###### Voice WebSocket Server Payload Structure

| Field | Type | Description | Present |
|-------|------|-------------|---------|
| op | integer | opcode for the payload | Always |
| d | mixed (object or null) | event data | Usually |

###### Voice WebSocket Server OP Codes

| Code | Name | d | Description |
|------|------|---|-------------|
| 0 | Identify | object | used to begin a voice websocket connection |
| 1 | Select Protocol | object | used to select the voice protocol |
| 2 | Ready | object | used to complete the websocket handshake |
| 3 | Heartbeat | null | used to keep the websocket connection alive |
| 4 | Session Description | ? | used to describe the session |
| 5 | Speaking | object | used to indicate which users are speaking |
| 6 | Heartbeat ACK | null | sent immediately following a client heartbeat that was received |
| 7 | ? |  | ? |
| 8 | Hello | object | provides heartbeat interval immediately after connecting |

### Voice Identify

The first message you should send.

###### Voice Identify Structure

| Field | Type | Description |
|-------|------|-------------|
| server_id | snowflake | guild id of the voice channel you want to talk on |
| token | string | voice connection token |
| user_id | snowflake | client user id |
| session_id | string | client session id |

###### Voice Identify Example

```json
{
	"server_id": "012345678901234567",
	"token": "0123456789abcdef",
	"user_id": "012345678901234567",
	"session_id": "0123456789abcdef0123456789abcdef"
}
```

### Voice Select Protocol

###### Voice Select Protocol Example

```json
{
	"protocol": "udp",
	"data": {
		"address": "127.0.0.1",
		"port": 1337,
		"mode": "xsalsa20_poly1305"
	}
}
```

### Voice Ready

###### Voice Ready Example

```json
{
	"ssrc": 3,
	"port": 52523,
	"modes": [
		"plain",
		"xsalsa20_poly1305"
	],
	"ip": "8.8.8.8",
	"heartbeat_interval": 5500
}
```

## Connecting to Voice

### Retrieving Voice Server Information

The first step in connecting to a voice server (and in turn, a guilds voice channel) is formulating a request that can be sent to the [Gateway](#DOCS_GATEWAY/gateways), which will return information about the voice server we will connect to. Because Discord's voice platform is widely distributed, users **should never** cache or save the results of this call. To inform the gateway of our intent to establish voice connectivity, we first send a [Voice State Update](#DOCS_GATEWAY/voice-state-update) payload with a guild_id, channel_id, and our current mute/deaf settings.

If our request succeeded, the gateway will respond with _two_ events (meaning your library must properly wait for both events before continuing), a [Voice State Update](#DOCS_GATEWAY/voice-state-update) _event_ (not a payload), and a [Voice Server Update](#DOCS_GATEWAY/voice-server-update) event. The first will contain a new key, `session_id` and the second will provide voice server information we can use to establish a new voice connection. With this information, we can move on to [Establishing a Voice Websocket Connection](#DOCS_VOICE_CONNECTIONS/establishing-a-voice-websocket-connection).

### Establishing a Voice Websocket Connection

Once we retrieve a session_id, token, and endpoint information, we can connect and handshake with the voice server over another secure websocket. Unlike the gateway endpoint we receive in a HTTP [get gateway](#DOCS_GATEWAY/get-gateway) request, the endpoint received from our [Voice Server Update](#DOCS_GATEWAY/voice-server-update) payload does not contain a URL protocol, so some libraries may require manually prepending it (`wss://`) before connecting. Once connected to the voice websocket endpoint, we can send a [OP 0 Identify](#DOCS_VOICE_CONNECTIONS/voice-identify) with our server id, user id, session id, and token.

The voice server should respond with an [OP 2 Ready](#DOCS_VOICE_CONNECTIONS/voice-ready) payload, which informs us of our [`ssrc`](https://tools.ietf.org/html/rfc3550#section-8), the UDP port, encryption modes supported and heartbeat_interval the voice server expects. Using this information, we can finally move on to [Establishing a Voice UDP Connection](#DOCS_VOICE_CONNECTIONS/establishing-a-voice-udp-connection).

### Establishing a Voice UDP Connection

Once we receive the properties of a UDP voice server from our OP2 ready payload, we can proceed to the final step of voice connections, which entails establishing and handshaking a UDP connection for voice data. First, we open a UDP connection to the same endpoint we originally received in the [Voice Server Update](#DOCS_GATEWAY/voice-server-update) payload, combined with the port we received in the Voice Ready payload. If required, we can now perform an [IP Discovery](#DOCS_VOICE_CONNECTIONS/ip-discovery) using this connection. Once we've fully discovered our local IP and UDP port, we can then tell the voice websocket what it is, and start receiving/sending data. We do this using the [OP 1 Select Protocol](#DOCS_VOICE_CONNECTIONS/voice-select-protocol) payload.

>warn
> The plain mode is deprecated and will be removed soon. All data should be sent using a supported encryption method (right now only `xsalsa20_poly1305`).

Finally, the voice server will respond with a OP4 Session Description. We can now start encrypting and sending voice data over the previously established UDP connection.

#### IP Discovery

Generally routers on the internet mask or obfuscate UDP ports through a process called NAT. Most users who implement voice will want to utilize IP discovery to find their local IP and port which will then be used for receiving voice communications. To retrieve your local IP, send a 70-byte packet with empty data past the 4-byte [`ssrc`](https://tools.ietf.org/html/rfc3550#section-8). The server will respond back with another 70-byte packet, this time with a NULL-terminated string of the IP, with the port encoded in a **little endian** unsigned short stored in the last two bytes of the packet.

## Encrypting and Sending Voice

Voice data sent to discord should be encoded with [Opus](https://www.opus-codec.org/), using 2 channels (stereo) and a sample rate of 48Khz. Voice Data is sent using a [RTP Header](http://www.rfcreader.com/#rfc3550_line548), followed by encrypted Opus audio data. Voice encryption uses the key passed in session description, combined with the 24 byte header (used as a nonce, appended with 12 null bytes), encrypted with [libsodium](https://download.libsodium.org/doc/).

###### Encrypted Voice Packet Header Structure

| Field | Type | Size |
|--------|--------|--------|
| Type | Single byte value of `0x80` | 1 byte |
| Version | Single byte value of `0x78` | 1 byte |
| Sequence | unsigned short (big endian) | 2 bytes |
| Timestamp | unsigned int (big endian) | 4 bytes |
| SSRC | unsigned int (big endian) | 4 bytes |

### Voice Data Interpolation

When there's a break in the sent data, the packet transmission shouldn't simply cut off but rather send five frames of silence (`0xF8, 0xFF, 0xFE`) before stopping to avoid unintended Opus interpolation with following transmissions.
