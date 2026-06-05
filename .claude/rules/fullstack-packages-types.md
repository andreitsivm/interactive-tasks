# Shared Types Package (`@workspace/types`)

`packages/types` is the single source of truth for all types shared between `apps/api` (NestJS) and `apps/web` (Next.js). It contains only TypeScript interfaces and enums — zero runtime dependencies, zero framework imports.

## Rule: Define the interface first

Before writing a NestJS DTO class or a Next.js type, define the interface in `packages/types`. The interface is the contract; both sides implement or consume it.

## What belongs here

- Domain enums: `UserRole`, `Permission`
- Core entity interfaces: `IUser`, `IAuthSession`, `IJwtPayload`
- Request DTO interfaces: `ICreateXxxDto`, `IUpdateXxxDto`
- Response interfaces: `IXxxResponse`, `IXxxListResponse`

## What does NOT belong here

- `class-validator` decorators or any NestJS-specific imports
- Drizzle, TypeORM, or any ORM types
- React, Next.js, or browser-specific types
- Any `import` that adds a runtime dependency

## File structure

```
packages/types/src/
  user.ts          ← UserRole enum, Permission enum, IUser
  auth.ts          ← IJwtPayload, IAuthSession
  dtos/
    index.ts       ← barrel re-export of all DTO interfaces
    <domain>.ts    ← one file per feature domain (e.g. tasks.ts, projects.ts)
  index.ts         ← barrel export of everything
```

Add a new `dtos/<domain>.ts` file for each new feature domain. Never dump all DTOs into a single file.

## Naming conventions

| Kind            | Convention                         | Example                   |
| --------------- | ---------------------------------- | ------------------------- |
| Enums           | `PascalCase`                       | `UserRole`, `Permission`  |
| Interfaces      | `I` prefix                         | `IUser`, `ICreateTaskDto` |
| Request DTOs    | `ICreateXxxDto`, `IUpdateXxxDto`   | `ICreateTaskDto`          |
| Response shapes | `IXxxResponse`, `IXxxListResponse` | `ITaskResponse`           |

## Adding a new field to an existing interface

1. Update the interface in `packages/types`
2. TypeScript will immediately error on any NestJS DTO or Next.js usage that is now out of sync
3. Fix all errors before committing — do not suppress with `// @ts-ignore`
