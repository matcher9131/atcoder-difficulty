import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    BarController,
    LineController,
} from "chart.js";
import { Suspense, type ReactNode } from "react";
import { Chart } from "react-chartjs-2";
import type { DistributionGraphData } from "../../types/distributionGraphData";
import type { DistributionGraphOptions } from "../../types/distributionGraphOptions";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, BarController, LineController);

export type DistributionGraphProps = {
    readonly data: DistributionGraphData;
    readonly options: DistributionGraphOptions;
};

export const DistributionGraph = ({ data, options }: DistributionGraphProps): ReactNode => {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <div className="w-4/5 h-4/5">
                <Chart type="bar" data={data} options={options} />
            </div>
        </Suspense>
    );
};
