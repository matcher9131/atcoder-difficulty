import type { ReactNode } from "react";

export type ContestHeaderCellProps = {
    readonly textColor: string;
    readonly displayName: string;
    readonly linkHref: string;
};

export const ContestHeaderCell = ({
    textColor,
    displayName,
    linkHref,
}: ContestHeaderCellProps): ReactNode => {
    return (
        <div className="flex items-baseline px-3 py-6 gap-x-1">
            <span className={textColor}>◉</span>
            <a
                href={linkHref}
                target="_blank"
                rel="noreferrer"
                className="link link-hover link-primary truncate"
            >
                {displayName}
            </a>
        </div>
    );
};
