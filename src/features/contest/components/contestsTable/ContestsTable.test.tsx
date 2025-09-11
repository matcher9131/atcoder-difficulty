import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../../../vitest/render";
import { ContestsTable } from "./ContestsTable";

// src/features/contest/components/contestsTable/ContestsTable.test.tsx

describe("ContestsTable", () => {
    const mockHeader = (
        <thead data-testid="table-header">
            <tr>
                <th>Header</th>
            </tr>
        </thead>
    );
    const mockRows = [
        <tr key="row1" data-testid="contest-row">
            <td>Row 1</td>
        </tr>,
        <tr key="row2" data-testid="contest-row">
            <td>Row 2</td>
        </tr>,
    ];
    const gridColsClassName = "grid-cols-3";

    it("renders table with correct class names", () => {
        const { container } = render(
            <ContestsTable
                contestsTableHeader={mockHeader}
                gridColsClassName={gridColsClassName}
                contestRows={mockRows}
            />,
        );
        const table = container.querySelector("table");
        expect(table).toBeTruthy();
        expect(table?.className).toContain("w-full");
        expect(table?.className).toContain("grid");
        expect(table?.className).toContain(gridColsClassName);
    });

    it("renders contestsTableHeader", () => {
        render(
            <ContestsTable
                contestsTableHeader={mockHeader}
                gridColsClassName={gridColsClassName}
                contestRows={mockRows}
            />,
        );
        expect(screen.getByTestId("table-header")).toBeInTheDocument();
    });

    it("renders contestRows inside tbody", () => {
        render(
            <ContestsTable
                contestsTableHeader={mockHeader}
                gridColsClassName={gridColsClassName}
                contestRows={mockRows}
            />,
        );
        const rowgroups = screen.getAllByRole("rowgroup");
        // tbody is usually the second rowgroup (after thead)
        const tbody = rowgroups[1];
        expect(tbody).toBeInTheDocument();
        expect(tbody.className).toContain("contents");
        const rows = screen.getAllByTestId("contest-row");
        expect(rows).toHaveLength(2);
        expect(rows[0]).toHaveTextContent("Row 1");
        expect(rows[1]).toHaveTextContent("Row 2");
    });

    it("matches snapshot", () => {
        const { container } = render(
            <ContestsTable
                contestsTableHeader={mockHeader}
                gridColsClassName={gridColsClassName}
                contestRows={mockRows}
            />,
        );
        expect(container).toMatchSnapshot();
    });
});
