import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export async function CtaSection() {
  const t = await getTranslations("cta");

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-2xl text-center space-y-6">
        <h2 className="text-3xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
        <Button asChild size="lg">
          <Link href="/pricing">{t("button")}</Link>
        </Button>
      </div>
    </section>
  );
}
