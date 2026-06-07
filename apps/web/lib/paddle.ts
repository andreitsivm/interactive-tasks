import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import type { SubscriptionPlan } from "@workspace/types";

export interface CatalogItem {
  priceId: string;
  productName: string;
  productDescription: string | null;
  amount: string;
  currencyCode: string;
  billingInterval: "month" | "year" | null;
  plan: SubscriptionPlan;
}

function getPaddleClient(): Paddle {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) throw new Error("PADDLE_API_KEY is not set");
  const environment =
    process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
      ? Environment.production
      : Environment.sandbox;
  return new Paddle(apiKey, { environment });
}

function isValidPlan(value: unknown): value is SubscriptionPlan {
  return value === "free" || value === "starter" || value === "pro";
}

export async function fetchCatalog(): Promise<CatalogItem[]> {
  const paddle = getPaddleClient();
  const items: CatalogItem[] = [];

  for await (const product of paddle.products.list({
    include: ["prices"],
    status: ["active"],
  })) {
    const plan = (product.customData as Record<string, unknown> | null)?.plan;
    if (!isValidPlan(plan)) continue;

    for (const price of product.prices ?? []) {
      if (price.status !== "active") continue;

      const interval = price.billingCycle?.interval;
      items.push({
        priceId: price.id,
        productName: product.name,
        productDescription: product.description ?? null,
        amount: price.unitPrice.amount,
        currencyCode: price.unitPrice.currencyCode,
        billingInterval:
          interval === "month" || interval === "year" ? interval : null,
        plan,
      });
    }
  }

  return items.sort((a, b) => Number(a.amount) - Number(b.amount));
}
