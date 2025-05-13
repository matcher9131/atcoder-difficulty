import clsx from "clsx";
import type { ReactNode } from "react";

export type ProblemCellProps = {
    readonly iconHref: string;
    readonly fillColor: string;
    readonly difficulty: string;
    readonly solveProbability: string;
    readonly displayName: string;
    readonly textColor: string;
    readonly linkHref: string;
    readonly problemIndex?: string;
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
}: ProblemCellProps): ReactNode => {
    return (
        <td className="flex px-3 py-6 items-baseline">
            <span className="relative">
                <svg role="img" aria-label="難易度アイコン" className={clsx("w-6", "h-4", fillColor)}>
                    <use href={iconHref} />
                </svg>
                {difficulty !== "" && <div className="absolute -top-4 w-6 text-center text-[.7em]">{difficulty}</div>}
                {solveProbability !== "" && (
                    <div className="absolute top-4 w-6 text-center text-[.7em]">{solveProbability}</div>
                )}
            </span>
            <a href={linkHref} target="_blank" rel="noreferrer" className={clsx("truncate", textColor)}>
                {problemIndex != null ? `${problemIndex} - ${displayName}` : displayName}
            </a>
        </td>
    );
};
