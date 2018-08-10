# List of Commands

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Some people don't like to read full pages of documentation. Personally, I think those people are missing out. But we want to make sure that we cater to everyone, so here's a list of every Dispatch command and what it does. No frills, no jokes. Okay, maybe some jokes.

## Application

`dispatch application get <application_id>`  
Gets the game's metadata

`dispatch application update <application_id> <path_to_config>`  
Updates the game's metadata

## Branch

`dispatch branch create <application_id> <branch_name>`  
Creates a new branch

`dispatch branch delete <application_id> <branch_id>`  
Deletes a branch

`dispatch branch list <application_id>`  
Lists your branches

`dispatch branch promote <application_id> <branch_id> <target_branch_id>`  
Promotes the live build of one branch to another

## Builds

`dispatch build corrupt <application_id> <build_id>`  
Marks a build as corrupted

`dispatch build delete <application_id> <build_id>`  
Deletes a build

`dispatch build drm-wrap <application_id> <path_to_executable>`  
Wraps your executable in Discord DRM

`dispatch build list <application_id> <branch_id>`  
Lists the builds available on the branch

`dispatch build publish <application_id> <branch_id> <build_id>`  
Publishes a given build from a given branch

`dispatch build push <application_id> <branch_id> <path_to_config>`  
Pushes as build to branch with the given manifests

`dispatch build update <application_id> <branch_id> <path_to_game_files> <path_to_config> --platform <value> --locale <value>`  
Updates the build on the branch, optionally restricted to manifests for the given platform and locale

`dispatch build verify`  
Verifies the build, returning any hashes and locations that are corrupted

## Completions

`dispatch completions generate <shell>`  
Generations shell command completions for `BASH`, `BASH`(macOS/Homebrew) `FISH`, `ZSH`. We also support completions for Powershell or other custom shells; run `dispatch completions --help` for more info.

## Manifest Labels

`dispatch manifest_label list <application_id>`  
List created manifest labels

## Store

`dispatch store listing create <directory> <name> <application_id>`  
Creates a store listing at the given directory

`dispatch store listing update <directory>`  
Updates the store listing for the given directory

## Miscellaneous

`dispatch login`  
Authorizes you to do these things! Maybe we should've put this at the top...
