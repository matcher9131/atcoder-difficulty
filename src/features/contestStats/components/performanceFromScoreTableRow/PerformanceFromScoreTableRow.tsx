import type { ReactNode } from "react";

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
            <td>{score}</td>
            <td>
                {patterns.map((pattern) => (
                    <div key={pattern}>{pattern}</div>
                ))}
            </td>
            <td>{rank}</td>
            <td>{performance}</td>
        </tr>
    );
};
