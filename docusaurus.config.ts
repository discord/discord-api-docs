import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Discord",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://discord.dev",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    // locales: ["da", "de", "en", "fr", "ja", "nl", "pl", "pt-br", "tr"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/discord/discord-api-docs",
        },
        pages: false,
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      logo: {
        alt: "Discord Developers",
        src: "images/wump.svg",
        srcDark: "images/wump-dark.svg",
      },
      items: [
        {
          type: "search",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          type: "html",
          value: "<a href='https://discord.com/developers/applications' target='_blank'>Developer Portal</a>",
          position: "right",
          className: "developer-portal-link",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Product",
          items: [
            {
              label: "Download",
              href: "https://discord.com/download",
            },
            {
              label: "Nitro",
              href: "https://discord.com/nitro",
            },
            {
              label: "Status",
              href: "https://discordstatus.com/",
            },
            {
              label: "App Directory",
              href: "https://discord.com/application-directory",
            },
          ],
        },
        {
          title: "Company",
          items: [
            {
              label: "About",
              href: "https://discord.com/company",
            },
            {
              label: "Jobs",
              href: "https://discord.com/careers",
            },
            {
              label: "Brand",
              href: "https://discord.com/branding",
            },
            {
              label: "Newsroom",
              href: "https://discord.com/newsroom",
            },
          ],
        },
        {
          title: "Policies",
          items: [
            {
              label: "Terms",
              href: "https://discord.com/terms",
            },
            {
              label: "Privacy",
              href: "https://discord.com/privacy",
            },
            {
              label: "Guidelines",
              href: "https://discord.com/guidelines",
            },
            {
              label: "Acknowledgements",
              href: "https://discord.com/acknowledgements",
            },
            {
              label: "Licenses",
              href: "https://discord.com/licenses",
            },
            {
              label: "Company Information",
              href: "https://discord.com/company-information",
            },
          ],
        },
      ],
      copyright: `Made with 🦶 by Discord.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: "YOUR_APP_ID",
      apiKey: "YOUR_SEARCH_API_KEY",
      indexName: "YOUR_INDEX_NAME",

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: "external\\.com|domain\\.com",

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: "/docs/", // or as RegExp: /\/docs\//
        to: "/",
      },

      // Optional: Algolia search parameters
      searchParameters: {},
      searchPagePath: false,
      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
