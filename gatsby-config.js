require('ts-node').register({ transpileOnly: true })

const docs = require('./docs.json')

module.exports = {
  siteMetadata: {
    title: 'PingCAP Docs',
    description:
      'Browse documentation about TiDB and its ecosystem, including TiDB Operator, TiDB Data Migration, Database Tools, TiUP, etc.',
    author: '@PingCAP',
    siteUrl: 'https://docs.pingcap.com',
  },
  jsxRuntime: 'automatic',
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-99991864-7',
        head: true,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          'G-BQ970DC3WX', // Google Analytics / GA
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          optimize_id: 'GTM-WQG8Z75',
          anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          // exclude: ['/preview/**', '/do-not-track/me/too/'],
        },
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
        languages: [`en`, `zh`],
        defaultLanguage: `en`,
        redirect: false,
        // if you are using Helmet, you must include siteUrl, and make sure you add http:https
        siteUrl: 'https://docs.pingcap.com',
        // you can pass any i18next options
        i18nextOptions: {
          interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
          },
          nsSeparator: false,
        },
        pages: [
          {
            matchPath: '/:lang?/404',
            getLanguageFromPath: true,
          },
          {
            matchPath: `/:lang?/(${Object.keys(docs.docs).join('|')})/(.*)`,
            getLanguageFromPath: true,
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet-async`,
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
        path: `${__dirname}/markdown-pages`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          `gatsby-remark-autolink-headers`,
          {
            resolve: require.resolve('./gatsby/plugin/syntax-diagram'),
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: false,
            },
          },
          {
            resolve: require.resolve('./gatsby/plugin/content'),
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        useResolveUrlLoader: true,
        cssLoaderOptions: {
          modules: {
            localIdentName:
              process.env.NODE_ENV === 'production'
                ? '[hash:base64:8]'
                : '[path][name]__[local]--[hash:base64:5]',
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        ignore: [
          '/doc.scss',
          '/userFeedback.scss',
          'github-markdown-css',
          `.module.scss`,
        ],
        purgeCSSOptions: {
          content: [
            `${__dirname}/gatsby/**/*.js`,
            `${__dirname}/gatsby/**/*.ts`,
            `${__dirname}/src/**/*.js`,
            `${__dirname}/src/**/*.ts`,
            `${__dirname}/src/**/*.tsx`,
            `${__dirname}/node_modules/@seagreenio/react-bulma/dist/index.es.js`,
          ],
          safelist: [
            // @seagreenio/react-bulma
            /^is-|has-/,
            'algolia-docsearch-suggestion--highlight',
          ], // https://github.com/FullHuman/purgecss/releases/v3.0.0
        },
      },
    },
    `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-meta-redirect`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: ['/404', '/zh/404', '/search', '/zh/search'],
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://docs.pingcap.com',
        sitemap: 'https://docs.pingcap.com/sitemap/sitemap-index.xml',
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
  ],
}
