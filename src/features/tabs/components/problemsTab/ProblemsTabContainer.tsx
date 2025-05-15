import type { ReactNode } from "react";
import { useProblemTab } from "./useProblemsTab";
import { ProblemsTab } from "./ProblemsTab";

export const ProblemsTabContainer = (): ReactNode => {
    const props = useProblemTab();
    return <ProblemsTab {...props} />;
};
