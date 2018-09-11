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

| name         | value |
| ------------ | ----- |
| Offline      | 0     |
| Online       | 1     |
| Idle         | 2     |
| DoNotDisturn | 4     |

## Filter

Filters a user's relationship list by a boolean condition.

Returns `void`.

###### Parameters

A function that takes a `Relationship` parameter.

###### Example

```cs
relationshipsManager.Filter(relationship =>
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

Fires when the filtered relationship list has been reset to default, usually because of a reconnection to Discord.

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
OnRelationshipUpdate += relationship =>
{
  Console.WriteLine("Who changed? {0}", relationship.User.Id);
};
```

## Example: Accessing a User's Friends List

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var relationshipManager = discord.GetRelationshipManager();

// Assign this handle right away to get the initial relationships update.
// This callback will only be fired when the whole list is initially loaded or was reset

// Filter a user's relationship list to be just friends
relationshipManager.Filter((relationship) =>
{
  return relationship.Type == Discord.RelationshipType.Friend;
});

// Loop over all friends a user has.
Console.WriteLine("relationships updated: {0}", relationshipManager.Count());

for (var i = 0; i < Math.Min(relationshipManager.Count(), 10); i++)
{
    // Get an individual relationship from the list
    var r = relationshipManager.At((uint)i);
    Console.WriteLine("relationships: {0} {1}", r.Type, r.User.Username);
}
```

## Example: Invite Users Who Are Playing the Same Game

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var relationshipManager = discord.GetRelationshipManager();
var activityManager = discord.GetActivityManager();

relationshipManager.Filter((relationship) =>
{
  // Filter for users who are playing the same game as the current user
  // Is their activity application id the same as my client id?
  return relationship.Presence.Activity.ApplicationId == clientId;
});

for (var i = 0; i < Math.Min(relationshipManager.Count(); i++)
{
    // Get an individual relationship from the list
    var r = relationshipManager.At((uint)i);
    Console.WriteLine("relationships: {0} {1}", r.Type, r.User.Username);

    // Send them a game invite!
    activityManager.InviteUser(r.User.Id, Discord.ActivityActionType.Join, "Come play with me!", (result) =>
    {
      Console.WriteLine("Invited user {0} to play with you", r.User.Username);
    });
};
```
