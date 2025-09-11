import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../../../../vitest/render";
import { screen } from "@testing-library/react";
import { SolveProbabilityRow } from "./SolveProbabilityRow";
import { SolveProbabilityRowContainer } from "./SolveProbabilityRowContainer";
import { useSolveProbabilityRow } from "./useSolveProbabilityRow";

const mockProps = {
    contestHeaderCell: <td data-testid="contest-header">Contest</td>,
    problemCell: <td data-testid="problem-cell">Problem</td>,
    difficulty: "1234",
    solveProbability: "56%",
    onGraphButtonClick: vi.fn(),
};

vi.mock("./useSolveProbabilityRow", () => ({
    useSolveProbabilityRow: vi.fn(),
}));
vi.mock("./SolveProbabilityRow", () => ({
    SolveProbabilityRow: vi.fn(() => <tr data-testid="mock-row" />),
}));

describe("SolveProbabilityRowContainer", () => {
    const sampleProblem = {
        id: "abc",
        n: "Sample Problem",
        d: [1, 100] as [number, number],
        solveProbability: 0.56,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useSolveProbabilityRow as ReturnType<typeof vi.fn>).mockReturnValue(mockProps);
    });

    it("calls useSolveProbabilityRow with the correct problem", () => {
        render(<SolveProbabilityRowContainer problem={sampleProblem} />);
        expect(useSolveProbabilityRow).toHaveBeenCalledWith(sampleProblem);
    });

    it("renders SolveProbabilityRow with props from hook", () => {
        render(<SolveProbabilityRowContainer problem={sampleProblem} />);
        expect(SolveProbabilityRow).toHaveBeenCalledWith(expect.objectContaining(mockProps), undefined);
        expect(screen.getByTestId("mock-row")).toBeInTheDocument();
    });

    it("matches snapshot", () => {
        const { container } = render(<SolveProbabilityRowContainer problem={sampleProblem} />);
        expect(container).toMatchSnapshot();
    });
});
