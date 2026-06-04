---
name: fullstack-auth-setup
description: >
  Use when setting up authentication for the first time or referencing auth
  implementation details. Triggers on: "setup auth", "configure Auth.js",
  "add JWT strategy", "setup @CurrentUser", "wire up authentication".
  Covers Auth.js session config, TypeScript module augmentation, NestJS JWT
  strategy, @CurrentUser decorator, and RolesGuard.
  Always read fullstack-auth-rbac.md rules first.
---

# Full-Stack Auth Setup

Stack: Auth.js (NextAuth v5) in Next.js + passport-jwt in NestJS + shared `AUTH_SECRET`.

## 1. Shared types in `packages/types`

```typescript
// packages/types/src/user.ts
export enum UserRole {
  Admin = "admin",
  Manager = "manager",
  Member = "member",
}

export enum Permission {
  ReadTasks = "read:tasks",
  WriteTasks = "write:tasks",
  ManageUsers = "manage:users",
}

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  roles: UserRole[];
  permissions: Permission[];
  createdAt: Date;
}
```

```typescript
// packages/types/src/auth.ts
import type { IUser } from "./user";
import type { UserRole, Permission } from "./user";

export interface IJwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  permissions: Permission[];
  iat?: number;
  exp?: number;
}

export interface IAuthSession {
  user: Pick<IUser, "id" | "email" | "name" | "roles" | "permissions">;
  accessToken: string;
}
```

## 2. Auth.js configuration (`apps/web/auth.ts`)

```typescript
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/database/client";
import type { UserRole, Permission } from "@repo/types";
import { getRolePermissions } from "./lib/permissions";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as any).roles as UserRole[];
        token.permissions = getRolePermissions(token.roles as UserRole[]);
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.roles = token.roles as UserRole[];
      session.user.permissions = token.permissions as Permission[];
      session.accessToken = token.sub as string; // JWT token string for NestJS
      return session;
    },
  },
});
```

## 3. TypeScript module augmentation (`apps/web/types/next-auth.d.ts`)

Extend Auth.js types to include `roles`, `permissions`, and `accessToken`:

```typescript
import type { UserRole, Permission } from "@repo/types";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      roles: UserRole[];
      permissions: Permission[];
    };
  }
  interface User {
    roles: UserRole[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: UserRole[];
    permissions: Permission[];
  }
}
```

## 4. Role→permissions mapping (`apps/api/src/auth/permissions.map.ts`)

```typescript
import { UserRole, Permission } from "@repo/types";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.Admin]: Object.values(Permission),
  [UserRole.Manager]: [Permission.ReadTasks, Permission.WriteTasks],
  [UserRole.Member]: [Permission.ReadTasks],
};

export function getRolePermissions(roles: UserRole[]): Permission[] {
  const perms = new Set(roles.flatMap((r) => ROLE_PERMISSIONS[r] ?? []));
  return [...perms];
}
```

Keep the same `getRolePermissions` function in `apps/web/lib/permissions.ts` (used in Auth.js JWT callback).

## 5. NestJS JWT strategy (`apps/api/src/auth/jwt.strategy.ts`)

```typescript
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { IJwtPayload } from "@repo/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_SECRET,
    });
  }

  validate(payload: IJwtPayload): IJwtPayload {
    return payload;
  }
}
```

## 6. JWT guard (`apps/api/src/auth/jwt.guard.ts`)

```typescript
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {}
```

## 7. `@CurrentUser()` decorator (`apps/api/src/auth/current-user.decorator.ts`)

```typescript
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { IJwtPayload } from "@repo/types";

export const CurrentUser = createParamDecorator(
  (_data, ctx: ExecutionContext): IJwtPayload =>
    ctx.switchToHttp().getRequest().user,
);
```

## 8. Roles guard (`apps/api/src/auth/roles.guard.ts`)

```typescript
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { IJwtPayload, UserRole } from "@repo/types";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<UserRole[]>("roles", ctx.getHandler());
    if (!required?.length) return true;
    const user = ctx.switchToHttp().getRequest().user as IJwtPayload;
    return required.some((role) => user.roles.includes(role));
  }
}
```

## 9. Auth module (`apps/api/src/auth/auth.module.ts`)

```typescript
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { JwtGuard } from "./jwt.guard";
import { RolesGuard } from "./roles.guard";

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, JwtGuard, RolesGuard],
  exports: [JwtGuard, RolesGuard],
})
export class AuthModule {}
```

Import `AuthModule` in `AppModule`.

## 10. Environment variables

```bash
# Both apps/web/.env.local and apps/api/.env
AUTH_SECRET=your-secret-here   # must be identical in both apps

# apps/web only
AUTH_URL=http://localhost:3000
```
