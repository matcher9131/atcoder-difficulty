import { describe, it, expect } from "vitest";
import { toPercent } from "./toPercent";

describe("toPercent", () => {
    it("returns 'NaN' for x < 0", () => {
        expect(toPercent(-0.01)).toBe("NaN");
        expect(toPercent(-1)).toBe("NaN");
    });

    it("returns '>99.9%' for x >= 0.9995", () => {
        expect(toPercent(0.9995)).toBe(">99.9%");
        expect(toPercent(0.9999)).toBe(">99.9%");
        expect(toPercent(1)).toBe(">99.9%");
        expect(toPercent(2)).toBe(">99.9%");
    });

    it("returns '<0.1%' for x < 0.0005 and x >= 0", () => {
        expect(toPercent(0)).toBe("<0.1%");
        expect(toPercent(0.0004)).toBe("<0.1%");
        expect(toPercent(0.0001)).toBe("<0.1%");
    });

    it("returns percent string rounded to the nearest tenth for typical values", () => {
        expect(toPercent(0.5)).toBe("50.0%");
        expect(toPercent(0.25)).toBe("25.0%");
        expect(toPercent(0.75)).toBe("75.0%");
        expect(toPercent(0.01)).toBe("1.0%");
        expect(toPercent(0.02)).toBe("2.0%");
        expect(toPercent(0.1)).toBe("10.0%");
        expect(toPercent(0.8)).toBe("80.0%");
    });

    it("returns correct percent for edge values", () => {
        expect(toPercent(0.0005)).toBe("0.1%");
        expect(toPercent(0.9994)).toBe("99.9%");
    });

    it("handles floating point rounding correctly", () => {
        expect(toPercent(0.99949)).toBe("99.9%");
        expect(toPercent(0.00051)).toBe("0.1%");
    });
});
