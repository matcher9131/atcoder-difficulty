import type { ReactNode } from "react";

export type ContestsTableHeaderProps = {
    readonly numProblems: number;
};

export const ContestsTableHeader = ({ numProblems }: ContestsTableHeaderProps): ReactNode => {
    return (
        <thead className="contents">
            <tr className="contents">
                <th>Contest</th>
                {new Array(numProblems).fill(0).map((_, i) => (
                    <th key={i}>Problem {i + 1}</th>
                ))}
            </tr>
        </thead>
    );
};
