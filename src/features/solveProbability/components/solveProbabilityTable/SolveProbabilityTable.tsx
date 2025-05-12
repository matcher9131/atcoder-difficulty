import type { ReactNode } from "react";

export type SolveProbabilityTableProps = {
    readonly rows: readonly ReactNode[];
};

export const SolveProbabilityTable = ({ rows }: SolveProbabilityTableProps): ReactNode => {
    return (
        <table className="grid grid-cols-4">
            <thead className="contents">
                <tr className="contents">
                    <th>Contest</th>
                    <th>Problem</th>
                    <th>Difficulty</th>
                    <th>Solve Probability</th>
                </tr>
            </thead>
            <tbody className="contents">{rows}</tbody>
        </table>
    );
};
