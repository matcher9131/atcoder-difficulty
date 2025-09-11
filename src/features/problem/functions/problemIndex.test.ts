import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProblemIndex } from "./problemIndex";
import { capitalize } from "../../../utils/string";

// src/features/problem/functions/problemIndex.test.ts

// Mock capitalize
vi.mock("../../../utils/string", () => ({
    capitalize: vi.fn((str: string) => `CAP:${str}`),
}));

describe("getProblemIndex", () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (capitalize as any).mockClear();
    });

    it("returns capitalized last part after underscore", () => {
        const result = getProblemIndex("abc123_a");
        expect(capitalize).toHaveBeenCalledWith("a");
        expect(result).toBe("CAP:a");
    });

    it("handles multiple underscores", () => {
        const result = getProblemIndex("abc123_foo_bar");
        expect(capitalize).toHaveBeenCalledWith("bar");
        expect(result).toBe("CAP:bar");
    });

    it("returns capitalized string when no underscore", () => {
        const result = getProblemIndex("abc123");
        expect(capitalize).toHaveBeenCalledWith("abc123");
        expect(result).toBe("CAP:abc123");
    });

    it("returns capitalized empty string for empty input", () => {
        const result = getProblemIndex("");
        expect(capitalize).toHaveBeenCalledWith("");
        expect(result).toBe("CAP:");
    });

    it("returns capitalized empty string when underscore at end", () => {
        const result = getProblemIndex("abc123_");
        expect(capitalize).toHaveBeenCalledWith("");
        expect(result).toBe("CAP:");
    });

    it("returns capitalized string for single underscore", () => {
        const result = getProblemIndex("_x");
        expect(capitalize).toHaveBeenCalledWith("x");
        expect(result).toBe("CAP:x");
    });
});
