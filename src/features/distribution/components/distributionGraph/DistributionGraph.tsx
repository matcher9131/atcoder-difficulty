import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    BarController,
    LineController,
    Tooltip,
    type ChartData,
    type ChartOptions,
} from "chart.js";
import { Suspense, type ReactNode } from "react";
import { Chart } from "react-chartjs-2";
import { chartAreaBackgroundPlugin } from "./plugin";
import {
    DistributionGraphTooltip,
    type DistributionGraphTooltipProps,
} from "../distributionGraphTooltip/DistributionGraphTooltip";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    BarController,
    LineController,
    Tooltip,
);

const plugins = [chartAreaBackgroundPlugin];

export type DistributionGraphProps = {
    readonly data: ChartData<"bar" | "line", Array<{ readonly x: number; readonly y: number | null }>>;
    readonly options: ChartOptions<"bar" | "line">;
    readonly tooltipStyle: DistributionGraphTooltipProps["style"];
    readonly tooltipTexts: DistributionGraphTooltipProps["texts"];
};

export const DistributionGraph = ({ data, options, tooltipStyle, tooltipTexts }: DistributionGraphProps): ReactNode => {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <Chart type="line" data={data} options={options} plugins={plugins} />
            <DistributionGraphTooltip style={tooltipStyle} texts={tooltipTexts} />
        </Suspense>
    );
};
