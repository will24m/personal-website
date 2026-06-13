import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  computeBondLevel,
  loadRelationship,
  saveRelationship,
  type PetRelationship,
} from "./petStorage.js";

function relationship(overrides: Partial<PetRelationship> = {}): PetRelationship {
  return {
    version: 1,
    totalNearMs: 0,
    closeEncounters: 0,
    pettingCount: 0,
    firstSeen: 0,
    lastSeen: 0,
    sessionCount: 1,
    ...overrides,
  };
}

describe("computeBondLevel", () => {
  it("maps proximity time to bond thresholds", () => {
    expect(computeBondLevel(relationship({ totalNearMs: 0 }))).toBe(0);
    expect(computeBondLevel(relationship({ totalNearMs: 10_001 }))).toBe(1);
    expect(computeBondLevel(relationship({ totalNearMs: 60_001 }))).toBe(2);
    expect(computeBondLevel(relationship({ totalNearMs: 180_001 }))).toBe(3);
    expect(computeBondLevel(relationship({ totalNearMs: 600_001 }))).toBe(4);
  });

  it("maps close encounters to bond thresholds", () => {
    expect(computeBondLevel(relationship({ closeEncounters: 4 }))).toBe(1);
    expect(computeBondLevel(relationship({ closeEncounters: 16 }))).toBe(2);
    expect(computeBondLevel(relationship({ closeEncounters: 41 }))).toBe(3);
    expect(computeBondLevel(relationship({ closeEncounters: 101 }))).toBe(4);
  });
});

describe("loadRelationship / saveRelationship", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("initializes and persists a fresh relationship", () => {
    const first = loadRelationship();
    expect(first.version).toBe(1);
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("increments sessionCount on subsequent loads", () => {
    const first = loadRelationship();
    const second = loadRelationship();
    expect(second.sessionCount).toBe(first.sessionCount + 1);
  });

  it("round-trips saved progress", () => {
    loadRelationship();
    saveRelationship(relationship({ totalNearMs: 5000, pettingCount: 2, sessionCount: 3 }));
    const loaded = loadRelationship();
    expect(loaded.totalNearMs).toBe(5000);
    expect(loaded.pettingCount).toBe(2);
    expect(loaded.sessionCount).toBe(4);
  });

  it("resets when the stored version is unknown", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, totalNearMs: 123 }));
    const loaded = loadRelationship();
    expect(loaded.totalNearMs).toBe(0);
  });
});
