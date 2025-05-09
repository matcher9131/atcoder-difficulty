import type { ReactNode } from "react";
import { ProblemSolveProbabilityTable } from "./ProblemSolveProbabilityTable";
import { useProblemSolveProbabilityTable } from "./useProblemSolveProbabilityTable";

export const ProblemSolveProbabilityTableContainer = (): ReactNode => {
    const props = useProblemSolveProbabilityTable();
    return <ProblemSolveProbabilityTable {...props} />;
};
