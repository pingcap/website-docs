import { pageView } from './scripts/track'

export { default as wrapRootElement } from './src/state/wrap-with-provider'

export const onRouteUpdate = ({ location, prevLocation }) => {
  if (process.env.NODE_ENV === 'production') {
    pageView()
  }
  console.log(`
  ██████╗ ██╗███╗   ██╗ ██████╗  ██████╗ █████╗ ██████╗     ██████╗  ██████╗  ██████╗███████╗
  ██╔══██╗██║████╗  ██║██╔════╝ ██╔════╝██╔══██╗██╔══██╗    ██╔══██╗██╔═══██╗██╔════╝██╔════╝
  ██████╔╝██║██╔██╗ ██║██║  ███╗██║     ███████║██████╔╝    ██║  ██║██║   ██║██║     ███████╗
  ██╔═══╝ ██║██║╚██╗██║██║   ██║██║     ██╔══██║██╔═══╝     ██║  ██║██║   ██║██║     ╚════██║
  ██║     ██║██║ ╚████║╚██████╔╝╚██████╗██║  ██║██║         ██████╔╝╚██████╔╝╚██████╗███████║
  ╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝         ╚═════╝  ╚═════╝  ╚═════╝╚══════╝
                                                                                             
  =====================================
  Project        : pingcap/website-docs
  Build Time     : ${process.env.BUILD_DATE}
  Env            : ${process.env.NODE_ENV}
  Page Location  : ${location.pathname}
  GIT Tag        : ${process.env.BUILD_GIT_SHA}
  Docs Staging   : ${process.env.BUILD_SUBMODULE_SHA}
  =====================================
  `)
}
