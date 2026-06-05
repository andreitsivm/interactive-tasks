# TypeScript Development Rules (Frontend)

## Frontend-Specific Anti-patterns

- **Prop drilling through 3+ levels** — use Context API or state management instead
- **Massive components (300+ lines)** — split into smaller, focused components

## Type Safety at the Browser Boundary

Data from outside the component tree is untyped — always validate before use:

| Source                            | Treatment                                           |
| --------------------------------- | --------------------------------------------------- |
| API responses                     | Receive as `unknown`, validate with a type guard    |
| `localStorage` / `sessionStorage` | Treat as `unknown`, validate on read                |
| URL parameters                    | Treat as `unknown`, validate before use             |
| React props / state               | TypeScript manages these — `unknown` is unnecessary |

**Type assertions — avoid entirely.** If you're reaching for `as`, write a type guard instead. A proper type guard eliminates the need for a cast:

```typescript
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}

function parseUser(data: unknown): Result<User, ValidationError> {
  if (!isUser(data)) return { ok: false, error: new ValidationError() };
  return { ok: true, value: data }; // narrowed by the guard — no cast needed
}
```

**Props complexity:**

- Ideal: 3–7 props. Consider splitting if over 10.
- Optional props: 50% or less. Lean on defaults or Context if higher.
- Nesting: up to 2 levels — flatten deeper structures.

## Component Design

- **Function components only.** Class components are deprecated. Exception: Error Boundary (React requires a class for this one case).
- **Error Boundary required** around any subtree that can throw asynchronously — catches render errors and shows fallback UI.
- **Custom hooks** are the standard unit for logic reuse and dependency injection.

## Environment Variables

- `process.env` does not work in the browser. Use the build tool's env system (`NEXT_PUBLIC_` prefix in Next.js).
- Never put secrets in client-side env vars — all frontend code is public.

## Performance

- `React.memo` for expensive pure components that re-render with stable props.
- `React.lazy` + `Suspense` for route-level and heavy-component code splitting.
- Keep the bundle under 500 KB — check with the `build` script.
