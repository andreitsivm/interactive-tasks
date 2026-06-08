"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/database/client";
import { users } from "@/database/schema/auth";
import { redis } from "@/lib/redis";
import { generateOtp, hashOtp } from "@/lib/otp";
import { sendOtpEmail } from "@workspace/mail";

const MAX_SENDS = 5;
const OTP_TTL = 600;
const COOLDOWN_TTL = 60;
const SEND_COUNT_TTL = 3600;

export type SendOtpResult = { error: string } | { success: true };

export async function sendOtp(
  _prev: SendOtpResult | null,
  formData: FormData,
): Promise<SendOtpResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const mode = String(formData.get("mode") ?? "") as "signin" | "signup";

  if (!email || !["signin", "signup"].includes(mode)) {
    return { error: "Invalid request." };
  }

  const cooldown = await redis.get(`otp:cooldown:${email}`);
  if (cooldown) {
    return { error: "Please wait 60 seconds before requesting another code." };
  }

  const sendCount = await redis.get(`otp:send_count:${email}`);
  if (sendCount && parseInt(sendCount, 10) >= MAX_SENDS) {
    return { error: "Too many codes requested. Please try again in an hour." };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (mode === "signin" && !user) {
    return { error: "No account found with this email." };
  }
  if (mode === "signup" && user) {
    return {
      error: "An account already exists with this email. Sign in instead.",
    };
  }

  const callbackUrl = String(formData.get("callbackUrl") ?? "").trim();

  const code = generateOtp();
  const hash = hashOtp(code);

  const pipeline = redis.pipeline();
  pipeline.set(`otp:${email}`, hash, "EX", OTP_TTL);
  pipeline.set(`otp:cooldown:${email}`, "1", "EX", COOLDOWN_TTL);
  pipeline.incr(`otp:send_count:${email}`);
  pipeline.expire(`otp:send_count:${email}`, SEND_COUNT_TTL);
  try {
    await pipeline.exec();
  } catch (err: unknown) {
    console.error("[auth] Redis pipeline failed:", err);
    return { error: "Internal server error. Please try again." };
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[auth] OTP for ${email}: ${code}`);
  } else {
    try {
      await sendOtpEmail(email, code);
    } catch (err: unknown) {
      await redis.del(`otp:${email}`, `otp:cooldown:${email}`);
      await redis.decr(`otp:send_count:${email}`);
      console.error("[auth] Failed to send OTP email:", err);
      return { error: "Couldn't send the code. Please try again." };
    }
  }

  const params = new URLSearchParams({ email, mode });
  if (callbackUrl) params.set("callbackUrl", callbackUrl);
  redirect(`/verify?${params.toString()}`);
}
