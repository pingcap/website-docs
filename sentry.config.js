import * as Sentry from "@sentry/gatsby";

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: process.env.GATSBY_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],

  tracesSampleRate: 0.1,
});
