import { Suspense, type ReactNode } from "react";
import { useDistributionGraph } from "./useDistributionGraph";
import { DistributionGraph } from "./DistributionGraph";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingIndicator } from "../../../suspense/components/loadingIndicator";
import { DistributionGraphError } from "../distributionGraphError";

export const DistributionGraphContainer = (): ReactNode => {
    const props = useDistributionGraph();
    return (
        <ErrorBoundary FallbackComponent={DistributionGraphError}>
            <Suspense fallback={<LoadingIndicator />}>
                <DistributionGraph {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};
