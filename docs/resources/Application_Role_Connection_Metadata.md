# Application Role Connection Metadata

A representation of role connection metadata for an [application](#DOCS_RESOURCES_APPLICATION/).

When a guild has added a bot and that bot has configured its [`role_connections_verification_url`](#DOCS_RESOURCES_APPLICATION/application-object) (in the developer portal), the application will render as a potential verification method in the guild's role verification configuration.

If an application has configured role connection metadata, its metadata will appear in the role verification configuration when the application has been added as a verification method to the role.

When a user connects their account using the bot's [`role_connections_verification_url`](#DOCS_RESOURCES_APPLICATION/application-object), the bot will [update a user's role connection with metadata](#DOCS_RESOURCES_USER/update-user-application-role-connection) using the OAuth2 `role_connections.write` scope.

### Application Role Connection Metadata Object

###### Application Role Connection Metadata Structure

| Field                      | Type                                                                                                                                                                                | Description                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| type                       | [ApplicationRoleConnectionMetadataType](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/application-role-connection-metadata-object-application-role-connection-metadata-type) | type of metadata value                                                                             |
| key                        | string                                                                                                                                                                              | dictionary key for the metadata field (must be `a-z`, `0-9`, or `_` characters; 1-50 characters)   |
| name                       | string                                                                                                                                                                              | name of the metadata field (1-100 characters)                                                      |
| name_localizations?        | dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                                                                | translations of the name                                                                           |
| description                | string                                                                                                                                                                              | description of the metadata field (1-200 characters)                                               |
| description_localizations? | dictionary with keys in [available locales](#DOCS_REFERENCE/locales)                                                                                                                | translations of the description                                                                    |

###### Application Role Connection Metadata Type

| Type                           | Value | Description                                                                                                                            |
| ------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------- |
| INTEGER_LESS_THAN_OR_EQUAL     | 1     | the metadata value (`integer`) is less than or equal to the guild's configured value (`integer`)                                       |
| INTEGER_GREATER_THAN_OR_EQUAL  | 2     | the metadata value (`integer`) is greater than or equal to the guild's configured value (`integer`)                                    |
| INTEGER_EQUAL                  | 3     | the metadata value (`integer`) is equal to the guild's configured value (`integer`)                                                    |
| INTEGER_NOT_EQUAL              | 4     | the metadata value (`integer`) is not equal to the guild's configured value (`integer`)                                                |
| DATETIME_LESS_THAN_OR_EQUAL    | 5     | the metadata value (`ISO8601 string`) is less than or equal to the guild's configured value (`integer`; `days before current date`)    |
| DATETIME_GREATER_THAN_OR_EQUAL | 6     | the metadata value (`ISO8601 string`) is greater than or equal to the guild's configured value (`integer`; `days before current date`) |
| BOOLEAN_EQUAL                  | 7     | the metadata value (`integer`) is equal to the guild's configured value (`integer`; `1`)                                               |
| BOOLEAN_NOT_EQUAL              | 8     | the metadata value (`integer`) is not equal to the guild's configured value (`integer`; `1`)                                           |

> info
> Each metadata type offers a comparison operation that allows guilds to configure role requirements based on metadata values stored by the bot. Bots specify a `metadata value` for each user and guilds specify the required `guild's configured value` within the guild role settings.

## Get Application Role Connection Metadata Records % GET /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/role-connections/metadata

Returns a list of [application role connection metadata](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/application-role-connection-metadata-object) objects for the given application.

## Update Application Role Connection Metadata Records % PUT /applications/{application.id#DOCS_RESOURCES_APPLICATION/application-object}/role-connections/metadata

Updates and returns a list of [application role connection metadata](#DOCS_RESOURCES_APPLICATION_ROLE_CONNECTION_METADATA/application-role-connection-metadata-object) objects for the given application.

> info
> An application can have a maximum of 5 metadata records.
