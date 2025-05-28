import type { ReactNode } from "react";

export type DistributionGraphTooltipProps = {
    readonly opacity: number;
    readonly xLabel: string;
    readonly xValue: string;
    readonly yLabel: string;
    readonly yValue: string;
};

export const DistributionGraphTooltip = ({
    opacity,
    xLabel,
    xValue,
    yLabel,
    yValue,
}: DistributionGraphTooltipProps): ReactNode => {
    return (
        <table className="absolute" style={{ opacity }}>
            <tbody>
                <tr>
                    <th>{`${xLabel}: `}</th>
                    <td>{xValue}</td>
                </tr>
                <tr>
                    <th>{`${yLabel}: `}</th>
                    <td>{yValue}</td>
                </tr>
            </tbody>
        </table>
    );
};
