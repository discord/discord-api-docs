# Upgrading apps to use Application Commands

As [message content becomes a privileged intent](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Privileged-Intent-FAQ) for apps in 75 or more servers, [application commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS) will become the primary way Discord users interact with apps. The three types of commands (slash commands, user commands, and message commands) act as entry points into apps, and can be registered globally or for a subset of guilds.

This guide primarily focuses on [slash commands](#DOCS_INTERACTIONS_APPLICATION_COMMANDS/slash-commands), a type of command accessed by typing the command’s name prefixed with a backslash (`/`) or by using the plus button (+) to the left of the message input.