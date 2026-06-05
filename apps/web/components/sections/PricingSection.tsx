import { getTranslations, getLocale } from "next-intl/server";
import Script from "next/script";
import { fetchPaddlePrices, type PaddlePrice } from "@/lib/paddle";
import { JsonLd } from "@/components/JsonLd";
import { buildSoftwareAppJsonLd } from "@/lib/structured-data";
import { PricingCards } from "./PricingCards";

const PRICE_IDS = [
  process.env.PADDLE_PRICE_ID_STARTER,
  process.env.PADDLE_PRICE_ID_PRO,
].filter((id): id is string => Boolean(id));

export async function PricingSection() {
  const t = await getTranslations("pricing");
  const locale = await getLocale();

  let prices: PaddlePrice[] = [];
  try {
    prices = PRICE_IDS.length > 0 ? await fetchPaddlePrices(PRICE_IDS) : [];
  } catch {
    prices = [];
  }

  const lowestPrice = prices[0];
  const structuredDataPrices = lowestPrice
    ? {
        currency: lowestPrice.unitPrice.currencyCode,
        amount: parseFloat(lowestPrice.unitPrice.amount) / 100,
      }
    : undefined;

  return (
    <section className="py-24 px-4">
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
      />
      <JsonLd schema={buildSoftwareAppJsonLd(locale, structuredDataPrices)} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <PricingCards prices={prices} locale={locale} />
      </div>
    </section>
  );
}
