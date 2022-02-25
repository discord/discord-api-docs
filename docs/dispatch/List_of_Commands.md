# List of Commands

> info
> Need help with Dispatch? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

Some people don't like to read full pages of documentation. Personally, I think those people are missing out. But we want to make sure that we cater to everyone, so here's a list of every Dispatch command and what it does. No frills, no jokes. Okay, maybe some jokes.

## login

Authorizes you to do these things!

###### Arguments

None

###### Example

```
-> dispatch login
[2018-09-17][15:26:15][INFO] Already logged in
```

## branch create

Creates a new branch. If you have not yet made a master branch, this command will also automatically create a master branch.

###### Arguments

| name           | values | description                   |
| -------------- | ------ | ----------------------------- |
| application_id | int    | your application ID/client ID |
| branch_name    | string | the name for your new branch  |

###### Example

```
-> dispatch branch create 290926444748734465 "test"
Branch created with id 491362538965958686
```

## branch delete

Deletes a branch.

###### Arguments

| name           | values | description                    |
| -------------- | ------ | ------------------------------ |
| application_id | int    | your application ID/client ID  |
| branch_id      | int    | the id of the branch to delete |

###### Example

```
-> dispatch branch delete 290926444748734465 491362538965958686
```

## branch list

Lists all branches for an application.

###### Arguments

| name           | values | description                   |
| -------------- | ------ | ----------------------------- |
| application_id | int    | your application ID/client ID |

###### Example

```
-> dispatch branch list 290926444748734465
|    APPLICATION ID    |      BRANCH ID       |         NAME         |    LIVE_BUILD_ID     |           CREATED AT           |
| -------------------- | -------------------- | -------------------- | -------------------- | ------------------------------ |
|  290926444748734465  |  471164707759996234  |  master              |                      |  2018-07-24 04:00:20.146588Z   |
```

## branch promote

Promotes the live build of one branch to another.

###### Arguments

| name             | values | description                       |
| ---------------- | ------ | --------------------------------- |
| application_id   | int    | your application ID/client ID     |
| branch_id        | int    | the id of the branch to promote   |
| target_branch_id | int    | the id of the branch to overwrite |

###### Example

```
-> dispatch branch promote 290926444748734465 471164707759996234 491362538965958686
```

## build delete

Deletes a build from a branch.

###### Arguments

| name           | values | description                   |
| -------------- | ------ | ----------------------------- |
| application_id | int    | your application ID/client ID |
| build_id       | int    | the id of the build to delete |

###### Example

```
-> dispatch build delete 290926444748734465 491362538965958686
```

## build drm-wrap

Wraps your executable in Discord's DRM. This only works for Windows executables. If you want to DRM wrap a unix executable, you'll need to instead use [ValidateOrExit](#DOCS_GAME_SDK_APPLICATIONS/validateorexit).

> danger
> This action is destructive and overwrites the executable. Make sure you've got a backup handy if needed!

###### Arguments

| name               | values    | description                                                                        |
| ------------------ | --------- | ---------------------------------------------------------------------------------- |
| application_id     | int       | your application ID/client ID                                                      |
| path_to_executable | file path | the path to the executable, either explicit or relative to the dispatch executable |

###### Example

```
-> dispatch build drm-wrap 290926444748734465 C:\my-game\my-game.exe
```

## build list

Lists the builds available on the given branch.

###### Arguments

| name           | values | description                   |
| -------------- | ------ | ----------------------------- |
| application_id | int    | your application ID/client ID |
| branch_id      | int    | the id of the branch to check |

###### Example

```
-> dispatch build list 290926444748734465 491362538965958686
|    APPLICATION ID    |       BUILD ID       |        STATUS        |   CREATION BRANCH    |           CREATED AT           |
| -------------------- | -------------------- | -------------------- | -------------------- | ------------------------------ |
|  290926444748734465  |  489230031839821824  |        READY         |        master        |  2018-09-12 00:25:29.045554Z   |
|  290926444748734465  |  479469321974841354  |        READY         |        master        |  2018-08-16 01:59:54.481336Z   |
```

## build publish

Marks a given build as the live build for a given branch.

###### Arguments

| name           | values | description                    |
| -------------- | ------ | ------------------------------ |
| application_id | int    | your application ID/client ID  |
| branch_id      | int    | the id of the branch to check  |
| build_id       | int    | the id of the build to publish |

###### Example

```
-> dispatch build publish 290926444748734465 491362538965958686 489230031839821824
```

## build push

Pushes a new build to the given branch. The JSON config file tells Dispatch how to organize the files and which to push relative to the `application_root`.

###### Arguments

| name             | values    | description                                                                                           |
| ---------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| branch_id        | int       | the id of the branch to check                                                                         |
| config_file      | filename  | the [JSON config file](#DOCS_DISPATCH_BRANCHES_AND_BUILDS/setting-up-our-first-build) for the build   |
| application_root | file path | the directory that dispatch will treat as the local root for operations—`.` for the current directory |
| -c               | flag      | forces a re-chunk of files even if the edited file timestamp hasn't changed                           |
| -p               | flag      | automatically publishes the build if push is successful                                               |

###### Example

```
-> dispatch build push 491362538965958686 config.json . -c -p
```

## build update

Downloads the build for the given application id and branch id to the given install path, for the given platform and locale.

`install_path` can be any file path on your machine to download the build to.

###### Arguments

| name           | values                                                            | description                    |
| -------------- | ----------------------------------------------------------------- | ------------------------------ |
| application_id | int                                                               | your application ID/client ID  |
| branch_id      | int                                                               | the id of the branch to check  |
| install_path   | file path                                                         | the path to install to         |
| --platform     | [platform](#DOCS_DISPATCH_FIELD_VALUES/manifests-platform-values) | the build platform to download |
| --locale       | [locale](#DOCS_REFERENCE/locales)                                 | the build locale to download   |

###### Example

```
-> dispatch build update 290926444748734465 491362538965958686 C:\my-game --platform win64 --locale en-US
```

## build corrupt

Mark a build as corrupted.

###### Arguments

| name           | values | description                    |
| -------------- | ------ | ------------------------------ |
| application_id | int    | your application ID/client ID  |
| build_id       | int    | the id of the build to corrupt |

###### Example

```
-> dispatch build corrupt 290926444748734465 491362538965958686
Corrupted build "491362538965958686"
```

## build preview-files

Displays a preview of the install paths that a build will put files in, for a given platform/locale. Additionally, will show which files are considered user data.

###### Arguments

| name             | values                                                            | description                                                                                           |
| ---------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| config_file      | filename                                                          | the [JSON config file](#DOCS_DISPATCH_BRANCHES_AND_BUILDS/setting-up-our-first-build) for the build   |
| application_root | file path                                                         | the directory that dispatch will treat as the local root for operations—`.` for the current directory |
| --locale         | [locale](#DOCS_REFERENCE/locales)                                 | the build locale to preview                                                                           |
| --platform       | [platform](#DOCS_DISPATCH_FIELD_VALUES/manifests-platform-values) | the build platform to preview                                                                         |

###### Example

```
-> build preview-files config.json . --locale en-US --platform win64
```

## build repair

Repairs an application build.

###### Arguments

| name             | values                                                           | description                                                                                           |
| ---------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| application_id   | int                                                              | your application ID/client ID                                                                         |
| branch_id        | int                                                              | the id of the branch to check                                                                         |
| build_id         | int                                                              | the id of the build to repair                                                                         |
| application_root | file path                                                        | the directory that dispatch will treat as the local root for operations—`.` for the current directory |
| --platform       | [platform](#DOCS_DISPATCH_FIELD_VALUES/manifests-platform-values) | the build platform to repair                                                                          |

###### Example

```
-> build repair 290926444748734465 491362538965958686 489230031839821824 . --platform win64
```

## build run-launch-setup

Runs the launch setup for an application.

###### Arguments

| name             | values                                                           | description                                                                                           |
| ---------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| application_root | file path                                                        | the directory that dispatch will treat as the local root for operations—`.` for the current directory |
| --platform       | [platform](#DOCS_DISPATCH_FIELD_VALUES/manifests-platform-values) | the build platform to do the launch setup                                                             |

###### Example

```
-> build run-launch-setup . --platform win64
```

## completions generate

Generations shell command completions; run `dispatch completions --help` for more info, as it varies by shell

###### Example

```
-> dispatch completions generate --help
```

## manifest-label list

Lists created manifest labels. These labels are created from the JSON config file when pushing builds.

###### Arguments

| name           | values | description                   |
| -------------- | ------ | ----------------------------- |
| application_id | int    | your application ID/client ID |

###### Example

```
-> dispatch manifest-label list 290926444748734465
|    APPLICATION ID    |          ID          |         NAME         |
| -------------------- | -------------------- | -------------------- |
|  290926444748734465  |  471165178650999608  |        my-game       |
|  290926444748734465  |  471169990397324288  |      my-game-dlc     |
```
