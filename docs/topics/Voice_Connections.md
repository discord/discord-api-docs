# Voice

Voice connections operate in a similar fashion to the [Gateway](#DOCS_TOPICS_GATEWAY/gateways) connection. However, they use a different set of payloads and a separate UDP-based connection for voice data transmission. Because UDP is used for both receiving and transmitting voice data, your client _must_ be able to receive UDP packets, even through a firewall or NAT (see [UDP Hole Punching](https://en.wikipedia.org/wiki/UDP_hole_punching) for more information). The Discord Voice servers implement a functionality (see [IP Discovery](#DOCS_TOPICS_VOICE_CONNECTIONS/ip-discovery)) for discovering the local machines remote UDP IP/Port, which can assist in some network configurations.

## Voice Gateway Versioning

To ensure that you have the most up-to-date information, please use [version 4](#DOCS_TOPICS_VOICE_CONNECTIONS/voice-gateway-versioning-gateway-versions). Otherwise, we cannot guarantee that the [Opcodes](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) documented here will reflect what you receive over the socket.

###### Gateway Versions

| Version | Status      | WebSocket URL Append |
| ------- | ----------- | -------------------- |
| 4       | recommended | ?v=4                 |
| 3       | available   | ?v=3                 |
| 2       | available   | ?v=2                 |
| 1       | default     | ?v=1 or omit         |

## Connecting to Voice

### Retrieving Voice Server Information

The first step in connecting to a voice server (and in turn, a guild's voice channel) is formulating a request that can be sent to the [Gateway](#DOCS_TOPICS_GATEWAY/gateways), which will return information about the voice server we will connect to. Because Discord's voice platform is widely distributed, users **should never** cache or save the results of this call. To inform the Gateway of our intent to establish voice connectivity, we first send an [Opcode 4 Gateway Voice State Update](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/gateway):

###### Gateway Voice State Update Example

"`json
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

If our request succeeded, the Gateway would respond with _two_ events—a [Voice State Update](#DOCS_TOPICS_GATEWAY/voice-state-update) event and a [Voice Server Update](#DOCS_TOPICS_GATEWAY/voice-server-update) event—meaning your library must properly wait for both events before continuing. The first will contain a new key, `session_id`, and the second will provide voice server information we can use to establish a new voice connection:

###### Example Voice Server Update Payload

"`json
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

With this information, we can move on to establishing a voice WebSocket connection.

> info
> Bot users respect the voice channel's user limit if set. When the voice channel is full, you will not receive
> the Voice State Update or Voice Server Update events in response to your own Voice State Update. Having `MANAGE_CHANNELS`
> permission bypasses this limit and allows you to join regardless of the channel being full or not.

## Establishing a Voice Websocket Connection

Once we retrieve a session_id, token, and endpoint information, we can connect and handshake with the voice server over another secure WebSocket. Unlike the gateway endpoint we receive in an HTTP [Get Gateway](#DOCS_TOPICS_GATEWAY/get-gateway) request, the endpoint received from our [Voice Server Update](#DOCS_TOPICS_GATEWAY/voice-server-update) payload does not contain a URL protocol, so some libraries may require manually prepending it with "wss://" before connecting. Once connected to the voice WebSocket endpoint, we can send an [Opcode 0 Identify](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) payload with our server_id, user_id, session_id, and token:

###### Example Voice Identify Payload

"`json
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

The voice server should respond with an [Opcode 2 Ready](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) payload, which informs us of the `SSRC`, UDP IP/port, and supported encryption modes the voice server expects:

###### Example Voice Ready Payload

"`json
{
    "op": 2,
    "d": {
        "ssrc": 1,
        "ip": "127.0.0.1",
        "port": 1234,
        "modes": ["xsalsa20_poly1305", "xsalsa20_poly1305_suffix", "xsalsa20_poly1305_lite"],
        "heartbeat_interval": 1
    }
}
```

> danger
> `heartbeat_interval` here is an erroneous field and should be ignored. The correct `heartbeat_interval` value comes from the Hello payload.

## Heartbeating

In order to maintain your WebSocket connection, you need to continuously send heartbeats at the interval determined in [Opcode 8 Hello](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice):

###### Example Hello Payload below V3

"`json
{
  "heartbeat_interval": 41250
}
```

###### Example Hello Payload since V3

"`json
{
  "op": 8,
  "d": {
    "heartbeat_interval": 41250
  }
}
```

This is sent at the start of the connection. Be warned that the [Opcode 8 Hello](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) structure differs by gateway version as shown in the above examples. Versions below v3 do not have an opcode or a data field denoted by `d'. V3 and above was updated to be structured like other payloads. Be sure to expect this different format based on your version.

After receiving [Opcode 8 Hello](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice), you should send [Opcode 3 Heartbeat](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice)—which contains an integer nonce—every elapsed interval:

###### Example Heartbeat Payload

"`json
{
  "op": 3,
  "d": 1501184119561
}
```

In return, you will be sent back an [Opcode 6 Heartbeat ACK](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) that contains the previously sent nonce:

###### Example Heartbeat ACK Payload

"`json
{
  "op": 6,
  "d": 1501184119561
}
```

## Establishing a Voice UDP Connection

Once we receive the properties of a UDP voice server from our [Opcode 2 Ready](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) payload, we can proceed to the final step of voice connections, which entails establishing and handshaking a UDP connection for voice data. First, we open a UDP connection to the IP and port provided in the Ready payload. If required, we can now perform an [IP Discovery](#DOCS_TOPICS_VOICE_CONNECTIONS/ip-discovery) using this connection. Once we've fully discovered our external IP and UDP port, we can then tell the voice WebSocket what it is and start receiving/sending data. We do this using [Opcode 1 Select Protocol](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice):

###### Example Select Protocol Payload

"`json
{
    "op": 1,
    "d": {
        "protocol": "udp",
        "data": {
            "address": "127.0.0.1",
            "port": 1337,
            "mode": "xsalsa20_poly1305_lite"
        }
    }
}
```

###### Encryption Modes

| Mode   | Key                      | Nonce Bytes                                                            | Generating Nonce                      |
|--------|--------------------------|------------------------------------------------------------------------|---------------------------------------|
| Normal | xsalsa20_poly1305        | The nonce bytes are the RTP header                                     | Copy the RTP header                   |
| Suffix | xsalsa20_poly1305_suffix | The nonce bytes are 24 bytes appended to the payload of the RTP packet | Generate 24 random bytes              |
| Lite   | xsalsa20_poly1305_lite   | The nonce bytes are 4 bytes appended to the payload of the RTP packet  | Incremental 4 bytes (32bit) int value |

>warn
>The nonce has to be stripped from the payload before encrypting and before decrypting the audio data

Finally, the voice server will respond with a [Opcode 4 Session Description](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) that includes the `mode` and `secret_key`, a 32 byte array used for [encrypting and sending](#DOCS_TOPICS_VOICE_CONNECTIONS/encrypting-and-sending-voice) voice data:

###### Example Session Description Payload

"`json
{
    "op": 4,
    "d": {
        "mode": "xsalsa20_poly1305_lite",
        "secret_key": [ ...251, 100, 11...]
    }
}
```

We can now start encrypting and sending voice data over the previously established UDP connection.

## Encrypting and Sending Voice

Voice data sent to discord should be encoded with [Opus](https://www.opus-codec.org/), using two channels (stereo) and a sample rate of 48kHz. Voice Data is sent using a [RTP Header](https://www.rfcreader.com/#rfc3550_line548), followed by encrypted Opus audio data. Voice encryption uses the key passed in [Opcode 4 Session Description](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) and the nonce formed with the 12-byte header appended with 12 null bytes to achieve the 24 required by xsalsa20_poly1305. Discord encrypts with the [libsodium](https://download.libsodium.org/doc/) encryption library.

###### Voice Packet Structure

| Field           | Type                          | Size    |
| --------------- | ----------------------------- | ------- |
| Version + Flags | Single byte value of `0x80`   | 1 byte  |
| Payload Type    | Single byte value of `0x78`   | 1 byte  |
| Sequence        | Unsigned short (big-endian)   | 2 bytes |
| Timestamp       | Unsigned integer (big-endian) | 4 bytes |
| SSRC            | Unsigned integer (big-endian) | 4 bytes |
| Encrypted audio | Binary data                   | n bytes |

## Speaking

To notify clients that you are speaking or have stopped speaking, send an [Opcode 5 Speaking](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) payload:

The following flags can be used as a bitwise mask. For example, `5` would be priority and voice.

| Flag       | Meaning                                                        | Value  |
| ---------- | -------------------------------------------------------------- | ------ |
| Microphone | Normal transmission of voice audio                             | 1 << 0 |
| Soundshare | Transmission of context audio for video, no speaking indicator | 1 << 1 |
| Priority   | Priority speaker, lowering audio of other speakers             | 1 << 2 |

###### Example Speaking Payload

"`json
{
    "op": 5,
    "d": {
        "speaking": 5,
        "delay": 0,
        "ssrc": 1
    }
}
```

> warn
> You must send at least one [Opcode 5 Speaking](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) payload before sending voice data, or you will be disconnected with an invalid SSRC error.

### Voice Data Interpolation

When there's a break in the sent data, the packet transmission shouldn't simply stop. Instead, send five frames of silence (`0xF8, 0xFF, 0xFE`) before stopping to avoid unintended Opus interpolation with subsequent transmissions.

## Resuming Voice Connection

When your client detects that its connection has been severed, it should open a new WebSocket connection. Once the new connection has been opened, your client should send an [Opcode 7 Resume](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) payload:

###### Example Resume Connection Payload

"`json
{
  "op": 7,
  "d": {
    "server_id": "41771983423143937",
    "session_id": "my_session_id",
    "token": "my_token"
  }
}
```

If successful, the Voice server will respond with an [Opcode 9 Resumed](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice) to signal that your client is now resumed:

###### Example Resumed Payload

"`json
{
  "op": 9,
  "d": null
}
```

If the resume is unsuccessful—for example, due to an invalid session—the WebSocket connection will close with the appropriate [close event code](#DOCS_TOPICS_OPCODES_AND_STATUS_CODES/voice-voice-close-event-codes). You should then follow the [Connecting](#DOCS_TOPICS_VOICE_CONNECTIONS/connecting-to-voice) flow to reconnect.

#### IP Discovery

Generally, routers on the Internet mask or obfuscate UDP ports through a process called NAT. Most users who implement voice will want to utilize IP discovery to find their external IP and port, which will then be used for receiving voice communications. To retrieve your external IP and port, send the following UDP packet to your voice port (all numeric are big-endian):

| Field           | Description                                                    | Size     |
| --------------- | -------------------------------------------------------------- | -------- |
| Type            | Values 0x1 and 0x2 indicate request and response, respectively | 2 bytes  |
| Length          | Message length excluding Type and Length fields (value 70)     | 2 bytes  |
| SSRC            | Unsigned integer                                               | 4 bytes  |
| Address         | Null-terminated string in response                             | 64 bytes |
| Port            | Unsigned short                                                 | 2 bytes  |

