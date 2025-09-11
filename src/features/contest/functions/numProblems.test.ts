import { describe, it, expect } from "vitest";
import { getGridColsClassName } from "./numProblems";

// src/features/contest/functions/numProblems.test.ts

describe("getGridColsClassName", () => {
    it('returns "grid-cols-9" for contestType "abc"', () => {
        expect(getGridColsClassName("abc")).toBe("grid-cols-9");
    });

    it('returns "grid-cols-8" for contestType "arc"', () => {
        expect(getGridColsClassName("arc")).toBe("grid-cols-8");
    });

    it('returns "grid-cols-11" for contestType "agc"', () => {
        expect(getGridColsClassName("agc")).toBe("grid-cols-11");
    });

    it("throws error for unknown contestType", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        expect(() => getGridColsClassName("unknown" as any)).toThrowError(/Unknown value/);
    });
});
