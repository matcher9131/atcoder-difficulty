import type { ReactNode } from "react";

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
            <td>{performance}</td>
            <td>{score}</td>
            <td>
                {patterns.map((pattern) => (
                    <div key={pattern}>{pattern}</div>
                ))}
            </td>
            <td>{time}</td>
            <td>{rank}</td>
        </tr>
    );
};
