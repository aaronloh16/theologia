import { resolveSeeAlso } from "./terms";

/**
 * Parse a fullDefinition string and return segments: plain text or a link ref.
 * Handles *term patterns (asterisk before a word/phrase).
 */
export type TextSegment =
  | { type: "text"; content: string }
  | { type: "link"; display: string; href: string };

export function parseDefinition(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  // Match *word or *multi word (stops at punctuation or line end)
  const re = /\*([A-Za-z][A-Za-z\s\-']*[A-Za-z]|\w)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const refWord = match[1].trim();
    const resolved = resolveSeeAlso(refWord);
    if (resolved) {
      segments.push({ type: "link", display: refWord, href: `/terms/${resolved}` });
    } else {
      segments.push({ type: "text", content: refWord });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return segments;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getTermInitial(term: string): string {
  return term[0].toUpperCase();
}
