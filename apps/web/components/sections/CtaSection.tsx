import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export async function CtaSection() {
  const t = await getTranslations("cta");

  return (
    <section className="py-28 px-4 bg-foreground text-background">
      <div className="mx-auto max-w-2xl text-center space-y-6">
        <h2 className="text-4xl lg:text-5xl font-bold text-background">
          {t("title")}
        </h2>
        <p className="text-lg text-background/65">{t("subtitle")}</p>
        <Button
          asChild
          size="lg"
          className="bg-background text-foreground hover:bg-background/90 text-base px-8"
        >
          <Link href="/pricing">{t("button")}</Link>
        </Button>
      </div>
    </section>
  );
}
