import { CloudPlan } from "./interface";

export function getCloudPlanFromPathname(pathname: string): CloudPlan | null {
  const segments = pathname.split("/").filter(Boolean);
  const tidbcloudIndex = segments.indexOf("tidbcloud");

  if (tidbcloudIndex === -1) return null;

  const planSegments = segments.slice(tidbcloudIndex + 1);
  if (planSegments.length === 0) return CloudPlan.Dedicated;
  if (planSegments.length > 1) return null;

  switch (planSegments[0]) {
    case "starter":
      return CloudPlan.Starter;
    case "essential":
      return CloudPlan.Essential;
    case "premium":
      return CloudPlan.Premium;
    default:
      return null;
  }
}
