import { useMemo, useState } from 'react'
import { Block, Column, Columns, Title } from '@seagreenio/react-bulma'
import clsx from 'clsx'
import { I18nextContext, Link, Trans } from 'gatsby-plugin-react-i18next'

import * as styles from './LearningPath.module.scss'
// import docHome from '../../../images/docHome.svg'
import { SearchInput } from '../../../src/layout/comp/Input'
import pingcapLogo from '../../../images/pingcap-icon.svg'

// TODO: hide element instead of update whole node
export const LearningPathContainer = (props: any) => {
  const { children = [], title } = props

  const childProps = children?.length
    ? children.map((child: any) => ({
        id: child?.props?.id || '',
        label: child?.props?.label || '',
      }))
    : []

  const [selectedId, setSelectedId] = useState('')

  const filterTargetContentChild = (
    contentChildren: any[],
    targetId: string
  ) => {
    if (!selectedId) return contentChildren[0]
    return contentChildren.filter((child: any) => child?.props?.id === targetId)
  }

  return (
    <>
      {!!childProps?.length &&
        childProps.map((childProp: { id: string; label: string }) => {
          const { label: childLabel, id: childId } = childProp
          return (
            <div>
              <button
                onClick={() => {
                  setSelectedId(childId)
                }}>
                {childLabel}
              </button>
            </div>
          )
        })}
      {title && <h1 className={styles.containerTitle}>{title}</h1>}
      <div className={styles.container}>
        {/* {children.filter((child: any) => child?.props?.id === selectedId)} */}
        {childProps?.length
          ? filterTargetContentChild(children, selectedId)
          : children}
      </div>
    </>
  )
}

export const LearningPathContent = (props: any) => {
  const { children, id: contentId } = props
  return <div id={contentId}>{children}</div>
}

export const LearningPath = (props: any) => {
  const { children } = props
  return <div className={styles.item}>{children}</div>
}

export const DocHomeContainer = (props: {
  title: string
  subTitle?: string
  children?: any
}) => {
  const { title, subTitle = '', children = [] } = props

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
          <div className={styles.titleImg} />
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
            {`What's on this page`}
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
      <h2 className={styles.docHomeSectionTitle} id={id}>{label}</h2>

      {children}
    </div>
  )
}

export const DocHomeCardContainer = (props: any) => {
  const { children } = props
  return <div className={styles.cardsContainer}>{children}</div>
}

export const DocHomeCard = (props: any) => {
  const { children, href, icon = 'tidb', label } = props
  return (
    <Link to={href} className={styles.cardLink}>
      <div className={clsx('card', styles.card)}>
        <div className={clsx('card-content', styles.cardContent)}>
          <img className={styles.cardContentImg} src={pingcapLogo} />
          <h3 className={styles.cardContentH3}>{label}</h3>
          {children}
        </div>
      </div>
    </Link>
  )
}
