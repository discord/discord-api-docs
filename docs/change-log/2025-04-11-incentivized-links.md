---
title: "Custom Incentivized Links"
date: "2025-04-11"
topics:
- "Activities"
- "Embedded App SDK"
---

### Custom Incentivized Links for Activities

Custom Incentivized Links are used to customize how your incentivized link embed appears to users. You can create them in the developer portal or generate them from within your activity. Incentivized Links can be used as referral links, promotions, deep-linking into your activity, and more.

- shareLink will now let you attach custom params to links you share about your game using `custom_id`.
- Removed `referrer_id` from shareLink API. Any uses of `referrer_id` should be moved over to use `custom_id` instead. Passing `referrer_id` to shareLink will silently fail.

Learn more about [creating and managing Custom Incentivized Links](/docs/activities/development-guides/growth-and-referrals#creating-and-managing-custom-incentivized-links) and [how to generate them from within your activity](/docs/activities/development-guides/growth-and-referrals#generating-a-custom-link-within-your-activity) with the shareLink API.

The Embedded App SDK is available via [npm](https://www.npmjs.com/package/@discord/embedded-app-sdk) and [GitHub](https://github.com/discord/embedded-app-sdk). You can check out our [installation guide and reference](/docs/developer-tools/embedded-app-sdk) to get started with it!
