---
title: "Deprecation: RPC online member count and members list"
date: "2018-06-11"
---

We released server changes that allow guilds to represent an incomplete state of the member list in our clients, which results in inaccurate member lists and online counts over RPC. These fields are now deprecated and will now return an empty members array and an online count of 0 moving forward.
