import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { SolveProbabilityRow, type SolveProbabilityRowProps } from "./SolveProbabilityRow";
import { render } from "../../../../vitest/render";

// Mock useTranslation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const contestHeaderCell = <td data-testid="contest-header">Contest</td>;
const problemCell = <td data-testid="problem-cell">Problem</td>;

const defaultProps: SolveProbabilityRowProps = {
    contestHeaderCell,
    problemCell,
    difficulty: "1234",
    solveProbability: "56%",
    onGraphButtonClick: vi.fn(),
};

describe("SolveProbabilityRow", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all cells in correct order", () => {
        render(<SolveProbabilityRow {...defaultProps} />);
        const cells = screen.getAllByRole("cell");
        expect(cells[0]).toContainElement(screen.getByTestId("contest-header"));
        expect(cells[1]).toContainElement(screen.getByTestId("problem-cell"));
        expect(cells[2]).toHaveTextContent(defaultProps.difficulty);
        expect(cells[3]).toHaveTextContent(defaultProps.solveProbability);
        expect(cells[4].querySelector("button")).toBeInTheDocument();
    });

    it("renders difficulty and solveProbability", () => {
        render(<SolveProbabilityRow {...defaultProps} />);
        expect(screen.getByText(defaultProps.difficulty)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.solveProbability)).toBeInTheDocument();
    });

    it("renders contestHeaderCell and problemCell", () => {
        render(<SolveProbabilityRow {...defaultProps} />);
        expect(screen.getByTestId("contest-header")).toBeInTheDocument();
        expect(screen.getByTestId("problem-cell")).toBeInTheDocument();
    });

    it("renders button with correct label and class", () => {
        render(<SolveProbabilityRow {...defaultProps} />);
        const button = screen.getByRole("button");
        expect(button).toHaveTextContent("solveProbabilityTableContent.showGraphButtonLabel");
        expect(button).toHaveClass("btn");
    });

    it("calls onGraphButtonClick when button is clicked", () => {
        render(<SolveProbabilityRow {...defaultProps} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(defaultProps.onGraphButtonClick).toHaveBeenCalledTimes(1);
    });

    it("applies correct cell class names", () => {
        render(<SolveProbabilityRow {...defaultProps} />);
        const cells = screen.getAllByRole("cell");
        expect(cells[2]).toHaveClass("justify-end");
        expect(cells[3]).toHaveClass("justify-end");
        expect(cells[4]).toHaveClass("justify-center");
    });

    it("matches snapshot", () => {
        const { container } = render(<SolveProbabilityRow {...defaultProps} />);
        expect(container).toMatchSnapshot();
    });
});
