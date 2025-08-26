import { describe, it, expect } from "vitest";
import { adjustmentByNumContest, inverseAdjustmentOfLowRating, getRawRating } from "./adjustment";

// src/features/rating/functions/adjustment.test.ts

describe("adjustmentByNumContest", () => {
    it("returns 0 when n is Infinity", () => {
        expect(adjustmentByNumContest(Infinity)).toBe(0);
    });

    it.each([
        { n: 1, value: 1200 },
        { n: 5, value: 346.81280099957945 },
        { n: 10, value: 156.83200284236486 },
    ])("calculates adjustment for typical n values", ({ n, value }) => {
        const result = adjustmentByNumContest(n);
        expect(result).toBeCloseTo(value);
    });
});

describe("inverseAdjustmentOfLowRating", () => {
    it("returns x if x >= 400", () => {
        expect(inverseAdjustmentOfLowRating(400)).toBe(400);
        expect(inverseAdjustmentOfLowRating(1000)).toBe(1000);
    });

    it("returns adjusted value if x < 400", () => {
        const x = 200;
        const expected = 400 * (1 - Math.log(400 / x));
        expect(inverseAdjustmentOfLowRating(x)).toBeCloseTo(expected);
    });

    it("handles x = 0 by substituting 1e-6", () => {
        const result = inverseAdjustmentOfLowRating(0);
        const expected = 400 * (1 - Math.log(400 / 1e-6));
        expect(result).toBeCloseTo(expected);
    });
});

describe("getRawRating", () => {
    it("returns sum of inverseAdjustmentOfLowRating and adjustmentByNumContest", () => {
        const rating = 500;
        const numContest = 5;
        const expected = inverseAdjustmentOfLowRating(rating) + adjustmentByNumContest(numContest);
        expect(getRawRating(rating, numContest)).toBeCloseTo(expected);
    });

    it("handles rating < 400", () => {
        const rating = 200;
        const numContest = 3;
        const expected = inverseAdjustmentOfLowRating(rating) + adjustmentByNumContest(numContest);
        expect(getRawRating(rating, numContest)).toBeCloseTo(expected);
    });

    it("handles rating = 0 and numContest = Infinity", () => {
        const rating = 0;
        const numContest = Infinity;
        const expected = inverseAdjustmentOfLowRating(rating) + adjustmentByNumContest(numContest);
        expect(getRawRating(rating, numContest)).toBeCloseTo(expected);
    });
});
