'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getSessionId } from '@/lib/session';
import type { PlayListItem } from '@/types/playlist';

const badgeStyle = {
  display: 'inline-grid',
  placeItems: 'center',
  backgroundColor: '#e60012',
  color: '#fff',
  fontFamily: 'var(--font-press-start-2p), cursive',
  fontSize: '1.5rem',
  border: '6px solid #fff',
  borderRadius: '999px',
  padding: '7px 12px',
  boxSizing: 'border-box' as const,
};

const textStyle = {
  display: 'block',
  margin: 0,
  padding: 0,
  lineHeight: 1,
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
  transform: 'translateY(2px)',
};

type PlaylistResponse = {
  ok: boolean;
  data?: PlayListItem[];
};

export function Nav() {
  const pathname = usePathname();
  const [listCount, setListCount] = useState(0);
  const fetchedRef = useRef(false);

  const navLinkClass = (href: string) => {
    const currentPath = pathname ?? '/';
    const isActive =
      href === '/'
        ? currentPath === '/'
        : currentPath === href || currentPath.startsWith(`${href}/`);

    return isActive
      ? 'text-sm font-semibold text-white underline decoration-white/60 underline-offset-4'
      : 'text-sm text-white/80 transition hover:text-white';
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const sessionId = getSessionId();
    fetch(`/api/playlist?session_id=${encodeURIComponent(sessionId)}`)
      .then((response) => response.json())
      .then((result: PlaylistResponse) => {
        if (result.ok && result.data) {
          setListCount(result.data.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/"
        style={{ ...badgeStyle, textDecoration: 'none' }}
        aria-label="Game Metrics home"
      >
        <span style={textStyle}>Game</span>
      </Link>
      <Link href="/playlist" className={`relative inline-flex items-center gap-1.5 ${navLinkClass('/playlist')}`}>
        My List
        {listCount > 0 && (
          <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-white/15 px-1.5 py-0.5 text-xs font-semibold text-white">
            {listCount}
          </span>
        )}
      </Link>
      <Link href="/analytics" className={navLinkClass('/analytics')}>
        Dashboard
      </Link>
    </div>
  );
}
