# Images

> info
> Need help with the SDK? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

> danger
> Selling SKUs on Discord has now been discontinued as of March 1, 2022. [Read here for more info.](https://support-dev.discord.com/hc/en-us/articles/4414590563479)

Discord is like a book; it's better with pictures. The image manager helps you fetch image data for images in Discord, including user's avatars. They worked hard to pick out those photos and gifs. Show them you care, too.

## Data Models

###### ImageDimensions Struct

| name   | type   | description             |
| ------ | ------ | ----------------------- |
| Width  | UInt32 | the width of the image  |
| Height | UInt32 | the height of the image |

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

Prepares an image to later retrieve data about it.

Returns a `Discord.Result` and `Discord.ImageHandle` via callback.

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

imageManager.Fetch(handle, false, (result, returnedHandle) =>
{
  if (result == Discord.Result.Ok)
  {
    var data = imageManager.GetData(returnedHandle);
    // Do stuff with the byte[] data
  }
});
```

## GetDimensions

Gets the dimensions for the given user's avatar's source image.

Returns `Discord.ImageDimensions`.

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
var dimensions =  imageManager.GetDimensions(handle);
```

## GetData

Gets the image data for a given user's avatar. In C#, this is overloaded by a helper function that will directly return a `byte[]` with the image data in it. In C++/C, this function reads image data into a passed pointer of defined size.

###### Parameters

| name   | type        | description                                   |
| ------ | ----------- | --------------------------------------------- |
| handle | ImageHandle | the image handle from the `Fetch()` callback  |
| data   | uint8_t\*   | a buffer to read image data into (C++/C only) |
| size   | uint        | the size of the buffer (C++/C only)           |

###### Example

```cs
var handle = new Discord.ImageHandle()
{
  Id = 53908232506183680,
  Size = 1024
};

imageManager.Fetch(handle, false, (result, handle) =>
{
  if (result == Discord.Result.Ok)
  {
    var data = imageManager.GetData(handle);
    // Do stuff with data now
  }
});
```

###### Example Cpp

```cpp
core->ImageManager().Fetch(
    handle, true, [&state](discord::Result res, discord::ImageHandle handle) {
        if (res == discord::Result::Ok) {
            discord::ImageDimensions dims{};
            state.core->ImageManager().GetDimensions(handle, &dims);
            std::cout << "Fetched " << dims.GetWidth() << "x" << dims.GetHeight()
                      << " avatar!\n";

            std::vector<uint8_t> data;
            data.reserve(dims.GetWidth() * dims.GetHeight() * 4);
            uint8_t* d = data.data();
            state.core->ImageManager().GetData(handle, d, data.size());
        }
    }
);
```

## GetTexture

> warn
> This is only exposed in Unity

Gets the `Texture2D` for a given user's avatar for use within a Unity environment.

Returns a `Texture2D`.

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
  if (result == Discord.Result.Ok)
  {
    var texture = imageManager.GetTexture(handle);
    // Do stuff with texture now
  }
});
```

## Example: User's Avatar Data

```cs
var discord = new Discord.Discord(clientId, Discord.CreateFlags.Default);

// Request user's avatar data. Sizes can be powers of 2 between 16 and 2048
imageManager.Fetch(Discord.ImageHandle.User(53908232506183680, 128), (result, handle) =>
{
  {
    if (result == Discord.Result.Ok)
    {
      // If you are working in Unity, you can also use GetTexture()
      // Which is only exposed for Unity builds
      // These return raw RGBA.
      var data = imageManager.GetData(handle);
    }
    else
    {
      Console.WriteLine("image error {0}", handle.Id);
    }
  }
};
```
