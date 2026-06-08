import { createHmac } from 'crypto';
import postgres from 'postgres';
import Redis from 'ioredis';

const SEED_EMAIL = 'testpro@gmail.com';
const MAGIC_OTP = '000000';
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

function hashOtp(code: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET!)
    .update(code)
    .digest('hex');
}

async function seed() {
  const sql = postgres(process.env.DATABASE_URL!);
  const redis = new Redis(process.env.REDIS_URL!);

  try {
    console.log('Seeding staging test data...');

    const [user] = await sql`
      INSERT INTO users (id, email, name, "emailVerified", subscription_plan, trial_tokens_used, roles)
      VALUES (gen_random_uuid()::text, ${SEED_EMAIL}, 'Test Pro User', now(), 'pro', 0, ARRAY['member'])
      ON CONFLICT (email) DO UPDATE
        SET name = 'Test Pro User',
            "emailVerified" = now(),
            subscription_plan = 'pro',
            trial_tokens_used = 0
      RETURNING id
    `;
    console.log(`✓ User upserted: ${SEED_EMAIL} (id: ${user.id})`);

    await redis.set(
      `otp:${SEED_EMAIL}`,
      hashOtp(MAGIC_OTP),
      'EX',
      ONE_YEAR_SECONDS,
    );
    console.log(`✓ Magic OTP stored (code: ${MAGIC_OTP}, TTL: 1 year)`);

    console.log('\nStaging sign-in: testpro@gmail.com → OTP: 000000');
  } finally {
    await sql.end();
    await redis.quit();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
