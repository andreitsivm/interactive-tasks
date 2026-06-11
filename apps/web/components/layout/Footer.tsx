import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={32} />
              <span className="font-semibold">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t("product")}</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-foreground transition-colors"
                >
                  {tNav("pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <span className="opacity-50">{t("blog")}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t("taskTypes")}</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {siteConfig.taskTypes.map((task) => (
                <li key={task.slug}>
                  <Link
                    href={`/tasks/${task.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {task.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t("legal")}</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {siteConfig.legalPages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/legal/${page.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {page.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {year} {siteConfig.name}. {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
