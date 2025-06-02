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
    Title,
    Legend,
} from "chart.js";
import { type ReactNode } from "react";
import { Chart } from "react-chartjs-2";
import { chartAreaBackgroundPlugin } from "./plugin";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    BarController,
    LineController,
    Title,
    Legend,
    Tooltip,
);

const plugins = [chartAreaBackgroundPlugin];

export type DistributionGraphProps = {
    readonly data: ChartData<"bar" | "line", Array<{ readonly x: number; readonly y: number | null }>>;
    readonly options: ChartOptions<"bar" | "line">;
};

export const DistributionGraph = ({ data, options }: DistributionGraphProps): ReactNode => {
    return <Chart type="line" data={data} options={options} plugins={plugins} />;
};
