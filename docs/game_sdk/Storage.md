# Storage

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

We've been told that people playing games want to save their progress as they go, allowing them to come back where they left off and continue their epic journey of power.

Yeah, roguelikes. Even you.

If you need to save some data to some disks on your players' computers (and eventually some disks on those **BIG COMPUTERS** in the cloud), look no further! We've got the manager for you.

Discord's storage manager lets you save data mapped to a key for easy reading, writing, and deleting both synchronously and asynchronously. It's saved to a super special directory, the Holy Grail of file mappings, that's unique per Discord user—need to worry about your little brother overwriting your save file. In the future, Discord will keep _really_ close eyes on that directory and sync any changes to the data to cloud storage.

Creating this manager will also spawn an IO thread for async reads and writes, so unless you really want to be blocking, you don't need to be!

### Data Models

```cs
struct FileStat
{
  string Filename;
  UInt64 Size;
  UInt64 LastModified;
};
```

### Methods

```cs
UInt32 Read(string name, byte[] data);
// Reads data synchronously from disk into the buffer
// Looks for data mapped under given key name

void ReadAsync(string name, (Discord.Result result, byte[] data) =>
{
  // Reads data asynchronously from disk into the buffer
  // Looks for data mapped under given key name
});

void ReadAsyncPartial(string name, UInt64 offset, UInt64 length, (Discord.Result result, byte[] data) =>
{
  // Reads data asynchronously from disk into the buffer
  // Starts at the given offset and reads up to length
  // Looks for data mapped under given key name
});

void Write(string name, byte[] data);
// Writes data synchronously to disk
// Mapped to the given key name

void WriteAsync(string name, byte[] data, (Discord.Result result) =>
{
  // Writes data asynchronously to disk
  // Mapped to the given key name
});

void Delete(string name);
// Deletes the data for the given key name

bool Exists(string name);
// Checks if data exists under the given key name
// Returns a boolean

FileStat Stat(string name);
// Returns file info for the given key name
// In the form of a File struct

Int32 Count();
// Returns the count of files returned for iteration

FileStat StatIndex(int index);
// Returns file info for the given index
// In the form of a FIle struct
```

### Example: Saving, Reading, Deleting, and Checking Data

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);
var storageManager = discord.CreateStorageManager();

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
        var file = storageManager.StatIndex(i);
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
