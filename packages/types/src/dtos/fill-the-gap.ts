export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Language = "en" | "ua" | "de" | "fr";
export type AgeGroup = "child" | "teen" | "adult";

export interface IFillTheGapRequest {
  grammarFocus: string;
  level: CefrLevel;
  language: Language;
  sentenceCount: number;
  ageGroup: AgeGroup;
}
