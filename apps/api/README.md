# API — NestJS Backend

NestJS 11 backend for Interactive Tasks. Validates Auth.js-issued JWTs and serves protected API routes.

## Setup

```sh
cp .env.example .env
# Fill in AUTH_SECRET (must match apps/web exactly) and DATABASE_URL
```

## Development

```sh
pnpm dev          # watch mode (via Turborepo from repo root)
pnpm start:dev    # or directly inside this directory
```

Server starts on `http://localhost:3001` by default (`PORT` env var overrides).

## Scripts

| Command           | Purpose              |
| ----------------- | -------------------- |
| `pnpm start:dev`  | Watch mode (ts-node) |
| `pnpm build`      | Compile to `dist/`   |
| `pnpm start:prod` | Run compiled output  |
| `pnpm test`       | Jest unit tests      |
| `pnpm test:e2e`   | End-to-end tests     |
| `pnpm test:cov`   | Coverage report      |
| `pnpm lint`       | ESLint               |

## Environment variables

| Variable       | Required | Purpose                                             |
| -------------- | -------- | --------------------------------------------------- |
| `AUTH_SECRET`  | Yes      | Must match `apps/web` exactly — verifies HS256 JWTs |
| `DATABASE_URL` | Yes      | PostgreSQL connection string                        |
| `PORT`         | No       | HTTP port (defaults to 3000 — use 3001 locally)     |

## Auth architecture

Authentication is stateless JWT-only — no sessions, no DB lookups on auth checks.

**Token flow:**

1. `apps/web` signs an HS256 JWT (`jose`) with `AUTH_SECRET` after successful sign-in
2. Client sends it as `Authorization: Bearer <token>`
3. `JwtStrategy` (`passport-jwt`) verifies the signature with the shared `AUTH_SECRET`
4. The verified `IJwtPayload` is attached to `request.user`

**Key files in `src/auth/`:**

| File                        | Purpose                                                  |
| --------------------------- | -------------------------------------------------------- |
| `jwt.strategy.ts`           | Verifies Bearer token, returns `IJwtPayload`             |
| `jwt.guard.ts`              | `@UseGuards(JwtGuard)` — protects routes                 |
| `current-user.decorator.ts` | `@CurrentUser()` — typed param decorator for controllers |
| `roles.guard.ts`            | `@UseGuards(RolesGuard)` + `@Roles(UserRole.Admin)`      |
| `permissions.map.ts`        | Role → permissions mapping (source of truth)             |

**Using in a controller:**

```typescript
@Get('me')
@UseGuards(JwtGuard)
getProfile(@CurrentUser() user: IJwtPayload) {
  return user;
}
```

**Never:**

- Query the database inside a guard for auth checks — read only from `IJwtPayload`
- Inject `request.user` directly — use `@CurrentUser()` instead
- Log `IJwtPayload` in production (contains PII)

## Module structure

Feature modules follow pragmatic hexagonal architecture.

```
src/
  auth/        — JWT strategy, guards, @CurrentUser(), permissions map
  common/      — global filters, interceptors, pipes
  database/    — Drizzle connection provider
  modules/     — feature modules (one subdirectory per domain)
  app.module.ts
  main.ts
```

## Shared types

All request/response interfaces are defined in `@workspace/types` (`packages/types`). NestJS DTO classes `implements` those interfaces — TypeScript catches drift at compile time.
