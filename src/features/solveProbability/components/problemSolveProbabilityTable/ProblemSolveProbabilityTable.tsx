import type { ReactNode } from "react";
import { ProblemSolveProbabilityRowContainer } from "../problemSolveProbabilityRow";
import type { ProblemSolveProbability } from "../../types/problemSolveProbability";

export type ProblemSolveProbabilityTableProps = {
    readonly problems: readonly ProblemSolveProbability[];
};

export const ProblemSolveProbabilityTable = ({ problems }: ProblemSolveProbabilityTableProps): ReactNode => {
    return (
        <table>
            <thead>
                <th>Contest</th>
                <th>Problem</th>
                <th>Difficulty</th>
                <th>Solve Prob.</th>
            </thead>
            <tbody>
                {problems.map((problem) => (
                    <ProblemSolveProbabilityRowContainer key={problem.id} problem={problem} />
                ))}
            </tbody>
        </table>
    );
};
