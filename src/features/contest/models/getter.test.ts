import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStore } from "jotai";
import { contestsAtom } from "./atom";
import { contestDateAtom, contestMaxRatingAtom, contestIdsByTypeAtom } from "./getter";
import type { Contest } from "../types/contest";

vi.mock("./atom", () => ({
    contestsAtom: {
        read: vi.fn(),
    },
    contestsJsonAtom: vi.fn(() => ({})),
}));

describe("contestIdsByTypeAtom", () => {
    const contests: Contest[] = [
        { id: "abc001", m: 1200, d: new Date("2020-01-01") }, // abc
        { id: "abc002", m: 1999, d: new Date("2020-01-02") }, // abc
        { id: "arc001", m: 2000, d: new Date("2020-02-01") }, // arc
        { id: "arc002", m: 2400, d: new Date("2020-02-02") }, // arc
        { id: "agc001", m: "inf", d: new Date("2020-03-01") }, // agc
        { id: "agc002", m: "inf", d: new Date("2020-03-02") }, // agc
    ];

    beforeEach(() => {
        const contestsAtomSpy = vi.spyOn(contestsAtom, "read");
        contestsAtomSpy.mockReturnValue(contests);
        return () => {
            contestsAtomSpy.mockRestore();
        };
    });

    it('returns correct contest IDs for "abc"', () => {
        const store = createStore();
        const atom = contestIdsByTypeAtom("abc");
        const ids = store.get(atom);
        expect(ids).toEqual(["abc001", "abc002"]);
    });

    it('returns correct contest IDs for "arc"', () => {
        const store = createStore();
        const atom = contestIdsByTypeAtom("arc");
        const ids = store.get(atom);
        expect(ids).toEqual(["arc001", "arc002"]);
    });

    it('returns correct contest IDs for "agc"', () => {
        const store = createStore();
        const atom = contestIdsByTypeAtom("agc");
        const ids = store.get(atom);
        expect(ids).toEqual(["agc001", "agc002"]);
    });

    it("throws error for unknown contest type", () => {
        const store = createStore();
        // @ts-expect-error testing invalid type
        expect(() => store.get(contestIdsByTypeAtom("unknown"))).toThrowError(/Unknown value/);
    });
});

describe("contestDateAtom", () => {
    const contests: Contest[] = [
        { id: "abc001", m: 1200, d: new Date("2020-01-01") },
        { id: "arc001", m: 2000, d: new Date("2020-02-01") },
        { id: "agc001", m: "inf", d: new Date("2020-03-01") },
    ];

    beforeEach(() => {
        const contestsAtomSpy = vi.spyOn(contestsAtom, "read");
        contestsAtomSpy.mockReturnValue(contests);
        return () => {
            contestsAtomSpy.mockRestore();
        };
    });

    it("returns correct date for each contest ID", () => {
        const store = createStore();
        expect(store.get(contestDateAtom("abc001"))).toStrictEqual(new Date("2020-01-01"));
        expect(store.get(contestDateAtom("arc001"))).toStrictEqual(new Date("2020-02-01"));
        expect(store.get(contestDateAtom("agc001"))).toStrictEqual(new Date("2020-03-01"));
    });

    it("throws error for unknown contest ID", () => {
        const store = createStore();
        expect(() => store.get(contestDateAtom("unknown"))).toThrowError(/Invalid contestId/);
    });
});

describe("contestMaxRatingAtom", () => {
    const contests: Contest[] = [
        { id: "abc001", m: 1200, d: new Date("2020-01-01") },
        { id: "arc001", m: 2000, d: new Date("2020-02-01") },
        { id: "agc001", m: "inf", d: new Date("2020-03-01") },
    ];

    beforeEach(() => {
        const contestsAtomSpy = vi.spyOn(contestsAtom, "read");
        contestsAtomSpy.mockReturnValue(contests);
        return () => {
            contestsAtomSpy.mockRestore();
        };
    });

    it("returns correct max rating for each contest ID", () => {
        const store = createStore();
        expect(store.get(contestMaxRatingAtom("abc001"))).toBe(1200);
        expect(store.get(contestMaxRatingAtom("arc001"))).toBe(2000);
        expect(store.get(contestMaxRatingAtom("agc001"))).toBe("inf");
    });

    it("throws error for unknown contest ID", () => {
        const store = createStore();
        expect(() => store.get(contestMaxRatingAtom("unknown"))).toThrowError(/Invalid contestId/);
    });
});
