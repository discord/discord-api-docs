# Embedded App SDK Reference

> preview 
> Creating Activities is currently available as a [Public Developer Preview](/docs/activities/overview#public-developer-preview).

The Embedded App SDK handles making RPC calls between your application and Discord. It is designed to assist developers in developing interactive Activities like games.

To learn more about building Activities, check out our [Building an Activity](/docs/activities/building-an-activity) tutorial or explore our [Sample Projects](/docs/activities/overview#sample-projects).

---

## Install the SDK

The Embedded App SDK is available via **[npm](https://www.npmjs.com/package/@discord/embedded-app-sdk)** and **[GitHub](https://github.com/discord/embedded-app-sdk)**.

In your frontend JavaScript project directory, install using your package manager of choice.

```
npm install @discord/embedded-app-sdk
```

After installing, you can import and instantiate the SDK in your project.

```javascript
import { DiscordSDK } from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK(DISCORD_CLIENT_ID);
```

---

## SDK Methods

| Name                                                              | Description                                                             |
|-------------------------------------------------------------------|-------------------------------------------------------------------------|
| [ready](/docs/developer-tools/embedded-app-sdk#ready)             | Resolves when your app has successfully connected to the Discord client |
| [subscribe](/docs/developer-tools/embedded-app-sdk#subscribe)     | Subscribe to an Embedded App SDK Event                                  |
| [unsubscribe](/docs/developer-tools/embedded-app-sdk#unsubscribe) | Unsubscribe to an Embedded App SDK Event                                |

### ready()

Resolves when your app has successfully connected to the Discord client.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### SDK Usage

```js
async function setup() {
  await discordSdk.ready();
  // The rest of your app logic
}
```

---

### subscribe()

Used to subscribe to a specific event from the list of [SDK Events](/docs/developer-tools/embedded-app-sdk#sdk-events).

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

Depends on the event. Refer to the Required Scopes for the specific event you are subscribing to.

#### Usage

```js
await discordSdk.subscribe("SDK_EVENT_NAME", eventHandler, args);
```

---

### unsubscribe()

Used to unsubscribe to [SDK Events](/docs/developer-tools/embedded-app-sdk#sdk-events) that your app has already subscribed to.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.unsubscribe("SDK_EVENT_NAME");
```

---

## SDK Commands

Developers can use these commands to interact with the Discord client. The following SDK commands are prefixed with `.commands`, such as, `discordSDK.commands.authenticate`. 

| Name                                                                                                        | Description                                                                              |
|-------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| [authenticate](/docs/developer-tools/embedded-app-sdk#authenticate)                                         | Authenticate an existing client with your app                                            |
| [authorize](/docs/developer-tools/embedded-app-sdk#authorize)                                               | Authorize a new client with your app                                                     |
| [captureLog](/docs/developer-tools/embedded-app-sdk#capturelog)                                             | Forward logs to your own logger                                                          |
| [encourageHardwareAcceleration](/docs/developer-tools/embedded-app-sdk#encouragehardwareacceleration)       | Presents a modal dialog to allow enabling of hardware acceleration                       |
| [getChannel](/docs/developer-tools/embedded-app-sdk#getchannel)                                             | Returns information about the channel, per the channel_id                                |
| [getChannelPermissions](/docs/developer-tools/embedded-app-sdk#getchannelpermissions)                       | Returns permissions for the current user in the currently connected channel              |
| [getEntitlements](/docs/developer-tools/embedded-app-sdk#getentitlements)                                   | Not available during Developer Preview                                                   |
| [getInstanceConnectedParticipants](/docs/developer-tools/embedded-app-sdk#getinstanceconnectedparticipants) | Returns all participants connected to the instance                                       |
| [getPlatformBehaviors](/docs/developer-tools/embedded-app-sdk#getplatformbehaviors)                         | Returns information about supported platform behaviors                                   |
| [getSkus](/docs/developer-tools/embedded-app-sdk#getskus)                                                   | Not available during Developer Preview                                                   |
| [initiateImageUpload](/docs/developer-tools/embedded-app-sdk#initiateimageupload)                           | Presents the file upload flow in the Discord client                                      |
| [openExternalLink](/docs/developer-tools/embedded-app-sdk#openexternallink)                                 | Allows for opening an external link from within the Discord client                       |
| [openInviteDialog](/docs/developer-tools/embedded-app-sdk#openinvitedialog)                                 | Presents a modal dialog with Channel Invite UI without requiring additional OAuth scopes |
| [openShareMomentDialog](/docs/developer-tools/embedded-app-sdk#opensharemomentdialog)                       | Presents a modal dialog to share media to a channel or DM                                |
| [setActivity](/docs/developer-tools/embedded-app-sdk#setactivity)                                           | Modifies how your activity's rich presence is displayed in the Discord client            |
| [setOrientationLockState](/docs/developer-tools/embedded-app-sdk#setorientationlockstate)                   | Set options for orientation and picture-in-picture (PIP) modes                           |
| [startPurchase](/docs/developer-tools/embedded-app-sdk#startpurchase)                                       | Not available during Developer Preview                                                   |
| [userSettingsGetLocale](/docs/developer-tools/embedded-app-sdk#usersettingsgetlocale)                       | Returns the current user's locale                                                        |

### authenticate()

Authenticate an existing client with your app.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.authenticate({
  access_token: 'ACCESS_TOKEN_STRING'
});
```

---

### authorize()

Authorize a new client with your app.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.authorize({
  client_id: DISCORD_CLIENT_ID,
  response_type: "code",
  state: "",
  prompt: "none",
  scope: [
    // "applications.builds.upload",
    // "applications.builds.read",
    // "applications.store.update",
    // "applications.entitlements",
    // "bot",
    "identify",
    // "connections",
    // "email",
    // "gdm.join",
    "guilds",
    // "guilds.join",
    // "guilds.members.read",
    // "messages.read",
    // "relationships.read",
    // 'rpc.activities.write',
    // "rpc.notifications.read",
    // "rpc.voice.write",
    // "rpc.voice.read",
    // "webhook.incoming",
  ],
});
```

---

### captureLog()

Forward logs to your own logger.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.captureLog({ 
  level: 'log',
  message: 'This is my log message!' 
});
```

---

### encourageHardwareAcceleration()

Presents a modal dialog to allow enabling of hardware acceleration.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ⛔️  | ⛔️      |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.encourageHardwareAcceleration();
```

---

### getChannel()

Returns information about the channel for a provided channel ID.


#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

- [guilds] for guild channels
- [guilds, dm_channels.read] for GDM channels. dm_channels.read requires approval from Discord.

#### Usage
```js
await discordSdk.commands.getChannel({
  channel_id: discordSdk.channelId,
});
```

---

### getChannelPermissions()

Returns permissions for the current user in the currently connected channel.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

- guilds.members.read

#### Usage

```js
await discordSdk.commands.getChannelPermissions();
```

---

### getEntitlements()

> preview 
> Coming soon! Not available during Developer Preview

---

### getInstanceConnectedParticipants()

Returns all participants connected to the instance.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.getInstanceConnectedParticipants();
```

---

### getPlatformBehaviors()

Returns information about supported platform behaviors.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.getPlatformBehaviors();
```

---

### getSkus()

> preview 
> Coming soon! Not available during Developer Preview

---

### initiateImageUpload()

Presents the file upload flow in the Discord client.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.initiateImageUpload();
```

---

### openExternalLink()

Allows for opening an external link from within the Discord client.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.openExternalLink({ 
  url: 'string url'
});
```

---

### openInviteDialog()

Presents a modal dialog with Channel Invite UI without requiring additional OAuth scopes.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.openInviteDialog();
```

---

### openShareMomentDialog()

Presents a modal dialog to share media to a channel or direct message.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ⛔️  | ⛔️      |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.openShareMomentDialog({
  mediaUrl: 'DISCORD_CDN_URL' 
});
```

---

### setActivity()

Modifies how your activity's rich presence is displayed in the Discord client.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

- rpc.activities.write

#### Usage

```js
await discordSdk.commands.setActivity({ 
  activity: { 
    type: 0, 
    details: 'Details',
    state: 'Playing' 
  }
});
```

---

### setConfig()

Set whether or not the PIP (picture-in-picture) is interactive.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ⛔️  | ⛔️      |

#### Required Scopes

No scopes required

#### Usage

```js
await discordSdk.commands.setConfig({
  user_interactive_pip: true
})
```

---

### setOrientationLockState()

Locks the application to specific orientations in each of the supported layout modes.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ⛔️  | ✅   | ✅       |

#### Required Scopes

- guilds.members.read

#### Usage

```js
await discordSdk.commands.setOrientationLockState({ 
  lock_state: 'landscape', 
  picture_in_picture_lock_state: 'landscape', 
  grid_lock_state: 'unlocked'
});
```

---

### startPurchase()

> preview 
> Coming soon! Not available during Developer Preview

---

### userSettingsGetLocale()

Returns the current user's locale.

#### Supported Platforms
| Web | iOS | Android |
|-----|-----|---------|
| ✅   | ✅   | ✅       |

#### Required Scopes

- identify

#### Usage

```js
await discordSdk.commands.userSettingsGetLocale();
```

---

## SDK Events

Developers may use the following events alongside the `subscribe()` SDK method to subscribe to events from Discord and supported devices.

| Name                                                                                                               | Description                                                                               |
|--------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| [READY](/docs/developer-tools/embedded-app-sdk#ready)                                                              | non-subscription event sent immediately after connecting, contains server information     |
| [ERROR](/docs/developer-tools/embedded-app-sdk#error)                                                              | non-subscription event sent when there is an error, including command responses           |
| [VOICE_STATE_UPDATE](/docs/developer-tools/embedded-app-sdk#voice_state_update)                                      | sent when a user's voice state changes in a subscribed voice channel (mute, volume, etc.) |
| [SPEAKING_START](/docs/developer-tools/embedded-app-sdk#speaking_start)                                             | sent when a user in a subscribed voice channel speaks                                     |
| [SPEAKING_STOP](/docs/developer-tools/embedded-app-sdk#speaking_stop)                                               | sent when a user in a subscribed voice channel stops speaking                             |
| [ACTIVITY_LAYOUT_MODE_UPDATE](/docs/developer-tools/embedded-app-sdk#activity_layout_mode_update)                     | Received when a user changes the layout mode in the Discord client                        |
| [ORIENTATION_UPDATE](/docs/developer-tools/embedded-app-sdk#orientation_update)                                     | Received when screen orientation changes                                                  |
| [CURRENT_USER_UPDATE](/docs/developer-tools/embedded-app-sdk#current_user_update)                                    | Received when the current user object changes                                             |
| [THERMAL_STATE_UPDATE](/docs/developer-tools/embedded-app-sdk#thermal_state_update)                                  | Received when Android or iOS thermal states are surfaced to the Discord app               |
| [ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE](/docs/developer-tools/embedded-app-sdk#activity_instance_participants_update) | Received when the number of instance participants changes                                 |
| [ENTITLEMENT_CREATE](/docs/developer-tools/embedded-app-sdk#entitlement_create)                                     | Not available during Developer Preview                                                    |


### READY

Non-subscription event sent immediately after connecting, contains server information.

#### Required Scopes

No scopes required

#### Sample Event Payload

```javascript
{
  "v": 1,
  "config": {
      "cdn_host": "cdn.discordapp.com",
      "api_endpoint": "//discord.com/api",
      "environment": "production"
  }
}
```

### ERROR

Non-subscription event sent when there is an error, including command responses.

#### Required Scopes

No scopes required

#### Sample Event Payload

```javascript
{
  "code": 4006,
  "message": "Not authenticated or invalid scope"
}
```
---

### VOICE_STATE_UPDATE

Received when a user's voice state changes in a subscribed voice channel (mute, volume, etc).

#### Required Scopes

- rpc.voice.read

#### Sample Event Payload

```javascript
{
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
```

---
### SPEAKING_START

Received when a user in a subscribed voice channel speaks.

#### Required Scopes

- rpc.voice.read

#### Sample Event Payload

```javascript
{
  "channel_id": "7173758092142710784",
  "user_id": "7173758143913005056"
}
```

---

### SPEAKING_STOP

Received when a user in a subscribed voice channel stops speaking.

#### Required Scopes

- rpc.voice.read

#### Sample Event Payload

```javascript
{
  "channel_id": "7173758211307081728",
  "user_id": "7173758261412237312"
}
```

---

### ACTIVITY_LAYOUT_MODE_UPDATE

Received when a user changes the layout mode in the Discord client.

#### Required Scopes

No scopes required

#### Sample Event Payload

```javascript
{
  "layout_mode": 1
}
```

---

### ORIENTATION_UPDATE

Received when screen orientation changes.

#### Required Scopes

No scopes required

#### Sample Event Payload

```javascript
{
  "screen_orientation": 1
}
```

---

### CURRENT_USER_UPDATE

Received when the current user object changes.

#### Required Scopes

- identify

#### Sample Event Payload

```javascript
{
  "id": "7173771622812225536",
  "username": "beef_supreme",
  "discriminator": "0",
  "global_name": "Dis Cord",
  "avatar": "abcdefg",
  "avatar_decoration_data": {
    "asset": "abcdefg",
    "sku_id": "123456789"
  },
  "bot": false,
  "flags": 1,
  "premium_type": 2
}
```

---

### THERMAL_STATE_UPDATE

Received when Android or iOS thermal states are surfaced to the Discord mobile app.

#### Required Scopes

No scopes required

#### Sample Event Payload
```javascript
{
  thermal_state: 0
}
```

---

### ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE

Received when the number of instance participants changes.

#### Required Scopes

No scopes required

#### Sample Event Payload

```javascript
{
  "participants": [
    {
      "id": "7173771622812225536",
      "username": "beef_supreme",
      "discriminator": "0",
      "global_name": "Dis Cord",
      "avatar": "abcdefg",
      "avatar_decoration_data": {
        "asset": "abcdefg",
        "sku_id": "123456789"
      },
      "bot": false,
      "flags": 1,
      "premium_type": 2
    }
  ]
}
```

---

### ENTITLEMENT_CREATE

> preview 
> Coming soon! Not available during Developer Preview
