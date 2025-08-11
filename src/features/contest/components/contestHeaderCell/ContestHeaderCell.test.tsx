import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ContestHeaderCell } from "./ContestHeaderCell";
import { render } from "../../../../vitest/render";

// ContestHeaderCell.test.tsx

// Mock react-i18next
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("ContestHeaderCell", () => {
    const defaultProps = {
        textColor: "text-red-500",
        displayName: "Sample Contest",
        linkHref: "https://example.com",
        onStatsButtonClick: vi.fn(),
        statsIconHref: "#icon-graph",
    };

    it("renders colored circle with correct class", () => {
        render(<ContestHeaderCell {...defaultProps} />);
        const circle = screen.getByText("◉");
        expect(circle).toHaveClass(defaultProps.textColor);
    });

    it("renders displayName as a link with correct href and attributes", () => {
        render(<ContestHeaderCell {...defaultProps} />);
        const link = screen.getByRole("link", { name: defaultProps.displayName });
        expect(link).toHaveAttribute("href", defaultProps.linkHref);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noreferrer");
        expect(link).toHaveClass("link-primary");
    });

    it("renders stats button and calls handler on click", () => {
        render(<ContestHeaderCell {...defaultProps} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(defaultProps.onStatsButtonClick).toHaveBeenCalled();
    });

    it("renders SVG with correct icon href and aria-label", () => {
        render(<ContestHeaderCell {...defaultProps} />);
        const svg = screen.getByRole("img", { name: "contestHeaderCell.showStatsButtonLabel" });
        expect(svg).toBeInTheDocument();
        const useElem = svg.querySelector("use");
        expect(useElem).toHaveAttribute("href", defaultProps.statsIconHref);
        expect(svg.querySelector("title")?.textContent).toBe("contestHeaderCell.showStatsButtonLabel");
    });

    it("matches snapshot", () => {
        const { container } = render(<ContestHeaderCell {...defaultProps} />);
        expect(container).toMatchSnapshot();
    });
});
