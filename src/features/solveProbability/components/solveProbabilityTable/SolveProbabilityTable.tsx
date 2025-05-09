import type { ReactNode } from "react";
import type { ProblemSolveProbability } from "../../types/problemSolveProbability";
import { SolveProbabilityRowContainer } from "../solveProbabilityRow/";

export type SolveProbabilityTableProps = {
    readonly problems: readonly ProblemSolveProbability[];
};

export const SolveProbabilityTable = ({ problems }: SolveProbabilityTableProps): ReactNode => {
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
                    <SolveProbabilityRowContainer key={problem.id} problem={problem} />
                ))}
            </tbody>
        </table>
    );
};
