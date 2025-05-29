import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { headerCellClassNames } from "../../../../common/headerCellClassNames";

export type SolveProbabilityTableProps = {
    readonly rows: readonly ReactNode[];
};

export const SolveProbabilityTable = ({ rows }: SolveProbabilityTableProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <table className="grid grid-cols-5">
            <thead className="contents">
                <tr className="contents">
                    <th className={headerCellClassNames}>{t("sovleProbabilityTableHeader.contestLabel")}</th>
                    <th className={headerCellClassNames}>{t("sovleProbabilityTableHeader.problemLabel")}</th>
                    <th className={headerCellClassNames}>{t("sovleProbabilityTableHeader.difficultyLabel")}</th>
                    <th className={headerCellClassNames}>{t("sovleProbabilityTableHeader.solveProbabilityLabel")}</th>
                    <th className={headerCellClassNames}>{t("sovleProbabilityTableHeader.graphLabel")}</th>
                </tr>
            </thead>
            <tbody className="contents">{rows}</tbody>
        </table>
    );
};
