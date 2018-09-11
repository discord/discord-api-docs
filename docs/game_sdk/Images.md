# Images

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Discord is like a book; it's better with pictures. The image manager helps you fetch image data for images in Discord, including user's avatars. They worked hard to pick out those photos and gifs. Show them you care, too.

## Data Models

###### ImageDimensions Struct

| name   | type   | description             |
| ------ | ------ | ----------------------- |
| Height | UInt32 | the height of the image |
| Width  | UInt32 | the width of the image  |

###### ImageType Enum

| value | description              |
| ----- | ------------------------ |
| User  | image is a user's avatar |

###### ImageHandle Struct

| name | type      | description                                     |
| ---- | --------- | ----------------------------------------------- |
| Type | ImageType | the source of the image                         |
| Id   | Int64     | the id of the user whose avatar you want to get |
| Size | UInt32    | the resolution at which you want the image      |

## Fetch

Prepare's an image to later retrieve data about it.

Returns a `Discord.Result` and `ImageHandle` via callback.

###### Parameters

| name    | type        | description                                                 |
| ------- | ----------- | ----------------------------------------------------------- |
| handle  | ImageHandle | contains the desired userId and size for the returned image |
| refresh | bool        | whether to use cached data for fetch anew                   |

###### Example

```cs
var handle = new Discord.ImageHandle()
{
  Id = 53908232506183680,
  Size = 1024
};

imageManager.Fetch(handle, false, (result, handle) =>
{
  if (result == Discord.Result.OK)
  {
    imageManager.GetData(handle, (result, data) =>
    {
      // Do stuff with the byte[] data
    });
  }
});
```

## GetDimensions

Get's the dimensions for the given user's avatar's source image.

Returns `ImageDimensions`.

###### Parameters

| name   | type        | description                                                 |
| ------ | ----------- | ----------------------------------------------------------- |
| handle | ImageHandle | contains the desired userId and size for the returned image |

###### Example

```cs
var handle = new Discord.ImageHandle()
{
  Id = 53908232506183680,
  Size = 1024
};
var dimensions =  imageManager.GetDimentions(handle);
```

## GetData

Gets the image data for a given user's avatar.

Returns `Discord.Result` and `byte[]` via callback.

###### Parameters

| name   | type        | description                                  |
| ------ | ----------- | -------------------------------------------- |
| handle | ImageHandle | the image handle from the `Fetch()` callback |

###### Example

```cs
var handle = new Discord.ImageHandle()
{
  Id = 53908232506183680,
  Size = 1024
};

imageManager.Fetch(handle, false, (result, handle) =>
{
  if (result == Discord.Result.OK)
  {
    imageManager.GetData(handle, (result, data) =>
    {
      // Do stuff with the byte[] data
    });
  }
});
```

## Example: User's Avatar Data

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

// Request user's avatar data. Sizes can be powers of 2 between 16 and 2048
imageManager.Fetch(Discord.ImageHandle.User(53908232506183680), (result, handle) =>
{
  {
    if (result == Discord.Result.Ok)
    {
      // You can also use GetTexture2D within Unity.
      // These return raw RGBA.
      imageManager.GetData(handle, (result2, data) =>
      {
        Console.WriteLine("image updated {0} {1}", handle.Id, data.Length);
      });
    }
    else
    {
      Console.WriteLine("image error {0}", handle.Id);
    }
  }
};
```
