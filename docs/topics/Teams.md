# Teams

Teams are groups of developers on Discord who want to collaborate on apps. On other platforms, these may be referred to as "organizations", "companies", or "teams". We went with the name Teams because it best encompassed all the awesome conglomerates of devs that work together to make awesome things on Discord. Also, we never got picked for kickball in gym class, so now we get to be on a team.

## What Do They Do

Teams allow you and other Discord users to share access to apps. No more sharing login credentials in order to reset the token on a bot that your friend owns but you work on, or other such cases.

For game developers, this means that you can get your engineers access to your app for credentials they may need, your marketing folks access to store page management, and your finance people access to sales and performance metrics.

> danger
> For the initial release, Teams only support one kind of user: Admin. Admins have full access to all parts of an app _except_ for deleting the app and adding/removing users. That can only be done by the owner of the Team.

## How Do I Make One

Making a Team is easy! Head on over to our [Team creation](https://discord.com/developers/teams) page and make your own.

![Screenshot of the initial landing page for viewing Teams that you are a part of](team-page.png)

Note that to use Discord Teams, you need to have 2FA enabled on your account. Security is of the utmost importance, especially when it comes to shared resources. If you're developing on your own and don't want to use Teams, you do not need 2FA. But, in order to keep other Team members safe, you'll need to add it to use Teams.

![Screenshot of the 2FA requirement modal](team-2fa.png)

Once your team is made, you can start inviting other Discord users to join.

> info
> For the initial release, only the Team owner can invite or remove additional users.

## Apps on Teams

Now that you've got your Team set up, you can start creating apps under it. Teams can own a maximum of 25 apps. To create a new app under a Team, select the Team in the app creation modal. If you want to keep the app under your own ownership, choose `Personal`:

![Screenshot of the Team Application creation modal](team-make-app.png)

If you have an existing app that you want to transfer to a Team, you can do that, too! Just go into the app that you want to transfer, hit `Transfer App to Team`, and send the app to its new home.

![Screenshot of where to find the button to transfer an Application to a Team](transfer-app-to-team.png)

> danger
> Once an app has been transferred to a team, it _cannot_ be transferred back.

## What Next

What next? Go make awesome stuff! Whether you're a Game Developer, Mad Bot Scientist, or OAuth2 Enthusiast, you can now work together with other like-minded Discordians to bring your creations to life.

We've got a lot of awesome features planned for teams in the future, so stay tuned for things like:

- Roles and Permissions
- Audit Logs
- More cat pictures

Go team!

## Data Models

###### Team Object

| field         | type                                                                              | description                            |
| ------------- | --------------------------------------------------------------------------------- | -------------------------------------- |
| icon          | ?string                                                                           | a hash of the image of the team's icon |
| id            | snowflake                                                                         | the unique id of the team              |
| members       | array of [team member](#DOCS_TOPICS_TEAMS/data-models-team-member-object) objects | the members of the team                |
| name          | string                                                                            | the name of the team                   |
| owner_user_id | snowflake                                                                         | the user id of the current team owner  |

###### Team Members Object

| field            | type                                                    | description                                                                                     |
| ---------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| membership_state | integer                                                 | the user's [membership state](#DOCS_TOPICS_TEAMS/data-models-membership-state-enum) on the team |
| permissions      | array of strings                                        | will always be `["*"]`                                                                          |
| team_id          | snowflake                                               | the id of the parent team of which they are a member                                            |
| user             | partial [user](#DOCS_RESOURCES_USER/user-object) object | the avatar, discriminator, id, and username of the user                                         |

###### Membership State Enum

| name     | value |
| -------- | ----- |
| INVITED  | 1     |
| ACCEPTED | 2     |
