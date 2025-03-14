const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://desa.hapidzfadli.com',
  },
  images: {
    domains: ['localhost', 'desa.hapidzfadli.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add this section to exclude problematic pages from static generation
  experimental: {
    // This prevents pages from being statically generated
    // (fallback to client-side rendering or server-side rendering)
    workerThreads: true,
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: 'hapidzfadli',
  project: 'frontend-ta',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
