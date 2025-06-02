import { useAtomValue } from "jotai";
import { distributionAtom } from "../../models/distributions";
import type { DistributionGraphProps } from "./DistributionGraph";
import { selectedProblemAtom } from "../../models/selectedProblem";
import { problemSelector } from "../../../problem/dict/problems";
import { irt2pl } from "../../../solveProbability/models/functions";
import { inverseAdjustmentOfLowRating } from "../../../rating/models/functions";
import { useCallback } from "react";
import { splitProblemId } from "../../../problem/functions/split";
import { capitalize } from "../../../../utils/string";
import { useTranslation } from "react-i18next";
import type { TooltipItem } from "chart.js";

const classToDisplay = (median: number): string => {
    return `${(median - 12.5).toString()} - ${(median + 12.5).toString()}`;
};

const percentToDisplay = (percent: number): string => {
    return percent >= 99.5 ? ">99%" : percent < 0.5 ? "<1%" : `${percent.toFixed(0)}%`;
};

export const problemIdToDisplayText = (problemId: string, problemName: string): string => {
    const [contestId, innerProblemId] = splitProblemId(problemId);
    const problemIndex = capitalize(innerProblemId.substring(innerProblemId.lastIndexOf("_") + 1));
    return `${contestId.toUpperCase()} ${problemIndex} - ${problemName}`;
};

export const useDistributionGraph = (): DistributionGraphProps => {
    const { t } = useTranslation();

    const problemId = useAtomValue(selectedProblemAtom);
    const rawDistribution = useAtomValue(distributionAtom(problemId));
    const problemName = useAtomValue(problemSelector(problemId))?.n ?? "";

    const xMin = 0;
    const xMax = rawDistribution.length * 25 <= 3200 ? 3200 : Math.ceil((rawDistribution.length * 25) / 100) * 100;
    const dataLength = (xMax - xMin) / 12.5 + 1;
    const distributionData = new Array(dataLength)
        .fill(0)
        .map((_, i): { readonly x: number; readonly y: number | null } => ({
            x: i * 12.5,
            y: i % 2 == 0 ? null : (i - 1) / 2 < rawDistribution.length ? rawDistribution[(i - 1) / 2] : 0,
        }));
    const difficultyTuple = useAtomValue(problemSelector(problemId))?.d;
    const estimatedData =
        difficultyTuple != null
            ? new Array(dataLength).fill(0).map((_, i): { readonly x: number; readonly y: number | null } => ({
                  x: i * 12.5,
                  y:
                      i % 2 == 0
                          ? irt2pl(inverseAdjustmentOfLowRating(i * 12.5), difficultyTuple[0], difficultyTuple[1]) * 100
                          : null,
              }))
            : [];

    // For custom tooltip
    const tooltipCallbackTitle = useCallback((tooltipItems: TooltipItem<"bar" | "line">[]) => {
        const tooltipItem = tooltipItems[0];
        return `${t("distributionGraph.xLabel")}: ${tooltipItem.datasetIndex === 0 ? classToDisplay(tooltipItem.parsed.x) : tooltipItem.parsed.x.toString()}`;
    }, []);
    const tooltipCallbackLabel = useCallback((tooltipItem: TooltipItem<"bar" | "line">) => {
        return `${tooltipItem.dataset.label ?? ""}: ${tooltipItem.datasetIndex === 0 ? `${tooltipItem.parsed.y.toString()}%` : percentToDisplay(tooltipItem.parsed.y)}`;
    }, []);

    return {
        data: {
            datasets: [
                {
                    label: t("distributionGraph.yLabels.barDatasetLabel"),
                    data: distributionData,
                    type: "bar",
                    barPercentage: 1.8,
                    backgroundColor: "rgba(104, 96, 251, 0.7)",
                },
                {
                    label: t("distributionGraph.yLabels.lineDatasetLabel"),
                    data: estimatedData,
                    type: "line",
                    spanGaps: true,
                    cubicInterpolationMode: "monotone",
                    // styles for line
                    borderColor: "rgba(241, 54, 152, 0.8)",
                    backgroundColor: "rgba(241, 54, 152, 1)",
                    // styles for point (for legend, not visible in chart)
                    pointRadius: 0,
                    pointBorderColor: "transparent",
                    pointBackgroundColor: "rgba(241, 54, 152, 0.8)",
                    // styles for hovering point
                    pointHitRadius: 2,
                    pointHoverRadius: 4,
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
                    text: problemIdToDisplayText(problemId, problemName),
                    font: {
                        size: 20,
                    },
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        title: tooltipCallbackTitle,
                        label: tooltipCallbackLabel,
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
                        text: t("distributionGraph.xLabel"),
                        font: {
                            size: 16,
                        },
                    },
                },
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 10,
                    },
                    title: {
                        display: true,
                        text: t("distributionGraph.yLabels.axisLabel"),
                        font: {
                            size: 16,
                        },
                    },
                },
            },
        },
    };
};
