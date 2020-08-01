const purgecssWhitelist = require('./purgecss-whitelist')
const { remarkSyntaxDiagram } = require('./src/lib/remarkSyntaxDiagram')

module.exports = {
  siteMetadata: {
    title: `PingCAP Docs`,
    description: `PingCAP Docs`,
    author: `@PingCAP`,
    siteUrl: `https://docs.pingcap.com`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-99991864-7',
        head: true,
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
        name: `markdown-pages/contents/en`,
        path: `${__dirname}/markdown-pages/contents/en`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages/contents/zh`,
        path: `${__dirname}/markdown-pages/contents/zh`,
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
        remarkPlugins: [remarkSyntaxDiagram],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-autolink-headers`],
      },
    },
    `gatsby-plugin-remove-serviceworker`,
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
    `gatsby-plugin-meta-redirect`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/website-docs-sitemap.xml`,
        exclude: ['/404', '/zh/404', '/search', '/zh/search'],
      },
    },
  ],
}
