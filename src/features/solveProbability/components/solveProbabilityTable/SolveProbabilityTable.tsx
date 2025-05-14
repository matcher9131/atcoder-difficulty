import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type SolveProbabilityTableProps = {
    readonly rows: readonly ReactNode[];
};

export const SolveProbabilityTable = ({ rows }: SolveProbabilityTableProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <table className="grid grid-cols-4">
            <thead className="contents">
                <tr className="contents">
                    <th>{t("sovleProbabilityTableHeader.contestLabel")}</th>
                    <th>{t("sovleProbabilityTableHeader.problemLabel")}</th>
                    <th>{t("sovleProbabilityTableHeader.difficultyLabel")}</th>
                    <th>{t("sovleProbabilityTableHeader.solveProbabilityLabel")}</th>
                </tr>
            </thead>
            <tbody className="contents">{rows}</tbody>
        </table>
    );
};
