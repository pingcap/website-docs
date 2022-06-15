import { useMemo, useState } from 'react'
import * as styles from './LearningPath.module.scss'

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
  const getHeadings = (items: any): { label: string; anchor: string }[] => {
    if (items?.length) {
      return items.map((item: any) => ({
        label: item?.label || '',
        anchor: item?.anchor || '',
      }))
    }
    return [
      {
        label: items?.label || '',
        anchor: items?.anchor || '',
      },
    ]
  }
  const headingsMemo = useMemo(() => {
    return getHeadings(children)
  }, [children])
  return (
    <>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{title}</h1>
        {subTitle && <div className={styles.subTitle}>{subTitle}</div>}
      </div>
      <div>
        <aside className="menu">
          <ul className="menu-list">
            <li>
              <a>Members</a>
            </li>
            <li>
              <a>Plugins</a>
            </li>
            <li>
              <a>Add a member</a>
            </li>
          </ul>
        </aside>
      </div>
    </>
  )
}

export const DocHomeItem = (props: any) => {
  const { children } = props
  return <>{children}</>
}

export const DocHomeCards = (props: any) => {
  return <></>
}

export const DocHomeCardItem = (props: any) => {
  return <></>
}
