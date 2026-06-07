# NestJS Module Structure (Pragmatic Hexagonal)

Each feature module follows a pragmatic hexagonal architecture: domain logic is isolated from framework and persistence concerns, but without strict port/adapter ceremony.

## Folder layout per module

```
apps/api/src/modules/<domain>/
  domain/
    <domain>.entity.ts          ← pure domain class, no framework dependencies
    <domain>.repository.ts      ← repository interface (port)
  application/
    use-cases/
      create-<domain>.use-case.ts
      (one file per use case)
  infrastructure/
    persistence/
      drizzle-<domain>.repository.ts   ← implements domain repository interface
      <domain>.schema.ts               ← Drizzle table definition
    http/
      <domain>.controller.ts
      dto/
        create-<domain>.dto.ts         ← see nestjs-dtos-drizzle.md
        <domain>-response.dto.ts
  <domain>.module.ts
```

See `@.claude/skills/nestjs-create-module` for the full scaffold with code templates.

## Layer rules

**`domain/` — pure TypeScript only**

- Entity classes contain domain logic (methods, validation rules)
- No imports from NestJS, Drizzle, class-validator, or any external library
- The repository interface defines what persistence operations are needed; it does not know how they are implemented

**`application/use-cases/` — orchestration only**

- Use cases depend only on domain interfaces (inject the repository interface, not the implementation)
- One use case per operation — do not create fat use cases that handle multiple responsibilities
- Return domain entities, not Drizzle rows or HTTP response objects

**`infrastructure/persistence/` — Drizzle adapters**

- Implements the domain repository interface using Drizzle
- Maps between Drizzle `$inferSelect` rows and domain entities
- Never import domain entities into the Drizzle schema file

**`infrastructure/http/` — HTTP adapters**

- Controllers are thin: validate input (via DTO), call one use case, return response
- Controllers must not contain business logic
- Map use case output to response DTO before returning

## Use case granularity — event-driven handlers

Group use cases by **outcome**, not by triggering event. When multiple events (e.g. `subscription.activated`, `subscription.updated`, `subscription.canceled`) all produce the same state change (sync subscription → DB), one use case handles all of them. Splitting by event type creates parallel use cases with duplicated logic and no meaningful boundary.

## What goes in `apps/api/src/modules/` vs `apps/api/src/`

- Feature modules: `src/modules/<domain>/`
- Cross-cutting NestJS modules (standard module conventions, no hexagonal layering):
  - `src/auth/` — JwtStrategy, JwtGuard, `@CurrentUser()` decorator, RolesGuard, PermissionsGuard, permissions.map.ts
  - `src/database/` — Drizzle connection provider, migrations config
- Global filters, interceptors, pipes: `src/common/`
