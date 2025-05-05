import type { ReactNode } from "react";
import { ContestsTableHeader } from "../contestsTableHeader";

export type ContestsTableProps = {
    readonly numProblems: number;
    readonly contestRows: readonly ReactNode[];
};

export const ContestsTable = ({ numProblems, contestRows }: ContestsTableProps): ReactNode => {
    return (
        <table className="w-full table-fixed">
            <ContestsTableHeader numProblems={numProblems} />
            <tbody>{contestRows}</tbody>
        </table>
    );
};
