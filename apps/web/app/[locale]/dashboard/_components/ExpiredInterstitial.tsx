"use client";

import { useEffect, useState } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import type { Paddle } from "@paddle/paddle-js";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

interface ExpiredInterstitialProps {
  userEmail: string;
  userId: string;
  priceId: string;
}

export function ExpiredInterstitial({
  userEmail,
  userId,
  priceId,
}: ExpiredInterstitialProps) {
  const [paddle, setPaddle] = useState<Paddle | undefined>();

  useEffect(() => {
    if (!siteConfig.paddle.clientToken) return;
    initializePaddle({
      environment: siteConfig.paddle.environment,
      token: siteConfig.paddle.clientToken,
    })
      .then(setPaddle)
      .catch((err: unknown) => {
        console.error("[expired] Paddle init failed:", err);
      });
  }, []);

  function handleUpgrade() {
    if (!priceId) return;
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { userId },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-3">Your trial has ended</h2>
        <p className="text-muted-foreground mb-6">
          Upgrade to Pro to continue accessing all features.
        </p>
        <Button size="lg" className="w-full" onClick={handleUpgrade}>
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
