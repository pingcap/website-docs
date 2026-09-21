import { getCloudPlanFromPathname } from "../../src/shared/cloud-plan-route";
import { CloudPlan } from "../../src/shared/interface";

describe("getCloudPlanFromPathname", () => {
  it("derives the plan from TiDB Cloud home routes", () => {
    expect(getCloudPlanFromPathname("/tidbcloud/")).toBe(CloudPlan.Dedicated);
    expect(getCloudPlanFromPathname("/tidbcloud/starter/")).toBe(
      CloudPlan.Starter
    );
    expect(getCloudPlanFromPathname("/tidbcloud/essential/")).toBe(
      CloudPlan.Essential
    );
    expect(getCloudPlanFromPathname("/tidbcloud/premium/")).toBe(
      CloudPlan.Premium
    );
  });

  it("supports localized TiDB Cloud home routes", () => {
    expect(getCloudPlanFromPathname("/zh/tidbcloud/starter/")).toBe(
      CloudPlan.Starter
    );
  });

  it("does not derive a plan from ordinary document routes", () => {
    expect(getCloudPlanFromPathname("/tidbcloud/get-started/")).toBeNull();
    expect(
      getCloudPlanFromPathname("/tidbcloud/starter/get-started/")
    ).toBeNull();
    expect(getCloudPlanFromPathname("/tidb/get-started/")).toBeNull();
  });
});
