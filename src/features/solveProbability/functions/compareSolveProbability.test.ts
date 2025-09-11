import { describe, it, expect } from "vitest";
import { compareSolveProbability } from "./compareSolveProbability";
import type { SolveProbability } from "../types/problemSolveProbability";

// compareSolveProbability.test.ts

describe("compareSolveProbability", () => {
    it("returns positive when x.solveProbability > y.solveProbability", () => {
        const x: SolveProbability = { solveProbability: 0.8 };
        const y: SolveProbability = { solveProbability: 0.5 };
        expect(compareSolveProbability(x, y)).toBeGreaterThan(0);
    });

    it("returns negative when x.solveProbability < y.solveProbability", () => {
        const x: SolveProbability = { solveProbability: 0.2 };
        const y: SolveProbability = { solveProbability: 0.5 };
        expect(compareSolveProbability(x, y)).toBeLessThan(0);
    });

    it("returns zero when x.solveProbability == y.solveProbability", () => {
        const x: SolveProbability = { solveProbability: 0.5 };
        const y: SolveProbability = { solveProbability: 0.5 };
        expect(compareSolveProbability(x, y)).toBe(0);
    });

    it("handles zero values", () => {
        const x: SolveProbability = { solveProbability: 0 };
        const y: SolveProbability = { solveProbability: 0 };
        expect(compareSolveProbability(x, y)).toBe(0);
    });

    it("handles negative values", () => {
        const x: SolveProbability = { solveProbability: -0.2 };
        const y: SolveProbability = { solveProbability: -0.5 };
        expect(compareSolveProbability(x, y)).toBeGreaterThan(0);
    });

    it("handles large values", () => {
        const x: SolveProbability = { solveProbability: 1000 };
        const y: SolveProbability = { solveProbability: 500 };
        expect(compareSolveProbability(x, y)).toBe(500);
    });

    it("handles floating point precision", () => {
        const x: SolveProbability = { solveProbability: 0.3333333 };
        const y: SolveProbability = { solveProbability: 0.3333334 };
        expect(compareSolveProbability(x, y)).toBeCloseTo(-0.0000001);
    });
});
