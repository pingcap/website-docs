import { navigate } from "gatsby";
import { useLocation } from "@reach/router";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { CloudPlan, Repo, TOCNamespace } from "./interface";

export const CLOUD_MODE_KEY = "plan";

const TOC_NAME_TO_CLOUD_PLAN: Record<string, CloudPlan> = {
  TOC: CloudPlan.Dedicated,
  "TOC-tidb-cloud-starter": CloudPlan.Starter,
  "TOC-tidb-cloud-essential": CloudPlan.Essential,
  "TOC-tidb-cloud-premium": CloudPlan.Premium,
};

function isCloudPlan(value: string | null): value is CloudPlan {
  return (
    value === CloudPlan.Dedicated ||
    value === CloudPlan.Starter ||
    value === CloudPlan.Essential ||
    value === CloudPlan.Premium
  );
}

function getCloudPlansFromTocNames(tocNames: string[] | null | undefined) {
  if (!tocNames || tocNames.length === 0) return [];
  const plans: CloudPlan[] = [];
  const seen = new Set<CloudPlan>();
  tocNames.forEach((tocName) => {
    const plan = TOC_NAME_TO_CLOUD_PLAN[tocName];
    if (!plan || seen.has(plan)) return;
    plans.push(plan);
    seen.add(plan);
  });
  return plans;
}

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

  const setCloudPlan = useCallback(
    (cloudPlan: CloudPlan) => {
      _setCloudPlan(cloudPlan);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(CLOUD_MODE_KEY, cloudPlan);
      }
    },
    [_setCloudPlan]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cloudPlanFromQueryRaw = searchParams.get(CLOUD_MODE_KEY);
    const cloudPlanFromSessionRaw = sessionStorage.getItem(CLOUD_MODE_KEY);
    const cloudPlanFromQuery = isCloudPlan(cloudPlanFromQueryRaw)
      ? cloudPlanFromQueryRaw
      : null;
    const cloudPlanFromSession = isCloudPlan(cloudPlanFromSessionRaw)
      ? cloudPlanFromSessionRaw
      : null;
    const cloudPlan = cloudPlanFromQuery || cloudPlanFromSession || _cloudPlan;
    _setCloudPlan(cloudPlan);
  }, []);

  const isStarter = isTidbcloud && _cloudPlan === CloudPlan.Starter;
  const isEssential = isTidbcloud && _cloudPlan === CloudPlan.Essential;
  const isPremium = isTidbcloud && _cloudPlan === CloudPlan.Premium;
  const isClassic =
    !isTidbcloud || !_cloudPlan || (!isStarter && !isEssential);

  return {
    cloudPlan: _cloudPlan,
    setCloudPlan,
    isStarter,
    isEssential,
    isPremium,
    isClassic,
  };
};

export const useCloudPlanNavigate = (
  namespace: TOCNamespace,
  inDefaultPlan: CloudPlan | null,
  tocNames: string[] | null | undefined,
  cloudPlan: CloudPlan | null,
  setCloudPlan: (plan: CloudPlan) => void
) => {
  const { pathname, search, hash } = useLocation();
  const tocNamesKey = Array.isArray(tocNames) ? tocNames.join("|") : "";

  useEffect(() => {
    if (namespace !== TOCNamespace.TiDBCloud) {
      return;
    }
    const searchParams = new URLSearchParams(search);

    const cloudModeFromQueryRaw = searchParams.get(CLOUD_MODE_KEY);
    const cloudModeFromSessionRaw = sessionStorage.getItem(CLOUD_MODE_KEY);

    const cloudModeFromQuery = isCloudPlan(cloudModeFromQueryRaw)
      ? cloudModeFromQueryRaw
      : null;
    const cloudModeFromSession = isCloudPlan(cloudModeFromSessionRaw)
      ? cloudModeFromSessionRaw
      : null;

    const allowedCloudPlans = getCloudPlansFromTocNames(tocNames);
    const defaultCloudPlan =
      allowedCloudPlans[0] || inDefaultPlan || CloudPlan.Dedicated;

    const requestedCloudPlan = cloudModeFromQuery || cloudModeFromSession;
    const shouldFallbackToDefault =
      !requestedCloudPlan ||
      (allowedCloudPlans.length > 0 &&
        !allowedCloudPlans.includes(requestedCloudPlan));

    const cloudMode = shouldFallbackToDefault
      ? defaultCloudPlan
      : requestedCloudPlan;

    if (cloudPlan !== cloudMode) {
      setCloudPlan(cloudMode);
    }

    if (cloudModeFromSession !== cloudMode) {
      sessionStorage.setItem(CLOUD_MODE_KEY, cloudMode);
    }

    // Ensure URL carries the chosen plan when necessary, and fix invalid/mismatched plan param.
    if (cloudMode !== CloudPlan.Dedicated) {
      if (cloudModeFromQuery !== cloudMode) {
        searchParams.set(CLOUD_MODE_KEY, cloudMode);
        navigate(
          `${pathname}?${searchParams.toString()}${hash || ""}`,
          { replace: true }
        );
      }
      return;
    }

    // Dedicated: keep URL without plan param by default; only normalize when an invalid/mismatched plan is present.
    if (cloudModeFromQueryRaw && cloudModeFromQueryRaw !== CloudPlan.Dedicated) {
      searchParams.set(CLOUD_MODE_KEY, CloudPlan.Dedicated);
      navigate(
        `${pathname}?${searchParams.toString()}${hash || ""}`,
        { replace: true }
      );
    }
  }, [
    namespace,
    inDefaultPlan,
    tocNamesKey,
    cloudPlan,
    setCloudPlan,
    pathname,
    search,
    hash,
  ]);
};
