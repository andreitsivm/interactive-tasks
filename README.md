# Interactive Tasks

AI-powered platform for creating interactive educational tasks — fill-the-gap tests, image-word matching, associations, and vocabulary exercises — configurable by topic, level, age group, and language.

## Monorepo structure

```
apps/
  web/   — Next.js 16 frontend (i18n: en/ua, Tailwind CSS v4, shadcn/ui, Paddle payments)
  api/   — NestJS 11 backend

packages/
  ui/                  — shared React component library (@workspace/ui)
  eslint-config/       — shared ESLint config (@workspace/eslint-config)
  typescript-config/   — shared tsconfig (@workspace/typescript-config)
```

## Prerequisites

- Node.js ≥ 18
- pnpm 9
- [Claude Code](https://claude.ai/code) with [Superpowers](https://github.com/obra/superpowers) installed (required for AI-assisted development)

## Claude Code skills setup

This project pins its AI skills in `skills-lock.json`. After installing the Superpowers plugin from the Claude Code marketplace, sync the pinned skills:

```sh
claude skills sync
```

This installs the exact skill versions locked in `skills-lock.json` (Paddle, shadcn/ui, Vercel, NestJS, and others).

## Getting started

```sh
pnpm install
```

Copy environment files and fill in the required values:

```sh
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

## Development

Run all apps in watch mode:

```sh
pnpm dev
```

Run a single app:

```sh
pnpm dev --filter=web
pnpm dev --filter=api
```

The web app starts on [http://localhost:3000](http://localhost:3000).

## Build

```sh
pnpm build
```

Build a single app:

```sh
pnpm build --filter=web
pnpm build --filter=api
```

## Type checking & linting

```sh
pnpm check-types
pnpm lint
```

## Tech stack

| Layer    | Technology                                       |
| -------- | ------------------------------------------------ |
| Frontend | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui |
| i18n     | next-intl (en / ua)                              |
| Backend  | NestJS 11                                        |
| Payments | Paddle (sandbox by default)                      |
| Monorepo | Turborepo + pnpm workspaces                      |
| Language | TypeScript throughout                            |
