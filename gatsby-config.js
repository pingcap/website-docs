require('ts-node').register({ transpileOnly: true })

module.exports = {
  siteMetadata: {
    title: 'PingCAP Docs',
    description:
      'Browse documentation about TiDB and its ecosystem, including TiDB Operator, TiDB Data Migration, Database Tools, TiUP, etc.',
    author: '@PingCAP',
    siteUrl: 'https://docs-zh-preview.netlify.app/',
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
        host: 'https://docs-zh-preview.netlify.app/',
        sitemap: 'https://docs-zh-preview.netlify.app/sitemap/index.xml',
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
  ],
}
