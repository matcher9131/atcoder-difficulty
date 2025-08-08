import clsx from "clsx";
import type { ReactNode } from "react";
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
    return (
        <td className={clsx(cellClassNames, "gap-x-1")}>
            <span className={textColor}>◉</span>
            <a href={linkHref} target="_blank" rel="noreferrer" className="link link-hover link-primary truncate">
                {displayName}
            </a>
            <button onClick={onStatsButtonClick} className="hidden group-hover:block group-focus-within:block">
                <svg
                    role="img"
                    aria-label="Show graph"
                    className="h-6 w-6 fill-current cursor-pointer hover:invert-30 transition-all"
                >
                    <title>Show stats</title>
                    <use href={statsIconHref} />
                </svg>
            </button>
        </td>
    );
};
