import { describe, it, expect } from "vitest";
import { getFillColor, getTextColor } from "./color";

// color.test.ts

describe("getFillColor", () => {
    it("returns correct fill class for each rating range", () => {
        expect(getFillColor(0)).toBe("fill-rating-0");
        expect(getFillColor(399)).toBe("fill-rating-0");
        expect(getFillColor(400)).toBe("fill-rating-400");
        expect(getFillColor(799)).toBe("fill-rating-400");
        expect(getFillColor(800)).toBe("fill-rating-800");
        expect(getFillColor(1199)).toBe("fill-rating-800");
        expect(getFillColor(1200)).toBe("fill-rating-1200");
        expect(getFillColor(1599)).toBe("fill-rating-1200");
        expect(getFillColor(1600)).toBe("fill-rating-1600");
        expect(getFillColor(1999)).toBe("fill-rating-1600");
        expect(getFillColor(2000)).toBe("fill-rating-2000");
        expect(getFillColor(2399)).toBe("fill-rating-2000");
        expect(getFillColor(2400)).toBe("fill-rating-2400");
        expect(getFillColor(2799)).toBe("fill-rating-2400");
        expect(getFillColor(2800)).toBe("fill-rating-2800");
        expect(getFillColor(3000)).toBe("fill-rating-2800");
    });
});

describe("getTextColor", () => {
    it("returns correct text class for each rating range", () => {
        expect(getTextColor(0)).toBe("text-rating-0");
        expect(getTextColor(399)).toBe("text-rating-0");
        expect(getTextColor(400)).toBe("text-rating-400");
        expect(getTextColor(799)).toBe("text-rating-400");
        expect(getTextColor(800)).toBe("text-rating-800");
        expect(getTextColor(1199)).toBe("text-rating-800");
        expect(getTextColor(1200)).toBe("text-rating-1200");
        expect(getTextColor(1599)).toBe("text-rating-1200");
        expect(getTextColor(1600)).toBe("text-rating-1600");
        expect(getTextColor(1999)).toBe("text-rating-1600");
        expect(getTextColor(2000)).toBe("text-rating-2000");
        expect(getTextColor(2399)).toBe("text-rating-2000");
        expect(getTextColor(2400)).toBe("text-rating-2400");
        expect(getTextColor(2799)).toBe("text-rating-2400");
        expect(getTextColor(2800)).toBe("text-rating-2800");
        expect(getTextColor(3000)).toBe("text-rating-2800");
    });
});
