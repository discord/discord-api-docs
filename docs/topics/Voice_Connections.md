# Voice

Voice connections operate in a similar fashion to the [Gateway](#DOCS_TOPICS_GATEWAY/gateways) connection. However, they use a different set of payloads and a separate UDP-based connection for voice data transmission. Because UDP is used for both receiving and transmitting voice data, your client _must_ be able to receive UDP packets, even through a firewall or NAT (see [UDP Hole Punching](https://en.wikipedia.org/wiki/UDP_hole_punching) for more information). The Discord Voice servers implement functionality (see [IP Discovery](#DOCS_RESOURCES_VOICE_CONNECTIONS/ip-discovery)) for discovering the local machines remote UDP IP/Port, which can assist in some network configurations.

## Voice Gateway Versioning

To ensure that you have the most up-to-date information, please use [version 3](#DOCS_RESOURCES_VOICE_CONNECTIONS/voice-gateway-versioning-gateway-versions). Otherwise, we cannot guarantee that the [Opcodes](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) documented here will reflect what you receive over the socket.

###### Gateway Versions

| Version | Status | WebSocket URL Append |
| ------- | ------ | -------------------- |
| 3 | recommended | ?v=3 |
| 2 | available | ?v=2 |
| 1 | default | ?v=1 or omit |

## Connecting to Voice

### Retrieving Voice Server Information

The first step in connecting to a voice server (and in turn, a guild's voice channel) is formulating a request that can be sent to the [Gateway](#DOCS_TOPICS_GATEWAY/gateways), which will return information about the voice server we will connect to. Because Discord's voice platform is widely distributed, users **should never** cache or save the results of this call. To inform the gateway of our intent to establish voice connectivity, we first send an [Opcode 4 Gateway Voice State Update](#DOCS_TOPICS_GATEWAY/gateway-voice-state-update):

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

If our request succeeded, the gateway will respond with _two_ events—a [Voice State Update](#DOCS_TOPICS_GATEWAY/voice-state-update) event and a [Voice Server Update](#DOCS_TOPICS_GATEWAY/voice-server-update) event—meaning your library must properly wait for both events before continuing. The first will contain a new key, `session_id`, and the second will provide voice server information we can use to establish a new voice connection:

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

Once we retrieve a session\_id, token, and endpoint information, we can connect and handshake with the voice server over another secure websocket. Unlike the gateway endpoint we receive in an HTTP [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) request, the endpoint received from our [Voice Server Update](#DOCS_TOPICS_GATEWAY/voice-server-update) payload does not contain a URL protocol, so some libraries may require manually prepending it with "wss://" before connecting. Once connected to the voice websocket endpoint, we can send an [Opcode 0 Identify](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) payload with our server\_id, user\_id, session\_id, and token:

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

The voice server should respond with an [Opcode 2 Ready](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) payload, which informs us of the `ssrc`, UDP IP/port, and supported encryption modes the voice server expects:

###### Example Voice Ready Payload

```json
{
	"op": 2,
	"d": {
		"ssrc": 1,
		"ip": "127.0.0.1",
		"port": 1234,
		"modes": ["plain", "xsalsa20_poly1305"],
		"heartbeat_interval": 1
	}
}
```

>danger
>`heartbeat_interval` here is an erroneous field and should be ignored. The correct heartbeat_interval value comes from the Hello payload.

## Heartbeating

In order to maintain your websocket connection, you need to continuously send heartbeats at the interval determined in [Opcode 8 Hello](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes):

###### Example Hello Payload Below V3

```json
{
	"heartbeat_interval": 41250
}
```

###### Example Hello Payload V3

```json
{
	"op": 8,
	"d": {
		"heartbeat_interval": 41250
	}
}
```

>danger
>There is currently a bug in the Hello payload heartbeat interval. Until it is fixed, please take your heartbeat interval as `heartbeat_interval` * .75. This warning will be removed and a changelog published when the bug is fixed.

This is sent at the start of the connection. Be warned that the [Opcode 8 Hello](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) structure differs by gateway version as shown in the above examples. Versions below v3 do not have an opcode or a data field denoted by `d`. V3 is updated to be structured like other payloads. Be sure to expect this different format based on your version.

After receiving [Opcode 8 Hello](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes), you should send [Opcode 3 Heartbeat](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes)—which contains an integer nonce—every elapsed interval:

###### Example Heartbeat Payload

```json
{
	"op": 3,
	"d": 1501184119561
}
```

In return, you will be sent back an [Opcode 6 Heartbeat ACK](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) that contains the previously sent nonce:

###### Example Heartbeat ACK Payload

```json
{
	"op": 6,
	"d": 1501184119561
}
```

## Establishing a Voice UDP Connection

Once we receive the properties of a UDP voice server from our [Opcode 2 Ready](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) payload, we can proceed to the final step of voice connections, which entails establishing and handshaking a UDP connection for voice data. First, we open a UDP connection to the IP and port provided in the Ready payload. If required, we can now perform an [IP Discovery](#DOCS_RESOURCES_VOICE_CONNECTIONS/ip-discovery) using this connection. Once we've fully discovered our external IP and UDP port, we can then tell the voice websocket what it is, and start receiving/sending data. We do this using [Opcode 1 Select Protocol](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes):

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

Finally, the voice server will respond with a [Opcode 4 Session Description](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) that includes the `mode` and `secret_key`, a 32 byte array used for [encrypting and sending](#DOCS_RESOURCES_VOICE_CONNECTIONS/encrypting-and-sending-voice) voice data:

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

Voice data sent to discord should be encoded with [Opus](https://www.opus-codec.org/), using two channels (stereo) and a sample rate of 48kHz. Voice Data is sent using a [RTP Header](http://www.rfcreader.com/#rfc3550_line548), followed by encrypted Opus audio data. Voice encryption uses the key passed in [Opcode 4 Session Description](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) combined with the 24 byte header (used as a nonce, appended with 12 null bytes), encrypted with [libsodium](https://download.libsodium.org/doc/):

###### Encrypted Voice Packet Header Structure

| Field | Type | Size |
|--------|--------|--------|
| Type | Single byte value of `0x80` | 1 byte |
| Version | Single byte value of `0x78` | 1 byte |
| Sequence | unsigned short (big endian) | 2 bytes |
| Timestamp | unsigned int (big endian) | 4 bytes |
| SSRC | unsigned int (big endian) | 4 bytes |

## Speaking

To notify clients that you are speaking or have stopped speaking, send an [Opcode 5 Speaking](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) payload:

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
>You must send at least one [Opcode 5 Speaking](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) payload before sending voice data, or you will be disconnected with an invalid SSRC error.

### Voice Data Interpolation

When there's a break in the sent data, the packet transmission shouldn't simply stop. Instead, send five frames of silence (`0xF8, 0xFF, 0xFE`) before stopping to avoid unintended Opus interpolation with subsequent transmissions.

## Resuming Voice Connection

When your client detects that its connection has been severed, it should open a new websocket connection. Once the new connection has been opened, your client should send an [Opcode 7 Resume](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) payload:

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

If successful, the Voice server will respond with an [Opcode 9 Resumed](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) and an [Opcode 8 Hello](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-opcodes) to signal that your client is now reconnected:

###### Example Resumed Payload

```json
{
	"op": 9,
	"d": null
}
```

If the resume is unsuccessful—for example, due to an invalid session—the websocket connection will close with the appropriate [close event code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-close-event-codes). You should then follow the [Connecting](#DOCS_RESOURCES_VOICE_CONNECTS/connecting-to-voice) flow to reconnect.

#### IP Discovery

Generally routers on the internet mask or obfuscate UDP ports through a process called NAT. Most users who implement voice will want to utilize IP discovery to find their external IP and port which will then be used for receiving voice communications. To retrieve your external IP and port, send a 70-byte packet with empty data past the 4-byte ssrc. The server will respond back with another 70-byte packet, this time with a NULL-terminated string of the IP, with the port encoded in a **little endian** unsigned short stored in the last two bytes of the packet.
