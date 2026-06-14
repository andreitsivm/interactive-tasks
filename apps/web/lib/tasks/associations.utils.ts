export interface AssociationsScore {
  correct: number;
  total: number;
  percent: number;
}

export function scoreAssociations(
  associationWords: string[],
  associatedWords: string[],
): AssociationsScore {
  const correct = associationWords.filter((w) =>
    associatedWords.includes(w),
  ).length;
  const total = associatedWords.length;
  return {
    correct,
    total,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
}

export type WordState = "correct" | "incorrect" | "missed" | "neutral";

export function getWordState(
  word: string,
  zone: "pool" | "associations",
  associatedWords: string[],
): WordState {
  const isAssociated = associatedWords.includes(word);
  if (zone === "associations") {
    return isAssociated ? "correct" : "incorrect";
  }
  return isAssociated ? "missed" : "neutral";
}
