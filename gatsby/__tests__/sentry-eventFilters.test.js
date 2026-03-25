const {
  beforeSendSentryEvent,
  containsDomain,
} = require("../sentry/eventFilters");

describe("beforeSendSentryEvent", () => {
  it("drops events when a hubapi request appears in breadcrumbs", () => {
    const event = {
      breadcrumbs: [
        {
          category: "xhr",
          data: {
            method: "GET",
            status_code: 503,
            url: "https://api.hubapi.com/hs-script-loader-public/v2/config/pixels-and-events/json?portalId=4466002",
          },
        },
      ],
      exception: {
        values: [
          {
            type: "SyntaxError",
            value: "Unexpected end of JSON input",
          },
        ],
      },
    };

    expect(beforeSendSentryEvent(event)).toBeNull();
  });

  it("drops events when the exception itself references hubapi", () => {
    const event = {
      exception: {
        values: [
          {
            type: "TypeError",
            value: "Request to https://api.hubapi.com/v1/test failed",
          },
        ],
      },
    };

    expect(beforeSendSentryEvent(event)).toBeNull();
  });

  it("keeps non-hubapi events", () => {
    const event = {
      breadcrumbs: [
        {
          category: "xhr",
          data: {
            method: "GET",
            status_code: 503,
            url: "https://api.example.com/config.json",
          },
        },
      ],
      exception: {
        values: [
          {
            type: "SyntaxError",
            value: "Unexpected end of JSON input",
          },
        ],
      },
      message: "Failed to parse widget payload",
    };

    expect(beforeSendSentryEvent(event)).toBe(event);
  });
});

describe("containsDomain", () => {
  it("matches hubapi subdomains case-insensitively", () => {
    expect(containsDomain("https://API.HUBAPI.COM/test", "hubapi.com")).toBe(
      true
    );
  });

  it("does not match different hubspot domains", () => {
    expect(
      containsDomain(
        "https://api.hubspot.com/livechat-public/v1/message/public",
        "hubapi.com"
      )
    ).toBe(false);
  });
});
