const Sentry = require("@sentry/gatsby");
const { beforeSendSentryEvent } = require("./gatsby/sentry/eventFilters");

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: process.env.GATSBY_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  beforeSend: beforeSendSentryEvent,

  tracesSampleRate: 0.01,
});
