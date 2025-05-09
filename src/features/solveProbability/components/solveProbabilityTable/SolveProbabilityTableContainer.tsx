import type { ReactNode } from "react";
import { SolveProbabilityTable } from "./SolveProbabilityTable";
import { useSolveProbabilityTable } from "./useSolveProbabilityTable";

export const SolveProbabilityTableContainer = (): ReactNode => {
    const props = useSolveProbabilityTable();
    return <SolveProbabilityTable {...props} />;
};
