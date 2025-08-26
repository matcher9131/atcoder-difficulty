import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RatingWithIcon, { type RatingWithIconProps } from "./RatingWithIcon";

// src/features/rating/components/ratingWithIcon/RatingWithIcon.test.tsx

// Mock useTranslation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => (key === "ratingWithIcon.iconLabel" ? "Icon Label" : key),
    }),
}));

describe("RatingWithIcon", () => {
    const defaultProps: RatingWithIconProps = {
        iconHref: "#star-icon",
        iconFillColor: "fill-yellow-400",
        textColor: "text-red-500",
        rating: 1234,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders SVG icon with correct href and fill color", () => {
        render(<RatingWithIcon {...defaultProps} />);
        const svg = screen.getByRole("img");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("aria-label", "Icon Label");
        expect(svg).toHaveClass("w-6", "h-4", "fill-yellow-400", "inline");
        const useElem = svg.querySelector("use");
        expect(useElem).not.toBeNull();
        expect(useElem).toHaveAttribute("href", "#star-icon");
    });

    it("renders rating value with correct text and color", () => {
        render(<RatingWithIcon {...defaultProps} />);
        const ratingDiv = screen.getByText("1234");
        expect(ratingDiv).toBeInTheDocument();
        expect(ratingDiv).toHaveClass("text-red-500");
    });

    it("renders both icon and rating together", () => {
        render(<RatingWithIcon {...defaultProps} />);
        expect(screen.getByRole("img")).toBeInTheDocument();
        expect(screen.getByText("1234")).toBeInTheDocument();
    });

    it("uses translation for aria-label", () => {
        render(<RatingWithIcon {...defaultProps} />);
        const svg = screen.getByRole("img");
        expect(svg).toHaveAttribute("aria-label", "Icon Label");
    });

    it("applies custom iconHref and color props", () => {
        const props: RatingWithIconProps = {
            iconHref: "#custom-icon",
            iconFillColor: "fill-blue-500",
            textColor: "text-green-700",
            rating: 42,
        };
        render(<RatingWithIcon {...props} />);
        const svg = screen.getByRole("img");
        expect(svg).toHaveClass("fill-blue-500");
        const useElem = svg.querySelector("use");
        expect(useElem).toHaveAttribute("href", "#custom-icon");
        const ratingDiv = screen.getByText("42");
        expect(ratingDiv).toHaveClass("text-green-700");
    });

    it("renders zero rating", () => {
        render(<RatingWithIcon {...defaultProps} rating={0} />);
        expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("renders large rating", () => {
        render(<RatingWithIcon {...defaultProps} rating={99999} />);
        expect(screen.getByText("99999")).toBeInTheDocument();
    });
});
