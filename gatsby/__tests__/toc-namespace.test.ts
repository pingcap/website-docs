import { TOCNamespace } from "../../src/shared/interface";
import { getTOCNamespace } from "../toc-namespace";

describe("getTOCNamespace", () => {
  it("maps TiDB Cloud Lake docs to the TiDB Cloud Lake namespace", () => {
    expect(
      getTOCNamespace("en/tidb-cloud-lake/master/tidb-cloud-lake/lake-overview")
    ).toBe(TOCNamespace.TiDBCloudLake);
  });

  it("maps the TiDB Cloud Lake index page to the TiDB Cloud Lake namespace", () => {
    expect(
      getTOCNamespace("en/tidb-cloud-lake/master/tidb-cloud-lake/_index")
    ).toBe(TOCNamespace.TiDBCloudLake);
  });

  it("maps root-level TiDB Cloud Lake pages to the TiDB Cloud Lake namespace", () => {
    expect(getTOCNamespace("en/tidb-cloud-lake/master/_index")).toBe(
      TOCNamespace.TiDBCloudLake
    );
  });

  it("maps TiDB Cloud Filesystem docs to the Filesystem namespace", () => {
    expect(
      getTOCNamespace(
        "en/tidb-cloud-filesystem/master/tidb-cloud-filesystem/filesystem-quick-start"
      )
    ).toBe(TOCNamespace.TiDBCloudFilesystem);
  });

  it("maps the root-level Filesystem index to the Filesystem namespace", () => {
    expect(getTOCNamespace("en/tidb-cloud-filesystem/master/_index")).toBe(
      TOCNamespace.TiDBCloudFilesystem
    );
  });

  it("keeps other TiDB stable docs in the TiDB namespace", () => {
    expect(getTOCNamespace("en/tidb/release-8.5/alert-rules")).toBe(
      TOCNamespace.TiDB
    );
  });
});
