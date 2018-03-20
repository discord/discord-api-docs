# Certified Devices

Baked into Disord's Rich Presence is the ability for hardware manufacturers to tell us a little more about the certified devices that are plugged into a user's computer. Unfortunately, no, you can't show that a user's PUBG Chicken Dinner was all thanks to the amazing TotallyRealHardware RGB Mouse and Keyboard Set Extraordinaire™, but you _can_ give them an amazing experience using your hardware with Discord!

## How's it work?

I'm glad you asked!

1. [Create an application](https://discordapp.com/developers/applications/me) for your hardware vendor
2. Talk to Discord via one simple HTTP call (or RPC, if you're already whitelisted for it)
3. Send us a [`SET_CERTIFIED_DEVICES`](#DOCS_TOPICS_RPC/set-certified-devices) RPC command—or via HTTP with matching JSON—whenever the state of the device changes

Yup, that's it. You give us the real-time info about any connected devices, and we'll handle the rest to make sure that anyone using your device will have an awesome experience. Your device will also have a `CERTIFIED` badge in Discord's audio settings, and really, who doesn't love badges?

![](certified-device.png)

## Device Object

| Field | Type | Description |
| ----- | ---- | ----------- |
| type | [device type](#DOCS_RICH_PRESENCE_CERTIFIED_DEVICES/device-type) | the type of device |
| id   | string | your client id |
| vendor | [vendor](#DOCS_RICH_PRESENCE_CERTIFIED_DEVICES/vendor-object) object | the hardware vendor |
| model | [model](#DOCS_RICH_PRESENCE_CERTIFIED_DEVICES/model-object) object | the model of the product |
| related | array of strings | model names of related products |
| echo_cancellation?* | bool | if the device's native echo cancellation is enabled |
| noise_suppression?* | bool | if the device's native noise suppression is enabled |
| automatic_gain_control?* | bool | if the device's native automatic gain control is enabled |
| hardware_mute?* | bool | if the device is hardware muted |

*These fields are only applicable for `AUDIO_INPUT` device types

## Vendor Object

| Field | Type   | Description        |
| ----- | ------ | ------------------ |
| name  | string | name of the vendor |
| url   | string | url for the vendor |

## Model Object

| Field | Type   | Description       |
| ----- | ------ | ----------------- |
| name  | string | name of the model |
| url   | string | url for the model |

## Device Types

| Type         | Value         |
| ------------ | ------------- |
| AUDIO_INPUT  | "audioinput"  |
| AUDIO_OUTPUT | "audiooutput" |
| VIDEO_INPUT  | "videoinput"  |

###### RPC Command Example

```json
{
  "nonce": "9b4e9711-97f3-4f35-b047-32c82a51978e",
  "cmd": "SET_CERTIFIED_DEVICES",
  "args": {
    "devices": [
      {
        "type": "audioinput",
        "id": "422289129460465999",
        "vendor": {
          "name": "SteelSeries",
          "url": "https://steelseries.com"
        },
        "model": {
          "name": "Arctis 7",
          "url": "https://steelseries.com/gaming-headsets/arctis-7"
        },
        "related": ["Arctis 5 - Dota 2 Limited Edition"],
        "echo_cancellation": true,
        "noise_suppression": true,
        "automatic_gain_control": true,
        "hardware_mute": false
      }
    ]
  }
}
```

###### HTTP Request Example

```
curl -X POST -H "Authorization: your_client_id, Content-Type: application/json" "http://127.0.0.1:PORT" -d "
{
  "nonce": "9b4e9711-97f3-4f35-b047-32c82a51978e",
  "cmd": "SET_CERTIFIED_DEVICES",
  "args": {
    "devices": [
      {
        "type": "audioinput",
        "id": "422289129460465999",
        "vendor": {
          "name": "SteelSeries",
          "url": "https://steelseries.com"
        },
        "model": {
          "name": "Arctis 7",
          "url": "https://steelseries.com/gaming-headsets/arctis-7"
        },
        "related": ["Arctis 5 - Dota 2 Limited Edition"],
        "echo_cancellation": true,
        "noise_suppression": true,
        "automatic_gain_control": true,
        "hardware_mute": false
      }
    ]
  }
}
"
```