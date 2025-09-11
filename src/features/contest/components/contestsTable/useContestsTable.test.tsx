import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, renderHook } from "@testing-library/react";
import { useContestsTable } from "./useContestsTable";
import { useAtom } from "jotai";
import React from "react";
import { getNumProblems, getGridColsClassName } from "../../functions/numProblems";
import { contestIdsByTypeAtom } from "../../models/getter";
import { paginationValueAtom } from "../../../pagination/model/paginations";
import { itemsPerPageAtom } from "../../../pagination/model/itemsPerPage";

vi.mock("jotai", () => ({
    useAtom: vi.fn(),
}));
vi.mock("../../models/getter", () => ({
    contestIdsByTypeAtom: vi.fn(),
}));
vi.mock("../../../pagination/model/paginations", () => ({
    paginationValueAtom: vi.fn(),
}));
vi.mock("../../../pagination/model/itemsPerPage", () => ({
    itemsPerPageAtom: vi.fn(),
}));
vi.mock("../../functions/numProblems", () => ({
    getNumProblems: vi.fn(),
    getGridColsClassName: vi.fn(),
}));
vi.mock("../contestRow", () => ({
    ContestRowContainer: vi.fn(
        ({ contestId, numProblems }: { readonly contestId: string; readonly numProblems: number }) => (
            <tr data-testid="contest-row" data-contestid={contestId} data-numproblems={numProblems} />
        ),
    ),
}));
vi.mock("../contestsTableHeader", () => ({
    ContestsTableHeader: vi.fn(({ numProblems }: { readonly numProblems: number }) => (
        <thead data-testid="table-header" data-numproblems={numProblems} />
    )),
}));

describe("useContestsTable", () => {
    const dummyContestType = "abc" as const;
    const dummyNumProblems = 4;
    const dummyGridColsClassName = "grid-cols-4";
    const dummyContestIds = ["c1", "c2", "c3", "c4", "c5"];
    const dummyPageIndex = 1;
    const dummyItemsPerPage = 2;

    beforeEach(() => {
        vi.clearAllMocks();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (getNumProblems as any).mockReturnValue(dummyNumProblems);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (getGridColsClassName as any).mockReturnValue(dummyGridColsClassName);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (contestIdsByTypeAtom as any).mockImplementation(() => [dummyContestIds]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (paginationValueAtom as any).mockImplementation(() => [dummyPageIndex]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (itemsPerPageAtom as any).mockImplementation(() => [dummyItemsPerPage]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useAtom as any).mockImplementation((value: unknown) => value);
    });

    it("returns correct props structure", () => {
        const { result } = renderHook(() => useContestsTable(dummyContestType));
        expect(result.current).toHaveProperty("contestsTableHeader");
        expect(result.current).toHaveProperty("gridColsClassName", dummyGridColsClassName);
        expect(result.current).toHaveProperty("contestRows");
        expect(Array.isArray(result.current.contestRows)).toBe(true);
    });

    it("renders ContestsTableHeader with correct numProblems", () => {
        const { result } = renderHook(() => useContestsTable(dummyContestType));
        const { contestsTableHeader } = result.current;
        const { getByTestId } = render(contestsTableHeader);
        expect(getByTestId("table-header")).toHaveAttribute("data-numproblems", String(dummyNumProblems));
    });

    it("renders ContestRowContainer for paginated contestIds", () => {
        // pageIndex=1, itemsPerPage=2 => slice(2,4) => ["c3","c4"]
        const { result } = renderHook(() => useContestsTable(dummyContestType));
        const { contestRows } = result.current;
        const { getAllByTestId } = render(<>{contestRows.map((cell, i) => React.cloneElement(cell, { key: i }))}</>);
        const rows = getAllByTestId("contest-row");
        expect(rows).toHaveLength(2);
        expect(rows[0].getAttribute("data-contestid")).toBe("c3");
        expect(rows[1].getAttribute("data-contestid")).toBe("c4");
    });

    it("returns empty contestRows if contestIds is empty", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (contestIdsByTypeAtom as any).mockImplementation(() => [[]]);
        const { result } = renderHook(() => useContestsTable(dummyContestType));
        expect(result.current.contestRows).toHaveLength(0);
    });

    it("matches snapshot", () => {
        const { result } = renderHook(() => useContestsTable(dummyContestType));
        expect(result).toMatchSnapshot();
    });
});
