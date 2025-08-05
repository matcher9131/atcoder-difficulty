import type { ReactNode } from "react";
import { useRankFromPerformanceTable } from "./useRankFromPerformanceTable";
import { RankFromPerformanceTable } from "./RankFromPerformanceTable";

export const RankFromPerformanceTableContainer = (): ReactNode => {
    const props = useRankFromPerformanceTable();
    return <RankFromPerformanceTable {...props} />;
};
