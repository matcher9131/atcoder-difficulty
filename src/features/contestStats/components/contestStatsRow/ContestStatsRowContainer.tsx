import type { ReactNode } from "react";
import { ContestStatsRow } from "./ContestStatsRow";
import { useContestStatsRow } from "./useContestStatsRow";

type ContestStatsRowContainerProps = {
    readonly contestId: string;
    readonly query: { readonly performance: number } | { readonly score: number };
};

export const ContestStatsRowContainer = ({ contestId, query }: ContestStatsRowContainerProps): ReactNode => {
    const props = useContestStatsRow(contestId, query);
    return <ContestStatsRow {...props} />;
};
