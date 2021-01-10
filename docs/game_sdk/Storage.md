# Storage

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> warn
> Game approval submissions are currently paused due to unforeseen circumstances. We apologize for the inconvenience. [Click here for more info.](https://support-dev.discord.com/hc/en-us/articles/360041437171)

We've been told that people playing games want to save their progress as they go, allowing them to come back where they left off and continue their epic journey of power.

Yeah, roguelikes. Even you.

Discord's storage manager lets you save data mapped to a key for easy reading, writing, and deleting both synchronously and asynchronously. It's saved to a super special directory, the Holy Grail of file mappings, that's unique per Discord user — no need to worry about your little brother overwriting your save file.

Creating this manager will also spawn an IO thread for async reads and writes, so unless you really want to be blocking, you don't need to be!

## Cloud Saves

If you want to take that save data on your players' computers and save it to those **BIG COMPUTERS** in the cloud, look no further! All you need to do is head over to your manifest config file and set the following property:

```js
{
  "storage": {
    "sync": true
  }
}
```

Yup, that's it! Don't know what this file is? Go read [Branches and Builds](#DOCS_DISPATCH_BRANCHES_AND_BUILDS/).

## Data Models

###### FileStat Struct

| name         | type   | description                                  |
| ------------ | ------ | -------------------------------------------- |
| Filename     | string | the name of the file                         |
| Size         | UInt64 | the size of the file                         |
| LastModified | UInt64 | timestamp of when the file was last modified |

## GetPath

> info
> Value from environment variable `DISCORD_STORAGE_PATH`

Returns the file path to which Discord saves files if you were to use the SDK's storage manager. Discord has branch-specific, user-specific saves, so you and your little brother will never overwrite each others' save files. If your game already has save file writing logic, you can use this method to get that user-specific path and help users protect their save files.

Returns a `string`.

###### Parameters

None

###### Example

```cs
var savePath = storageManager.GetPath();
Console.WriteLine("You should write your save files to {0}", savePath);
```

## Read

Reads data synchronously from the game's allocated save file into a buffer. The file is mapped by key-value pairs, and this function will read data that exists for the given key name.

Returns a `UInt32`.

###### Parameters

| name | type   | description                        |
| ---- | ------ | ---------------------------------- |
| name | string | the key name to read from the file |
| data | byte[] | the buffer to read into            |

## ReadAsync

Reads data asynchronously from the game's allocated save file into a buffer.

Returns a `Discord.Result` and a `byte[]` containing the data via callback.

###### Parameters

| name | type   | description                        |
| ---- | ------ | ---------------------------------- |
| name | string | the key name to read from the file |

###### Example

```cs
storeManager.ReadAsync("high_score", (result, data) =>
{
  if (result == Discord.Result.OK) {
    LoadHighScore(data);
  }
});
```

## ReadAsyncPartial

Reads data asynchronously from the game's allocated save file into a buffer, starting at a given offset and up to a given length.

Returns a `Discord.Result` and `byte[]` containing the data via callback.

###### Parameters

| name   | type   | description                          |
| ------ | ------ | ------------------------------------ |
| name   | string | the key name to read from the file   |
| offset | UInt64 | the offset at which to start reading |
| length | UInt64 | the length to read                   |

###### Example

```cs
storeManager.ReadAsyncPartial("high_score", 10, 8, (result, data) =>
{
  if (result == Discord.Result.OK) {
    LoadHighScore(data);
  }
});
```

## Write

Writes data synchronously to disk, under the given key name.

Returns `void`.

###### Parameters

| name | type   | description                 |
| ---- | ------ | --------------------------- |
| name | string | the key name to write under |
| data | byte[] | the data to write           |

###### Example

```cs
storageManager.Write("high_score", Encoding.UTF8.GetBytes("9999"));
```

## WriteAsync

Writes data asynchronously to disk under the given key name.

Returns a `Discord.Result` via callback.

###### Parameters

| name | type   | description                 |
| ---- | ------ | --------------------------- |
| name | string | the key name to write under |
| data | byte[] | the data to write           |

###### Example

```cs
storageManager.WriteAsync("high_score", Encoding.UTF8.GetBytes("9999"), (result) =>
{
  if (result == Discord.Result.OK)
  {
    Console.WriteLine("Wrote data");
  }
});
```

## Delete

Deletes written data for the given key name.

Returns `void`.

###### Parameters

| name | type   | description            |
| ---- | ------ | ---------------------- |
| name | string | the key name to delete |

###### Example

```cs
storageManager.Delete("high_score");
// Because you cheated. Jerk.
```

## Exists

Checks if data exists for a given key name.

Returns `bool`.

###### Parameters

| name | type   | description           |
| ---- | ------ | --------------------- |
| name | string | the key name to check |

###### Example

```cs
var highScore = storageManager.Exists("high_score");
if (!highScore)
{
  Console.WriteLine("Couldn't find any highscore for you. Did you cheat? Jerk.");
}
```

## Stat

Returns file info for the given key name.

Returns a `FileStat`.

###### Parameters

| name | type   | description                    |
| ---- | ------ | ------------------------------ |
| name | string | the key name get file data for |

###### Example

```cs
var file = storageManager.Stat("high_score");
Console.WriteLine("File {0} is {1} in size and was last edited at {2}", file.Name, file.Size, file.LastModified);
```

## Count

Returns the count of files for iteration.

Returns an `Int32`.

###### Parameters

None

###### Example

```cs
var numFiles = storageManager.Count();
for (int i = 0; i < numFiles; i++)
{
  Console.WriteLine("We're at file {0}", i);
}
```

## StatAt

Returns file info for the given index when iterating over files.

Returns a `FileStat`.

###### Parameters

| name  | type  | description                    |
| ----- | ----- | ------------------------------ |
| index | Int32 | the index to get file data for |

###### Example

```cs
var numFiles = storageManager.Count();
for (int i = 0; i < numFiles; i++)
{
  var file = storageManager.StatAt(i);
  Console.WriteLine("File is {0}", file.Name);
}
```

## Example: Saving, Reading, Deleting, and Checking Data

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var storageManager = discord.GetStorageManager();

// Create some nonsense data
var contents = new byte[20000];
var random = new Random();
random.NextBytes(contents);

// Write the data asynchronously
storageManager.WriteAsync("foo", contents, res =>
{
    // Get our list of files and iterate over it
    for (int i = 0; i < storageManager.Count(); i++)
    {
        var file = storageManager.StatAt(i);
        Console.WriteLine("file: {0} size: {1} last_modified: {2}", file.Filename, file.Size, file.LastModified);
    }

    // Let's read just a small chunk of data from the "foo" key
    storageManager.ReadAsyncPartial("foo", 400, 50, (result, data) =>
    {
        Console.WriteLine("partial contents of foo match {0}", Enumerable.SequenceEqual(data, new ArraySegment<byte>(contents, 400, 50)));
    });

    // Now let's read all of "foo"
    storageManager.ReadAsync("foo", (result, data) =>
    {
        Console.WriteLine("length of contents {0} data {1}", contents.Length, data.Length);
        Console.WriteLine("contents of foo match {0}", Enumerable.SequenceEqual(data, contents));

        // We just read it, but let's make sure "foo" exists
        Console.WriteLine("foo exists? {0}", storageManager.Exists("foo"));

        // Now delete it
        storageManager.Delete("foo");

        // Make sure it was deleted
        Console.WriteLine("post-delete foo exists? {0}", storageManager.Exists("foo"));
    });
});
```
