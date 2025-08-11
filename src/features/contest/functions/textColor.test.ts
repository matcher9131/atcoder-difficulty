import { describe, it, expect } from "vitest";
import { getTextColor } from "./textColor";

// src/features/contest/components/functions/textColor.test.ts

describe("getTextColor", () => {
    it('returns "text-rating-2800" for maxRating = "inf"', () => {
        expect(getTextColor("inf")).toBe("text-rating-2800");
    });

    it("returns gradient class for maxRating >= 2800", () => {
        expect(getTextColor(2800)).toBe(
            "bg-gradient-to-b from-rating-2800 from-50% to-rating-2400 to-50% text-transparent bg-clip-text",
        );
        expect(getTextColor(3000)).toBe(
            "bg-gradient-to-b from-rating-2800 from-50% to-rating-2400 to-50% text-transparent bg-clip-text",
        );
    });

    it('returns "text-rating-0" for maxRating < 400', () => {
        expect(getTextColor(0)).toBe("text-rating-0");
        expect(getTextColor(399)).toBe("text-rating-0");
    });

    it('returns "text-rating-400" for 400 <= maxRating < 800', () => {
        expect(getTextColor(400)).toBe("text-rating-400");
        expect(getTextColor(799)).toBe("text-rating-400");
    });

    it('returns "text-rating-800" for 800 <= maxRating < 1200', () => {
        expect(getTextColor(800)).toBe("text-rating-800");
        expect(getTextColor(1199)).toBe("text-rating-800");
    });

    it('returns "text-rating-1200" for 1200 <= maxRating < 1600', () => {
        expect(getTextColor(1200)).toBe("text-rating-1200");
        expect(getTextColor(1599)).toBe("text-rating-1200");
    });

    it('returns "text-rating-1600" for 1600 <= maxRating < 2000', () => {
        expect(getTextColor(1600)).toBe("text-rating-1600");
        expect(getTextColor(1999)).toBe("text-rating-1600");
    });

    it('returns "text-rating-2000" for 2000 <= maxRating < 2400', () => {
        expect(getTextColor(2000)).toBe("text-rating-2000");
        expect(getTextColor(2399)).toBe("text-rating-2000");
    });

    it('returns "text-rating-2400" for 2400 <= maxRating < 2800', () => {
        expect(getTextColor(2400)).toBe("text-rating-2400");
        expect(getTextColor(2799)).toBe("text-rating-2400");
    });

    it('returns "text-rating-2800" for maxRating < 0', () => {
        expect(getTextColor(-1)).toBe("text-rating-2800");
    });
});
