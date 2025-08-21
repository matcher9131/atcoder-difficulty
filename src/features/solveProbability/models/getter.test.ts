import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStore } from "jotai";
import { atom } from "jotai";
import { problemsAtom } from "../../problem/models/atom";
import { rawRatingAtom } from "../../rating/models/rating";
import type { Problem } from "../../problem/types/problem";
import {
    problemWithSolveProbabilityAtom,
    solveProbabilitiesMiddleIndexAtom,
    solveProbabilitiesSlicedAtom,
} from "./getter";
import type { ProblemSolveProbability } from "../types/problemSolveProbability";

// src/features/solveProbability/models/solveProbabilities.test.ts

vi.mock("../../problem/models/atom", () => ({
    problemsAtom: { read: vi.fn() },
}));
vi.mock("../../rating/models/rating", () => ({
    rawRatingAtom: { read: vi.fn() },
}));
vi.mock("../functions/compareSolveProbability", () => ({
    compareSolveProbability: vi.fn(
        (a: ProblemSolveProbability, b: ProblemSolveProbability) => a.solveProbability - b.solveProbability,
    ),
}));
vi.mock("../../rating/models/functions", () => ({
    inverseAdjustmentOfLowRating: vi.fn((x: number) => (x >= 400 ? x : 400 * (1 - Math.log(400 / x)))),
}));
vi.mock("../../../utils/array", () => ({
    lowerBound: vi.fn(<T>(arr: T[], fn: (x: T) => number, val: number) => arr.findIndex((p) => fn(p) >= val)),
}));
vi.mock("../../pagination/model/paginations", () => ({
    paginationValueAtom: vi.fn(() => atom(1)),
}));
vi.mock("../../pagination/model/itemsPerPage", () => ({
    itemsPerPageAtom: vi.fn(() => atom(2)),
}));
vi.mock("../../../utils/math", () => ({
    irt2pl: vi.fn(
        (ability, discrimination, difficulty) => 1 / (1 + Math.exp(-discrimination * ((ability - difficulty) / 600))),
    ),
}));

const sampleProblems: Problem[] = [
    { id: "p1", d: [1, 1000], n: "A" },
    { id: "p2", d: [2, 1500], n: "B" },
    { id: "p3", d: null, n: "C" },
];
const sampleRating = 1500;

describe("problemWithSolveProbabilityAtom", () => {
    beforeEach(() => {
        vi.spyOn(problemsAtom, "read").mockReturnValue(sampleProblems);
        vi.spyOn(rawRatingAtom, "read").mockReturnValue(sampleRating);
    });

    it("returns the exact problem with id given", () => {
        const store = createStore();
        const result = store.get(problemWithSolveProbabilityAtom("p1"));
        expect(result?.id).toBe("p1");
    });

    it("returns 2 if rating is null", () => {
        vi.spyOn(rawRatingAtom, "read").mockReturnValue(null);
        const store = createStore();
        const result = store.get(problemWithSolveProbabilityAtom("p1"));
        expect(result?.solveProbability).toBe(2);
    });

    it("returns -1 if problem.d is null", () => {
        const store = createStore();
        const result = store.get(problemWithSolveProbabilityAtom("p3"));
        expect(result?.solveProbability).toBe(-1);
    });

    it("computes solveProbability using irt2pl and inverseAdjustmentOfLowRating", () => {
        const store = createStore();
        const result = store.get(problemWithSolveProbabilityAtom("p2"));
        expect(result?.solveProbability).toBe(0.5);
    });
});

describe("solveProbabilitiesMiddleIndexAtom", () => {
    beforeEach(() => {
        vi.spyOn(problemsAtom, "read").mockReturnValue(sampleProblems);
        vi.spyOn(rawRatingAtom, "read").mockReturnValue(sampleRating);
    });

    it("returns the index of the problem with solveProbability = 0.5", () => {
        const store = createStore();
        const result = store.get(solveProbabilitiesMiddleIndexAtom);
        expect(result).toBe(1);
    });
});

describe("solveProbabilitiesSlicedAtom", () => {
    it("slices problems array correctly", () => {
        vi.spyOn(problemsAtom, "read").mockReturnValue([
            { id: "p1", d: [1, 100], n: "A" },
            { id: "p2", d: [1, 200], n: "B" },
            { id: "p3", d: [1, 300], n: "C" },
            { id: "p4", d: [1, 400], n: "D" },
            { id: "p5", d: [1, 500], n: "E" },
        ]);
        vi.spyOn(solveProbabilitiesMiddleIndexAtom, "read").mockReturnValue(1);
        const store = createStore();
        const result = store.get(solveProbabilitiesSlicedAtom);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0].n).toBe("C");
        expect(result[1].n).toBe("B");
    });
});
