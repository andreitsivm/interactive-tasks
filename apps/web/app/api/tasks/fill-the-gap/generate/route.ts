import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/auth";
import {
  FillTheGapRequestSchema,
  FillTheGapResponseSchema,
} from "@/lib/tasks/fill-the-gap.schema";
import type { IFillTheGapRequest } from "@workspace/types";

function buildPrompt(req: IFillTheGapRequest): string {
  const wordHint =
    req.customWords && req.customWords.length > 0
      ? `\nPreferred words to use as correct answers: ${req.customWords.join(", ")}.`
      : "";

  return `Generate a fill-the-gap language learning exercise.

Topic: ${req.topic}
CEFR Level: ${req.level}
Language: ${req.language}
Age group: ${req.ageGroup}
Number of sentences: ${req.sentenceCount}${wordHint}

Return a structured JSON object with:
- title: a short descriptive title (5-8 words)
- instructions: one sentence telling the learner what to do
- sentences: exactly ${req.sentenceCount} sentence objects

Each sentence object must have:
- id: unique string "s1", "s2", ... "s${req.sentenceCount}"
- segments: ordered array of text/blank nodes forming the full sentence
  - text node: { "type": "text", "value": "<text run>" }
  - blank node: { "type": "blank", "blankId": "<id matching a blank>" }
- blanks: array of 1-2 blank objects per sentence
  - id: globally unique string "b1", "b2", ... across all sentences
  - correctAnswer: the word that fills this blank
  - options: 4-5 strings including the correct answer, shuffled (plausible distractors)

Keep vocabulary and grammar appropriate for ${req.level} level ${req.ageGroup} learners.`;
}

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
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const result = streamObject({
    model: openai("gpt-4o"),
    schema: FillTheGapResponseSchema,
    prompt: buildPrompt(parsed.data),
  });

  return result.toTextStreamResponse();
}
