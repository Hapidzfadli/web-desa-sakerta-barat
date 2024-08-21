module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001',
  },
  images: {
    domains: ['localhost'],
  },
};

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  {
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    images: {
      domains: ['localhost'],
    },
  },
  {
    org: 'hapidzfadli',
    project: 'frontend-ta',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  },
);
