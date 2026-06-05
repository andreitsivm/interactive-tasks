---
name: component-i18n
description: >
  Use when creating a new component or refactoring an existing one that contains
  any user-visible text. Triggers on: "add component", "create component", "refactor component",
  "new page", "new button", "label", "placeholder", "aria-label", "toast message",
  "error message", "hardcoded string", "translate". Every string a user can see must
  go through the translation layer — no exceptions.
---

# Component i18n Compliance

## Core rule

**Every user-visible string must go through `t()`** — no hardcoded text in JSX, no template literals for display copy, no string props with raw text values.

This project uses `next-intl`. If it is not yet set up, stop and set it up before adding any user-visible text.

## Checklist — run for every new or changed component

- [ ] Every string visible in the UI uses `t('key')` or `t('key', { variable })`
- [ ] Every `placeholder`, `aria-label`, `title`, `alt` attribute uses `t()`
- [ ] Toast, error, and validation messages use `t()`
- [ ] Dynamic strings use interpolation: `t('greeting', { name })` not `` `Hello ${name}` ``
- [ ] The translation key exists in **all** locale message files (`messages/en.json`, `messages/uk.json`, …)
- [ ] The key is in the correct namespace for this component (match the file path)

## Patterns

### Server Component

```typescript
import { getTranslations } from 'next-intl/server'

export async function TaskCard({ title }: { title: string }) {
  const t = await getTranslations('TaskCard')
  return (
    <article aria-label={t('ariaLabel', { title })}>
      <h2>{t('title')}</h2>
      <button aria-label={t('deleteAriaLabel')}>{t('delete')}</button>
    </article>
  )
}
```

### Client Component

```typescript
'use client'
import { useTranslations } from 'next-intl'

export function SearchInput() {
  const t = useTranslations('SearchInput')
  return (
    <input
      placeholder={t('placeholder')}
      aria-label={t('ariaLabel')}
    />
  )
}
```

### Corresponding message file entry (`messages/en.json`)

```json
{
  "TaskCard": {
    "title": "Task",
    "delete": "Delete",
    "deleteAriaLabel": "Delete task",
    "ariaLabel": "{title} task card"
  },
  "SearchInput": {
    "placeholder": "Search…",
    "ariaLabel": "Search tasks"
  }
}
```

Always update every locale file, not just `en.json`.

## Common mistakes

| Mistake                                     | Fix                                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `<button>Submit</button>`                   | `<button>{t('submit')}</button>`                                                   |
| ``placeholder={`Search ${type}`}``          | `placeholder={t('placeholder', { type })}`                                         |
| `aria-label="Close dialog"`                 | `aria-label={t('closeAriaLabel')}`                                                 |
| Key added to `en.json` only                 | Add to **all** locale files                                                        |
| Key in wrong namespace                      | Namespace = component name, matches file path                                      |
| `t()` called outside Server/Client boundary | Use `getTranslations` in Server Components, `useTranslations` in Client Components |
