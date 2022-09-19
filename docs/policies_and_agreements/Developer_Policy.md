# Discord Developer Policy

> info
> We are updating our Developer Policy and Developer Terms of Service, effective October 1, 2022. Please review the updated terms here and policy below (for translated versions of the Discord Developer Policy in your selected language, as available, please [see here](https://support-dev.discord.com/hc/articles/8563934450327). If you access or use the APIs on or after October 1, 2022, it means you agree to these updated terms and policy. Until then, the current terms and [policy](#DOCS_POLICIES_AND_AGREEMENTS_DEVELOPER_POLICY/previous-discord-developer-policy) will apply. [Learn more here](https://support-dev.discord.com/hc/articles/8541214983959).

## Effective date: October 1, 2022

## Last updated: September 1, 2022

*For a link to the previous policy, please see **[here](https://github.com/discord/discord-api-docs/blob/62c9a95b56d2f989d3eefe39a058d69189f6b4a6/docs/policies_and_agreements/Developer_Policy.md)**. For a translated version in your selected language, as available, please see **[here](https://support-dev.discord.com/hc/articles/8563934450327)**.*

Discord is a place of belonging where developers come to build cool tools to further the way that people connect. As Discord continues to grow and support our developers, it’s important to be transparent about the responsibilities and expectations of our developers and their Applications. This document sets forth the policies developers will need to follow to develop and operate their Applications.

## Introduction

This Discord Developer Policy is incorporated into the [Discord Developer Terms of Service](#DOCS_POLICIES_AND_AGREEMENTS_TERMS_OF_SERVICE) (“Developer Terms”) and you agree that it applies to your access to and use of our APIs in addition to the Developer Terms and other Terms. Capitalized terms not otherwise defined herein (including API Data and Application) have the meaning assigned to them in the Developer Terms. For clarity, the term “including” as used herein means “including without limitation.”

Please check back here regularly as we may update these policies from time to time and your continued access to or use of the APIs after such updates go into effect means you accept and agree to them. Additional terms and policies may also apply to your access to or use of certain APIs (including as described in or available via our [Developer Portal](#DOCS_INTRO) or [Help Center](https://support-dev.discord.com/hc/categories/360000656491)).

## Protect Discord users

- **Do not modify a Discord user’s account without explicit permission from the Discord user**. Functionality that intends to make any changes to a Discord account, for example adding the account to a server, must clearly and properly inform the Discord account owner of the changes and receive explicit permission to enact the changes. 
- **Do not collect, solicit, or deceive users into providing user login credentials**. Under no circumstances may you or your Application solicit, obtain, or request login credentials from Discord users in any way. This includes information such as passwords or user access or login tokens.
- **Do not target users with advertisements or marketing**. Messaging to Discord users from any Application or developer team should be relevant to the function of the Application and may not contain material unrelated to an Application’s function or information.

## Handle data with care

- **Do not use API Data for any purpose outside of what is necessary to provide your stated functionality**. You may not request, access, or use any API Data for any purpose other than as necessary to provide your Application’s stated (and approved through App Review, as applicable) functionality; provided that you may also use API Data for the purpose of improving your Application only if it has been aggregated or de-identified such that it cannot be associated with, or used to identify, any individual.
- **You may not mine or scrape any data, content, or information available on or through Discord services (as defined in our [Terms of Service](https://discord.com/terms)).**
- **Do not use API Data to:** profile Discord users, their identities, or relationships with other users; to discriminate against anyone based on personal or protected classifications as defined in our [Community Guidelines](https://dis.gd/guidelines); or for eligibility considerations for benefits or for purposes such as employment, housing, insurance, or otherwise.
  - Furthermore, you may not, and may not use your Application, to obtain API Data or transmit data to Discord (i) of persons under the age of 13 or the relevant age of digital consent in their jurisdiction (if older) or (ii) that includes protected health information, financial information, or other sensitive information under applicable law, except to the extent specifically allowed by our terms for a given Discord service or necessary to process a financial transaction as specifically enabled by a Discord service;
- **Do not disclose API data to any advertising network, data broker, or other advertising or monetization related service.**
- **Do not sell, license, or otherwise commercialize any API Data or Discord services (as defined in our [Terms of Service](https://discord.com/terms), e.g., Nitro subscriptions).**
- **Do not direct your Application to people who are under the age of 13 or the minimum age of digital consent in their applicable countries**. Our services are only for people who are at least 13 years old and meet the minimum age of digital consent in their applicable countries.
- **Do not attempt to re-identify, de-anonymize, unscramble, unencrypt, or reverse hash or reverse engineer API Data from the form in which you obtain it.**
- **Do not use API Data in any way that goes against Discord users’ expectations**. This includes frequently sending unsolicited direct messages, sending direct messages not directly related to maintaining or improving an Application's core functionality, or making unsolicited changes to user data or to a user’s access to Discord services. 

For the avoidance of doubt, the above policies apply in addition to the terms relating to API Data described in the Developer Terms (including Section 5 (User Privacy and Security)), and use of data includes how you access, collect, store, retain, transmit, share, and otherwise process it.

## Apps Should Provide a Positive, Quality Experience

- **Do not use the API for any dangerous or illegal activity.** This includes, but is not limited to, activities that facilitate or promote:
  - Death, bodily harm, and/or personal injury;
  - Environmental damage (such as the operation of nuclear facilities, air traffic control); or
  - Unlawful online gambling.
- **Do not use the APIs in any way to violate, or to enable or promote others to violate, the [Discord Community Guidelines](https://dis.gd/guidelines)**. As described in the Developer Terms, you are responsible for ensuring that your Application is not used to violate any of the Terms. We take into consideration the abundance, explicit negligence, and intentional enabling of violating behavior when assessing appropriate enforcement. Prohibited behaviors and activities include those that:
  - Defraud users;
  - Deceive users via impersonation (outside of clearly labeled satire, parody, or fan accounts), including impersonating other Applications, Discord employees or partners, or Discord services. This includes deception via your and your Application’s account and identity;
  - Distribute adult content to users under the age of 18, and without age-restricted labels where applicable and appropriate to users 18 and older;
    - Unless your Application is labeled as age-restricted, you will make sure your Application is appropriate for users under the age of eighteen (18) and complies with all applicable laws (including those applicable to users under the age of eighteen (18)).
  - Or enable, promote, or organize any on or off-platform harassment.
- **Do not promote offensive, vulgar, violent, or violent extremist content, messages, or images**. This includes the fields in an Application’s Settings page in the Discord Developer Portal.
- **Do not attempt to manipulate engagement**. You may not participate, enable, or promote the inflating of server membership with bot or user accounts or mass creation of user accounts to redeem rewards or send messages. You may not automate messages to be sent for the purpose of maintaining message activity in a Discord community.
- **Do not contact users outside of Discord without their explicit consent**. This means you should not contact Discord users outside of the Discord platform by using any API Data (including any data obtained, disclosed, or inferred through a user’s use of your Application).
- **Do not enable your developer team, Application, or other users to bypass or circumvent Discord’s privacy, safety, and security measures**. Your Application must respect user-initiated blocks, bans, kicks, mutes, visibility settings (such as users opting out of displaying connections or permission settings), and must not enable any form of masking account identities (such as obscuring Discord usernames).

## Respect the Platform

- **Obtain consent before initiating processes on a user or server’s behalf**. Your Application must respect user decisions to opt out of or block the Application, as applicable. On the server level, your Application must respect server members’ (with the appropriate permissions) ability to remove the Application. The manner of providing the option for consent/authentication must be clearly labeled and apparent, and contain an accurate description of the purpose or feature being enabled. For example, if your Application is providing a service in response to a user initiated request or command, this is an acceptable instance of consent here. 
- **Use commercially reasonable efforts to promptly make yourself or your team available for feedback or user support regarding your Application.**
- **Notify Discord and affected users of potential unauthorized access to API Data, as described in Section 5 of the Developer Terms.**
- **Do not remove, obscure, or alter Discord’s links to any of the Terms.**

For the avoidance of doubt, the above policies apply in addition to the terms relating to use of the APIs in the Developer Terms (including Section 2).

## API Limits

As described in the Developer Terms, Discord may set and enforce limits on your use of the APIs (for example, by limiting the number of API requests that you may make, the number of servers your Application is in, or the number of users you may serve) at our sole discretion. You agree to, and will not attempt to circumvent, such limitations documented with each API.

If you would like to use any API beyond these limits, you must obtain Discord’s express written consent (and Discord may, at our discretion, decline such request or condition acceptance on your agreement to additional terms and/or charges for such use).

As described in the Developer Terms (including Section 9), we may take enforcement actions for any Enforcement Reason, including if we believe you or your Application have violated this Developer Policy. If you come across an Application that you believe violates any of these policies, please [report it to us](https://support.discord.com/hc/en-us/requests/new?ticket_form_id=360005592534).

---

# Previous Discord Developer Policy

> warn
> The following is the previous Developer Policy, which will be in effect until October 1, 2022.

## Effective until: October 1, 2022

## Last updated: July 1, 2020

This Discord Developer Policy is incorporated into the Discord Developer Terms of Service (“Terms”) and applies to all uses of our APIs. All capitalized terms not defined here have the meaning assigned to them in these Terms. Please check back from time to time as these policies are occasionally updated.

**“Discord Data”** means any and all data you obtain through the APIs.

## Protect Discord users. 

You may not use the APIs in any way to:

- modify a Discord user’s account without explicit permission from the Discord user. For example, you may not add a Discord user to a Discord (also known as a “server”) unless that Discord user expressly approved joining that Discord (such as when using a "group finder" app);
- post messages, trigger notifications, or play audio on behalf of a Discord user except in response to such Discord user expressly opting-in to each instance of such action;
- obtain Discord passwords or credentials under any circumstance; or
- target users with advertisements or marketing.

## Handle data with care. 

You may not use the APIs in any way to:

- scrape any Discord Data;
- use Discord Data for any purpose other than as necessary to provide your application;
- disclose any user’s Discord Data without their specific, informed consent; 
- disclose Discord Data to any ad network, data broker, or other advertising or monetization related service; 
- retain data any longer than necessary for the operation of your application;
- contravene Discord’s Privacy Policy;
- obtain Discord User passwords to obtain access to Discord Data; 
- sell, license or otherwise commercialize any Discord Data; 
- provide or direct services to children under the age of thirteen (13) in the United States or, outside of the United States, the relevant age of digital consent; 
- process Discord Data in a way that surprises or violates Discord users’ expectations.

## Don’t Do Anything Illegal, Harmful, or Otherwise Not Cool.

You may not use the APIs in any way:

- to promote or facilitate unlawful online gambling;
- for any activities where the use or failure of the APIs could lead to death, personal injury, or environmental damage (such as the operation of nuclear facilities, air traffic control, or life support systems);
- that doesn’t comply with all applicable laws, regulations, and third party rights;
- to encourage or promote illegal activity or violation of third party rights;
- to use the APIs to process or store any data that is subject to the International Traffic in Arms Regulations maintained by the U.S. Department of State
- to distribute NSFW material without an NSFW tag; or
- to defame, abuse, harass, stalk, threaten others, or otherwise violate our [Community Guidelines](https://discord.com/guidelines).

## Don’t abuse the platform. 

You will:

- require your end users to comply with (and not knowingly enable them to violate) applicable law, regulation, and the Discord Terms of Service; and
- only access (or attempt to access) an API by the means described in the documentation of that API. 

You will not:

- remove, obscure, or alter Discord’s [Terms of Service](https://discord.com/terms) or any links to or notices of those terms;
- encourage or create functionality for your users that violates Discord’s [Terms of Service](https://discord.com/terms);
- sublicense an API for use by a third party;
- create an application that functions substantially the same as the APIs and offer it for use by third parties;
- perform an action with the intent of introducing to Discord products and services any viruses, worms, defects, Trojan horses, malware, or any items of a destructive nature; 
- reverse engineer or attempt to extract the source code from any API or any related software, except to the extent that this restriction is expressly prohibited by applicable law; 
- misrepresent or mask either your identity or your application’s identity when using the APIs or developer accounts; 
- permit or allow a third party to violate any of this Discord Developer Policy; or
- interfere with or disrupt the APIs or the servers or networks providing the APIs.

## API Limits.

Discord sets and enforces limits on your use of the APIs (for example, by limiting the number of API requests that you may make, the number of servers your application is in, or the number of users you may serve), in our sole discretion. You agree to, and will not attempt to circumvent, such limitations documented with each API. 

If you would like to use any API beyond these limits, you must obtain Discord’s express written consent (and Discord may decline such request or condition acceptance on your agreement to additional terms and/or charges for that use).
We support increases to the following rate limits if your app meets the criteria set forth below. If you are seeking approval for any of the following rate limit increases, 
please follow the outlined steps:

- 100 server limit for your bot
    - Please see your bot’s settings and get verified and approved for Privileged Intents as needed. [Read more here](https://support.discord.com/hc/en-us/articles/360040720412)
- Large Bot Sharding
    - If you are near or in over 150,000 guilds, please reach out to support at [https://dis.gd/contact](https://dis.gd/contact) about Large Bot Sharding. [Read more here](https://discord.com/developers/docs/topics/gateway#sharding-for-very-large-bots)
- Higher global rate limit
    - If you are near or in over 150,000 guilds, please reach out to support at [https://dis.gd/contact](https://dis.gd/contact) about a higher global rate limit

## HIPAA Rules.

Discord does not intend use of the APIs to create obligations under the Health Insurance Portability and Accountability Act, as amended ("HIPAA"), and makes no representations that the APIs satisfy HIPAA requirements. If you are (or become) a "covered entity" or "business associate" as defined in HIPAA, you will not use the APIs for any purpose or in any manner involving transmitting protected health information to Discord.
