import type { CefrLevel, Language } from "./fill-the-gap";

export interface IAssociationsRequest {
  topic: string;
  level: CefrLevel;
  language: Language;
  wordCount: number;
}
