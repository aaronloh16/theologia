import * as SQLite from "expo-sqlite";
import type { Term, SavedTerm, SrsState, QuizResult } from "./types";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("theologia.db");
  await initializeDatabase(db);
  return db;
}

async function initializeDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS terms (
      id TEXT PRIMARY KEY,
      term TEXT NOT NULL,
      short_definition TEXT,
      full_definition TEXT,
      examples TEXT,
      see_also TEXT,
      contrasts_with TEXT,
      tags TEXT
    );

    CREATE TABLE IF NOT EXISTS saved_terms (
      term_id TEXT PRIMARY KEY REFERENCES terms(id),
      saved_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS srs_state (
      term_id TEXT PRIMARY KEY REFERENCES terms(id),
      last_seen INTEGER,
      times_seen INTEGER DEFAULT 0,
      ease_factor REAL DEFAULT 2.5,
      interval_days REAL DEFAULT 1,
      next_review INTEGER
    );

    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      taken_at INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_stats (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

export async function seedTerms(terms: Term[]): Promise<void> {
  const database = await getDatabase();
  const existing = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM terms"
  );

  if (existing && existing.count >= terms.length) return;

  for (const term of terms) {
    await database.runAsync(
      `INSERT OR REPLACE INTO terms (id, term, short_definition, full_definition, examples, see_also, contrasts_with, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      term.id,
      term.term,
      term.shortDefinition,
      term.fullDefinition,
      JSON.stringify(term.examples),
      JSON.stringify(term.seeAlso),
      JSON.stringify(term.contrastsWith),
      JSON.stringify(term.tags)
    );
  }
}

export async function getAllTerms(): Promise<Term[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    id: string;
    term: string;
    short_definition: string;
    full_definition: string;
    examples: string;
    see_also: string;
    contrasts_with: string;
    tags: string;
  }>("SELECT * FROM terms ORDER BY term ASC");

  return rows.map((row) => ({
    id: row.id,
    term: row.term,
    shortDefinition: row.short_definition,
    fullDefinition: row.full_definition,
    examples: JSON.parse(row.examples || "[]"),
    seeAlso: JSON.parse(row.see_also || "[]"),
    contrastsWith: JSON.parse(row.contrasts_with || "[]"),
    tags: JSON.parse(row.tags || "[]"),
  }));
}

export async function getTermById(id: string): Promise<Term | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{
    id: string;
    term: string;
    short_definition: string;
    full_definition: string;
    examples: string;
    see_also: string;
    contrasts_with: string;
    tags: string;
  }>("SELECT * FROM terms WHERE id = ?", id);

  if (!row) return null;

  return {
    id: row.id,
    term: row.term,
    shortDefinition: row.short_definition,
    fullDefinition: row.full_definition,
    examples: JSON.parse(row.examples || "[]"),
    seeAlso: JSON.parse(row.see_also || "[]"),
    contrastsWith: JSON.parse(row.contrasts_with || "[]"),
    tags: JSON.parse(row.tags || "[]"),
  };
}

// Saved terms
export async function toggleSavedTerm(termId: string): Promise<boolean> {
  const database = await getDatabase();
  const existing = await database.getFirstAsync<{ term_id: string }>(
    "SELECT term_id FROM saved_terms WHERE term_id = ?",
    termId
  );

  if (existing) {
    await database.runAsync("DELETE FROM saved_terms WHERE term_id = ?", termId);
    return false;
  } else {
    await database.runAsync(
      "INSERT INTO saved_terms (term_id, saved_at) VALUES (?, ?)",
      termId,
      Date.now()
    );
    return true;
  }
}

export async function isTermSaved(termId: string): Promise<boolean> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ term_id: string }>(
    "SELECT term_id FROM saved_terms WHERE term_id = ?",
    termId
  );
  return !!row;
}

export async function getSavedTermIds(): Promise<Set<string>> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{ term_id: string }>(
    "SELECT term_id FROM saved_terms ORDER BY saved_at DESC"
  );
  return new Set(rows.map((r) => r.term_id));
}

export async function getSavedTerms(): Promise<Term[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    id: string;
    term: string;
    short_definition: string;
    full_definition: string;
    examples: string;
    see_also: string;
    contrasts_with: string;
    tags: string;
  }>(
    `SELECT t.* FROM terms t
     INNER JOIN saved_terms s ON t.id = s.term_id
     ORDER BY s.saved_at DESC`
  );

  return rows.map((row) => ({
    id: row.id,
    term: row.term,
    shortDefinition: row.short_definition,
    fullDefinition: row.full_definition,
    examples: JSON.parse(row.examples || "[]"),
    seeAlso: JSON.parse(row.see_also || "[]"),
    contrastsWith: JSON.parse(row.contrasts_with || "[]"),
    tags: JSON.parse(row.tags || "[]"),
  }));
}

// SRS
export async function recordTermSeen(termId: string): Promise<void> {
  const database = await getDatabase();
  const now = Date.now();
  await database.runAsync(
    `INSERT INTO srs_state (term_id, last_seen, times_seen, ease_factor, interval_days, next_review)
     VALUES (?, ?, 1, 2.5, 1, ?)
     ON CONFLICT(term_id) DO UPDATE SET
       last_seen = ?,
       times_seen = times_seen + 1`,
    termId,
    now,
    now + 86400000,
    now
  );
}

export async function getSrsStates(): Promise<Map<string, SrsState>> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    term_id: string;
    last_seen: number | null;
    times_seen: number;
    ease_factor: number;
    interval_days: number;
    next_review: number | null;
  }>("SELECT * FROM srs_state");

  const map = new Map<string, SrsState>();
  for (const row of rows) {
    map.set(row.term_id, {
      termId: row.term_id,
      lastSeen: row.last_seen,
      timesSeen: row.times_seen,
      easeFactor: row.ease_factor,
      intervalDays: row.interval_days,
      nextReview: row.next_review,
    });
  }
  return map;
}

// Quiz results
export async function saveQuizResult(score: number, total: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    "INSERT INTO quiz_results (taken_at, score, total) VALUES (?, ?, ?)",
    Date.now(),
    score,
    total
  );
}

export async function getQuizStats(): Promise<{ totalQuizzes: number; avgScore: number }> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{
    total_quizzes: number;
    avg_score: number;
  }>(
    "SELECT COUNT(*) as total_quizzes, COALESCE(AVG(CAST(score AS REAL) / total), 0) as avg_score FROM quiz_results"
  );
  return {
    totalQuizzes: row?.total_quizzes ?? 0,
    avgScore: row?.avg_score ?? 0,
  };
}

// App stats
export async function updateStreak(): Promise<number> {
  const database = await getDatabase();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const lastOpened = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_stats WHERE key = 'last_opened'"
  );

  let currentStreak = 1;

  if (lastOpened) {
    const lastDate = new Date(lastOpened.value);
    const diffDays = Math.floor(
      (now.getTime() - lastDate.getTime()) / 86400000
    );

    if (diffDays === 0) {
      const streakRow = await database.getFirstAsync<{ value: string }>(
        "SELECT value FROM app_stats WHERE key = 'current_streak'"
      );
      return parseInt(streakRow?.value ?? "1", 10);
    } else if (diffDays === 1) {
      const streakRow = await database.getFirstAsync<{ value: string }>(
        "SELECT value FROM app_stats WHERE key = 'current_streak'"
      );
      currentStreak = parseInt(streakRow?.value ?? "0", 10) + 1;
    }
  }

  await database.runAsync(
    "INSERT OR REPLACE INTO app_stats (key, value) VALUES ('last_opened', ?)",
    today
  );
  await database.runAsync(
    "INSERT OR REPLACE INTO app_stats (key, value) VALUES ('current_streak', ?)",
    String(currentStreak)
  );

  return currentStreak;
}

export async function getTermsSeenCount(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM srs_state WHERE times_seen > 0"
  );
  return row?.count ?? 0;
}

export async function getSavedCount(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM saved_terms"
  );
  return row?.count ?? 0;
}
