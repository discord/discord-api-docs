# Discord Official API Documentation

This repo contains the official Discord API documentation, which can be viewed online [HERE](https://discord.com/developers/docs/intro). Before submitting pull-requests, please remember to _fully_ read the [Contributing](CONTRIBUTING.md) guidelines.

This repository reflects the Discord API as it is meant to be accessed by third-party applications. It omits features and capabilities that are not generally available, or are not fully supported for third-party usage.

We welcome your contributions!

-   Issue tracker: Discord API bugs
-   Discussions: Discord API feature and improvement requests
-   Pull Requests: See [Contributing.md](https://github.com/discord/discord-api-docs/blob/main/CONTRIBUTING.md)

## Markdown Syntax

This repository uses special markdown syntax that helps style the resulting web version of the documentation.

### H6 Headings

H6 headings should be used above tables and code blocks to properly label them.

### Linking

Links between docs can be achieved by using a hash symbol (#), plus the markdown file name, plus a slash, and finally the dash-separated anchor. For instance, to link to the above H6 heading section:

```md
[Links to README.md H6](#README/h6-headings)
```

### Alert Boxes

Alert boxes are creating using a block quote that has one of 'warn', 'danger', 'info', or `preview` on the first line. 

![Alert options](images/alerts.png)


### MDX Components

There are a few reusable MDX components that can be used on pages with the `mdx` extension. 

#### Collapsible

Collapsible allows you to show/hide content on a page that may be secondary to the page's primary content. It has four fields that can be set: `title`, `description` `icon`, and an `open` flag (which makes the collapsible element open by default)

Available options for `icon` are `"list"`, `"view"`, `"question"`, and `"code"`.


###### Example

![Collapsible MDX Component with the list icon](images/mdx-collapsible.png)

```markdown
<Collapsible title="Title" description="Description text" icon="list">
Collapsed content
</Collapsible>
```

#### Button

Button is simply...a clickable button. It takes `href` and `color` arguments, but currently we only use the `"brand"` value for `color`.

###### Example

![Button MDX Component](images/mdx-button.png)

```markdown
<Button href="https://discord.com/developers/docs/getting-started" color="brand">click the button!</Button>
```

#### Card

Cards let you display links in a card format. It accepts two arguments, `title` and `link`.

###### Example

![Card MDX Component](images/mdx-card.png)

```markdown
<Card title="Card Title" link="https://discord.com/developers/docs/getting-started">This is the content inside of the card~</Card>
```

## Need some help?

Here are some Discord servers that can help you out with everything Discord API:

The [Official Discord Developers server](https://discord.gg/discord-developers) has plenty of help channels with knowledgeable people and Discord's developers to get you help with something you need, and get updates straight from the developers. However do keep in mind this is a purely on-topic server. If you are looking for a community, join the server below.

The [Unofficial Discord API server](https://discord.gg/discord-api) is a common hangout for library and bot developers alike. It's a great starting point for those looking to dive in and learn bot-creation with the Discord API.

## License

Except as otherwise noted, the Discord API Documentation and other content in this repository is licensed under the Creative Commons Attribution-ShareAlike 4.0 License (see [LICENSE](https://github.com/discord/discord-api-docs/blob/main/LICENSE)), and code samples in this repository are licensed under the MIT License (see [LICENSE-CODE](https://github.com/discord/discord-api-docs/blob/main/LICENSE-CODE)). These licenses do not grant you rights to use any of Discord’s trademarks or other brand features. Please see the [Discord Developer Terms of Service](https://discord.com/developers/docs/policies-and-agreements/developer-terms-of-service) for more information about use of Discord’s brand features and APIs.
