import type { ReactNode } from "react";

export type ContestRowProps = {
    readonly headerCell: ReactNode;
    readonly problemCells: readonly ReactNode[];
};

export const ContestRow = ({ headerCell, problemCells }: ContestRowProps): ReactNode => {
    return (
        <tr className="contents">
            {headerCell}
            {problemCells}
        </tr>
    );
};
