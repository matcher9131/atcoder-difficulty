import type { ReactNode } from "react";
import clsx from "clsx";

export type ContestsTableProps = {
    readonly contestsTableHeader: ReactNode;
    readonly gridColsClassName: string;
    readonly contestRows: readonly ReactNode[];
};

export const ContestsTable = ({
    contestsTableHeader,
    gridColsClassName,
    contestRows,
}: ContestsTableProps): ReactNode => {
    return (
        <table className={clsx("w-full", "grid", gridColsClassName)}>
            {contestsTableHeader}
            <tbody className="contents">{contestRows}</tbody>
        </table>
    );
};
