import clsx from "clsx";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cellClassNames } from "../../../../common/cellClassNames";

export type ContestHeaderCellProps = {
    readonly textColor: string;
    readonly displayName: string;
    readonly linkHref: string;
    readonly onStatsButtonClick: () => void;
    readonly statsIconHref: string;
};

export const ContestHeaderCell = ({
    textColor,
    displayName,
    linkHref,
    onStatsButtonClick,
    statsIconHref,
}: ContestHeaderCellProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <td className={clsx(cellClassNames, "gap-x-1", "sticky", "left-0", "bg-base-100", "z-1")}>
            <a
                href={linkHref}
                target="_blank"
                rel="noreferrer"
                className={clsx("link link-hover truncate flex-1 text-left", textColor)}
            >
                {displayName}
            </a>
            <button onClick={onStatsButtonClick}>
                <svg
                    role="img"
                    aria-label={t("contestHeaderCell.showStatsButtonLabel")}
                    className="h-6 w-6 fill-current cursor-pointer hover:invert-30 transition-all"
                >
                    <title>{t("contestHeaderCell.showStatsButtonLabel")}</title>
                    <use href={statsIconHref} />
                </svg>
            </button>
        </td>
    );
};
