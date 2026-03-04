import { runtimeConfig } from '@/content/runtime';

export function Analytics() {
  if (!runtimeConfig.analytics.enabled) {
    return null;
  }

  return (
    <script
      defer
      data-provider={runtimeConfig.analytics.provider}
      data-domain={runtimeConfig.analytics.plausibleDomain || undefined}
      dangerouslySetInnerHTML={{
        __html: `window.__analyticsProvider='${runtimeConfig.analytics.provider}';window.__plausibleDomain='${runtimeConfig.analytics.plausibleDomain}';`,
      }}
    />
  );
}
