---
title: "Update to Locked Threads"
date: "2023-02-10"
---

### Upcoming Changes

Currently, threads in Discord (including forum posts) can either be archived or both locked and archived. Starting on **March 6, 2023**, threads will be able to be locked *without* being archived, which will slightly change the meaning of the [`locked` field](/docs/resources/channel#thread-metadata-object-thread-metadata-structure).

`locked` currently indicates that a thread cannot be reopened by a user without the [`MANAGE_THREADS` (`1 << 34`) permission](/docs/topics/permissions#permissions-bitwise-permission-flags), but it doesn't restrict user activity within active (meaning non-archived) threads. After this change, users (including bot users) without the `MANAGE_THREADS` permission will be more restricted in locked threads. Users won't be able to create or update messages in locked threads, or update properties like its title or tags. Additionally, some user activity like deleting messages and adding or removing reactions will *only* be allowed in locked threads if that thread is also active (or un-archived).

If a user or bot user has the `MANAGE_THREADS` permission, they will still be able to make changes to the thread and messages. The upcoming change does not affect the meaning of the [`archived` field](/docs/resources/channel#thread-metadata-object-thread-metadata-structure) or the behavior of a thread that is both locked and archived.

### How do I prepare for this change?

If your app is interacting with threads (including forum posts), it should check the state of the `locked` and/or `archived` field for the thread to understand which actions it can or cannot perform. It should also be prepared to handle any errors that it may receive when a thread is locked.
