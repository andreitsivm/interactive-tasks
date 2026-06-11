import { streamText, Output } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { auth } from '@/auth';
import {
  FillTheGapRequestSchema,
  FillTheGapResponseSchema,
} from '@/lib/tasks/fill-the-gap.schema';
import { buildPrompt } from '@/lib/tasks/fill-the-gap.prompt';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return new Response(null, { status: 401 });
  }

  const body: unknown = await req.json();
  const parsed = FillTheGapRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const result = streamText({
    model: createOpenAI({ apiKey })('gpt-5-nano'),
    output: Output.object({ schema: FillTheGapResponseSchema }),
    prompt: buildPrompt(parsed.data),
  });

  return result.toTextStreamResponse();
}
