import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PerformanceFromScoreTableContainer } from "../performanceFromScoreTable";
import { RankFromPerformanceTableContainer } from "../rankFromPerformanceTable";

export const ContestStatsTab = (): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="w-full p-2 tabs tabs-lift">
            <input
                type="radio"
                name="contest_stats_tab"
                className="tab"
                aria-label={t("contestStatsDialog.performanceByScoreLabel")}
                defaultChecked
            />
            <div className="tab-content bg-base-100 border-base-300 p-4 w-full text-center">
                <PerformanceFromScoreTableContainer />
            </div>
            <input
                type="radio"
                name="contest_stats_tab"
                className="tab"
                aria-label={t("contestStatsDialog.rankByPerformanceLabel")}
            />
            <div className="tab-content bg-base-100 border-base-300 p-4 w-full text-center">
                <RankFromPerformanceTableContainer />
            </div>
        </div>
    );
};
