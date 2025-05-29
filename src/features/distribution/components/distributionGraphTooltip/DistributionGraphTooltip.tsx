import clsx from "clsx";
import type { ReactNode } from "react";

export type DistributionGraphTooltipProps = {
    readonly texts: {
        readonly xLabel: string;
        readonly xValue: string;
        readonly yLabel: string;
        readonly yValue: string;
    };
    readonly style: {
        readonly opacity: number;
        readonly left: number | undefined;
        readonly right: number | undefined;
        readonly top: number | undefined;
    };
};

export const DistributionGraphTooltip = ({ texts, style }: DistributionGraphTooltipProps): ReactNode => {
    const { xLabel, xValue, yLabel, yValue } = texts;
    const { opacity, left, right, top } = style;
    return (
        <table
            className={clsx(
                "absolute",
                "bg-base-100/80",
                "rounded-sm",
                "before:content-['']",
                "before:absolute",
                "before:top-1/2",
                "before:border-transparent",
                "before:border-[5px_10px]",
                "before:-translate-y-1/2",
                left != null && [
                    "ml-[12.5px]",
                    "before:left-0",
                    "before:border-r-base-100/80",
                    "before:-translate-x-full",
                ],
                right != null && [
                    "mr-[12.5px]",
                    "before:right-0",
                    "before:border-l-base-100/80",
                    "before:translate-x-full",
                ],
                left == null && right == null ? "transition-[opacity]" : "transition-[opacity,left,right,top]",
            )}
            style={{
                opacity,
                ...(left != null ? { left: `${left.toString()}px` } : {}),
                ...(right != null ? { right: `${right.toString()}px` } : {}),
                ...(top != null ? { top: `${top.toString()}px` } : {}),
            }}
        >
            <tbody>
                <tr>
                    <th className="px-2 pt-1 text-left">{`${xLabel}: `}</th>
                    <td className="px-2 pt-1 text-right">{xValue}</td>
                </tr>
                <tr>
                    <th className="px-2 pb-1 text-left">{`${yLabel}: `}</th>
                    <td className="px-2 pb-1 text-right">{yValue}</td>
                </tr>
            </tbody>
        </table>
    );
};
