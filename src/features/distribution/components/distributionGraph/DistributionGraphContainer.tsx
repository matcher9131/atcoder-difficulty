import { type ReactNode } from "react";
import { useDistributionGraph } from "./useDistributionGraph";
import { DistributionGraph } from "./DistributionGraph";
import { LoadingIndicator } from "../../../suspense/components/loadingIndicator";
import { DistributionGraphError } from "../distributionGraphError";

export const DistributionGraphContainer = (): ReactNode => {
    const props = useDistributionGraph();

    if (props === "hasError") return <DistributionGraphError />;
    if (props === "loading") return <LoadingIndicator />;
    return <DistributionGraph {...props} />;
};
