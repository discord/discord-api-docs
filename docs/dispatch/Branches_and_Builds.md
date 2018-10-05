# Branches and Builds

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

In order for other people to download your game from Discord's servers, you need to _upload_ your game to Discord's servers. Let's learn how to do that!

## Getting Set Up

First, get Dispatch. If you don't already have it, ask us for access!

You'll want to be able to use Dispatch across your projects, so let's handle that now by adding it to our PATH.

**MacOS/Linux:**

Bust out those \*nix skills.

- Open your choice of terminal
- Stick dispatch in a folder that will be added to your PATH. If you don't have a good spot for this stuff already, you can `mkdir ~/bin/` and call that Dispatch's new home (as well as any other executables you might want to access in the future)
- In that folder, run `chmod u+x dispatch-macos` so that Dispatch can be used as an executable
  - Feel free to also rename `dispatch-macos` to just `dispatch` if you don't feel like typing so much
- Add that ~/bin directory to your path in a permanent way. I have `export PATH=$PATH:~/bin` at the bottom of my `~/.zshrc`, or `~/.bashrc`
- Restart your terminal
- `echo $PATH` and make sure you see the directory in the output
- Run `dispatch --help` to make sure it works

You're good! You can now call the dispatch command from anywhere!

**Windows**

Not as 1337 as some scripting skillz, but the Windows GUI will do just fine

- Stick `dispatch-x64` or `dispatch-x86`, depending on your OS, in a folder that will be added to your PATH
  - Feel free to rename it to just `dispatch` if you don't feel like typing so much
- Hit that Windows key and start typing "Environment Variables"
- Select "Edit the system environment variables"
- Hit the "Environment Variables" button in the bottom right
- Edit the PATH entry for either the system or the current user, adding dispatch's directory
- Restart your command line
- Run `dispatch --help` to make sure it works

You're good! You can now call the dispatch command from anywhere!

> info
> Want some really fancy skills? You can set up autocompletions for dispatch in whatever shell you work.
> Run `dispatch completions -—help` to see instructions for a variety of popular shells.

## Authorizing Yourself to Use It

Run `dispatch login`, which will open a web browser and prompt you to authorize your Discord account with Dispatch.

Yup, that's it.

ONWARDS!

## Creating Branches

> During development time, we ask that you DO NOT create your own OAuth2 application. When you are ready to begin development, let someone on the Discord team know, and we will create an application for you and assign it to your account. We have some special flags that we need to enable on your behalf.

Now that we're set up to use the tool, let's make some branches! Branches, builds, and everything in between in Discord are tied to an application. To get one for your game, ask a Discord team member to hook you up!

Then, head over to our [developer portal](https://discordapp.com/developers/), click into that new application, and copy the `Client Id` at the top of the page, keeping it handy throughout this process. Client ID and "application id" are interchangeable phrases. For the rest of this documentation, we'll refer to it as application id.

Back to your terminal, type:

```
dispatch branch create <application_id> <branch_name>
```

This will create a named branch under that application id that can be pushed to. You can see your branches with:

```
dispatch branch list <application_id>
```

## Setting Up Our First Build

In order for Discord to understand what you're sending, you need to set up a config file for your game. This config file tells Discord which files to bundle together, how to run them, and other metadata to include. You should keep this file safe in your version control system of choice; that way, Discord is always up to date with whatever you've got locally. You'll reference these manifests later when building your store pages, so that Discord knows what to download to someone's computer when they hit that Big Buy Button.

Let's break an example `config.json` file down into pieces, and then put it together at the end.

## Basic Information

```js
{
  "application": {
    "id": 467102538279999224,
    "manifests": []
  }
}
```

This is the top level of the config file. It has an `application` object at the top. `id` is your application id. `manifests` are the heart of this file, and offer a lot of customization for tagging and uploading data for the build. Let's jump into that now.

## Labels, Platforms, and Local Roots

```js
{
  "label": "my-awesome-game/windows",
  "platforms": ["win32", "win64"],
  "locales": [],
  "local_root": "./game-files/windows",
  "redistributables": [
    "directx_june_2010"
  ]
}
```

We're in the heart of a manifest now! `label` is the name you want to give an individual manifest/bundle of files. Make these easily identifiable so you can reference them later in your store page creation.

`platforms` are the platforms for which the manifest is valid. Most simple configs, like our example, will use the same manifest for `win32` and `win64`, and then make other manifests for `osx` and `linux`. However, some older games may need specific configurations for 32bit and 64bit systems, and therefore need separate manifests.

`locales` is an array of locales for which the manifest is valid; leaving it empty denotes it's valid for all locales. For example, your base game files will probably have an empty `locales` array, but you may other manifests for things like language packs defined for `es-ES` or `fr` or other locales.

`local_root` is the relative path to the directory that contains the raw game files to upload for this manifest. This may be particularly useful if you have multiple manifests with different relative root directories, like:

```json
// Imaginary directory structure:
// C:\game\binary
// C:\game\langs\en-US
// C:\game\langes\fr

"manifests": [
  {
    "label": "game-files",
    "local_root": "binary",
  },
  {
    "label": "english-language-pack",
    "local_root": "en-US",
  },
  {
    "label": "french-language-pack",
    "local_root": "fr",
  }
]
```

That way, you can `dispatch build push` from your actual root directory, but dispatch will be smart enough to separate the files properly.

`redistributables` is an array of any redistributable packages your game may need to function, like a certain install of DirectX, or a Microsoft C++ redistributable. A list of valid values can be found in [Field Values](#DOCS_DISPATCH_FIELD_VALUES/).

## File Rules

```js
{
  "file_rules": {
    "mappings": [
      {
        "local_path": ".",
        "install_path": "."
      },
      {
        "local_path": "./languages/en-US/no-but-the-data-is-really-in-here/"
        "install_path": "./english"
      }
    ],
    "properties": [
      {
        "install_path": "save/*",
        "attributes": ["user_data"]
      }
    ],
    "exclusions": [
      {
        "local_path": "**/*.pdb"
      }
    ]
  }
}
```

File rules is a special, and somewhat confusing, part of the manifest, but we'll get through it together! The `file_rules` object lets you:

1. Specify the way in which files get installed on a user's computer
2. Mark files as protected, so they don't get overwritten
3. Exclude certain files from being uploaded

`mappings` lets you tell Dispatch to download files to a certain place in the install directory on a user's machine, letting you create the folder structure you need. Your game build files may be tucked deep in a subdirectory on your machine, because who ever cleans up folder structures, but you can make sure it looks nice and clean for your players.

`properties` allows you to mark properties on globs of files. In this case, marking a glob of files as `user_data` tells Dispatch not to touch these files in any way if it sees them; don't want that save data overwritten!

`exclusions` also allow you to mark off globs of files. File globs here will not be uploaded by Dispatch on a build push. In the above example, debug files that match the `*.pdb` pattern in any directory will be ignored.

> warn
> Dispatch supports [Rust globbing patterns](https://docs.rs/glob/0.2.11/glob/struct.Pattern.html).

## Cloud Storage

```js
{
  "storage": {
    "sync": true,
    "roots": [
      {
        "id": "my-save-files",
        "paths": [
          {
            "platform": "windows",
            "path": "${DOCUMENTS}/My Games/My Awesome Game/Saves"
          },
          {
            "platform": "macos",
            "path": "${DOCUMENTS}/Games/My Awesome Game/Saves"
          }
        ],
        "patterns": ["**/*"]
      }
    ]
  }
}
```

Discord supports cloud saves! Let's learn how to use it! This piece of the manifest, `storage`, helps Discord support cloud saves for your game. When `sync` is set to `true`, Discord will look in the `paths` provided here for any files that match one of the `patterns`. If it finds any, it will sync them to the cloud, so your user will have access to them across machines.

If you are **not** using our [Storage Manager](#DOCS_GAME_SDK_STORAGE/) to manage your game's save files, make sure to outline your save paths and file glob patterns here.

If you **are** using the Storage Manager in the GameSDK, just set `sync` to `true` and omit the `roots` key.

> danger
> `id` must be a constant, immutable value once set. You can pick whatever you'd like when first set, but ensure it does not change afterwards. Otherwise, Discord may incorrectly overwrite and/or delete users' save data.

We support a number of filepath replacements/shorteners like `{$DOCUMENTS}`, so you can have something like `${SAVEDGAMES}/My Awesome Game/${USERID}` and create user-specific save files. No longer will you need to worry about your little brother overwriting your save file! For the full list of path replacements, see [Cloud Save Path Replacements](#DOCS_DISPATCH_FIELD_VALUES/manifests-cloud-save-path-replacements).

As a side note, there may be a case where you might have multiple manifests that each have storage information defined. In the case that the two manifests define the same storage path but have _conflicting_ data, the source of truth will be the manifest that appears **later** in the array in the config file. So, if you have:

```js
{
  "manifests": [
    {
      "label": "one",
      "storage": {
        "sync": true,
        "roots": [
          "id": "one",
          "paths": [
            {
              "platform": "win32",
              "path": "${HOME}"
            },
            "patterns": ["**/*"]
          ]
        ]
      }
    },
    {
      "label": "two",
      "storage": {
        "sync": true,
        "roots": [
          "id": "two",
          "paths": [
            {
              "platform": "win32",
              "path": "${HOME}"
            },
            "patterns": ["**/*"]
          ]
        ]
      }
    }
  ]
}
```

Then, manifest `two` would be the source of truth in a data conflict. Wew, ok, good work. On to the next part!

## Registry Keys and Install Scripts

```js
{
  "post_install_scripts": {
    "win32": [
      {
        "name": "SDB Compatibility",
        "executable": "Install.bat",
        "arguments": ["/silent"],
        "requires_elevation": true
      },
    ],
    "win64": [
      {
        "name": "SDB Compatibility",
        "executable": "Install.bat",
        "arguments": ["/silent"],
        "requires_elevation": true
      }
    ]
  },
  "registry_keys": [
    {
      "key": "Software\\My Game Company\\My Awesome Game\\FixAspctRatio",
      "value": "1"
    }
  ]
}
```

Some games may need specific registry keys set after installation, or might have some installation scripts that need to be run. If so, those can be set here!

For installation scripts, `name` is a user friendly name that Discord will surface to users when explaining what's happening during the installation process. `executable` is the name of the script that needs to be run. `arguments` is an array that takes any arguments that may need to be passed to the script. `requires_elevation`, when marked `true`, will run the install scripts with elevated privileges; for some Windows users, this may force a User Access Control security popup.

`registry_keys` is a simple array of key/value pairs that will be written to the user's computer's registry. By default, Discord will create these keys in `HKEY_CURRENT_USER`. If your game requires registrty keys in `HKEY_LOCAL_MACHINE`, they can be specified like:

```js
{
  "key": "HKEY_LOCAL_MACHINE\\SOFTWARE\\My Game Company\\My Awesome Game\\MagicFix",
  "value": "1"
}
```

Don't forget to the notice the double forward slashes in the path name!

## Launch Options

```js
{
  "launch_options": [
    {
      "name": "My Awesome Game",
      "executable": "my-awesome-game.exe",
      "arguments": [],
      "platforms": ["win32", "win64"]
    },
    {
      "name": "My Awesome Map Editor",
      "executable": "my-awesome-map-editor.exe",
      "arguments": [],
      "platforms": ["win32", "win64"]
    }
  ]
}
```

The last bit of the config file is the launch options for your game. This is where you should tell Discord which executables your game can launch. In most cases, you'll just have one object, which is the main executable for your game. However, in the case that your game may have multiple executables that users can launch, you can specify all of them here.

> danger
> The `name` field _must_ be unique for each launch option.

When launching the game from their Game Library, players will be able to choose which executable is being launched, with the first option in the list as the default. So, for example, if your game comes with the game and a map editor, they'll have access to both without needing multiple entries in their library. Discord will smartly remember their choice for the future, but they'll always have the option to swap to a different one if they want.

You can also specify any arguments that need to be passed to your game on launch, like `--fullscreen` or `--console` or `--360-no-scope`.

## All Together Now

Let's see what one looks like all together!

```js
{
  "application": {
    "id": 467102538279999224,
    "manifests": [
      {
        "label": "my-awesome-game/windows",
        "platforms": ["win32", "win64"],
        "locales": [],
        "local_root": "./",
        "file_rules": {
          "mappings": [
            {
              "local_path": ".",
              "install_path": "."
            }
          ],
          "properties": [
            {
              "install_path": "save/*",
              "attributes": ["user_data"]
            }
          ],
          "exclusions": [
            {
              "local_path": "**/*.pdb"
            }
          ]
        },
        "storage": {
          "sync": true,
          "roots": [
            {
              "id": "my-save-files",
              "paths": [
                {
                  "platform": "windows",
                  "path": "${DOCUMENTS}/My Games/My Awesome Game/Saves"}
                },
                {
                  "platform": "macos",
                  "path": "${DOCUMENTS}/Games/My Awesome Game/Saves"
                },
                "patterns": ["**/*"]
              ]
            }
          ]
        },
        "post_install_scripts": {
          "win32": [
            {
              "name": "SDB Compatibility",
              "executable": "Install.bat",
              "arguments": ["/silent"],
              "requires_elevation": true
            },
          ],
          "win64": [
            {
              "name": "SDB Compatibility",
              "executable": "Install.bat",
              "arguments": ["/silent"],
              "requires_elevation": true
            }
          ]
        },
        "registry_keys": [
          {
            "key": "Software\\My Game Company\\My Awesome Game\\FixAspctRatio",
            "value": "1"
          }
        ],
        "launch_options": [
          {
            "name": "My Awesome Game",
            "executable": "my-awesome-game.exe",
            "arguments": [],
            "platforms": ["win32", "win64"]
          },
          {
            "name": "My Awesome Map Editor",
            "executable": "my-awesome-map-editor.exe",
            "arguments": [],
            "platforms": ["win32", "win64"]
          }
        ]
      }
    ]
  }
}
```

It seems like a lot of lines to parse, but now you know what they all mean!

## DRM

You can choose to add DRM to your game. Dispatch will wrap your executables and prevent a user from launching the game if they are not logged into Discord.

> danger
> This is a destructive operation. It will wrap your executable in place. It will not back up your executable. Make sure you have a backup somewhere else.

If you understand and agree to the above, run the following command on each of the executables you want to wrap.

```
dispatch build drm-wrap <application_id> <path_to_executable_to_wrap>
```

## Pushing Our First Build

We've got all our files ready for processing; let's ship this baby!

```
dispatch build push <branch_id> <path_to_config> <path_to_files_to_upload>
```

You'll see a bunch of request logging as it gets sent up to Discord—when it's done, you're greeted with a friendly completion message:

```
[2018-06-14][11:38:51][INFO] Pushed build. build_id=456889899375656960
```

To double check that it's all ready for publishing, run:

```
dispatch build list <application_id> <branch_id>
```

You'll see a table with the current status of your builds. Once the one you uploaded is marked as READY, you're good to publish it to the masses!

## Publishing Our First Build

Once you're ready to make a build live, run:

```
dispatch build publish <application_id> <branch_id> <build_id>
```

To make sure it worked, you can again run:

```
dispatch branch list <application_id>
```

And look for a `LIVE_BUILD_ID` under your application!

## Downloading a Build for Testing

Now that you've got a build pushed and published, we should make sure that what you've sent out into the world works as intended. You can download your published build on a given branch to your local machine with the command:

```
dispatch build update <application_id> <branch_id> <install_path> --platform <value> --locale <value>
```

`install_path` is any filepath on your local machine; this is where the files will be downloaded to. `--platform` and `--locale` are whatever values you set as valid platforms and locales in your config file for a given build. The default probably looks something like `win64` and `en-US`.

Here's an example of the command with our info:

```
dispatch build update 467102538279999224 456889899375659999 C:\my-game C:\my-game\MANIFEST --platform win64 --locale en-US
```

Now you can run the executable for your game in that directory and make sure it works!

## Patching

If you need to push out a patch or a new build, no problem! Just repeat the process:

- Update your game files locally to whatever they need to be
- Push your build again
- Publish the build again
- List your branches to make sure the new build is live

Discord will do some magic in the background to diff your files, ensuring that your players only have to download the changes they need and letting them do it quickly so they can get back in the game. Or, really, without them even needing to know there _was_ a patch! Your players will automatically download your latest and greatest stuff, and quickly!

Now that you've got a game in the system, let's [create a store page](#DOCS_DISPATCH_MANAGING_STORE_LISTINGS) for it!
