# Voice

Voice connections operate in a similar fashion to the [Gateway](#DOCS_GATEWAY/gateways) connection. However, they use a different set of payloads and a separate UDP-based connection for voice data transmission. Because UDP is used for both receiving and transmitting voice data, your client _must_ be able to receive UDP packets, even through a firewall or NAT (see [UDP Hole Punching](https://en.wikipedia.org/wiki/UDP_hole_punching) for more information). The Discord Voice servers implement functionality (see [IP Discovery](#DOCS_VOICE_CONNECTIONS/ip-discovery)) for discovering the local machines remote UDP IP/Port, which can assist in some network configurations.

## Voice Gateway Versioning

To ensure that you have the most up-to-date information, please use [version 3](#DOCS_VOICE_CONNECTIONS/voice-gateway-versioning-gateway-versions). Otherwise, we cannot guarantee that the [Opcodes](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) documented here will reflect what you receive over the socket.

###### Gateway Versions

| Version | Status | WebSocket URL Append |
| ------- | ------ | -------------------- |
| 3 | recommended | ?v=3 |
| 2 | available | ?v=2 |
| 1 | default | ?v=1 or omit |

## Voice Events

###### Voice Opcodes

| Code | Name | Sent By | Description |
| ---- | ---- | ------- | ----------- |
| 0 | Identify | client | begin a voice websocket connection |
| 1 | Select Protocol | client | select the voice protocol |
| 2 | Ready | server | complete the websocket handshake |
| 3 | Heartbeat | client | keep the websocket connection alive |
| 4 | Session Description | server | describe the session |
| 5 | Speaking | client and server | indicate which users are speaking |
| 6 | Heartbeat ACK | server | sent immediately following a received client heartbeat |
| 7 | Resume | client | resume a connection |
| 8 | Hello | server | the continuous interval in milliseconds after which the client should send a heartbeat |
| 9 | Resumed | server | acknowledge Resume |
| 13 | Client Disconnect | server | a client has disconnected from the voice channel |

###### Voice Close Event Codes

| Code | Description | Explanation |
| ---- | ----------- | ----------- |
| 4001 | Unknown opcode | You sent an invalid [opcode](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes). |
| 4003 | Not authenticated | You sent a payload before [identifying](#DOCS_GATEWAY/gateway-identify) with the Gateway. |
| 4004 | Authentication failed | The token you sent in your [identify](#DOCS_GATEWAY/gateway-identify) payload is incorrect. |
| 4005 | Already authenticated | You sent more than one [identify](#DOCS_GATEWAY/gateway-identify) payload. Stahp. |
| 4006 | Session no longer valid | Your session is no longer valid. |
| 4009 | Session timeout | Your session has timed out. |
| 4011 | Server not found | We can't find the server you're trying to connect to. |
| 4012 | Unknown Protocol | We didn't recognize the [protocol](#DOCS_VOICE_CONNECTIONS/establishing-a-voice-udp-connection-example-select-protocol-payload) you sent. |
| 4014 | Disconnected | Oh no! You've been disconnected! Try [resuming](#DOCS_VOICE_CONNECTIONS/resuming-voice-connection). |
| 4015 | Voice server crashed | The server crashed. Our bad! Try [resuming](#DOCS_VOICE_CONNECTIONS/resuming-voice-connection). |
| 4016 | Unknown Encryption Mode | We didn't recognize your [encryption](#DOCS_VOICE_CONNECTIONS/encrypting-and-sending-voice). |

## Connecting to Voice

### Retrieving Voice Server Information

The first step in connecting to a voice server (and in turn, a guild's voice channel) is formulating a request that can be sent to the [Gateway](#DOCS_GATEWAY/gateways), which will return information about the voice server we will connect to. Because Discord's voice platform is widely distributed, users **should never** cache or save the results of this call. To inform the gateway of our intent to establish voice connectivity, we first send an [Opcode 4 Gateway Voice State Update](#DOCS_GATEWAY/gateway-voice-state-update):

###### Gateway Voice State Update Example

```json
{
	"op": 4,
	"d": {
		"guild_id": "41771983423143937",
		"channel_id": "127121515262115840",
		"self_mute": false,
		"self_deaf": false
	}
}
```

If our request succeeded, the gateway will respond with _two_ events—a [Voice State Update](#DOCS_GATEWAY/voice-state-update) event and a [Voice Server Update](#DOCS_GATEWAY/voice-server-update) event—meaning your library must properly wait for both events before continuing. The first will contain a new key, `session_id`, and the second will provide voice server information we can use to establish a new voice connection:

###### Example Voice Server Update Payload

```json
{
	"t": "VOICE_SERVER_UPDATE",
	"s": 2,
	"op": 0,
	"d": {
		"token": "my_token",
		"guild_id": "41771983423143937",
		"endpoint": "smart.loyal.discord.gg"
	}
}
```

With this information, we can move on to establishing a voice websocket connection.

## Establishing a Voice Websocket Connection

Once we retrieve a session\_id, token, and endpoint information, we can connect and handshake with the voice server over another secure websocket. Unlike the gateway endpoint we receive in an HTTP [Get Gateway](#DOCS_GATEWAY/get-gateway) request, the endpoint received from our [Voice Server Update](#DOCS_GATEWAY/voice-server-update) payload does not contain a URL protocol, so some libraries may require manually prepending it with "wss://" before connecting. Once connected to the voice websocket endpoint, we can send an [Opcode 0 Identify](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) payload with our server\_id, user\_id, session\_id, and token:

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

The voice server should respond with an [Opcode 2 Ready](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) payload, which informs us of the `ssrc`, UDP port, and supported encryption modes the voice server expects:

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

>danger
>`heartbeat_interval` here is an erroneous field and should be ignored. The correct heartbeat_interval value comes from the Hello payload.

## Heartbeating

In order to maintain your websocket connection, you need to continuously send heartbeats at the interval determined in [Opcode 8 Hello](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes):

###### Example Hello Payload

```json
{
	"heartbeat_interval": 41250
}
```

>danger
>There is currently a bug in the Hello payload heartbeat interval. Until it is fixed, please take your heartbeat interval as `heartbeat_interval` * .75. This warning will be removed and a changelog published when the bug is fixed.

This is sent at the start of the connection. Unlike the other payloads, [Opcode 8 Hello](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) does not have an opcode or a data field denoted by `d`. Be sure to expect this different format. After this, you should send [Opcode 3 Heartbeat](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes)—which contains an integer nonce—every elapsed interval:

###### Example Heartbeat Payload

```json
{
	"op": 3,
	"d": 1501184119561
}
```

In return, you will be sent back an [Opcode 6 Heartbeat ACK](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) that contains the previously sent nonce:

###### Example Heartbeat ACK Payload

```json
{
	"op": 6,
	"d": 1501184119561
}
```

## Establishing a Voice UDP Connection

Once we receive the properties of a UDP voice server from our [Opcode 2 Ready](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) payload, we can proceed to the final step of voice connections, which entails establishing and handshaking a UDP connection for voice data. First, we open a UDP connection to the same endpoint we originally received in the [Voice Server Update](#DOCS_GATEWAY/voice-server-update) payload, combined with the port we received in the Voice Ready payload. If required, we can now perform an [IP Discovery](#DOCS_VOICE_CONNECTIONS/ip-discovery) using this connection. Once we've fully discovered our external IP and UDP port, we can then tell the voice websocket what it is, and start receiving/sending data. We do this using [Opcode 1 Select Protocol](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes):

>warn
>The plain mode is no longer supported. All data should be sent using a supported encryption method, right now only `xsalsa20_poly1305`.

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

Finally, the voice server will respond with a [Opcode 4 Session Description](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) that includes the `mode` and `secret_key`, a 32 byte array used for [encrypting and sending](#DOCS_VOICE_CONNECTIONS/encrypting-and-sending-voice) voice data:

###### Example Session Description Payload

```json
{
	"op": 4,
	"d": {
		"mode": "xsalsa20_poly1305",
		"secret_key": [ ...251, 100, 11...]
	}
}
```

 We can now start encrypting and sending voice data over the previously established UDP connection.

## Encrypting and Sending Voice

Voice data sent to discord should be encoded with [Opus](https://www.opus-codec.org/), using two channels (stereo) and a sample rate of 48kHz. Voice Data is sent using a [RTP Header](http://www.rfcreader.com/#rfc3550_line548), followed by encrypted Opus audio data. Voice encryption uses the key passed in [Opcode 4 Session Description](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) combined with the 24 byte header (used as a nonce, appended with 12 null bytes), encrypted with [libsodium](https://download.libsodium.org/doc/):

###### Encrypted Voice Packet Header Structure

| Field | Type | Size |
|--------|--------|--------|
| Type | Single byte value of `0x80` | 1 byte |
| Version | Single byte value of `0x78` | 1 byte |
| Sequence | unsigned short (big endian) | 2 bytes |
| Timestamp | unsigned int (big endian) | 4 bytes |
| SSRC | unsigned int (big endian) | 4 bytes |

### Speaking

To notify clients that you are speaking or have stopped speaking, send an [Opcode 5 Speaking](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) payload:

###### Example Speaking Payload

```json
{
	"op": 5,
	"d": {
		"speaking": true,
		"delay": 0,
		"ssrc": 1
	}
}
```

>warn
>You must send at least one [Opcode 5 Speaking](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) payload before sending voice data, or you will be disconnected with an invalid SSRC error.

### Voice Data Interpolation

When there's a break in the sent data, the packet transmission shouldn't simply stop. Instead, send five frames of silence (`0xF8, 0xFF, 0xFE`) before stopping to avoid unintended Opus interpolation with subsequent transmissions.

## Resuming Voice Connection

When your client detects that its connection has been severed, it should open a new websocket connection. Once the new connection has been opened, your client should send an [Opcode 7 Resume](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) payload:

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

If successful, the Voice server will respond with an [Opcode 9 Resumed](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) and an [Opcode 8 Hello](#DOCS_VOICE_CONNECTIONS/voice-events-voice-opcodes) to signal that your client is now reconnected:

###### Example Resumed Payload

```json
{
	"op": 9,
	"d": null
}
```

If the resume is unsuccessful—for example, due to an invalid session—the websocket connection will close with the appropriate [close event code](#DOCS_VOICE_CONNECTIONS/voice-events-voice-close-event-codes). You should then follow the [Connecting](#DOCS_VOICE_CONNECTS/connecting-to-voice) flow to reconnect.

#### IP Discovery

Generally routers on the internet mask or obfuscate UDP ports through a process called NAT. Most users who implement voice will want to utilize IP discovery to find their external IP and port which will then be used for receiving voice communications. To retrieve your external IP and port, send a 70-byte packet with empty data past the 4-byte ssrc. The server will respond back with another 70-byte packet, this time with a NULL-terminated string of the IP, with the port encoded in a **little endian** unsigned short stored in the last two bytes of the packet.
