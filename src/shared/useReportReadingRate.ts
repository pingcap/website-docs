import throttle from "lodash/throttle";
import React from "react";
import { GTMEvent, gtmTrack } from "./utils/gtm";

// timeToRead: minutes of reading
export const useReportReadingRate = (timeToRead: number) => {
  const lastPercentage = React.useRef(0);

  const handleScroll = throttle(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    const scrollPercentage = Math.min(
      (scrollTop / (scrollHeight - clientHeight)) * 100,
      100
    );

    if (
      Math.floor(scrollPercentage / 10) >
      Math.floor(lastPercentage.current / 10)
    ) {
      lastPercentage.current = Math.floor(scrollPercentage / 10) * 10;
    }
  }, 1000);

  const startTime = React.useRef(Date.now());
  const timeToReadSecond = timeToRead * 60;

  const reportReadingRate = () => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime.current) / 1000);

    if (document.visibilityState === "hidden") {
      if (timeSpent < 6) {
        return;
      }
      gtmTrack(GTMEvent.ReadingRate, {
        readingRate:
          Math.min(Math.floor((timeSpent / timeToReadSecond) * 100) / 100, 1) *
          lastPercentage.current,
        timeToRead: timeToReadSecond,
        timeSpent,
        scrollPercentage: lastPercentage.current,
      });
    } else {
      startTime.current = Date.now();
    }
  };

  React.useEffect(() => {
    window.addEventListener("visibilitychange", reportReadingRate);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("visibilitychange", reportReadingRate);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
};
