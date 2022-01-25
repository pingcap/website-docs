import { tabsPanel, letterBtn } from './tabs-panel.module.scss'

export const TabsPanel = ({ letters }: { letters: string }) => {
  console.log(letters)
  return (
    <div className={tabsPanel}>
      {letters.split('').map(letter => (
        <a href={`#${letter}`} key={letter}>
          <div className={letterBtn}>{letter}</div>
        </a>
      ))}
    </div>
  )
}
