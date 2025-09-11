import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../../../../vitest/render";
import { ProblemCellContainer } from "./ProblemCellContainer";
import { useProblemCell } from "./useProblemCell";
import { ProblemCell } from "./ProblemCell";

// src/features/problem/components/problemCell/ProblemCellContainer.test.tsx

// Mock ProblemCell and useProblemCell
const mockProps = {
    title: "Mock Problem",
    difficulty: 1234,
    url: "https://mockproblem.com",
    index: "A",
    parameters: { timeLimit: 2, memoryLimit: 256 },
    onOpenGraphClick: vi.fn(),
};

vi.mock("./useProblemCell", () => ({
    useProblemCell: vi.fn(),
}));

vi.mock("./ProblemCell", () => ({
    ProblemCell: vi.fn(() => <div data-testid="problem-cell" />),
}));

describe("ProblemCellContainer", () => {
    const problemId = "p123";
    const showsParameters = true;
    const showsProblemIndex = false;
    const showsOpenGraphButton = true;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useProblemCell as any).mockClear();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (ProblemCell as any).mockClear();
    });

    it("calls useProblemCell with correct arguments", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useProblemCell as any).mockReturnValue(mockProps);
        render(
            <ProblemCellContainer
                problemId={problemId}
                showsParameters={showsParameters}
                showsProblemIndex={showsProblemIndex}
                showsOpenGraphButton={showsOpenGraphButton}
            />,
        );
        expect(useProblemCell).toHaveBeenCalledWith(
            problemId,
            showsParameters,
            showsProblemIndex,
            showsOpenGraphButton,
        );
    });

    it("renders ProblemCell with props from hook", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useProblemCell as any).mockReturnValue(mockProps);
        render(
            <ProblemCellContainer
                problemId={problemId}
                showsParameters={showsParameters}
                showsProblemIndex={showsProblemIndex}
                showsOpenGraphButton={showsOpenGraphButton}
            />,
        );
        expect(ProblemCell).toHaveBeenCalledWith(mockProps, undefined);
    });

    it("matches snapshot", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useProblemCell as any).mockReturnValue(mockProps);
        const { container } = render(
            <ProblemCellContainer
                problemId={problemId}
                showsParameters={showsParameters}
                showsProblemIndex={showsProblemIndex}
                showsOpenGraphButton={showsOpenGraphButton}
            />,
        );
        expect(container).toMatchSnapshot();
    });
});
