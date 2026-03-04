'use client';

import { useEffect } from 'react';

type ChatCrispProps = {
  websiteId?: string;
};

export function ChatCrisp({ websiteId }: ChatCrispProps) {
  useEffect(() => {
    if (!websiteId) {
      return;
    }

    const windowWithCrisp = window as typeof window & {
      $crisp?: unknown[];
      CRISP_WEBSITE_ID?: string;
    };

    windowWithCrisp.$crisp = windowWithCrisp.$crisp || [];
    windowWithCrisp.CRISP_WEBSITE_ID = websiteId;

    if (document.getElementById('crisp-script')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    script.id = 'crisp-script';
    document.head.appendChild(script);
  }, [websiteId]);

  return null;
}
