import type { ReactNode } from "react";

export type ContestStatsRowProps = {
    readonly score: number;
    readonly problemPatterns: readonly string[];
    readonly helpIconHref: string;
    readonly time: string;
    readonly rank: number;
    readonly performanceWithIcon: ReactNode;
};

export const ContestStatsRow = ({
    score,
    problemPatterns,
    helpIconHref,
    time,
    rank,
    performanceWithIcon,
}: ContestStatsRowProps): ReactNode => {
    return (
        <tr className="contents">
            <td
                tabIndex={0}
                className="flex px-3 py-auto min-h-20 items-center border-t-1 border-base-content/75 group"
            >
                <div>{score}</div>
                <div className="tooltip">
                    <div className="tooltip-content flex">
                        {problemPatterns.map((pattern) => (
                            <div key={pattern}>{pattern}</div>
                        ))}
                    </div>
                    <button className="hidden group-hover:block group-focus-within:block">
                        <svg
                            role="img"
                            aria-label="Task patterns"
                            className="h-6 w-6 fill-current cursor-pointer hover:invert-30 transition-all"
                        >
                            <use href={helpIconHref} />
                        </svg>
                    </button>
                </div>
            </td>
            <td>{time}</td>
            <td>{rank.toString()}</td>
            <td>{performanceWithIcon}</td>
        </tr>
    );
};
