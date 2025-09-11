import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContestRow } from "./ContestRow";

describe("ContestRow", () => {
    it("renders a <tr> with class 'contents'", () => {
        render(
            <table>
                <tbody>
                    <ContestRow
                        headerCell={<td data-testid="header-cell">Header</td>}
                        problemCells={[
                            <td key="1" data-testid="problem-cell-1">
                                Problem 1
                            </td>,
                            <td key="2" data-testid="problem-cell-2">
                                Problem 2
                            </td>,
                        ]}
                    />
                </tbody>
            </table>,
        );
        const tr = screen.getByRole("row");
        expect(tr).toHaveClass("contents");
    });

    it("renders the headerCell", () => {
        render(
            <table>
                <tbody>
                    <ContestRow headerCell={<td data-testid="header-cell">Header</td>} problemCells={[]} />
                </tbody>
            </table>,
        );
        expect(screen.getByTestId("header-cell")).toBeInTheDocument();
        expect(screen.getByTestId("header-cell")).toHaveTextContent("Header");
    });

    it("renders all problemCells", () => {
        render(
            <table>
                <tbody>
                    <ContestRow
                        headerCell={<td data-testid="header-cell">Header</td>}
                        problemCells={[
                            <td key="1" data-testid="problem-cell-1">
                                Problem 1
                            </td>,
                            <td key="2" data-testid="problem-cell-2">
                                Problem 2
                            </td>,
                        ]}
                    />
                </tbody>
            </table>,
        );
        expect(screen.getByTestId("problem-cell-1")).toBeInTheDocument();
        expect(screen.getByTestId("problem-cell-2")).toBeInTheDocument();
    });

    it("renders children in correct order", () => {
        render(
            <table>
                <tbody>
                    <ContestRow
                        headerCell={<td data-testid="header-cell">Header</td>}
                        problemCells={[
                            <td key="1" data-testid="problem-cell-1">
                                Problem 1
                            </td>,
                            <td key="2" data-testid="problem-cell-2">
                                Problem 2
                            </td>,
                        ]}
                    />
                </tbody>
            </table>,
        );
        const tr = screen.getByRole("row");
        const children = Array.from(tr.children);
        expect(children[0]).toHaveAttribute("data-testid", "header-cell");
        expect(children[1]).toHaveAttribute("data-testid", "problem-cell-1");
        expect(children[2]).toHaveAttribute("data-testid", "problem-cell-2");
    });

    it("matches snapshot", () => {
        const { container } = render(
            <table>
                <tbody>
                    <ContestRow
                        headerCell={<td>Header</td>}
                        problemCells={[<td key="1">Problem 1</td>, <td key="2">Problem 2</td>]}
                    />
                </tbody>
            </table>,
        );
        expect(container).toMatchSnapshot();
    });

    it("renders correctly with empty problemCells", () => {
        render(
            <table>
                <tbody>
                    <ContestRow headerCell={<td data-testid="header-cell">Header</td>} problemCells={[]} />
                </tbody>
            </table>,
        );
        expect(screen.getByTestId("header-cell")).toBeInTheDocument();
    });
});
