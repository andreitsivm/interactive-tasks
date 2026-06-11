import type { CefrLevel, Language } from "./fill-the-gap";

export interface IVocabularyRequest {
  topic: string;
  level: CefrLevel;
  targetLanguage: Language;
  translationLanguage: string;
  wordList?: string[];
}

export interface IVocabularyWord {
  word: string;
  translation: string;
  exampleSentence: string;
}

export interface IVocabularyResponse {
  title: string;
  words: IVocabularyWord[];
}
