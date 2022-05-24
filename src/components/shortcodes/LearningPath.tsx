import * as styles from './LearningPath.module.scss'

export const LearningPathContainer = (props: any) => {
  const { children, title } = props
  return (
    <>
      {title && <h1 className={styles.containerTitle}>{title}</h1>}
      <div className={styles.container}>{children}</div>
    </>
  )
}

export const LearningPath = (props: any) => {
  const { children } = props
  return <div className={styles.item}>{children}</div>
}
