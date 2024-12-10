require("ts-node").register({ transpileOnly: true });

const docs = require("./docs/docs.json");

module.exports = {
  siteMetadata: {
    title:
      process.env.WEBSITE_BUILD_TYPE === "archive"
        ? "TiDB Archived Docs"
        : "TiDB Docs",
    description:
      "Explore the how-to guides and references you need to use TiDB Cloud and TiDB, migrate data, and build your applications on the database.",
    author: "@PingCAP",
    siteUrl:
      process.env.WEBSITE_BUILD_TYPE === "archive"
        ? "https://docs-archive.pingcap.com"
        : "https://docs.pingcap.com",
  },
  jsxRuntime: "automatic",
  plugins: [
    {
      resolve: "@sentry/gatsby",
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-WQG8Z75",
        includeInDevelopment: false,
        defaultDataLayer: { platform: "gatsby" },
        enableWebVitalsTracking: true,
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-TPX49SBK",
        includeInDevelopment: false,
      },
    },
    `gatsby-plugin-root-import`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locale`,
        name: `locale`,
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`, // name given to `gatsby-source-filesystem` plugin.
        languages: [`en`, `zh`, "ja"],
        defaultLanguage: `en`,
        redirect: false,
        // if you are using Helmet, you must include siteUrl, and make sure you add http:https
        siteUrl:
          process.env.WEBSITE_BUILD_TYPE === "archive"
            ? "https://docs-archive.pingcap.com"
            : "https://docs.pingcap.com",
        // you can pass any i18next options
        i18nextOptions: {
          interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
          },
          nsSeparator: false,
        },
        pages: [
          {
            matchPath: "/:lang?/404",
            getLanguageFromPath: true,
          },
          {
            matchPath: `/:lang?/(${Object.keys(docs.docs).join("|")})/(.*)`,
            getLanguageFromPath: true,
          },
          {
            matchPath: "/:lang?/",
            getLanguageFromPath: true,
          },
        ],
      },
    },
    {
      resolve: `./gatsby/plugin/helmet-async`,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/docs/markdown-pages`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        // https://github.com/gatsbyjs/gatsby/issues/21866#issuecomment-1063668178
        // Add katex support
        remarkPlugins: [require("remark-math")],
        rehypePlugins: [[require("rehype-katex"), { strict: "ignore" }]],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: `100`,
              enableCustomId: true,
              isIconAfterHeader: true,
            },
          },
          {
            resolve: require.resolve("./gatsby/plugin/syntax-diagram"),
          },
          {
            resolve: require.resolve("./gatsby/plugin/content"),
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          require(`postcss-preset-env`)({ stage: 0 }),
          require(`postcss-simple-vars`),
          require(`postcss-nested`),
          require(`postcss-mixins`),
        ],
      },
    },
    "gatsby-plugin-dts-css-modules",
    // {
    //   resolve: `gatsby-plugin-sass`,
    //   options: {
    //     useResolveUrlLoader: true,
    //     cssLoaderOptions: {
    //       modules: {
    //         localIdentName:
    //           process.env.NODE_ENV === "production"
    //             ? "[hash:base64:8]"
    //             : "[path][name]__[local]--[hash:base64:5]",
    //       },
    //     },
    //   },
    // },
    // {
    //   resolve: `gatsby-plugin-purgecss`,
    //   options: {
    //     printRejected: true,
    //     ignore: [
    //       "/doc.scss",
    //       "/userFeedback.scss",
    //       "github-markdown-css",
    //       `.module.scss`,
    //     ],
    //     purgeCSSOptions: {
    //       content: [
    //         `${__dirname}/gatsby/**/*.js`,
    //         `${__dirname}/gatsby/**/*.ts`,
    //         `${__dirname}/src/**/*.js`,
    //         `${__dirname}/src/**/*.ts`,
    //         `${__dirname}/src/**/*.tsx`,
    //         `${__dirname}/node_modules/@seagreenio/react-bulma/dist/index.es.js`,
    //       ],
    //       safelist: [
    //         // @seagreenio/react-bulma
    //         /^is-|has-/,
    //         "algolia-docsearch-suggestion--highlight",
    //       ], // https://github.com/FullHuman/purgecss/releases/v3.0.0
    //     },
    //   },
    // },
    `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-meta-redirect`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: ["/404", "/zh/404", "/search", "/zh/search"],
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host:
          process.env.WEBSITE_BUILD_TYPE === "archive"
            ? "https://docs-archive.pingcap.com"
            : "https://docs.pingcap.com",
        sitemap: `${
          process.env.WEBSITE_BUILD_TYPE === "archive"
            ? "https://docs-archive.pingcap.com"
            : "https://docs.pingcap.com"
        }/sitemap/sitemap-index.xml`,
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /src\/media/,
        },
      },
    },
    `gatsby-plugin-material-ui`,
  ],
};
