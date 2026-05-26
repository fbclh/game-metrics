'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export function Nav() {
  const pathname = usePathname();

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

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/"
        style={{ ...badgeStyle, textDecoration: 'none' }}
        aria-label="MarketMetrics home"
      >
        <span style={textStyle}>MM</span>
      </Link>
      <Link href="/watchlist" className={navLinkClass('/watchlist')}>
        Watchlist
      </Link>
      <Link href="/analytics" className={navLinkClass('/analytics')}>
        Dashboard
      </Link>
    </div>
  );
}
