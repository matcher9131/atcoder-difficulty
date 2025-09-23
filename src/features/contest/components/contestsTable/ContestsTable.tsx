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
        <div className="w-full overflow-x-auto">
            <table className={clsx("grid", gridColsClassName)}>
                {contestsTableHeader}
                <tbody className="contents">{contestRows}</tbody>
            </table>
        </div>
    );
};
