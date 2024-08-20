---
title: "Launching Activities via Interactions"
date: "2024-08-13"
topics:
- "Embedded App SDK"
- "Activities"
---

Activities can now be launched via interactions! (TODO: link to docs)

Use the LAUNCH_ACTIVITY interaction callback type (TODO: link to docs) to launch an activity.

We’ve also created a new command type: primary entry point. This is a command that represents the primary way to interact with apps that have Activities enabled. This will be shown in the app launcher with a button dedicated to this command for apps that have an activity. Your app can have only one primary entry point app command. You can use this app command to launch an activity with or without an interactions handler. (link to docs for primary entry point app command.)