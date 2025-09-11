import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../../../../vitest/render";
import { ContestRowContainer } from "./ContestRowContainer";
import { useContestRow } from "./useContestRow";
import { ContestRow } from "./ContestRow";

// Mock useContestRow and ContestRow
const mockRowProps = {
    headerCell: <td data-testid="header-cell">Header</td>,
    problemCells: [
        <td key="1" data-testid="problem-cell-1">
            Problem 1
        </td>,
        <td key="2" data-testid="problem-cell-2">
            Problem 2
        </td>,
    ],
};

vi.mock("./useContestRow", () => ({
    useContestRow: vi.fn(),
}));

vi.mock("./ContestRow", () => ({
    ContestRow: vi.fn(() => <tr data-testid="contest-row" />),
}));

describe("ContestRowContainer", () => {
    const contestId = "abc123";
    const numProblems = 2;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useContestRow as any).mockClear();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (ContestRow as any).mockClear();
    });

    it("calls useContestRow with contestId and numProblems", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useContestRow as any).mockReturnValue(mockRowProps);
        render(<ContestRowContainer contestId={contestId} numProblems={numProblems} />);
        expect(useContestRow).toHaveBeenCalledWith(contestId, numProblems);
    });

    it("renders ContestRow with props from hook", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useContestRow as any).mockReturnValue(mockRowProps);
        render(<ContestRowContainer contestId={contestId} numProblems={numProblems} />);
        expect(ContestRow).toHaveBeenCalledWith(mockRowProps, undefined);
    });

    it("matches snapshot", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useContestRow as any).mockReturnValue(mockRowProps);
        const { container } = render(<ContestRowContainer contestId={contestId} numProblems={numProblems} />);
        expect(container).toMatchSnapshot();
    });
});
