import type { ReactNode } from "react";

export type RankFromPerformanceTableProps = {
    readonly rows: readonly ReactNode[];
};

export const RankFromPerformanceTable = ({ rows }: RankFromPerformanceTableProps): ReactNode => {
    return (
        <table className="w-full grid grid-cols-5">
            <thead className="contents">
                <tr className="contents">
                    <th>Performance</th>
                    <th>Score</th>
                    <th>Problem Patterns</th>
                    <th>Time</th>
                    <th>Rank</th>
                </tr>
            </thead>
            <tbody className="contents">{rows}</tbody>
        </table>
    );
};
