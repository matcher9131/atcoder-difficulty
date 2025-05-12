import type { ReactNode } from "react";

export type SolveProbabilityRowProps = {
    readonly contestHeaderCell: ReactNode;
    readonly problemCell: ReactNode;
    readonly difficulty: string;
    readonly solveProbability: string;
};

export const SolveProbabilityRow = ({
    contestHeaderCell,
    problemCell,
    difficulty,
    solveProbability,
}: SolveProbabilityRowProps): ReactNode => {
    return (
        <tr className="contents">
            {contestHeaderCell}
            {problemCell}
            <td className="px-3 py-6 text-right">{difficulty}</td>
            <td className="px-3 py-6 text-right">{solveProbability}</td>
        </tr>
    );
};
