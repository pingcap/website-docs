import { TOCNamespace } from "../../src/shared/interface";
import { getTOCNamespace } from "../toc-namespace";

describe("getTOCNamespace", () => {
  it("maps TiDB Cloud Lake docs to the TiDB Cloud Lake namespace", () => {
    expect(
      getTOCNamespace("en/tidb/release-8.5/tidb-cloud-lake/lake-overview")
    ).toBe(TOCNamespace.TiDBCloudLake);
  });

  it("maps the TiDB Cloud Lake index page to the TiDB Cloud Lake namespace", () => {
    expect(getTOCNamespace("en/tidb/release-8.5/tidb-cloud-lake/_index")).toBe(
      TOCNamespace.TiDBCloudLake
    );
  });
});
