export interface PetRelationship {
  version: 1;
  totalNearMs: number;
  closeEncounters: number;
  pettingCount: number;
  firstSeen: number;
  lastSeen: number;
  sessionCount: number;
}

export type BondLevel = 0 | 1 | 2 | 3 | 4;

export const STORAGE_KEY = "will-wu-pet-v1";

const DEFAULTS: PetRelationship = {
  version: 1,
  totalNearMs: 0,
  closeEncounters: 0,
  pettingCount: 0,
  firstSeen: Date.now(),
  lastSeen: Date.now(),
  sessionCount: 1,
};

export function loadRelationship(): PetRelationship {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = { ...DEFAULTS, firstSeen: Date.now(), lastSeen: Date.now() };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as PetRelationship;
    if (parsed.version !== 1) return { ...DEFAULTS };
    return {
      ...DEFAULTS,
      ...parsed,
      lastSeen: Date.now(),
      sessionCount: (parsed.sessionCount ?? 0) + 1,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveRelationship(data: PetRelationship): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, lastSeen: Date.now() }));
  } catch {
    // localStorage quota exceeded or unavailable
  }
}

export function computeBondLevel(data: PetRelationship): BondLevel {
  const { totalNearMs, closeEncounters } = data;
  if (totalNearMs > 600_000 || closeEncounters > 100) return 4;
  if (totalNearMs > 180_000 || closeEncounters > 40) return 3;
  if (totalNearMs > 60_000 || closeEncounters > 15) return 2;
  if (totalNearMs > 10_000 || closeEncounters > 3) return 1;
  return 0;
}
