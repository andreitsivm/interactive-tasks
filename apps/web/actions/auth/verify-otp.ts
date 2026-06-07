"use server";

import { redis } from "@/lib/redis";
import { verifyOtp as verifyOtpHash } from "@/lib/otp";
import { signPreVerifiedToken } from "@/lib/pre-verified-token";

const MAX_ATTEMPTS = 5;
const ATTEMPTS_TTL = 900;

export type VerifyOtpResult =
  | { error: string; locked?: boolean }
  | { preVerifiedToken: string; mode: "signin" | "signup" };

export async function verifyOtp(
  _prev: VerifyOtpResult | null,
  formData: FormData,
): Promise<VerifyOtpResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const code = String(formData.get("code") ?? "").trim();
  const mode = String(formData.get("mode") ?? "") as "signin" | "signup";

  if (!email || !code || !["signin", "signup"].includes(mode)) {
    return { error: "Invalid request." };
  }

  const attempts = await redis.get(`otp:attempts:${email}`);
  if (attempts && parseInt(attempts, 10) >= MAX_ATTEMPTS) {
    return {
      error: "Too many incorrect attempts. Please request a new code.",
      locked: true,
    };
  }

  const storedHash = await redis.get(`otp:${email}`);
  if (!storedHash) {
    return { error: "Code has expired. Please request a new one." };
  }

  if (!verifyOtpHash(code, storedHash)) {
    const pipeline = redis.pipeline();
    pipeline.incr(`otp:attempts:${email}`);
    pipeline.expire(`otp:attempts:${email}`, ATTEMPTS_TTL);
    await pipeline.exec();
    return { error: "Incorrect code. Please try again." };
  }

  await redis.del(`otp:${email}`, `otp:attempts:${email}`);

  const preVerifiedToken = await signPreVerifiedToken(email, mode);

  return { preVerifiedToken, mode };
}
