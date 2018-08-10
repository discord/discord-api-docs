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
- Add that ~/bin directory to your path in a permanent way. I have `export PATH=$PATH:~/bin` at the bottom of my `~/.zshrc`, or `~/.bashrc`
- Restart your terminal
- `echo $PATH` and make sure you see the directory in the output

You're good! You can now call the dispatch command from anywhere!

**Windows**

Not as 1337 as some scripting skillz, but the Windows GUI will do just fine

- Stick dispatch in a folder that will be added to your PATH
- Hit that Windows key and start typing "Environment Variables"
- Select "Edit the system environment variables"
- Hit the "Environment Variables" button in the bottom right
- Edit the PATH entry for either the system or the current user, adding dispatch's directory
- Restart your command line

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

In order for Discord to understand what you're sending, you need to set up a config file for your game. Here's an example `config.json`—let's break it down!

```js
{
  "application": {
    // Your application id
    "id": 53908232506189999,
    // An array of file bundles
    "manifests": [
      // The first one is the game binary
      {
        // the name of the bundle
        "label": "goty-2018/data",

        // valid platforms for the bundle
        "platforms": ["win32", "win64", "macos", "linux"],

        // The locales the bundle supports
        "locales": ["en-US", "en-GB"],

        // the directory that contains the files for this bundle
        "dir": "data/",

        // Any registry keys that need to be added to the user's system on install
        "registry_keys": [
          {
            "key": "foo",
            "value": "bar"
          }
        ],

        // the launch commands for each platform with any needed arguments
        // executable should be the path to the executable with the current directory as the root
        "launch_commands": {
          "win32": {
            "executable": "data/launchers/win32/do_the_thing.exe",
            "arguments": ["32-bit", "2", "3"]
          },
          "win64": {
            "executable": "data/launchers/win64/do_the_thing.exe",
            "arguments": ["64-bit", "2", "3"]
          },
          "macos": {
            "executable": "data/launchers/macos/do_the_thing.sh"
          }
        }
      },

      // A second bundle - this one's a langauge pack
      {
        "label": "goty-2018/english",
        "platforms": ["macos", "win32", "win64", "linux"],
        "locales": ["en-US", "en-GB"],
        "dir": "locales/english"
      }
    ]
  }
}
```

This config file tells Discord which files to bundle together, how to run them, and other metadata to include. You should keep this file safe in your version control system of choice; that way, Discord is always up to date with whatever you've got locally. You'll reference these manifests later when building your store pages, so that Discord knows what to download to someone's computer when they hit that Big Buy Button.

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

## Patching

If you need to push out a patch or a new build, no problem! Just repeat the process:

- Update your game files locally to whatever they need to be
- Push your build again
- Publish the build again
- List your branches to make sure the new build is live

Discord will do some magic in the background to diff your files, ensuring that your players only have to download the changes they need and letting them do it quickly so they can get back in the game. Or, really, without them even needing to know there _was_ a patch! Your players will automatically download your latest and greatest stuff, and quickly!

Now that you've got a game in the system, let's [create a store page](#DOCS_DISPATCH_MANAGING_STORE_LISTINGS) for it!

## DRM

If you want Discord to wrap your game executable in a light DRM, you can do it right from Dispatch! All that's required is a quick:

```
dispatch build drm-wrap <application_id> <path_to_executable>
```

And ta-da! If you try to wrap it again, we'll throw an error. It used to break everything. It doesn't anymore. You're welcome.
