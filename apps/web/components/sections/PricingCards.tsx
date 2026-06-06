"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import type { PaddlePrice } from "@/lib/paddle";
import type { Locale } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: string) => void };
      Initialize: (opts: { token: string }) => void;
      Checkout: {
        open: (opts: {
          items: { priceId: string; quantity: number }[];
        }) => void;
      };
    };
  }
}

interface PricingCardsProps {
  prices: PaddlePrice[];
  locale: Locale;
}

const starterFeatures = [
  "50 tasks / month",
  "All task types",
  "Export to PDF & HTML",
  "Email support",
];

const proFeatures = [
  "Unlimited tasks",
  "All task types",
  "Export to PDF, HTML & embed",
  "Priority support",
  "Team sharing",
];

export function PricingCards({ prices }: PricingCardsProps) {
  const t = useTranslations("pricing");

  useEffect(() => {
    if (typeof window === "undefined" || !window.Paddle) return;
    if (!siteConfig.paddle.clientToken) return;
    if (siteConfig.paddle.environment === "sandbox") {
      window.Paddle.Environment.set("sandbox");
    }
    window.Paddle.Initialize({ token: siteConfig.paddle.clientToken });
  }, []);

  const handleSubscribe = (priceId: string) => {
    window.Paddle?.Checkout.open({ items: [{ priceId, quantity: 1 }] });
  };

  if (prices.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
        {/* Starter */}
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
              {starterFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="w-full mt-2">
              <Link href="/pricing">{t("subscribe")}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pro — featured */}
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
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full mt-2">
                <Link href="/pricing">{t("subscribe")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
      {prices.map((price, idx) => (
        <div key={price.id} className="relative">
          {idx === 1 && (
            <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Most popular
              </span>
            </div>
          )}
          <Card
            className={`p-2 ${idx === 1 ? "border-primary shadow-lg shadow-primary/10" : ""}`}
          >
            <CardHeader className="pt-6 px-6">
              <CardTitle className="text-lg">{price.product.name}</CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">
                  {(parseFloat(price.unitPrice.amount) / 100).toFixed(0)}{" "}
                  {price.unitPrice.currencyCode}
                </span>
                <span className="text-base font-normal text-muted-foreground ml-1">
                  {t("perMonth")}
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-sm text-muted-foreground mb-4">
                {price.product.description}
              </p>
              <Button
                className="w-full"
                variant={idx === 1 ? "default" : "outline"}
                onClick={() => handleSubscribe(price.id)}
              >
                {t("subscribe")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
