---
name: nextjs-api-client-setup
description: >
  Use when setting up or referencing the Next.js → NestJS Axios client for the first time,
  or when creating a BFF API route that proxies to NestJS. Triggers on: "create api client",
  "setup api.ts", "add BFF route", "proxy to NestJS", "create Next.js API route".
  Always read nextjs-api-client.md rules first.
---

# Next.js → NestJS API Client Setup

## 1. Create `apps/web/lib/api.ts`

This file is created once. All server-side calls to NestJS go through this singleton.

```typescript
// apps/web/lib/api.ts
import "server-only";
import axios from "axios";
import { auth } from "@/auth";

const api = axios.create({
  baseURL: process.env.NESTJS_API_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await auth();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // normalize and rethrow — never swallow errors here
    throw error;
  },
);

export default api;
```

The interceptor calls `auth()` on every request. `auth()` reads the session from
Next.js's `AsyncLocalStorage` context — each concurrent request automatically gets
its own user's token without any manual token passing.

## 2. Add to environment variables

```bash
# apps/web/.env.local
NESTJS_API_URL=http://localhost:3001   # local dev
# In Railway production: use the internal private network URL
```

`NESTJS_API_URL` must never be prefixed with `NEXT_PUBLIC_`.

## 3. Usage in Server Components

```typescript
import api from '@/lib/api'
import type { ITaskResponse } from '@repo/types'

export default async function TasksPage() {
  const { data } = await api.get<ITaskResponse[]>('/tasks')
  return <TaskList tasks={data} />
}
```

## 4. BFF API route template

Use this when a Client Component needs to trigger a mutation or fetch.

```typescript
// apps/web/app/api/tasks/route.ts
import api from "@/lib/api";
import type { ITaskResponse, ICreateTaskDto } from "@repo/types";

export async function GET() {
  const { data } = await api.get<ITaskResponse[]>("/tasks");
  return Response.json(data);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ICreateTaskDto;
  const { data } = await api.post<ITaskResponse>("/tasks", body);
  return Response.json(data, { status: 201 });
}
```

## 5. Usage from a Client Component

Client Components call the Next.js API route — never `api.ts` directly.

```typescript
"use client";

async function createTask(dto: ICreateTaskDto) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return res.json() as Promise<ITaskResponse>;
}
```
