import type { ReactElement } from "react";
import clsx from "clsx";

export type ContestsTableProps = {
    readonly contestsTableHeader: ReactElement;
    readonly gridColsClassName: string;
    readonly contestRows: readonly ReactElement[];
};

export const ContestsTable = ({
    contestsTableHeader,
    gridColsClassName,
    contestRows,
}: ContestsTableProps): ReactElement => {
    return (
        <table className={clsx("w-full", "grid", gridColsClassName)}>
            {contestsTableHeader}
            <tbody className="contents">{contestRows}</tbody>
        </table>
    );
};
