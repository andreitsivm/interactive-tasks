import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}

export async function signPreVerifiedToken(
  email: string,
  mode: "signin" | "signup",
): Promise<string> {
  return new SignJWT({ email, mode, type: "otp-verified" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("60s")
    .sign(getSecret());
}

export async function verifyPreVerifiedToken(
  token: string,
): Promise<{ email: string; mode: "signin" | "signup" }> {
  const { payload } = await jwtVerify(token, getSecret());
  if (
    payload.type !== "otp-verified" ||
    typeof payload.email !== "string" ||
    (payload.mode !== "signin" && payload.mode !== "signup")
  ) {
    throw new Error("Invalid preVerifiedToken");
  }
  return { email: payload.email, mode: payload.mode };
}
