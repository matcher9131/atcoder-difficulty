import type { ReactNode } from "react";
import { useDistributionGraph } from "./useDistributionGraph";
import { DistributionGraph } from "./DistributionGraph";

export const DistributionGraphContainer = (): ReactNode => {
    const props = useDistributionGraph();
    return <DistributionGraph {...props} />;
};
