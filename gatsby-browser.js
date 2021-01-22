/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import { pageView } from './scripts/track'
import './src/styles/global.scss'

export { default as wrapRootElement } from './src/state/ReduxWrapper'

export const onRouteUpdate = () => {
  if (process.env.NODE_ENV === 'production') {
    pageView()
  }
}
