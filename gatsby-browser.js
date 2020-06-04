/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import './src/styles/global.scss'

//www.gatsbyjs.org/packages/gatsby-plugin-mdx-prismjs/?=syntax
require('prismjs/themes/prism-solarizedlight.css')

export { default as wrapRootElement } from './src/state/ReduxWrapper'
