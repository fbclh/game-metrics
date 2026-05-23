import { Roboto_Condensed } from 'next/font/google';

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-roboto-condensed',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={robotoCondensed.variable}>
      <body>{children}</body>
    </html>
  );
}
