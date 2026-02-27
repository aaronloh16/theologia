import rawData from "../../data/terms.json";

export type Term = {
  id: string;
  term: string;
  shortDefinition: string;
  fullDefinition: string;
  example: string;
  nonExample: string;
  seeAlso: string[];
  contrastsWith: string[];
  tags: string[];
};

type RawTerm = {
  id: string;
  term: string;
  shortDefinition: string;
  fullDefinition: string;
  example: string;
  nonExample: string;
  seeAlso: string[];
  contrastsWith: string[];
  tags: string[];
};

function fixTerms(raw: RawTerm[]): Term[] {
  const fixed: Term[] = [];

  for (const t of raw) {
    // The "wrath of God" entry has Zwingli's definition merged into fullDefinition.
    // Split it into two clean entries.
    if (t.id === "wrath-of-god") {
      const zwingliMarker = "X) Y, z Zwingli, Ulrich";
      const zStart = t.fullDefinition.indexOf(zwingliMarker);
      if (zStart !== -1) {
        const wrathDef = t.fullDefinition.slice(0, zStart).trim();
        const zDef = t.fullDefinition
          .slice(zStart)
          .replace("X) Y, z ", "")
          .trim();

        fixed.push({
          ...t,
          fullDefinition: wrathDef,
          shortDefinition: t.shortDefinition,
        });

        // Build the Zwingli entry
        const zFirstSentenceEnd = zDef.indexOf(". ", 40);
        const zShort =
          zFirstSentenceEnd > 0
            ? zDef.slice(0, zFirstSentenceEnd + 1)
            : zDef.split(".")[0] + ".";

        fixed.push({
          id: "zwingli-ulrich",
          term: "Zwingli, Ulrich (1484–1531)",
          shortDefinition: zShort,
          fullDefinition: zDef,
          example: `In conversation: "Zwingli" refers to ${zShort}`,
          nonExample: "",
          seeAlso: ["consubstantiation", "Eucharist", "Anabaptist", "Reformation"],
          contrastsWith: [],
          tags: [],
        });
        continue;
      }
    }
    fixed.push(t as Term);
  }

  return fixed;
}

const ALL_TERMS: Term[] = fixTerms(rawData.terms as RawTerm[]);

// ID-based lookup
const TERMS_BY_ID = new Map<string, Term>(ALL_TERMS.map((t) => [t.id, t]));

// Normalised name -> id for resolving *ref links
const TERMS_BY_SLUG = new Map<string, string>();
for (const t of ALL_TERMS) {
  // Primary key: id
  TERMS_BY_SLUG.set(t.id, t.id);
  // Also index by simple slugified term name (lowercase, no punctuation)
  const slug = t.term
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
  TERMS_BY_SLUG.set(slug, t.id);
  // Also index by the raw lowercase term
  TERMS_BY_SLUG.set(t.term.toLowerCase(), t.id);
}

export function getAllTerms(): Term[] {
  return ALL_TERMS;
}

export function getTermById(id: string): Term | undefined {
  return TERMS_BY_ID.get(id);
}

export function getTermsByLetter(letter: string): Term[] {
  const l = letter.toUpperCase();
  return ALL_TERMS.filter((t) => t.term[0].toUpperCase() === l);
}

export function getLetters(): string[] {
  const seen = new Set<string>();
  const letters: string[] = [];
  for (const t of ALL_TERMS) {
    const l = t.term[0].toUpperCase();
    if (!seen.has(l)) {
      seen.add(l);
      letters.push(l);
    }
  }
  return letters.sort();
}

export function getAllTermIds(): string[] {
  return ALL_TERMS.map((t) => t.id);
}

export function getRandomTerm(): Term {
  return ALL_TERMS[Math.floor(Math.random() * ALL_TERMS.length)];
}

/**
 * Resolve a seeAlso display name (like "salvation", "Eastern Orthodoxy")
 * to a real term id. Returns undefined if no match found.
 */
export function resolveSeeAlso(ref: string): string | undefined {
  if (TERMS_BY_SLUG.has(ref)) return TERMS_BY_SLUG.get(ref);
  const lower = ref.toLowerCase();
  if (TERMS_BY_SLUG.has(lower)) return TERMS_BY_SLUG.get(lower);
  const slug = lower.replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
  if (TERMS_BY_SLUG.has(slug)) return TERMS_BY_SLUG.get(slug);
  // Partial match: find any term whose id starts with slug or contains it
  for (const [key, id] of TERMS_BY_SLUG) {
    if (key.startsWith(slug) || slug.startsWith(key)) return id;
  }
  return undefined;
}

/**
 * Get all terms grouped by letter for the index page.
 */
export function getTermsGroupedByLetter(): Record<string, Term[]> {
  const groups: Record<string, Term[]> = {};
  for (const t of ALL_TERMS) {
    const l = t.term[0].toUpperCase();
    if (!groups[l]) groups[l] = [];
    groups[l].push(t);
  }
  return groups;
}
