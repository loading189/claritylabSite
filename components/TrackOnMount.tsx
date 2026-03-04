'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

export function TrackOnMount({ eventName, props }: { eventName: string; props?: Record<string, string> }) {
  useEffect(() => {
    track(eventName, props);
  }, [eventName, props]);

  return null;
}
