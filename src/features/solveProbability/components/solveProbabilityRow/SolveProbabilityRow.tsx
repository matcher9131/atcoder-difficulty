import type { ReactNode } from "react";
import { ContestHeaderCellContainer } from "../../../contest/components/contestHeaderCell";
import { ProblemCellContainer } from "../../../problem/components/problemCell";

export type SolveProbabilityRowProps = {
    readonly contestId: string;
    readonly problemId: string;
    readonly difficulty: string;
    readonly solveProbability: string;
};

export const SolveProbabilityRow = ({
    contestId,
    problemId,
    difficulty,
    solveProbability,
}: SolveProbabilityRowProps): ReactNode => {
    return (
        <tr className="contents">
            <ContestHeaderCellContainer contestId={contestId} />
            <ProblemCellContainer problemId={problemId} />
            <td className="px-3 py-6 text-right">{difficulty}</td>
            <td className="px-3 py-6 text-right">{solveProbability}</td>
        </tr>
    );
};
