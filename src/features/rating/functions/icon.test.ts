import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getRatingIconHref } from "./icon";

describe("getRatingIconHref", () => {
    beforeEach(() => {});

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it.each([
        { rating: 0, level: 1 },
        { rating: 99, level: 1 },
        { rating: 100, level: 2 },
        { rating: 199, level: 2 },
        { rating: 200, level: 3 },
        { rating: 299, level: 3 },
        { rating: 300, level: 4 },
        { rating: 399, level: 4 },
        { rating: 400, level: 1 },
        { rating: 499, level: 1 },
        { rating: 500, level: 2 },
        { rating: 599, level: 2 },
        { rating: 600, level: 3 },
        { rating: 699, level: 3 },
        { rating: 700, level: 4 },
        { rating: 799, level: 4 },
        { rating: 800, level: 1 },
        { rating: 899, level: 1 },
        { rating: 900, level: 2 },
        { rating: 999, level: 2 },
        { rating: 1000, level: 3 },
        { rating: 1099, level: 3 },
        { rating: 1100, level: 4 },
        { rating: 1199, level: 4 },
        { rating: 1200, level: 1 },
        { rating: 1299, level: 1 },
        { rating: 1300, level: 2 },
        { rating: 1399, level: 2 },
        { rating: 1400, level: 3 },
        { rating: 1499, level: 3 },
        { rating: 1500, level: 4 },
        { rating: 1599, level: 4 },
        { rating: 1600, level: 1 },
        { rating: 1699, level: 1 },
        { rating: 1700, level: 2 },
        { rating: 1799, level: 2 },
        { rating: 1800, level: 3 },
        { rating: 1899, level: 3 },
        { rating: 1900, level: 4 },
        { rating: 1999, level: 4 },
        { rating: 2000, level: 1 },
        { rating: 2099, level: 1 },
        { rating: 2100, level: 2 },
        { rating: 2199, level: 2 },
        { rating: 2200, level: 3 },
        { rating: 2299, level: 3 },
        { rating: 2300, level: 4 },
        { rating: 2399, level: 4 },
        { rating: 2400, level: 1 },
        { rating: 2499, level: 1 },
        { rating: 2500, level: 2 },
        { rating: 2599, level: 2 },
        { rating: 2600, level: 3 },
        { rating: 2699, level: 3 },
        { rating: 2700, level: 4 },
        { rating: 2799, level: 4 },
        { rating: 2800, level: 1 },
        { rating: 2899, level: 1 },
        { rating: 2900, level: 2 },
        { rating: 2999, level: 2 },
        { rating: 3000, level: 3 },
        { rating: 3099, level: 3 },
        { rating: 3100, level: 4 },
        { rating: 3199, level: 4 },
    ])("returns correct icon href for rating < 3200 (level 1-4) in DEV", ({ rating, level }) => {
        vi.stubEnv("PROD", false);
        expect(getRatingIconHref(rating)).toBe(
            `/resources/up_arrow_${level.toString()}.svg#up_arrow_${level.toString()}`,
        );
    });

    it("returns correct icon href for rating >= 3200 (level 4) in DEV", () => {
        vi.stubEnv("PROD", false);
        expect(getRatingIconHref(3200)).toBe("/resources/up_arrow_4.svg#up_arrow_4");
        expect(getRatingIconHref(4000)).toBe("/resources/up_arrow_4.svg#up_arrow_4");
        expect(getRatingIconHref(9999)).toBe("/resources/up_arrow_4.svg#up_arrow_4");
    });

    it.each([
        { rating: 0, level: 1 },
        { rating: 99, level: 1 },
        { rating: 100, level: 2 },
        { rating: 199, level: 2 },
        { rating: 200, level: 3 },
        { rating: 299, level: 3 },
        { rating: 300, level: 4 },
        { rating: 399, level: 4 },
        { rating: 400, level: 1 },
        { rating: 499, level: 1 },
        { rating: 500, level: 2 },
        { rating: 599, level: 2 },
        { rating: 600, level: 3 },
        { rating: 699, level: 3 },
        { rating: 700, level: 4 },
        { rating: 799, level: 4 },
        { rating: 800, level: 1 },
        { rating: 899, level: 1 },
        { rating: 900, level: 2 },
        { rating: 999, level: 2 },
        { rating: 1000, level: 3 },
        { rating: 1099, level: 3 },
        { rating: 1100, level: 4 },
        { rating: 1199, level: 4 },
        { rating: 1200, level: 1 },
        { rating: 1299, level: 1 },
        { rating: 1300, level: 2 },
        { rating: 1399, level: 2 },
        { rating: 1400, level: 3 },
        { rating: 1499, level: 3 },
        { rating: 1500, level: 4 },
        { rating: 1599, level: 4 },
        { rating: 1600, level: 1 },
        { rating: 1699, level: 1 },
        { rating: 1700, level: 2 },
        { rating: 1799, level: 2 },
        { rating: 1800, level: 3 },
        { rating: 1899, level: 3 },
        { rating: 1900, level: 4 },
        { rating: 1999, level: 4 },
        { rating: 2000, level: 1 },
        { rating: 2099, level: 1 },
        { rating: 2100, level: 2 },
        { rating: 2199, level: 2 },
        { rating: 2200, level: 3 },
        { rating: 2299, level: 3 },
        { rating: 2300, level: 4 },
        { rating: 2399, level: 4 },
        { rating: 2400, level: 1 },
        { rating: 2499, level: 1 },
        { rating: 2500, level: 2 },
        { rating: 2599, level: 2 },
        { rating: 2600, level: 3 },
        { rating: 2699, level: 3 },
        { rating: 2700, level: 4 },
        { rating: 2799, level: 4 },
        { rating: 2800, level: 1 },
        { rating: 2899, level: 1 },
        { rating: 2900, level: 2 },
        { rating: 2999, level: 2 },
        { rating: 3000, level: 3 },
        { rating: 3099, level: 3 },
        { rating: 3100, level: 4 },
        { rating: 3199, level: 4 },
    ])("returns correct icon href for rating < 3200 (level 1-4) in PROD", ({ rating, level }) => {
        vi.stubEnv("PROD", true);
        expect(getRatingIconHref(rating)).toBe(
            `/atcoder-difficulty/resources/up_arrow_${level.toString()}.svg#up_arrow_${level.toString()}`,
        );
    });

    it("returns correct icon href for rating >= 3200 (level 4) in PROD", () => {
        vi.stubEnv("PROD", true);
        expect(getRatingIconHref(3200)).toBe("/atcoder-difficulty/resources/up_arrow_4.svg#up_arrow_4");
        expect(getRatingIconHref(4000)).toBe("/atcoder-difficulty/resources/up_arrow_4.svg#up_arrow_4");
        expect(getRatingIconHref(9999)).toBe("/atcoder-difficulty/resources/up_arrow_4.svg#up_arrow_4");
    });
});
