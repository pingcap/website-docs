const purgecssWhitelist = require('./purgecss-whitelist')
const { remarkSyntaxDiagram } = require('./src/lib/remarkSyntaxDiagram')

module.exports = {
  siteMetadata: {
    title: 'PingCAP Docs',
    description: 'PingCAP Docs',
    author: '@PingCAP',
    siteUrl: 'https://docs.pingcap.com',
  },
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
        ignoredPaths: [
          '?(/zh)/(tidb|tidb-data-migration|tidb-in-kubernetes|dev-guide|tidbcloud)/**',
        ],
        fallbackLanguage: 'en',
      },
    },
    `gatsby-plugin-react-helmet`,
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
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: false,
            },
          },
        ],
        remarkPlugins: [() => remarkSyntaxDiagram],
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        useResolveUrlLoader: true,
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        content: [
          `${__dirname}/src/**/*.js`,
          `${__dirname}/node_modules/@seagreenio/react-bulma/dist/index.es.js`,
        ],
        whitelistPatternsChildren: [/^PingCAP-Doc/],
        whitelist: purgecssWhitelist,
        ignore: ['prismjs/'],
      },
    },
    `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-meta-redirect`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
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
