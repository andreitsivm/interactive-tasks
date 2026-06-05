import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    sameAs: Object.values(siteConfig.links).filter(Boolean),
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildSoftwareAppJsonLd(
  locale: Locale,
  prices?: { currency: string; amount: number },
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description: siteConfig.description[locale],
    url: siteConfig.url,
    offers: prices
      ? {
          "@type": "Offer",
          priceCurrency: prices.currency,
          price: prices.amount,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}
