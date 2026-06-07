# Deployment Environments

## Branch → Environment mapping

| Git branch  | Vercel deployment | Railway environment |
| ----------- | ----------------- | ------------------- |
| `main`      | Production        | Production          |
| `dev`       | Staging (preview) | Staging             |
| `feature/*` | —                 | —                   |

- `main` is the **production gate** — every commit here deploys to live users.
- `dev` is the **integration branch** — PRs merge here first; validated on staging before promoting to `main`.
- Feature branches are created from `dev` and merge back into `dev` via PR.

## Branch workflow

```
dev → feature/<name> → PR → dev (staging) → PR → main (production)
```

- Always branch from `dev`, never from `main`.
- Never merge a feature branch directly into `main`.
- Use descriptive branch names: `feature/task-list`, `feature/auth-otp`, `fix/redis-timeout`.

## Environment variables

Each environment has its own secrets configured in the respective Vercel and Railway dashboards. Variables are never shared across environments.

- `DATABASE_URL` — separate Postgres instances for staging and production
- `AUTH_SECRET` — separate secrets; rotating one does not affect the other
- `NESTJS_API_URL` — Railway private URL; differs between staging and production
- API keys for third-party services (Paddle, Resend, etc.) — use sandbox credentials on staging, live credentials on production

**Never commit `.env` files.** All secrets live in the platform dashboards (Vercel env vars, Railway service variables). `.env.example` (committed, no secrets) documents required variable names.

## Paddle environment alignment

Staging always uses Paddle sandbox (`_sdbx` API keys, `test_` client tokens).  
Production always uses Paddle live credentials.  
See `CLAUDE.md` for detailed Paddle rules.

## Production safety

Before suggesting or executing any Railway or Vercel CLI command that targets the **production** environment, stop and ask for explicit confirmation. This applies even when the request sounds routine.

Examples requiring confirmation:

- `railway up` against the production environment
- `vercel --prod`
- Setting or deleting environment variables on the production deployment
- Any destructive database migration run against the production Railway service

## Local development

Point local dev at a local Postgres instance or the staging Railway service. Never point a local environment at the production database.
