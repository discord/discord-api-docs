# Voice

Voice connections operate in a similar fashion to the [Gateway](#DOCS_GATEWAY/gateways) connection, however they operate on a different set of payloads, and utilize a separate UDP-based connection for voice data transmission. Because UDP is utilized for both the receiving and transmitting of voice, your client _must_ be able to receive UDP packets, even through a firewall or NAT (see [UDP Hole Punching](https://en.wikipedia.org/wiki/UDP_hole_punching) for more information). The Discord Voice servers implement functionality (see [IP Discovery](#DOCS_VOICE_CONNECTIONS/ip-discovery)) for discovering the local machines remote UDP IP/Port, which can assist in some network configurations.

## Voice Events

###### Voice OP Codes

| Code | Name | Description |
|--------|----------|-----------------|
| 0 | Identify | begin a voice websocket connection |
| 1 | Select Protocol | select the voice protocol |
| 2 | Ready | complete the websocket handshake |
| 3 | Heartbeat | keep the websocket connection alive |
| 4 | Session Description | describe the session |
| 5 | Speaking | indicate which users are speaking |
| 6 | Heartbeat ACK | sent immediately following a received client heartbeat |
| 7 | Resume | resume a connection |
| 8 | Heartbeat Interval | the continuous interval in milliseconds after which the client should send a heartbeat |
| 9 | Resumed | acknowledge Resume |
| 13 | Client Disconnect | another client has disconnected |

###### Voice Close Event Codes

| Code | Description | Explanation |
| ---- | ----------- | ----------- |
| 4004 | authentication failed | the token sent in the identify payload is incorrect |
| 4006 | invalid session | the session with which you attempted to resume is invalid |
| 4011 | server not found | the server you attempted to connect to was not found |
| 4015 | server crash | the server you were connected to has crashed |
| 4800 | heartbeat timeout | you did not hearbeat in time |
| 4801 | unresumable | we were unable to resume your connection |

### Voice Data Packet

The voice data packet is a payload with an [encrypted voice packet header](#DOCS_VOICE_CONNECTIONS/encrypted-voice-packet-header-structure). The rest of the bytes in the payload are encrypted Opus audio data.

## Connecting to Voice

### Retrieving Voice Server Information

The first step in connecting to a voice server (and in turn, a guild's voice channel) is formulating a request that can be sent to the [Gateway](#DOCS_GATEWAY/gateways), which will return information about the voice server we will connect to. Because Discord's voice platform is widely distributed, users **should never** cache or save the results of this call. To inform the gateway of our intent to establish voice connectivity, we first send an [OP 4 Gateway Voice State Update](#DOCS_GATEWAY/gateway-voice-state-update).

###### Gateway Voice State Update Example

```json
{
	"guild_id": "41771983423143937",
	"channel_id": "127121515262115840",
	"self_mute": false,
	"self_deaf": false
}
```

If our request succeeded, the gateway will respond with _two_ events (meaning your library must properly wait for both events before continuing): a [Voice State Update](#DOCS_GATEWAY/voice-state-update) _event_ (not a payload), and a [Voice Server Update](#DOCS_GATEWAY/voice-server-update) event. The first will contain a new key, `session_id` and the second will provide voice server information we can use to establish a new voice connection.

###### Example Voice Server Update Payload

```json
{
	"token": "my_token",
	"guild_id": "41771983423143937",
	"endpoint": "smart.loyal.discord.gg"
}
```

With this information, we can move on to [Establishing a Voice Websocket Connection](#DOCS_VOICE_CONNECTIONS/establishing-a-voice-websocket-connection).

### Establishing a Voice Websocket Connection

Once we retrieve a session\_id, token, and endpoint information, we can connect and handshake with the voice server over another secure websocket. Unlike the gateway endpoint we receive in a HTTP [Get Gateway](#DOCS_GATEWAY/get-gateway) request, the endpoint received from our [Voice Server Update](#DOCS_GATEWAY/voice-server-update) payload does not contain a URL protocol, so some libraries may require manually prepending it with "wss://" before connecting. Once connected to the voice websocket endpoint, we can send an [OP 0 Identify](#DOCS_VOICE_CONNECTIONS/voice-events-voice-op-codes) payload with our server\_id, user\_id, session\_id, and token.

###### Example Voice Identify Payload

```json
{
	"op": 0,
	"d": {
		"server_id": "41771983423143937",
		"user_id": "104694319306248192",
		"session_id": "my_session_id",
		"token": "my_token"
	}
}
```

The voice server should respond with an [OP 2 Ready](#DOCS_VOICE_CONNECTIONS/voice-events-voice-op-codes) payload, which informs us of the `ssrc`, UDP port, supported encryption modes, and heartbeat_interval the voice server expects. Using this information, we can finally move on to [Establishing a Voice UDP Connection](#DOCS_VOICE_CONNECTIONS/establishing-a-voice-udp-connection).

###### Example Voice Ready Payload

```json
{
	"op": 2,
	"d": {
		"ssrc": 1,
		"port": 1234,
		"modes": ["plain", "xsalsa20_poly1305"],
		"heartbeat_interval": 1
	}
}
```

### Establishing a Voice UDP Connection

Once we receive the properties of a UDP voice server from our [OP 2 Ready](#DOCS_VOICE_CONNECTIONS/voice-events-voice-op-codes) payload, we can proceed to the final step of voice connections, which entails establishing and handshaking a UDP connection for voice data. First, we open a UDP connection to the same endpoint we originally received in the [Voice Server Update](#DOCS_GATEWAY/voice-server-update) payload, combined with the port we received in the Voice Ready payload. If required, we can now perform an [IP Discovery](#DOCS_VOICE_CONNECTIONS/ip-discovery) using this connection. Once we've fully discovered our external IP and UDP port, we can then tell the voice websocket what it is, and start receiving/sending data. We do this using the Select Protocol Payload.

>warn
> The plain mode is deprecated and will be removed soon. All data should be sent using a supported encryption method—right now only `xsalsa20_poly1305`.

###### Example Select Protocol Payload

```json
{
	"op": 1,
	"d": {
		"protocol": "udp",
		"data": {
			"address": "127.0.0.1",
			"port": 1337,
			"mode": "xsalsa20_poly1305"
		}
	}
}
```

Finally, the voice server will respond with a [OP 4 Session Description](#DOCS_VOICE_CONNECTIONS/voice-events-voice-op-codes). We can now start encrypting and sending voice data over the previously established UDP connection.

## Resuming Voice Connection

When your client detects that its connection has been severed, it should completely close the connection and open a new one following the same flow from [Connecting](#DOCS_VOICE_CONNECTIONS/connecting-to-voice). Once the new connection has been opened, your client should send an [OP 7 Resume](#DOCS_VOICE_CONNECTIONS/voice-events-voice-op-codes) payload:

###### Example Resume Connection Payload

```json
{
	"op": 7,
	"d": {
		"server_id": "41771983423143937",
		"session_id": "my_session_id",
		"token": "my_token"
	}
}
```

If successful, the Voice server will respond with an [OP 9 Resumed](#DOCS_VOICE_CONNECTIONS/voice-events-voice-op-codes) event to signal that your client is now reconnected:

###### Example Resumed Payload

```json
{
	"op": 9,
	"d": null
}
```

If the resume is unsucessful—for example, due to an invalid session—the websocket connection will close with a [4006 Invalid Session or 4801 Unresumable](#DOCS_VOICE_CONNECTIONS/voice-events-voice-close-event-codes) error. You should then follow [Connecting](#DOCS_VOICE_CONNECTS/connecting-to-voice).

#### IP Discovery

Generally routers on the internet mask or obfuscate UDP ports through a process called NAT. Most users who implement voice will want to utilize IP discovery to find their external IP and port which will then be used for receiving voice communications. To retrieve your external IP and port, send a 70-byte packet with empty data past the 4-byte ssrc. The server will respond back with another 70-byte packet, this time with a NULL-terminated string of the IP, with the port encoded in a **little endian** unsigned short stored in the last two bytes of the packet.


## Encrypting and Sending Voice

Voice data sent to discord should be encoded with [Opus](https://www.opus-codec.org/), using two channels (stereo) and a sample rate of 48Khz. Voice Data is sent using a [RTP Header](http://www.rfcreader.com/#rfc3550_line548), followed by encrypted Opus audio data. Voice encryption uses the key passed in session description, combined with the 24 byte header (used as a nonce, appended with 12 null bytes), encrypted with [libsodium](https://download.libsodium.org/doc/).

###### Encrypted Voice Packet Header Structure

| Field | Type | Size |
|--------|--------|--------|
| Type | Single byte value of `0x80` | 1 byte |
| Version | Single byte value of `0x78` | 1 byte |
| Sequence | unsigned short (big endian) | 2 bytes |
| Timestamp | unsigned int (big endian) | 4 bytes |
| SSRC | unsigned int (big endian) | 4 bytes |

### Speaking

To notify clients that you are speaking or have stopped speaking, send an [OP 5 Speaking](#DOCS_VOICE_CONNECTIONS/voice-events-voice-op-codes) payload.

###### Example Speaking Payload

```json
{
	"speaking": true,
	"delay": 0
}
```

### Voice Data Interpolation

When there's a break in the sent data, the packet transmission shouldn't simply cut off but rather send five frames of silence (`0xF8, 0xFF, 0xFE`) before stopping to avoid unintended Opus interpolation with following transmissions.
