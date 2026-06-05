---
name: component-theming
description: >
  Use when creating a new component or refactoring an existing one that contains
  any color, background, border, shadow, or fill styling. Triggers on: "add component",
  "create component", "refactor component", "new page", "style", "color", "background",
  "dark mode", "light mode", "theme". Every color value must use a CSS variable so both
  light and dark modes work automatically — no hardcoded hex, rgb, or named colors.
---

# Component Dual-Theme Compliance

## Core rule

**Never hardcode a color value.** Every color, background, border, and shadow must reference a CSS variable defined in both the `:root` (light) block and the `@media (prefers-color-scheme: dark)` block in `globals.css`.

Dark mode is detected via CSS media query — not JavaScript. No `window.matchMedia`, no class toggling.

## Checklist — run for every new or changed component

- [ ] Zero hardcoded hex (`#fff`, `#171717`), `rgb()`, or named colors (`white`, `black`) in component styles
- [ ] Every color references a CSS variable: `var(--token-name)`
- [ ] Any new CSS variable is defined in **both** `:root` and `@media (prefers-color-scheme: dark)` in `globals.css`
- [ ] Component visually tested in both light and dark modes (browser devtools → Rendering → prefers-color-scheme)

## Existing CSS variables (from `globals.css`)

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| `--background` | `#ffffff` | `#0a0a0a` |
| `--foreground` | `#171717` | `#ededed` |

Use these first. Add new tokens only when existing ones are insufficient.

## Patterns

### Using existing tokens in CSS Modules

```css
/* ✅ correct — adapts to theme automatically */
.card {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* ❌ wrong — invisible or broken in dark mode */
.card {
  background: #ffffff;
  color: #171717;
}
```

### Adding a new semantic token

When a new color is needed (e.g. a muted surface, a brand accent), add it to `globals.css` in **both** blocks:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --surface-muted: #f5f5f5; /* ← new token: light value */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
    --surface-muted: #1a1a1a; /* ← same token: dark value */
  }
}
```

Then use it in CSS Modules:

```css
.panel {
  background: var(--surface-muted);
}
```

### Inline styles (avoid, but when necessary)

```typescript
// ✅ reference the variable via CSS — don't read it in JS
<div style={{ background: 'var(--background)' }} />

// ❌ reading computed style in JS defeats CSS media-query switching
const bg = getComputedStyle(el).getPropertyValue('--background')
```

## Common mistakes

| Mistake                                                           | Fix                                                               |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `color: '#ededed'` (hardcoded)                                    | `color: var(--foreground)`                                        |
| `background: 'white'` inline style                                | `background: 'var(--background)'`                                 |
| New `--my-color` only in `:root`                                  | Add matching value in `@media (prefers-color-scheme: dark)` block |
| `window.matchMedia('prefers-color-scheme: dark')` to apply styles | Move to CSS; JS detection causes flash of wrong theme             |
| Testing only in light mode                                        | Open browser → DevTools → Rendering → prefers-color-scheme → dark |
