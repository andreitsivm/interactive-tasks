# Next.js → NestJS API Client Rules

## Use the singleton Axios client

All server-side calls to NestJS must go through the singleton client at `apps/web/lib/api.ts`. This file is `server-only` — importing it in a Client Component causes an immediate build error.

The client attaches `Authorization: Bearer <token>` automatically via a request interceptor. Never pass tokens manually.

```typescript
// ✅ Correct
const { data } = await api.get<ITaskResponse[]>("/tasks");

// ❌ Wrong — manual token handling is redundant and bypasses the interceptor
const session = await auth();
await fetch(`${process.env.NESTJS_API_URL}/tasks`, {
  headers: { Authorization: `Bearer ${session?.accessToken}` },
});
```

See `@.claude/skills/nextjs-api-client-setup` for the `api.ts` implementation and BFF route templates.

## BFF proxy rule

The browser never calls NestJS directly. NestJS has no public URL — it is accessible only via Railway private networking from the Next.js server.

| Caller           | Pattern                                                             |
| ---------------- | ------------------------------------------------------------------- |
| Server Component | Import `api` and call `api.get/post/patch/delete` directly          |
| Server Action    | Import `api` and call `api.get/post/patch/delete` directly          |
| Client Component | Call a Next.js API route (`/api/...`), which calls NestJS via `api` |

Next.js API routes acting as BFF proxies must be thin — forward the request to NestJS and return the response. No business logic in API routes.

## Environment variables

`NESTJS_API_URL` must never be prefixed with `NEXT_PUBLIC_` — it must not be exposed to the browser.
