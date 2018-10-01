# Predefined Field Values

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

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
| uk     | Ukranian                |
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

| value           | Windows path                                                                        | macOS path                    | linux path         |
| --------------- | ----------------------------------------------------------------------------------- | ----------------------------- | ------------------ |
| ${HOME}         | %USERPROFILE%                                                                       | ~/                            | ~/                 |
| ${DOCUMENTS}    | %USERPROFILE%\Documents                                                             | ~/Documents                   | $XDG_DOCUMENTS_DIR |
| ${DATA}         | %USERPROFILE%\AppData\Roaming                                                       | ~/Library/Application Support | $XDG_DATA_HOME     |
| ${DATALOCAL}    | %USERPROFILE%\AppData\Local                                                         | ~/Library/Application Support | $XDG_DATA_HOME     |
| ${DATALOCALLOW} | %USERPROFILE%\AppData\Local (for older operating systems)                           | ~/Library/Application Support | $XDG_DATA_HOME     |
| ${SAVEDGAMES}   | %USERPROFILE%\Saved Games                                                           | (not supported)               | (not supported)    |
| ${INSTALLDIR}   | the game's install directory                                                        | (same)                        | (same)             |
| ${USERID}       | the user's id - use within a path to define saves for multiple users                | (same)                        | (same)             |
| ${BRANCHID}     | the id of the game branch - use within a path to define saves for multiple branches | (same)                        | (same)             |

## Store Pages

###### SKU Types

| Type       | Description                                 |
| ---------- | ------------------------------------------- |
| game       | the base game—one per application!          |
| dlc        | this SKU is DLC, like an expansion          |
| consumable | this SKU is an in-app purchase, like a skin |
| bundle     | this SKU is a bundle                        |

###### Access Type

| Type         | Description           |
| ------------ | --------------------- |
| full         | fully released        |
| early_access | early access          |
| vip          | super duper beta only |

###### ESRB Ratings

| Value             |
| ----------------- |
| everyone          |
| everyone_ten_plus |
| teen              |
| mature            |
| adults_only       |
| rating_pending    |

###### ESRB Content Descriptors

| Value                 |
| --------------------- |
| alcohol_reference     |
| animated_blood        |
| blood                 |
| blood_and_gore        |
| cartoon_violence      |
| comic_mischief        |
| crude_humor           |
| drug_reference        |
| fantasy_violence      |
| intense_violence      |
| language              |
| lyrics                |
| mature_humor          |
| nudity                |
| partial_nudity        |
| real_gambling         |
| sexual_content        |
| sexual_themes         |
| sexual_violence       |
| simulated_gambling    |
| strong_language       |
| strong_lyrics         |
| strong_sexual_content |
| suggestive_themes     |
| tobacco_reference     |
| use_of_alcohol        |
| use_of_drugs          |
| use_of_tobacco        |
| violence              |
| violent_references    |
| in_game_purchases     |
| users_interact        |
| shares_location       |
| unrestricted_internet |

###### PEGI Categories

| Value    |
| -------- |
| three    |
| seven    |
| twelve   |
| sixteen  |
| eighteen |

###### PEGI Descriptors

| Value          |
| -------------- |
| violence       |
| bad_language   |
| fear           |
| gambling       |
| sex            |
| drugs          |
| discrimination |

###### Game Features

| Value                | Description                                 |
| -------------------- | ------------------------------------------- |
| single_player        | single player game                          |
| online_multiplayer   | has online multiplayer                      |
| local_multiplayer    | has local multiplayer                       |
| pvp                  | features Player vs. Player interations      |
| coop                 | has cooperative play                        |
| cross_platform       | has cross-platform play                     |
| rich_presence        | features Discord's Rich Presence system     |
| discord_game_invites | allows direct game invites to Discord users |
| spectator_mode       | has a spectate mode                         |
| controller_support   | has controller support                      |
| cloud_saves          | offers cloud saves                          |

## Pricing

###### Price Tiers

| Tier   | USD Value |
| ------ | --------- |
| 0      | Free      |
| 99     | $.99      |
| 199    | $1.99     |
| 299    | $2.99     |
| 399    | $3.99     |
| 499    | $4.99     |
| 599    | $5.99     |
| 699    | $6.99     |
| 799    | $7.99     |
| 899    | $8.99     |
| 999    | $9.99     |
| 1099   | $10.99    |
| 1199   | $11.99    |
| 1299   | $12.99    |
| 1399   | $13.99    |
| 1499   | $14.99    |
| 1599   | $15.99    |
| 1699   | $16.99    |
| 1799   | $17.99    |
| 1899   | $18.99    |
| 1999   | $19.99    |
| 2499   | $24.99    |
| 2999   | $29.99    |
| 3499   | $34.99    |
| 3999   | $39.99    |
| 4499   | $44.99    |
| 4999   | $49.99    |
| 5499   | $54.99    |
| 5999   | $59.99    |
| 6499   | $64.99    |
| 6999   | $69.99    |
| 7499   | $74.99    |
| 7999   | $79.99    |
| 8499   | $84.99    |
| 8999   | $89.99    |
| 9999   | $99.99    |
| 119999 | $119.99   |
| 12999  | $129.99   |
| 14999  | $149.99   |
| 19999  | $199.99   |

###### Supported Third Party Currencies

| Currency Code | Currency          |
| ------------- | ----------------- |
| usd           | US Dollar         |
| cad           | Canadian Dollar   |
| eur           | Euro              |
| aud           | Australian Dollar |
