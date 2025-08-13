import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../../../vitest/render";
import { ContestsTableHeader } from "./ContestsTableHeader";

// src/features/contest/components/contestsTableHeader/ContestsTableHeader.test.tsx

// Mock translation hook
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === "contestsTableHeader.contestLabel") return "Contest";
            if (key === "contestsTableHeader.problemLabel") return "Problem";
            return key;
        },
    }),
}));

// Mock headerCellClassNames
vi.mock("../../../../common/headerCellClassNames", () => ({
    headerCellClassNames: "mock-header-cell-class",
}));

describe("ContestsTableHeader", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders thead with correct class", () => {
        render(<ContestsTableHeader numProblems={3} />);
        const thead = screen.getByRole("rowgroup");
        expect(thead.tagName).toBe("THEAD");
        expect(thead.className).toContain("contents");
    });

    it("renders contest label in first header cell", () => {
        render(<ContestsTableHeader numProblems={2} />);
        const headerCells = screen.getAllByRole("columnheader");
        expect(headerCells[0]).toHaveTextContent("Contest");
    });

    it("renders correct number of problem header cells", () => {
        render(<ContestsTableHeader numProblems={4} />);
        const headerCells = screen.getAllByRole("columnheader");
        // 1 contest label + numProblems
        expect(headerCells).toHaveLength(5);
        for (let i = 1; i <= 4; i++) {
            expect(headerCells[i]).toHaveTextContent(`Problem${i.toString()}`);
        }
    });

    it("applies headerCellClassNames to all header cells", () => {
        render(<ContestsTableHeader numProblems={2} />);
        const headerCells = screen.getAllByRole("columnheader");
        headerCells.forEach((cell) => {
            expect(cell.className).toContain("mock-header-cell-class");
        });
    });

    it("matches snapshot", () => {
        const { container } = render(<ContestsTableHeader numProblems={2} />);
        expect(container).toMatchSnapshot();
    });
});
