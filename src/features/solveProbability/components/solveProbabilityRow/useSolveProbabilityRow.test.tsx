import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useSolveProbabilityRow } from "./useSolveProbabilityRow";
import { renderHook } from "../../../../vitest/renderHook";
import { render } from "../../../../vitest/render";
import type { ProblemSolveProbability } from "../../types/problemSolveProbability";
import { act, waitFor } from "@testing-library/react";

// Mocks
const {
    mockSplitProblemId,
    mockToPercent,
    mockUseAtom,
    mockUseOpenModalDialog,
    mockContestHeaderCellContainer,
    mockProblemCellContainer,
} = vi.hoisted(() => {
    return {
        mockSplitProblemId: vi.fn(),
        mockToPercent: vi.fn(() => "75.0%"),
        mockUseAtom: vi.fn(),
        mockUseOpenModalDialog: vi.fn(),
        mockContestHeaderCellContainer: vi.fn(() => <div data-testid="contest-header-cell-container" />),
        mockProblemCellContainer: vi.fn(() => <div data-testid="problem-cell-container" />),
    };
});

vi.mock(import("jotai"), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useAtom: mockUseAtom,
    };
});
vi.mock("../../../contest/components/contestHeaderCell", () => ({
    ContestHeaderCellContainer: mockContestHeaderCellContainer,
}));
vi.mock("../../../problem/components/problemCell", () => ({
    ProblemCellContainer: mockProblemCellContainer,
}));
vi.mock("../../../problem/functions/split", () => ({
    splitProblemId: mockSplitProblemId,
}));
vi.mock("../../functions/toPercent", () => ({
    toPercent: mockToPercent,
}));
vi.mock("../../../distribution/models/selectedProblem", () => ({
    selectedProblemAtom: "selectedProblemAtom",
}));
vi.mock("../../../dialog/hooks/useOpenModalDialog", () => ({
    useOpenModalDialog: mockUseOpenModalDialog,
}));

describe("useSolveProbabilityRow", () => {
    const problemId = "contest123/problemA";
    const splitIds = ["contest123", "problemA"];
    const sampleProblem: ProblemSolveProbability = {
        id: problemId,
        n: "Sample Problem",
        d: [1, 1500],
        solveProbability: 0.75,
    };

    const setSelectedProblem = vi.fn();
    const openDialog = vi.fn(() => Promise.resolve());

    beforeEach(() => {
        mockUseAtom.mockImplementation((atom: unknown) => {
            if (atom === "selectedProblemAtom") {
                return [null, setSelectedProblem];
            }
        });
        mockSplitProblemId.mockReturnValue(splitIds);
        mockUseOpenModalDialog.mockReturnValue({ openDialog });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("returns correct header cell and problem cell", () => {
        const { result } = renderHook(() => useSolveProbabilityRow(sampleProblem));
        const { contestHeaderCell, problemCell } = result.current;
        const { getByTestId } = render(
            <>
                {contestHeaderCell}
                {problemCell}
            </>,
        );
        expect(getByTestId("contest-header-cell-container")).toBeInTheDocument();
        expect(getByTestId("problem-cell-container")).toBeInTheDocument();
    });

    it("returns correct difficulty if problem.d is not null", () => {
        const { result } = renderHook(() => useSolveProbabilityRow(sampleProblem));
        const { difficulty } = result.current;
        expect(difficulty).toBe("1500");
    });

    it("returns 'NaN' difficulty if problem.d is null", () => {
        const problemWithNullDifficulty: ProblemSolveProbability = { ...sampleProblem, d: null };
        const { result } = renderHook(() => useSolveProbabilityRow(problemWithNullDifficulty));
        const { difficulty } = result.current;
        expect(difficulty).toBe("NaN");
    });

    it("returns correct solve probability", () => {
        const { result } = renderHook(() => useSolveProbabilityRow(sampleProblem));
        const { solveProbability } = result.current;
        expect(solveProbability).toBe("75.0%");
    });

    it("calls setSelectedProblem and openDialog on graph button click", () => {
        const { result } = renderHook(() => useSolveProbabilityRow(sampleProblem));

        act(() => {
            result.current.onGraphButtonClick();
        });

        expect(setSelectedProblem).toHaveBeenCalledWith(problemId);
        expect(openDialog).toHaveBeenCalled();
    });

    it("handles openDialog rejection gracefully", async () => {
        mockUseOpenModalDialog.mockReturnValue({
            openDialog: vi.fn(() => Promise.reject(new Error("Dialog error"))),
        });
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

        const { result } = renderHook(() => useSolveProbabilityRow(sampleProblem));

        act(() => {
            result.current.onGraphButtonClick();
        });

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalled();
        });
        consoleError.mockRestore();
    });
});
