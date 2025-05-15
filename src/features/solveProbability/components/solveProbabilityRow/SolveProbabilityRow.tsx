import clsx from "clsx";
import type { ReactNode } from "react";
import { cellClassNames } from "../../../../common/cellClassNames";

export type SolveProbabilityRowProps = {
    readonly contestHeaderCell: ReactNode;
    readonly problemCell: ReactNode;
    readonly difficulty: string;
    readonly solveProbability: string;
};

export const SolveProbabilityRow = ({
    contestHeaderCell,
    problemCell,
    difficulty,
    solveProbability,
}: SolveProbabilityRowProps): ReactNode => {
    return (
        <tr className="contents">
            {contestHeaderCell}
            {problemCell}
            <td className={clsx(cellClassNames, "justify-end")}>{difficulty}</td>
            <td className={clsx(cellClassNames, "justify-end")}>{solveProbability}</td>
        </tr>
    );
};
