# Relationships

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

This manager helps you access the relationships your players have made on Discord. Unfortunately, it won't help them make relationships IRL. They're on their own for that. It lets you:

- Access a user's relationships
- Filter those relationships based on a given criteria
- Build a user's friends list

### Data Models

```cs
enum RelationshipType
{
  None,
  Friend,
  Blocked,
  PendingIncoming,
  PendingOutgoing,

  // Not explicit friends, but interact often on Discord
  // These relationships power a lot of the Games tab
  Implicit
};

struct Presence
{
  Status Status;
  Activity Activity;
};

enum Status
{
  Offline = 0,
  Online = 1,
  Idle = 2,
  DoNotDisturb = 4
};

struct Relationship
{
  RelationshipType Type;
  User User;
  Presence Presence;
};
```

### Methods

```cs
void Filter(Relationship relationship =>
{
  // Filter's a user's relationship list
  // Example: RelationshipsManager.Filter(relationship => relationship.presence.status == "online");
});

Relationship Get(Int64 userId);
// Returns the relationship between the current user and a given userId

Relationship At(UInt32 index);
// Returns the relationship at a given index

Int32 Count();
// Returns the number of relationships currently available; used to iterate over the list
// Before calling Count(), you need to call Filter() with your choice of qualification
// This builds a stable list to iterate over. Otherwise, Count() will always return 0
```

### Callbacks

```cs
OnRelationshipsUpdate += () =>
{
  // New data ahoy!
};

OnRelationshipUpdate += (Relationship relationship) =>
{
  // One of your relationships has changed, and here it is
};
```

### Example: Accessing a User's Friends List

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

### Example: Invite Users Who Are Playing the Same Game

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
