"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <nav className="flex flex-col gap-6 p-6">
      <Link href="/#pricing" onClick={onClose} className="text-lg font-medium">
        {t("pricing")}
      </Link>
      <Link href="/faq" onClick={onClose} className="text-lg font-medium">
        {t("faq")}
      </Link>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {t("tasks")}
        </span>
        {siteConfig.taskTypes.map((task) => (
          <Link
            key={task.slug}
            href={`/tasks/${task.slug}`}
            onClick={onClose}
            className="text-base pl-2"
          >
            {task.label[locale]}
          </Link>
        ))}
      </div>
      <Button asChild onClick={onClose}>
        <Link href="/sign-up">{t("getStarted")}</Link>
      </Button>
      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </nav>
  );
}
