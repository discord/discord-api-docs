---
title: "Add Application Connections Metadata and Linked Roles"
date: "2022-12-12"
---

Introducing [linked roles](https://discord.com/blog/connected-accounts-functionality-boost-linked-roles) as well as the ability for all developers to set up their own linked roles with an application. This includes:

* New [`role_connections_verification_url`](/docs/resources/application#application-object) that can be set in the developer portal in order for the application to render as potential verification option for linked roles.
* [Application metadata](/docs/resources/application-role-connection-metadata#application-role-connection-metadata-object) to specify more detailed linked role requirements.
* New endpoints to [retrieve](/docs/resources/application-role-connection-metadata#get-application-role-connection-metadata-records) (`GET /applications/<application.id>/role-connections/metadata`) and [update](/docs/resources/application-role-connection-metadata#update-application-role-connection-metadata-records) (`PUT /applications/<application.id>/role-connections/metadata`) application connection metadata.
* New [`role_connections.write`](/docs/topics/oauth2#shared-resources-oauth2-scopes) OAuth2 scope required to authenticate the below requests.
* Endpoints to [retrieve](/docs/resources/user#get-current-user-application-role-connection) (`GET /users/@me/applications/{application.id}/role-connection`) and [update](/docs/resources/user#update-current-user-application-role-connection) (`PUT /users/@me/applications/{application.id}/role-connection`) a user's role connections, both of which return an [application role connection](/docs/resources/user#application-role-connection-object) object.

:::info
For a quick rundown on how to get started using linked roles, refer to the [tutorial](/docs/tutorials/configuring-app-metadata-for-linked-roles).
:::
