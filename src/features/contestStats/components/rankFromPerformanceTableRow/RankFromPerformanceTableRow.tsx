import type { ReactNode } from "react";
import { tableCellClassName } from "../../const";
import clsx from "clsx";

export type RankFromPerformanceTableRowProps = {
    readonly performance: ReactNode;
    readonly score: number;
    readonly patterns: readonly string[];
    readonly time: string;
    readonly rank: number;
};

export const RankFromPerformanceTableRow = ({
    performance,
    score,
    patterns,
    time,
    rank,
}: RankFromPerformanceTableRowProps): ReactNode => {
    return (
        <tr className="contents">
            <td className={tableCellClassName}>{performance}</td>
            <td className={tableCellClassName}>{score}</td>
            <td className={clsx(tableCellClassName, "flex-col", "text-xs")}>
                {patterns.map((pattern) => (
                    <div key={pattern}>{pattern}</div>
                ))}
            </td>
            <td className={tableCellClassName}>{time}</td>
            <td className={tableCellClassName}>{rank}</td>
        </tr>
    );
};
