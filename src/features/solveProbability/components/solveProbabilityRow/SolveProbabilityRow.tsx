import clsx from "clsx";
import type { ReactNode } from "react";
import { cellClassNames } from "../../../../common/cellClassNames";
import { useTranslation } from "react-i18next";

export type SolveProbabilityRowProps = {
    readonly contestHeaderCell: ReactNode;
    readonly problemCell: ReactNode;
    readonly difficulty: string;
    readonly solveProbability: string;
    readonly onGraphButtonClick: () => void;
};

export const SolveProbabilityRow = ({
    contestHeaderCell,
    problemCell,
    difficulty,
    solveProbability,
    onGraphButtonClick,
}: SolveProbabilityRowProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <tr className="contents">
            {contestHeaderCell}
            {problemCell}
            <td className={clsx(cellClassNames, "justify-end")}>{difficulty}</td>
            <td className={clsx(cellClassNames, "justify-end")}>{solveProbability}</td>
            <td className={clsx(cellClassNames, "justify-center")}>
                <button className="btn" onClick={onGraphButtonClick}>
                    {t("solveProbabilityTableContent.showGraphButtonLabel")}
                </button>
            </td>
        </tr>
    );
};
