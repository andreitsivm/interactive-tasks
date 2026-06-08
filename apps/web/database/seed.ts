import { eq } from "drizzle-orm";
import { db } from "./client";
import { users } from "./schema/auth";
import { redis } from "../lib/redis";
import { hashOtp } from "../lib/otp";

const SEED_EMAIL = "testpro@gmail.com";
const MAGIC_OTP = "000000";
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

async function seed() {
  console.log("Seeding staging test data...");

  await db
    .insert(users)
    .values({
      email: SEED_EMAIL,
      name: "Test Pro User",
      emailVerified: new Date(),
      subscriptionPlan: "pro",
      trialTokensUsed: 0,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name: "Test Pro User",
        emailVerified: new Date(),
        subscriptionPlan: "pro",
        trialTokensUsed: 0,
      },
    });

  const existing = await db.query.users.findFirst({
    where: eq(users.email, SEED_EMAIL),
  });
  console.log(`✓ User upserted: ${SEED_EMAIL} (id: ${existing?.id})`);

  const hash = hashOtp(MAGIC_OTP);
  await redis.set(`otp:${SEED_EMAIL}`, hash, "EX", ONE_YEAR_SECONDS);
  console.log(`✓ Magic OTP stored (code: ${MAGIC_OTP}, TTL: 1 year)`);

  console.log("\nStaging sign-in: testpro@gmail.com → OTP: 000000");

  await redis.quit();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
