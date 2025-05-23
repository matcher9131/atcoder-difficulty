import type { ReactNode } from "react";
import type { DistributionGraphData } from "../../types/distributionGraphData";
import type { DistributionGraphOptions } from "../../types/distributionGraphOptions";
import { Chart } from "react-chartjs-2";

export type DistributionGraphProps = {
    readonly data: DistributionGraphData;
    readonly options: DistributionGraphOptions;
};

export const DistributionGraph = ({ data, options }: DistributionGraphProps): ReactNode => {
    return (
        <div>
            <Chart type="bar" data={data} options={options} />
        </div>
    );
};
