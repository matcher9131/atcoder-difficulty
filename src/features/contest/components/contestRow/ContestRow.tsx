import type { ReactElement, ReactNode } from "react";

export type ContestRowProps = {
    readonly headerCell: ReactElement;
    readonly problemCells: readonly ReactElement[];
};

export const ContestRow = ({ headerCell, problemCells }: ContestRowProps): ReactNode => {
    return (
        <tr className="contents">
            {headerCell}
            {problemCells}
        </tr>
    );
};
