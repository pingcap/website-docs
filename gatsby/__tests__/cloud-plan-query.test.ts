import {
  buildCloudPlanSearchParams,
  CLOUD_COMPATIBILITY_KEY,
  CLOUD_MODE_KEY,
} from "../../src/shared/cloud-plan-query";
import { CloudCompatibility, CloudPlan } from "../../src/shared/interface";

describe("buildCloudPlanSearchParams", () => {
  it("writes plan and compatibility together in a stable order", () => {
    const result = buildCloudPlanSearchParams(
      "",
      CloudPlan.Starter,
      CloudCompatibility.PostgreSQL
    );

    expect(result.searchParams.toString()).toBe(
      "plan=starter&compatibility=postgresql"
    );
    expect(result.changed).toBe(true);
  });

  it("normalizes an existing query and preserves other parameters", () => {
    const result = buildCloudPlanSearchParams(
      "compatibility=postgresql&source=toc",
      CloudPlan.Starter,
      CloudCompatibility.PostgreSQL
    );

    expect(result.searchParams.toString()).toBe(
      "plan=starter&compatibility=postgresql&source=toc"
    );
    expect(result.changed).toBe(true);
  });

  it("keeps Dedicated without an existing plan parameter", () => {
    const result = buildCloudPlanSearchParams("", CloudPlan.Dedicated, null);

    expect(result.searchParams.toString()).toBe("");
    expect(result.changed).toBe(false);
  });

  it("normalizes a Dedicated query and removes compatibility", () => {
    const result = buildCloudPlanSearchParams(
      "plan=starter&compatibility=postgresql",
      CloudPlan.Dedicated,
      null
    );

    expect(result.searchParams.get(CLOUD_MODE_KEY)).toBe(CloudPlan.Dedicated);
    expect(result.searchParams.has(CLOUD_COMPATIBILITY_KEY)).toBe(false);
    expect(result.changed).toBe(true);
  });
});
