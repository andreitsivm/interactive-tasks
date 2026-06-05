import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
          {t("headline")}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("subheadline")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/pricing">{t("cta")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#how-it-works">{t("ctaSecondary")}</a>
          </Button>
        </div>
      </div>

      <div
        id="hero-bottom-sentinel"
        className="absolute bottom-0 left-0 w-full h-px"
      />
    </section>
  );
}
