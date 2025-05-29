import clsx from "clsx";
import type { ReactNode } from "react";
import { cellClassNames } from "../../../../common/cellClassNames";

export type SolveProbabilityRowProps = {
    readonly contestHeaderCell: ReactNode;
    readonly problemCell: ReactNode;
    readonly difficulty: string;
    readonly solveProbability: string;
    readonly onGraphButtonClick: () => void;
};

export const SolveProbabilityRow = ({
    contestHeaderCell,
    problemCell,
    difficulty,
    solveProbability,
    onGraphButtonClick,
}: SolveProbabilityRowProps): ReactNode => {
    return (
        <tr className="contents">
            {contestHeaderCell}
            {problemCell}
            <td className={clsx(cellClassNames, "justify-end")}>{difficulty}</td>
            <td className={clsx(cellClassNames, "justify-end")}>{solveProbability}</td>
            <td className={clsx(cellClassNames, "justify-center")}>
                <button className="btn" onClick={onGraphButtonClick}>
                    Show
                </button>
            </td>
        </tr>
    );
};
