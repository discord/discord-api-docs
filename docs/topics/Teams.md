# Teams

Teams are groups of developers or other Discord users who want to share access to an app's configuration, management, and payout settings. Since users added to a team have access to any apps that team owns, use caution when adding new team members.

## Creating a Team

To create or be a member on a team, you must [enable 2FA for your Discord account](https://support.discord.com/hc/en-us/articles/219576828-Setting-up-Two-Factor-Authentication). After you have 2FA enabled, create a team by navigating to the [Teams page](https://discord.com/developers/teams) then clicking the "New Team" button.

![Screenshot of the initial landing page for viewing teams that you are a part of](team-page.png)

Once you create a team, you'll land on the **Team Information** page where you can fill out details and start inviting other Discord users to join your team.

> info
> Currently, only the team Owner can invite or remove additional users.

## Adding Apps to a Team

Once your team is set up, you can create or transfer apps that will be owned by the team. Teams can have a maximum of 25 apps.

### Creating an App

To create a new app that belongs to a team, select the team from the **Team** dropdown in the app creation modal. If you want to keep the app under your own account's ownership, choose `Personal`:

![Screenshot of the Team Application creation modal](team-make-app.png)

### Transfering an App

> danger
> Once an app has been transferred to a team, it _cannot_ be transferred back.

To transfer an existing app to a team, navigate to the [Application](https://discord.com/developers/applications) that you want to transfer. At the bottom of the app's **General Information** page, click "Transfer App to Team".

![Screenshot of where to find the button to transfer an Application to a team](transfer-app-to-team.png)

## Team Roles

Team members can be one of four roles, and each role inherits the access of those below it. Roles for team members can be configured under **Team Members** in a team's settings.

### Owner

Each team is limited to one owner of a team who has full access to the team and any team-owned apps. They can take destructive, irreversible actions like deleting team-owned apps or the team itself.
### Admin

Admins have similar access as owners, except they cannot take destructive actions on the team or team-owned apps.

### Developer

Developers can access information about team-owned apps, like the client secret or public key. They can also take limited actions on team-owned apps, like configuring interaction endpoints or resetting the bot token.

Members with the Developer role *cannot* manage the team or team members.

### Read-only

Read-only members can access information about the team and team-owned apps. Some examples include getting the IDs of applications and exporting payout records.

## Data Models

###### Team Object

| field         | type                                                                              | description                            |
| ------------- | --------------------------------------------------------------------------------- | -------------------------------------- |
| icon          | ?string                                                                           | a hash of the image of the team's icon |
| id            | snowflake                                                                         | the unique id of the team              |
| members       | array of [team member](#DOCS_TOPICS_TEAMS/data-models-team-member-object) objects | the members of the team                |
| name          | string                                                                            | the name of the team                   |
| owner_user_id | snowflake                                                                         | the user id of the current team owner  |

###### Team Member Object

| field            | type                                                    | description                                                                                     |
| ---------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| membership_state | integer                                                 | the user's [membership state](#DOCS_TOPICS_TEAMS/data-models-membership-state-enum) on the team |
| team_id          | snowflake                                               | the id of the parent team of which they are a member                                            |
| user             | partial [user](#DOCS_RESOURCES_USER/user-object) object | the avatar, discriminator, id, and username of the user                                         |

###### Membership State Enum

| name     | value |
| -------- | ----- |
| INVITED  | 1     |
| ACCEPTED | 2     |