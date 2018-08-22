# Relationships

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

This manager helps you access the relationships your players have made on Discord. Unfortunately, it won't help them make relationships IRL. They're on their own for that. It lets you:

- Access a user's relationships
- Filter those relationships based on a given criteria
- Build a user's friends list

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
| PendingIncoming | user has a pending incoming friend request to connected user                     |
| PendingOutgoing | current user has a pending outgoing friend request to user                       |
| Implicit        | user is not friends, but interacts with current user often (frequency + recency) |

###### Presence Struct

| name     | type     | description                      |
| -------- | -------- | -------------------------------- |
| Status   | Status   | the user's current online status |
| Activity | Activity | the user's current activity      |

###### Status Enum

| value        |
| ------------ |
| Offline      |
| Online       |
| Idle         |
| DoNotDisturn |

## Filter

Filters a user's relationship list by a boolean condition.

Returns `void`.

###### Parameters

A function that takes a `Relationship` parameter.

###### Example

```cs
relationshipsManager.Filter(Relationship relationship =>
{
  relationship.Presence.Status == Discord.Status.Online;
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

## At

Get the relationship at a given index when iterating over a list of relationships.

Returns a `Relationship`.

###### Parameters

| name  | type   | description       |
| ----- | ------ | ----------------- |
| index | UInt32 | index in the list |

###### Example

```cs
for (int i = 0; i < relationshipsManager.Count(); i++) {
  var r = relationshipsManager.At(i);
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
for (int i = 0; i < relationshipsManager.Count(); i++) {
  var r = relationshipsManager.At(i);
  Console.WriteLine("This person is {0}", r.User.Username);
}
```

## OnRelationshipsUpdate

Fires in response to `Filter()` when relationships have been filtered and the list is stable and ready for access.

###### Parameters

None

## OnRelationshipUpdate

Fires when a relationship in the filtered list changes, like an updated presence or user attribute.

###### Parameters

| name         | type         | description                   |
| ------------ | ------------ | ----------------------------- |
| relationship | Relationship | the relationship that changed |

###### Example

```cs
OnRelationshipUpdate += (Relationship relationship) =>
{
  Console.WriteLine("Who changed? {0}", relationship.User.Id);
};
```

## Example: Accessing a User's Friends List

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var relationshipsManager = discord.CreateRelationshipsManager();

// Assign this handle right away to get the initial relationships update.
// This callback will only be fired when the whole list is initially loaded or was reset
relationshipsManager.OnRelationshipsUpdate += () =>
{
  // Filter a user's relationship list to be just friends
  relationshipsManager.Filter((ref Discord.Relationship relationship) =>
  {
    return relationship.Type == Discord.RelationshipType.Friend;
  });

  // Loop over all friends a user has.
  Console.WriteLine("relationships updated: {0}", relationshipsManager.Count());

  for (var i = 0; i < Math.Min(relationshipsManager.Count(), 10); i++)
  {
      // Get an individual relationship from the list
      var r = relationshipsManager.At((uint)i);
      Console.WriteLine("relationships: {0} {1}", r.Type, r.User.Username);

      // Request relationship's avatar data.
      FetchAvatar(imagesManager, r.User.Id);
  }
};
```

## Example: Invite Users Who Are Playing the Same Game

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var relationshipsManager = discord.CreateRelationshipsManager();
var activitiesManager = discord.CreateActivitiesManager();

relationshipsManager.Filter((ref Discord.Relationship relationship) =>
{
  // Filter for users who are playing the same game as the current user
  // Is their activity application id the same as my client id?
  return relationship.Presence.Activity.ApplicationId == clientId;
});

for (var i = 0; i < Math.Min(relationshipsManager.Count(); i++)
{
    // Get an individual relationship from the list
    var r = relationshipsManager.At((uint)i);
    Console.WriteLine("relationships: {0} {1}", r.Type, r.User.Username);

    // Send them a game invite!
    activitiesManager.InviteUser(r.User.Id, Discord.ActivityActionType.Join, "Come play with me!", result =>
    {
      Console.WriteLine("Invited user {0} to play with you", r.User.Username);
    });
};
```
