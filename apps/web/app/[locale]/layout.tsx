import { NextIntlClientProvider } from "next-intl";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Public_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { buildMetadata } from "@/lib/metadata";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { routing } from "@/i18n/routing";
import "../globals.css";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

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
      className={cn("font-sans", publicSans.variable)}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        <JsonLd schema={buildOrganizationJsonLd()} />
        <JsonLd schema={buildWebSiteJsonLd()} />
      </body>
    </html>
  );
}
