import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useContestHeaderCell } from "./useContestHeaderCell";
import { useAtom } from "jotai";
import { contestMaxRatingAtom } from "../../dict/contests";
import { getTextColor } from "../../functions/textColor";
import { useOpenModalDialog } from "../../../dialog/hooks/useOpenModalDialog";

// src/features/contest/components/contestHeaderCell/useContestHeaderCell.test.ts

// Mocks
vi.mock("jotai", () => ({
    useAtom: vi.fn(),
}));
vi.mock("../../dict/contests", () => ({
    contestMaxRatingAtom: vi.fn(),
}));
vi.mock("../../functions/textColor", () => ({
    getTextColor: vi.fn(),
}));
vi.mock("../../../contestStats/models/selectedContest", () => ({
    selectedContestAtom: "selectedContestAtom",
}));
vi.mock("../../../dialog/hooks/useOpenModalDialog", () => ({
    useOpenModalDialog: vi.fn(),
}));

describe("useContestHeaderCell", () => {
    const contestId = "abc123";
    const maxRating = 2000;
    const textColor = "text-red-500";
    const setSelectedContest = vi.fn();
    const openDialog = vi.fn(() => Promise.resolve());

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (contestMaxRatingAtom as any).mockImplementation((id: string) => `atom-${id}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useAtom as any).mockImplementation((atom: any) => {
            if (atom === `atom-${contestId}`) return [maxRating];
            if (atom === "selectedContestAtom") return [null, setSelectedContest];
            return [undefined];
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (getTextColor as any).mockReturnValue(textColor);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useOpenModalDialog as any).mockReturnValue({ openDialog });
        setSelectedContest.mockClear();
        openDialog.mockClear();
    });

    afterEach(() => {
        vi.resetModules();
        vi.unstubAllEnvs();
    });

    it("returns correct props", () => {
        const { result } = renderHook(() => useContestHeaderCell(contestId));
        expect(result.current.textColor).toBe(textColor);
        expect(result.current.displayName).toBe(contestId.toUpperCase());
        expect(result.current.linkHref).toBe(`https://atcoder.jp/contests/${contestId}`);
        expect(typeof result.current.onStatsButtonClick).toBe("function");
        expect(result.current.statsIconHref).toContain("/resources/chart.svg#chart");
    });

    it("calls setSelectedContest and openDialog on stats button click", () => {
        const { result } = renderHook(() => useContestHeaderCell(contestId));
        act(() => {
            result.current.onStatsButtonClick();
        });
        expect(setSelectedContest).toHaveBeenCalledWith(contestId);
        expect(openDialog).toHaveBeenCalled();
    });

    it("handles openDialog rejection gracefully", async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useOpenModalDialog as any).mockReturnValue({ openDialog: vi.fn(() => Promise.reject(new Error())) });
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
        const { result } = renderHook(() => useContestHeaderCell(contestId));
        act(() => {
            result.current.onStatsButtonClick();
        });
        await waitFor(() => {
            expect(consoleError).toHaveBeenCalled();
        });
        consoleError.mockRestore();
    });

    it("returns correct statsIconHref in PROD", () => {
        vi.stubEnv("PROD", true);
        const { result } = renderHook(() => useContestHeaderCell(contestId));
        expect(result.current.statsIconHref.startsWith("/atcoder-difficulty")).toBe(true);
    });

    it("returns correct statsIconHref in non-PROD", () => {
        vi.stubEnv("PROD", false);
        const { result } = renderHook(() => useContestHeaderCell(contestId));
        expect(result.current.statsIconHref.startsWith("/resources")).toBe(true);
    });

    it("passes correct maxRating to getTextColor", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (getTextColor as any).mockClear();
        renderHook(() => useContestHeaderCell(contestId));
        expect(getTextColor).toHaveBeenCalledWith(maxRating);
    });

    it("displayName is always uppercase", () => {
        const { result } = renderHook(() => useContestHeaderCell("abcDef"));
        expect(result.current.displayName).toBe("ABCDEF");
    });
});
