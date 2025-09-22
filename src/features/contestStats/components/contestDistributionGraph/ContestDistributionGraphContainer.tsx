import type { ReactNode } from "react";
import { useContestDistributionGraph } from "./useContestDistributionGraph";
import { ContestDistributionGraph } from "./ContestDistributionGraph";

type ContestDistributionGraphContainerProps = {
    readonly contestId: string;
    readonly ratedDistribution: readonly number[];
    readonly unratedDistribution: readonly number[];
};

export const ContestDistributionGraphContainer = ({
    contestId,
    ratedDistribution,
    unratedDistribution,
}: ContestDistributionGraphContainerProps): ReactNode => {
    const props = useContestDistributionGraph(contestId, ratedDistribution, unratedDistribution);
    return <ContestDistributionGraph {...props} />;
};
