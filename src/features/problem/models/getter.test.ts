import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStore } from "jotai";
import { problemsAtom } from "./atom";
import { problemSelector, numProblemsAtom, contestProblemIdsAtom } from "./getter";
import type { Problem } from "../types/problem";

// src/features/problem/models/problemGetter.test.ts

vi.mock("./atom", () => ({
    problemsAtom: {
        read: vi.fn(),
    },
}));

const sampleProblems: Problem[] = [
    { id: "abc001/A", n: "A", d: [1, 100] },
    { id: "abc001/B", n: "B", d: [1, 200] },
    { id: "abc002/A", n: "A", d: [1, 150] },
    { id: "arc001/A", n: "A", d: [1, 300] },
];

describe("problemSelector", () => {
    beforeEach(() => {
        vi.spyOn(problemsAtom, "read").mockReturnValue(sampleProblems);
    });

    it("returns the correct problem for a valid ID", () => {
        const store = createStore();
        const atom = problemSelector("abc001/A");
        expect(store.get(atom)).toEqual({ id: "abc001/A", n: "A", d: [1, 100] });
    });

    it("returns undefined for an invalid ID", () => {
        const store = createStore();
        const atom = problemSelector("nonexistent");
        expect(store.get(atom)).toBeUndefined();
    });
});

describe("numProblemsAtom", () => {
    it("returns the correct number of problems", () => {
        vi.spyOn(problemsAtom, "read").mockReturnValue(sampleProblems);
        const store = createStore();
        expect(store.get(numProblemsAtom)).toBe(4);
    });

    it("returns 0 when there are no problems", () => {
        vi.spyOn(problemsAtom, "read").mockReturnValue([]);
        const store = createStore();
        expect(store.get(numProblemsAtom)).toBe(0);
    });
});

describe("contestProblemIdsAtom", () => {
    beforeEach(() => {
        vi.spyOn(problemsAtom, "read").mockReturnValue(sampleProblems);
    });

    it("returns all problem IDs for a given contest", () => {
        const store = createStore();
        const atom = contestProblemIdsAtom("abc001");
        expect(store.get(atom)).toEqual(["abc001/A", "abc001/B"]);
    });

    it("returns empty array for contest with no problems", () => {
        const store = createStore();
        const atom = contestProblemIdsAtom("agc001");
        expect(store.get(atom)).toEqual([]);
    });

    it("returns correct IDs for another contest", () => {
        const store = createStore();
        const atom = contestProblemIdsAtom("arc001");
        expect(store.get(atom)).toEqual(["arc001/A"]);
    });

    it("returns correct IDs for contest with one problem", () => {
        const store = createStore();
        const atom = contestProblemIdsAtom("abc002");
        expect(store.get(atom)).toEqual(["abc002/A"]);
    });
});
