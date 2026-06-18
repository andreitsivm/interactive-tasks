import { streamText, Output } from "ai";
import { openai } from "@/lib/ai-sdk";
import { auth } from "@/auth";
import {
  VocabularyRequestSchema,
  VocabularyResponseSchema,
} from "@/lib/tasks/vocabulary.schema";
import { buildVocabularyPrompt } from "@/lib/tasks/vocabulary.prompt";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return new Response(null, { status: 401 });
  }

  const body: unknown = await req.json();
  const parsed = VocabularyRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = streamText({
    model: openai("gpt-5-nano"),
    output: Output.object({ schema: VocabularyResponseSchema }),
    prompt: buildVocabularyPrompt(parsed.data),
  });

  return result.toTextStreamResponse();
}
