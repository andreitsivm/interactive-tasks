<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

For any question regarding next use MCP `next-devtools`

<!-- END:nextjs-agent-rules -->

## AI Development Workflow (Superpowers)

This project uses [Superpowers](https://github.com/obra/superpowers) skills. Install via the Claude Code marketplace before working on this repo.

Invoke these skills before each phase — no exceptions:

- Before any feature or creative work: `superpowers:brainstorming`
- Before multi-step implementation: `superpowers:writing-plans`
- For all code changes: `superpowers:test-driven-development`
- Before any bug fix or unexpected behavior: `superpowers:systematic-debugging`
- Before marking work done: `superpowers:verification-before-completion`
- Before creating a PR or merging: `superpowers:finishing-a-development-branch`

## Paddle integration

When writing or modifying code that integrates with Paddle:

- Always check current Paddle documentation via the `paddle-docs` MCP server before suggesting code. The Paddle API and SDKs evolve frequently — do not rely on training data alone.
- Use the official Paddle SDK for the language in use:
  - Node.js → `@paddle/paddle-node-sdk`
  - Python → `paddle-python-sdk` (imports as `paddle_billing`)
  - Go → `github.com/PaddleHQ/paddle-go-sdk/v5`
  - PHP → `paddlehq/paddle-php-sdk`
- All development uses the sandbox environment. Sandbox API keys contain `_sdbx`; sandbox client-side tokens are prefixed with `test_`.
- Always verify webhook signatures before acting on the payload:
  - Node: `paddle.webhooks.unmarshal()`
  - Python: `Verifier().verify(request, secret)`
  - Go: `paddle.NewWebhookVerifier()` with `Middleware`
  - PHP: `(new Verifier())->verify($request, $secret)`
- For destructive account changes (updating prices, archiving products, cancelling subscriptions), ask for explicit confirmation before calling the `paddle-sandbox` or `paddle-live` MCP server.
- Use `paddle-sandbox` by default. Only call `paddle-live` when the prompt explicitly mentions live, production, or real customer data.
- API keys and webhook secrets live in environment variables — never inline credentials into code.

## Git

- Never commit automatically unless I explicitly ask
- No need to clutter git history with a working document. Skipping the commit.

## TypeScript

Never use `as any`, `as unknown`, or unsafe type assertions to silence type errors.
Resolve type errors properly — with generics, utility types (`ReturnType`, `Parameters`,
`Awaited`, `Extract`, `Pick` etc.), or types imported from the relevant library.

When working with library APIs (next-intl, Paddle, Radix, etc.), import and use the
types the library exports rather than redeclaring them locally or casting around them.

## Playwright

- Save all screenshots and traces in `.playwright-mcp/` (git-ignored)
- After implementing any task that touches UI or frontend, launch Playwright and visually
  validate the result before marking the task done
- Check: layout is not broken, text is readable, dark and light themes both look correct,
  UA and EN locales both render without missing translations
- If a screenshot reveals a visual bug, fix it in the same task — do not defer it
