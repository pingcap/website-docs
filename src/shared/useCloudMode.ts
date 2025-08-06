import { navigate } from "gatsby";
import { useEffect, useState } from "react";
import { Repo } from "./interface";

export const CLOUD_MODE_KEY = "plan";
export const CLOUD_MODE_VALUE_STARTER = "starter";
export const CLOUD_MODE_VALUE_ESSENTIAL = "essential";

export const useCloudMode = (repo: Repo) => {
  const isTidbcloud = repo === Repo.tidbcloud;
  const [cloudMode, setCloudMode] = useState<string | null>(null);
  const [isStarter, setIsStarter] = useState<boolean>(false);
  const [isEssential, setIsEssential] = useState<boolean>(false);
  const [isClassic, setIsClassic] = useState<boolean>(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cloudModeFromSession = sessionStorage.getItem(CLOUD_MODE_KEY);
    const cloudMode = searchParams.get(CLOUD_MODE_KEY) || cloudModeFromSession;
    const isStarter = isTidbcloud && cloudMode === CLOUD_MODE_VALUE_STARTER;
    const isEssential = isTidbcloud && cloudMode === CLOUD_MODE_VALUE_ESSENTIAL;
    const isClassic =
      !isTidbcloud || !cloudMode || (!isStarter && !isEssential);

    setCloudMode(cloudMode);
    setIsStarter(isStarter);
    setIsEssential(isEssential);
    setIsClassic(isClassic);

    if (!isClassic) {
      navigate(
        `${location.pathname}?${CLOUD_MODE_KEY}=${cloudMode}${
          location.hash ? location.hash : ""
        }`
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
