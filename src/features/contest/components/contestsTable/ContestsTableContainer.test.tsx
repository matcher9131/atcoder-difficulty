import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../../../vitest/render";
import { ContestsTableContainer } from "./ContestsTableContainer";
import { useContestsTable } from "./useContestsTable";
import { ContestsTable } from "./ContestsTable";

// src/features/contest/components/contestsTable/ContestsTableContainer.test.tsx

// Mock useContestsTable
vi.mock("./useContestsTable", () => ({
    useContestsTable: vi.fn(),
}));

// Mock ContestsTable
vi.mock("./ContestsTable", () => ({
    ContestsTable: vi.fn(() => <div data-testid="contests-table-mock" />),
}));

describe("ContestsTableContainer", () => {
    const dummyContestType = "abc" as any;

    const mockProps = {
        contestsTableHeader: (
            <thead>
                <tr>
                    <th>Header</th>
                </tr>
            </thead>
        ),
        gridColsClassName: "grid-cols-2",
        contestRows: [
            <tr key="1">
                <td>Row 1</td>
            </tr>,
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls useContestsTable with contestType", () => {
        (useContestsTable as any).mockReturnValue(mockProps);
        render(<ContestsTableContainer contestType={dummyContestType} />);
        expect(useContestsTable).toHaveBeenCalledWith(dummyContestType);
    });

    it("renders ContestsTable with props from useContestsTable", () => {
        (useContestsTable as any).mockReturnValue(mockProps);
        render(<ContestsTableContainer contestType={dummyContestType} />);
        expect(screen.getByTestId("contests-table-mock")).toBeInTheDocument();
        expect(ContestsTable).toHaveBeenCalledWith(mockProps, undefined);
    });

    it("matches snapshot", () => {
        (useContestsTable as any).mockReturnValue(mockProps);
        const { container } = render(<ContestsTableContainer contestType={dummyContestType} />);
        expect(container).toMatchSnapshot();
    });
});
