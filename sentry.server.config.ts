// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://8d43a95a17b81ed8f6c8b355df2b02b5@o4508999995817984.ingest.de.sentry.io/4508999997325392",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Skip OpenTelemetry setup to prevent require-in-the-middle errors in serverless environments
  skipOpenTelemetrySetup: true,
});
