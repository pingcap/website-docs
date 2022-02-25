import { box, title } from './404.module.scss'

import { I18nextContext, Link, Trans } from 'gatsby-plugin-react-i18next'
import { Seo } from 'components/Seo'
import { graphql } from 'gatsby'
import { I18nextProvider } from 'react-i18next'
import { useContext, useMemo } from 'react'
import i18next from 'i18next'
import { Locale } from 'typing'
import { Layout } from 'layout'

export default function NotFoundPage({ data }: { data: AllLocales }) {
  const pathname = typeof window === 'undefined' ? '' : window.location.pathname
  const context = useContext(I18nextContext)
  const language = useMemo(
    () => (pathname.slice(1).startsWith('zh') ? 'zh' : 'en'),
    [pathname]
  )
  const i18n = useMemo(() => {
    const i18n = i18next.createInstance()

    const resources = data.locales.edges.reduce((acc, cur) => {
      acc[cur.node.language] = { [cur.node.ns]: JSON.parse(cur.node.data) }
      return acc
    }, {} as Record<string, Record<string, any>>)

    i18n.init({
      resources,
      lng: language,
      fallbackLng: 'en',
      react: {
        useSuspense: false,
      },
    })
    return i18n
  }, [language, data])

  return (
    <I18nextProvider i18n={i18n}>
      <I18nextContext.Provider value={{ ...context, language }}>
        <Layout>
          <Seo title="404 Not Found" noindex />
          <div className={box}>
            <h1 className={title}>Sorry...404!</h1>
            <main>
              The page you were looking for appears to have been moved, deleted
              or does not exist. You could go back to where you were or head
              straight to our <Link to="/">home page</Link>.
            </main>
          </div>
        </Layout>
      </I18nextContext.Provider>
    </I18nextProvider>
  )
}

interface AllLocales {
  locales: {
    edges: {
      node: {
        ns: string
        data: string
        language: Locale
      }
    }[]
  }
}

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
