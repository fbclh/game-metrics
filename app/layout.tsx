import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import { AppLayout } from '@/src/components/layout/AppLayout';
import './globals.css';

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start-2p',
});

export const metadata: Metadata = {
  title: 'Game Metrics',
  description: 'Browse video games and search by title with Game Metrics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pressStart2P.variable}>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
