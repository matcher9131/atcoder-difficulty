import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserLabel } from "./useUserLabel";
import { renderHook } from "../../../../vitest/renderHook";
import { render } from "@testing-library/react";

const { useAtomValueMock, RatingWithIconContainerMock } = vi.hoisted(() => {
    const RatingWithIconContainerMock = vi.fn(({ rating }: { rating: number | null }) => (
        <span data-testid="rating-icon">{rating ?? "-"}</span>
    ));
    const useAtomValueMockDefaultReturnValue: Record<string, unknown> = {
        ratingAtom: 1500,
        numContestsAtom: 1,
        rawRatingAtom: 300,
    };
    return {
        useAtomValueMock: vi.fn().mockImplementation((atom: string) => useAtomValueMockDefaultReturnValue[atom]),
        RatingWithIconContainerMock,
        useAtomValueMockDefaultReturnValue,
    };
});

vi.mock("../../../rating/components/ratingWithIcon", () => ({
    RatingWithIconContainer: RatingWithIconContainerMock,
}));
vi.mock("../../../rating/models/atom", () => ({
    numContestsAtom: "numContestsAtom",
    ratingAtom: "ratingAtom",
}));
vi.mock("../../../rating/models/getter", () => ({
    rawRatingAtom: "rawRatingAtom",
}));
vi.mock(import("jotai"), async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        useAtomValue: useAtomValueMock,
    };
});

describe("useUserLabel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns stringified values and icon when atoms return numbers", () => {
        const { result } = renderHook(() => useUserLabel());
        const { rating, numContests, rawRatingWithIcon } = result.current;
        const { getByTestId } = render(<>{rawRatingWithIcon}</>);

        expect(rating).toBe("1500");
        expect(numContests).toBe("1");
        expect(getByTestId("rating-icon")).toBeInTheDocument();
    });

    it("returns null and '-' when atoms return null", () => {
        const useAtomValueMockReturnValue: Record<string, unknown> = {
            numContestsAtom: null,
            ratingAtom: null,
            rawRatingAtom: null,
        };
        useAtomValueMock.mockImplementation((atom: string) => useAtomValueMockReturnValue[atom]);

        const { result } = renderHook(() => useUserLabel());
        const { rating, numContests, rawRatingWithIcon } = result.current;
        const { queryByTestId } = render(<>{rawRatingWithIcon}</>);

        expect(rating).toBeNull();
        expect(numContests).toBeNull();
        expect(queryByTestId("rating-icon")).not.toBeInTheDocument();
    });
});
