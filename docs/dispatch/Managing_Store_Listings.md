# Managing Store Pages

> danger
> The Discord Store is still in a beta period. All documentation and functionality can and will change.

Now that you've got a build or two in the system, it's time to list them on the store! If you _don't_ have builds yet, or you don't know what the heck this means, go read [Branches and Builds](#DOCS_DISPATCH_BRANCHES_AND_BUILDS/).

## Some Setup

Before we create a store page listing, we need to enable ourselves to see the Super Secret Store Section of Discord. To do so, contact us for the super secret password.

## Creating a SKU and Store Page

You'll first need to create the base SKU—an item that can be sold on the store—for your game.

```
dispatch store listing create <directory> <game_name> <application_id>
```

`directory` is the name of the local directory that the command will create; this is where you'll manage all store page stuff. `game_name` is a string, the name of your game. `application_id` is something we've been using a lot, haven't you been paying attention? Sheesh.

For example:

```
dispatch store listing create awesome-game "My Awesome Game" 425442952562462720
```

> <game_name> is limited to 256 characters

This will generate a SKU and a store listing for the live build of the given application id. You can visit the store page at [https://discordapp.com/store/applications/<application_id>/<sku_id>](https://discordapp.com/store/applications/<application_id>/<sku_id>).

This command will also spit out the URL for the store page for this SKU. Since we've already given Discord the secret password to see the store via that link earlier, you can navigate to this URL and see your store page in all it's glory. OK, well, it's not glorious _yet_, but it will be!

Now, let's `cd` ourselves into our new `awesome-game/` directory and see what we've got!

## Assets, SKUs, and configs—oh my!

In your new directory, you'll see two folders: `assets/` and `skus/`. Inside `assets/` is a `.metadata.json` file. Don't worry about it; Discord uses it to make sure we don't upload duplicate assets, but it's nothing you need to manage.

Inside `skus/` is another folder called `sku-<some_long_number>/`. That long number is your `sku_id`, a unique identifier for this SKU. It's super important to Discord, but you don't need to do anything with it, other than stare at it admiringly, imagining all the lovely things it will soon represent.

Inside _that_ folder is _another_ folder, `descriptions/`—it's folders all the way down—as well as a `config.json` file.

The `descriptions/` folder is where you'll put your long-form game descriptions for your store page in the form of different markdown files. The first one we'll create is `default.md` for the default language; from there, you can localize your description by creating new files named after a locale code, like `fr.md` or `de.md`.

###### Example Description

```md
// default.md

This is my favorite game! This description supports all kinds of markdown, like **bold**, _italics_, ~~strikethroughs~~

# Headings

## Subheadings

![and media embeds](../../../assets/from-local-or-remote-sources.png)
```

> Markdown files are limited to 5096 characters per file.

You can see all the locales Discord supports [here](#DOCS_DISPATCH_FIELD_VALUES/). Once you've edited your description to your liking, you can update your store page with:

```
dispatch store listing update <directory>
```

In our case, we'd run `dispatch store listing update awesome-game`. Head back over to your store page, and see it updated immediately!

Note that if you reference local assets in your description, they will be automatically uploaded to our CDN.

## The. Store. Listing.

The big one. Your store page, the thing that represents your game to the world on Discord.

Scared yet? Don't be! Managing your store listing on Discord is super simple. Let's take a look at that `/awesome-game/skus/sku-<big_number>/config.json` file we ran away from earlier. We're gonna break it down into easier to digest chunks, and then put it all back together at the end.

### Your IDs, Uniquely You

```json
{
  "id": "456924821524316170",
  "application_id": "425442752562462720",
  "store_listing_id": "456924822581149707",
  "related_sku_ids": [],
  "dependent_sku_id": null,
  "manifest_labels": []
}
```

These are the nuts and bolts of your store page; they help to organize everything properly in Discord's backend infrastructure so we know exactly what this SKU is. By the way, if you aren't familiar, a "SKU" is basically some item that can be bought and sold on the store: a game, DLC, IAP, a pack of gems, a skin for a hero, etc. Your application can and will have many SKUs within it.

The `id`, `application_id`, and `store_listing_id` are all generated for you when you create the SKU. They're the unique identifiers for this particular item. `related_sku_ids` is a list of ids from other SKUs in your application. Putting those ids in this list will ensure they show up as available DLC on this store page.

If this store listing is for DLC, IAP, or other non-base-game items, you'll want to put the SKU id of the base game as the `depedent_sku_id`. This will ensure that players can't accidentally purchase your expansion pack without already owning the base game.

`manifest_labels` is an **ABSOLUTELY CRITICAL** part of this file, so listen up! Back when you uploaded your games to Discord, you marked off different bundles of files as manifests, like `game-data` and `locales/english`. Each of these labels has its own id; you can see them with

```
dispatch manifest-label list <application_id>
```

That command will spit out a list of manifest labels for your application and their corresponding ids. **`manifest_labels` is an array of ALL the ids, entered as strings, that could need to be downloaded when purchasing and installing this SKU.** For example, we want to include the manifest label ids for `game-data` and `locales/english`. If you also had a manifest for `locales/french` for your wonderful French users, you'd want to include that in the array as well. We'll pick the right files to give the user based on their locale and the languages you marked off for each manifest.

### The Good Stuff: Artwork, Summary, Price

```json
{
  "type": "game",
  "access_type": "full",
  "release_date": "2018-09-01",
  "carousel_items": [
    "asset://carousel_1.jpg",
    "asset://carousel_2.jpg",
    "asset://carousel_3.jpg",
    "youtube://f5Q041c0Sis"
  ],
  "name": {
    "default": "My Awesome Game"
  },
  "summary": {
    "default": "This is a test.",
    "en-GB": "adadad"
  },
  "price_tier": 1999,
  "price": {
    "aud": 1499
  }
}
```

> `summary` and `name` are limited to 1024 characters per localized string. Also, if your game is in our Discord Nitro subscription service, don't set a price.

Next come the important, top-level parts of your store listing—art, descriptions, and price! Starting from the top:

- `type`: `game` or `dlc`, denoting if this store listing is for a base game, or something to purchase _for_ the base game
- `access_type`: `full`, `early access`, or `vip`
- `release_date`: the release date for your game in `yyyy-mm-dd` format
- `carousel_items`: a list of images and videos to go in the art carousel at the top of the page
  - YouTube Video: `youtube://<video_id>`
  - Image: `asset://<local_path_to_asset>`

> Assets should be either .jpg or .png format, and 1920x1080 resolution.

`price_tier` is how Discord manages prices. Rather than setting an arbitrary default value for USD, you choose a price tier at which to price your game in USD; from there, you can override prices in other locales if you feel you need to. `price_tier` is a mandatory field for any game not in Discord's Nitro Subscription service; if your game is free, the price tier would be `0`. For a full list of prices tiers, see [here](#DOCS_DISPATCH_FIELD_VALUES/price-tiers).

If you really feel the need to, you _can_ override the base USD price. If you do so, it must be higher than the next lowest price tier. That means that if you want to set the `usd` override at `1124`, your `price_tier` should be `1099`. But, in reality, you should not need to override the base USD price. Just pick the best tier! To see a list of supported currencies for overriding, look [here](#DOCS_DISPATCH_FIELD_VALUES/supported-third-party-currencies).

You'll notice that `name,` `summary`, and `price` are mappings between locales/currencies and localized values. This is how Discord currently supports localization, much like the longer markdown description files mentioned earlier. `name` is the name of your game, and `summary` is a short, one-line blurb that will appear just under the image carousel. Save your predisposition for prolific prose for the description; keep this short! `price` is, of course, the price; note that `1999` is equivalent to $19.99.

### The Nitty Gritty: System Requirements, Features, Ratings, Legal

```json
{
  "system_requirements": {
    "windows": {
      "minimum": {
        "operating system version": {
          "default": "Windows XP or newer",
          "de": "Windows XP oder neuer"
        },
        "cpu": {
          "default": "Dual Core from Intel or AMD at 2.8 GHz",
          "de": "Dual Core von Intel oder AMD mit 2,8 GHz"
        },
        "gpu": "Intel HD 3000",
        "ram": 2000,
        "disk": 20000,
        "sound card": {
          "default": "DirectX Compatible",
          "de": "DirectX-kompatibel"
        },
        "directx": {
          "default": "Version 9.0c",
          "de": "Version 9.0c"
        },
        "network": {
          "default": "Broadband Internet connection",
          "de": "Breitbandinternetverbindung"
        },
        "notes": null
      },
      "recommended": {
        "operating system version": {
          "default": "Windows 10"
        },
        "cpu": {"default": "Whatever NASA puts in the rockets"},
        "gpu": {"default": "Stick, like, 4 GTX 1080TIs together"},
        "ram": 2000,
        "disk": 20000,
        "sound card": {"default": "JayZ in your living room hooked up to your PC"},
        "directx": {"default": "Version 12.0"},
        "network": {"default": "Gigabit or bust"},
        "notes": null
      }
    },
    "macos": {},
    "linux": {}
  },
  "legal_notice": {
    "default": "Don't buy this",
    "es-ES": "Por favor, no lo compres."
  },
  "content_ratings": {
    "esrb": {
      "rating": "teen",
      "descriptors": ["fantasy_violence"]
    },
    "pegi": {}
  },
  "features": ["discord_game_invites", "single_player", "online_multiplayer", "cloud_saves", "rich_presence"],
  "locales": ["ru", "fr", "ko", "en-US", "tr", "it", "zh-CN", "pt-BR", "ro", "es-ES", "ja"]
}
```

> `legal_notice` is limited to 1024 characters per localized string

Last but not least is the nitty gritty of the page, including system requirements and legal notices. Again, from the top!

`system_requirements` are the minimum and recommended system requirements for windows, macos, and linux. The inner fields are self-explanatory; notice that some fields that require more freeform text support localization, whereas some like `ram` and `disk` (both measured in MB, by the way) are just numbers.

If your game has any required legal notices, they can be included and localized here under `legal_notice`. `content_ratings` provide space for ratings and descriptors for both ESRB and PEGI rating systems. These fields accept a pre-selected set of values. `features` is also a pre-selected set of values. `locales` are the different language locales your game supports; you can choose from any locale that Discord supports. All of these values are outlined [here](#DOCS_DISPATCH_FIELD_VALUES/).

Once you're happy with how you've described your game, give it another `dispatch store listing update awesome-game`, and watch your store page populate with great data!

### A Completed Example

Here's what a completed config file looks like all put together. How does yours look in comparison?

```json
{
  "id": "465995025021403136",
  "application_id": "352378924317147156",
  "store_listing_id": "465995025021403137",
  "related_sku_ids": [],
  "dependent_sku_id": null,
  "manifest_labels": ["460928426639884308", "460928426639889999"],
  "type": "game",
  "access_type": "full",
  "name": "My Awesome Game",
  "summary": {
    "default": "My Awesome Game is a game, and it's awesome. You should buy it because you'll love it. No, really; trust me. I'm a doctor.",
    "de": "Ich spreche kein Deutsch"
  },
  "system_requirements": {
    "windows": {
      "minimum": {
        "operating system version": {
          "default": "Windows XP or newer",
          "de": "Windows XP oder neuer"
        },
        "cpu": {
          "default": "Dual Core from Intel or AMD at 2.8 GHz",
          "de": "Dual Core von Intel oder AMD mit 2,8 GHz"
        },
        "gpu": "Intel HD 3000",
        "ram": 2000,
        "disk": 20000,
        "sound card": {
          "default": "DirectX Compatible",
          "de": "DirectX-kompatibel"
        },
        "directx": {
          "default": "Version 9.0c",
          "de": "Version 9.0c"
        },
        "network": {
          "default": "Broadband Internet connection",
          "de": "Breitbandinternetverbindung"
        },
        "notes": null
      },
      "recommended": {
        "operating system version": {
          "default": "Windows 10"
        },
        "cpu": {"default": "Whatever NASA puts in the rockets"},
        "gpu": {"default": "Stick, like, 4 GTX 1080TIs together"},
        "ram": 2000,
        "disk": 20000,
        "sound card": {"default": "JayZ in your living room hooked up to your PC"},
        "directx": {"default": "Version 12.0"},
        "network": {"default": "Gigabit or bust"},
        "notes": null
      }
    }
  },
  "release_date": "2017-11-08",
  "carousel_items": [
    "asset://carousel_1.jpg",
    "asset://carousel_2.jpg",
    "asset://carousel_3.jpg",
    "youtube://f5Q041c0Sis"
  ],
  "legal_notice": {
    "default": "This is mine, please no steal.",
    "de": "Auch hier spreche ich kein Deutsch"
  },
  "content_ratings": {
    "esrb": {
      "rating": "teen",
      "descriptors": ["fantasy_violence"]
    }
  },
  "features": ["discord_game_invites", "single_player", "online_multiplayer", "cloud_saves", "rich_presence"],
  "price_tier": 1999,
  "price": {
    "aud": 1499
  },
  "locales": ["ru", "fr", "ko", "en-US", "tr", "it", "zh-CN", "pt-BR", "ro", "es-ES", "ja"]
}
```

### You did it!

AND...that's it. You're done—you did it! Your game is live on Discord, it has a kick-ass store page full of great art and gripping descriptions. People can buy, download, and play your creation, all the while telling their Discord friends how awesome it is, and how they should all play it too.

And THAT...is pretty dang awesome.
