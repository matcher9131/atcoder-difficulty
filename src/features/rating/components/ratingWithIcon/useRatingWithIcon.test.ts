import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRatingWithIcon } from "./useRatingWithIcon";
import { getFillColor, getTextColor } from "../../functions/color";
import { getRatingIconHref } from "../../functions/icon";

const { getFillColorMock, getTextColorMock, getRatingIconHrefMock } = vi.hoisted(() => ({
    getFillColorMock: vi.fn(),
    getTextColorMock: vi.fn(),
    getRatingIconHrefMock: vi.fn(),
}));

vi.mock("../../functions/color", () => ({
    getFillColor: getFillColorMock,
    getTextColor: getTextColorMock,
}));
vi.mock("../../functions/icon", () => ({
    getRatingIconHref: getRatingIconHrefMock,
}));

describe("useRatingWithIcon", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getFillColorMock.mockImplementation((rating: number) => `fill-${rating.toString()}`);
        getTextColorMock.mockImplementation((rating: number) => `text-${rating.toString()}`);
        getRatingIconHrefMock.mockImplementation((rating: number) => `icon-${rating.toString()}`);
    });

    it("returns correct props for a given rating", () => {
        const rating = 1200;
        const result = useRatingWithIcon(rating);
        expect(result).toEqual({
            iconHref: "icon-1200",
            iconFillColor: "fill-1200",
            textColor: "text-1200",
            rating: 1200,
        });
    });

    it("calls dependency functions with the correct rating", () => {
        const rating = 1500;
        useRatingWithIcon(rating);
        expect(getFillColor).toHaveBeenCalledWith(rating);
        expect(getTextColor).toHaveBeenCalledWith(rating);
        expect(getRatingIconHref).toHaveBeenCalledWith(rating);
    });

    it("handles zero rating", () => {
        const rating = 0;
        const result = useRatingWithIcon(rating);
        expect(result.iconHref).toBe("icon-0");
        expect(result.iconFillColor).toBe("fill-0");
        expect(result.textColor).toBe("text-0");
        expect(result.rating).toBe(0);
    });

    it("handles very high rating", () => {
        const rating = 9999;
        const result = useRatingWithIcon(rating);
        expect(result.iconHref).toBe("icon-9999");
        expect(result.iconFillColor).toBe("fill-9999");
        expect(result.textColor).toBe("text-9999");
        expect(result.rating).toBe(9999);
    });
});
