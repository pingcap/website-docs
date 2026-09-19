import { navigate } from "gatsby";
import { useLocation } from "@reach/router";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { getCloudPlanFromPathname } from "./cloud-plan-route";
import { CloudCompatibility, CloudPlan, Repo, TOCNamespace } from "./interface";

export const CLOUD_MODE_KEY = "plan";
export const CLOUD_COMPATIBILITY_KEY = "compatibility";

const TOC_NAME_TO_CLOUD_PLAN: Record<string, CloudPlan> = {
  TOC: CloudPlan.Dedicated,
  "TOC-tidb-cloud-starter": CloudPlan.Starter,
  "TOC-tidb-cloud-starter-postgresql": CloudPlan.Starter,
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
  cloudCompatibility: CloudCompatibility;
  setCloudCompatibility: Dispatch<SetStateAction<CloudCompatibility>>;
}>({
  repo: Repo.tidb,
  cloudPlan: null,
  setCloudPlan: () => {},
  cloudCompatibility: CloudCompatibility.MySQL,
  setCloudCompatibility: () => {},
});
export const CloudPlanProvider = CloudPlanContext.Provider;

export const useCloudPlan = () => {
  const {
    cloudPlan: _cloudPlan,
    setCloudPlan: _setCloudPlan,
    cloudCompatibility: _cloudCompatibility,
    setCloudCompatibility: _setCloudCompatibility,
    repo,
  } = useContext(CloudPlanContext);
  const pendingCloudCompatibilityRef = useRef<CloudCompatibility | null>(null);
  const { pathname, search, hash } = useLocation();
  const isTidbcloud = repo === Repo.tidbcloud;

  const searchParams = new URLSearchParams(search);
  const cloudPlanFromQueryRaw = isTidbcloud
    ? searchParams.get(CLOUD_MODE_KEY)
    : null;
  const cloudPlanFromSessionRaw =
    isTidbcloud && typeof window !== "undefined"
      ? sessionStorage.getItem(CLOUD_MODE_KEY)
      : null;
  const cloudPlanFromQuery = isCloudPlan(cloudPlanFromQueryRaw)
    ? cloudPlanFromQueryRaw
    : null;
  const cloudPlanFromSession = isCloudPlan(cloudPlanFromSessionRaw)
    ? cloudPlanFromSessionRaw
    : null;
  const resolvedCloudPlan =
    cloudPlanFromQuery || cloudPlanFromSession || _cloudPlan;

  const isStarter = isTidbcloud && resolvedCloudPlan === CloudPlan.Starter;
  const cloudCompatibilityFromQueryRaw = isStarter
    ? searchParams.get(CLOUD_COMPATIBILITY_KEY)
    : null;
  const cloudCompatibilityFromSessionRaw =
    isStarter && typeof window !== "undefined"
      ? sessionStorage.getItem(CLOUD_COMPATIBILITY_KEY)
      : null;
  const isCloudCompatibility = (
    value: string | null
  ): value is CloudCompatibility =>
    value === CloudCompatibility.MySQL ||
    value === CloudCompatibility.PostgreSQL;
  const cloudCompatibilityFromQuery = isCloudCompatibility(
    cloudCompatibilityFromQueryRaw
  )
    ? cloudCompatibilityFromQueryRaw
    : null;
  const cloudCompatibilityFromSession = isCloudCompatibility(
    cloudCompatibilityFromSessionRaw
  )
    ? cloudCompatibilityFromSessionRaw
    : null;
  const requestedCloudCompatibility =
    cloudCompatibilityFromQuery ||
    cloudCompatibilityFromSession ||
    CloudCompatibility.MySQL;

  const setCloudPlan = useCallback(
    (cloudPlan: CloudPlan) => {
      _setCloudPlan(cloudPlan);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(CLOUD_MODE_KEY, cloudPlan);
      }
    },
    [_setCloudPlan]
  );

  const setCloudCompatibility = useCallback(
    (cloudCompatibility: CloudCompatibility) => {
      pendingCloudCompatibilityRef.current = cloudCompatibility;
      _setCloudCompatibility(cloudCompatibility);
      if (typeof window === "undefined") return;

      sessionStorage.setItem(CLOUD_COMPATIBILITY_KEY, cloudCompatibility);
    },
    [_setCloudCompatibility]
  );

  useEffect(() => {
    if (_cloudPlan !== resolvedCloudPlan) {
      _setCloudPlan(resolvedCloudPlan);
    }
  }, [_cloudPlan, resolvedCloudPlan, _setCloudPlan]);

  useEffect(() => {
    const pendingCloudCompatibility = pendingCloudCompatibilityRef.current;
    if (pendingCloudCompatibility) {
      if (cloudCompatibilityFromQueryRaw === pendingCloudCompatibility) {
        pendingCloudCompatibilityRef.current = null;
      }
      return;
    }

    const shouldNormalizeCompatibility =
      isStarter &&
      cloudCompatibilityFromQueryRaw !== requestedCloudCompatibility;

    if (shouldNormalizeCompatibility) {
      searchParams.set(CLOUD_COMPATIBILITY_KEY, requestedCloudCompatibility);
      navigate(`${pathname}?${searchParams.toString()}${hash || ""}`, {
        replace: true,
      });
    }

    if (!isStarter && cloudCompatibilityFromQueryRaw !== null) {
      searchParams.delete(CLOUD_COMPATIBILITY_KEY);
      const queryString = searchParams.toString();
      navigate(
        `${pathname}${queryString ? `?${queryString}` : ""}${hash || ""}`,
        {
          replace: true,
        }
      );
    }

    if (_cloudCompatibility !== requestedCloudCompatibility) {
      _setCloudCompatibility(requestedCloudCompatibility);
    }
  }, [
    _cloudCompatibility,
    requestedCloudCompatibility,
    _setCloudCompatibility,
    isStarter,
    cloudCompatibilityFromQueryRaw,
    searchParams,
    pathname,
    hash,
  ]);

  const isEssential = isTidbcloud && resolvedCloudPlan === CloudPlan.Essential;
  const isPremium = isTidbcloud && resolvedCloudPlan === CloudPlan.Premium;
  const isClassic =
    !isTidbcloud ||
    !resolvedCloudPlan ||
    (!isStarter && !isEssential && !isPremium);

  return {
    cloudPlan: resolvedCloudPlan,
    setCloudPlan,
    cloudCompatibility: _cloudCompatibility,
    setCloudCompatibility,
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
    const routeCloudPlan = getCloudPlanFromPathname(pathname);

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

    const requestedCloudPlan =
      routeCloudPlan || cloudModeFromQuery || cloudModeFromSession;
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
        navigate(`${pathname}?${searchParams.toString()}${hash || ""}`, {
          replace: true,
        });
      }
      return;
    }

    // Dedicated: keep URL without plan param by default; only normalize when an invalid/mismatched plan is present.
    if (
      cloudModeFromQueryRaw &&
      cloudModeFromQueryRaw !== CloudPlan.Dedicated
    ) {
      searchParams.set(CLOUD_MODE_KEY, CloudPlan.Dedicated);
      navigate(`${pathname}?${searchParams.toString()}${hash || ""}`, {
        replace: true,
      });
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
