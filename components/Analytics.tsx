import { runtimeConfig } from '@/content/runtime';

export function Analytics() {
  if (runtimeConfig.analytics.provider !== 'plausible' || !runtimeConfig.analytics.plausibleDomain) {
    return null;
  }

  return <script defer data-domain={runtimeConfig.analytics.plausibleDomain} src="https://plausible.io/js/script.js" />;
}
