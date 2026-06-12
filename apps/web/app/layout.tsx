import { getLocale } from 'next-intl/server';
import { Onest } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cn } from '@/lib/utils';
import './globals.css';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn('font-sans', onest.variable)}
    >
      <body>{children}</body>
      <SpeedInsights />
      <Analytics />
    </html>
  );
}
