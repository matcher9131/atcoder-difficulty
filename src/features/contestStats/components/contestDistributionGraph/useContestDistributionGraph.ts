import { useTranslation } from "react-i18next";
import type { ContestDistributionGraphProps } from "./ContestDistributionGraph";
import { useAtom } from "jotai";
import { usesLogarithmicScaleAtom } from "../../models/usesLogarithmicScale";
import { useCallback, type ChangeEvent } from "react";
import type { TooltipItem } from "chart.js";
import { createGraphDataLinear, createGraphDataLog } from "./createGraphData";
import { classToDisplay } from "../../functions/classToDisplay";

const invert = (x: number): number => {
    if (x < 1) return 0;
    return Math.round(Math.pow(2, x - 1));
};
const pass = (x: number): number => x;

export const useContestDistributionGraph = (
    contestId: string,
    ratedDistribution: readonly number[],
    unratedDistribution: readonly number[],
): ContestDistributionGraphProps => {
    const { t } = useTranslation();

    const [usesLogarithmicScale, setUsesLogarithmicScale] = useAtom(usesLogarithmicScaleAtom);
    const handleUsesLogarithmicScaleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUsesLogarithmicScale(e.target.checked);
    };

    const { ratedDistributionData, unratedDistributionData, xMin, xMax, yMin, yMax, yStep } = usesLogarithmicScale
        ? createGraphDataLog(ratedDistribution, unratedDistribution)
        : createGraphDataLinear(ratedDistribution, unratedDistribution);

    const toOriginalY = usesLogarithmicScale ? invert : pass;

    // For custom tooltip
    const tooltipCallbackTitle = useCallback(
        (tooltipItems: TooltipItem<"bar">[]) => {
            const tooltipItem = tooltipItems[0];
            return `${t("distributionGraph.xLabel")}: ${classToDisplay(tooltipItem.parsed.x)}`;
        },
        [usesLogarithmicScale],
    );
    const tooltipCallbackLabel = useCallback(
        (tooltipItem: TooltipItem<"bar">) => {
            return `${tooltipItem.dataset.label ?? ""}: ${toOriginalY(tooltipItem.parsed.y).toFixed(0)}`;
        },
        [usesLogarithmicScale],
    );
    const tooltipCallbackFooter = useCallback(
        (tooltipItems: TooltipItem<"bar">[]) => {
            const sum = tooltipItems.reduce((acc, tooltipItem) => acc + toOriginalY(tooltipItem.parsed.y), 0);
            return `${t("contestDistributionGraph.sumLabel")}: ${sum.toFixed(0)}`;
        },
        [usesLogarithmicScale],
    );
    const yTicksCallback = useCallback(
        (val: string | number) => {
            if (typeof val === "string") throw new Error("Invalid type of y-ticks");
            return toOriginalY(val);
        },
        [usesLogarithmicScale],
    );

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
            interaction: {
                intersect: false,
                mode: "index",
            },
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                },
                title: {
                    display: true,
                    text: contestId.toUpperCase(),
                    font: {
                        size: 20,
                    },
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        title: tooltipCallbackTitle,
                        label: tooltipCallbackLabel,
                        footer: tooltipCallbackFooter,
                    },
                },
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
                    stacked: !usesLogarithmicScale,
                },
                y: {
                    min: yMin,
                    max: yMax,
                    ticks: {
                        callback: yTicksCallback,
                        stepSize: yStep,
                    },
                    title: {
                        display: true,
                        text: t("contestDistributionGraph.yLabels.axisLabel"),
                        font: {
                            size: 16,
                        },
                    },
                    stacked: !usesLogarithmicScale,
                },
            },
        },
        usesLogarithmicScale,
        onUsesLogarithmicScaleChanged: handleUsesLogarithmicScaleChange,
    };
};
