# Predefined Field Values

> info
> Need help with Dispatch? Talk to us in the [Discord Developers Server](https://discord.gg/discord-developers)!

###### Accepted Locales

| Locale | Language Name           |
| ------ | ----------------------- |
| en-US  | English (United States) |
| en-GB  | English (Great Britain) |
| zh-CN  | Chinese (China)         |
| zh-TW  | Chinese (Taiwan)        |
| cs     | Czech                   |
| da     | Danish                  |
| nl     | Dutch                   |
| fr     | French                  |
| de     | German                  |
| el     | Greek                   |
| hu     | Hungarian               |
| it     | Italian                 |
| ja     | Japanese                |
| ko     | Korean                  |
| no     | Norwegian               |
| pl     | Polish                  |
| pt-BR  | Portuguese (Brazil)     |
| ru     | Russian                 |
| es-ES  | Spanish (Spain)         |
| sv-SE  | Swedish                 |
| tr     | Turkish                 |
| bg     | Bulgarian               |
| uk     | Ukrainian               |
| fi     | Finnish                 |
| hr     | Croatian                |
| ro     | Romanian                |
| lt     | Lithuanian              |

## Manifests

###### Platform Values

| Platform |
| -------- |
| macos    |
| win32    |
| win64    |
| linux    |

###### Redistributable values

| Redistributable            |
| -------------------------- |
| directx_june_2010          |
| vcredist_2005_x86          |
| vcredist_2008_sp1_x86      |
| vcredist_2010_x64          |
| vcredist_2010_x86          |
| vcredist_2012_update_4_x64 |
| vcredist_2012_update_4_x86 |
| vcredist_2013_x64          |
| vcredist_2013_x86          |
| vcredist_2015_x64          |
| vcredist_2015_x86          |
| vcredist_2017_x64          |
| vcredist_2017_x86          |
| xnafx_40                   |

###### Cloud Save Path Replacements

| value            | Windows path                                                                        | macOS path                    | Linux path          |
| ---------------- | ----------------------------------------------------------------------------------- | ----------------------------- | ------------------- |
| \${HOME}         | %USERPROFILE%                                                                       | ~/                            | ~/                  |
| \${DOCUMENTS}    | %USERPROFILE%\Documents                                                             | ~/Documents                   | \$XDG_DOCUMENTS_DIR |
| \${DATA}         | %USERPROFILE%\AppData\Roaming                                                       | ~/Library/Application Support | \$XDG_DATA_HOME     |
| \${DATALOCAL}    | %USERPROFILE%\AppData\Local                                                         | ~/Library/Application Support | \$XDG_DATA_HOME     |
| \${DATALOCALLOW} | %USERPROFILE%\AppData\LocalLow                                                      | ~/Library/Application Support | \$XDG_DATA_HOME     |
| \${SAVEDGAMES}   | %USERPROFILE%\Saved Games                                                           | (not supported)               | (not supported)     |
| \${INSTALLDIR}   | the game's install directory                                                        | (same)                        | (same)              |
| \${USERID}       | the user's id - use within a path to define saves for multiple users                | (same)                        | (same)              |
| \${BRANCHID}     | the id of the game branch - use within a path to define saves for multiple branches | (same)                        | (same)              |
