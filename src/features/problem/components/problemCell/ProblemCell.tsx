import clsx from "clsx";
import type { ReactNode } from "react";

export type ProblemCellProps = {
    readonly iconHref: string;
    readonly fillColor: string;
    readonly difficulty: number;
    readonly displayName: string;
    readonly textColor: string;
    readonly linkHref: string;
};

export const ProblemCell = ({
    fillColor,
    iconHref,
    difficulty,
    displayName,
    textColor,
    linkHref,
}: ProblemCellProps): ReactNode => {
    return (
        <td className="flex items-baseline px-3 py-6 gap-x-1">
            <span className="relative">
                <svg
                    role="img"
                    aria-label="難易度アイコン"
                    className={clsx("w-6", "h-4", fillColor)}
                >
                    <use href={iconHref} />
                </svg>
                <div className="absolute top-4 w-6 text-center text-[.5em]">
                    {difficulty}
                </div>
            </span>
            <a
                href={linkHref}
                target="_blank"
                rel="noreferrer"
                className={clsx("truncate", textColor)}
            >
                {displayName}
            </a>
        </td>
    );
};
