import type { ReactNode } from "react";
import { ContestHeaderCellContainer } from "../../../contest/components/contestHeaderCell";
import { ProblemCellContainer } from "../../../problem/components/problemCell";

export type ProblemSolveProbabilityRowProps = {
    readonly contestId: string;
    readonly problemId: string;
    readonly difficulty: string;
    readonly solveProbability: string;
};

export const ProblemSolveProbabilityRow = ({
    contestId,
    problemId,
    difficulty,
    solveProbability,
}: ProblemSolveProbabilityRowProps): ReactNode => {
    return (
        <tr>
            <ContestHeaderCellContainer contestId={contestId} />
            <ProblemCellContainer problemId={problemId} />
            <td className="px-3 py-6 text-right">{difficulty}</td>
            <td className="px-3 py-6 text-right">{solveProbability}</td>
        </tr>
    );
};
