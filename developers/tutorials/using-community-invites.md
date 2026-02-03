---
title: Using Community Invites
sidebarTitle: Using Community Invites
---

Community Invites make it easy to bring players into your Discord server with automatic role assignment and targeted user invites. Whether you're a community manager building a server around your game, a streamer building your following in Discord, or a server admin, community invites let you choose who can accept an invite and what roles it will give them when they accept the invite.

With community invites, you can automatically assign Discord roles when players accept an invite like giving a role to your supporters, beta testers, or players. You can also restrict who can use an invite by uploading a list of specific Discord user IDs, perfect for any scenario where you need controlled access to an invite. By giving roles with specific permissions, you can create invites that give players access to the right channels and features based on their in-game status.

This tutorial will walk you through using community invites both through the UI in Discord and programmatically in your bot or app. By the end, you'll know how to:

- Create invites that assign roles in Discord's UI
- Create invites that assign roles through the API
- Create targeted invites for specific groups of users through the API

---

## Understanding Community Invites Features

Community invites extend Discord's existing invite system with two powerful features designed for game integrations:

### Role Assignment

You can assign roles for an invite through both the Discord UI and the API.

If you're assigning roles through the UI, [jump ahead](/developers/tutorials/using-community-invites#creating-role-invites-in-discord) to the Creating Role Invites in Discord section.

When using the API, the `role_ids` parameter lets you specify one or more Discord roles that will be automatically assigned when a player accepts the invite. No manual role management needed.

**Example use cases:**

- Giving roles to supporters
- Give roles related to characters or achievements from your game
- Give roles that have permissions to access channels

<Info>
Once a user accepts an invite and receives the roles, those roles remain even after the invite expires or is deleted. You'll need to remove roles manually (via your bot or Discord's interface).
</Info>

### Targeted Invites

Setting target users that are allowed to accept an invite can only be done through the Discord API. The `target_users_file` parameter accepts a CSV file containing Discord user IDs. Only users in that list can see and accept the invite.

**Example use cases:**

- Preventing invite sharing for exclusive achievements (for example: create a unique invite for a player with a 100% completion role)
- When combined with roles to give out mod/admin privileges
- Combined with roles to give special roles/channel access to paying supporters

These features both work with all standard invite parameters like `max_age`, `max_uses`, and more.

---

## Prerequisites

Before you begin, make sure you have:

- A Discord server for testing

**For use in the Discord Client:**

- User permissions: **Create Invite**, **Manage Server**, and **Manage Roles**

**For API integration:**

- Developer Mode enabled on your account (so you can copy role, channel, and user IDs)
- A Discord app with a bot token (create one in the [Developer Portal](https://discord.com/developers/applications))
- Basic familiarity with the Discord REST API
- Node.js installed, or the ability to make HTTP requests from your bot or app
- Bot permissions:
    - **Create Instant Invite** (required)
    - **Manage Guild** (required for targeted invites with `target_users_file`)
    - **Manage Roles** (required for automatic role assignment with `role_ids`)

---

## Creating Role Invites in Discord

Before diving into API integration, you can create role-assigning invites directly in Discord's UI. This is perfect for server admins and community managers who want to create invites for specific purposes without writing code.

### How to Create a Role Invite

1. Open your Discord server and right-click the channel you want to create an invite for
2. Select **"Invite To Channel"**

**or**

1. Open your Discord server and click the server name
2. Select **"Invite To Server"**
3. Click **"Edit invite link"**
4. Under **"Roles (Optional)"**, select one or more roles to auto-assign
5. Configure other settings like expiration time and max uses
6. Click **"Generate a New Link"**
7. Share the invite link - anyone who accepts it will automatically receive the selected roles

<img src="/images/community-invite-ui.webp" alt="Example of creating an invite that grants roles" style={{width: "auto", height: "350px"}} />

### Important Notes

- Users who accept the invite will receive the selected roles **even if they're already in your server**
- Roles persist after the invite expires or is deleted
- You need **Create Instant Invite** and **Manage Roles** permissions to create role invites
- You can only assign roles in an invite that are lower than your highest role

The rest of this tutorial focuses on API integration for developers who want to automate community invites in their bots or apps.

---

## Role Granting Invite Example: Auto-Assigning Player Roles

In this example we’ll show you how to grant roles as part of an invite using the API. We’ll take a look at what a game developer could do to connect their game back to their community. When players join your Discord server from your game, you can give them a **Player** role for access to game specific channels. Here's how to create an invite that does this automatically:

```jsx
// IMPORTANT: Never hardcode tokens or commit them to version control
// Use environment variables or a secure configuration management system
// Replace the placeholder below with your actual bot token, channel ID, and role ID
const BOT_TOKEN = 'REPLACE_WITH_YOUR_BOT_TOKEN_FROM_THE_DEV_PORTAL';
const CHANNEL_ID = '1234567890123456789';
const ROLE_ID = '9876543210987654321';

const response = await fetch(
    `https://discord.com/api/v10/channels/${CHANNEL_ID}/invites`,
    {
        method: 'POST',
        headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        role_ids: [ROLE_ID]
        })
    }
);

if (!response.ok) {
const error = await response.json().catch(() => ({
    message: `HTTP ${response.status}`
}));
throw new Error(
    `Failed to create invite: ${error.message}${error.code ? ` (code: ${error.code})` : ''}`
);
}

const invite = await response.json();
console.log(`Created invite: https://discord.gg/${invite.code}`);
```

### What's Happening

1. **`role_ids` array**: Contains the Discord role IDs to assign when the invite is accepted (we’re only assigning one in this example but you can assign any number of roles using this array)
2. **Response**: Returns an invite object with a `code` you can share

### Permission Requirements

Your bot needs the `CREATE_INSTANT_INVITE` permission to create invites, and the `MANAGE_ROLES` permission to assign roles via invites. Additionally, your bot can only assign roles that are lower than its highest role in the role hierarchy.

### Testing It Out

<Steps>
    <Step>
        Create a **Player** role in your Discord server
    </Step>
    <Step>
        Right click the role and click **"Copy Role ID"** then paste it in `ROLE_ID` in the script
    </Step>
    <Step>
        Right click the channel for the invite and click **"Copy Channel ID"** then paste it in `CHANNEL_ID` in the script
    </Step>
    <Step>
        Paste your bot token in `BOT_TOKEN` in the script
    </Step>
    <Step>
        Run the code to generate an invite code
    </Step>
    <Step>
        Share the `discord.gg/...` link with a test account
    </Step>
    <Step>
        When they accept, they'll automatically get the **Player** role!
    </Step>
</Steps>

<img src="/images/community-invite-role.webp" alt="Example of an invite granting a Player role" style={{width: "auto", height: "250px"}} />

---

## Target Users Example: Creating Targeted Supporter Invites

In this example we’ll show you how to only allow specific users to accept an invite using the API. We’ll take a look at what a game developer or streamer could do to grant special roles and channels in their community for supporter. If you run a subscription service for your game or community, you can create exclusive invites that only your paying supporter can accept. Those roles can grant access to channels that other users in the server can’t see. Here’s how to create an invite that grants a role to specific users:

```jsx
// IMPORTANT: Never hardcode tokens or commit them to version control
// Use environment variables or a secure configuration management system
// Replace the placeholder below with your actual bot token, channel ID, and role ID
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const SUPPORTER_CHANNEL_ID = '1234567890123456789';
const SUPPORTER_ROLE_ID = '1111222233334444555';

// In production you would fetch this from your subscription database
// Replace these example user IDs with actual Discord user IDs of your test accounts
const activeSupporterIds = [
    '111111111111111111',
    '222222222222222222',
    '333333333333333333',
];

// Create CSV content with user IDs
const csvContent = activeSupporterIds.join('\n');
const csvBlob = new Blob([csvContent], { type: 'text/csv' });

// Use FormData for multipart/form-data request
const formData = new FormData();
formData.append('target_users_file', csvBlob, 'supporters.csv');

formData.append('payload_json', JSON.stringify({
    role_ids: [SUPPORTER_ROLE_ID]
}));

const response = await fetch(
`https://discord.com/api/v10/channels/${SUPPORTER_CHANNEL_ID}/invites`,
{
    method: 'POST',
    headers: {
    'Authorization': `Bot ${BOT_TOKEN}`
    },
    body: formData
}
);

if (!response.ok) {
    const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}`
    }));
    
    let errorMessage = `Failed to create invite: ${error.message || response.statusText}`;
    
    if (error.code) {
        errorMessage += ` (code: ${error.code})`;
    }
    
    if (error.errors) {
        errorMessage += '\nDetailed errors:\n' + JSON.stringify(error.errors, null, 2);
    }
    
    throw new Error(errorMessage);
}

const invite = await response.json();

console.log(`Share this link with supporters: https://discord.gg/${invite.code}`);
```

### What's Happening

1. **`target_users_file`**: A CSV file containing Discord user IDs of paying supporters. Only these users can see and accept the invite.
2. **`role_ids` array**: Assigns the **Supporter** role automatically, giving them access to exclusive channels
3. **FormData**: Required when uploading files, the other parameters go in `payload_json`

<Info>
When using only JSON parameters like `role_ids`, use `Content-Type: application/json`. When uploading `target_users_file`, you must use `multipart/form-data`.
</Info>

### Permission Requirements

Your bot needs the `CREATE_INSTANT_INVITE` permission to create invites, and the `MANAGE_ROLES` permission to assign roles via invites. It also needs the `MANAGE_GUILD` permission to use targeted invites (`target_users_file`). Additionally, your bot can only assign roles that are lower than its highest role in the role hierarchy.

### Setting Up the Supporter Role

For the best experience, configure your **Supporter** role with these permissions:

1. Create a **Supporter** role in your Discord server
2. Create a private channel (#supporter-polls or #supporter-chat)
3. Right click the channels and **"Edit Channel"** to set the channel permissions so only users with the **Supporter** role can view and message in it
    - **View Channel** for the supporter exclusive channels
    - **Send Messages** and **Add Reactions**

### Testing It Out

<Steps>
    <Step>
        Create a **Supporter** role in your Discord server
    </Step>
    <Step>
        Right click the role and click **"Copy Role ID"** then paste it in `SUPPORTER_ROLE_ID` in the script
    </Step>
    <Step>
        Right click the channel for the invite and click **"Copy Channel ID"** then paste it in `SUPPORTER_CHANNEL_ID` in the script
    </Step>
    <Step>
        Paste your bot token in `BOT_TOKEN` in the script
    </Step>
    <Step>
        Right click each user you want to be able to accept the invite and click **"Copy User ID"** then paste that in `activeSupporterIds` in the script
    </Step>
    <Step>
        Run the code to generate an invite code
    </Step>
    <Step>
        Share the `discord.gg/...` link with one of the users you added to `activeSupporterIds` and one that you didn’t
    </Step>
    <Step>
        The users in `activeSupporterIds`  will be able to accept and receive the **Supporter** role!
    </Step>
</Steps>

<img src="/images/community-invite-target.webp" alt="Example of an invite granting a Supporter role" style={{width: "auto", height: "250px"}} />
<img src="/images/community-invite-target-no.webp" alt="Example of an invite that can't be accepted" style={{width: "450px", height: "auto"}} />

---

## Resources

For complete API reference details check out the invite and channel API documentation.

<CardGroup cols={2}>
    <Card title="Invites" href="/developers/resources/invite">
    Complete API reference for invite objects, endpoints, and parameters
    </Card>
    <Card title="Create Channel Invite" href="/developers/resources/channel#create-channel-invite">
    Detailed documentation for the create invite endpoint
    </Card>
</CardGroup>
