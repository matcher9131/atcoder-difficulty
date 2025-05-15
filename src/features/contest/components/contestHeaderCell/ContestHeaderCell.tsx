import clsx from "clsx";
import type { ReactNode } from "react";
import { cellClassNames } from "../../../../common/cellClassNames";

export type ContestHeaderCellProps = {
    readonly textColor: string;
    readonly displayName: string;
    readonly linkHref: string;
};

export const ContestHeaderCell = ({ textColor, displayName, linkHref }: ContestHeaderCellProps): ReactNode => {
    return (
        <td className={clsx(cellClassNames, "gap-x-1")}>
            <span className={textColor}>◉</span>
            <a href={linkHref} target="_blank" rel="noreferrer" className="link link-hover link-primary truncate">
                {displayName}
            </a>
        </td>
    );
};
