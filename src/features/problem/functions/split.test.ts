import { describe, it, expect } from "vitest";
import { splitProblemId } from "./split";

// src/features/problem/functions/split.test.ts

describe("splitProblemId", () => {
    it("splits a typical problemId with one slash", () => {
        expect(splitProblemId("abc001/a")).toEqual(["abc001", "a"]);
    });

    it("splits a problemId with multiple slashes", () => {
        expect(splitProblemId("abc001/a/b")).toEqual(["abc001", "a/b"]);
    });

    it("returns ['', ''] for empty string", () => {
        expect(splitProblemId("")).toEqual(["", ""]);
    });

    it("splits when slash is at the start", () => {
        expect(splitProblemId("/a")).toEqual(["", "a"]);
    });

    it("splits when slash is at the end", () => {
        expect(splitProblemId("abc001/")).toEqual(["abc001", ""]);
    });

    it("returns ['', ''] for only a slash", () => {
        expect(splitProblemId("/")).toEqual(["", ""]);
    });

    it("splits when there is no slash", () => {
        // indexOf returns -1, substring(0, -1) is "", substring(0) is full string
        expect(splitProblemId("abc001")).toEqual(["", "abc001"]);
    });
});