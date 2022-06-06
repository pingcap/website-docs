import * as styles from './404.module.scss'

import { I18nextContext, Link, Trans } from 'gatsby-plugin-react-i18next'
import { Seo } from 'components/Seo'
import { graphql } from 'gatsby'
import { I18nextProvider } from 'react-i18next'
import { useContext, useMemo } from 'react'
import i18next from 'i18next'
import { Locale } from 'typing'
import { Layout } from 'layout'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'

import { SearchInput } from '../layout/comp/Input'
import { setSearchValue } from 'state'

export default function NotFoundPage({ data }: { data: AllLocales }) {
  const { docInfo, searchValue } = useSelector(state => state) as any
  const dispatch = useDispatch()

  const handleSetSearchValue = (value: string) =>
    dispatch(setSearchValue(value))

  const pathname = typeof window === 'undefined' ? '' : window.location.pathname
  const context = useContext(I18nextContext)
  const language = useMemo(() => {
    const lang = pathname.slice(1)?.split('/')?.shift() || ''
    switch (lang) {
      case 'zh':
        return 'zh'
      case 'ja':
        return 'ja'
      default:
        break
    }
    return 'en'
  }, [pathname])
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
          <div className={styles.container}>
            <div className={clsx('markdown-body', styles.left)}>
              <h1 className={clsx(styles.title)}>
                {<Trans i18nKey="doc404.title" />}
              </h1>
              {['en', 'zh'].includes(language) && (
                <>
                  <div>{<Trans i18nKey="doc404.youMayWish" />}</div>
                  <ul className={clsx(styles.optionsContainer)}>
                    <li>
                      {
                        <Trans
                          i18nKey="doc404.goToDocHome"
                          components={[<Link to="/" />]}
                        />
                      }
                    </li>
                    <li>{<Trans i18nKey="doc404.searchDoc" />}</li>
                  </ul>
                  <div className={styles.searchInput}>
                    <SearchInput
                      docInfo={docInfo}
                      searchValue={searchValue}
                      setSearchValue={handleSetSearchValue}
                    />
                  </div>
                </>
              )}
            </div>
            <div className={clsx(styles.right)}></div>
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
