import { navigate } from "gatsby";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Repo } from "./interface";

export const CLOUD_MODE_KEY = "plan";
export const CLOUD_MODE_VALUE_STARTER = "starter";
export const CLOUD_MODE_VALUE_ESSENTIAL = "essential";

export type CloudPlan = "dedicated" | "starter" | "essential" | "premium";

const CloudPlanContext = createContext<{
  repo: Repo;
  cloudPlan: CloudPlan | null;
  setCloudPlan: Dispatch<SetStateAction<CloudPlan | null>>;
}>({
  repo: Repo.tidb,
  cloudPlan: null,
  setCloudPlan: () => {},
});
export const CloudPlanProvider = CloudPlanContext.Provider;

export const useCloudPlan = () => {
  const {
    cloudPlan: _cloudPlan,
    setCloudPlan: _setCloudPlan,
    repo,
  } = useContext(CloudPlanContext);
  const isTidbcloud = repo === Repo.tidbcloud;
  const [isStarter, setIsStarter] = useState<boolean>(false);
  const [isEssential, setIsEssential] = useState<boolean>(false);
  const [isClassic, setIsClassic] = useState<boolean>(true);

  const setCloudPlan = (cloudPlan: CloudPlan) => {
    _setCloudPlan(cloudPlan);
    sessionStorage.setItem(CLOUD_MODE_KEY, cloudPlan);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cloudPlanFromSession = sessionStorage.getItem(CLOUD_MODE_KEY);
    const cloudPlan = (searchParams.get(CLOUD_MODE_KEY) ||
      cloudPlanFromSession ||
      _cloudPlan) as CloudPlan;
    const isStarter = isTidbcloud && cloudPlan === CLOUD_MODE_VALUE_STARTER;
    const isEssential = isTidbcloud && cloudPlan === CLOUD_MODE_VALUE_ESSENTIAL;
    const isClassic =
      !isTidbcloud || !cloudPlan || (!isStarter && !isEssential);

    _setCloudPlan(cloudPlan);
    setIsStarter(isStarter);
    setIsEssential(isEssential);
    setIsClassic(isClassic);
  }, []);

  return {
    cloudPlan: _cloudPlan,
    setCloudPlan,
    isStarter,
    isEssential,
    isClassic,
  };
};

export const useCloudPlanNavigate = (
  repo: Repo,
  inDefaultPlan: string | null
) => {
  useEffect(() => {
    if (repo !== Repo.tidbcloud) {
      return;
    }
    const searchParams = new URLSearchParams(location.search);
    const cloudModeFromSession = sessionStorage.getItem(CLOUD_MODE_KEY);
    const cloudMode =
      searchParams.get(CLOUD_MODE_KEY) || cloudModeFromSession || inDefaultPlan;

    if (!cloudModeFromSession && !!cloudMode) {
      sessionStorage.setItem(CLOUD_MODE_KEY, cloudMode);
    }

    if (
      !!cloudMode &&
      cloudMode !== "dedicated" &&
      !searchParams.get(CLOUD_MODE_KEY)
    ) {
      navigate(
        `${location.pathname}?${CLOUD_MODE_KEY}=${cloudMode}${
          location.hash ? location.hash : ""
        }`,
        { replace: true }
      );
    }
  }, []);
};
