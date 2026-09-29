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
import {
  buildCloudPlanSearchParams,
  CLOUD_COMPATIBILITY_KEY,
  CLOUD_MODE_KEY,
} from "./cloud-plan-query";
import { CloudCompatibility, CloudPlan, Repo, TOCNamespace } from "./interface";
export { CLOUD_COMPATIBILITY_KEY, CLOUD_MODE_KEY } from "./cloud-plan-query";

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

function isCloudCompatibility(
  value: string | null
): value is CloudCompatibility {
  return (
    value === CloudCompatibility.MySQL ||
    value === CloudCompatibility.PostgreSQL
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

  const syncCloudCompatibility = useCallback(
    (cloudCompatibility: CloudCompatibility) => {
      _setCloudCompatibility(cloudCompatibility);
      if (typeof window === "undefined") return;

      sessionStorage.setItem(CLOUD_COMPATIBILITY_KEY, cloudCompatibility);
    },
    [_setCloudCompatibility]
  );

  const isCloudCompatibilityPending = useCallback(
    () => pendingCloudCompatibilityRef.current !== null,
    []
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
    syncCloudCompatibility,
    isCloudCompatibilityPending,
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
  setCloudPlan: (plan: CloudPlan) => void,
  cloudCompatibility: CloudCompatibility,
  syncCloudCompatibility: (compatibility: CloudCompatibility) => void,
  isCloudCompatibilityPending: () => boolean
) => {
  const { pathname, search, hash } = useLocation();
  const tocNamesKey = Array.isArray(tocNames) ? tocNames.join("|") : "";

  useEffect(() => {
    if (namespace !== TOCNamespace.TiDBCloud) {
      return;
    }
    if (isCloudCompatibilityPending()) {
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
    const cloudCompatibilityFromQueryRaw =
      cloudMode === CloudPlan.Starter
        ? searchParams.get(CLOUD_COMPATIBILITY_KEY)
        : null;
    const cloudCompatibilityFromSessionRaw =
      typeof window === "undefined"
        ? null
        : sessionStorage.getItem(CLOUD_COMPATIBILITY_KEY);
    const requestedCloudCompatibility =
      cloudMode === CloudPlan.Starter
        ? isCloudCompatibility(cloudCompatibilityFromQueryRaw)
          ? cloudCompatibilityFromQueryRaw
          : isCloudCompatibility(cloudCompatibilityFromSessionRaw)
          ? cloudCompatibilityFromSessionRaw
          : CloudCompatibility.MySQL
        : CloudCompatibility.MySQL;

    if (cloudPlan !== cloudMode) {
      setCloudPlan(cloudMode);
    }

    if (cloudModeFromSession !== cloudMode) {
      sessionStorage.setItem(CLOUD_MODE_KEY, cloudMode);
    }

    if (typeof window !== "undefined") {
      if (cloudMode === CloudPlan.Starter) {
        sessionStorage.setItem(
          CLOUD_COMPATIBILITY_KEY,
          requestedCloudCompatibility
        );
      } else {
        sessionStorage.removeItem(CLOUD_COMPATIBILITY_KEY);
      }
    }
    if (cloudCompatibility !== requestedCloudCompatibility) {
      syncCloudCompatibility(requestedCloudCompatibility);
    }

    const { searchParams: normalizedSearchParams, changed } =
      buildCloudPlanSearchParams(
        search,
        cloudMode,
        cloudMode === CloudPlan.Starter ? requestedCloudCompatibility : null
      );
    if (changed) {
      navigate(
        `${pathname}?${normalizedSearchParams.toString()}${hash || ""}`,
        {
          replace: true,
        }
      );
    }
  }, [
    namespace,
    inDefaultPlan,
    tocNamesKey,
    cloudPlan,
    setCloudPlan,
    cloudCompatibility,
    syncCloudCompatibility,
    isCloudCompatibilityPending,
    pathname,
    search,
    hash,
  ]);
};
