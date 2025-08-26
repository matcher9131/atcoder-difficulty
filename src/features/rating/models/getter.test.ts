import { createStore } from "jotai";
import { ratingAtom, numContestsAtom } from "./atom";
import { rawRatingAtom } from "./getter";
import { describe, it, expect, vi } from "vitest";

const { getRawRatingMock } = vi.hoisted(() => ({
    getRawRatingMock: vi.fn((rating: number, numContests: number) => rating + numContests),
}));

vi.mock("../functions/adjustment", () => ({
    getRawRating: getRawRatingMock,
}));

describe("rawRatingAtom", () => {
    it("returns null if rating is null", () => {
        const store = createStore();
        store.set(ratingAtom, null);
        store.set(numContestsAtom, 5);
        const result = store.get(rawRatingAtom);
        expect(result).toBeNull();
    });

    it("returns getRawRating result if rating is not null and numContests is not null", () => {
        const store = createStore();
        store.set(ratingAtom, 100);
        store.set(numContestsAtom, 5);
        const result = store.get(rawRatingAtom);
        expect(result).toBe(105);
    });

    it("uses Infinity if numContests is null", () => {
        const store = createStore();
        store.set(ratingAtom, 100);
        store.set(numContestsAtom, null);
        const result = store.get(rawRatingAtom);
        expect(result).toBe(100 + Infinity);
    });

    it("returns null if both rating and numContests are null", () => {
        const store = createStore();
        store.set(ratingAtom, null);
        store.set(numContestsAtom, null);
        const result = store.get(rawRatingAtom);
        expect(result).toBeNull();
    });
});
