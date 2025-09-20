import { useTranslation } from "react-i18next";
import type { ContestDistributionGraphProps } from "./ContestDistributionGraph";
import { useAtom } from "jotai";
import { usesLogarithmicScaleAtom } from "../../models/usesLogarithmicScale";
import type { ChangeEvent } from "react";
import { range } from "../../../../utils/array";
import { roundToOneDigit } from "../../../../utils/number";

export const useContestDistributionGraph = (
    contestId: string,
    ratedDistribution: readonly number[],
    unratedDistribution: readonly number[],
): ContestDistributionGraphProps => {
    const { t } = useTranslation();

    const dataLength = Math.max(ratedDistribution.length, unratedDistribution.length);
    const ratedDistributionData: Array<{ readonly x: number; readonly y: number }> = [];
    const unratedDistributionData: Array<{ readonly x: number; readonly y: number }> = [];
    for (let i = 0; i < dataLength; ++i) {
        ratedDistributionData.push({
            x: 12.5 + i * 25,
            y: i < ratedDistribution.length ? ratedDistribution[i] : 0,
        });
        unratedDistributionData.push({
            x: 12.5 + i * 25,
            y: i < unratedDistribution.length ? unratedDistribution[i] : 0,
        });
    }

    const xMin = 0;
    const xMax =
        Math.max(ratedDistribution.length, unratedDistribution.length) * 25 <= 3200
            ? 3200
            : Math.ceil((Math.max(ratedDistribution.length, unratedDistribution.length) * 25) / 100) * 100;
    const yMin = 0;
    const rawYMax = range(0, dataLength).reduce(
        (acc, _, i) => Math.max(acc, ratedDistributionData[i].y + unratedDistributionData[i].y),
        0,
    );
    const yStep = roundToOneDigit(rawYMax / 10);
    const yMax = Math.ceil(rawYMax / yStep) * yStep;

    const [usesLogarithmicScale, setUsesLogarithmicScale] = useAtom(usesLogarithmicScaleAtom);
    const handleUsesLogarithmicScaleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUsesLogarithmicScale(e.target.checked);
    };

    return {
        data: {
            datasets: [
                {
                    label: t("contestDistributionGraph.yLabels.ratedDatasetLabel"),
                    data: ratedDistributionData,
                    type: "bar",
                    barPercentage: 1,
                    backgroundColor: "rgba(104, 96, 251, 0.7)",
                },
                {
                    label: t("contestDistributionGraph.yLabels.unratedDatasetLabel"),
                    data: unratedDistributionData,
                    type: "bar",
                    barPercentage: 1,
                    backgroundColor: "rgba(241, 54, 152, 0.8)",
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                },
                title: {
                    display: true,
                    text: contestId,
                    font: {
                        size: 20,
                    },
                },
                // tooltip: {
                //     enabled: true,
                //     callbacks: {
                //         title: tooltipCallbackTitle,
                //         label: tooltipCallbackLabel,
                //     },
                // },
            },
            scales: {
                x: {
                    type: "linear",
                    beginAtZero: true,
                    min: xMin,
                    max: xMax,
                    ticks: {
                        stepSize: 100,
                    },
                    grid: {
                        offset: false,
                    },
                    title: {
                        display: true,
                        text: t("contestDistributionGraph.xLabel"),
                        font: {
                            size: 16,
                        },
                    },
                    stacked: true,
                },
                y: {
                    min: yMin,
                    max: yMax,
                    ticks: {
                        stepSize: yStep,
                    },
                    title: {
                        display: true,
                        text: t("contestDistributionGraph.yLabels.axisLabel"),
                        font: {
                            size: 16,
                        },
                    },
                    stacked: true,
                },
            },
        },
        usesLogarithmicScale,
        onUsesLogarithmicScaleChanged: handleUsesLogarithmicScaleChange,
    };
};
