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

const CloudPlanContext = createContext<{
  repo: Repo;
  cloudPlan: string | null;
  setCloudPlan: Dispatch<SetStateAction<string | null>>;
}>({
  repo: Repo.tidb,
  cloudPlan: null,
  setCloudPlan: () => {},
});
export const CloudPlanProvider = CloudPlanContext.Provider;

export const useCloudPlan = () => {
  const {
    cloudPlan,
    setCloudPlan: _setCloudPlan,
    repo,
  } = useContext(CloudPlanContext);
  const isTidbcloud = repo === Repo.tidbcloud;
  const [isStarter, setIsStarter] = useState<boolean>(false);
  const [isEssential, setIsEssential] = useState<boolean>(false);
  const [isClassic, setIsClassic] = useState<boolean>(true);

  const setCloudPlan = (cloudPlan: string) => {
    _setCloudPlan(cloudPlan);
    sessionStorage.setItem(CLOUD_MODE_KEY, cloudPlan);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cloudPlanFromSession = sessionStorage.getItem(CLOUD_MODE_KEY);
    const cloudPlan = searchParams.get(CLOUD_MODE_KEY) || cloudPlanFromSession;
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
    cloudPlan,
    setCloudPlan,
    isStarter,
    isEssential,
    isClassic,
  };
};

export const useCloudPlanNavigate = () => {
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cloudModeFromSession = sessionStorage.getItem(CLOUD_MODE_KEY);
    const cloudMode = searchParams.get(CLOUD_MODE_KEY) || cloudModeFromSession;

    if (!!cloudMode && cloudMode !== "dedicated") {
      navigate(
        `${location.pathname}?${CLOUD_MODE_KEY}=${cloudMode}${
          location.hash ? location.hash : ""
        }`
      );
    }
  }, []);
};
