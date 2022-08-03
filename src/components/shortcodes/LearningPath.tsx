import { useMemo, useState, useEffect, useRef } from 'react'
import { Block, Column, Columns, Title } from '@seagreenio/react-bulma'
import clsx from 'clsx'
import { I18nextContext, Link, Trans } from 'gatsby-plugin-react-i18next'

import * as styles from './LearningPath.module.scss'
// import docHome from '../../../images/docHome.svg'
import { SearchInput } from '../../../src/layout/comp/Input'
import pingcapLogo from '../../../images/pingcap-icon.svg'

// TODO: hide element instead of update whole node
export const LearningPathContainer = (props: {
  title: string
  subTitle?: string
  children?: any
  platform: 'home' | 'tidb' | 'tidb-cloud'
}) => {
  const { children, title, subTitle, platform = 'tidb' } = props

  return (
    <>
      <div className={styles.titleGroup}>
        <div className={styles.titleLeft}>
          <h1 className={styles.title}>{title}</h1>
          {subTitle && <div className={styles.subTitle}>{subTitle}</div>}
        </div>
        <div className={styles.titleRight}>
          {/* <img src={docHome} /> */}
          <div
            className={clsx(styles.titleImg, {
              [styles.titleImgHome]: platform === 'home',
              [styles.titleImgTidb]: platform === 'tidb',
              [styles.titleImgCloud]: platform === 'tidb-cloud',
            })}
          />
        </div>
      </div>
      <div className={styles.learningPathContainer}>{children}</div>
    </>
  )
}

export const LearningPath = (props: {
  children?: any
  label: string
  icon: string
}) => {
  const { children, label, icon } = props
  return (
    <>
      <div className={clsx(styles.learningPath)}>
        <div className={styles.LearningPathLeft}>
          <img
            className={styles.LearningPathImg}
            src={require(`../../../images/docHome/${icon}.svg`)?.default}
          />
          <p className={styles.LearningPathLabel}>{label}</p>
        </div>
        <div className={clsx('card', styles.LearningPathRight)}>{children}</div>
      </div>
    </>
  )
}

export const DocHomeContainer = (props: {
  title: string
  subTitle?: string
  children?: any
  platform: 'home' | 'tidb' | 'tidb-cloud'
}) => {
  const { title, subTitle = '', children = [], platform = 'home' } = props

  const [searchValue, setSearchValue] = useState('')

  const getHeadings = (
    items: any
  ): { label: string; anchor: string; id: string }[] => {
    if (items?.length) {
      return items.map((item: any) => ({
        label: item?.props?.label || '',
        anchor: item?.props?.anchor || '',
        id: item?.props?.id || '',
      }))
    }
    return [
      {
        label: items?.props?.label || '',
        anchor: items?.props?.anchor || '',
        id: items?.props?.id || '',
      },
    ]
  }

  const headingsMemo = useMemo(() => {
    return getHeadings(children)
  }, [children])

  return (
    <>
      <div className={styles.titleGroup}>
        <div className={styles.titleLeft}>
          <h1 className={styles.title}>{title}</h1>
          {subTitle && <div className={styles.subTitle}>{subTitle}</div>}
          <div className={styles.search}>
            <SearchInput
              docInfo={{ type: 'tidb', version: 'stable' }}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
        </div>
        <div className={styles.titleRight}>
          {/* <img src={docHome} /> */}
          <div
            className={clsx(styles.titleImg, {
              [styles.titleImgHome]: platform === 'home',
              [styles.titleImgTidb]: platform === 'tidb',
              [styles.titleImgCloud]: platform === 'tidb-cloud',
            })}
          />
        </div>
      </div>
      <div className={clsx('columns', 'is-3', styles.body)}>
        <main className={clsx('column', styles.mainContainer)}>{children}</main>
        <aside
          className={clsx(
            'column',
            'is-2',
            'doc-toc',
            'right-aside',
            styles.toc
          )}>
          <Title size={6} style={{ marginBottom: 0, paddingTop: '40px' }}>
            <Trans i18nKey="doc.toc" />
          </Title>
          <ul className={styles.menu}>
            {headingsMemo.map(i => (
              <li key={i.id} className={styles.menuItem}>
                <a href={`#${i.anchor}`}>{i.label}</a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  )
}

interface DocHomeSectionProps {
  children?: any
  label: string
  anchor: string
  id: string
}

export const DocHomeSection = (props: DocHomeSectionProps) => {
  const { children, label, id } = props
  return (
    <div className={styles.docHomeSection}>
      <h2 className={styles.docHomeSectionTitle} id={id}>
        {label}
      </h2>

      {children}
    </div>
  )
}

export const DocHomeCardContainer = (props: any) => {
  const { children } = props
  return <div className={styles.cardsContainer}>{children}</div>
}

export const DocHomeCard = (props: any) => {
  const { children, href = '', icon = 'cloud1', label } = props

  const isInternalLink =
    href.startsWith('https://') || href.startsWith('http://')

  if (!isInternalLink)
    return (
      <Link to={href} className={styles.cardLink}>
        <div className={clsx('card', styles.card)}>
          <div className={clsx('card-content', styles.cardContent)}>
            {/* <img className={styles.cardContentImg} src={pingcapLogo} /> */}
            <img
              className={styles.cardContentImg}
              src={require(`../../../images/docHome/${icon}.svg`)?.default}
            />
            <h3 className={styles.cardContentH3}>{label}</h3>
            {children}
          </div>
        </div>
      </Link>
    )

  return (
    <a href={href} className={styles.cardLink}>
      <div className={clsx('card', styles.card)}>
        <div className={clsx('card-content', styles.cardContent)}>
          {/* <img className={styles.cardContentImg} src={pingcapLogo} /> */}
          <img
            className={styles.cardContentImg}
            src={require(`../../../images/docHome/${icon}.svg`)?.default}
          />
          <h3 className={styles.cardContentH3}>{label}</h3>
          {children}
        </div>
      </div>
    </a>
  )
}
