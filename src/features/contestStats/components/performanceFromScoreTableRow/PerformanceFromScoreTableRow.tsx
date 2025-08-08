import type { ReactNode } from "react";
import { tableCellClassName } from "../../const";
import clsx from "clsx";

export type PerformanceFromScoreTableRowProps = {
    readonly score: number;
    readonly patterns: readonly string[];
    readonly rank: number;
    readonly performance: ReactNode;
};

export const PerformanceFromScoreTableRow = ({
    score,
    patterns,
    rank,
    performance,
}: PerformanceFromScoreTableRowProps): ReactNode => {
    return (
        <tr className="contents">
            <td className={tableCellClassName}>{score}</td>
            <td className={clsx(tableCellClassName, "flex-col", "text-xs")}>
                {patterns.map((pattern) => (
                    <div key={pattern}>{pattern}</div>
                ))}
            </td>
            <td className={tableCellClassName}>{rank}</td>
            <td className={tableCellClassName}>{performance}</td>
        </tr>
    );
};
