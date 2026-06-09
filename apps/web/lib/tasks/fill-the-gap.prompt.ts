import type { CefrLevel, AgeGroup, IFillTheGapRequest } from "@workspace/types";

export function getDifficultyGuidelines(level: CefrLevel): string {
  const guidelines: Record<CefrLevel, string> = {
    A1: `BEGINNER LEVEL (A1):
- Vocabulary: Only the 100–200 most common words (cat, dog, house, eat, go, come).
- Sentence length: Maximum 5–7 words. Simple declarative sentences only.
- Grammar: Present simple tense ONLY. Basic subject-verb-object structure.
- Blanks: Test the most common verbs, nouns, or adjectives. Distractors use wrong verb forms, missing articles, or basic word-order errors.`,

    A2: `ELEMENTARY LEVEL (A2):
- Vocabulary: 500–1000 most common words. Everyday topics: weather, food, hobbies, time expressions.
- Sentence length: 6–10 words. Simple and compound sentences with "and", "but", "or".
- Grammar: Present simple, present continuous, past simple, future with "will"/"going to". Basic comparatives.
- Blanks: Test tense choice and common prepositions. Distractors cause tense confusion or basic preposition errors.`,

    B1: `INTERMEDIATE LEVEL (B1):
- Vocabulary: 2000–3000 words. Abstract concepts, opinions, feelings, work, and education.
- Sentence length: 10–15 words. Complex sentences with subordinate and relative clauses.
- Grammar: All basic tenses, present perfect, past perfect, modals, passive voice, first/second conditionals.
- Blanks: Test subtle tense distinctions and collocation. Distractors reflect register or collocation errors.`,

    B2: `UPPER INTERMEDIATE LEVEL (B2):
- Vocabulary: 4000–6000 words. Idiomatic expressions, phrasal verbs, academic vocabulary.
- Sentence length: 15–25 words. Complex sentences with multiple clauses and embedded structures.
- Grammar: All tenses including perfect continuous, third conditionals, advanced passives, inversion, cleft sentences.
- Blanks: Test nuanced vocabulary and advanced grammar. Distractors involve sophisticated errors in register, style, or collocation.`,

    C1: `ADVANCED LEVEL (C1):
- Vocabulary: 7000–10,000+ words. Sophisticated academic and professional vocabulary, low-frequency terms.
- Sentence length: 20–35 words. Highly complex sentences with multiple embedded clauses.
- Grammar: Mastery of all structures including rare forms, advanced conditionals, stylistic variations, formal register.
- Blanks: Test precise semantic distinctions and advanced collocations. Distractors involve highly subtle semantic or register differences.`,

    C2: `PROFICIENCY LEVEL (C2):
- Vocabulary: Near-native range (10,000+ words). Rare, sophisticated, and literary vocabulary; cultural references; subtle connotations.
- Sentence length: 25–40+ words. Extremely complex sentences with multiple levels of embedding.
- Grammar: Complete mastery including rare constructions, stylistic variation, register shifts, literary devices.
- Blanks: Test distinctions that even native speakers debate. Distractors are extremely subtle — stylistic preferences, register nuances, or advanced collocational patterns.`,
  };

  return guidelines[level];
}

export function getAgeGroupModifiers(ageGroup: AgeGroup): string {
  const modifiers: Record<AgeGroup, string> = {
    child: `Age group: Children. Use concrete, familiar topics (animals, family, school, food, colours). Keep sentences short and fun. Avoid abstract ideas, professional jargon, or adult themes.`,
    teen: `Age group: Teenagers. Use relatable topics (social media, school life, sports, music, technology, friendships). Casual but grammatically correct register. Avoid an overly formal or childish tone.`,
    adult: `Age group: Adults. Use neutral-to-professional register. Academic, work, travel, and cultural topics are all appropriate. Avoid slang.`,
  };

  return modifiers[ageGroup];
}
