import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProblemCell } from "./useProblemCell";
import { useAtom } from "jotai";
import { problemWithSolveProbabilityAtom } from "../../../solveProbability/models/solveProbabilities";
import { getFillColor, getTextColor } from "../../../rating/functions/color";
import { useOpenModalDialog } from "../../../dialog/hooks/useOpenModalDialog";
import { splitProblemId } from "../../functions/split";
import { toPercent } from "../../functions/toPercent";
import { getProblemIndex } from "../../functions/problemIndex";

// Mocks
vi.mock("jotai", () => ({
    useAtom: vi.fn(),
}));
vi.mock("../../../solveProbability/models/solveProbabilities", () => ({
    problemWithSolveProbabilityAtom: vi.fn(),
}));
vi.mock("../../../rating/functions/color", () => ({
    getFillColor: vi.fn(),
    getTextColor: vi.fn(),
}));
vi.mock("../../../distribution/models/selectedProblem", () => ({
    selectedProblemAtom: "selectedProblemAtom",
}));
vi.mock("../../../dialog/hooks/useOpenModalDialog", () => ({
    useOpenModalDialog: vi.fn(),
}));
vi.mock("../../functions/split", () => ({
    splitProblemId: vi.fn(),
}));
vi.mock("../../functions/toPercent", () => ({
    toPercent: vi.fn(),
}));
vi.mock("../../functions/problemIndex", () => ({
    getProblemIndex: vi.fn(),
}));

describe("useProblemCell", () => {
    const problemId = "abc123_a";
    const mockProblem = {
        n: "Test Problem",
        d: [null, 1500],
        solveProbability: 0.75,
    };
    const setSelectedProblem = vi.fn();
    const openDialog = vi.fn(() => Promise.resolve());

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (problemWithSolveProbabilityAtom as any).mockImplementation(() => `atom-${problemId}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useAtom as any).mockImplementation((atom: any) => {
            if (atom === `atom-${problemId}`) return [mockProblem];
            if (atom === "selectedProblemAtom") return [null, setSelectedProblem];
            return [undefined];
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (getFillColor as any).mockReturnValue("fill-blue-500");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (getTextColor as any).mockReturnValue("text-blue-500");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (splitProblemId as any).mockReturnValue(["abc123", "abc123_a"]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (toPercent as any).mockReturnValue("75%");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (getProblemIndex as any).mockReturnValue("A");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useOpenModalDialog as any).mockReturnValue({ openDialog });

        setSelectedProblem.mockClear();
        openDialog.mockClear();
    });

    afterEach(() => {
        vi.resetModules();
        vi.unstubAllEnvs();
    });

    it("throws error when problem is null", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useAtom as any).mockImplementation((atom: any) => {
            if (atom === `atom-${problemId}`) return [null];
            if (atom === "selectedProblemAtom") return [null, setSelectedProblem];
            return [undefined];
        });

        expect(() => {
            renderHook(() => useProblemCell(problemId, true, true, true));
        }).toThrow(`Invalid problemId = ${problemId}`);
    });

    it("returns correct props with all features enabled", () => {
        const { result } = renderHook(() => useProblemCell(problemId, true, true, true));

        expect(result.current.fillColor).toBe("fill-blue-500");
        expect(result.current.textColor).toBe("text-blue-500");
        expect(result.current.displayName).toBe("Test Problem");
        expect(result.current.difficulty).toBe("1500");
        expect(result.current.solveProbability).toBe("75%");
        expect(result.current.problemIndex).toBe("A");
        expect(result.current.linkHref).toBe("https://atcoder.jp/contests/abc123/tasks/abc123_a");
        expect(result.current.graphButtonIsEnabled).toBe(true);
        expect(typeof result.current.onGraphButtonClick).toBe("function");
    });

    it("hides parameters when showsParameters is false", () => {
        const { result } = renderHook(() => useProblemCell(problemId, false, false, false));

        expect(result.current.difficulty).toBe("");
        expect(result.current.solveProbability).toBe("");
        expect(result.current.problemIndex).toBeUndefined();
        expect(result.current.graphButtonIsEnabled).toBe(false);
    });

    it("handles null difficulty correctly", () => {
        const problemWithoutDifficulty = {
            ...mockProblem,
            d: null,
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useAtom as any).mockImplementation((atom: any) => {
            if (atom === `atom-${problemId}`) return [problemWithoutDifficulty];
            if (atom === "selectedProblemAtom") return [null, setSelectedProblem];
            return [undefined];
        });

        const { result } = renderHook(() => useProblemCell(problemId, true, false, false));

        expect(result.current.fillColor).toBe("");
        expect(result.current.textColor).toBe("");
        expect(result.current.difficulty).toBe("NaN");
        expect(result.current.iconHref).toContain("up_arrow_0.svg");
    });

    it("calculates correct level for different difficulties", () => {
        const testCases = [
            { difficulty: 400, expectedLevel: 1 },
            { difficulty: 900, expectedLevel: 2 },
            { difficulty: 1400, expectedLevel: 3 },
            { difficulty: 1900, expectedLevel: 4 },
            { difficulty: 3200, expectedLevel: 4 },
            { difficulty: 3300, expectedLevel: 4 },
        ];

        testCases.forEach(({ difficulty, expectedLevel }) => {
            const problemWithDifficulty = {
                ...mockProblem,
                d: [null, difficulty],
            };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            (useAtom as any).mockImplementation((atom: any) => {
                if (atom === `atom-${problemId}`) return [problemWithDifficulty];
                if (atom === "selectedProblemAtom") return [null, setSelectedProblem];
                return [undefined];
            });

            const { result } = renderHook(() => useProblemCell(problemId, true, false, false));
            expect(result.current.iconHref).toContain(`up_arrow_${expectedLevel.toString()}.svg`);
        });
    });

    it("returns correct iconHref in PROD environment", () => {
        vi.stubEnv("PROD", true);
        const { result } = renderHook(() => useProblemCell(problemId, false, false, false));
        expect(result.current.iconHref.startsWith("/atcoder-difficulty")).toBe(true);
        expect(result.current.graphIconHref.startsWith("/atcoder-difficulty")).toBe(true);
    });

    it("returns correct iconHref in non-PROD environment", () => {
        vi.stubEnv("PROD", false);
        const { result } = renderHook(() => useProblemCell(problemId, false, false, false));
        expect(result.current.iconHref.startsWith("/resources")).toBe(true);
        expect(result.current.graphIconHref.startsWith("/resources")).toBe(true);
    });

    it("calls setSelectedProblem and openDialog on graph button click", () => {
        const { result } = renderHook(() => useProblemCell(problemId, false, false, true));

        act(() => {
            result.current.onGraphButtonClick();
        });

        expect(setSelectedProblem).toHaveBeenCalledWith(problemId);
        expect(openDialog).toHaveBeenCalled();
    });

    it("handles openDialog rejection gracefully", async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useOpenModalDialog as any).mockReturnValue({
            openDialog: vi.fn(() => Promise.reject(new Error("Dialog error"))),
        });
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

        const { result } = renderHook(() => useProblemCell(problemId, false, false, true));

        act(() => {
            result.current.onGraphButtonClick();
        });

        // Wait for promise rejection to be handled
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it("calls utility functions with correct parameters", () => {
        renderHook(() => useProblemCell(problemId, true, true, true));

        expect(getFillColor).toHaveBeenCalledWith(1500);
        expect(getTextColor).toHaveBeenCalledWith(1500);
        expect(splitProblemId).toHaveBeenCalledWith(problemId);
        expect(toPercent).toHaveBeenCalledWith(0.75);
        expect(getProblemIndex).toHaveBeenCalledWith(problemId);
        expect(useOpenModalDialog).toHaveBeenCalledWith("distribution");
    });

    it("includes problemIndex when showsProblemIndex is true", () => {
        const { result } = renderHook(() => useProblemCell(problemId, false, true, false));
        expect(result.current.problemIndex).toBe("A");
    });

    it("excludes problemIndex when showsProblemIndex is false", () => {
        const { result } = renderHook(() => useProblemCell(problemId, false, false, false));
        expect(result.current.problemIndex).toBeUndefined();
    });
});
