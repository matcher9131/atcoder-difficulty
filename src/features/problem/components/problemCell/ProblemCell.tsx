import clsx from "clsx";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cellClassNames } from "../../../../common/cellClassNames";

export type ProblemCellProps = {
    readonly iconHref: string;
    readonly fillColor: string;
    readonly difficulty: string;
    readonly solveProbability: string;
    readonly displayName: string;
    readonly textColor: string;
    readonly linkHref: string;
    readonly problemIndex?: string;
    readonly graphIconHref: string;
    readonly graphButtonIsEnabled: boolean;
    readonly onGraphButtonClick: () => void;
};

export const ProblemCell = ({
    fillColor,
    iconHref,
    difficulty,
    solveProbability,
    displayName,
    textColor,
    linkHref,
    problemIndex,
    graphIconHref,
    graphButtonIsEnabled,
    onGraphButtonClick,
}: ProblemCellProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <td tabIndex={0} className={cellClassNames}>
            <span className="relative">
                <svg
                    role="img"
                    aria-label={t("problemCell.difficultyIconLabel")}
                    className={clsx("w-6", "h-4", fillColor)}
                >
                    <use href={iconHref} />
                </svg>
                {difficulty !== "" && <div className="absolute -top-4 w-6 text-center text-[.7em]">{difficulty}</div>}
                {solveProbability !== "" && (
                    <div className="absolute top-4 w-6 text-center text-[.7em]">{solveProbability}</div>
                )}
            </span>
            <a
                href={linkHref}
                target="_blank"
                rel="noreferrer"
                className={clsx(
                    "w-full",
                    "text-left",
                    "truncate",
                    textColor,
                    "link",
                    "link-hover",
                    "hover:brightness-75",
                )}
            >
                {problemIndex != null ? `${problemIndex} - ${displayName}` : displayName}
            </a>
            {graphButtonIsEnabled && (
                <button onClick={onGraphButtonClick} className="hidden group-hover:block group-focus-within:block">
                    <svg
                        role="img"
                        aria-label="Show graph"
                        className="h-6 w-6 fill-current cursor-pointer hover:invert-30 transition-all"
                    >
                        <title>{t("problemCell.graphButtonIconTitle")}</title>
                        <use href={graphIconHref} />
                    </svg>
                </button>
            )}
        </td>
    );
};
