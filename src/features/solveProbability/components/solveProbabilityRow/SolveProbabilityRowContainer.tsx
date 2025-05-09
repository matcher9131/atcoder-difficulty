import type { ReactNode } from "react";
import { useSolveProbabilityRow } from "./useSolveProbabilityRow";
import type { ProblemSolveProbability } from "../../types/problemSolveProbability";
import { SolveProbabilityRow } from "./SolveProbabilityRow";

type SolveProbabilityRowContainerProps = {
    readonly problem: ProblemSolveProbability;
};

export const SolveProbabilityRowContainer = ({ problem }: SolveProbabilityRowContainerProps): ReactNode => {
    const props = useSolveProbabilityRow(problem);
    return <SolveProbabilityRow {...props} />;
};
