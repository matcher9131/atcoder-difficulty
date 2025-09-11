import { describe, it, expect } from "vitest";
import { adjustLowRating } from "./adjustLowRating";

describe("adjustLowRating", () => {
    it("returns adjusted value for ratings below 400", () => {
        const rating = 200;
        const expected = 400 / Math.exp((400 - rating) / 400);
        expect(adjustLowRating(rating)).toBeCloseTo(expected, 6);
    });

    it("returns 400 for rating exactly 400", () => {
        expect(adjustLowRating(400)).toBe(400);
    });

    it("returns the same rating for ratings above 400", () => {
        expect(adjustLowRating(500)).toBe(500);
        expect(adjustLowRating(1000)).toBe(1000);
    });

    it("handles zero rating", () => {
        const rating = 0;
        const expected = 400 / Math.exp((400 - rating) / 400);
        expect(adjustLowRating(rating)).toBeCloseTo(expected, 6);
    });

    it("handles negative ratings", () => {
        const rating = -100;
        const expected = 400 / Math.exp((400 - rating) / 400);
        expect(adjustLowRating(rating)).toBeCloseTo(expected, 6);
    });

    it("returns correct value for rating just below 400", () => {
        const rating = 399.99;
        const expected = 400 / Math.exp((400 - rating) / 400);
        expect(adjustLowRating(rating)).toBeCloseTo(expected, 6);
    });

    it("returns correct value for rating just above 400", () => {
        const rating = 400.01;
        expect(adjustLowRating(rating)).toBe(400.01);
    });
});
