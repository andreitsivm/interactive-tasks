import { randomInt, createHmac, timingSafeEqual } from "crypto";

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(code: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET!)
    .update(code)
    .digest("hex");
}

export function verifyOtp(code: string, storedHash: string): boolean {
  const candidateHash = hashOtp(code);
  const a = Buffer.from(candidateHash, "hex");
  const b = Buffer.from(storedHash, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
