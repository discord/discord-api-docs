# How Activities Work

Activities are web applications that run in an iframe within Discord on desktop, mobile and web. In order to achieve this, we use the [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) protocol to enable secure communication between your application and Discord.

The [Embedded App SDK](https://github.com/discord/embedded-app-sdk) simplifies this process by managing the `postMessage` protocol on your behalf. For details on available commands and their usage, consult the [SDK Reference](/docs/developer-tools/embedded-app-sdk). Our [Sample Projects](/docs/activities/overview#sample-projects) provide practical examples of how to implement these features.

## Designed for Single-Page Apps (SPAs)

This SDK is intended for use by a single-page application. We recognize developers may be using frameworks or approaches that are not an exact fit for single-page applications. We recommend nesting those frameworks inside your Activity's top-level single-page application and passing messages as you see fit. Please refer to the [Nested Messages App](/docs/activities/overview#sample-projects) sample project for guidance on this approach.

## Activity Lifecycle

1. **Initialization:** When your iframe is loaded within Discord, it will include unique query parameters in its URL. These parameters are identifiable by your application using the Discord SDK.
2. **Handshake Process:** Constructing the SDK instance begins a handshake process with the Discord client. Once the connection is established, the iframe receives a `[FRAME, {evt: 'READY', ...}]` message. The `ready()` method of the SDK instance resolves once a successful connection has been established.
3. **Authorization and Authentication:** After receiving the `READY` payload, your application should perform authorization and authentication to acquire necessary permissions (scopes). This step is crucial for utilizing specific features or scopes, such as `rpc.activities.write`.
4. **Interacting with Discord Client:** Post-authentication, your application can subscribe to events and send commands to the Discord client. Note that attempting to use commands or subscribe to events outside your granted scope will result in errors. Adding new scopes may prompt an OAuth modal for user permission re-confirmation.
5. **Disconnection and Errors:** Receiving a `[CLOSE, {message: string, code: number}]` message indicates an error or a need to restart the connection process.
6. **Sending Errors or Close Requests:** To communicate an error or request a close from the Discord client, send `[CLOSE, {message?: string, code: number}]`. A code other than CLOSE_NORMAL will display the message to the user, while CLOSE_NORMAL results in a silent closure.

## Sample Code and Activity Lifecycle Diagram

:::info
Below is a minimal example of setting up the SDK. Please see our [Sample Projects](/docs/activities/overview#sample-projects) for more complete sample applications.
:::

```javascript
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(YOUR_OAUTH2_CLIENT_ID);

async function setup() {
  // Wait for READY payload from the discord client
  await discordSdk.ready();

  // Pop open the OAuth permission modal and request for access to scopes listed in scope array below
  const {code} = await discordSdk.commands.authorize({
    client_id: YOUR_OAUTH2_CLIENT_ID,
    response_type: 'code',
    state: '',
    prompt: 'none',
    scope: ['identify'],
  });

  // Retrieve an access_token from your application's server
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });
  const {access_token} = await response.json();

  // Authenticate with Discord client (using the access_token)
  auth = await discordSdk.commands.authenticate({
    access_token,
  });
}
```

This diagram illustrates the communication flow between your application and Discord in the sample code above.

![Diagram of how Activities communicate with Discord](images/activities/embedded-app-flow-diagram.svg)
