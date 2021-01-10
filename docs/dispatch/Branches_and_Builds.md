# Branches and Builds

> info
> Need help with Dispatch? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

In order for other people to download your game from Discord's servers, you need to _upload_ your game to Discord's servers. Let's learn how to do that!

## Getting Set Up

First, get Dispatch for your operating system.

- [Windows 64](https://dl-dispatch.discordapp.net/download/win64)
- [Windows 32](https://dl-dispatch.discordapp.net/download/win32)
- [Mac](https://dl-dispatch.discordapp.net/download/macos)
- [Linux](https://dl-dispatch.discordapp.net/download/linux)

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
> Want some really fancy skills? You can set up autocompletion for dispatch in whatever shell you work.
> Run `dispatch completions -—help` to see instructions for a variety of popular shells.

## Authorizing Yourself to Use It

Run `dispatch login`, which will open a web browser and prompt you to authorize your Discord account with Dispatch.

Yup, that's it.

A small thing to note - the default `login` method works via an OAuth2 bearer token with special scopes. That means that if you run `dispatch login` on another machine—like a CI setup—it will invalidate your other tokens. If you want to set up build machines for your game, you'll want to use an alternate method of authorization.

First, find the `credentials.json` file at:

- Windows: `C:\Users\<you>\.dispatch\credentials.json`
- macOS: `~/.dispatch/credentials.json`

Inside that, we can use our Bot token for our application that will _not_ be invalidated across different machines.

> info
> Note that this token is only good for its owning application, so if you want to make one build machine deploy multiple applications, you'll need to edit this file per game.

You can get your bot token by going to your app in the Dev Portal --> `Bot` --> `Add Bot` --> copy the token. In our credentials file, replace the JSON with:

```json
{
  "BotCredentials": {
    "application_id": "my_application_id",
    "token": "my_token"
  }
}
```

Voila! You can now use dispatch for that application with this token.

ONWARDS!

## Creating Branches

> warn
> If you have not yet set up a Team and an application, please follow the steps in [Get Set Up](#DOCS_GAME_SDK_SDK_STARTER_GUIDE/get-set-up)

Now that we're set up to use the tool let's make some branches! Branches, builds, and everything in between in Discord is tied to an application. To get one for your game, ask a Discord team member to hook you up!

Then, head over to our [developer portal](https://discord.com/developers/), click into that new application and copy the `Client Id` at the top of the page, keeping it handy throughout this process. Client ID and "application id" are interchangeable phrases. For the rest of this documentation, we'll refer to it as application id.

Back to your terminal, type:

```
dispatch branch create <application_id> <branch_name>
```

This will create a named branch under that application id that can be pushed to. You can see your branches with:

```
dispatch branch list <application_id>
```

## Setting Up Our First Build

In order for Discord to understand what you're sending, you need to set up a config file for your game. This config file tells Discord which files to bundle together, how to run them, and other metadata to include. You should keep this file safe in your version control system of choice; that way, Discord is always up to date with whatever you've got locally. You'll reference these manifests later when building your store pages so that Discord knows what to download to someone's computer when they hit that Big Buy Button.

Let's break an example `config.json` file down into pieces and then put it together at the end.

## Basic Information

```js
{
  "application": {
    "id": 467102538279999224,
    "manifests": []
  }
}
```

This is the top level of the config file. It has an `application` object at the top. `id` is your application id. `manifests` are the heart of this file and offer a lot of customization for tagging and uploading data for the build. Let's jump into that now.

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

`platforms` are the platforms for which the manifest is valid. Most simple configs, like our example, will use the same manifest for `win32` and `win64`, and then make other manifests for `osx` and `linux`. However, some older games may need specific configurations for 32bit and 64bit systems and therefore need separate manifests.

`locales` is an array of locales for which the manifest is valid; leaving it empty denotes it's valid for all locales. For example, your base game files will probably have an empty `locales` array, but you may other manifests for things like language packs defined for `es-ES` or `fr` or other locales.

`local_root` is the relative path to the directory that contains the raw game files to upload for this manifest. This may be particularly useful if you have multiple manifests with different relative root directories, like:

```json
// Imaginary directory structure:
// C:\game\binary
// C:\game\langs\en-US
// C:\game\langes\fr

{
  "manifests": [
    {
      "label": "game-files",
      "local_root": "binary"
    },
    {
      "label": "english-language-pack",
      "local_root": "en-US"
    },
    {
      "label": "french-language-pack",
      "local_root": "fr"
    }
  ]
}
```

That way, you can `dispatch build push` from your actual root directory, but dispatch will be smart enough to separate the files properly.

`redistributables` is an array of any redistributable packages your game may need to function, like a certain install of DirectX or a Microsoft C++ redistributable. A list of valid values can be found in [Field Values](#DOCS_DISPATCH_FIELD_VALUES/).

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
        "local_path": "./languages/en-US/no-but-the-data-is-really-in-here/",
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
      },
      {
        "local_path": "**/*.verycoolfile"
      }
    ]
  }
}
```

File rules are a special and somewhat confusing part of the manifest, but we'll get through it together! The `file_rules` object lets you:

1. Specify the way in which files get installed on a user's computer
2. Mark files as protected, so they don't get overwritten
3. Exclude certain files from being uploaded

`mappings` lets you tell Dispatch to download files to a certain place in the install directory on a user's machine, letting you create the folder structure you need. Your game build files may be tucked deep in a subdirectory on your machine because whoever cleans up folder structures, but you can make sure it looks nice and clean for your players.

`properties` allows you to mark properties on globs of files. In this case, marking a glob of files as `user_data` tells Dispatch not to touch these files in any way if it sees them; don't want that save data overwritten!

`exclusions` also allow you to mark off globs of files. File globs here will not be uploaded by Dispatch on a build push. In the above example, debug files that match the `*.pdb` or `*.verycoolfile` patterns in any directory will be ignored.

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
> `id` must be a constant, immutable value once set. You can pick whatever you'd like when first set, but ensure it does not change afterward. Otherwise, Discord may incorrectly overwrite and/or delete users' save data.

We support a number of file path replacements/shorteners like `{$DOCUMENTS}`, so you can have something like `${SAVEDGAMES}/My Awesome Game/${USERID}` and create user-specific save files. No longer will you need to worry about your little brother overwriting your save file! For the full list of path replacements, see [Cloud Save Path Replacements](#DOCS_DISPATCH_FIELD_VALUES/manifests-cloud-save-path-replacements).

As a side note, there may be a case where you might have multiple manifests that each have storage information defined. In the case that the two manifests define the same storage path but have _conflicting_ data, the source of truth will be the manifest that appears **later** in the array in the config file. So, if you have:

```js
{
  "manifests": [
    {
      "label": "one",
      "storage": {
        "sync": true,
        "roots": [
          {
            "id": "one",
            "paths": [
              {
                "platform": "windows",
                "path": "${HOME}"
              }
            ],
            "patterns": ["**/*"]
          }
        ]
      }
    },
    {
      "label": "two",
      "storage": {
        "sync": true,
        "roots": [
          {
            "id": "two",
            "paths": [
              {
                "platform": "windows",
                "path": "${HOME}"
              }
            ],
            "patterns": ["**/*"]
          }
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
  "install_scripts": [
    {
      "name": "SDB Compatibility",
      "executable": "Install.bat",
      "arguments": ["/silent"],
      "requires_admin": true,
      "platforms": ["win32", "win64"],
      "completion_registry_key": {
        "key": "Software\\My Game Company\\InstallScripts\\SDB-win32",
        "value": 1
      }
    }
  ],
  "registry_keys": [
    {
      "key": "Software\\My Game Company\\My Awesome Game\\FixAspctRatio",
      "value": "1"
    }
  ]
}
```

Some games may need specific registry keys set after installation or might have some installation scripts that need to be run. If so, those can be set here!

For installation scripts, `name` is a user-friendly name that Discord will surface to users when explaining what's happening during the installation process. `executable` is the name of the script that needs to be run. `arguments` is an array that takes any arguments that may need to be passed to the script. `requires_admin`, when marked `true`, will run the install scripts with admin privileges; for some Windows users, this may force a User Access Control security popup. You must also tell Discord the `completion_registry_key` of the scripts so that we know not to try and run the script again if the given registry key is found on the user's machine.

`registry_keys` is a simple array of key/value pairs that will be written to the user's computer's registry. By default, Discord will create these keys in `HKEY_CURRENT_USER`. If your game requires registry keys in `HKEY_LOCAL_MACHINE`, they can be specified like:

```js
{
  "key": "HKEY_LOCAL_MACHINE\\SOFTWARE\\My Game Company\\My Awesome Game\\MagicFix",
  "value": "1"
}
```

Don't forget to notice the double backward slashes in the pathname!

## Launch Options

```js
{
  "launch_options": [
    {
      "name": "My Awesome Game",
      "executable": "my-awesome-game.exe",
      "arguments": [],
      "platforms": ["win32", "win64"],
      "working_dir": "important-files-here/"
    },
    {
      "name": "My Awesome Map Editor",
      "executable": "my-awesome-map-editor.exe",
      "arguments": [],
      "platforms": ["win32", "win64"],
      "working_dir": "important-files-here/"
    }
  ]
}
```

The last bit of the config file is the launch options for your game. This is where you should tell Discord which executables your game can launch. In most cases, you'll just have one object, which is the main executable for your game. However, in the case that your game may have multiple executables that users can launch, you can specify all of them here.

> warn
> The `name` field _must_ be unique for each launch option.

When launching the game from their Game Library, players will be able to choose which executable is being launched, with the first option in the list as the default. So, for example, if your game comes with the game and a map editor, they'll have access to both without needing multiple entries in their library. Discord will smartly remember their choice for the future, but they'll always have the option to swap to a different one if they want.

You can also specify any arguments that need to be passed to your game on launch, like `--fullscreen` or `--console` or `--360-no-scope`.

If your game needs to have a specific working directly, you can also specify that here. Otherwise, we'll default to the `content/` folder in the install directory.

> danger
> Currently, `executable` and `working_dir` are relative to the _install path_ on a user's machine, not your local root. This path is `${INSTALLDIR}/content/` unless otherwise specified in [File Rules](#DOCS_DISPATCH_BRANCHES_AND_BUILDS/file-rules).

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
            },
            {
              "local_path": "**/*.verycoolfile"
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
        },
        "install_scripts": [
          {
            "name": "SDB Compatibility",
            "executable": "Install.bat",
            "arguments": ["/silent"],
            "requires_admin": true,
            "platforms": ["win32", "win64"],
            "completion_registry_key": {
              "key": "Software\\My Game Company\\InstallScripts\\SDB-win32",
              "value": 1
            }
          }
        ],
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
            "platforms": ["win32", "win64"],
            "working_dir": "important-files-in-here/"
          },
          {
            "name": "My Awesome Map Editor",
            "executable": "my-awesome-map-editor.exe",
            "arguments": [],
            "platforms": ["win32", "win64"],
            "working_dir": "important-files-in-here/"
          }
        ]
      }
    ]
  }
}
```

It seems like a lot of lines to parse, but now you know what they all mean!

## Multiple Manifests and DLC Content

If you're publishing a game with additional DLC content, this section is for you! Oftentimes in newer games, a user purchasing DLC content does not necessarily mean them downloading additional files to their computer, like expansion packs of ye olden days. A game will see that a user is entitled to a new thing, some flag in the code will flip, and presto! They can now explore the new area.

However, some games do rely on downloading additional files for DLC content. If that is the case with your game, let's see how Dispatch can help. What's gonna help here is making use of multiple manifests. When you create a `config.json` file to upload your game, you've got something that looks sort of like this:

```json
// A much smaller config example than the behemoth just above
{
  "application": {
    "id": 1234567890,
    "manifests": [
      {
        // a bunch of stuff
      }
    ]
  }
}
```

"manifests" is an array, which means it can contain multiple items. What you'll want to do is create two manifests: one for your base game and one for your DLC. Depending on how your build folder is set up, you can exclude the DLC files from being uploaded when you upload the base game. Let's pretend your build folder—the one on your local computer that you're uploading from—looks like this:

```
game/
|_ config.json
|_ build/
   |_ game_data
      |_ Assets/
          |_ AssetBundles/
             |_ Base/
             |_ DLC/
```

Your manifest would look something like this:

```
{
  "application": {
    "id": your_app_id,
    "manifests": [
      {
        "label": "base-game",
        "local_root": "build",
        "file_rules": {
          "mappings": [
            {
              "local_path": ".",      // This makes the files appear in the base content/ directory, trust me :D
              "install_path": "."
            }
          ],
          "exclusions": [
            {
              "local_path": "./game_data/Assets/AssetBundles/DLC"    // This manifest will NOT include the DLC
            }
          ]
        },
        // The rest of the config with launch options, etc.
      },
      {
        "label": "dlc", // Now we have a second manifest for the DLC files
        "local_root": "build/game_data/Assets/AssetBundles/DLC", // Uploading files from the DLC folder
        "file_rules": {
          "mappings": [
            {
              "local_path": ".",
              "install_path": "./game_data/Assets/AssetBundles/DLC" // Puts the DLC in the proper folder structure
            }
          ]
        }
      }
    ]
  }
}
```

So, what we've done is defined two manifests—or bundles of files—in one config. Now, how do we make 'em work?

When you create SKUs in the dev portal, you assign manifests to SKUs. You'll want to assign `base-game`​ to your base game SKU and `dlc` ​to your DLC. Now, when players buy your base game, they'll get entitlement to the `base-game` manifest, and Discord will only download that one. Once they purchase `dlc`, they'll become entitled to that manifest, and Discord will patch the game with the new content they received.

## DRM

You can choose to add DRM to your game. Dispatch will wrap your executables and prevent a user from launching the game if they are not logged into Discord.

> danger
> This is a destructive operation. It will wrap your executable in place. It will not back up your executable. Make sure you have a backup somewhere else.

If you understand and agree to the above, run the following command on each of the executables you want to wrap.

```
dispatch build drm-wrap <application_id> <path_to_executable_to_wrap>
```

This function will only work with Windows executables. If you want to wrap a UNIX executable, you'll need to instead use [ValidateOrExit](#DOCS_GAME_SDK_APPLICATIONS/validateorexit).

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

`install_path` is any file path on your local machine; this is where the files will be downloaded to. `--platform` and `--locale` are whatever values you set as valid platforms and locales in your config file for a given build. The default probably looks something like `win64` and `en-US`.

Here's an example of the command with our info:

```
dispatch build update 467102538279999224 456889899375659999 C:\my-game --platform win64 --locale en-US
```

Now you can run the executable for your game in that directory and make sure it works!

## Patching

If you need to push out a patch or a new build, no problem! Just repeat the process:

- Update your game files locally to whatever they need to be
- Push your build again
- Publish the build again
- List your branches to make sure the new build is live

Discord will do some magic in the background to diff your files, ensuring that your players only have to download the changes they need and letting them do it quickly so they can get back in the game. Or, really, without them even needing to know there _was_ a patch! Your players will automatically download your latest and greatest stuff, and quickly!

Suppose you have your own patcher and do not want Discord to handle patching, set `"should_patch": false` in the application configuration. If `should_patch` is false, Discord will install the game and never patch, even if you update your game. On uninstall, Discord will delete the entire directory, including saves and user data.

```js
{
  "application": {
    "id": 467102538279999224,
    "should_patch": false,
  }
}
```
