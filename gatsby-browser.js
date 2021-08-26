import './src/styles/global.scss'

import { pageView } from './scripts/track'

export { default as wrapRootElement } from './src/state/ReduxWrapper'

export const onRouteUpdate = () => {
  if (process.env.NODE_ENV === 'production') {
    pageView()
  }
}
