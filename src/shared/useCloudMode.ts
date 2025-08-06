import { navigate } from "gatsby";
import { useEffect } from "react";
import { Repo } from "./interface";

export const CLOUD_MODE_KEY = "plan";
export const CLOUD_MODE_VALUE_STARTER = "starter";
export const CLOUD_MODE_VALUE_ESSENTIAL = "essential";

export const useCloudMode = () => {
  const pathname = location.pathname;
  const isTidbcloud = pathname.includes(Repo.tidbcloud);
  const cloudModeFromSession = sessionStorage.getItem(CLOUD_MODE_KEY);
  const searchParams = new URLSearchParams(location.search);
  const cloudMode = searchParams.get(CLOUD_MODE_KEY) || cloudModeFromSession;
  const isStarter = isTidbcloud && cloudMode === CLOUD_MODE_VALUE_STARTER;
  const isEssential = isTidbcloud && cloudMode === CLOUD_MODE_VALUE_ESSENTIAL;
  const isClassic = !isTidbcloud || !cloudMode || (!isStarter && !isEssential);

  useEffect(() => {
    if (!isClassic) {
      navigate(
        `${location.pathname}${
          location.hash ? location.hash : ""
        }?${CLOUD_MODE_KEY}=${cloudMode}`
      );
    }
  }, []);

  return {
    cloudMode,
    isStarter,
    isEssential,
    isClassic,
  };
};

export const useCloudModeStore = () => {};
