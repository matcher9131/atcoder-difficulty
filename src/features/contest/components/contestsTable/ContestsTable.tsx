import type { ReactNode } from "react";
import { ContestsTableHeader } from "../contestsTableHeader";

export type ContestsTableProps = {
    readonly numProblems: number;
    readonly contestRows: readonly ReactNode[];
};

export const ContestsTable = ({ numProblems, contestRows }: ContestsTableProps): ReactNode => {
    return (
        <table className="w-full grid grid-cols-9">
            <ContestsTableHeader numProblems={numProblems} />
            <tbody className="contents">{contestRows}</tbody>
        </table>
    );
};
