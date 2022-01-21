require('ts-node').register({ transpileOnly: true })

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
    `gatsby-plugin-root-import`,
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`${__dirname}/src/components/layout.js`),
      },
    },
    {
      resolve: `gatsby-plugin-react-intl`,
      options: {
        path: `${__dirname}/src/intl`,
        languages: ['en', 'zh'],
        defaultLanguage: 'en',
        redirectDefaultLanguageToRoot: true,
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
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              icon: '<svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>',
            },
          },
          {
            resolve: require.resolve('./gatsby/plugin/syntax-diagram'),
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: false,
            },
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
        sitemap: 'https://docs.pingcap.com/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
  ],
}
