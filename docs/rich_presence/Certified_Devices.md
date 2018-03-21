# Certified Devices

Baked into Discord's Rich Presence functionality is the ability for hardware manufacturers to tell us a little more about the certified devices that are plugged into a user's computer. Unfortunately, no, you can't show that a user's PUBG Chicken Dinner was all thanks to the amazing TotallyRealHardware RGB Mouse and Keyboard Set Extraordinaire™, but you _can_ give them an amazing experience using your hardware with Discord!

## How's it work?

I'm glad you asked!

1. [Create an application](https://discordapp.com/developers/applications/me) for your hardware vendor—save the Client ID!
2. Talk to Discord via one simple HTTP call (or RPC, if you're already whitelisted for it)
3. Send us a [`SET_CERTIFIED_DEVICES`](#DOCS_TOPICS_RPC/set-certified-devices) RPC command—or via HTTP with matching JSON—whenever the state of the device changes

Yup, that's it. You give us the real-time info about any connected devices, and we'll handle the rest to make sure that anyone using your device will have an awesome experience. Your device will also have a `CERTIFIED` badge in Discord's audio settings, and really, who doesn't love badges?

![](certified-device.png)

## HTTP

Discord listens for request on `http://127.0.0.1:PORT/rpc?v=1&client_id=YOUR_CLIENT_ID`, where `PORT` is a range of ports from `6463` to `6473`. You should iterate over these ports with your request until one returns a success response code. Keep track of that successful port number for the rest of the session.

###### Querystring Parameters

| Name      | Value                | Required |
| --------- | -------------------- | -------- |
| v         | 1                    | yes      |
| client_id | your app's client id | yes      |

To keep your hardware in sync with Discord, POST to this endpoint any time the hardware mute is toggled, or one of the voice features like echo cancellation is enabled or disabled by the user. This lets Discord get out of the way of your optimization when you're in control, or help out when you're not, ensuring an awesome experience for anyone using your hardware.

###### HTTP Request Example

```
curl -X POST -H 'Content-Type: application/json' -d '
{
  "nonce": "9b4e9711-97f3-4f35-b047-32c82a51978e",
  "cmd": "SET_CERTIFIED_DEVICES",
  "args": {
    "devices": [
      {
        "type": "audioinput",
        "id": "aafc2003-da0e-42a3-b982-6a17a2812510",
        "vendor": {
          "name": "SteelSeries",
          "url": "https://steelseries.com"
        },
        "model": {
          "name": "Arctis 7",
          "url": "https://steelseries.com/gaming-headsets/arctis-7"
        },
        "related": ["aafc2003-da0e-42a3-b982-6a17a2819999"],
        "echo_cancellation": true,
        "noise_suppression": true,
        "automatic_gain_control": true,
        "hardware_mute": false
      }
    ]
  }
}
' http://127.0.0.1:PORT/rpc?v=1&client_id=YOUR_CLIENT_ID
```

## RPC

If you are already whitelisted for Discord's RPC capabilities, you can easily keep your hardware up to date by sending `SET_CERTIFIED_DEVICES` commands over the socket whenever yuor device state changes.

###### RPC Command Example

```json
{
  "nonce": "9b4e9711-97f3-4f35-b047-32c82a51978e",
  "cmd": "SET_CERTIFIED_DEVICES",
  "args": {
    "devices": [
      {
        "type": "audioinput",
        "id": "aafc2003-da0e-42a3-b982-6a17a2812510",
        "vendor": {
          "name": "SteelSeries",
          "url": "https://steelseries.com"
        },
        "model": {
          "name": "Arctis 7",
          "url": "https://steelseries.com/gaming-headsets/arctis-7"
        },
        "related": ["aafc2003-da0e-42a3-b982-6a17a2819999"],
        "echo_cancellation": true,
        "noise_suppression": true,
        "automatic_gain_control": true,
        "hardware_mute": false
      }
    ]
  }
}
```

###### RPC Response Example

```json
{
  "nonce": "9b4e9711-97f3-4f35-b047-32c82a51978e",
  "cmd": "SET_CERTIFIED_DEVICES",
  "data": null,
  "evt": null
}
```

## Models

## Device Object

| Field                    | Type                                                                 | Description                                              |
| ------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------- |
| type                     | [device type](#DOCS_RICH_PRESENCE_CERTIFIED_DEVICES/device-type)     | the type of device                                       |
| id                       | string                                                               | the device's Windows UUID                                |
| vendor                   | [vendor](#DOCS_RICH_PRESENCE_CERTIFIED_DEVICES/vendor-object) object | the hardware vendor                                      |
| model                    | [model](#DOCS_RICH_PRESENCE_CERTIFIED_DEVICES/model-object) object   | the model of the product                                 |
| related                  | array of strings                                                     | UUIDs of related products                                |
| echo_cancellation?*      | bool                                                                 | if the device's native echo cancellation is enabled      |
| noise_suppression?*      | bool                                                                 | if the device's native noise suppression is enabled      |
| automatic_gain_control?* | bool                                                                 | if the device's native automatic gain control is enabled |
| hardware_mute?*          | bool                                                                 | if the device is hardware muted                          |

*These fields are only applicable for `AUDIO_INPUT` device types

### Vendor Object

| Field | Type   | Description        |
| ----- | ------ | ------------------ |
| name  | string | name of the vendor |
| url   | string | url for the vendor |

### Model Object

| Field | Type   | Description       |
| ----- | ------ | ----------------- |
| name  | string | name of the model |
| url   | string | url for the model |

### Device Types

| Type         | Value         |
| ------------ | ------------- |
| AUDIO_INPUT  | "audioinput"  |
| AUDIO_OUTPUT | "audiooutput" |
| VIDEO_INPUT  | "videoinput"  |

