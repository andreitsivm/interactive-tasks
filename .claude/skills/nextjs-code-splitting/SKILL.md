---
name: nextjs-code-splitting
description: >
  Use when adding dynamic imports, lazy-loaded components, or code splitting to the Next.js
  App Router. Triggers on: "lazy load", "dynamic import", "next/dynamic", "code split",
  "React.lazy in Next.js", "heavy component", "modal lazy", "ssr: false", "client-only".
  Covers next/dynamic patterns, when to split vs not, and critical pitfalls.
---

# Next.js Code Splitting with `next/dynamic`

## Overview

**Server Components are automatically code-split** — do nothing. Lazy loading targets **Client Components** that are large, conditionally rendered, or rely on browser APIs.

`next/dynamic` wraps `React.lazy()` + Suspense and adds Next.js-specific features (`ssr: false`, preloading integration). Prefer it over raw `React.lazy()` in this codebase.

## When to split (and when not to)

| Situation                                           | Action                                           |
| --------------------------------------------------- | ------------------------------------------------ |
| Modal / drawer / tooltip (shows on interaction)     | Split                                            |
| Heavy third-party: chart lib, rich-text editor, map | Split                                            |
| Client-only component using `window`/`document`     | Split + `ssr: false`                             |
| Large feature area behind a click/tab               | Split                                            |
| Above-the-fold content / LCP element                | **Never split** — tanks Core Web Vitals          |
| Component rendered on every page load immediately   | **Don't split** — adds latency with no gain      |
| Small component (< ~10 KB uncompressed)             | **Don't split** — chunk overhead exceeds savings |
| Server Component                                    | **Never needed** — already auto-split            |

## Patterns

### 1. Basic — lazy Client Component

```typescript
// Must be at module top level, never inside a component body
const HeavyChart = dynamic(() => import("@/components/HeavyChart"));
```

### 2. With a loading placeholder (required for visible components)

```typescript
const RichEditor = dynamic(() => import('@/components/RichEditor'), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-md" />,
})
```

The default `loading` is `null` — invisible until loaded, which causes layout shift. Always provide one for visible components.

### 3. Client-only (browser APIs, no SSR)

```typescript
// This must live inside a 'use client' file
'use client'
import dynamic from 'next/dynamic'

const MapWidget = dynamic(() => import('@/components/MapWidget'), {
  ssr: false,
  loading: () => <div className="h-96 bg-muted" />,
})
```

> `ssr: false` is **only valid inside a Client Component file**. Using it in a Server Component throws a build error.

### 4. Named export

```typescript
const DataTable = dynamic(() =>
  import("@/components/DataTable").then((mod) => mod.DataTable),
);
```

### 5. Heavy library loaded on demand (no `dynamic()` needed)

For libraries used in event handlers, use inline `await import()` — no component wrapper required:

```typescript
"use client";

async function handleExport() {
  const { saveAs } = await import("file-saver"); // loaded only when button clicked
  const blob = new Blob([csv], { type: "text/csv" });
  saveAs(blob, "export.csv");
}
```

### 6. Dynamic import from a Server Component

```typescript
// Server Component — dynamic() here only splits child Client Components,
// not the Server Component itself
import dynamic from "next/dynamic";

const InteractivePanel = dynamic(() => import("./InteractivePanel"));
```

## Hard rules (common pitfalls)

- **`dynamic()` must be at module top level** — calling it inside a render function breaks preloading
- **The import path must be a string literal** — variables and template strings prevent static analysis:
  ```typescript
  // ❌ breaks chunk mapping
  const Comp = dynamic(() => import(`./${name}`));
  // ✅ correct
  const Comp = dynamic(() => import("./SpecificComponent"));
  ```
- **`ssr: false` inside Server Components** — throws at build time; move the `dynamic()` call into a `'use client'` file
- **Dynamically importing a Server Component** — does NOT split the SC's bundle; only its Client Component children get split
- **Don't use `React.lazy()` directly** — use `next/dynamic` for SSR control and preloading integration

## Quick decision flowchart

```
Is it a Server Component?
  └─ Yes → No action needed (auto-split)
  └─ No (Client Component):
       Is it above-the-fold or rendered immediately on load?
         └─ Yes → Static import (don't split)
         └─ No:
              Is it large (>10 KB) OR conditional OR needs browser APIs?
                └─ Yes → dynamic(() => import(...))
                          + add loading: skeleton
                          + add ssr: false if using window/document
                └─ No  → Static import
```
