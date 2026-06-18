import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

const privatePaths = [
  "/dashboard",
  "/tasks",
  "/checkout",
  "/sign-in",
  "/sign-up",
  "/verify",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = routing.locales.flatMap((locale) =>
    privatePaths.map((path) => `/${locale}${path}`),
  );

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
