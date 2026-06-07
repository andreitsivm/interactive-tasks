import { getTranslations, getLocale } from "next-intl/server";
import { fetchCatalog, type CatalogItem } from "@/lib/paddle";
import { PricingCards } from "./PricingCards";
import { auth } from "@/auth";

export async function PricingSection() {
  const t = await getTranslations("pricing");
  const locale = await getLocale();
  const session = await auth();

  let catalog: CatalogItem[] = [];
  try {
    catalog = await fetchCatalog();
  } catch (err) {
    console.error("[pricing] Failed to fetch Paddle catalog:", err);
    catalog = [];
  }

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold mb-3">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <PricingCards
          catalog={catalog}
          locale={locale}
          userEmail={session?.user.email ?? null}
          userId={session?.user.id ?? null}
          currentPlan={session?.user.subscriptionPlan ?? "free"}
        />
      </div>
    </section>
  );
}
