# Web — Next.js Frontend

Next.js 16 frontend for Interactive Tasks. Handles auth (Email OTP + Google OAuth), i18n (en/ua), payments (Paddle), and serves the interactive task UI.

## Setup

```sh
cp .env.example .env.local
# Fill in at minimum: AUTH_SECRET, DATABASE_URL, REDIS_URL, RESEND_API_KEY, MAIL_FROM
```

Push the database schema (first time or after schema changes):

```sh
pnpm db:push
```

## Development

```sh
pnpm dev    # starts on http://localhost:3000
```

## Scripts

| Command            | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `pnpm dev`         | Dev server (port 3000)                              |
| `pnpm build`       | Production build                                    |
| `pnpm lint`        | ESLint (zero warnings)                              |
| `pnpm check-types` | TypeScript + next-intl typegen                      |
| `pnpm test`        | Vitest unit tests                                   |
| `pnpm test:watch`  | Vitest watch mode                                   |
| `pnpm db:push`     | Sync Drizzle schema to database (no migration file) |
| `pnpm db:migrate`  | Apply migration files                               |
| `pnpm db:studio`   | Drizzle Studio at http://local.drizzle.studio       |

Run quality checks in order — a later step can surface errors the earlier one misses:

```sh
pnpm lint && pnpm check-types && pnpm build
```

## Environment variables

| Variable                          | Required | Purpose                                           |
| --------------------------------- | -------- | ------------------------------------------------- |
| `AUTH_SECRET`                     | Yes      | JWT signing — shared with `apps/api`              |
| `NEXTAUTH_URL`                    | Yes      | next-auth v4 callback base URL                    |
| `DATABASE_URL`                    | Yes      | PostgreSQL connection string (Drizzle + Auth.js)  |
| `REDIS_PUBLIC_URL`                | Yes      | OTP storage (ioredis)                             |
| `RESEND_API_KEY`                  | Yes      | Resend API key for email delivery                 |
| `MAIL_FROM`                       | Yes      | Verified sender address in Resend                 |
| `AUTH_GOOGLE_ID`                  | No       | Google OAuth — sign-in button hidden if absent    |
| `AUTH_GOOGLE_SECRET`              | No       | Google OAuth                                      |
| `PADDLE_API_KEY`                  | No       | Paddle server-side key (never exposed to browser) |
| `PADDLE_WEBHOOK_SECRET`           | No       | Paddle webhook signature verification             |
| `PADDLE_PRICE_ID_STARTER`         | No       | Paddle price ID for Starter plan                  |
| `PADDLE_PRICE_ID_PRO`             | No       | Paddle price ID for Pro plan                      |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | No       | Paddle client token (safe to expose)              |
| `NEXT_PUBLIC_PADDLE_ENV`          | No       | `"sandbox"` or `"production"`                     |

## Auth architecture

**Stack:** next-auth v4.24.14 + Drizzle adapter + Email OTP + Google OAuth

**OTP sign-in flow:**

1. User enters email on `/sign-in` or `/sign-up`
2. Server Action generates a 6-digit OTP, stores HMAC-SHA256 hash in Redis (10 min TTL), sends via Resend
3. User enters OTP on `/verify`
4. Server Action verifies hash with `timingSafeEqual`, signs a short-lived `preVerifiedToken` (HS256, 60s)
5. Client calls `signIn('credentials', { token: preVerifiedToken })` from `next-auth/react`
6. Auth.js credentials provider verifies the token, creates/finds the user, and issues a session JWT
7. Session JWT contains an `accessToken` — an HS256 JWT signed by `jose` that `apps/api` can verify

**Key files:**

| File / Path                  | Purpose                                                                |
| ---------------------------- | ---------------------------------------------------------------------- |
| `auth.ts`                    | next-auth v4 `authOptions`, JWT/session callbacks, providers           |
| `lib/otp.ts`                 | `generateOtp`, `hashOtp`, `verifyOtp` (HMAC-SHA256 + timingSafeEqual)  |
| `lib/redis.ts`               | ioredis singleton (globalThis pattern)                                 |
| `lib/pre-verified-token.ts`  | Signs/verifies the OTP→session bridge JWT (60s, mode embedded)         |
| `lib/api.ts`                 | Server-only Axios singleton for calling `apps/api`                     |
| `actions/auth/send-otp.ts`   | Server Action — generates OTP, sends email, enforces rate limits       |
| `actions/auth/verify-otp.ts` | Server Action — verifies OTP, returns `preVerifiedToken`               |
| `database/schema/auth.ts`    | Drizzle schema: users, accounts, verificationTokens (JWT, no sessions) |
| `middleware.ts`              | next-auth `withAuth` — protects `/dashboard` and API routes            |

**OTP Redis keys:**

| Key                      | TTL   | Purpose                        |
| ------------------------ | ----- | ------------------------------ |
| `otp:{email}`            | 600s  | Hashed OTP value               |
| `otp:attempts:{email}`   | 900s  | Failed attempt counter (max 5) |
| `otp:send_count:{email}` | 3600s | Send rate limiter (max 3/hour) |
| `otp:cooldown:{email}`   | 60s   | Resend cooldown                |

## i18n

next-intl with two locales: `en` (default) and `ua`. Locale-aware `Link` is imported from `@/i18n/routing` for internal navigation — not from `next/link` directly.

Message files: `messages/en.json`, `messages/ua.json`.

## Database

Drizzle ORM with PostgreSQL. Schema files in `database/schema/`. Config in `drizzle.config.ts`.

## API client

`lib/api.ts` is `server-only`. Axios singleton that auto-attaches `Authorization: Bearer <token>`. Never import it in Client Components — use a Next.js API route (`/api/...`) as a BFF proxy instead.
