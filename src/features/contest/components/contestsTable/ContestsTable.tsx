import type { ReactNode } from "react";
import { ContestsTableHeader } from "../contestsTableHeader";
import clsx from "clsx";

export type ContestsTableProps = {
    readonly numProblems: number;
    readonly gridColsClassName: string;
    readonly contestRows: readonly ReactNode[];
};

export const ContestsTable = ({ numProblems, gridColsClassName, contestRows }: ContestsTableProps): ReactNode => {
    return (
        <table className={clsx("w-full", "grid", gridColsClassName)}>
            <ContestsTableHeader numProblems={numProblems} />
            <tbody className="contents">{contestRows}</tbody>
        </table>
    );
};
