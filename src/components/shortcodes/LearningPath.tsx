import { useState } from 'react'
import * as styles from './LearningPath.module.scss'

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
