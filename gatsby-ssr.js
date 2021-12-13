export { default as wrapRootElement } from './src/state/wrap-with-provider'

// https://github.com/gatsbyjs/gatsby/issues/1526
export const onPreRenderHTML = ({ getHeadComponents }) => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  getHeadComponents().forEach(el => {
    if (el.type === 'style' && el.props['data-href']) {
      el.type = 'link'
      el.props['href'] = el.props['data-href']
      el.props['rel'] = 'stylesheet'

      delete el.props['data-href']
      delete el.props['dangerouslySetInnerHTML']
    }
  })
}
