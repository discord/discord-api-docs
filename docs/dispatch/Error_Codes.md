# Error Codes

> info
> Need help with Dispatch? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

This page outlines some of the common errors codes that may be encountered when using Dispatch.

| Code | Name                       | Possible Solution                                                                                                                              |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 2020 | Request Signing Failed     | Check user entitlement                                                                                                                         |
| 2022 | Disk Space Low             | Free up disk space                                                                                                                             |
| 2023 | Disk Permission Denied     | Choose a new location, or change write permissions on desired location                                                                         |
| 2024 | Uninstall Failed           | Attempt to manually remove game files from disk                                                                                                |
| 2025 | Install Script Failed      | Restart Discord, attempt to uninstall/reinstall the game, ensure script is correct                                                             |
| 2029 | Build Not Found            | Completely close and re-open Discord                                                                                                           |
| 2051 | Panic!                     | Escalate in the #dispatch channel of the [Discord Developers Server](https://discord.gg/discord-developers)                                                                                           |
| 2058 | Too Many API Retries       | Escalate in the #dispatch channel of the [Discord Developers Server](https://discord.gg/discord-developers)                                    |
| 2059 | Failed to set Registry Key | User most likely denied Windows administrator permissions prompt. Try again, and accept the prompt                                             |
| 2064 | Failed to Patch File       | Attempted to patch the game while running: ensure the game process is entirely ended, try restarting Discord, try disabling antivirus          |
| 2065 | No Manifests               | Ensure that your manifests are properly selected in the Developer Portal for your SKU                                                          |
| 2069 | API Error                  | Intermittent API issues. Wait, escalate in the #dispatch channel of the [Discord Developers Server](https://discord.gg/discord-developers)                                                          |
| 2070 | Bad Response               | Intermittent API issues. Wait, escalate in the #dispatch channel of the [Discord Developers Server](https://discord.gg/discord-developers)                                                          |
| 2073 | Not Entitled               | Check that your manifests are properly configured in the Developer Portal. Have the user install the game from the Library, not the store page |
| 2076 | Two Clients Patching       | User has multiple Discords open trying to patch the same game; only use one                                                                    |
| 9001 | Unknown                    | Catch-all error code. Escalate in the #dispatch channel of the [Discord Developers Server](https://discord.gg/discord-developers) with repro steps/as much info as possible                                            |

