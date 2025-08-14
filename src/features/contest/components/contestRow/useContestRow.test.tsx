import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, renderHook } from "@testing-library/react";
import React from "react";
import { useContestRow } from "./useContestRow";
import { useAtom } from "jotai";

// Mocks
vi.mock("jotai", () => ({
    useAtom: vi.fn(),
}));
vi.mock("../contestHeaderCell", () => ({
    ContestHeaderCellContainer: ({ contestId }: { contestId: string }) => (
        <div data-testid="header-cell">{contestId}</div>
    ),
}));
vi.mock("../../../problem/models/getter", () => ({
    contestProblemIdsAtom: (contestId: string) => contestId,
}));
vi.mock("../../../problem/components/problemCell", () => ({
    ProblemCellContainer: ({ problemId }: { problemId: string }) => <div data-testid="problem-cell">{problemId}</div>,
}));
vi.mock("../../../problem/components/blankProblemCell", () => ({
    BlankProblemCell: () => <div data-testid="problem-cell">blank</div>,
}));
vi.mock("../../../../utils/array", () => ({
    range: (start: number, end: number) => Array.from({ length: end - start }, (_, i) => i + start),
}));

describe("useContestRow", () => {
    const mockUseAtom = useAtom as unknown as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns correct headerCell and problemCells when all problems exist", () => {
        mockUseAtom.mockReturnValue([["p1", "p2", "p3"]]);

        const { result } = renderHook(() => useContestRow("abc123", 3));
        const { headerCell, problemCells } = result.current;

        const { getAllByTestId } = render(
            <>
                {headerCell}
                {problemCells.map((cell, i) => React.cloneElement(cell, { key: i }))}
            </>,
        );
        const renderedHeaderCell = getAllByTestId("header-cell")[0];
        expect(renderedHeaderCell.textContent).toBe("abc123");
        const cells = getAllByTestId("problem-cell");
        expect(cells).toHaveLength(3);
        expect(cells[0].textContent).toBe("p1");
        expect(cells[1].textContent).toBe("p2");
        expect(cells[2].textContent).toBe("p3");
    });

    it("returns blank cells if numProblems > problemIds.length", () => {
        mockUseAtom.mockReturnValue([["p1"]]);

        const { result } = renderHook(() => useContestRow("abc123", 3));
        const { problemCells } = result.current;

        const { getAllByTestId } = render(<>{problemCells.map((cell, i) => React.cloneElement(cell, { key: i }))}</>);
        const cells = getAllByTestId("problem-cell");
        expect(cells).toHaveLength(3);
        expect(cells[0].textContent).toBe("p1");
        expect(cells[1].textContent).toBe("blank");
        expect(cells[2].textContent).toBe("blank");
    });

    it("returns no cells if numProblems is zero", () => {
        mockUseAtom.mockReturnValue([["p1", "p2"]]);

        const { result } = renderHook(() => useContestRow("abc123", 0));
        const { problemCells } = result.current;
        expect(problemCells).toHaveLength(0);
    });
});
