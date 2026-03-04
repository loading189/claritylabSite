import { runtimeConfig } from '@/content/runtime';

export function Analytics() {
  if (!runtimeConfig.featureFlags.isAnalyticsEnabled) return null;

  return <script defer data-domain={runtimeConfig.analytics.plausibleDomain} src="https://plausible.io/js/script.js" />;
}
