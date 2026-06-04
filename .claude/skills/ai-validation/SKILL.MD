---
name: ai-validation
description: >
  Use when implementing AI API calls, handling Claude or OpenAI responses,
  processing stream chunks, parsing streamed JSON, or validating any data
  coming from AI APIs. Covers Zod validation patterns for both regular
  responses and streaming. Apply when user asks to "call AI", "stream from
  Claude/OpenAI", "parse AI response", or "handle AI output".
---

# AI response & streaming validation

Always validate data coming from AI APIs through Zod before using it.
Never use `as` type casting or `any` on AI responses.

## Regular (non-streaming) response

```ts
import { z } from 'zod'

const ResponseSchema = z.object({
  // define your expected shape
})

async function callAI(prompt: string) {
  const raw = await fetchFromAI(prompt)

  const result = ResponseSchema.safeParse(raw)

  if (!result.success) {
    // Log in dev, silent or report in prod
    console.error('[ai-validation] Invalid response shape:', result.error.flatten())
    throw new AIValidationError('Unexpected AI response format', result.error)
  }

  return result.data
}
```

## Streaming response

```ts
import { z } from 'zod'

const ChunkSchema = z.object({
  // define chunk shape
})

async function* streamAI(prompt: string): AsyncGenerator<z.infer<typeof ChunkSchema>> {
  const stream = await fetchStreamFromAI(prompt)

  for await (const raw of stream) {
    const result = ChunkSchema.safeParse(raw)

    if (!result.success) {
      // Skip malformed chunks — stream may produce partial/empty objects
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ai-validation] Skipped invalid chunk:', result.error.flatten())
      }
      continue
    }

    yield result.data
  }
}
```

## Streaming with accumulated text (delta pattern)

For Claude/OpenAI text-delta streaming where chunks are partial strings:

```ts
const DeltaChunkSchema = z.object({
  type: z.literal('content_block_delta'),
  delta: z.object({
    type: z.literal('text_delta'),
    text: z.string(),
  }),
})

// Usage in React with useState
async function streamToState(
  prompt: string,
  setText: React.Dispatch<React.SetStateAction<string>>
) {
  const stream = await fetchStreamFromAI(prompt)
  let buffer = ''

  for await (const raw of stream) {
    const result = DeltaChunkSchema.safeParse(raw)
    if (!result.success) continue

    buffer += result.data.delta.text
    setText(buffer)
  }
}
```

## Error class

Define once and reuse across all AI calls:

```ts
export class AIValidationError extends Error {
  constructor(
    message: string,
    public readonly zodError: z.ZodError,
    public readonly raw?: unknown,
  ) {
    super(message)
    this.name = 'AIValidationError'
  }
}
```

## Error handling at call site

```ts
try {
  const data = await callAI(prompt)
  // use data
} catch (err) {
  if (err instanceof AIValidationError) {
    // Shape mismatch — likely API change or unexpected model output
    reportToMonitoring(err)
    showUserError('AI returned unexpected format. Please try again.')
    return
  }

  if (err instanceof NetworkError) {
    showUserError('Connection error. Please check your network.')
    return
  }

  // Unknown error — rethrow
  throw err
}
```

## Rules

- Always use `safeParse`, never `parse` — streaming chunks can be partial or empty
- Never use `as SomeType` or `any` on raw AI output
- In development: log validation errors with `console.warn/error`
- In production: skip invalid chunks silently, report validation errors to monitoring
- Define schemas close to where they are used (colocate with the fetch function)
- Export inferred types: `export type MyResponse = z.infer<typeof ResponseSchema>`
- For streaming: always handle the "no valid chunks received" case (empty result)