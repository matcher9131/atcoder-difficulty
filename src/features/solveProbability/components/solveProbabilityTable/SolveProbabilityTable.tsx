import type { ReactNode } from "react";
import type { ProblemSolveProbability } from "../../types/problemSolveProbability";
import { SolveProbabilityRowContainer } from "../solveProbabilityRow/";

export type SolveProbabilityTableProps = {
    readonly problems: readonly ProblemSolveProbability[];
};

export const SolveProbabilityTable = ({ problems }: SolveProbabilityTableProps): ReactNode => {
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
            <tbody className="contents">
                {problems.map((problem) => (
                    <SolveProbabilityRowContainer key={problem.id} problem={problem} />
                ))}
            </tbody>
        </table>
    );
};
