import type { CefrLevel, IVocabularyRequest } from "@workspace/types";

export function getVocabularyLevelGuidelines(level: CefrLevel): string {
  const guidelines: Record<CefrLevel, string> = {
    A1: `BEGINNER (A1): Use only the 100–300 most common words. Concrete, everyday nouns, basic verbs (eat, go, have), simple adjectives (big, small). Example sentences: 5–7 words, present simple only.`,
    A2: `ELEMENTARY (A2): 500–1000 most common words. Everyday topics: food, weather, hobbies, routines. Example sentences: 7–10 words, simple structures.`,
    B1: `INTERMEDIATE (B1): 2000–3000 words. Abstract concepts, opinions, feelings, work. Example sentences: 10–15 words, subordinate clauses allowed.`,
    B2: `UPPER INTERMEDIATE (B2): 4000–6000 words. Phrasal verbs, idiomatic expressions, academic vocabulary. Example sentences: 15–25 words.`,
    C1: `ADVANCED (C1): 7000–10,000+ words. Sophisticated academic and professional vocabulary, low-frequency terms. Example sentences: 20–35 words with complex structure.`,
    C2: `PROFICIENCY (C2): Near-native range. Rare, literary, and nuanced vocabulary with subtle connotations. Example sentences: 25–40+ words.`,
  };
  return guidelines[level];
}

export function buildVocabularyPrompt(req: IVocabularyRequest): string {
  const wordListInstruction =
    req.wordList && req.wordList.length > 0
      ? `Use exactly these ${req.wordList.length} word(s) as the basis: ${req.wordList.join(", ")}. If fewer than 10 words are provided, fill the remaining slots with additional topic-relevant words to reach exactly 10.`
      : `Select 10 words that are most useful and representative of the topic for a ${req.level} level learner.`;

  return `You are an expert language teacher creating vocabulary study materials.
Generate exactly 10 vocabulary items for a student learning ${req.targetLanguage} at ${req.level} level.

Topic: ${req.topic}
Target language: ${req.targetLanguage}
Translation language: ${req.translationLanguage}

WORD SELECTION:
${wordListInstruction}

DIFFICULTY GUIDELINES:
${getVocabularyLevelGuidelines(req.level)}

For each word provide:
- word: the vocabulary item in ${req.targetLanguage}
- translation: a natural, accurate translation in ${req.translationLanguage}
- exampleSentence: a clear example sentence in ${req.targetLanguage} that demonstrates the word in context, appropriate for ${req.level} level

Return a JSON object with:
- title: a short descriptive title like "${req.topic} — ${req.level} ${req.targetLanguage}" (5–8 words)
- words: exactly 10 objects, each with word, translation, exampleSentence`.trim();
}
