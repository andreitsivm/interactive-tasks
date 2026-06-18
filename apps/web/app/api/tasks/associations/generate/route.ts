import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { auth } from "@/auth";
import {
  AssociationsRequestSchema,
  AssociationsResponseSchema,
} from "@/lib/tasks/associations.schema";
import { buildAssociationsPrompt } from "@/lib/tasks/associations.prompt";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return new Response(null, { status: 401 });
  }

  const body: unknown = await req.json();
  const parsed = AssociationsRequestSchema.safeParse(body);
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

  try {
    const { object } = await generateObject({
      model: createOpenAI({ apiKey })("gpt-4o-mini"),
      schema: AssociationsResponseSchema,
      prompt: buildAssociationsPrompt(parsed.data),
    });

    return Response.json(object);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error generating associations";
    console.error("[associations] Generation failed:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
