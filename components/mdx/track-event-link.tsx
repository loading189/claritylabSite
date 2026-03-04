'use client';

import Link, { LinkProps } from 'next/link';
import { MouseEventHandler } from 'react';
import { track } from '@/lib/track';

type Props = LinkProps & {
  eventName: string;
  props?: Record<string, string>;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function TrackEventLink({
  eventName,
  props,
  onClick,
  children,
  ...rest
}: Props) {
  return (
    <Link
      {...rest}
      onClick={(event) => {
        track(eventName, props);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
