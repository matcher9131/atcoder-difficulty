import type { ReactNode } from "react";

export type ContestRowProps = {
    readonly numProblems: number;
    readonly headerCell: ReactNode;
    readonly problemCells: readonly ReactNode[];
};

export const ContestRow = ({
    numProblems,
    headerCell,
    problemCells,
}: ContestRowProps): ReactNode => {
    const blankCells = new Array(numProblems - problemCells.length)
        .fill(0)
        .map((_, i) => <td key={`${i}`}></td>);
    return (
        <tr>
            {headerCell}
            {problemCells}
            {blankCells}
        </tr>
    );
};
