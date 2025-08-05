import type { ReactNode } from "react";

export type PerformanceFromScoreTableProps = {
    readonly rows: readonly ReactNode[];
};

export const PerformanceFromScoreTable = ({ rows }: PerformanceFromScoreTableProps): ReactNode => {
    return (
        <table className="w-full grid grid-cols-4">
            <thead className="contents">
                <tr className="contents">
                    <th>Score</th>
                    <th>Problem Patterns</th>
                    <th>Rank</th>
                    <th>Performance</th>
                </tr>
            </thead>
            <tbody className="contents">{rows}</tbody>
        </table>
    );
};
