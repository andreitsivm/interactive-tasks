import { NextRequest, NextResponse } from "next/server";
import { Paddle, Environment, EventName } from "@paddle/paddle-node-sdk";
import type {
  SubscriptionActivatedEvent,
  SubscriptionUpdatedEvent,
  SubscriptionCanceledEvent,
} from "@paddle/paddle-node-sdk";
import { eq } from "drizzle-orm";
import { db } from "@/database/client";
import { users } from "@/database/schema/auth";
import { subscriptions } from "@/database/schema/subscriptions";
import { fetchCatalog } from "@/lib/paddle";
import type { SubscriptionPlan } from "@workspace/types";

type SubscriptionEvent =
  | SubscriptionActivatedEvent
  | SubscriptionUpdatedEvent
  | SubscriptionCanceledEvent;

function getPaddleClient(): Paddle {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) throw new Error("PADDLE_API_KEY is not set");
  const environment =
    process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
      ? Environment.production
      : Environment.sandbox;
  return new Paddle(apiKey, { environment });
}

async function resolvePlanFromPriceId(
  priceId: string,
): Promise<SubscriptionPlan> {
  const catalog = await fetchCatalog();
  const match = catalog.find((item) => item.priceId === priceId);
  if (!match) {
    console.warn(
      "[webhook] No catalog match for priceId",
      priceId,
      "— defaulting to free",
    );
  }
  return match?.plan ?? "free";
}

async function getUserIdByCustomer(
  paddle: Paddle,
  customerId: string,
): Promise<string | null> {
  const customer = await paddle.customers.get(customerId);
  if (!customer.email) return null;
  const user = await db.query.users.findFirst({
    where: eq(users.email, customer.email),
  });
  return user?.id ?? null;
}

async function syncSubscription(
  paddle: Paddle,
  event: SubscriptionEvent,
): Promise<void> {
  const sub = event.data;
  const isCanceled = sub.status === "canceled";
  const priceId = sub.items[0]?.price?.id ?? "";

  const plan: SubscriptionPlan = isCanceled
    ? "free"
    : await resolvePlanFromPriceId(priceId);

  const userId = await getUserIdByCustomer(paddle, sub.customerId);
  if (!userId) {
    throw new Error(`[webhook] No user found for customer ${sub.customerId}`);
  }

  const currentPeriodStart = sub.currentBillingPeriod?.startsAt
    ? new Date(sub.currentBillingPeriod.startsAt)
    : null;
  const currentPeriodEnd = sub.currentBillingPeriod?.endsAt
    ? new Date(sub.currentBillingPeriod.endsAt)
    : null;

  await db.transaction(async (tx) => {
    await tx
      .insert(subscriptions)
      .values({
        userId,
        paddleSubscriptionId: sub.id,
        paddleCustomerId: sub.customerId,
        plan,
        status: sub.status,
        currentPeriodStart,
        currentPeriodEnd,
      })
      .onConflictDoUpdate({
        target: subscriptions.paddleSubscriptionId,
        set: {
          plan,
          status: sub.status,
          currentPeriodStart,
          currentPeriodEnd,
          updatedAt: new Date(),
        },
      });

    await tx
      .update(users)
      .set({
        subscriptionPlan: plan,
        paddleSubscriptionId: isCanceled ? null : sub.id,
        paddleCustomerId: sub.customerId,
      })
      .where(eq(users.id, userId));
  });
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("paddle-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  const paddle = getPaddleClient();
  let event: Awaited<ReturnType<typeof paddle.webhooks.unmarshal>>;
  try {
    event = await paddle.webhooks.unmarshal(body, secret, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (
      event.eventType === EventName.SubscriptionActivated ||
      event.eventType === EventName.SubscriptionUpdated ||
      event.eventType === EventName.SubscriptionCanceled
    ) {
      await syncSubscription(paddle, event);
    }
  } catch (err) {
    console.error("[webhook] sync failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
