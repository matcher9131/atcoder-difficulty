import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { ProblemCell, type ProblemCellProps } from "./ProblemCell";
import { render } from "../../../../vitest/render";

// src/features/problem/components/problemCell/ProblemCell.test.tsx

// Mock useTranslation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const defaultProps: ProblemCellProps = {
    iconHref: "#icon-difficulty",
    fillColor: "fill-red-500",
    difficulty: "1234",
    solveProbability: "56%",
    displayName: "Sample Problem",
    textColor: "text-blue-700",
    linkHref: "https://atcoder.jp/problems/abc123_a",
    problemIndex: "A",
    graphIconHref: "#icon-graph",
    graphButtonIsEnabled: true,
    onGraphButtonClick: vi.fn(),
};

describe("ProblemCell", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders SVG icon with correct attributes", () => {
        render(<ProblemCell {...defaultProps} />);
        const svg = screen.getByRole("img", { name: "problemCell.difficultyIconLabel" });
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass("w-6", "h-4", defaultProps.fillColor);
        expect(svg.querySelector("use")).not.toBeNull();
        expect(svg.querySelector("use")).toHaveAttribute("href", defaultProps.iconHref);
    });

    it("renders difficulty and solveProbability when not empty", () => {
        render(<ProblemCell {...defaultProps} />);
        expect(screen.getByText(defaultProps.difficulty)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.solveProbability)).toBeInTheDocument();
    });

    it("renders displayName with problemIndex prefix", () => {
        render(<ProblemCell {...defaultProps} />);
        if (defaultProps.problemIndex == null) throw new Error("problemIndex is required");
        expect(screen.getByText(`${defaultProps.problemIndex} - ${defaultProps.displayName}`)).toBeInTheDocument();
    });

    it("renders displayName without problemIndex prefix", () => {
        render(<ProblemCell {...defaultProps} problemIndex={undefined} />);
        expect(screen.getByText(defaultProps.displayName)).toBeInTheDocument();
    });

    it("renders link with correct attributes and classes", () => {
        render(<ProblemCell {...defaultProps} />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", defaultProps.linkHref);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noreferrer");
        expect(link).toHaveClass(
            "w-full",
            "text-left",
            "truncate",
            defaultProps.textColor,
            "link",
            "link-hover",
            "hover:brightness-75",
        );
    });

    it("renders graph button when enabled", () => {
        render(<ProblemCell {...defaultProps} />);
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        const svg = button.querySelector("svg");
        expect(svg).toHaveAttribute("role", "img");
        expect(svg).toHaveAttribute("aria-label", "Show graph");
        expect(svg?.querySelector("use")).toHaveAttribute("href", defaultProps.graphIconHref);
        expect(svg?.querySelector("title")).not.toBeNull();
        expect(svg?.querySelector("title")?.textContent).toBe("problemCell.graphButtonIconTitle");
    });

    it("does not render graph button when disabled", () => {
        render(<ProblemCell {...defaultProps} graphButtonIsEnabled={false} />);
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("calls onGraphButtonClick when graph button is clicked", () => {
        render(<ProblemCell {...defaultProps} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(defaultProps.onGraphButtonClick).toHaveBeenCalledTimes(1);
    });

    it("sets tabIndex and accessibility attributes", () => {
        render(<ProblemCell {...defaultProps} />);
        const td = screen.getByRole("cell");
        expect(td).toHaveAttribute("tabIndex", "0");
    });

    it("matches snapshot", () => {
        const { container } = render(<ProblemCell {...defaultProps} />);
        expect(container).toMatchSnapshot();
    });
});
