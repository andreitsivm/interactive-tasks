import { NextIntlClientProvider } from "next-intl";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Onest } from "next/font/google";
import { cn } from "@/lib/utils";
import { buildMetadata } from "@/lib/metadata";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildSoftwareAppJsonLd,
} from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  return buildMetadata({ locale });
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("font-sans", onest.variable)}
    >
      <head>
        {/* JSON-LD in <head> — React 19 warns about <script> in component bodies */}
        <JsonLd schema={buildOrganizationJsonLd()} />
        <JsonLd schema={buildWebSiteJsonLd()} />
        <JsonLd schema={buildSoftwareAppJsonLd(locale as Locale)} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
