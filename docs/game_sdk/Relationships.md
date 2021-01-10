# Relationships

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

This manager helps you access the relationships your players have made on Discord. Unfortunately, it won't help them make relationships IRL. They're on their own for that. It lets you:

- Access a user's relationships
- Filter those relationships based on a given criteria
- Build a user's friends list

## First Notes

Relationships on Discord change often; people start and stop playing games, go online, offline, invisible, or otherwise change state. Therefore, there are some important factors to remember when working with this manager. When you are first getting a list of a user's relationships, before you can `Filter()`, you need to wait for the `OnRefresh` callback to fire. This is your indicator that Discord has successfully taken a snapshot of the state of all your relationships at a given moment. Now that you have this snapshot, you can `Filter()` it to build the list that you want and then iterate over that list to do whatever your game needs to do. Use this to build your initial social graph for a user.

As relationships change, the `OnRelationshipUpdate` event will fire. You can use this to update the user's social graph, changing the status of the other Discord users that you chose to filter, e.g., someone is now online, or now playing the game, or no longer playing.

An example of how to do this properly is at the end of this documentation page.

## Data Models

###### Relationship Struct

| name     | type             | description                      |
| -------- | ---------------- | -------------------------------- |
| Type     | RelationshipType | what kind of relationship it is  |
| User     | User             | the user the relationship is for |
| Presence | Presence         | that user's current presence     |

###### RelationshipType Enum

| value           | description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| None            | user has no intrinsic relationship                                               |
| Friend          | user is a friend                                                                 |
| Blocked         | user is blocked                                                                  |
| PendingIncoming | the user has a pending incoming friend request to connected user                     |
| PendingOutgoing | current user has a pending outgoing friend request to user                       |
| Implicit        | user is not friends, but interacts with the current user often (frequency + recency) |

###### Presence Struct

| name     | type     | description                      |
| -------- | -------- | -------------------------------- |
| Status   | Status   | the user's current online status |
| Activity | Activity | the user's current activity      |

###### Status Enum

| name         | value |
| ------------ | ----- |
| Offline      | 0     |
| Online       | 1     |
| Idle         | 2     |
| DoNotDisturb | 3     |

## Filter

Filters a user's relationship list by a boolean condition.

Returns `void`.

###### Parameters

A function that takes a `Relationship` parameter.

###### Example

```cs
relationshipsManager.Filter(relationship =>
{
  return relationship.Presence.Status == Discord.Status.Online;
});
```

## Get

Get the relationship between the current user and a given user by id.

Returns a `Relationship`.

###### Parameters

| name   | type  | description                 |
| ------ | ----- | --------------------------- |
| userId | Int64 | the id of the user to fetch |

###### Example

```cs
var friend = relationshipsManager.Get(53908232506183680);
Console.WriteLine("This is my friend, {0}", friend.User.Username);
```

## GetAt

Get the relationship at a given index when iterating over a list of relationships.

Returns a `Relationship`.

###### Parameters

| name  | type   | description       |
| ----- | ------ | ----------------- |
| index | UInt32 | index in the list |

###### Example

```cs
for (int i = 0; i < relationshipsManager.Count(); i++)
{
  var r = relationshipsManager.GetAt(i);
  Console.WriteLine("This person is {0}", r.User.Username);
}
```

## Count

Get the number of relationships that match your `Filter()`.

Returns an `Int32`.

###### Parameters

None

###### Example

```cs
for (int i = 0; i < relationshipsManager.Count(); i++)
{
  var r = relationshipsManager.At(i);
  Console.WriteLine("This person is {0}", r.User.Username);
}
```

## OnRefresh

Fires at initialization when Discord has cached a snapshot of the current status of all your relationships. Wait for this to fire before calling `Filter` within its callback.

###### Parameters

None

## OnRelationshipUpdate

Fires when a relationship in the filtered list changes, like an updated presence or user attribute.

###### Parameters

| name         | type             | description                   |
| ------------ | ---------------- | ----------------------------- |
| relationship | ref Relationship | the relationship that changed |

###### Example

```cs
OnRelationshipUpdate += (ref Discord.Relationship relationship) =>
{
  Console.WriteLine("Who changed? {0}", relationship.User.Id);
};
```

## Example: Creating a Friends List

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var relationshipManager = discord.GetRelationshipManager();

// Assign this handle right away to get the initial relationships update.
// This callback will only be fired when the whole list is initially loaded or was reset

// Wait for OnRefresh to fire to access a stable list
// Filter a user's relationship list to be just friends
// Use this list as your base
relationshipManager.OnRefresh += () =>
{
  relationshipManager.Filter((relationship) =>
  {
    return relationship.Type == Discord.RelationshipType.Friend;
  });

  // Loop over all friends a user has.
  Console.WriteLine("relationships updated: {0}", relationshipManager.Count());

  for (var i = 0; i < relationshipManager.Count(); i++)
  {
      // Get an individual relationship from the list
      var r = relationshipManager.GetAt((uint)i);
      Console.WriteLine("relationships: {0} {1}", r.Type, r.User.Username);
      // Save r off to a list of user's relationships
  }
}

relationshipManager.OnRelationshipUpdate += (ref Discord.Relationship relationship) =>
{
  Console.WriteLine("User is {0}", relationship.User.Username);
  // Update the matching user in your previously created list
}
```

## Example: Invite Users Who Are Playing the Same Game

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var relationshipManager = discord.GetRelationshipManager();
var activityManager = discord.GetActivityManager();

relationshipManager.OnRefresh += () =>
{
  relationshipManager.Filter((relationship) =>
  {
    // Filter for users who are playing the same game as the current user
    // Is their activity application id the same as my client id?
    return relationship.Presence.Activity.ApplicationId == clientId;
  });

  for (var i = 0; i < relationshipManager.Count(); i++)
  {
      // Get an individual relationship from the list
      var r = relationshipManager.GetAt((uint)i);
      Console.WriteLine("relationships: {0} {1}", r.Type, r.User.Username);

      // Send them a game invite!
      activityManager.InviteUser(r.User.Id, Discord.ActivityActionType.Join, "Come play with me!", (result) =>
      {
        Console.WriteLine("Invited user {0} to play with you", r.User.Username);
      });
  };
}
```
