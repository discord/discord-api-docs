---
sidebar_label: Poll
---

# Poll Resource

A poll is... well... a poll! It holds information about a poll!

![Example message containing a poll](example-poll.png)

### Poll Object

The poll object has a lot of levels and nested structures. It was also designed
to support future extensibility, so some fields may appear to be more complex than
necessary.

###### Poll Object Structure

| Field             | Type                                                                                                | Description                                                     |
|-------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| question          | [Poll Media Object](#DOCS_RESOURCES_POLL/poll-media-object-poll-media-object-structure)             | The question of the poll. Only `text` is supported.             |
| answers           | List of [Poll Answer Objects](#DOCS_RESOURCES_POLL/poll-answer-object-poll-answer-object-structure) | Each of the answers available in the poll.                      |
| expiry            | ?ISO8601 timestamp                                                                                  | The time when the poll ends.                                    |
| allow_multiselect | boolean                                                                                             | Whether a user can select multiple answers                      |
| layout_type       | integer                                                                                             | The [layout type](#DOCS_RESOURCES_POLL/layout-type) of the poll |
| results?          | [Poll Results Object](#DOCS_RESOURCES_POLL/poll-results-object-poll-results-object-structure)       | The results of the poll                                         |

`expiry` is marked as nullable to support non-expiring polls in the future, but all polls have an expiry currently.

### Poll Create Request Object

This is the request object used when creating a poll across the different endpoints.
It is similar but not exactly identical to the main [poll object](#DOCS_RESOURCES_POLL/poll-object-poll-object-structure).
The main difference is that the request has `duration` which eventually becomes `expiry`.

###### Poll Create Request Object Structure

| Field              | Type                                                                                                | Description                                                                              |
|--------------------|-----------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| question           | [Poll Media Object](#DOCS_RESOURCES_POLL/poll-media-object-poll-media-object-structure)             | The question of the poll. Only `text` is supported.                                      |
| answers            | List of [Poll Answer Objects](#DOCS_RESOURCES_POLL/poll-answer-object-poll-answer-object-structure) | Each of the answers available in the poll, up to 10                                      |
| duration?          | integer                                                                                             | Number of hours the poll should be open for, up to 32 days. Defaults to 24               |
| allow_multiselect? | boolean                                                                                             | Whether a user can select multiple answers. Defaults to false                            |
| layout_type?       | integer                                                                                             | The [layout type](#DOCS_RESOURCES_POLL/layout-type) of the poll. Defaults to... DEFAULT! |

### Layout Type

We might have different layouts for polls in the future.
For now though, this number will be 1.

| Type    | ID | Description                    |
|---------|----|--------------------------------|
| DEFAULT | 1  | The, uhm, default layout type. |

### Poll Media Object

The poll media object is a common object that backs both the question and answers.
The intention is that it allows us to extensibly add new ways to display things in the future.
For now, `question` only supports `text`, while answers can have an optional `emoji`.

###### Poll Media Object Structure

| Field  | Type                                                | Description            |
|--------|-----------------------------------------------------|------------------------|
| text?  | string                                              | The text of the field  |
| emoji? | partial [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) | The emoji of the field |

`text` should always be non-null for both questions and answers, but please do not depend on that in the future.
The maximum length of `text` is 300 for the question, and 55 for any answer.

When creating a poll answer with an emoji, one only needs to send either the `id` (custom emoji) or `name` (default emoji) as the only field.

### Poll Answer Object

The `answer_id` is a number that labels each answer.
As an implementation detail, it currently starts at 1 for the first answer and goes up sequentially.
We recommend against depending on this sequence.

Currently, there is a maximum of 10 answers per poll.

###### Poll Answer Object Structure

| Field       | Type                                                                                    | Description            |
|-------------|-----------------------------------------------------------------------------------------|------------------------|
| answer_id\* | integer                                                                                 | The ID of the answer   |
| poll_media  | [Poll Media Object](#DOCS_RESOURCES_POLL/poll-media-object-poll-media-object-structure) | The data of the answer |

\* Only sent as part of responses from Discord's API/Gateway.

### Poll Results Object

In a nutshell, this contains the number of votes for each answer.

The `results` field may be not present in certain responses where, as an implementation detail, we do not fetch the poll results in our backend.
This should be treated as "unknown results", as opposed to "no results". You can keep using the results if you have previously received them through other means.

Also due to the intricacies of counting at scale, while a poll is in progress the results may not be perfectly accurate.
They usually are accurate, and shouldn't deviate significantly -- it's just difficult to make guarantees.

To compensate for this, after a poll is finished there is a background job which performs a final, accurate tally of votes.
This tally concludes once `is_finalized` is `true`. Polls that have ended will also always contain results.

If `answer_counts` does not contain an entry for a particular answer, then there are no votes for that answer.

###### Poll Results Object Structure

| Field         | Type                                                                                                            | Description                                   |
|---------------|-----------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| is_finalized  | boolean                                                                                                         | Whether the votes have been precisely counted |
| answer_counts | List of [Poll Answer Count Object](#DOCS_RESOURCES_POLL/poll-results-object-poll-answer-count-object-structure) | The counts for each answer                    |

###### Poll Answer Count Object Structure

| Field    | Type    | Description                                    |
|----------|---------|------------------------------------------------|
| id       | integer | The `answer_id`                                |
| count    | integer | The number of votes for this answer            |
| me_voted | boolean | Whether the current user voted for this answer |

# Poll Endpoints

For creating a poll, see [Create Message](#DOCS_RESOURCES_MESSAGE/create-message). After creation, the poll message cannot be edited.

Apps are not allowed to vote on polls. No rights! :)

## Get Answer Voters % GET /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/polls/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/answers/{answer_id#DOCS_RESOURCES_POLL/poll-answer-object}

Get a list of users that voted for this specific answer.

###### Query String Params

| Field  | Type      | Description                           | Default |
|--------|-----------|---------------------------------------|---------|
| after? | snowflake | Get users after this user ID          | absent  |
| limit? | integer   | Max number of users to return (1-100) | 25      |

###### Response Body

| Field | Type                                              | Description                     |
|-------|---------------------------------------------------|---------------------------------|
| users | array of [user](#DOCS_RESOURCES_USER/user-object) | Users who voted for this answer |

## End Poll % POST /channels/{channel.id#DOCS_RESOURCES_CHANNEL/channel-object}/polls/{message.id#DOCS_RESOURCES_MESSAGE/message-object}/expire

Immediately ends the poll. You cannot end polls from other users.

Returns a [message](#DOCS_RESOURCES_MESSAGE/message-object) object. Fires a [Message Update](#DOCS_TOPICS_GATEWAY_EVENTS/message-update) Gateway event.
