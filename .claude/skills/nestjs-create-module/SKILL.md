---
name: nestjs-create-module
description: >
  Use when creating a new NestJS feature module. Triggers on: "add [domain] module",
  "create [domain] feature", "scaffold [domain]". Provides the full folder structure
  and code templates for pragmatic hexagonal architecture with Drizzle ORM.
  Always read nestjs-module-structure.md and nestjs-dtos-drizzle.md rules first.
---

# Scaffold a New NestJS Feature Module

Replace `<domain>` and `<Domain>` with the feature name (e.g. `task` / `Task`).

## 1. Folder structure to create

```
apps/api/src/modules/<domain>/
  domain/
    <domain>.entity.ts
    <domain>.repository.ts
  application/
    use-cases/
      create-<domain>.use-case.ts
  infrastructure/
    persistence/
      drizzle-<domain>.repository.ts
      <domain>.schema.ts
    http/
      <domain>.controller.ts
      dto/
        create-<domain>.dto.ts
        <domain>-response.dto.ts
  <domain>.module.ts
```

## 2. Domain entity

```typescript
// domain/<domain>.entity.ts
export class <Domain> {
  constructor(
    public readonly id: string,
    public title: string,
    public readonly createdAt: Date,
  ) {}
}
```

## 3. Repository interface (port)

```typescript
// domain/<domain>.repository.ts
import type { <Domain> } from './<domain>.entity'

export abstract class <Domain>Repository {
  abstract findAll(userId: string): Promise<<Domain>[]>
  abstract findById(id: string): Promise<<Domain> | null>
  abstract create(entity: Omit<<Domain>, 'id' | 'createdAt'>): Promise<<Domain>>
  abstract update(id: string, data: Partial<<Domain>>): Promise<<Domain>>
  abstract delete(id: string): Promise<void>
}
```

## 4. Use case

```typescript
// application/use-cases/create-<domain>.use-case.ts
import { Injectable } from '@nestjs/common'
import { <Domain>Repository } from '../../domain/<domain>.repository'
import type { <Domain> } from '../../domain/<domain>.entity'
import type { ICreate<Domain>Dto } from '@workspace/types'

@Injectable()
export class Create<Domain>UseCase {
  constructor(private readonly repo: <Domain>Repository) {}

  async execute(dto: ICreate<Domain>Dto & { userId: string }): Promise<<Domain>> {
    return this.repo.create(dto)
  }
}
```

## 5. Drizzle schema

```typescript
// infrastructure/persistence/<domain>.schema.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const <domain>s = pgTable('<domain>s', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Drizzle<Domain> = typeof <domain>s.$inferSelect
export type DrizzleInsert<Domain> = typeof <domain>s.$inferInsert
```

## 6. Drizzle repository (adapter)

```typescript
// infrastructure/persistence/drizzle-<domain>.repository.ts
import { Injectable } from '@nestjs/common'
import { DrizzleService } from 'src/database/drizzle.service'
import { <Domain>Repository } from '../../domain/<domain>.repository'
import { <Domain> } from '../../domain/<domain>.entity'
import { <domain>s, type Drizzle<Domain> } from './<domain>.schema'
import { eq } from 'drizzle-orm'

@Injectable()
export class Drizzle<Domain>Repository implements <Domain>Repository {
  constructor(private readonly db: DrizzleService) {}

  private toDomain(row: Drizzle<Domain>): <Domain> {
    return new <Domain>(row.id, row.title, row.createdAt)
  }

  async findAll(userId: string): Promise<<Domain>[]> {
    const rows = await this.db.client
      .select()
      .from(<domain>s)
      .where(eq(<domain>s.userId, userId))
    return rows.map(this.toDomain)
  }

  async findById(id: string): Promise<<Domain> | null> {
    const [row] = await this.db.client
      .select()
      .from(<domain>s)
      .where(eq(<domain>s.id, id))
      .limit(1)
    return row ? this.toDomain(row) : null
  }

  async create(data: Omit<<Domain>, 'id' | 'createdAt'>): Promise<<Domain>> {
    const [row] = await this.db.client
      .insert(<domain>s)
      .values({ title: data.title })
      .returning()
    return this.toDomain(row)
  }

  async update(id: string, data: Partial<<Domain>>): Promise<<Domain>> {
    const [row] = await this.db.client
      .update(<domain>s)
      .set(data)
      .where(eq(<domain>s.id, id))
      .returning()
    return this.toDomain(row)
  }

  async delete(id: string): Promise<void> {
    await this.db.client.delete(<domain>s).where(eq(<domain>s.id, id))
  }
}
```

## 7. Request DTO

```typescript
// infrastructure/http/dto/create-<domain>.dto.ts
import { IsString, IsNotEmpty } from 'class-validator'
import type { ICreate<Domain>Dto } from '@workspace/types'

export class Create<Domain>Dto implements ICreate<Domain>Dto {
  @IsString()
  @IsNotEmpty()
  title: string
}
```

## 8. Response DTO

```typescript
// infrastructure/http/dto/<domain>-response.dto.ts
import type { I<Domain>Response } from '@workspace/types'

export class <Domain>ResponseDto implements I<Domain>Response {
  id: string
  title: string
  createdAt: Date
}
```

## 9. Controller

```typescript
// infrastructure/http/<domain>.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { JwtGuard } from 'src/auth/jwt.guard'
import { CurrentUser } from 'src/auth/current-user.decorator'
import type { IJwtPayload } from '@workspace/types'
import { Create<Domain>UseCase } from '../../application/use-cases/create-<domain>.use-case'
import { Create<Domain>Dto } from './dto/create-<domain>.dto'
import { <Domain>ResponseDto } from './dto/<domain>-response.dto'

@Controller('<domain>s')
@UseGuards(JwtGuard)
export class <Domain>Controller {
  constructor(private readonly create<Domain>: Create<Domain>UseCase) {}

  @Post()
  async create(
    @Body() dto: Create<Domain>Dto,
    @CurrentUser() user: IJwtPayload,
  ): Promise<<Domain>ResponseDto> {
    return this.create<Domain>.execute({ ...dto, userId: user.sub })
  }
}
```

## 10. Module

```typescript
// <domain>.module.ts
import { Module } from '@nestjs/common'
import { <Domain>Repository } from './domain/<domain>.repository'
import { Drizzle<Domain>Repository } from './infrastructure/persistence/drizzle-<domain>.repository'
import { Create<Domain>UseCase } from './application/use-cases/create-<domain>.use-case'
import { <Domain>Controller } from './infrastructure/http/<domain>.controller'

@Module({
  providers: [
    { provide: <Domain>Repository, useClass: Drizzle<Domain>Repository },
    Create<Domain>UseCase,
  ],
  controllers: [<Domain>Controller],
})
export class <Domain>Module {}
```

## 11. Register in AppModule

Add `<Domain>Module` to the `imports` array in `apps/api/src/app.module.ts`.
