import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}

export async function signPreVerifiedToken(email: string): Promise<string> {
  return new SignJWT({ email, type: "otp-verified" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("60s")
    .sign(getSecret());
}

export async function verifyPreVerifiedToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, getSecret());
  if (payload.type !== "otp-verified" || typeof payload.email !== "string") {
    throw new Error("Invalid preVerifiedToken");
  }
  return payload.email;
}
