# Interactive Tasks

AI-powered platform for creating interactive educational tasks — fill-the-gap tests, image-word matching, associations, and vocabulary exercises — configurable by topic, level, age group, and language.

## Monorepo structure

```
apps/
  web/   — Next.js 16 frontend (i18n: en/ua, Tailwind CSS v4, shadcn/ui, Paddle payments)
  api/   — NestJS 11 backend

packages/
  types/             — shared TypeScript interfaces and enums (@workspace/types)
  mail/              — react-email templates + Resend send helpers (@workspace/mail)
  ui/                — shared React component library (@workspace/ui)
  eslint-config/     — shared ESLint config (@workspace/eslint-config)
  typescript-config/ — shared tsconfig bases (@workspace/typescript-config)
```

## Prerequisites

- Node.js ≥ 18
- pnpm 9
- [Claude Code](https://claude.ai/code) with [Superpowers](https://github.com/obra/superpowers) installed (required for AI-assisted development)

## Claude Code skills setup

This project pins its AI skills in `skills-lock.json`. After installing the Superpowers plugin from the Claude Code marketplace, sync the pinned skills:

```sh
claude skills sync
```

This installs the exact skill versions locked in `skills-lock.json` (Paddle, shadcn/ui, Vercel, NestJS, and others).

## Getting started

```sh
pnpm install
```

Copy environment files and fill in the required values:

```sh
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

**Required values to fill in before starting:**

| Variable         | Where                  | Purpose                                 |
| ---------------- | ---------------------- | --------------------------------------- |
| `AUTH_SECRET`    | web + api (must match) | JWT signing — `openssl rand -base64 32` |
| `DATABASE_URL`   | web + api              | Railway Postgres connection string      |
| `REDIS_URL`      | web                    | Railway Redis connection string         |
| `RESEND_API_KEY` | web                    | Resend API key for transactional email  |
| `MAIL_FROM`      | web                    | Verified sender address in Resend       |

Google OAuth and Paddle vars are optional for local development. The sign-in button and payment UI hide automatically when those vars are absent.

After filling `DATABASE_URL`, push the schema:

```sh
pnpm --filter=web db:push
```

## Development

Run all apps in watch mode:

```sh
pnpm dev
```

Run a single app:

```sh
pnpm dev --filter=web
pnpm dev --filter=api
```

The web app starts on [http://localhost:3000](http://localhost:3000).

Preview email templates:

```sh
pnpm --filter=@workspace/mail preview
```

## Build

```sh
pnpm build
```

## Type checking & linting

```sh
pnpm check-types
pnpm lint
```

## Tech stack

| Layer    | Technology                                                 |
| -------- | ---------------------------------------------------------- |
| Frontend | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui           |
| Auth     | next-auth v4 (Email OTP + Google OAuth), Redis OTP storage |
| i18n     | next-intl (en / ua)                                        |
| Backend  | NestJS 11, passport-jwt                                    |
| Database | PostgreSQL via Drizzle ORM                                 |
| Email    | react-email + Resend                                       |
| Payments | Paddle (sandbox by default)                                |
| Monorepo | Turborepo + pnpm workspaces                                |
| Language | TypeScript throughout                                      |
