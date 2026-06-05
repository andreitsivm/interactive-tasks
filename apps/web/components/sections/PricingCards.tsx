"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import type { PaddlePrice } from "@/lib/paddle";
import type { Locale } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export function PricingCards({ prices, locale: _locale }: PricingCardsProps) {
  const t = useTranslations("pricing");

  useEffect(() => {
    if (typeof window === "undefined" || !window.Paddle) return;
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{t("fallbackPlan1Name")}</CardTitle>
            <p className="text-3xl font-bold">
              {t("fallbackPlan1Price")}
              <span className="text-base font-normal text-muted-foreground">
                {t("perMonth")}
              </span>
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t("fallbackPlan1Description")}
            </p>
            <Button asChild className="w-full">
              <Link href="/pricing">{t("subscribe")}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("fallbackPlan2Name")}</CardTitle>
            <p className="text-3xl font-bold">
              {t("fallbackPlan2Price")}
              <span className="text-base font-normal text-muted-foreground">
                {t("perMonth")}
              </span>
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t("fallbackPlan2Description")}
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/pricing">{t("subscribe")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {prices.map((price, idx) => (
        <Card key={price.id} className={idx === 0 ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>{price.product.name}</CardTitle>
            <p className="text-3xl font-bold">
              {(parseFloat(price.unitPrice.amount) / 100).toFixed(0)}{" "}
              {price.unitPrice.currencyCode}
              <span className="text-base font-normal text-muted-foreground">
                {t("perMonth")}
              </span>
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {price.product.description}
            </p>
            <Button
              className="w-full"
              variant={idx === 0 ? "default" : "outline"}
              onClick={() => handleSubscribe(price.id)}
            >
              {t("subscribe")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
