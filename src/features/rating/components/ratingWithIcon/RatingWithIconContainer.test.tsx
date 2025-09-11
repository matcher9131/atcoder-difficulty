import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { RatingWithIconContainer } from "./RatingWithIconContainer";

const { mockRatingWithIcon, mockUseRatingWithIcon } = vi.hoisted(() => ({
    mockRatingWithIcon: vi.fn(() => <div data-testid="rating-with-icon-mock" />),
    mockUseRatingWithIcon: vi.fn(),
}));

vi.mock("./useRatingWithIcon", () => ({
    useRatingWithIcon: mockUseRatingWithIcon,
}));

vi.mock("./RatingWithIcon", () => ({
    RatingWithIcon: mockRatingWithIcon,
}));

describe("RatingWithIconContainer", () => {
    const defaultHookResult = {
        iconHref: "#mock-icon",
        iconFillColor: "fill-mock",
        textColor: "text-mock",
        rating: 0,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRatingWithIcon.mockReturnValue(defaultHookResult);
    });

    it("calls useRatingWithIcon with the provided rating", () => {
        render(<RatingWithIconContainer rating={1234} />);
        expect(mockUseRatingWithIcon).toHaveBeenCalledWith(1234);
    });

    it("passes hook result props to RatingWithIcon", () => {
        mockUseRatingWithIcon.mockReturnValueOnce({
            iconHref: "#star",
            iconFillColor: "fill-yellow",
            textColor: "text-red",
            rating: 5678,
        });
        render(<RatingWithIconContainer rating={5678} />);
        expect(mockRatingWithIcon).toHaveBeenCalledWith(
            {
                iconHref: "#star",
                iconFillColor: "fill-yellow",
                textColor: "text-red",
                rating: 5678,
            },
            undefined,
        );
    });

    it("renders RatingWithIcon", () => {
        render(<RatingWithIconContainer rating={42} />);
        expect(mockRatingWithIcon).toHaveBeenCalled();
    });

    it("handles zero rating", () => {
        mockUseRatingWithIcon.mockReturnValueOnce({
            ...defaultHookResult,
            rating: 0,
        });
        render(<RatingWithIconContainer rating={0} />);
        expect(mockUseRatingWithIcon).toHaveBeenCalledWith(0);
        expect(mockRatingWithIcon).toHaveBeenCalledWith(expect.objectContaining({ rating: 0 }), undefined);
    });

    it("handles negative rating", () => {
        mockUseRatingWithIcon.mockReturnValueOnce({
            ...defaultHookResult,
            rating: -100,
        });
        render(<RatingWithIconContainer rating={-100} />);
        expect(mockUseRatingWithIcon).toHaveBeenCalledWith(-100);
        expect(mockRatingWithIcon).toHaveBeenCalledWith(expect.objectContaining({ rating: -100 }), undefined);
    });

    it("handles large rating", () => {
        mockUseRatingWithIcon.mockReturnValueOnce({
            ...defaultHookResult,
            rating: 99999,
        });
        render(<RatingWithIconContainer rating={99999} />);
        expect(mockUseRatingWithIcon).toHaveBeenCalledWith(99999);
        expect(mockRatingWithIcon).toHaveBeenCalledWith(expect.objectContaining({ rating: 99999 }), undefined);
    });
});
