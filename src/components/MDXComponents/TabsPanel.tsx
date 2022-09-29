import { tabsPanel, letterBtn } from "./tabs-panel.module.css";

export const TabsPanel = ({ letters }: { letters: string }) => (
  <div className={tabsPanel}>
    {letters.split("").map((letter) => (
      <a href={`#${letter}`} key={letter}>
        <div className={letterBtn}>{letter}</div>
      </a>
    ))}
  </div>
);
