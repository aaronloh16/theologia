export interface Term {
  id: string;
  term: string;
  shortDefinition: string;
  fullDefinition: string;
  examples: string[];
  seeAlso: string[];
  contrastsWith: string[];
  tags: string[];
}

export interface TermsData {
  source: string;
  schemaVersion: string;
  sectionsComplete: string[];
  terms: Term[];
}

export interface SavedTerm {
  termId: string;
  savedAt: number;
}

export interface SrsState {
  termId: string;
  lastSeen: number | null;
  timesSeen: number;
  easeFactor: number;
  intervalDays: number;
  nextReview: number | null;
}

export interface QuizResult {
  id: number;
  takenAt: number;
  score: number;
  total: number;
}

export interface AppStats {
  lastOpened: string | null;
  currentStreak: number;
  longestStreak: number;
  totalTermsSeen: number;
}

export type QuizQuestionType = "mcq" | "fill-blank";

export interface QuizQuestion {
  type: QuizQuestionType;
  termId: string;
  term: string;
  correctAnswer: string;
  options: string[];
  prompt: string;
}
