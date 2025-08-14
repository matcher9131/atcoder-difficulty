import { describe, it, expect } from "vitest";
import { toPercent } from "./toPercent";

// src/features/problem/functions/toPercent.test.ts

describe("toPercent", () => {
    it("returns empty string for x > 1", () => {
        expect(toPercent(1.01)).toBe("");
        expect(toPercent(2)).toBe("");
        expect(toPercent(100)).toBe("");
    });

    it("returns 'NaN' for x < 0", () => {
        expect(toPercent(-0.01)).toBe("NaN");
        expect(toPercent(-1)).toBe("NaN");
    });

    it("returns '>99%' for x >= 0.995 and x <= 1", () => {
        expect(toPercent(0.995)).toBe(">99%");
        expect(toPercent(0.999)).toBe(">99%");
        expect(toPercent(1)).toBe(">99%");
    });

    it("returns '<1%' for x < 0.005 and x >= 0", () => {
        expect(toPercent(0)).toBe("<1%");
        expect(toPercent(0.004)).toBe("<1%");
        expect(toPercent(0.001)).toBe("<1%");
    });

    it("returns rounded percent string for typical values", () => {
        expect(toPercent(0.5)).toBe("50%");
        expect(toPercent(0.25)).toBe("25%");
        expect(toPercent(0.75)).toBe("75%");
        expect(toPercent(0.01)).toBe("1%");
        expect(toPercent(0.02)).toBe("2%");
        expect(toPercent(0.10)).toBe("10%");
        expect(toPercent(0.80)).toBe("80%");
    });

    it("returns correct percent for edge values", () => {
        expect(toPercent(0.005)).toBe("1%");
        expect(toPercent(0.994)).toBe("99%");
    });

    it("handles floating point rounding correctly", () => {
        expect(toPercent(0.9949)).toBe("99%");
        expect(toPercent(0.0051)).toBe("1%");
    });
});