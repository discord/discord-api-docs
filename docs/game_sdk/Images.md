# Images

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Discord is like a book; it's better with pictures. The image manager helps you fetch image data for images in Discord, including user's avatars. They worked hard to pick out those photos and gifs. Show them you care, too.

### Data Models

```cs
struct ImageDimensions
{
  UInt32 Height;
  UInt32 Width;
};

struct ImageHandle
{
  ImageType Type;
  Int64 Id;
  UInt32 Size;
};

enum ImageType
{
  User
};
```

### Methods

```cs
void Fetch(ImageHandle handle, bool refresh (Discord.Result result, ImageHandle handle) =>
{
  // Prepares user avatar data for getting
  // Refresh tells Discord whether or not to use cached data or fetch anew
});

ImageDimensions GetDimentions(ImageHandle handle);
// Gets dimensions for current user's avatar

void GetData(ImageHandle handle, (Discord.Result result, byte[] data) =>
{
  // Gets image data for current user's avatar
});
```

### Example: A Helper Method for Getting a User's Avatar Data

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

// Request user's avatar data. Sizes can be powers of 2 between 16 and 2048
static void FetchAvatar(Discord.ImagesManager imagesManager, Int64 userID)
{
  imagesManager.Fetch(Discord.ImageHandle.User(userID), (result, handle) =>
  {
    {
      if (result == Discord.Result.Ok)
      {
        // You can also use GetTexture2D within Unity.
        // These return raw RGBA.
        var data = imagesManager.GetData(handle);
        Console.WriteLine("image updated {0} {1}", handle.Id, data.Length);
      }
      else
      {
        Console.WriteLine("image error {0}", handle.Id);
      }
    }
  });
};
```
