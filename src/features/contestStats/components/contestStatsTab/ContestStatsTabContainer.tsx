import type { ReactNode } from "react";
import { ContestStatsTab } from "./ContestStatsTab";
import { useContestStatsTab } from "./useContestStatTab";
import { LoadingIndicator } from "../../../suspense/components/loadingIndicator";
import { ContestStatsError } from "../contestStatsError";

export const ContestStatsTabContainer = (): ReactNode => {
    const props = useContestStatsTab();

    if (props === "hasError") return <ContestStatsError />;
    if (props === "loading") return <LoadingIndicator />;
    return <ContestStatsTab {...props} />;
};
