import { CloudCompatibility, CloudPlan } from "./interface";

export const CLOUD_MODE_KEY = "plan";
export const CLOUD_COMPATIBILITY_KEY = "compatibility";

export function buildCloudPlanSearchParams(
  search: string,
  cloudPlan: CloudPlan,
  compatibility: CloudCompatibility | null = null
): {
  searchParams: URLSearchParams;
  changed: boolean;
} {
  const sourceParams = new URLSearchParams(search);
  const shouldSetPlan =
    cloudPlan !== CloudPlan.Dedicated || sourceParams.has(CLOUD_MODE_KEY);
  const otherEntries = [...sourceParams.entries()].filter(
    ([key]) => key !== CLOUD_MODE_KEY && key !== CLOUD_COMPATIBILITY_KEY
  );
  const searchParams = new URLSearchParams();

  if (shouldSetPlan) {
    searchParams.set(CLOUD_MODE_KEY, cloudPlan);
  }
  if (compatibility) {
    searchParams.set(CLOUD_COMPATIBILITY_KEY, compatibility);
  }
  otherEntries.forEach(([key, value]) => {
    searchParams.append(key, value);
  });

  return {
    searchParams,
    changed: searchParams.toString() !== sourceParams.toString(),
  };
}
