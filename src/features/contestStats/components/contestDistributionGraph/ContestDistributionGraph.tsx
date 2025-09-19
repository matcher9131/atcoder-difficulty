import { type ChartData, type ChartOptions } from "chart.js";
import type { ChangeEventHandler, ReactNode } from "react";
import { Chart } from "react-chartjs-2";
import { chartAreaBackgroundPlugin } from "../../../../chartjs/plugin";
import { useTranslation } from "react-i18next";

const plugins = [chartAreaBackgroundPlugin];

export type ContestDistributionGraphProps = {
    readonly data: ChartData<"bar", Array<{ readonly x: number; readonly y: number | null }>>;
    readonly options: ChartOptions<"bar">;
    readonly usesLogarithmicScale: boolean;
    readonly onUsesLogarithmicScaleChanged: ChangeEventHandler<HTMLInputElement>;
};

export const ContestDistributionGraph = ({
    data,
    options,
    usesLogarithmicScale,
    onUsesLogarithmicScaleChanged,
}: ContestDistributionGraphProps): ReactNode => {
    const { t } = useTranslation();

    return (
        <div className="w-full h-full">
            <Chart type="bar" data={data} options={options} plugins={plugins} />
            <label className="label">
                <input
                    type="checkbox"
                    checked={usesLogarithmicScale}
                    onChange={onUsesLogarithmicScaleChanged}
                    className="checkbox"
                />
                {t("contestDistributionGraph.usesLogarithmicScaleLabel")}
            </label>
        </div>
    );
};
