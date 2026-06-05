import { NextRequest, NextResponse } from "next/server";

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

  // req.text() consumes the stream — call it exactly once and pass the result to unmarshal.
  // Replace with paddle.webhooks.unmarshal(body, secret, signature) when adding subscription logic.
  const body = await req.text();
  console.log("[Paddle webhook] received event, body length:", body.length);

  return NextResponse.json({ received: true });
}
