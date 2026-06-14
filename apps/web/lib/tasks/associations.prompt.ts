import type { IAssociationsRequest } from "@workspace/types";

export function buildAssociationsPrompt(req: IAssociationsRequest): string {
  const associatedCount = Math.floor(req.wordCount / 2);
  const distractorCount = req.wordCount - associatedCount;

  return `You are an expert language teacher creating vocabulary association exercises.

Generate an associations task for a ${req.level} level ${req.language} learner.

Topic: ${req.topic}

Instructions:
1. Pick a specific central concept related to the topic appropriate for ${req.level} level (2–4 words max).
2. Generate exactly ${associatedCount} words clearly associated with the central concept.
3. Generate exactly ${distractorCount} plausible distractors — words that feel related to the topic but are NOT associated with the central concept. They should require thinking, not be obviously wrong.
4. All words must be in ${req.language} and appropriate for ${req.level} level vocabulary.

Return a JSON object with:
- centralConcept: the central concept as a short noun phrase
- associatedWords: exactly ${associatedCount} associated words
- distractors: exactly ${distractorCount} distractor words`.trim();
}
