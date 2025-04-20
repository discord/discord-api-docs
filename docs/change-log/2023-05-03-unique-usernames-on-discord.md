---
title: "Unique usernames on Discord"
date: "2023-05-03"
---

:::warn
Bot users will stay on the legacy username system for now. More details can be found on the [Developer Help Center article](https://dis.gd/app-usernames).
:::

Discord’s username system is changing. Discriminators are being removed and new, unique usernames and display names are being introduced. You can read more details about how changes to the username system affects non-bot users in the [general Help Center article](https://dis.gd/usernames). To learn how it impacts bot users specifically, you can read the [Developer Help Center article](https://dis.gd/app-usernames).

This changelog focuses only on the technical changes to be aware of to update your app's code.

### Identifying migrated users

The new username system will rollout to users over time rather than all at once. The value of a single zero (`"0"`) in the [`discriminator` field](/docs/resources/user#user-object-user-structure) on a user will indicate that the user has been migrated to the new username system. Note that the discriminator for migrated users will *not* be 4-digits like a standard discriminator (it is `"0"`, not `"0000"`). The value of the `username` field will become the migrated user's unique username.

After migration of all users is complete, the `discriminator` field may be removed.

#### Example migrated user

```json
{
  "id": "80351110224678912",
  "username": "nelly",
  "discriminator": "0",
  "global_name": "Nelly",
  "avatar": "8342729096ea3675442027381ff50dfe",
  "verified": true,
  "email": "nelly@discord.com",
  "flags": 64,
  "banner": "06c16474723fe537c283b8efa61a30c8",
  "accent_color": 16711680,
  "premium_type": 1,
  "public_flags": 64
}
```

### Display names

As part of the new username system, standard Discord users can define a non-unique display name. This value will be a new `global_name` field with a max length of 32 characters. If the user has not set a display name, `global_name` will be null.

### Default avatars

For users with migrated accounts, default avatar URLs will be based on the user ID instead of the discriminator. The URL can now be calculated using `(user_id >> 22) % 6`. Users on the legacy username system will continue using `discriminator % 5`.
