import type { ReactNode } from "react";
import { SolveProbabilityTabContent } from "./SolveProbabilityTabContent";
import { useSolveProbabilityTabContent } from "./useSolveProbabilityTabContent";

export const SolveProbabilityTabContentContainer = (): ReactNode => {
    const props = useSolveProbabilityTabContent();
    return <SolveProbabilityTabContent {...props} />;
};
