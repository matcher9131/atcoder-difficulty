import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type PerformanceFromScoreTableProps = {
    readonly rows: readonly ReactNode[];
};

export const PerformanceFromScoreTable = ({ rows }: PerformanceFromScoreTableProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <table className="w-full grid grid-cols-4">
            <thead className="contents">
                <tr className="contents">
                    <th>{t("contestStatsDialog.scoreLabel")}</th>
                    <th>{t("contestStatsDialog.problemPatternsLabel")}</th>
                    <th>{t("contestStatsDialog.rankLabel")}</th>
                    <th>{t("contestStatsDialog.performanceLabel")}</th>
                </tr>
            </thead>
            <tbody className="contents">{rows}</tbody>
        </table>
    );
};
