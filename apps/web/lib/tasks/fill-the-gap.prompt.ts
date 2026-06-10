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

export function buildPrompt(req: IFillTheGapRequest): string {
  return `You are an expert English language teacher creating grammar practice exercises in the style of Grammar Way — clear, well-structured, and pedagogically purposeful. Every sentence must be specifically designed to test the grammar focus listed below. The blank must fall on the exact word or phrase that demonstrates the target structure. Do not generate sentences where the blank tests vocabulary choice — only the target grammar point.

CONTEXT:
- Grammar focus: ${req.grammarFocus}
- CEFR Level: ${req.level}
- Language: ${req.language}
- Age group: ${req.ageGroup}
- Number of sentences: ${req.sentenceCount}

DIFFICULTY GUIDELINES:
${getDifficultyGuidelines(req.level)}

AGE GROUP MODIFIERS:
${getAgeGroupModifiers(req.ageGroup)}

STYLE GUIDELINES (Grammar Way):
- Write sentences that are pedagogically purposeful and stand on their own — not grouped around a topic or theme.
- Use natural, everyday language. Avoid thematic clusters (gym, travel, food).
- Each sentence must include enough contextual clues that a student at ${req.level} level can deduce the correct answer through grammatical reasoning alone, not world knowledge or general advice.

STRUCTURAL RULES FOR BLANKS:
1. A blank must never be the first word of a sentence.
2. All options (4–5 choices) must be the same grammatical word class as the correct answer (e.g. all verbs, all nouns).
3. Each distractor must have exactly one clear reason it is wrong in this specific sentence — wrong tense form, wrong collocation with the surrounding words, grammatically impossible in this context, or a false friend of the correct answer. The reason must be specific to the sentence context, not a general semantic judgment.
3a. Near-synonyms that also fit the sentence are forbidden. If a learner could plausibly choose a distractor and still be correct, it is not a valid distractor. Distractors must be from the same word class as the correct answer but wrong for a concrete, explainable reason tied to this sentence.
3b. Antonyms and opposites are also forbidden as distractors if they produce a grammatically valid sentence. Each wrong option must be unambiguously incorrect — not merely bad advice or an undesirable action. If a learner could construct any reasonable reading in which the distractor is correct, it is not a valid distractor. Grammar-focused sentences make this easier to achieve: wrong verb forms, wrong tense, wrong conjugation, or structurally incompatible constructions are unambiguously incorrect without any semantic ambiguity.
4. The correct answer must unambiguously fit the surrounding context; no trick questions.
5. Each sentence must be grammatically complete and correct when the blank is filled with the correct answer.
6. Generate exactly ${req.sentenceCount} sentences, each with 1–2 blanks.

Return a structured JSON object with:
- title: a short descriptive title (5–8 words)
- instructions: one sentence telling the learner what to do
- sentences: exactly ${req.sentenceCount} sentence objects

Each sentence object must have:
- id: unique string "s1", "s2", ... "s${req.sentenceCount}"
- segments: ordered array of text/blank nodes forming the full sentence
  - text node: { "type": "text", "value": "<text run>" }
  - blank node: { "type": "blank", "blankId": "<id matching a blank>" }
- blanks: array of 1–2 blank objects per sentence
  - id: globally unique string "b1", "b2", ... across all sentences
  - correctAnswer: the word that fills this blank
  - options: 4–5 strings including the correct answer, shuffled (plausible distractors)

Keep vocabulary and grammar appropriate for ${req.level} level ${req.ageGroup} learners.`.trim();
}
