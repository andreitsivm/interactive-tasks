import type { CefrLevel } from "@workspace/types";

type GrammarPoint = {
  value: string;
  label: string;
  levels: CefrLevel[];
};

export const GRAMMAR_POINTS: readonly GrammarPoint[] = [
  // A1–A2
  {
    value: "present_simple",
    label: "Present simple (habits & facts)",
    levels: ["A1", "A2"],
  },
  {
    value: "present_continuous",
    label: "Present continuous (actions in progress)",
    levels: ["A1", "A2"],
  },
  {
    value: "articles",
    label: "Articles (a / an / the)",
    levels: ["A1", "A2"],
  },
  {
    value: "prepositions_time_place",
    label: "Prepositions of time & place",
    levels: ["A1", "A2"],
  },
  {
    value: "past_simple",
    label: "Past simple (completed actions)",
    levels: ["A2"],
  },
  {
    value: "future_will_going_to",
    label: "Future: will & going to",
    levels: ["A2", "B1"],
  },

  // B1
  {
    value: "present_perfect",
    label: "Present perfect (experience & recent past)",
    levels: ["B1", "B2"],
  },
  {
    value: "past_continuous",
    label: "Past continuous (interrupted actions)",
    levels: ["B1"],
  },
  {
    value: "past_perfect",
    label: "Past perfect (sequence of past events)",
    levels: ["B1", "B2"],
  },
  {
    value: "passive_voice",
    label: "Passive voice",
    levels: ["B1", "B2"],
  },
  {
    value: "modal_verbs",
    label: "Modal verbs (can / must / should / may)",
    levels: ["B1", "B2"],
  },
  {
    value: "first_conditional",
    label: "First conditional (real future)",
    levels: ["B1"],
  },
  {
    value: "second_conditional",
    label: "Second conditional (hypothetical present)",
    levels: ["B1", "B2"],
  },
  {
    value: "reported_speech",
    label: "Reported speech",
    levels: ["B1", "B2"],
  },
  {
    value: "relative_clauses",
    label: "Relative clauses (who / which / that)",
    levels: ["B1", "B2"],
  },

  // B2
  {
    value: "present_perfect_continuous",
    label: "Present perfect continuous",
    levels: ["B2", "C1"],
  },
  {
    value: "phrasal_verbs",
    label: "Phrasal verbs",
    levels: ["B2", "C1"],
  },
  {
    value: "third_conditional",
    label: "Third conditional (hypothetical past)",
    levels: ["B2", "C1"],
  },
  {
    value: "inversion",
    label: "Inversion (negative adverbials)",
    levels: ["B2", "C1", "C2"],
  },

  // C1–C2
  {
    value: "mixed_conditionals",
    label: "Mixed conditionals",
    levels: ["C1", "C2"],
  },
  {
    value: "advanced_passives",
    label: "Advanced passives (have something done)",
    levels: ["C1", "C2"],
  },
  {
    value: "subjunctive",
    label: "Subjunctive mood",
    levels: ["C1", "C2"],
  },
  {
    value: "cleft_sentences",
    label: "Cleft sentences (it is/was … that)",
    levels: ["C1", "C2"],
  },
];
