## Environment variables

- When adding a new env var, always do all three in the same commit:
  1. Add it to `.env.example` in proper project with an empty or placeholder value and a one-line
     comment explaining what it is and where to get it
  2. Declare it in the relevant `turbo.json` pipeline under `env` (for build-time
     `NEXT_PUBLIC_*`) or `passThroughEnv` (for server-only runtime vars)
  3. Use it in code — never add env vars speculatively

- Never commit real secrets to `.env.example` — placeholders only:
  `PADDLE_API_KEY=pdl_sdbx_apikey_...`
