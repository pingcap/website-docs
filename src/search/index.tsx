import { Trans, useI18next } from 'gatsby-plugin-react-i18next'
import { useEffect, useState } from 'react'
import {
  cloud,
  convertVersionName,
  dm,
  dmStable,
  operator,
  operatorStable,
  tidb,
  tidbStable,
} from 'lib/version'
import { defaultDocInfo, setLoading, setSearchValue } from 'state'
import { useDispatch, useSelector } from 'react-redux'

import { Loading } from 'components/Loading'
import { SearchResult } from './Result'
import { Seo } from 'components/Seo'
import { algoliaClient } from 'lib/algolia'
import clsx from 'clsx'
import { useLocation } from '@reach/router'

import { select, optionItem, optionLabel, isActive } from './search.module.scss'
import { graphql } from 'gatsby'
import { Layout } from 'layout'

// const matchToVersionList = (match: string) => {
//   switch (match) {
//     case 'tidb':
//       return tidb
//     case 'tidb-data-migration':
//       return dm
//     case 'tidb-in-kubernetes':
//       return operator
//     case 'tidbcloud':
//       return cloud
//     default:
//       return tidb
//   }
// }

const fetchVersionListByDocType = (docType: string) => {
  switch (docType) {
    case 'tidb':
      return tidb
    case 'tidb-data-migration':
      return dm
    case 'tidb-in-kubernetes':
      return operator
    case 'tidbcloud':
      return cloud
    default:
      return tidb
  }
}

function replaceStableVersion(match: string) {
  switch (match) {
    case 'tidb':
      return tidbStable
    case 'tidb-data-migration':
      return dmStable
    case 'tidb-in-kubernetes':
      return operatorStable
    default:
      break
  }
}

const EN_DOC_TYPE_LIST = [
  {
    name: 'TiDB',
    match: 'tidb',
  },
  {
    name: 'TiDB in Kubernetes',
    match: 'tidb-in-kubernetes',
  },
  {
    name: 'TiDB Data Migration (DM)',
    match: 'tidb-data-migration',
  },
  {
    name: 'Cloud',
    match: 'tidbcloud',
  },
] as const

const ZH_DOC_TYPE_LIST = [
  {
    name: 'TiDB',
    match: 'tidb',
  },
  {
    name: 'TiDB in Kubernetes',
    match: 'tidb-in-kubernetes',
  },
  {
    name: 'TiDB Data Migration (DM)',
    match: 'tidb-data-migration',
  },
]

const docTypeListByLang = (lang: string) => {
  switch (lang) {
    case 'zh':
      return ZH_DOC_TYPE_LIST
    default:
      return EN_DOC_TYPE_LIST
  }
}

const versionListByDocType = (docType: string) => {
  return fetchVersionListByDocType(docType) || []
}

const convertStableToRealVersion = (
  docType: string,
  docVersion: string
): string | undefined => {
  if (docType === 'tidbcloud') return undefined
  const realVersion =
    docVersion === 'stable'
      ? replaceStableVersion(docType)?.replace('release-', 'v')
      : docVersion
  return realVersion
}

const SearchPage = () => {
  const [docType, setDocType] = useState('')
  const [docVersion, setDocVersion] = useState('')
  const [docQuery, setDocQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const { language } = useI18next()
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const type = searchParams.get('type') || ''
    const version = searchParams.get('version') || ''
    const query = searchParams.get('q') || ''
    setDocType(type)
    setDocVersion(version)
    setDocQuery(query)
  }, [location.search])

  useEffect(() => {
    if (docType && docQuery) {
      execSearch()
    }
  }, [docType, docVersion, docQuery])

  const execSearch = () => {
    const realVersion = convertStableToRealVersion(docType, docVersion)
    const index = algoliaClient.initIndex(
      `${language}-${docType}${realVersion ? `-${realVersion}` : ''}`
    )
    setIsLoading(true)

    index
      .search(docQuery, {
        hitsPerPage: 150,
      })
      .then(({ hits }) => {
        setResults(hits)
        setSearched(true)
        setIsLoading(false)
      })
      .catch((reason: any) => {
        console.error(reason)
        setResults([])
        setSearched(true)
        setIsLoading(false)
      })
  }

  const handleSelectDocType = (
    selected: typeof EN_DOC_TYPE_LIST[number]['match']
  ) => {
    setDocType(selected)
  }

  return (
    <>
      <Layout>
        <Seo title="Search" noindex />
        <div>
          <div>
            <div className={select}>
              <span className={optionLabel}>
                <Trans i18nKey="search.type" />
              </span>

              {docTypeListByLang(language).map(type => (
                <button
                  key={type.name}
                  className={clsx(optionItem, {
                    [isActive]: docType === type.match,
                  })}
                  onClick={() => {
                    handleSelectDocType(
                      type.match as typeof EN_DOC_TYPE_LIST[number]['match']
                    )
                  }}>
                  {type.name}
                </button>
              ))}
            </div>

            {!!versionListByDocType(docType).length && (
              <div className={select}>
                <span className={optionLabel}>
                  <Trans i18nKey="search.version" />
                </span>

                {versionListByDocType(docType).map(version => {
                  return (
                    <button
                      key={version}
                      className={clsx(optionItem, {
                        [isActive]: docVersion === version,
                      })}
                      onClick={() => {
                        setDocVersion(version)
                      }}>
                      {version === 'stable'
                        ? convertStableToRealVersion(docType, version)
                        : version}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <SearchResult results={results} searched={searched} />
            {isLoading && (
              <Loading
                stretched
                style={{ alignItems: 'start' }}
                imgProps={{
                  style: {
                    marginTop: '2rem',
                  },
                }}
              />
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}

export default SearchPage

// export function Search() {
//   const { language } = useI18next()

//   const location = useLocation()
//   const searchParams = new URLSearchParams(location.search)
//   const type = searchParams.get('type') || defaultDocInfo['type']
//   const version = searchParams.get('version') || defaultDocInfo['version']
//   const query = searchParams.get('q')

//   const dispatch = useDispatch()

//   const loading = useSelector(state => state.loading)

//   const [selectedType, setSelectedType] = useState(type)
//   const toAlgoliaVersion = version =>
//     version === 'stable'
//       ? convertVersionName(replaceStableVersion(selectedType))
//       : version !== 'null'
//       ? version
//       : null
//   const [selectedVersion, _setSelectedVersion] = useState(
//     toAlgoliaVersion(version)
//   )
//   const setSelectedVersion = version =>
//     _setSelectedVersion(toAlgoliaVersion(version))
//   const [selectedVersionList, setSelectedVersionList] = useState(
//     matchToVersionList(type)
//   )
//   const [results, setResults] = useState([])
//   const [searched, setSearched] = useState(false)
//   const [docsTypesByLang, setDocsTypesByLang] = useState([])

//   useEffect(() => {
//     return () => dispatch(setSearchValue(''))
//   }, [dispatch])

//   useEffect(() => {
//     const types = [
//       {
//         name: 'TiDB',
//         match: 'tidb',
//       },
//       {
//         name: 'TiDB in Kubernetes',
//         match: 'tidb-in-kubernetes',
//       },
//       {
//         name: 'TiDB Data Migration (DM)',
//         match: 'tidb-data-migration',
//       },
//     ]

//     const getDocsTypesByLang = () => {
//       switch (language) {
//         default:
//           types.push({
//             name: 'Cloud',
//             match: 'tidbcloud',
//           })

//           break
//       }

//       return types
//     }

//     setDocsTypesByLang(getDocsTypesByLang())
//   }, [language])

//   const handleSetVersionList = match => () => {
//     const versionList = matchToVersionList(match)

//     setSelectedType(match)
//     setSelectedVersionList(versionList)
//     setSelectedVersion(versionList ? versionList[0] : null)
//   }

//   function execSearch() {
//     dispatch(setLoading(true))

//     const index = algoliaClient.initIndex(
//       `${language}-${selectedType}${
//         selectedVersion ? '-' + selectedVersion : ''
//       }`
//     )

//     index
//       .search(query, {
//         hitsPerPage: 150,
//       })
//       .then(({ hits }) => {
//         setResults(hits)
//         setSearched(true)
//         dispatch(setLoading(false))
//       })
//   }

//   useEffect(() => {
//     if (selectedType && query) {
//       execSearch()
//     } else {
//       setResults([])
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedType, selectedVersion, query])

//   return (
//     <Layout>
//       <Seo title="Search" noindex />
//       <div>
//         <div>
//           <div className={select}>
//             <span className={optionLabel}>
//               <Trans i18nKey="search.type" />
//             </span>

//             {docsTypesByLang.map(type => (
//               <button
//                 key={type.name}
//                 className={clsx(optionItem, {
//                   [isActive]: selectedType === type.match,
//                 })}
//                 onClick={handleSetVersionList(type.match)}>
//                 {type.name}
//               </button>
//             ))}
//           </div>

//           {selectedVersionList && (
//             <div className={select}>
//               <span className={optionLabel}>
//                 <Trans i18nKey="search.version" />
//               </span>

//               {selectedVersionList.map(version => {
//                 console.log('version', version)
//                 console.log('selectedVersion', selectedVersion)
//                 console.log(
//                   `toAlgoliaVersion(version)`,
//                   toAlgoliaVersion(version)
//                 )
//                 return (
//                   <button
//                     key={version}
//                     className={clsx(optionItem, {
//                       [isActive]: selectedVersion === toAlgoliaVersion(version),
//                     })}
//                     onClick={() =>
//                       setSelectedVersion(toAlgoliaVersion(version))
//                     }>
//                     {toAlgoliaVersion(version)}
//                   </button>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         <div style={{ position: 'relative' }}>
//           <SearchResult results={results} searched={searched} />
//           {loading && (
//             <Loading
//               stretched
//               style={{ alignItems: 'start' }}
//               imgProps={{
//                 style: {
//                   marginTop: '2rem',
//                 },
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </Layout>
//   )
// }

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
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
