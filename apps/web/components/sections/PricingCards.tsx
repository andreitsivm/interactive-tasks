"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { initializePaddle } from "@paddle/paddle-js";
import type { Paddle } from "@paddle/paddle-js";
import { siteConfig } from "@/config/site";
import type { CatalogItem } from "@/lib/paddle";
import type { Locale } from "@/i18n/routing";
import type { SubscriptionPlan } from "@workspace/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingCardsProps {
  catalog: CatalogItem[];
  locale: Locale;
  userEmail: string | null;
  userId: string | null;
  currentPlan: SubscriptionPlan;
}

const FALLBACK_FEATURES: Record<string, string[]> = {
  starter: [
    "50 tasks / month",
    "All task types",
    "Export to PDF & HTML",
    "Email support",
  ],
  pro: [
    "Unlimited tasks",
    "All task types",
    "Export to PDF, HTML & embed",
    "Priority support",
    "Team sharing",
  ],
};

export function PricingCards({
  catalog,
  userEmail,
  userId,
  currentPlan,
}: PricingCardsProps) {
  const t = useTranslations("pricing");
  const router = useRouter();
  const [paddle, setPaddle] = useState<Paddle | undefined>();

  useEffect(() => {
    if (!siteConfig.paddle.clientToken) return;
    initializePaddle({
      environment: siteConfig.paddle.environment,
      token: siteConfig.paddle.clientToken,
    })
      .then(setPaddle)
      .catch((err: unknown) => {
        console.error("[pricing] Paddle init failed:", err);
      });
  }, []);

  const handleSubscribe = (priceId: string) => {
    if (!userEmail || !userId) {
      router.push("/auth/signin?callbackUrl=/pricing");
      return;
    }
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { userId },
    });
  };

  if (catalog.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
        <Card className="relative p-2">
          <CardHeader className="pt-6 px-6">
            <CardTitle className="text-lg">{t("fallbackPlan1Name")}</CardTitle>
            <div className="mt-2">
              <span className="text-4xl font-bold">
                {t("fallbackPlan1Price")}
              </span>
              <span className="text-base font-normal text-muted-foreground ml-1">
                {t("perMonth")}
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("fallbackPlan1Description")}
            </p>
            <ul className="space-y-2">
              {(FALLBACK_FEATURES.starter ?? []).map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full mt-2" disabled>
              {t("subscribe")}
            </Button>
          </CardContent>
        </Card>

        <div className="relative">
          <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Most popular
            </span>
          </div>
          <Card className="p-2 border-primary shadow-lg shadow-primary/10">
            <CardHeader className="pt-6 px-6">
              <CardTitle className="text-lg">
                {t("fallbackPlan2Name")}
              </CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">
                  {t("fallbackPlan2Price")}
                </span>
                <span className="text-base font-normal text-muted-foreground ml-1">
                  {t("perMonth")}
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("fallbackPlan2Description")}
              </p>
              <ul className="space-y-2">
                {(FALLBACK_FEATURES.pro ?? []).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-2" disabled>
                {t("subscribe")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
      {catalog.map((item, idx) => {
        const isPopular = idx === 1;
        const isCurrent = item.plan === currentPlan;
        const price = (Number(item.amount) / 100).toFixed(0);

        return (
          <div key={item.priceId} className="relative">
            {isPopular && (
              <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              </div>
            )}
            <Card
              className={`p-2 ${isPopular ? "border-primary shadow-lg shadow-primary/10" : ""}`}
            >
              <CardHeader className="pt-6 px-6">
                <CardTitle className="text-lg">{item.productName}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">
                    {price} {item.currencyCode}
                  </span>
                  {item.billingInterval && (
                    <span className="text-base font-normal text-muted-foreground ml-1">
                      /{item.billingInterval}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {item.productDescription && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.productDescription}
                  </p>
                )}
                {isCurrent ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => handleSubscribe(item.priceId)}
                  >
                    {t("subscribe")}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
