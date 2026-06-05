"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-bottom-sentinel");
    if (!sentinel) {
      setIsScrolled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(entry ? !entry.isIntersecting : true),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md",
        isScrolled
          ? "bg-background/95 border-b border-border shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt={siteConfig.name}
              width={32}
              height={32}
            />
            <span className="font-semibold">{siteConfig.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("pricing")}
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("faq")}
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium hover:text-primary transition-colors">
                {t("tasks")}
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 rounded-md border bg-popover shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-1">
                {siteConfig.taskTypes.map((task) => (
                  <Link
                    key={task.slug}
                    href={`/tasks/${task.slug}`}
                    className="block px-3 py-2 text-sm rounded-sm hover:bg-accent"
                  >
                    {task.label[locale]}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
            <Button asChild size="sm">
              <Link href="/pricing">{t("getStarted")}</Link>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <MobileMenu onClose={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
