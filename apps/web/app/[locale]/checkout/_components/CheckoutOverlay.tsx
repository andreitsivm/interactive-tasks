"use client";

import { useEffect } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import { siteConfig } from "@/config/site";

interface CheckoutOverlayProps {
  userEmail: string;
  userId: string;
  priceId: string;
}

export function CheckoutOverlay({
  userEmail,
  userId,
  priceId,
}: CheckoutOverlayProps) {
  useEffect(() => {
    if (!siteConfig.paddle.clientToken || !priceId) return;
    initializePaddle({
      environment: siteConfig.paddle.environment,
      token: siteConfig.paddle.clientToken,
    })
      .then((paddle) => {
        paddle?.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: { email: userEmail },
          customData: { userId },
          settings: {
            successUrl: `${window.location.origin}/dashboard`,
          },
        });
      })
      .catch((err: unknown) => {
        console.error("[checkout] Paddle init failed:", err);
      });
  }, [userEmail, userId, priceId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Setting up your trial…</p>
    </div>
  );
}
