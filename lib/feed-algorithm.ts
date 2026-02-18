import type { Term, SrsState } from "./types";

/**
 * Gentle SRS-weighted feed algorithm.
 * Generates a shuffled queue of terms where:
 * - Terms not seen in 7+ days get 2x weight
 * - Saved terms get 1.5x weight
 * - Recently seen terms get 0.5x weight
 * - Never-seen terms get 1.0 weight
 */
export function generateFeedQueue(
  allTerms: Term[],
  srsStates: Map<string, SrsState>,
  savedTermIds: Set<string>,
  count: number = 50
): Term[] {
  const now = Date.now();
  const DAY_MS = 86400000;

  const weighted = allTerms.map((term) => {
    const srs = srsStates.get(term.id);
    let weight = 1.0;

    if (srs && srs.lastSeen) {
      const daysSince = (now - srs.lastSeen) / DAY_MS;

      if (daysSince >= 7) {
        weight = 2.0;
      } else if (daysSince < 1) {
        weight = 0.3;
      } else {
        weight = Math.max(0.3, daysSince / 14);
      }
    }

    if (savedTermIds.has(term.id)) {
      weight *= 1.5;
    }

    return { term, weight };
  });

  // Weighted random sampling without replacement
  const selected: Term[] = [];
  const pool = [...weighted];

  const limit = Math.min(count, pool.length);
  for (let i = 0; i < limit; i++) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    let chosenIndex = 0;
    for (let j = 0; j < pool.length; j++) {
      random -= pool[j].weight;
      if (random <= 0) {
        chosenIndex = j;
        break;
      }
    }

    selected.push(pool[chosenIndex].term);
    pool.splice(chosenIndex, 1);
  }

  return selected;
}
