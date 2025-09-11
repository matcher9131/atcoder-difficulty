import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserLabel } from "./UserLabel";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: vi.fn(
            (key: string) =>
                ({
                    "userLabel.ratingLabel": "Rating",
                    "userLabel.numContestsLabel": "Contests",
                    "userLabel.rawRatingLabel": "Raw Rating",
                })[key] ?? key,
        ),
    }),
}));

describe("UserLabel", () => {
    const mockRawRatingWithIcon = <span data-testid="raw-rating-icon">Icon</span>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all labels and values correctly", () => {
        render(<UserLabel rating="1234" numContests="56" rawRatingWithIcon={mockRawRatingWithIcon} />);
        expect(screen.getByText("Rating: 1234")).toBeInTheDocument();
        expect(screen.getByText("Contests: 56")).toBeInTheDocument();
        expect(screen.getByText("Raw Rating:")).toBeInTheDocument();
        expect(screen.getByTestId("raw-rating-icon")).toBeInTheDocument();
    });

    it("shows '-' for null rating and numContests", () => {
        render(<UserLabel rating={null} numContests={null} rawRatingWithIcon={mockRawRatingWithIcon} />);
        expect(screen.getByText("Rating: -")).toBeInTheDocument();
        expect(screen.getByText("Contests: -")).toBeInTheDocument();
    });

    it("shows '-' for empty string rating and numContests", () => {
        render(<UserLabel rating="" numContests="" rawRatingWithIcon={mockRawRatingWithIcon} />);
        expect(screen.getByText("Rating:")).toBeInTheDocument();
        expect(screen.getByText("Contests:")).toBeInTheDocument();
    });
});
