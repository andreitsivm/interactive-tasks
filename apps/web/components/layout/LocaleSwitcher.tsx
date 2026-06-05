"use client";

import { hasLocale, useLocale } from "next-intl";
import { routing, useRouter, usePathname } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (hasLocale(routing.locales, newLocale)) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <Select value={locale} onValueChange={switchLocale}>
      <SelectTrigger className="w-20" aria-label="Select language">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="ua">UA</SelectItem>
      </SelectContent>
    </Select>
  );
}
