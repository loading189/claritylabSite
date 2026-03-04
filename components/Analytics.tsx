export function Analytics() {
  if (!process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER) {
    return null;
  }

  return (
    <script
      defer
      data-provider={process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER}
      dangerouslySetInnerHTML={{
        __html: `window.__analyticsProvider='${process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER}'`,
      }}
    />
  );
}
