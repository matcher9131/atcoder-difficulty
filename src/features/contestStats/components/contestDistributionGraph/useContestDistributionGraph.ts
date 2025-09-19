import { useTranslation } from "react-i18next";
import type { ContestDistributionGraphProps } from "./ContestDistributionGraph";
import { useAtom } from "jotai";
import { usesLogarithmicScaleAtom } from "../../models/usesLogarithmicScale";
import type { ChangeEvent } from "react";

export const useContestDistributionGraph = (
    contestId: string,
    ratedDistribution: readonly number[],
    unratedDistribution: readonly number[],
): ContestDistributionGraphProps => {
    const { t } = useTranslation();

    const ratedDistributionData = ratedDistribution.map((val, i) => ({
        x: 12.5 + i * 25,
        y: val,
    }));
    const unratedDistributionData = unratedDistribution.map((val, i) => ({
        x: 12.5 + i * 25,
        y: val,
    }));
    const xMin = 0;
    const xMax =
        Math.max(ratedDistribution.length, unratedDistribution.length) * 25 <= 3200
            ? 3200
            : Math.ceil((Math.max(ratedDistribution.length, unratedDistribution.length) * 25) / 100) * 100;
    const yMin = 0;
    // TODO: 要調整
    const yMax = Math.max(...ratedDistribution, ...unratedDistribution);

    const [usesLogarithmicScale, setUsesLogarithmicScale] = useAtom(usesLogarithmicScaleAtom);
    const handleUsesLogarithmicScaleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUsesLogarithmicScale(e.target.checked);
    };

    // TODO: バーを横並びではなく縦に積みたい
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
                },
                y: {
                    min: yMin,
                    max: yMax,
                    ticks: {
                        // TODO: 要調整
                        stepSize: 100,
                    },
                    title: {
                        display: true,
                        text: t("contestDistributionGraph.yLabels.axisLabel"),
                        font: {
                            size: 16,
                        },
                    },
                },
            },
        },
        usesLogarithmicScale,
        onUsesLogarithmicScaleChanged: handleUsesLogarithmicScaleChange,
    };
};
