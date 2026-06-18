import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";

export const localeToHreflang: Record<Locale, string> = {
  en: "en",
  ua: "uk",
};

export function buildMetadata({
  locale = "en",
  title,
  description,
  path = "/",
}: {
  locale?: Locale;
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const t = title ?? siteConfig.name;
  const d = description ?? siteConfig.description[locale];
  const url = `${siteConfig.url}/${locale}${path}`;

  return {
    title: { default: t, template: `%s | ${siteConfig.name}` },
    description: d,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [localeToHreflang[l], `/${l}${path}`]),
        ),
        "x-default": `/${routing.defaultLocale}${path}`,
      },
    },
    openGraph: {
      title: t,
      description: d,
      url,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: t }],
      locale: locale === "ua" ? "uk_UA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t,
      description: d,
      images: [siteConfig.ogImage],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}
