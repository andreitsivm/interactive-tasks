# NestJS DTOs and Drizzle Schema Rules

## DTO rule — must implement shared interface

Every NestJS request DTO must `implements` the corresponding interface from `@repo/types`. This enforces compile-time drift detection: if the shared interface changes, TypeScript errors immediately on the DTO class.

- `class-validator` decorators belong on the NestJS DTO class only — never in `packages/types`
- `@ApiProperty()` (Swagger) also stays on the NestJS DTO class only
- The `implements` clause must reference the exact interface from `@repo/types`, not a locally defined type
- Never use `Partial<ICreateXxxDto>` in the `implements` clause — define a separate `IUpdateXxxDto` interface for partial updates

Controllers return response DTO classes (which also implement shared response interfaces), not raw domain entities or Drizzle rows.

## Drizzle schema rules

- Drizzle table definitions live exclusively in `infrastructure/persistence/<domain>.schema.ts`
- Use `$inferSelect` for read types (`DrizzleXxx`) and `$inferInsert` for write types (`DrizzleInsertXxx`)
- `DrizzleXxx` types are used only inside `infrastructure/persistence/` — the repository maps them to domain entities before returning
- Never import `DrizzleXxx` types in controllers, use cases, or domain entities
- One schema file per domain module — do not centralise all schemas in a single file

## Validation pipe

Enable the global `ValidationPipe` in `apps/api/src/main.ts` with `whitelist: true` and `forbidNonWhitelisted: true` so undecorated properties are stripped and unknown properties throw.

See `@.claude/skills/nestjs-create-module` for DTO and schema code templates.
