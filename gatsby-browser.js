import './src/styles/global.scss'

import { pageView } from './scripts/track'

export { default as wrapRootElement } from './src/state/wrap-with-provider'

export const onRouteUpdate = () => {
  if (process.env.NODE_ENV === 'production') {
    pageView()
  }
}
