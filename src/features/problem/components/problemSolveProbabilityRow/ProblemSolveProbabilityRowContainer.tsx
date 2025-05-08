import type { ReactNode } from "react";
import { useProblemSolveProbabilityRow } from "./useProblemSolveProbabilityRow";
import type { ProblemSolveProbability } from "../../types/problemSolveProbability";
import { ProblemSolveProbabilityRow } from "./ProblemSolveProbabilityRow";

type ProblemSolveProbabilityRowContainerProps = {
    readonly problem: ProblemSolveProbability;
};

export const ProblemSolveProbabilityRowContainer = ({
    problem,
}: ProblemSolveProbabilityRowContainerProps): ReactNode => {
    const props = useProblemSolveProbabilityRow(problem);
    return <ProblemSolveProbabilityRow {...props} />;
};
