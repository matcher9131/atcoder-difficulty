import type { ReactNode } from "react";
import { PerformanceFromScoreTableContainer } from "../performanceFromScoreTable";
import { RankFromPerformanceTableContainer } from "../rankFromPerformanceTable";

export const ContestStatsTab = (): ReactNode => {
    return (
        <div className="w-full p-2 tabs tabs-lift">
            <input
                type="radio"
                name="contest_stats_tab"
                className="tab"
                aria-label="Performance by Score"
                defaultChecked
            />
            <PerformanceFromScoreTableContainer />
            <input type="radio" name="contest_stats_tab" className="tab" aria-label="Rank by Performance" />
            <RankFromPerformanceTableContainer />
        </div>
    );
};
