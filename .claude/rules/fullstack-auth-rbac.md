# Auth, JWT, and RBAC Rules

## Stack

- **Auth.js (NextAuth)** runs in `apps/web` — handles login, OAuth, session storage in Postgres
- **JWT** — Auth.js issues a signed JWT containing `IJwtPayload`; NestJS verifies it with `AUTH_SECRET`
- **Shared types** — `IJwtPayload`, `IUser`, `UserRole`, `Permission` are defined in `@workspace/types`

See `@.claude/skills/fullstack-auth-setup` for Auth.js configuration, `@CurrentUser()` decorator, JWT strategy, and TypeScript module augmentation templates.

## Permission model

`permissions` are derived from `roles` at JWT generation time and embedded in the token. NestJS reads permissions directly from `IJwtPayload` — no DB roundtrip on auth checks.

When a user's roles change, the change takes effect on their next login. If immediate revocation is needed, implement a token blocklist — do not change the embedded-permissions model.

## NestJS auth rules

- Inject the authenticated user via `@CurrentUser(): IJwtPayload` — never read `request.user` directly in controllers
- Never query the database inside a guard for auth checks — read only from `IJwtPayload`
- `RolesGuard` and `PermissionsGuard` must read exclusively from `IJwtPayload.roles` and `IJwtPayload.permissions`
- Never log `IJwtPayload` contents in production (contains PII)

## Adding a new role or permission

1. Add the value to `UserRole` or `Permission` enum in `packages/types/src/user.ts`
2. Update the role→permissions mapping in `apps/api/src/auth/permissions.map.ts`
3. TypeScript surfaces any guard or controller that needs updating

## Environment variables

| Variable      | Purpose                                                               |
| ------------- | --------------------------------------------------------------------- |
| `AUTH_SECRET` | Shared between `apps/web` and `apps/api` for JWT signing/verification |
| `AUTH_URL`    | Auth.js callback base URL (`apps/web` only)                           |

Never hardcode secrets. Never commit `.env` files.

## Feature development checklist

When building a full-stack feature involving both Next.js and NestJS:

1. Define request/response interfaces in `packages/types/src/dtos/<domain>.ts`
2. Create NestJS DTO classes that `implements` those interfaces (see `nestjs-dtos-drizzle.md`)
3. Define the Drizzle schema in `infrastructure/persistence/<domain>.schema.ts`
4. Implement the domain entity, repository interface, and use case(s)
5. Implement the Drizzle repository adapter
6. Wire the controller — thin, one use case per endpoint, return response DTO
7. In Next.js: call `api.get/post/patch/delete` from `apps/web/lib/api.ts` typed with the shared interface
8. Client Components call Next.js API routes (`/api/...`) — never import `api.ts` client-side
