import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ua"] as const,
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];

// Augment use-intl so useLocale()/getLocale() returns Locale (not string) everywhere.
// next-intl v4 re-exports AppConfig from use-intl — augment there, not 'next-intl'.
declare module "use-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof import("./messages/en.json");
  }
}

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
